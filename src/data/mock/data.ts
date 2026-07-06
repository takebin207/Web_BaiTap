// ============================================================
// SAMPLE / MOCK / EDITABLE DATA — EStudy Math Grade 10
// Vietnamese General Education Curriculum 2018
// ============================================================

export type UserRole = "student" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  grade?: number;
  school?: string;
}

// Curriculum structures
export interface Curriculum {
  id: string;
  name: string;
  version: string;
  country: string;
  status: "SAMPLE" | "EDITABLE" | "OFFICIAL_MOCK";
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface GradeInfo {
  id: string;
  level: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  gradeId: string;
  name: string;
  description: string;
}

export interface Topic {
  id: string;
  chapterId: string;
  name: string;
  description: string;
}

export interface LearningOutcome {
  id: string;
  topicId: string;
  description: string;
  cognitiveLevel: "recognition" | "understanding" | "application" | "advanced_application";
  keywords: string[];
}

export type QuestionType = "multiple_choice" | "short_answer" | "essay" | "image_based";
export type QuestionDifficulty = "easy" | "medium" | "hard";
export type CognitiveLevel = "recognition" | "understanding" | "application" | "advanced_application";

export interface Question {
  id: string;
  content: string;
  options?: { id: string; label: string; content: string }[];
  correctAnswer: string;
  explanation: string;
  aiExplanation?: string;
  curriculumId: string;
  subjectId: string;
  gradeId: string;
  chapterId: string;
  topicId: string;
  learningOutcomeId?: string;
  questionType: QuestionType;
  difficulty: QuestionDifficulty;
  cognitiveLevel: CognitiveLevel;
  source: string;
  status: "DRAFT" | "NEEDS_REVIEW" | "READY" | "REVIEW_REQUIRED" | "ERROR";
  createdAt: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  grade: number;
  studentCount: number;
  tutorName: string;
  inviteCode: string;
  avgScore: number;
  students: ClassStudent[];
}

export interface ClassStudent {
  id: string;
  name: string;
  avgScore: number;
  totalAttempts: number;
  wrongCount: number;
}

export interface AssignmentSummary {
  id: string;
  title: string;
  classId: string;
  className: string;
  subject: string;
  questionCount: number;
  timeLimit: number; // minutes
  dueDate: string;
  showSolutionsAfterSubmit: boolean;
  status: "draft" | "active" | "closed" | "graded";
  submittedCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface StudentAttempt {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  className: string;
  subject: string;
  studentId: string;
  studentName: string;
  answers: AttemptAnswer[];
  score: number;
  totalQuestions: number;
  timeSpent: number; // seconds
  submittedAt: string | null;
  status: "not_started" | "in_progress" | "submitted" | "graded";
}

export interface AttemptAnswer {
  questionId: string;
  selectedAnswer: string | null; // null = skipped
  isCorrect: boolean;
  timeSpent: number; // seconds
}

export interface WrongQuestionItem {
  question: Question;
  wrongCount: number;
  totalAttempts: number;
  wrongRate: number; // percentage
  avgTimeSpent: number; // seconds
  skippedCount: number;
  studentsWrong: string[];
}

export interface AIReviewSummary {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  className: string;
  generatedAt: string;
  summary: string;
  weakTopics: { topic: string; wrongRate: number }[];
  reviewQuestionIds: string[];
  nextLessonSuggestions: string[];
  isMock: true;
}

export interface ImportJob {
  id: string;
  questionFileName: string;
  answerFileName: string | null;
  questionFileSize: number;
  answerFileSize: number | null;
  format: "pdf" | "word" | "image";
  status: "uploading" | "ocr_processing" | "ai_extracting" | "needs_review" | "completed" | "error";
  progress: number;
  extractedCount: number;
  matchedCount: number;
  needsReviewCount: number;
  hasFormulas: boolean;
  estimatedCost: string;
  uploadedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "assignment";
  read: boolean;
  date: string;
}

// ============================================================
// CURRENT USERS
// ============================================================

export const currentStudent: User = {
  id: "student-001",
  name: "Nguyễn Minh Anh",
  email: "minhanh@gmail.com",
  role: "student",
  grade: 10,
  school: "THPT Nguyễn Huệ",
};

export const currentTutor: User = {
  id: "tutor-001",
  name: "Thầy Trần Văn Hùng",
  email: "tvhung@gmail.com",
  role: "tutor",
};

// ============================================================
// CURRICULUM TAXONOMY (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const sampleCurriculum: Curriculum = {
  id: "cur-2018-math-10",
  name: "Chương trình Giáo dục phổ thông 2018 - Môn Toán lớp 10",
  version: "GDPT 2018",
  country: "Việt Nam",
  status: "EDITABLE",
};

export const sampleSubject: Subject = {
  id: "math",
  name: "Toán",
  code: "math",
};

export const sampleGrade: GradeInfo = {
  id: "grade-10",
  level: 10,
};

export const sampleChapters: Chapter[] = [
  { id: "chap-1", subjectId: "math", gradeId: "grade-10", name: "1. Mệnh đề và tập hợp", description: "Lập luận toán học cơ bản và các phép toán tập hợp" },
  { id: "chap-2", subjectId: "math", gradeId: "grade-10", name: "2. Bất phương trình và hệ bất phương trình bậc nhất hai ẩn", description: "Mô tả miền nghiệm của bất phương trình và hệ bất phương trình" },
  { id: "chap-3", subjectId: "math", gradeId: "grade-10", name: "3. Hàm số và đồ thị", description: "Hàm số bậc hai, parabol và dấu tam thức bậc hai" },
  { id: "chap-4", subjectId: "math", gradeId: "grade-10", name: "4. Hệ thức lượng trong tam giác", description: "Các định lý sin, cos và tính diện tích tam giác" },
  { id: "chap-5", subjectId: "math", gradeId: "grade-10", name: "5. Vectơ", description: "Các phép toán cộng, trừ, nhân vectơ với một số" },
  { id: "chap-6", subjectId: "math", gradeId: "grade-10", name: "6. Phương pháp tọa độ trong mặt phẳng", description: "Hình học giải tích đường thẳng và đường tròn" },
  { id: "chap-7", subjectId: "math", gradeId: "grade-10", name: "7. Thống kê", description: "Các số đặc trưng đo xu thế trung tâm và đo độ phân tán" },
  { id: "chap-8", subjectId: "math", gradeId: "grade-10", name: "8. Xác suất", description: "Tính toán xác suất của biến cố trong các mô hình đơn giản" },
];

export const sampleTopics: Topic[] = [
  // Chap 1
  { id: "top-1-1", chapterId: "chap-1", name: "Mệnh đề", description: "Mệnh đề toán học, mệnh đề chứa biến, mệnh đề kéo theo" },
  { id: "top-1-2", chapterId: "chap-1", name: "Tập hợp", description: "Cách xác định tập hợp, tập hợp con, tập hợp bằng nhau" },
  { id: "top-1-3", chapterId: "chap-1", name: "Các phép toán trên tập hợp", description: "Phép giao, phép hợp, hiệu của hai tập hợp, phần bù" },
  // Chap 2
  { id: "top-2-1", chapterId: "chap-2", name: "Bất phương trình bậc nhất hai ẩn", description: "Dạng tổng quát, nghiệm và miền nghiệm" },
  { id: "top-2-2", chapterId: "chap-2", name: "Hệ bất phương trình bậc nhất hai ẩn", description: "Hệ hai ẩn và xác định miền nghiệm trong mặt phẳng tọa độ" },
  // Chap 3
  { id: "top-3-1", chapterId: "chap-3", name: "Hàm số", description: "Khái niệm hàm số, tập xác định, hàm số đồng biến/nghịch biến" },
  { id: "top-3-2", chapterId: "chap-3", name: "Hàm số bậc hai", description: "Dạng y = ax^2 + bx + c (a khác 0)" },
  { id: "top-3-3", chapterId: "chap-3", name: "Đồ thị parabol", description: "Đỉnh, trục đối xứng và hướng bề lõm" },
  { id: "top-3-4", chapterId: "chap-3", name: "Dấu của tam thức bậc hai", description: "Xét dấu tam thức bậc hai và áp dụng giải bất phương trình bậc hai" },
  // Chap 4
  { id: "top-4-1", chapterId: "chap-4", name: "Hệ thức lượng trong tam giác", description: "Các định lý sin, cos và diện tích tam giác" },
  // Chap 5
  { id: "top-5-1", chapterId: "chap-5", name: "Khái niệm vectơ", description: "Độ dài, giá của vectơ, hai vectơ cùng phương, bằng nhau" },
  { id: "top-5-2", chapterId: "chap-5", name: "Tổng và hiệu vectơ", description: "Quy tắc 3 điểm, quy tắc hình bình hành" },
  { id: "top-5-3", chapterId: "chap-5", name: "Tích của vectơ với một số", description: "Định nghĩa và tính chất" },
  { id: "top-5-4", chapterId: "chap-5", name: "Tọa độ vectơ", description: "Biểu diễn vectơ qua hệ trục Oxy" },
];

// ============================================================
// QUESTION BANK (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const questionBank: Question[] = [
  // Chapter 1: Mệnh đề & Tập hợp
  {
    id: "m10-q01",
    content: "Cho mệnh đề chứa biến $P(x)$: \"$x^2 - 3x + 2 = 0$\". Phát biểu nào sau đây là mệnh đề đúng?",
    options: [
      { id: "a", label: "A", content: "$P(1)$" },
      { id: "b", label: "B", content: "$P(0)$" },
      { id: "c", label: "C", content: "$P(-1)$" },
      { id: "d", label: "D", content: "$P(3)$" },
    ],
    correctAnswer: "a",
    explanation: "Thay $x = 1$ vào phương trình ta được $1^2 - 3\\cdot 1 + 2 = 0$ (đúng). Vậy $P(1)$ là mệnh đề đúng.",
    aiExplanation: "📌 **Phương pháp:** Mệnh đề chứa biến $P(x)$ trở thành một mệnh đề đúng khi thay giá trị $x$ thỏa mãn phương trình. Nghiệm của phương trình $x^2 - 3x + 2 = 0$ là $x = 1$ hoặc $x = 2$. Do đó chỉ có $P(1)$ hoặc $P(2)$ là mệnh đề đúng.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-1",
    topicId: "top-1-1",
    questionType: "multiple_choice",
    difficulty: "easy",
    cognitiveLevel: "recognition",
    source: "Đề minh họa 2018",
    status: "READY",
    createdAt: "2025-07-06T10:00:00",
  },
  {
    id: "m10-q02",
    content: "Cho hai tập hợp $A = \\{1; 2; 3; 4; 5\\}$ và $B = \\{2; 4; 6; 8\\}$. Xác định tập hợp $A \\cap B$.",
    options: [
      { id: "a", label: "A", content: "$\\{2; 4\\}$" },
      { id: "b", label: "B", content: "$\\{1; 3; 5\\}$" },
      { id: "c", label: "C", content: "$\\{6; 8\\}$" },
      { id: "d", label: "D", content: "$\\{1; 2; 3; 4; 5; 6; 8\\}$" },
    ],
    correctAnswer: "a",
    explanation: "Tập hợp $A \\cap B$ chứa các phần tử thuộc cả hai tập hợp $A$ và $B$. Ta thấy các phần tử chung là $2$ và $4$.",
    aiExplanation: "📌 **Phương pháp:** Phép giao $A \\cap B = \\{x \\in A \\text{ và } x \\in B\\}$. Rà soát danh sách phần tử chung trong hai tập hợp $A$ và $B$ để đưa ra đáp án nhanh.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-1",
    topicId: "top-1-3",
    questionType: "multiple_choice",
    difficulty: "easy",
    cognitiveLevel: "recognition",
    source: "Sách giáo khoa Toán 10 Cánh Diều",
    status: "READY",
    createdAt: "2025-07-06T10:05:00",
  },
  {
    id: "m10-q03",
    content: "Cho tập hợp $A = \\{x \\in \\mathbb{R} \\mid (x-1)(x^2 - 4) = 0\\}$. Liệt kê các phần tử của tập hợp $A$.",
    options: [
      { id: "a", label: "A", content: "$A = \\{1; 2; -2\\}$" },
      { id: "b", label: "B", content: "$A = \\{1; 2\\}$" },
      { id: "c", label: "C", content: "$A = \\{1; 4\\}$" },
      { id: "d", label: "D", content: "$A = \\{1; -2\\}$" },
    ],
    correctAnswer: "a",
    explanation: "Giải phương trình $(x-1)(x^2 - 4) = 0$ ta được $x = 1$ hoặc $x^2 = 4 \\Leftrightarrow x = \\pm 2$. Các nghiệm này đều là số thực, vậy $A = \\{-2; 1; 2\\}$.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-1",
    topicId: "top-1-2",
    questionType: "multiple_choice",
    difficulty: "medium",
    cognitiveLevel: "understanding",
    source: "Đề kiểm tra THPT Kim Liên",
    status: "READY",
    createdAt: "2025-07-06T10:10:00",
  },

