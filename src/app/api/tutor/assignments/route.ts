import { NextResponse } from 'next/server';
import { AssignmentService } from '@/server/services/assignment.service';

const service = new AssignmentService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const classId = searchParams.get('classId') || undefined;
    const tutorId = searchParams.get('tutorId') || 'tutor-nam'; // default to seeded tutor-nam for now

    const assignments = await service.listAssignments({
      status,
      classId,
      tutorId,
    });

    return NextResponse.json(assignments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionIds, ...assignmentData } = body;

    const assignment = await service.createAssignment(
      {
        ...assignmentData,
        // Mock tutor ID - Nguyễn Văn Nam
        createdById: 'tutor-nam',
      },
      questionIds
    );

    return NextResponse.json(assignment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
