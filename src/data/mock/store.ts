// ============================================================
// EStudy Frontend State Persistence Store (Local Storage Mock)
// ============================================================

import { questionBank, Question } from "./data";

const STORAGE_KEY = "estudy_question_bank";

/**
 * Retrieves the current list of questions.
 * Fallbacks to the mock data from data.ts if local storage is empty.
 */
export function getLocalStorageQuestions(): Question[] {
  if (typeof window === "undefined") {
    return questionBank;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Initialize with default mock questions
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questionBank));
      return questionBank;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    return questionBank;
  }
}

/**
 * Saves the current list of questions to localStorage.
 */
export function saveLocalStorageQuestions(questions: Question[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Failed to write to localStorage:", error);
  }
}

/**
 * Appends a list of new questions to the bank.
 */
export function addQuestionsToBank(newQuestions: Question[]): void {
  const current = getLocalStorageQuestions();
  // Filter out duplicates by ID
  const currentIds = new Set(current.map((q) => q.id));
  const uniqueNew = newQuestions.filter((q) => !currentIds.has(q.id));
  const updated = [...uniqueNew, ...current];
  saveLocalStorageQuestions(updated);
}