  // Chapter 3: Hàm số & đồ thị
  {
    id: "m10-q04",
    content: "Cho hàm số bậc hai $y = x^2 - 4x + 3$. Tọa độ đỉnh $I$ của parabol là:",
    options: [
      { id: "a", label: "A", content: "$I(2; -1)$" },
      { id: "b", label: "B", content: "$I(-2; -1)$" },
      { id: "c", label: "C", content: "$I(2; 1)$" },
      { id: "d", label: "D", content: "$I(-2; 1)$" },
    ],
    correctAnswer: "a",
    explanation: "Hoành độ đỉnh $x_I = -\\frac{b}{2a} = -\\frac{-4}{2\\cdot 1} = 2$. Thay $x = 2$ vào hàm số ta được tung độ đỉnh $y_I = 2^2 - 4\\cdot 2 + 3 = -1$. Vậy $I(2; -1)$.",
    aiExplanation: "📌 **Phương pháp:** Với parabol $y = ax^2 + bx + c$, đỉnh $I$ có tọa độ $x_I = -b/(2a)$, $y_I = f(x_I)$.\nTrong trường hợp này, $a=1, b=-4, c=3$:\n- $x_I = -(-4) / 2 = 2$\n- $y_I = 2^2 - 4(2) + 3 = -1$.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-3",
    topicId: "top-3-3",
    questionType: "multiple_choice",
    difficulty: "medium",
    cognitiveLevel: "understanding",
    source: "Đề học kỳ 1 THPT chuyên Hà Nội - Amsterdam",
    status: "READY",
    createdAt: "2025-07-06T10:15:00",
  },
  {
    id: "m10-q05",
    content: "Tập nghiệm của bất phương trình bậc hai $x^2 - 3x + 2 < 0$ là khoảng nào sau đây?",
    options: [
      { id: "a", label: "A", content: "$(1; 2)$" },
      { id: "b", label: "B", content: "$(-\\infty; 1) \\cup (2; +\\infty)$" },
      { id: "c", label: "C", content: "$[-1; 2]$" },
      { id: "d", label: "D", content: "$\\varnothing$" },
    ],
    correctAnswer: "a",
    explanation: "Xét tam thức bậc hai $f(x) = x^2 - 3x + 2$. Ta thấy hệ số $a = 1 > 0$ và nghiệm của tam thức là $x = 1, x = 2$. Vì đề bài yêu cầu $f(x) < 0$ nên nghiệm nằm trong khoảng hai nghiệm, tức là $x \\in (1; 2)$.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-3",
    topicId: "top-3-4",
    questionType: "multiple_choice",
    difficulty: "medium",
    cognitiveLevel: "understanding",
    source: "Đề thi thử THPT Quốc gia",
    status: "READY",
    createdAt: "2025-07-06T10:20:00",
  },

