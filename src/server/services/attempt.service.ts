import { AttemptRepository } from "../repositories/attempt.repository";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { AttemptStatus, ReviewReason } from "@prisma/client";
import prisma from "@/lib/prisma";

const attemptRepo = new AttemptRepository();
const assignmentRepo = new AssignmentRepository();

export class AttemptService {
  async startAttempt(assignmentId: string, studentId: string) {
    // 1. Check if assignment exists
    const assignment = await assignmentRepo.findById(assignmentId);
    if (!assignment) {
      throw new Error("Không tìm thấy bài tập yêu cầu.");
    }

    // 2. Check if there is an active IN_PROGRESS attempt
    const activeAttempt = await attemptRepo.findInProgress(assignmentId, studentId);
    if (activeAttempt) {
      return activeAttempt; // Resume
    }

    // 3. Create a new attempt
    return attemptRepo.create({
      assignmentId,
      studentId,
      status: AttemptStatus.IN_PROGRESS,
      startedAt: new Date(),
    });
  }

  async submitAttempt(
    attemptId: string,
    answers: Record<string, string>,
    timeSpentSeconds: number
  ) {
    // 1. Fetch attempt detail with assignment questions
    const attempt = await attemptRepo.findById(attemptId);
    if (!attempt) {
      throw new Error("Không tìm thấy lượt làm bài.");
    }

    // 2. If already submitted/graded, return it to prevent duplicate submissions
    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      return attempt;
    }

    const assignment = attempt.assignment;
    const assignmentQuestions = assignment.questions;
    if (!assignmentQuestions || assignmentQuestions.length === 0) {
      throw new Error("Bài tập này không có câu hỏi nào.");
    }

    let correctCount = 0;
    const answersData = assignmentQuestions.map((aq) => {
      const q = aq.question;
      const studentAnswer = answers[q.id] || "";
      
      const isMc = q.questionType === "MULTIPLE_CHOICE";
      const isSkipped = studentAnswer.toString().trim() === "";

      // Objective multiple-choice grading
      let isCorrect = false;
      if (!isSkipped) {
        const normStudent = studentAnswer.toString().trim().toLowerCase();
        const normCorrect = q.correctAnswer.toString().trim().toLowerCase();
        isCorrect = normStudent === normCorrect;
        if (isCorrect) {
          correctCount++;
        }
      }

      return {
        questionId: q.id,
        answer: studentAnswer,
        isCorrect,
        isSkipped,
        topic: q.topic || "Chung",
        timeSpentSeconds: Math.round(timeSpentSeconds / assignmentQuestions.length),
      };
    });

    // 3. Save answers, update attempt status, and register reviews inside a transaction
    await prisma.$transaction(async (tx) => {
      // Delete any previous answers for this attempt (just in case)
      await tx.attemptAnswer.deleteMany({
        where: { attemptId },
      });

      // Save new answers
      await tx.attemptAnswer.createMany({
        data: answersData.map((ans) => ({
          attemptId,
          questionId: ans.questionId,
          answer: ans.answer,
          isCorrect: ans.isCorrect,
          timeSpentSeconds: ans.timeSpentSeconds,
        })),
      });

      // Update attempt metadata
      await tx.attempt.update({
        where: { id: attemptId },
        data: {
          score: correctCount, // raw count of correct answers
          timeSpentSeconds,
          status: AttemptStatus.GRADED,
          submittedAt: new Date(),
        },
      });

      // Clean up previous wrong question reviews for this student/assignment
      await tx.wrongQuestionReview.deleteMany({
        where: {
          assignmentId: attempt.assignmentId,
          studentId: attempt.studentId,
        },
      });

      // Log wrong / skipped questions into WrongQuestionReview handbook
      const wrongQuestions = answersData.filter((ans) => !ans.isCorrect);
      for (const wq of wrongQuestions) {
        await tx.wrongQuestionReview.create({
          data: {
            assignmentId: attempt.assignmentId,
            questionId: wq.questionId,
            studentId: attempt.studentId,
            topic: wq.topic,
            reason: wq.isSkipped ? ReviewReason.SKIPPED : ReviewReason.WRONG,
            priority: wq.isSkipped ? 1 : 2,
          },
        });
      }
    });

    // 4. Fetch the final updated attempt details
    const updatedAttempt = await attemptRepo.findById(attemptId);
    if (!updatedAttempt) {
      throw new Error("Không thể tải thông tin bài làm sau khi cập nhật.");
    }
    return updatedAttempt;
  }

  async getAttemptDetail(id: string) {
    const attempt = await attemptRepo.findById(id);
    if (!attempt) {
      throw new Error("Không tìm thấy lượt làm bài.");
    }
    return attempt;
  }

  async getLatestAttempt(assignmentId: string, studentId: string) {
    return attemptRepo.findLatest(assignmentId, studentId);
  }
}
