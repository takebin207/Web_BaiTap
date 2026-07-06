// ============================================================
// MOCK DATA — EStudy
// AI-powered assignment & wrong-question review platform
// ============================================================

// ============================================================
// TYPES
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

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  order: number;
}

export type QuestionStatus =
  | "DRAFT"
  | "NEEDS_REVIEW"
  | "READY"
  | "REVIEW_REQUIRED"
  | "ERROR";

export interface Question {
  id: string;
  type: "multiple_choice";
  content: string;
  options: { id: string; label: string; content: string }[];
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId: string;
  grade: number;
  topic: string;
  tags: string[];
  explanation: string;
  aiExplanation?: string;
  source?: string;
  status: QuestionStatus;
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
  timeLimit: number; // minutes, 0 = no limit
  dueDate: string;
  showSolutionsAfterSubmit: boolean;
  status: "draft" | "active" | "closed" | "graded";
  submittedCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface AssignmentDetail extends AssignmentSummary {
  questions: Question[];
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
  timeSpent: number; // seconds per question
}

export interface WrongQuestionItem {
  question: Question;
  wrongCount: number;
  totalAttempts: number;
  wrongRate: number; // percentage
  avgTimeSpent: number; // seconds
  skippedCount: number;
  studentsWrong: string[]; // student names
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
  status:
    | "uploading"
    | "ocr_processing"
    | "ai_extracting"
    | "needs_review"
    | "completed"
    | "error";
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
  grade: 11,
  school: "THPT Nguyễn Huệ",
};

export const currentTutor: User = {
  id: "tutor-001",
  name: "Thầy Trần Văn Hùng",
  email: "tvhung@gmail.com",
  role: "tutor",
};

// ============================================================
// SUBJECTS & CHAPTERS
// ============================================================

export const subjects: Subject[] = [
  {
    id: "math",
    name: "Toán học",
    icon: "📐",
    color: "#6366f1",
    chapters: [
      { id: "math-1", name: "Hàm số và đồ thị", subjectId: "math", order: 1 },
      { id: "math-2", name: "Phương trình - Bất phương trình", subjectId: "math", order: 2 },
      { id: "math-3", name: "Tổ hợp - Xác suất", subjectId: "math", order: 3 },
      { id: "math-4", name: "Dãy số - Cấp số", subjectId: "math", order: 4 },
      { id: "math-5", name: "Giới hạn", subjectId: "math", order: 5 },
      { id: "math-6", name: "Đạo hàm", subjectId: "math", order: 6 },
      { id: "math-7", name: "Logarit", subjectId: "math", order: 7 },
      { id: "math-8", name: "Hình học không gian", subjectId: "math", order: 8 },
    ],
  },
  {
    id: "physics",
    name: "Vật lý",
    icon: "⚡",
    color: "#f59e0b",
    chapters: [
      { id: "phy-1", name: "Dao động cơ", subjectId: "physics", order: 1 },
      { id: "phy-2", name: "Sóng cơ", subjectId: "physics", order: 2 },
      { id: "phy-3", name: "Dòng điện xoay chiều", subjectId: "physics", order: 3 },
      { id: "phy-4", name: "Sóng điện từ", subjectId: "physics", order: 4 },
      { id: "phy-5", name: "Quang học", subjectId: "physics", order: 5 },
    ],
  },
  {
    id: "chemistry",
    name: "Hóa học",
    icon: "🧪",
    color: "#10b981",
    chapters: [
      { id: "chem-1", name: "Este - Lipit", subjectId: "chemistry", order: 1 },
      { id: "chem-2", name: "Cacbohiđrat", subjectId: "chemistry", order: 2 },
      { id: "chem-3", name: "Amin - Amino axit - Protein", subjectId: "chemistry", order: 3 },
      { id: "chem-4", name: "Polime", subjectId: "chemistry", order: 4 },
      { id: "chem-5", name: "Đại cương kim loại", subjectId: "chemistry", order: 5 },
    ],
  },
];

// ============================================================
// QUESTION BANK
// ============================================================

export const questionBank: Question[] = [
  {
    id: "q-001",
    type: "multiple_choice",
    content: "Cho hàm số y = x³ - 3x² + 2. Tìm các khoảng đồng biến của hàm số.",
    options: [
      { id: "a", label: "A", content: "(-∞; 0) và (2; +∞)" },
      { id: "b", label: "B", content: "(-∞; -1) và (1; +∞)" },
      { id: "c", label: "C", content: "(0; 2)" },
      { id: "d", label: "D", content: "(-1; 1)" },
    ],
    correctAnswer: "a",
    difficulty: "medium",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Hàm số và đồ thị",
    chapterId: "math-1",
    grade: 12,
    topic: "Tính đơn điệu",
    tags: ["hàm số", "đồng biến", "đạo hàm"],
    explanation:
      "Ta có y' = 3x² - 6x = 3x(x - 2).\ny' = 0 ⇔ x = 0 hoặc x = 2.\nBảng biến thiên cho thấy y' > 0 khi x ∈ (-∞; 0) ∪ (2; +∞).\nVậy hàm số đồng biến trên (-∞; 0) và (2; +∞).",
    aiExplanation:
      "📌 **Phương pháp:** Để tìm khoảng đồng biến, ta cần tìm đạo hàm y' rồi xét dấu.\n\n**Bước 1:** Tính đạo hàm\ny' = 3x² - 6x = 3x(x - 2)\n\n**Bước 2:** Tìm nghiệm y' = 0\n3x(x - 2) = 0 ⇔ x = 0 hoặc x = 2\n\n**Bước 3:** Lập bảng xét dấu\n| x | -∞ | | 0 | | 2 | | +∞ |\n|---|---|---|---|---|---|---|---|\n| y' | | + | 0 | - | 0 | + | |\n\n**Bước 4:** Kết luận\nHàm số đồng biến khi y' > 0, tức là trên (-∞; 0) và (2; +∞).\n\n💡 **Mẹo:** Với hàm bậc 3 dạng y = ax³ + bx² + cx + d (a > 0), hàm số đồng biến ngoài hai nghiệm của y'.",
    source: "Đề thi THPT QG 2024",
    status: "READY",
    createdAt: "2025-06-01T10:00:00",
  },
  {
    id: "q-002",
    type: "multiple_choice",
    content: "Một con lắc lò xo dao động điều hòa theo phương ngang với biên độ A = 4 cm và tần số góc ω = 10 rad/s. Tốc độ cực đại của vật là:",
    options: [
      { id: "a", label: "A", content: "20 cm/s" },
      { id: "b", label: "B", content: "40 cm/s" },
      { id: "c", label: "C", content: "80 cm/s" },
      { id: "d", label: "D", content: "10 cm/s" },
    ],
    correctAnswer: "b",
    difficulty: "easy",
    subject: "Vật lý",
    subjectId: "physics",
    chapter: "Dao động cơ",
    chapterId: "phy-1",
    grade: 12,
    topic: "Dao động điều hòa",
    tags: ["dao động điều hòa", "con lắc lò xo", "tốc độ cực đại"],
    explanation: "Tốc độ cực đại: v_max = ωA = 10 × 4 = 40 cm/s.",
    aiExplanation:
      "📌 **Công thức cần nhớ:**\nTốc độ cực đại trong dao động điều hòa: **v_max = ωA**\n\n**Áp dụng:**\n- ω = 10 rad/s\n- A = 4 cm\n- v_max = 10 × 4 = **40 cm/s**\n\n💡 **Ghi nhớ:** Vật đạt tốc độ cực đại khi qua vị trí cân bằng (x = 0).",
    source: "Sách giáo khoa Vật lý 12",
    status: "READY",
    createdAt: "2025-06-02T14:00:00",
  },
  {
    id: "q-003",
    type: "multiple_choice",
    content: "Thủy phân hoàn toàn 17,6 gam etyl axetat (CH₃COOC₂H₅) bằng dung dịch NaOH dư. Sau phản ứng thu được bao nhiêu gam muối?",
    options: [
      { id: "a", label: "A", content: "8,2 gam" },
      { id: "b", label: "B", content: "16,4 gam" },
      { id: "c", label: "C", content: "19,2 gam" },
      { id: "d", label: "D", content: "24,6 gam" },
    ],
    correctAnswer: "b",
    difficulty: "medium",
    subject: "Hóa học",
    subjectId: "chemistry",
    chapter: "Este - Lipit",
    chapterId: "chem-1",
    grade: 12,
    topic: "Phản ứng thủy phân",
    tags: ["este", "thủy phân", "phản ứng xà phòng hóa"],
    explanation:
      "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH\nM(CH₃COOC₂H₅) = 88 g/mol\nn = 17,6/88 = 0,2 mol\nM(CH₃COONa) = 82 g/mol\nm(muối) = 0,2 × 82 = 16,4 gam",
    source: "Đề thi thử THPT 2024",
    status: "READY",
    createdAt: "2025-06-03T09:00:00",
  },
  {
    id: "q-004",
    type: "multiple_choice",
    content: "Tìm giá trị lớn nhất của hàm số f(x) = 2sinx + sin2x trên đoạn [0; π].",
    options: [
      { id: "a", label: "A", content: "3√3/2" },
      { id: "b", label: "B", content: "3" },
      { id: "c", label: "C", content: "2 + √3" },
      { id: "d", label: "D", content: "3/2" },
    ],
    correctAnswer: "a",
    difficulty: "hard",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Đạo hàm",
    chapterId: "math-6",
    grade: 12,
    topic: "Cực trị hàm số",
    tags: ["cực trị", "lượng giác", "giá trị lớn nhất"],
    explanation:
      "f'(x) = 2cosx + 2cos2x = 2cosx + 2(2cos²x - 1) = 4cos²x + 2cosx - 2\nĐặt t = cosx: 4t² + 2t - 2 = 0 → t = 1/2 hoặc t = -1\nx = π/3 hoặc x = π\nf(0) = 0, f(π/3) = 3√3/2, f(π) = 0\nGTLN = 3√3/2",
    source: "Đề thi THPT QG 2023",
    status: "READY",
    createdAt: "2025-06-05T11:00:00",
  },
  {
    id: "q-005",
    type: "multiple_choice",
    content: "Trong mạch điện xoay chiều RLC nối tiếp, khi xảy ra hiện tượng cộng hưởng thì:",
    options: [
      { id: "a", label: "A", content: "Điện áp hai đầu cuộn cảm bằng 0" },
      { id: "b", label: "B", content: "Cường độ dòng điện trong mạch đạt cực đại" },
      { id: "c", label: "C", content: "Điện áp hai đầu tụ điện bằng 0" },
      { id: "d", label: "D", content: "Công suất tiêu thụ của mạch bằng 0" },
    ],
    correctAnswer: "b",
    difficulty: "easy",
    subject: "Vật lý",
    subjectId: "physics",
    chapter: "Dòng điện xoay chiều",
    chapterId: "phy-3",
    grade: 12,
    topic: "Cộng hưởng điện",
    tags: ["cộng hưởng", "RLC", "dòng điện xoay chiều"],
    explanation: "Khi cộng hưởng: ZL = ZC, tổng trở Z = R (nhỏ nhất) → I = U/R đạt cực đại.",
    source: "Sách giáo khoa Vật lý 12",
    status: "READY",
    createdAt: "2025-06-06T08:00:00",
  },
  {
    id: "q-006",
    type: "multiple_choice",
    content: "Cho log₂3 = a. Hãy tính log₈27 theo a.",
    options: [
      { id: "a", label: "A", content: "a" },
      { id: "b", label: "B", content: "a²" },
      { id: "c", label: "C", content: "a³" },
      { id: "d", label: "D", content: "3a" },
    ],
    correctAnswer: "a",
    difficulty: "hard",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Logarit",
    chapterId: "math-7",
    grade: 12,
    topic: "Phép biến đổi logarit",
    tags: ["logarit", "biến đổi", "tính toán"],
    explanation:
      "log₈27 = log₈(3³) = 3·log₈3 = 3·(log₂3/log₂8) = 3·(a/3) = a.",
    source: "Đề thi thử Hà Nội 2024",
    status: "READY",
    createdAt: "2025-06-07T10:00:00",
  },
  {
    id: "q-007",
    type: "multiple_choice",
    content: "Aminoaxit nào sau đây có hai nhóm amino?",
    options: [
      { id: "a", label: "A", content: "Glyxin (Gly)" },
      { id: "b", label: "B", content: "Alanin (Ala)" },
      { id: "c", label: "C", content: "Lysin (Lys)" },
      { id: "d", label: "D", content: "Axit glutamic (Glu)" },
    ],
    correctAnswer: "c",
    difficulty: "easy",
    subject: "Hóa học",
    subjectId: "chemistry",
    chapter: "Amin - Amino axit - Protein",
    chapterId: "chem-3",
    grade: 12,
    topic: "Amino axit",
    tags: ["amino axit", "cấu tạo", "lysin"],
    explanation:
      "Lysin (Lys): H₂N-[CH₂]₄-CH(NH₂)-COOH có 2 nhóm -NH₂ và 1 nhóm -COOH.",
    source: "SGK Hóa học 12",
    status: "READY",
    createdAt: "2025-06-08T09:00:00",
  },
  {
    id: "q-008",
    type: "multiple_choice",
    content: "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA ⊥ (ABCD) và SA = a√2. Tính góc giữa đường thẳng SC và mặt phẳng (ABCD).",
    options: [
      { id: "a", label: "A", content: "45°" },
      { id: "b", label: "B", content: "60°" },
      { id: "c", label: "C", content: "30°" },
      { id: "d", label: "D", content: "arctan(√2/√3)" },
    ],
    correctAnswer: "a",
    difficulty: "hard",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Hình học không gian",
    chapterId: "math-8",
    grade: 12,
    topic: "Góc và khoảng cách",
    tags: ["hình chóp", "góc", "hình học không gian"],
    explanation:
      "SC chiếu xuống (ABCD) là AC.\nAC = a√2 (đường chéo hình vuông cạnh a).\ntan(góc) = SA/AC = a√2 / a√2 = 1 → góc = 45°.",
    source: "Đề thi THPT QG 2023",
    status: "READY",
    createdAt: "2025-06-10T15:00:00",
  },
  {
    id: "q-009",
    type: "multiple_choice",
    content: "Sóng cơ truyền trong một môi trường với bước sóng λ = 0,4 m và tần số f = 500 Hz. Tốc độ truyền sóng là:",
    options: [
      { id: "a", label: "A", content: "100 m/s" },
      { id: "b", label: "B", content: "200 m/s" },
      { id: "c", label: "C", content: "250 m/s" },
      { id: "d", label: "D", content: "300 m/s" },
    ],
    correctAnswer: "b",
    difficulty: "easy",
    subject: "Vật lý",
    subjectId: "physics",
    chapter: "Sóng cơ",
    chapterId: "phy-2",
    grade: 12,
    topic: "Đại cương sóng cơ",
    tags: ["sóng cơ", "tốc độ truyền sóng"],
    explanation: "v = λ·f = 0,4 × 500 = 200 m/s.",
    source: "SGK Vật lý 12",
    status: "READY",
    createdAt: "2025-06-12T08:00:00",
  },
  {
    id: "q-010",
    type: "multiple_choice",
    content: "Polime nào sau đây được tổng hợp bằng phản ứng trùng ngưng?",
    options: [
      { id: "a", label: "A", content: "Polietilen (PE)" },
      { id: "b", label: "B", content: "Poli(vinyl clorua) (PVC)" },
      { id: "c", label: "C", content: "Nilon-6,6" },
      { id: "d", label: "D", content: "Cao su buna" },
    ],
    correctAnswer: "c",
    difficulty: "easy",
    subject: "Hóa học",
    subjectId: "chemistry",
    chapter: "Polime",
    chapterId: "chem-4",
    grade: 12,
    topic: "Phản ứng trùng hợp và trùng ngưng",
    tags: ["polime", "trùng ngưng", "nilon"],
    explanation:
      "Nilon-6,6 được tổng hợp bằng phản ứng trùng ngưng giữa hexametylenđiamin và axit ađipic.",
    source: "SGK Hóa học 12",
    status: "READY",
    createdAt: "2025-06-14T11:00:00",
  },
  // Draft / review statuses for question bank demo
  {
    id: "q-011",
    type: "multiple_choice",
    content: "Tìm tập xác định của hàm số y = log₂(x² - 4).",
    options: [
      { id: "a", label: "A", content: "(-∞; -2) ∪ (2; +∞)" },
      { id: "b", label: "B", content: "(-2; 2)" },
      { id: "c", label: "C", content: "ℝ \\ {-2; 2}" },
      { id: "d", label: "D", content: "(-∞; -2] ∪ [2; +∞)" },
    ],
    correctAnswer: "a",
    difficulty: "medium",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Logarit",
    chapterId: "math-7",
    grade: 12,
    topic: "Hàm số logarit",
    tags: ["logarit", "tập xác định"],
    explanation: "Điều kiện: x² - 4 > 0 ⇔ x < -2 hoặc x > 2.",
    status: "DRAFT",
    createdAt: "2025-07-01T10:00:00",
  },
  {
    id: "q-012",
    type: "multiple_choice",
    content: "Kim loại nào sau đây có tính khử mạnh nhất?",
    options: [
      { id: "a", label: "A", content: "Fe" },
      { id: "b", label: "B", content: "Al" },
      { id: "c", label: "C", content: "Cu" },
      { id: "d", label: "D", content: "K" },
    ],
    correctAnswer: "d",
    difficulty: "easy",
    subject: "Hóa học",
    subjectId: "chemistry",
    chapter: "Đại cương kim loại",
    chapterId: "chem-5",
    grade: 12,
    topic: "Dãy điện hóa",
    tags: ["kim loại", "tính khử", "dãy điện hóa"],
    explanation: "Theo dãy điện hóa: K > Al > Fe > Cu nên K có tính khử mạnh nhất.",
    status: "NEEDS_REVIEW",
    createdAt: "2025-07-02T14:00:00",
  },
  {
    id: "q-013",
    type: "multiple_choice",
    content: "[Câu hỏi nhập từ PDF - cần xem lại] Cho hàm số y = ...",
    options: [
      { id: "a", label: "A", content: "..." },
      { id: "b", label: "B", content: "..." },
      { id: "c", label: "C", content: "..." },
      { id: "d", label: "D", content: "..." },
    ],
    correctAnswer: "a",
    difficulty: "medium",
    subject: "Toán học",
    subjectId: "math",
    chapter: "Đạo hàm",
    chapterId: "math-6",
    grade: 12,
    topic: "Ứng dụng đạo hàm",
    tags: ["đạo hàm"],
    explanation: "Cần giáo viên bổ sung lời giải.",
    status: "ERROR",
    createdAt: "2025-07-03T08:00:00",
  },
];

// Backward compatibility — pages that used `mockQuestions`
export const mockQuestions = questionBank.filter((q) => q.status === "READY");

// ============================================================
// CLASSES
// ============================================================

const classStudents12A1: ClassStudent[] = [
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
    name: "Toán nâng cao 12A1",
    subject: "Toán học",
    grade: 12,
    studentCount: 35,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH12A1",
    avgScore: 7.8,
    students: classStudents12A1,
  },
  {
    id: "class-002",
    name: "Toán cơ bản 11B2",
    subject: "Toán học",
    grade: 11,
    studentCount: 40,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH11B2",
    avgScore: 6.5,
    students: [],
  },
  {
    id: "class-003",
    name: "Luyện đề Toán THPT",
    subject: "Toán học",
    grade: 12,
    studentCount: 45,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATHDE25",
    avgScore: 7.1,
    students: [],
  },
];