  // Chapter 5: Vectơ
  {
    id: "m10-q06",
    content: "Cho tam giác đều $ABC$ cạnh $a$. Tính độ dài của vectơ $\\vec{u} = \\vec{AB} + \\vec{AC}$.",
    options: [
      { id: "a", label: "A", content: "$a\\sqrt{3}$" },
      { id: "b", label: "B", content: "$a$" },
      { id: "c", label: "C", content: "$2a$" },
      { id: "d", label: "D", content: "$\\frac{a\\sqrt{3}}{2}$" },
    ],
    correctAnswer: "a",
    explanation: "Dựng hình bình hành $ABDC$. Vì tam giác $ABC$ đều nên $ABDC$ là hình thoi. Gọi $M$ là trung điểm của $BC$, ta có $\\vec{AB} + \\vec{AC} = \\vec{AD} = 2\\vec{AM}$. Độ dài trung tuyến tam giác đều cạnh $a$ là $AM = \\frac{a\\sqrt{3}}{2}$, do đó $|\\vec{u}| = 2\\cdot \\frac{a\\sqrt{3}}{2} = a\\sqrt{3}$.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-5",
    topicId: "top-5-2",
    questionType: "multiple_choice",
    difficulty: "hard",
    cognitiveLevel: "application",
    source: "Đề kiểm tra giữa kỳ Chuyên Nguyễn Huệ",
    status: "READY",
    createdAt: "2025-07-06T10:30:00",
  },
  {
    id: "m10-q07",
    content: "Trong mặt phẳng tọa độ $Oxy$, cho vectơ $\\vec{a} = (3; -2)$ và $\\vec{b} = (-1; 5)$. Tìm tọa độ của vectơ $\\vec{c} = 2\\vec{a} + 3\\vec{b}$.",
    options: [
      { id: "a", label: "A", content: "$(3; 11)$" },
      { id: "b", label: "B", content: "$(5; 11)$" },
      { id: "c", label: "C", content: "$(3; -9)$" },
      { id: "d", label: "D", content: "$(5; -9)$" },
    ],
    correctAnswer: "a",
    explanation: "Tọa độ của vectơ $\\vec{c} = 2\\vec{a} + 3\\vec{b} = (2\\cdot 3 + 3\\cdot (-1); 2\\cdot (-2) + 3\\cdot 5) = (6 - 3; -4 + 15) = (3; 11)$.",
    aiExplanation: "📌 **Phương pháp:** Tính toán tọa độ theo từng thành phần:\n- Hoành độ: $x_c = 2x_a + 3x_b = 2(3) + 3(-1) = 3$\n- Tung độ: $y_c = 2y_a + 3y_b = 2(-2) + 3(5) = 11$.\nVậy $\\vec{c} = (3; 11)$.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-5",
    topicId: "top-5-4",
    questionType: "multiple_choice",
    difficulty: "easy",
    cognitiveLevel: "understanding",
    source: "SGK Toán 10 Kết nối tri thức",
    status: "READY",
    createdAt: "2025-07-06T10:35:00",
  },

