import { auth } from "@/auth";
import { AttemptService } from "@/server/services/attempt.service";
import { NextResponse } from "next/server";

const attemptService = new AttemptService();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    // Auth fallback to standard seeded student ID 'student-an' for the prototype
    let studentId = "student-an";
    if (session?.user?.id) {
      studentId = session.user.id;
    } else {
      console.warn(
        `[AUTH TEMPORARY FALLBACK] Session not found in submit. Using temporary seeded student ID: ${studentId}`
      );
    }

    const { id: assignmentId } = await params;
    const body = await request.json();
    const { answers, timeSpentSeconds } = body;
    let { attemptId } = body;

    // Fallback: if attemptId is not explicitly sent, query for the active in-progress attempt
    if (!attemptId) {
      const active = await attemptService.getLatestAttempt(assignmentId, studentId);
      if (active && active.status === "IN_PROGRESS") {
        attemptId = active.id;
      } else {
        return NextResponse.json(
          { error: "Không tìm thấy lượt làm bài đang diễn ra cho bài tập này." },
          { status: 400 }
        );
      }
    }

    const attempt = await attemptService.submitAttempt(
      attemptId,
      answers,
      timeSpentSeconds
    );

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.assignment.questions.length,
      status: attempt.status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