// Backward compatibility
export const mockClasses = tutorClasses;

// ============================================================
// ASSIGNMENTS
// ============================================================

export const mockAssignments: AssignmentSummary[] = [
  {
    id: "asgn-001",
    title: "Bài tập Đạo hàm - Tuần 27",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    questionCount: 20,
    timeLimit: 45,
    dueDate: "2025-07-10T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "active",
    submittedCount: 28,
    totalStudents: 35,
    createdAt: "2025-07-03T08:00:00",
  },
  {
    id: "asgn-002",
    title: "Kiểm tra Dao động cơ",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Vật lý",
    questionCount: 30,
    timeLimit: 60,
    dueDate: "2025-07-08T18:00:00",
    showSolutionsAfterSubmit: false,
    status: "active",
    submittedCount: 30,
    totalStudents: 35,
    createdAt: "2025-07-01T10:00:00",
  },
  {
    id: "asgn-003",
    title: "Ôn tập Este - Lipit",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Hóa học",
    questionCount: 25,
    timeLimit: 40,
    dueDate: "2025-07-04T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "graded",
    submittedCount: 35,
    totalStudents: 35,
    createdAt: "2025-06-28T08:00:00",
  },
  {
    id: "asgn-004",
    title: "Bài tập Hình học không gian",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    questionCount: 15,
    timeLimit: 30,
    dueDate: "2025-07-12T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "draft",
    submittedCount: 0,
    totalStudents: 35,
    createdAt: "2025-07-05T14:00:00",
  },
  {
    id: "asgn-005",
    title: "Logarit và ứng dụng",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    questionCount: 20,
    timeLimit: 45,
    dueDate: "2025-07-15T23:59:00",
    showSolutionsAfterSubmit: true,
    status: "active",
    submittedCount: 15,
    totalStudents: 35,
    createdAt: "2025-07-05T09:00:00",
  },
];