  // Short Answer Type Examples
  {
    id: "m10-q08",
    content: "Tìm số giao điểm của đồ thị hàm số $y = x^2 - 3x + 2$ và trục hoành.",
    correctAnswer: "2",
    explanation: "Phương trình hoành độ giao điểm: $x^2 - 3x + 2 = 0$ có $\\Delta = (-3)^2 - 4\\cdot 2 = 1 > 0$, do đó phương trình có 2 nghiệm phân biệt. Đồ thị cắt trục hoành tại 2 điểm.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-3",
    topicId: "top-3-3",
    questionType: "short_answer",
    difficulty: "easy",
    cognitiveLevel: "understanding",
    source: "Đề cương ôn tập trường Lương Thế Vinh",
    status: "READY",
    createdAt: "2025-07-06T10:40:00",
  },
  {
    id: "m10-q09",
    content: "Cho tam giác $ABC$ có cạnh $a = 6$, $b = 8$ và góc $C = 60^\\circ$. Tính diện tích $S$ của tam giác $ABC$ (Làm tròn kết quả đến hàng đơn vị).",
    correctAnswer: "21",
    explanation: "Áp dụng công thức tính diện tích tam giác: $S = \\frac{1}{2}ab\\sin C = \\frac{1}{2}\\cdot 6\\cdot 8\\cdot \\sin 60^\\circ = 24 \\cdot \\frac{\\sqrt{3}}{2} = 12\\sqrt{3} \\approx 20.78$. Làm tròn đến hàng đơn vị là 21.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-4",
    topicId: "top-4-1",
    questionType: "short_answer",
    difficulty: "medium",
    cognitiveLevel: "application",
    source: "Đề khảo sát trường Yên Hòa",
    status: "READY",
    createdAt: "2025-07-06T10:45:00",
  },

