import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class QuestionRepository {
  async findAll(filters?: {
    subject?: string;
    grade?: string;
    chapter?: string;
    topic?: string;
    difficulty?: string;
    cognitiveLevel?: string;
    questionType?: string;
    status?: string;
    search?: string;
  }) {
    const where: Prisma.QuestionWhereInput = {};

    if (filters) {
      if (filters.subject && filters.subject !== 'All') {
        where.subject = filters.subject === 'math' ? 'math' : filters.subject;
      }
      if (filters.grade && filters.grade !== 'All') {
        where.grade = filters.grade === 'grade-10' ? 'grade-10' : filters.grade;
      }
      if (filters.chapter && filters.chapter !== 'All') {
        where.chapter = filters.chapter;
      }
      if (filters.topic && filters.topic !== 'All') {
        where.topic = filters.topic;
      }
      if (filters.difficulty && filters.difficulty !== 'All') {
        where.difficulty = filters.difficulty.toUpperCase() as any;
      }
      if (filters.cognitiveLevel && filters.cognitiveLevel !== 'All') {
        where.cognitiveLevel = filters.cognitiveLevel.toUpperCase() as any;
      }
      if (filters.questionType && filters.questionType !== 'All') {
        where.questionType = filters.questionType.toUpperCase() as any;
      }
      if (filters.status && filters.status !== 'All') {
        where.status = filters.status.toUpperCase() as any;
      }
      if (filters.search) {
        where.OR = [
          { content: { contains: filters.search, mode: 'insensitive' } },
          { explanation: { contains: filters.search, mode: 'insensitive' } },
          { source: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }

    return prisma.question.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.QuestionUncheckedCreateInput) {
    return prisma.question.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuestionUncheckedUpdateInput) {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  async isReferencedInAssignments(id: string): Promise<boolean> {
    const count = await prisma.assignmentQuestion.count({
      where: { questionId: id },
    });
    return count > 0;
  }
}