// ============================================================
// STUDENT ATTEMPTS (for student practice + result pages)
// ============================================================

export const studentAttempts: StudentAttempt[] = [
  {
    id: "attempt-001",
    assignmentId: "asgn-001",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 27",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    studentId: "student-001",
    studentName: "Nguyễn Minh Anh",
    answers: [
      { questionId: "q-001", selectedAnswer: "a", isCorrect: true, timeSpent: 65 },
      { questionId: "q-004", selectedAnswer: "c", isCorrect: false, timeSpent: 180 },
      { questionId: "q-006", selectedAnswer: "b", isCorrect: false, timeSpent: 120 },
      { questionId: "q-008", selectedAnswer: "a", isCorrect: true, timeSpent: 95 },
      { questionId: "q-011", selectedAnswer: null, isCorrect: false, timeSpent: 10 },
    ],
    score: 16,
    totalQuestions: 20,
    timeSpent: 2340,
    submittedAt: "2025-07-05T14:30:00",
    status: "graded",
  },
  {
    id: "attempt-002",
    assignmentId: "asgn-002",
    assignmentTitle: "Kiểm tra Dao động cơ",
    className: "Toán nâng cao 12A1",
    subject: "Vật lý",
    studentId: "student-001",
    studentName: "Nguyễn Minh Anh",
    answers: [
      { questionId: "q-002", selectedAnswer: "b", isCorrect: true, timeSpent: 45 },
      { questionId: "q-005", selectedAnswer: "a", isCorrect: false, timeSpent: 90 },
      { questionId: "q-009", selectedAnswer: "b", isCorrect: true, timeSpent: 30 },
    ],
    score: 22,
    totalQuestions: 30,
    timeSpent: 3200,
    submittedAt: "2025-07-06T10:15:00",
    status: "graded",
  },
  {
    id: "attempt-003",
    assignmentId: "asgn-005",
    assignmentTitle: "Logarit và ứng dụng",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    studentId: "student-001",
    studentName: "Nguyễn Minh Anh",
    answers: [],
    score: 0,
    totalQuestions: 20,
    timeSpent: 0,
    submittedAt: null,
    status: "not_started",
  },
];

