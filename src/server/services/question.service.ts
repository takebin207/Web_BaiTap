import { QuestionRepository } from '../repositories/question.repository';
import { QuestionStatus, Prisma } from '@prisma/client';

const repo = new QuestionRepository();

export class QuestionService {
  async listQuestions(filters?: {
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
    return repo.findAll(filters);
  }

  async getQuestion(id: string) {
    return repo.findById(id);
  }

  async createQuestion(data: Prisma.QuestionUncheckedCreateInput) {
    if (!data.content || data.content.trim() === '') {
      throw new Error('Nội dung câu hỏi không được để trống');
    }
    if (!data.correctAnswer || data.correctAnswer.trim() === '') {
      throw new Error('Đáp án đúng không được để trống');
    }
    return repo.create(data);
  }

  async updateQuestion(id: string, data: Prisma.QuestionUncheckedUpdateInput) {
    if (data.content !== undefined && (typeof data.content !== 'string' || data.content.trim() === '')) {
      throw new Error('Nội dung câu hỏi không được để trống');
    }
    return repo.update(id, data);
  }

  async deleteQuestion(id: string) {
    const isReferenced = await repo.isReferencedInAssignments(id);
    if (isReferenced) {
      // If referenced, safely switch status to DRAFT so it won't break assignments, but hides it from being actively selected
      await repo.update(id, { status: QuestionStatus.DRAFT });
      return { success: true, archived: true, message: 'Câu hỏi đã được sử dụng trong bài tập, chuyển trạng thái về DRAFT để ẩn an toàn.' };
    } else {
      // Otherwise, perform a hard delete
      await repo.delete(id);
      return { success: true, archived: false, message: 'Xóa câu hỏi thành công.' };
    }
  }
}