  // Sample Draft & Needs Review Questions for prototype demonstration
  {
    id: "m10-q10",
    content: "Mệnh đề phủ định của mệnh đề \"$\\forall x \\in \\mathbb{R}, x^2 + 1 > 0$\" là:",
    options: [
      { id: "a", label: "A", content: "\"$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$\"" },
      { id: "b", label: "B", content: "\"$\\exists x \\in \\mathbb{R}, x^2 + 1 < 0$\"" },
      { id: "c", label: "C", content: "\"$\\forall x \\in \\mathbb{R}, x^2 + 1 \\le 0$\"" },
      { id: "d", label: "D", content: "\"$\\exists x \\in \\mathbb{R}, x^2 + 1 > 0$\"" },
    ],
    correctAnswer: "a",
    explanation: "Phủ định của $\\forall x$ là $\\exists x$, phủ định của $>$ là $\\le$. Do đó phủ định của mệnh đề đã cho là \"$\\exists x \\in \\mathbb{R}, x^2 + 1 \\le 0$\".",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-1",
    topicId: "top-1-1",
    questionType: "multiple_choice",
    difficulty: "easy",
    cognitiveLevel: "recognition",
    source: "Sách giáo khoa Toán 10 Kết nối tri thức",
    status: "DRAFT",
    createdAt: "2025-07-06T10:50:00",
  },
  {
    id: "m10-q11",
    content: "Biểu diễn hình học miền nghiệm của hệ bất phương trình bậc nhất hai ẩn...",
    correctAnswer: "Học sinh vẽ đúng đồ thị",
    explanation: "Kiểm tra miền nghiệm trên mặt phẳng Oxy.",
    curriculumId: "cur-2018-math-10",
    subjectId: "math",
    gradeId: "grade-10",
    chapterId: "chap-2",
    topicId: "top-2-2",
    questionType: "essay",
    difficulty: "hard",
    cognitiveLevel: "application",
    source: "Sách Bài Tập Toán 10",
    status: "NEEDS_REVIEW",
    createdAt: "2025-07-06T10:55:00",
  },
];