// ============================================================
// WRONG QUESTIONS DATA (aggregated for tutor review)
// ============================================================

export const wrongQuestionItems: WrongQuestionItem[] = [
  {
    question: questionBank[3], // q-004 Cực trị hàm số
    wrongCount: 22,
    totalAttempts: 35,
    wrongRate: 62.9,
    avgTimeSpent: 175,
    skippedCount: 3,
    studentsWrong: [
      "Nguyễn Minh Anh", "Lê Hoàng Nam", "Phạm Minh Đức",
      "Võ Thanh Tùng", "Đặng Thị Lan",
    ],
  },
  {
    question: questionBank[5], // q-006 Logarit
    wrongCount: 19,
    totalAttempts: 35,
    wrongRate: 54.3,
    avgTimeSpent: 130,
    skippedCount: 5,
    studentsWrong: [
      "Nguyễn Minh Anh", "Phạm Minh Đức", "Võ Thanh Tùng",
      "Lê Hoàng Nam",
    ],
  },
  {
    question: questionBank[7], // q-008 Hình học không gian
    wrongCount: 18,
    totalAttempts: 35,
    wrongRate: 51.4,
    avgTimeSpent: 200,
    skippedCount: 8,
    studentsWrong: [
      "Phạm Minh Đức", "Võ Thanh Tùng", "Đặng Thị Lan",
    ],
  },
  {
    question: questionBank[4], // q-005 Cộng hưởng RLC
    wrongCount: 12,
    totalAttempts: 35,
    wrongRate: 34.3,
    avgTimeSpent: 85,
    skippedCount: 2,
    studentsWrong: [
      "Phạm Minh Đức", "Lê Hoàng Nam",
    ],
  },
  {
    question: questionBank[0], // q-001 Đồng biến
    wrongCount: 8,
    totalAttempts: 35,
    wrongRate: 22.9,
    avgTimeSpent: 70,
    skippedCount: 0,
    studentsWrong: [
      "Phạm Minh Đức",
    ],
  },
];

