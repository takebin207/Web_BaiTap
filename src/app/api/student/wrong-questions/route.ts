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

    const wrongReviews = await prisma.wrongQuestionReview.findMany({
      where: {
        studentId,
      },
      include: {
        assignment: {
          select: {
            title: true,
          },
        },
        question: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = wrongReviews.map((review) => ({
      id: review.id,
      assignmentId: review.assignmentId,
      assignmentTitle: review.assignment.title,
      question: {
        id: review.question.id,
        content: review.question.content,
        questionType: review.question.questionType === "MULTIPLE_CHOICE" ? "multiple_choice" : "short_answer",
        options: review.question.options,
        correctAnswer: review.question.correctAnswer,
        explanation: review.question.explanation,
      },
      reason: review.reason.toLowerCase(),
      priority: review.priority,
      createdAt: review.createdAt.toISOString(),
    }));

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
