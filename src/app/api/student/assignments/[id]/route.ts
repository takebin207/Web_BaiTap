import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Auth fallback to standard seeded student ID 'student-an' for the prototype
    let studentId = "student-an";
    if (session.user.id) {
      studentId = session.user.id;
    }

    // Retrieve assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        classroom: {
          select: {
            name: true,
          },
        },
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            question: {
              select: {
                id: true,
                content: true,
                questionType: true,
                options: true,
                difficulty: true,
                cognitiveLevel: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Không tìm thấy bài tập" }, { status: 404 });
    }

    // Check if student is enrolled in the classroom of the assignment
    const enrollment = await prisma.classEnrollment.findUnique({
      where: {
        classroomId_studentId: {
          classroomId: assignment.classId,
          studentId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Bạn không tham gia lớp học nhận bài tập này" }, { status: 403 });
    }

    // Format questions list for student
    const questions = assignment.questions.map((aq) => {
      const q = aq.question;
      return {
        id: q.id,
        content: q.content,
        questionType: q.questionType === "MULTIPLE_CHOICE" ? "multiple_choice" : "short_answer",
        options: q.options,
        difficulty: q.difficulty.toLowerCase(),
        cognitiveLevel: q.cognitiveLevel.toLowerCase(),
      };
    });

    // Find latest attempt for this student and assignment
    const latestAttempt = await prisma.attempt.findFirst({
      where: {
        assignmentId: assignment.id,
        studentId,
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        answers: true,
      },
    });

    const data = {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      className: assignment.classroom.name,
      timeLimit: assignment.timeLimitMinutes || 45,
      deadline: assignment.deadline ? assignment.deadline.toISOString() : null,
      status: assignment.status.toLowerCase(),
      questions,
      latestAttempt: latestAttempt ? {
        id: latestAttempt.id,
        status: latestAttempt.status.toLowerCase(),
        score: latestAttempt.score,
        timeSpent: latestAttempt.timeSpentSeconds || 0,
        answers: latestAttempt.answers.map((ans) => ({
          questionId: ans.questionId,
          answer: ans.answer,
        })),
      } : null,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