// ============================================================
// AI REVIEW SUMMARIES (mock)
// ============================================================

export const aiReviewSummaries: AIReviewSummary[] = [
  {
    id: "review-001",
    assignmentId: "asgn-001",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 27",
    className: "Toán nâng cao 12A1",
    generatedAt: "2025-07-06T08:00:00",
    summary:
      "Đa số học sinh gặp khó ở phép biến đổi logarit và cực trị hàm số. 62,9% sai câu cực trị (q-004) và 54,3% sai câu logarit (q-006). Hình học không gian cũng là điểm yếu với 51,4% sai và nhiều em bỏ qua. Nên ôn lại câu 4, 6 và 8 trong buổi học sau.",
    weakTopics: [
      { topic: "Cực trị hàm số", wrongRate: 62.9 },
      { topic: "Phép biến đổi logarit", wrongRate: 54.3 },
      { topic: "Góc trong hình học không gian", wrongRate: 51.4 },
    ],
    reviewQuestionIds: ["q-004", "q-006", "q-008"],
    nextLessonSuggestions: [
      "Ôn lại phương pháp tìm cực trị hàm lượng giác (15 phút)",
      "Luyện tập biến đổi logarit cơ bản trước khi nâng cao (20 phút)",
      "Cho thêm bài tập hình chóp có SA ⊥ đáy (10 phút)",
      "Ra 5 câu trắc nghiệm nhanh kiểm tra lại các dạng trên",
    ],
    isMock: true,
  },
];

