import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildVectorContext } from "../utils/aiVectorSearch.js";

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const normalizeHistory = (history = "[]") => {
  if (Array.isArray(history)) return history;

  try {
    const parsed = JSON.parse(history);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const buildSources = (groundingMetadata) => {
  const chunks = groundingMetadata?.groundingChunks || [];

  return chunks
    .map((chunk) => chunk.web)
    .filter((web) => web?.uri)
    .map((web) => ({
      title: web.title || web.uri,
      url: web.uri,
    }));
};

const REFERENCE_STOP_WORDS = new Set([
  "about",
  "answer",
  "asked",
  "chapter",
  "define",
  "diagram",
  "doubt",
  "explain",
  "from",
  "give",
  "help",
  "important",
  "make",
  "material",
  "notes",
  "please",
  "question",
  "questions",
  "reference",
  "references",
  "solve",
  "study",
  "summarize",
  "tell",
  "this",
  "topic",
  "what",
  "with",
]);

const buildReferenceTopic = (message = "") => {
  const words = String(message)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !REFERENCE_STOP_WORDS.has(word));

  const uniqueWords = [...new Set(words)].slice(0, 7);
  return uniqueWords.join(" ").trim() || "college engineering study material";
};

const buildReferenceSources = (message = "") => {
  const topic = buildReferenceTopic(message);
  const encodedTopic = encodeURIComponent(topic);

  return [
    {
      title: `Google Search: ${topic}`,
      url: `https://www.google.com/search?q=${encodedTopic}+study+notes`,
    },
    {
      title: `NPTEL Courses: ${topic}`,
      url: `https://nptel.ac.in/courses?search=${encodedTopic}`,
    },
    {
      title: `GeeksforGeeks Articles: ${topic}`,
      url: `https://www.geeksforgeeks.org/?s=${encodedTopic}`,
    },
    {
      title: `Wikipedia Search: ${topic}`,
      url: `https://en.wikipedia.org/w/index.php?search=${encodedTopic}`,
    },
  ];
};

const mergeSources = (...sourceGroups) => {
  const seen = new Set();

  return sourceGroups
    .flat()
    .filter((source) => source?.title || source?.url)
    .filter((source) => {
      const key = source.url || source.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const extractText = (candidate) =>
  (candidate?.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

const extractDeltaText = (chunk) =>
  (chunk?.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join("");

const callGemini = async ({ body, model, apiKey, useSearch }) => {
  let response;

  try {
    response = await fetch(
      `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          ...(useSearch ? { tools: [{ google_search: {} }] } : {}),
        }),
      }
    );
  } catch {
    throw new ApiError(
      502,
      "Could not reach Gemini API from the backend. Check internet access and firewall settings."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.error?.message || "AI service failed to generate a response"
    );
  }

  return data;
};

const buildGeminiRequest = async ({ files, history, message }) => {
  const safeHistory = normalizeHistory(history).slice(-8);
  const { contextText, sources: vectorSources } = await buildVectorContext({
    files,
    message,
  });
  const referenceSources = buildReferenceSources(message);

  const contents = safeHistory
    .filter((item) => item?.content)
    .map((item) => ({
      role: item.role === "assistant" || item.role === "model" ? "model" : "user",
      parts: [{ text: String(item.content).slice(0, 4000) }],
    }));

  const promptText = [
    contextText
      ? `Use this retrieved GBPIET Notes knowledge base context when it is relevant. Cite it as "GBPIET source" when useful.\n\n${contextText}`
      : "",
    message.trim() ||
      "Analyze the attached file and explain the important academic points.",
  ]
    .filter(Boolean)
    .join("\n\nStudent question:\n");

  const currentParts = [
    { text: promptText },
    ...files
      .filter((file) => file.mimetype !== "text/plain")
      .map((file) => ({
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString("base64"),
        },
      })),
  ];

  contents.push({
    role: "user",
    parts: currentParts,
  });

  return {
    requestBody: {
      systemInstruction: {
        parts: [
          {
            text:
              "You are GBPIET Notes AI Assistant. Help college students understand notes, PDFs, handwritten images, diagrams, and doubts. Give clear explanations, steps, formulas when useful, and concise summaries. Use retrieved GBPIET Notes context when relevant, but do not pretend it contains information it does not contain. When the student asks for references or study links, include a short References section with useful URLs if web grounding provides them. If the answer is uncertain, say so.",
          },
        ],
      },
      contents,
      generationConfig: {
        temperature: 0.3,
      },
    },
    vectorSources,
    referenceSources,
  };
};

const sendAiMessage = asyncHandler(async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new ApiError(
      503,
      "AI chatbot is not configured. Add GEMINI_API_KEY to the backend environment."
    );
  }

  const { message = "", history = "[]" } = req.body;
  const files = req.files || [];

  if (!message.trim() && files.length === 0) {
    throw new ApiError(400, "Send a question, file, or both.");
  }

  const { requestBody, referenceSources, vectorSources } = await buildGeminiRequest({
    files,
    history,
    message,
  });

  let data;
  let usedSearch = process.env.GEMINI_ENABLE_GOOGLE_SEARCH !== "false";

  try {
    data = await callGemini({
      body: requestBody,
      model,
      apiKey,
      useSearch: usedSearch,
    });
  } catch (error) {
    if (!usedSearch) throw error;

    usedSearch = false;
    data = await callGemini({
      body: requestBody,
      model,
      apiKey,
      useSearch: false,
    });
  }

  const candidate = data?.candidates?.[0];
  const answer = extractText(candidate);

  if (!answer) {
    throw new ApiError(502, "AI service returned an empty response.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        answer,
        sources: mergeSources(
          vectorSources,
          buildSources(candidate?.groundingMetadata),
          referenceSources,
        ),
        usedSearch,
        model,
      },
      "AI response generated successfully"
    )
  );
});

const streamGeminiResponse = async ({ apiKey, body, model, res, useSearch }) => {
  const response = await fetch(
    `${GEMINI_API_URL}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        ...(useSearch ? { tools: [{ google_search: {} }] } : {}),
      }),
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      data?.error?.message || "AI service failed to stream a response",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let groundingSources = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith("data:")) continue;

      const payload = trimmedLine.replace(/^data:\s*/, "");
      if (!payload) continue;

      const chunk = JSON.parse(payload);
      const delta = extractDeltaText(chunk);

      if (delta) {
        res.write(`data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`);
      }

      const chunkSources = buildSources(
        chunk?.candidates?.[0]?.groundingMetadata,
      );

      if (chunkSources.length > 0) groundingSources = chunkSources;
    }
  }

  return groundingSources;
};

const streamAiMessage = asyncHandler(async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new ApiError(
      503,
      "AI chatbot is not configured. Add GEMINI_API_KEY to the backend environment.",
    );
  }

  const { message = "", history = "[]" } = req.body;
  const files = req.files || [];

  if (!message.trim() && files.length === 0) {
    throw new ApiError(400, "Send a question, file, or both.");
  }

  const { requestBody, referenceSources, vectorSources } = await buildGeminiRequest({
    files,
    history,
    message,
  });

  res.writeHead(200, {
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "X-Accel-Buffering": "no",
  });

  res.write(
    `data: ${JSON.stringify({
      type: "meta",
      model,
      sources: mergeSources(vectorSources, referenceSources),
      usedSearch: process.env.GEMINI_ENABLE_GOOGLE_SEARCH !== "false",
    })}\n\n`,
  );

  let usedSearch = process.env.GEMINI_ENABLE_GOOGLE_SEARCH !== "false";

  try {
    const groundingSources = await streamGeminiResponse({
      apiKey,
      body: requestBody,
      model,
      res,
      useSearch: usedSearch,
    });

    res.write(
      `data: ${JSON.stringify({
        type: "done",
        sources: mergeSources(vectorSources, groundingSources, referenceSources),
        usedSearch,
      })}\n\n`,
    );
  } catch (error) {
    if (usedSearch) {
      usedSearch = false;
      try {
        const groundingSources = await streamGeminiResponse({
          apiKey,
          body: requestBody,
          model,
          res,
          useSearch: false,
        });

        res.write(
          `data: ${JSON.stringify({
            type: "done",
            sources: mergeSources(
              vectorSources,
              groundingSources,
              referenceSources,
            ),
            usedSearch,
          })}\n\n`,
        );
      } catch (retryError) {
        res.write(
          `data: ${JSON.stringify({
            type: "error",
            message: retryError.message || "AI chatbot failed while streaming.",
          })}\n\n`,
        );
      }
    } else {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: error.message || "AI chatbot failed while streaming.",
        })}\n\n`,
      );
    }
  } finally {
    res.end();
  }
});

export { sendAiMessage, streamAiMessage };
