import { NextResponse } from 'next/server';
import { QuestionService } from '@/server/services/question.service';

const service = new QuestionService();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || undefined;
    const grade = searchParams.get('grade') || undefined;
    const chapter = searchParams.get('chapter') || undefined;
    const topic = searchParams.get('topic') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const cognitiveLevel = searchParams.get('cognitiveLevel') || undefined;
    const questionType = searchParams.get('questionType') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const questions = await service.listQuestions({
      subject,
      grade,
      chapter,
      topic,
      difficulty,
      cognitiveLevel,
      questionType,
      status,
      search,
    });

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = {
      ...body,
      // Default tutorId is tutor-nam to associate with the tutor in seed data
      createdById: body.createdById || 'tutor-nam',
    };
    const question = await service.createQuestion(data);
    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