// ============================================================
// RECENT SUBMISSIONS (for tutor dashboard)
// ============================================================

export const recentSubmissions = [
  {
    id: "sub-1",
    studentName: "Trần Thị Bảo Ngọc",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 27",
    submittedAt: "2025-07-05T14:30:00",
    score: 18,
    totalScore: 20,
    status: "graded" as const,
  },
  {
    id: "sub-2",
    studentName: "Lê Hoàng Nam",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 27",
    submittedAt: "2025-07-05T13:15:00",
    score: 14,
    totalScore: 20,
    status: "graded" as const,
  },
  {
    id: "sub-3",
    studentName: "Phạm Minh Đức",
    assignmentTitle: "Kiểm tra Dao động cơ",
    submittedAt: "2025-07-05T10:00:00",
    score: 0,
    totalScore: 30,
    status: "submitted" as const,
  },
  {
    id: "sub-4",
    studentName: "Nguyễn Thị Hương",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 27",
    submittedAt: "2025-07-04T22:45:00",
    score: 16,
    totalScore: 20,
    status: "graded" as const,
  },
  {
    id: "sub-5",
    studentName: "Võ Thanh Tùng",
    assignmentTitle: "Kiểm tra Dao động cơ",
    submittedAt: "2025-07-04T20:30:00",
    score: 0,
    totalScore: 30,
    status: "submitted" as const,
  },
];

