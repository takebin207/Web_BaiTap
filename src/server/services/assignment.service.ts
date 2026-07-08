import { AssignmentRepository } from '../repositories/assignment.repository';
import { Prisma, AssignmentStatus } from '@prisma/client';

const repo = new AssignmentRepository();

export class AssignmentService {
  async createAssignment(
    data: Omit<Prisma.AssignmentUncheckedCreateInput, 'createdById'> & { createdById?: string },
    questionIds: string[]
  ) {
    // 1. Validations
    if (!data.title || data.title.trim() === '') {
      throw new Error('Tiêu đề bài tập không được để trống.');
    }
    if (!data.classId || data.classId.trim() === '') {
      throw new Error('Lớp học nhận bài không được để trống.');
    }
    if (!questionIds || questionIds.length === 0) {
      throw new Error('Bài tập phải chứa ít nhất một câu hỏi.');
    }
    if (data.timeLimitMinutes !== undefined && data.timeLimitMinutes !== null) {
      const mins = Number(data.timeLimitMinutes);
      if (isNaN(mins) || mins <= 0) {
        throw new Error('Thời gian làm bài phải là một số phút dương.');
      }
    }
    if (data.deadline) {
      const deadlineDate = new Date(data.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error('Hạn nộp bài không hợp lệ.');
      }
    }

    const payload: Prisma.AssignmentUncheckedCreateInput = {
      title: data.title,
      description: data.description,
      classId: data.classId,
      // Default to tutor-nam for now (temporary auth mock)
      createdById: data.createdById || 'tutor-nam',
      subject: data.subject || 'math',
      grade: data.grade || '10',
      timeLimitMinutes: data.timeLimitMinutes ? Number(data.timeLimitMinutes) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      showSolutionsAfterSubmit: data.showSolutionsAfterSubmit ?? true,
      status: data.status || AssignmentStatus.DRAFT,
    };

    return repo.create(payload, questionIds);
  }

  async listAssignments(filters?: {
    status?: string;
    classId?: string;
    tutorId?: string;
  }) {
    return repo.findAll(filters);
  }

  async getAssignmentDetail(id: string) {
    const assignment = await repo.findById(id);
    if (!assignment) {
      throw new Error('Không tìm thấy bài tập yêu cầu.');
    }
    return assignment;
  }
}
