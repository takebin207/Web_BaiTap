import { NextResponse } from 'next/server';
import { AssignmentService } from '@/server/services/assignment.service';

const service = new AssignmentService();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const assignment = await service.getAssignmentDetail(id);
    return NextResponse.json(assignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
