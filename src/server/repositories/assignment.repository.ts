import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class AssignmentRepository {
  async create(
    data: Prisma.AssignmentUncheckedCreateInput,
    questionIds: string[]
  ) {
    return prisma.$transaction(async (tx) => {
      const assignment = await tx.assignment.create({
        data,
      });

      // Link questions with order sequence
      if (questionIds && questionIds.length > 0) {
        await tx.assignmentQuestion.createMany({
          data: questionIds.map((qid, index) => ({
            assignmentId: assignment.id,
            questionId: qid,
            order: index + 1,
          })),
        });
      }

      return assignment;
    });
  }

  async findAll(filters?: {
    status?: string;
    classId?: string;
    tutorId?: string;
  }) {
    const where: Prisma.AssignmentWhereInput = {};

    if (filters) {
      if (filters.status && filters.status !== 'All') {
        where.status = filters.status.toUpperCase() as any;
      }
      if (filters.classId && filters.classId !== 'All') {
        where.classId = filters.classId;
      }
      if (filters.tutorId) {
        where.createdById = filters.tutorId;
      }
    }

    return prisma.assignment.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.assignment.findUnique({
      where: { id },
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
            order: 'asc',
          },
          include: {
            question: true,
          },
        },
      },
    });
  }
}
