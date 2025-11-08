import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { Note } from "../models/note.model.js";

export const getModelByType = (type) => {
  switch (type) {
    case "question":
      return Question;
    case "answer":
      return Answer;
    case "note":
      return Note;
    default:
      throw new Error("Invalid type for upvote");
  }
};