// Compatibility exports
export const mockQuestions = questionBank.filter((q) => q.status === "READY");

// ============================================================
// CLASSES (SAMPLE / MOCK / EDITABLE)
// ============================================================

const classStudents10A1: ClassStudent[] = [
  { id: "student-001", name: "Nguyễn Minh Anh", avgScore: 8.2, totalAttempts: 12, wrongCount: 18 },
  { id: "student-002", name: "Trần Thị Bảo Ngọc", avgScore: 9.0, totalAttempts: 12, wrongCount: 8 },
  { id: "student-003", name: "Lê Hoàng Nam", avgScore: 7.0, totalAttempts: 11, wrongCount: 28 },
  { id: "student-004", name: "Phạm Minh Đức", avgScore: 5.5, totalAttempts: 8, wrongCount: 42 },
  { id: "student-005", name: "Nguyễn Thị Hương", avgScore: 8.0, totalAttempts: 12, wrongCount: 15 },
  { id: "student-006", name: "Võ Thanh Tùng", avgScore: 6.2, totalAttempts: 10, wrongCount: 35 },
  { id: "student-007", name: "Đặng Thị Lan", avgScore: 7.5, totalAttempts: 12, wrongCount: 22 },
];

export const tutorClasses: ClassInfo[] = [
  {
    id: "class-001",
    name: "Toán cơ bản 10A1",
    subject: "Toán",
    grade: 10,
    studentCount: 35,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH10A1",
    avgScore: 7.8,
    students: classStudents10A1,
  },
  {
    id: "class-002",
    name: "Toán nâng cao 10A2",
    subject: "Toán",
    grade: 10,
    studentCount: 28,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH10A2",
    avgScore: 8.1,
    students: [],
  },
];

// Compatibility
export const mockClasses = tutorClasses;