// ============================================================
// TUTOR STATS (simplified for dashboard)
// ============================================================

export const tutorStats = {
  totalStudents: 120,
  totalClasses: 3,
  totalAssignments: 24,
  activeAssignments: 3,
  avgClassScore: 7.1,
  pendingGrading: 2,
  studentsNotSubmitted: 7,
};

// ============================================================
// IMPORT JOBS (mock)
// ============================================================

export const mockImportJobs: ImportJob[] = [
  {
    id: "import-001",
    questionFileName: "De_thi_THPT_2024_Toan.pdf",
    answerFileName: "Dap_an_THPT_2024_Toan.pdf",
    questionFileSize: 2450000,
    answerFileSize: 580000,
    format: "pdf",
    status: "completed",
    progress: 100,
    extractedCount: 50,
    matchedCount: 48,
    needsReviewCount: 2,
    hasFormulas: true,
    estimatedCost: "~$0.12",
    uploadedAt: "2025-07-03T10:00:00",
  },
  {
    id: "import-002",
    questionFileName: "Bai_tap_Dao_ham_chuong_5.pdf",
    answerFileName: null,
    questionFileSize: 1800000,
    answerFileSize: null,
    format: "pdf",
    status: "needs_review",
    progress: 85,
    extractedCount: 28,
    matchedCount: 0,
    needsReviewCount: 28,
    hasFormulas: true,
    estimatedCost: "~$0.08",
    uploadedAt: "2025-07-04T14:30:00",
  },
  {
    id: "import-003",
    questionFileName: "De_cuong_Vat_ly_12.docx",
    answerFileName: "Dap_an_Vat_ly_12.docx",
    questionFileSize: 3200000,
    answerFileSize: 1200000,
    format: "word",
    status: "ai_extracting",
    progress: 45,
    extractedCount: 36,
    matchedCount: 20,
    needsReviewCount: 16,
    hasFormulas: false,
    estimatedCost: "~$0.15",
    uploadedAt: "2025-07-05T08:00:00",
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Bài tập mới",
    message: "Thầy Hùng đã giao bài tập Đạo hàm - Tuần 27",
    type: "assignment",
    read: false,
    date: "2025-07-05T08:00:00",
  },
  {
    id: "notif-2",
    title: "Sắp hết hạn!",
    message: "Kiểm tra Dao động cơ sẽ hết hạn trong 24 giờ",
    type: "warning",
    read: false,
    date: "2025-07-05T07:00:00",
  },
  {
    id: "notif-3",
    title: "Đã chấm bài",
    message: "Bài tập Este - Lipit đã được chấm. Điểm: 21/25",
    type: "success",
    read: true,
    date: "2025-07-04T20:00:00",
  },
  {
    id: "notif-4",
    title: "2 bài nộp mới",
    message: "Phạm Minh Đức và Võ Thanh Tùng đã nộp bài Kiểm tra Dao động cơ",
    type: "info",
    read: true,
    date: "2025-07-04T12:00:00",
  },
];
