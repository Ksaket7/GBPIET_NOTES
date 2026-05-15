import { Note } from "../models/note.model.js";
import { Post } from "../models/post.model.js";
import { Question } from "../models/question.model.js";

const VECTOR_SIZE = 256;
const MAX_CONTEXT_ITEMS = 6;

const tokenize = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);

const hashToken = (token) => {
  let hash = 2166136261;

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash) % VECTOR_SIZE;
};

const vectorize = (text = "") => {
  const vector = Array(VECTOR_SIZE).fill(0);

  tokenize(text).forEach((token) => {
    vector[hashToken(token)] += 1;
  });

  const magnitude = Math.sqrt(
    vector.reduce((total, value) => total + value * value, 0),
  );

  return magnitude ? vector.map((value) => value / magnitude) : vector;
};

const cosineSimilarity = (leftVector, rightVector) =>
  leftVector.reduce((total, value, index) => total + value * rightVector[index], 0);

const formatTags = (tags = []) =>
  tags
    .filter(Boolean)
    .map((tag) => `#${String(tag).replace(/^#/, "")}`)
    .join(" ");

const normalizeDocument = ({ content, id, source, title, url }) => ({
  content: String(content || "").replace(/\s+/g, " ").trim(),
  id: String(id),
  source,
  title: title || source,
  url: url || "",
});

const getTextFileContext = (files = []) =>
  files
    .filter((file) => file.mimetype === "text/plain")
    .map((file) =>
      normalizeDocument({
        id: `${file.originalname}-${file.size}`,
        source: "Uploaded text file",
        title: file.originalname,
        content: file.buffer.toString("utf8").slice(0, 6000),
      }),
    )
    .filter((document) => document.content);

const getKnowledgeDocuments = async () => {
  const [notes, questions, posts] = await Promise.all([
    Note.find({})
      .sort({ updatedAt: -1 })
      .limit(80)
      .populate("uploadedBy", "fullName username")
      .lean(),
    Question.find({})
      .sort({ updatedAt: -1 })
      .limit(80)
      .populate("askedBy", "fullName username")
      .lean(),
    Post.find({})
      .sort({ updatedAt: -1 })
      .limit(60)
      .populate("postedBy", "fullName username")
      .lean(),
  ]);

  return [
    ...notes.map((note) =>
      normalizeDocument({
        id: note._id,
        source: "Note",
        title: note.title,
        url: note.fileUrl,
        content: [
          note.title,
          note.description,
          note.subjectName,
          note.subjectCode,
          note.type,
          formatTags(note.tags),
          `Uploaded by ${note.uploadedBy?.fullName || note.uploadedBy?.username || "a contributor"}`,
        ].join(" "),
      }),
    ),
    ...questions.map((question) =>
      normalizeDocument({
        id: question._id,
        source: "Question",
        title: question.title || "Question",
        content: [
          question.title,
          question.description,
          question.subjectName,
          question.subjectCode,
          formatTags(question.tags),
          `Asked by ${question.askedBy?.fullName || question.askedBy?.username || "a student"}`,
        ].join(" "),
      }),
    ),
    ...posts.map((post) =>
      normalizeDocument({
        id: post._id,
        source: "Community post",
        title: "Community post",
        url: post.imageUrl,
        content: [
          post.text,
          `Posted by ${post.postedBy?.fullName || post.postedBy?.username || "a student"}`,
        ].join(" "),
      }),
    ),
  ].filter((document) => document.content);
};

export const buildVectorContext = async ({ files = [], message = "" }) => {
  const query = String(message || "").trim();
  const fileDocuments = getTextFileContext(files);

  if (!query && fileDocuments.length === 0) {
    return { contextText: "", sources: [] };
  }

  const queryVector = vectorize(
    [query, ...fileDocuments.map((document) => document.content)].join(" "),
  );
  const documents = [...fileDocuments, ...(await getKnowledgeDocuments())];

  const rankedDocuments = documents
    .map((document) => ({
      ...document,
      score: cosineSimilarity(queryVector, vectorize(document.content)),
    }))
    .filter((document) => document.score > 0.05)
    .sort((left, right) => right.score - left.score)
    .slice(0, MAX_CONTEXT_ITEMS);

  if (rankedDocuments.length === 0) {
    return { contextText: "", sources: [] };
  }

  const contextText = rankedDocuments
    .map(
      (document, index) =>
        `[${index + 1}] ${document.source}: ${document.title}\n${document.content.slice(0, 900)}`,
    )
    .join("\n\n");

  const sources = rankedDocuments.map((document) => ({
    title: `${document.source}: ${document.title}`,
    url: document.url,
    score: Number(document.score.toFixed(3)),
  }));

  return { contextText, sources };
};