// ============================================================
// ASSIGNMENTS (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const mockAssignments: AssignmentSummary[] = [
  {
    id: "asgn-001",
    title: "Bài tập Mệnh đề & Tập hợp - Tuần 1",
    classId: "class-001",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    questionCount: 20,
    timeLimit: 45,
    dueDate: "2025-10-10T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "active",
    submittedCount: 28,
    totalStudents: 35,
    createdAt: "2025-07-06T08:00:00",
  },
  {
    id: "asgn-002",
    title: "Khảo sát Hàm số bậc hai",
    classId: "class-001",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    questionCount: 15,
    timeLimit: 40,
    dueDate: "2025-10-15T18:00:00",
    showSolutionsAfterSubmit: false,
    status: "active",
    submittedCount: 30,
    totalStudents: 35,
    createdAt: "2025-07-06T10:00:00",
  },
  {
    id: "asgn-003",
    title: "Ôn tập Hệ thức lượng",
    classId: "class-001",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    questionCount: 25,
    timeLimit: 50,
    dueDate: "2025-10-04T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "graded",
    submittedCount: 35,
    totalStudents: 35,
    createdAt: "2025-07-01T08:00:00",
  },
  {
    id: "asgn-004",
    title: "Bài tập Tọa độ Vectơ Oxy",
    classId: "class-001",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    questionCount: 10,
    timeLimit: 30,
    dueDate: "2025-10-18T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "draft",
    submittedCount: 0,
    totalStudents: 35,
    createdAt: "2025-07-06T14:00:00",
  },
];

// ============================================================
// STUDENT ATTEMPTS (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const studentAttempts: StudentAttempt[] = [
  {
    id: "attempt-001",
    assignmentId: "asgn-001",
    assignmentTitle: "Bài tập Mệnh đề & Tập hợp - Tuần 1",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    studentId: "student-001",
    studentName: "Nguyễn Minh Anh",
    answers: [
      { questionId: "m10-q01", selectedAnswer: "a", isCorrect: true, timeSpent: 30 },
      { questionId: "m10-q02", selectedAnswer: "a", isCorrect: true, timeSpent: 20 },
      { questionId: "m10-q03", selectedAnswer: "b", isCorrect: false, timeSpent: 75 },
    ],
    score: 16,
    totalQuestions: 20,
    timeSpent: 1200,
    submittedAt: "2025-07-06T14:30:00",
    status: "graded",
  },
  {
    id: "attempt-002",
    assignmentId: "asgn-002",
    assignmentTitle: "Khảo sát Hàm số bậc hai",
    className: "Toán cơ bản 10A1",
    subject: "Toán",
    studentId: "student-001",
    studentName: "Nguyễn Minh Anh",
    answers: [
      { questionId: "m10-q04", selectedAnswer: "b", isCorrect: false, timeSpent: 110 },
      { questionId: "m10-q05", selectedAnswer: "a", isCorrect: true, timeSpent: 45 },
      { questionId: "m10-q08", selectedAnswer: "2", isCorrect: true, timeSpent: 60 },
    ],
    score: 11,
    totalQuestions: 15,
    timeSpent: 980,
    submittedAt: "2025-07-06T18:15:00",
    status: "graded",
  },
];

// ============================================================
// WRONG QUESTIONS DATA (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const wrongQuestionItems: WrongQuestionItem[] = [
  {
    question: questionBank[3], // m10-q04 Hàm số bậc hai
    wrongCount: 22,
    totalAttempts: 35,
    wrongRate: 62.9,
    avgTimeSpent: 110,
    skippedCount: 3,
    studentsWrong: [
      "Nguyễn Minh Anh", "Lê Hoàng Nam", "Phạm Minh Đức",
      "Võ Thanh Tùng", "Đặng Thị Lan",
    ],
  },
  {
    question: questionBank[5], // m10-q06 Vectơ
    wrongCount: 19,
    totalAttempts: 35,
    wrongRate: 54.3,
    avgTimeSpent: 180,
    skippedCount: 5,
    studentsWrong: [
      "Nguyễn Minh Anh", "Phạm Minh Đức", "Võ Thanh Tùng",
      "Lê Hoàng Nam",
    ],
  },
  {
    question: questionBank[2], // m10-q03 Tập hợp
    wrongCount: 12,
    totalAttempts: 35,
    wrongRate: 34.3,
    avgTimeSpent: 75,
    skippedCount: 1,
    studentsWrong: [
      "Nguyễn Minh Anh", "Phạm Minh Đức",
    ],
  },
];

