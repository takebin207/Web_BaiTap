import { PrismaClient, Role, QuestionType, Difficulty, CognitiveLevel, QuestionStatus, AssignmentStatus, AttemptStatus, ReviewReason } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');

  // 1. Clear existing data in correct dependency order
  console.log('Clearing existing data...');
  await prisma.wrongQuestionReview.deleteMany();
  await prisma.attemptAnswer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.assignmentQuestion.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.classEnrollment.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('Seeding users...');
  
  const tutor = await prisma.user.create({
    data: {
      id: 'tutor-nam',
      name: 'Nguyễn Văn Nam',
      email: 'nam.teacher@estudy.vn',
      role: Role.TUTOR,
    },
  });

  const studentAn = await prisma.user.create({
    data: {
      id: 'student-an',
      name: 'Nguyễn Hải An',
      email: 'an.nguyen@estudy.vn',
      role: Role.STUDENT,
    },
  });

  const studentBinh = await prisma.user.create({
    data: {
      id: 'student-binh',
      name: 'Trần Quốc Bình',
      email: 'binh.tran@estudy.vn',
      role: Role.STUDENT,
    },
  });

  const studentChi = await prisma.user.create({
    data: {
      id: 'student-chi',
      name: 'Phạm Minh Chi',
      email: 'chi.pham@estudy.vn',
      role: Role.STUDENT,
    },
  });

  console.log(`Created ${1} tutor and ${3} students.`);

  // 3. Create Classroom
  console.log('Seeding classroom...');
  const classroom = await prisma.classroom.create({
    data: {
      id: 'class-math-10a1',
      name: 'Lớp 10A1 - Chuyên Toán',
      subject: 'Toán học',
      grade: '10',
      tutorId: tutor.id,
    },
  });

  // Enroll students in class
  await prisma.classEnrollment.createMany({
    data: [
      { classroomId: classroom.id, studentId: studentAn.id },
      { classroomId: classroom.id, studentId: studentBinh.id },
      { classroomId: classroom.id, studentId: studentChi.id },
    ],
  });
  console.log('Created classroom and enrolled students.');

  const questionsData = [
    {
      id: 'm10-q01',
      content: 'Cho mệnh đề chứa biến $P(x)$: "$x^2 - 3x + 2 = 0$". Phát biểu nào sau đây là mệnh đề đúng?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$P(1)$' },
        { id: 'b', label: 'B', content: '$P(0)$' },
        { id: 'c', label: 'C', content: '$P(-1)$' },
        { id: 'd', label: 'D', content: '$P(3)$' },
      ],
      correctAnswer: 'a',
      explanation: 'Thay $x = 1$ vào phương trình ta được $1^2 - 3\\cdot 1 + 2 = 0$ (đúng). Vậy $P(1)$ là mệnh đề đúng.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-1',
      topic: 'top-1-1',
      difficulty: Difficulty.EASY,
      cognitiveLevel: CognitiveLevel.RECOGNITION,
      source: 'SGK Toán 10 Kết nối tri thức',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q02',
      content: 'Cho hai tập hợp $A = \\{1; 2; 3; 4; 5\\}$ và $B = \\{2; 4; 6; 8\\}$. Xác định tập hợp $A \\cap B$.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$\\{2; 4\\}$' },
        { id: 'b', label: 'B', content: '$\\{1; 3; 5\\}$' },
        { id: 'c', label: 'C', content: '$\\{6; 8\\}$' },
        { id: 'd', label: 'D', content: '$\\{1; 2; 3; 4; 5; 6; 8\\}$' },
      ],
      correctAnswer: 'a',
      explanation: 'Tập hợp $A \\cap B$ chứa các phần tử thuộc cả hai tập hợp $A$ và $B$. Ta thấy các phần tử chung là $2$ và $4$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-1',
      topic: 'top-1-3',
      difficulty: Difficulty.EASY,
      cognitiveLevel: CognitiveLevel.RECOGNITION,
      source: 'SGK Toán 10 Cánh Diều',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q03',
      content: 'Cho tập hợp $A = \\{x \\in \\mathbb{R} \\mid (x-1)(x^2 - 4) = 0\\}$. Liệt kê các phần tử của tập hợp $A$.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$A = \\{1; 2; -2\\}$' },
        { id: 'b', label: 'B', content: '$A = \\{1; 2\\}$' },
        { id: 'c', label: 'C', content: '$A = \\{1; 4\\}$' },
        { id: 'd', label: 'D', content: '$A = \\{1; -2\\}$' },
      ],
      correctAnswer: 'a',
      explanation: 'Giải phương trình $(x-1)(x^2 - 4) = 0$ ta được $x = 1$ hoặc $x^2 = 4 \\Leftrightarrow x = \\pm 2$. Các nghiệm này đều là số thực, vậy $A = \\{-2; 1; 2\\}$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-1',
      topic: 'top-1-2',
      difficulty: Difficulty.MEDIUM,
      cognitiveLevel: CognitiveLevel.UNDERSTANDING,
      source: 'Đề kiểm tra THPT Kim Liên',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q04',
      content: 'Cho hàm số bậc hai $y = x^2 - 4x + 3$. Tọa độ đỉnh $I$ của parabol là:',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$I(2; -1)$' },
        { id: 'b', label: 'B', content: '$I(-2; -1)$' },
        { id: 'c', label: 'C', content: '$I(2; 1)$' },
        { id: 'd', label: 'D', content: '$I(-2; 1)$' },
      ],
      correctAnswer: 'a',
      explanation: 'Hoành độ đỉnh $x_I = -\\frac{b}{2a} = -\\frac{-4}{2\\cdot 1} = 2$. Thay $x = 2$ vào hàm số ta được tung độ đỉnh $y_I = 2^2 - 4\\cdot 2 + 3 = -1$. Vậy $I(2; -1)$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-3',
      topic: 'top-3-3',
      difficulty: Difficulty.MEDIUM,
      cognitiveLevel: CognitiveLevel.UNDERSTANDING,
      source: 'Đề học kỳ 1 THPT chuyên Hà Nội - Amsterdam',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q05',
      content: 'Tập nghiệm của bất phương trình bậc hai $x^2 - 3x + 2 < 0$ là khoảng nào sau đây?',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$(1; 2)$' },
        { id: 'b', label: 'B', content: '$(-\\infty; 1) \\cup (2; +\\infty)$' },
        { id: 'c', label: 'C', content: '$[-1; 2]$' },
        { id: 'd', label: 'D', content: '$\\varnothing$' },
      ],
      correctAnswer: 'a',
      explanation: 'Xét tam thức bậc hai $f(x) = x^2 - 3x + 2$. Ta thấy hệ số $a = 1 > 0$ và nghiệm của tam thức là $x = 1, x = 2$. Vì đề bài yêu cầu $f(x) < 0$ nên nghiệm nằm trong khoảng hai nghiệm, tức là $x \\in (1; 2)$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-3',
      topic: 'top-3-4',
      difficulty: Difficulty.MEDIUM,
      cognitiveLevel: CognitiveLevel.UNDERSTANDING,
      source: 'Đề thi thử THPT Quốc gia',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q06',
      content: 'Cho tam giác đều $ABC$ cạnh $a$. Tính độ dài của vectơ $\\vec{u} = \\vec{AB} + \\vec{AC}$.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$a\\sqrt{3}$' },
        { id: 'b', label: 'B', content: '$a$' },
        { id: 'c', label: 'C', content: '$2a$' },
        { id: 'd', label: 'D', content: '$\\frac{a\\sqrt{3}}{2}$' },
      ],
      correctAnswer: 'a',
      explanation: 'Dựng hình bình hành $ABDC$. Vì tam giác $ABC$ đều nên $ABDC$ là hình thoi. Gọi $M$ là trung điểm của $BC$, ta có $\\vec{AB} + \\vec{AC} = \\vec{AD} = 2\\vec{AM}$. Độ dài trung tuyến tam giác đều cạnh $a$ là $AM = \\frac{a\\sqrt{3}}{2}$, do đó $|\\vec{u}| = 2\\cdot \\frac{a\\sqrt{3}}{2} = a\\sqrt{3}$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-5',
      topic: 'top-5-2',
      difficulty: Difficulty.HARD,
      cognitiveLevel: CognitiveLevel.APPLICATION,
      source: 'Đề kiểm tra giữa kỳ Chuyên Nguyễn Huệ',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q07',
      content: 'Trong mặt phẳng tọa độ $Oxy$, cho vectơ $\\vec{a} = (3; -2)$ và $\\vec{b} = (-1; 5)$. Tìm tọa độ của vectơ $\\vec{c} = 2\\vec{a} + 3\\vec{b}$.',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '$(3; 11)$' },
        { id: 'b', label: 'B', content: '$(5; 11)$' },
        { id: 'c', label: 'C', content: '$(3; -9)$' },
        { id: 'd', label: 'D', content: '$(5; -9)$' },
      ],
      correctAnswer: 'a',
      explanation: 'Tọa độ của vectơ $\\vec{c} = 2\\vec{a} + 3\\vec{b} = (2\\cdot 3 + 3\\cdot (-1); 2\\cdot (-2) + 3\\cdot 5) = (6 - 3; -4 + 15) = (3; 11)$.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-5',
      topic: 'top-5-4',
      difficulty: Difficulty.EASY,
      cognitiveLevel: CognitiveLevel.UNDERSTANDING,
      source: 'SGK Toán 10 Kết nối tri thức',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q08',
      content: 'Tìm số giao điểm của đồ thị hàm số $y = x^2 - 3x + 2$ và trục hoành.',
      questionType: QuestionType.SHORT_ANSWER,
      options: null,
      correctAnswer: '2',
      explanation: 'Phương trình hoành độ giao điểm: $x^2 - 3x + 2 = 0$ có $\\Delta = (-3)^2 - 4\\cdot 2 = 1 > 0$, do đó phương trình có 2 nghiệm phân biệt. Đồ thị cắt trục hoành tại 2 điểm.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-3',
      topic: 'top-3-2',
      difficulty: Difficulty.EASY,
      cognitiveLevel: CognitiveLevel.UNDERSTANDING,
      source: 'Đề cương ôn tập trường Lương Thế Vinh',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q09',
      content: 'Cho tam giác $ABC$ có cạnh $a = 6$, $b = 8$ và góc $C = 60^\\circ$. Tính diện tích $S$ của tam giác $ABC$ (Làm tròn kết quả đến hàng đơn vị).',
      questionType: QuestionType.SHORT_ANSWER,
      options: null,
      correctAnswer: '21',
      explanation: 'Áp dụng công thức tính diện tích tam giác: $S = \\frac{1}{2}ab\\sin C = \\frac{1}{2}\\cdot 6\\cdot 8\\cdot \\sin 60^\\circ = 24 \\cdot \\frac{\\sqrt{3}}{2} = 12\\sqrt{3} \\approx 20.78$. Làm tròn đến hàng đơn vị là 21.',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-4',
      topic: 'top-4-1',
      difficulty: Difficulty.MEDIUM,
      cognitiveLevel: CognitiveLevel.APPLICATION,
      source: 'Đề khảo sát trường Yên Hòa',
      status: QuestionStatus.READY,
      createdById: tutor.id,
    },
    {
      id: 'm10-q10',
      content: 'Mệnh đề phủ định của mệnh đề "$\\forall x \\in \\mathbb{R}, x^2 + 1 > 0$" là:',
      questionType: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: 'a', label: 'A', content: '"$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$"' },
        { id: 'b', label: 'B', content: '"$\\exists x \\in \\mathbb{R}, x^2 + 1 < 0$"' },
        { id: 'c', label: 'C', content: '"$\\forall x \\in \\mathbb{R}, x^2 + 1 \\le 0$"' },
        { id: 'd', label: 'D', content: '"$\\exists x \\in \\mathbb{R}, x^2 + 1 > 0$"' },
      ],
      correctAnswer: 'a',
      explanation: 'Phủ định của $\\forall x$ là $\\exists x$, phủ định của $>$ là $\\le$. Do đó phủ định của mệnh đề đã cho là "$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$".',
      subject: 'math',
      grade: 'grade-10',
      chapter: 'chap-1',
      topic: 'top-1-1',
      difficulty: Difficulty.EASY,
      cognitiveLevel: CognitiveLevel.RECOGNITION,
      source: 'Sách giáo khoa Toán 10 Kết nối tri thức',
      status: QuestionStatus.DRAFT,
      createdById: tutor.id,
    },
  ];

  for (const q of questionsData) {
    await prisma.question.create({
      data: {
        id: q.id,
        content: q.content,
        questionType: q.questionType,
        options: q.options ? q.options : undefined,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        subject: q.subject,
        grade: q.grade,
        chapter: q.chapter,
        topic: q.topic,
        difficulty: q.difficulty,
        cognitiveLevel: q.cognitiveLevel,
        source: q.source,
        status: q.status,
        createdById: q.createdById,
      },
    });
  }
  console.log('Seeded 10 Math 10 questions.');

  // 5. Create 1 Assignment
  console.log('Seeding assignment...');
  const assignment = await prisma.assignment.create({
    data: {
      id: 'assign-math-10-01',
      title: 'Bài tập ôn hè Toán 10 - Đề số 1',
      description: 'Đề ôn tập tổng hợp Chương 1 (Mệnh đề - Tập hợp) và Chương 3 (Hàm số bậc hai). Học sinh làm bài nghiêm túc, không sử dụng tài liệu.',
      classId: classroom.id,
      createdById: tutor.id,
      subject: 'Toán học',
      grade: '10',
      timeLimitMinutes: 45,
      deadline: new Date('2026-08-31T23:59:00Z'),
      showSolutionsAfterSubmit: true,
      status: AssignmentStatus.ASSIGNED,
    },
  });

  // Link questions to assignment with ordering
  await prisma.assignmentQuestion.createMany({
    data: questionsData.map((q, idx) => ({
      assignmentId: assignment.id,
      questionId: q.id,
      order: idx + 1,
    })),
  });
  console.log('Created assignment and linked all questions.');

  // 6. Create Attempts
  console.log('Seeding student attempts...');
  
  // Student An: Graded attempt
  const attemptAn = await prisma.attempt.create({
    data: {
      id: 'attempt-an-01',
      assignmentId: assignment.id,
      studentId: studentAn.id,
      startedAt: new Date('2026-07-08T08:00:00Z'),
      submittedAt: new Date('2026-07-08T08:35:00Z'),
      timeSpentSeconds: 2100, // 35 mins
      score: 8.0, // 8 out of 10 correct
      status: AttemptStatus.GRADED,
    },
  });

  // Student An Answers: 8 correct, 2 wrong (m10-q04 and m10-q09)
  await prisma.attemptAnswer.createMany({
    data: [
      { attemptId: attemptAn.id, questionId: 'm10-q01', answer: 'a', isCorrect: true, timeSpentSeconds: 120 },
      { attemptId: attemptAn.id, questionId: 'm10-q02', answer: 'a', isCorrect: true, timeSpentSeconds: 90 },
      { attemptId: attemptAn.id, questionId: 'm10-q03', answer: 'a', isCorrect: true, timeSpentSeconds: 240 },
      { attemptId: attemptAn.id, questionId: 'm10-q04', answer: 'b', isCorrect: false, timeSpentSeconds: 300 }, // Wrong (Correct is 'a')
      { attemptId: attemptAn.id, questionId: 'm10-q05', answer: 'a', isCorrect: true, timeSpentSeconds: 200 },
      { attemptId: attemptAn.id, questionId: 'm10-q06', answer: 'a', isCorrect: true, timeSpentSeconds: 400 },
      { attemptId: attemptAn.id, questionId: 'm10-q07', answer: 'a', isCorrect: true, timeSpentSeconds: 150 },
      { attemptId: attemptAn.id, questionId: 'm10-q08', answer: '2', isCorrect: true, timeSpentSeconds: 180 },
      { attemptId: attemptAn.id, questionId: 'm10-q09', answer: '25', isCorrect: false, timeSpentSeconds: 300 }, // Wrong (Correct is '21')
      { attemptId: attemptAn.id, questionId: 'm10-q10', answer: 'a', isCorrect: true, timeSpentSeconds: 120 },
    ],
  });

  // Student Binh: In progress attempt
  await prisma.attempt.create({
    data: {
      id: 'attempt-binh-01',
      assignmentId: assignment.id,
      studentId: studentBinh.id,
      startedAt: new Date('2026-07-08T09:00:00Z'),
      status: AttemptStatus.IN_PROGRESS,
    },
  });

  console.log('Seeded student attempts and answers.');

  // 7. Wrong Question Reviews for Student An (for the 2 incorrect answers)
  console.log('Seeding wrong question review entries...');
  await prisma.wrongQuestionReview.createMany({
    data: [
      {
        id: 'wrong-review-an-01',
        assignmentId: assignment.id,
        questionId: 'm10-q04',
        studentId: studentAn.id,
        topic: 'Hàm số bậc hai',
        reason: ReviewReason.WRONG,
        priority: 1,
      },
      {
        id: 'wrong-review-an-02',
        assignmentId: assignment.id,
        questionId: 'm10-q09',
        studentId: studentAn.id,
        topic: 'Hệ thức lượng trong tam giác',
        reason: ReviewReason.WRONG,
        priority: 2,
      },
    ],
  });
  
  console.log('Seeded wrong question reviews.');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
