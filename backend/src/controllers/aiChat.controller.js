import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

const extractText = (candidate) =>
  (candidate?.content?.parts || [])
    .map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();

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

  const safeHistory = normalizeHistory(history).slice(-8);
  const contents = safeHistory
    .filter((item) => item?.content)
    .map((item) => ({
      role: item.role === "assistant" || item.role === "model" ? "model" : "user",
      parts: [{ text: String(item.content).slice(0, 4000) }],
    }));

  const currentParts = [
    {
      text:
        message.trim() ||
        "Analyze the attached file and explain the important academic points.",
    },
    ...files.map((file) => ({
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

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text:
            "You are GBPIET Notes AI Assistant. Help college students understand notes, PDFs, handwritten images, diagrams, and doubts. Give clear explanations, steps, formulas when useful, and concise summaries. If web grounding is available, include helpful reference links. If the answer is uncertain, say so.",
        },
      ],
    },
    contents,
    generationConfig: {
      temperature: 0.3,
    },
  };

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
        sources: buildSources(candidate?.groundingMetadata),
        usedSearch,
        model,
      },
      "AI response generated successfully"
    )
  );
});

export { sendAiMessage };
