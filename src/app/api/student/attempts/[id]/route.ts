import { auth } from "@/auth";
import { AttemptService } from "@/server/services/attempt.service";
import { NextResponse } from "next/server";

const attemptService = new AttemptService();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    // Auth fallback to standard seeded student ID 'student-an' for the prototype
    let studentId = "student-an";
    if (session?.user?.id) {
      studentId = session.user.id;
    }

    const { id: attemptId } = await params;

    const attempt = await attemptService.getAttemptDetail(attemptId);

    // Security check: only allow the student owner or a tutor to view details
    if (attempt.studentId !== studentId && session?.user?.role !== "TUTOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Format attempt response for the UI results summary/details rendering
    const data = {
      id: attempt.id,
      assignmentId: attempt.assignmentId,
      assignmentTitle: attempt.assignment.title,
      className: attempt.assignment.classroom.name,
      subject: "Toán 10",
      studentId: attempt.studentId,
      score: attempt.score,
      totalQuestions: attempt.assignment.questions.length,
      timeSpent: attempt.timeSpentSeconds || 0,
      submittedAt: attempt.submittedAt ? attempt.submittedAt.toISOString() : null,
      status: attempt.status.toLowerCase(),
      showSolutionsAfterSubmit: attempt.assignment.showSolutionsAfterSubmit,
      answers: attempt.answers.map((ans) => ({
        id: ans.id,
        questionId: ans.questionId,
        selectedAnswer: ans.answer,
        isCorrect: ans.isCorrect,
        timeSpent: ans.timeSpentSeconds || 0,
        question: {
          id: ans.question.id,
          content: ans.question.content,
          questionType:
            ans.question.questionType === "MULTIPLE_CHOICE"
              ? "multiple_choice"
              : "short_answer",
          options: ans.question.options,
          correctAnswer: ans.question.correctAnswer,
          explanation: ans.question.explanation,
        },
      })),
    };

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
