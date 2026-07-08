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

    // Get all classrooms the student is enrolled in
    const enrollments = await prisma.classEnrollment.findMany({
      where: { studentId },
      select: { classroomId: true },
    });

    const classroomIds = enrollments.map((e) => e.classroomId);

    // Get all published assignments in those classrooms
    const assignments = await prisma.assignment.findMany({
      where: {
        classId: { in: classroomIds },
        status: "ASSIGNED",
      },
      include: {
        classroom: {
          select: {
            name: true,
          },
        },
        questions: {
          select: {
            questionId: true,
          },
        },
        attempts: {
          where: {
            studentId,
          },
          orderBy: {
            startedAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map to UI representation
    const mapped = assignments.map((asgn) => {
      const latestAttempt = asgn.attempts[0];
      
      let status = "active";
      if (latestAttempt) {
        status = latestAttempt.status === "GRADED" ? "graded" : "submitted";
      }

      return {
        id: asgn.id,
        title: asgn.title,
        description: asgn.description,
        subject: "Toán 10", // Curriculum starts with Math 10
        grade: asgn.grade,
        className: asgn.classroom.name,
        questionCount: asgn.questions.length,
        timeLimit: asgn.timeLimitMinutes || 45,
        dueDate: asgn.deadline ? asgn.deadline.toISOString() : new Date(Date.now() + 86400000 * 7).toISOString(),
        status,
        attempt: latestAttempt ? {
          id: latestAttempt.id,
          assignmentId: asgn.id,
          score: latestAttempt.score,
          totalQuestions: asgn.questions.length,
          timeSpent: latestAttempt.timeSpentSeconds,
          status: latestAttempt.status.toLowerCase(),
          submittedAt: latestAttempt.submittedAt?.toISOString() || null,
        } : null,
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
