import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class AttemptRepository {
  async create(data: Prisma.AttemptUncheckedCreateInput) {
    return prisma.attempt.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.attempt.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            classroom: {
              select: {
                name: true,
                grade: true,
                subject: true,
              },
            },
            questions: {
              orderBy: {
                order: "asc",
              },
              include: {
                question: true,
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
    });
  }

  async findInProgress(assignmentId: string, studentId: string) {
    return prisma.attempt.findFirst({
      where: {
        assignmentId,
        studentId,
        status: "IN_PROGRESS",
      },
    });
  }

  async findLatest(assignmentId: string, studentId: string) {
    return prisma.attempt.findFirst({
      where: {
        assignmentId,
        studentId,
      },
      orderBy: {
        startedAt: "desc",
      },
      include: {
        answers: true,
      },
    });
  }

  async update(id: string, data: Prisma.AttemptUncheckedUpdateInput) {
    return prisma.attempt.update({
      where: { id },
      data,
    });
  }
}
