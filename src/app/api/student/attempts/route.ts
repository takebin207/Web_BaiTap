import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentId = session.user.id;
    if (!studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const attempts = await prisma.attempt.findMany({
      where: {
        studentId,
        status: "GRADED",
      },
      include: {
        assignment: {
          select: {
            title: true,
            classroom: {
              select: {
                name: true,
              },
            },
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    const data = attempts.map((att) => ({
      id: att.id,
      assignmentId: att.assignmentId,
      assignmentTitle: att.assignment.title,
      className: att.assignment.classroom.name,
      subject: "Toán 10",
      studentId: att.studentId,
      studentName: session.user.name,
      score: att.score,
      totalQuestions: att.answers.length,
      timeSpent: att.timeSpentSeconds || 0,
      submittedAt: att.submittedAt ? att.submittedAt.toISOString() : null,
      status: att.status.toLowerCase(),
      answers: att.answers.map((ans) => ({
        id: ans.id,
        questionId: ans.questionId,
        selectedAnswer: ans.answer,
        isCorrect: ans.isCorrect,
        timeSpent: ans.timeSpentSeconds || 0,
        question: ans.question ? {
          id: ans.question.id,
          content: ans.question.content,
          questionType: ans.question.questionType === "MULTIPLE_CHOICE" ? "multiple_choice" : "short_answer",
          options: ans.question.options,
          correctAnswer: ans.question.correctAnswer,
          explanation: ans.question.explanation,
          aiExplanation: ans.question.explanation, // for mock AI explanation fallback
        } : null,
      })),
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