// ============================================================
// AI REVIEW SUMMARIES (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const aiReviewSummaries: AIReviewSummary[] = [
  {
    id: "review-001",
    assignmentId: "asgn-002",
    assignmentTitle: "Khảo sát Hàm số bậc hai",
    className: "Toán cơ bản 10A1",
    generatedAt: "2025-07-06T19:00:00",
    summary:
      "Lớp đang yếu ở chủ đề Hàm số bậc hai và Vectơ. 62,9% sai câu xác định tọa độ đỉnh Parabol (m10-q04) và 54,3% sai câu tính độ dài Vectơ tổng (m10-q06). Buổi sau nên chữa các câu 4, 6 và giao thêm bài luyện về tọa độ vectơ.",
    weakTopics: [
      { topic: "Hàm số bậc hai", wrongRate: 62.9 },
      { topic: "Tổng và hiệu vectơ", wrongRate: 54.3 },
      { topic: "Các phép toán tập hợp", wrongRate: 34.3 },
    ],
    reviewQuestionIds: ["m10-q04", "m10-q06", "m10-q03"],
    nextLessonSuggestions: [
      "Ôn tập công thức xác định tọa độ đỉnh Parabol: $I(-b/2a; -\\Delta/4a)$ (15 phút)",
      "Giải bài toán tìm độ dài tổng vectơ bằng phương pháp dựng hình bình hành (20 phút)",
      "Giao thêm 5 bài tập trắc nghiệm nhanh về phép toán giao, hợp tập hợp",
    ],
    isMock: true,
  },
];

// ============================================================
// RECENT SUBMISSIONS (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const recentSubmissions = [
  {
    id: "sub-1",
    studentName: "Trần Thị Bảo Ngọc",
    assignmentTitle: "Khảo sát Hàm số bậc hai",
    submittedAt: "2025-07-06T14:30:00",
    score: 14,
    totalScore: 15,
    status: "graded" as const,
  },
  {
    id: "sub-2",
    studentName: "Lê Hoàng Nam",
    assignmentTitle: "Khảo sát Hàm số bậc hai",
    submittedAt: "2025-07-06T13:15:00",
    score: 9,
    totalScore: 15,
    status: "graded" as const,
  },
  {
    id: "sub-3",
    studentName: "Phạm Minh Đức",
    assignmentTitle: "Bài tập Mệnh đề & Tập hợp - Tuần 1",
    submittedAt: "2025-07-06T10:00:00",
    score: 0,
    totalScore: 20,
    status: "submitted" as const,
  },
];

// ============================================================
// TUTOR STATS (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const tutorStats = {
  totalStudents: 63,
  totalClasses: 2,
  totalAssignments: 4,
  activeAssignments: 2,
  avgClassScore: 7.9,
  pendingGrading: 1,
  studentsNotSubmitted: 5,
};

// ============================================================
// IMPORT JOBS (SAMPLE / MOCK / EDITABLE)
// ============================================================

export const mockImportJobs: ImportJob[] = [
  {
    id: "import-001",
    questionFileName: "De_thi_Giua_Ky_Toan_10.pdf",
    answerFileName: "Dap_an_Giua_Ky_Toan_10.pdf",
    questionFileSize: 1850000,
    answerFileSize: 450000,
    format: "pdf",
    status: "completed",
    progress: 100,
    extractedCount: 25,
    matchedCount: 25,
    needsReviewCount: 1,
    hasFormulas: true,
    estimatedCost: "~$0.06",
    uploadedAt: "2025-07-06T10:00:00",
  },
  {
    id: "import-002",
    questionFileName: "Bai_tap_Tu_Luan_Vecto_10.docx",
    answerFileName: null,
    questionFileSize: 1200000,
    answerFileSize: null,
    format: "word",
    status: "needs_review",
    progress: 100,
    extractedCount: 10,
    matchedCount: 0,
    needsReviewCount: 10,
    hasFormulas: true,
    estimatedCost: "~$0.03",
    uploadedAt: "2025-07-06T11:30:00",
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Bài tập mới",
    message: "Thầy Hùng đã giao bài tập Mệnh đề & Tập hợp - Tuần 1",
    type: "assignment",
    read: false,
    date: "2025-07-06T08:00:00",
  },
  {
    id: "notif-2",
    title: "Sắp hết hạn!",
    message: "Bài kiểm tra Khảo sát Hàm số bậc hai sẽ hết hạn trong 12 giờ",
    type: "warning",
    read: false,
    date: "2025-07-06T07:00:00",
  },
];
