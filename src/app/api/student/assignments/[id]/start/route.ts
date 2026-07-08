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
        `[AUTH TEMPORARY FALLBACK] Session not found. Using temporary seeded student ID: ${studentId}`
      );
    }

    const { id: assignmentId } = await params;

    const attempt = await attemptService.startAttempt(assignmentId, studentId);

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      status: attempt.status,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
