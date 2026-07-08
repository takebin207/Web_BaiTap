// ============================================================
// EStudy Frontend State Persistence Store (Local Storage Mock)
// ============================================================

import {
  questionBank,
  Question,
  mockAssignments,
  studentAttempts,
  AssignmentSummary,
  StudentAttempt
} from "./data";

const STORAGE_KEY = "estudy_question_bank";
const ASSIGNMENTS_KEY = "estudy_assignments";
const ATTEMPTS_KEY = "estudy_attempts";

/**
 * Questions State
 */
export function getLocalStorageQuestions(): Question[] {
  if (typeof window === "undefined") {
    return questionBank;
  }
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questionBank));
      return questionBank;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read questions from localStorage:", error);
    return questionBank;
  }
}

export function saveLocalStorageQuestions(questions: Question[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Failed to write questions to localStorage:", error);
  }
}

export function addQuestionsToBank(newQuestions: Question[]): void {
  const current = getLocalStorageQuestions();
  const currentIds = new Set(current.map((q) => q.id));
  const uniqueNew = newQuestions.filter((q) => !currentIds.has(q.id));
  const updated = [...uniqueNew, ...current];
  saveLocalStorageQuestions(updated);
}

/**
 * Assignments State
 */
export function getLocalStorageAssignments(): AssignmentSummary[] {
  if (typeof window === "undefined") {
    return mockAssignments;
  }
  try {
    const data = localStorage.getItem(ASSIGNMENTS_KEY);
    if (!data) {
      localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(mockAssignments));
      return mockAssignments;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read assignments from localStorage:", error);
    return mockAssignments;
  }
}

export function saveLocalStorageAssignments(assignments: AssignmentSummary[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error("Failed to write assignments to localStorage:", error);
  }
}

export function addAssignment(newAsgn: AssignmentSummary): void {
  const current = getLocalStorageAssignments();
  const updated = [newAsgn, ...current];
  saveLocalStorageAssignments(updated);
}

/**
 * Student Attempts State
 */
export function getLocalStorageAttempts(): StudentAttempt[] {
  if (typeof window === "undefined") {
    return studentAttempts;
  }
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY);
    if (!data) {
      localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(studentAttempts));
      return studentAttempts;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read attempts from localStorage:", error);
    return studentAttempts;
  }
}

export function saveLocalStorageAttempts(attempts: StudentAttempt[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error("Failed to write attempts to localStorage:", error);
  }
}

export function addOrUpdateAttempt(attempt: StudentAttempt): void {
  const current = getLocalStorageAttempts();
  const index = current.findIndex((att) => att.id === attempt.id);
  let updated = [...current];
  if (index !== -1) {
    updated[index] = attempt;
  } else {
    updated = [attempt, ...updated];
  }
  saveLocalStorageAttempts(updated);
}
