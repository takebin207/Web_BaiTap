// ============================================================
// MOCK DATA - Vietnamese AI Learning Platform
// Realistic data simulating a platform used by hundreds of students
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

export interface Question {
  id: string;
  type: "multiple_choice" | "essay";
  content: string;
  images?: string[];
  options?: { id: string; label: string; content: string }[];
  correctAnswer?: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  subject: string;
  chapter: string;
  grade: number;
  tags: string[];
  explanation?: string;
  aiExplanation?: string;
  source?: string;
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
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  subject: string;
  dueDate: string;
  questionCount: number;
  status: "pending" | "in_progress" | "submitted" | "graded";
  score?: number;
  totalScore?: number;
}

export interface LearningStats {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  totalTime: number; // minutes
  weeklyProgress: { day: string; questions: number; correct: number }[];
  subjectAccuracy: { subject: string; accuracy: number; total: number }[];
  weakTopics: { topic: string; subject: string; accuracy: number }[];
  recentActivity: {
    id: string;
    type: "practice" | "homework" | "review";
    subject: string;
    title: string;
    score: number;
    date: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "homework";
  read: boolean;
  date: string;
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentAvatar?: string;
  assignmentTitle: string;
  submittedAt: string;
  score: number;
  totalScore: number;
  status: "submitted" | "graded";
}

export interface PDFImportJob {
  id: string;
  fileName: string;
  fileSize: number;
  status: "uploading" | "ocr" | "extracting" | "reviewing" | "completed" | "failed";
  progress: number;
  totalQuestions: number;
  extractedQuestions: number;
  uploadedAt: string;
}

// ============================================================
// CURRENT USER
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
      { id: "math-7", name: "Hình học không gian", subjectId: "math", order: 7 },
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
// QUESTIONS - Realistic Vietnamese content
// ============================================================

export const mockQuestions: Question[] = [
  {
    id: "q-001",
    type: "multiple_choice",
    content:
      "Cho hàm số y = x³ - 3x² + 2. Tìm các khoảng đồng biến của hàm số.",
    options: [
      { id: "a", label: "A", content: "(-∞; 0) và (2; +∞)" },
      { id: "b", label: "B", content: "(-∞; -1) và (1; +∞)" },
      { id: "c", label: "C", content: "(0; 2)" },
      { id: "d", label: "D", content: "(-1; 1)" },
    ],
    correctAnswer: "a",
    difficulty: "medium",
    subject: "Toán học",
    chapter: "Hàm số và đồ thị",
    grade: 12,
    tags: ["hàm số", "đồng biến", "đạo hàm"],
    explanation:
      "Ta có y' = 3x² - 6x = 3x(x - 2).\ny' = 0 ⇔ x = 0 hoặc x = 2.\nBảng biến thiên cho thấy y' > 0 khi x ∈ (-∞; 0) ∪ (2; +∞).\nVậy hàm số đồng biến trên (-∞; 0) và (2; +∞).",
    aiExplanation:
      "📌 **Phương pháp:** Để tìm khoảng đồng biến, ta cần tìm đạo hàm y' rồi xét dấu.\n\n**Bước 1:** Tính đạo hàm\ny' = 3x² - 6x = 3x(x - 2)\n\n**Bước 2:** Tìm nghiệm y' = 0\n3x(x - 2) = 0 ⇔ x = 0 hoặc x = 2\n\n**Bước 3:** Lập bảng xét dấu\n| x | -∞ | | 0 | | 2 | | +∞ |\n|---|---|---|---|---|---|---|---|\n| y' | | + | 0 | - | 0 | + | |\n\n**Bước 4:** Kết luận\nHàm số đồng biến khi y' > 0, tức là trên (-∞; 0) và (2; +∞).\n\n💡 **Mẹo:** Với hàm bậc 3 dạng y = ax³ + bx² + cx + d (a > 0), hàm số đồng biến ngoài hai nghiệm của y'.",
    source: "Đề thi THPT QG 2024",
  },
  {
    id: "q-002",
    type: "multiple_choice",
    content:
      'Một con lắc lò xo dao động điều hòa theo phương ngang với biên độ A = 4 cm và tần số góc ω = 10 rad/s. Tốc độ cực đại của vật là:',
    options: [
      { id: "a", label: "A", content: "20 cm/s" },
      { id: "b", label: "B", content: "40 cm/s" },
      { id: "c", label: "C", content: "80 cm/s" },
      { id: "d", label: "D", content: "10 cm/s" },
    ],
    correctAnswer: "b",
    difficulty: "easy",
    subject: "Vật lý",
    chapter: "Dao động cơ",
    grade: 12,
    tags: ["dao động điều hòa", "con lắc lò xo", "tốc độ cực đại"],
    explanation:
      "Tốc độ cực đại: v_max = ωA = 10 × 4 = 40 cm/s.",
    aiExplanation:
      "📌 **Công thức cần nhớ:**\nTốc độ cực đại trong dao động điều hòa: **v_max = ωA**\n\n**Áp dụng:**\n- ω = 10 rad/s\n- A = 4 cm\n- v_max = 10 × 4 = **40 cm/s**\n\n💡 **Ghi nhớ:** Vật đạt tốc độ cực đại khi qua vị trí cân bằng (x = 0).",
    source: "Sách giáo khoa Vật lý 12",
  },
  {
    id: "q-003",
    type: "multiple_choice",
    content:
      "Thủy phân hoàn toàn 17,6 gam etyl axetat (CH₃COOC₂H₅) bằng dung dịch NaOH dư. Sau phản ứng thu được bao nhiêu gam muối?",
    options: [
      { id: "a", label: "A", content: "8,2 gam" },
      { id: "b", label: "B", content: "16,4 gam" },
      { id: "c", label: "C", content: "19,2 gam" },
      { id: "d", label: "D", content: "24,6 gam" },
    ],
    correctAnswer: "b",
    difficulty: "medium",
    subject: "Hóa học",
    chapter: "Este - Lipit",
    grade: 12,
    tags: ["este", "thủy phân", "phản ứng xà phòng hóa"],
    explanation:
      "CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH\nM(CH₃COOC₂H₅) = 88 g/mol\nn = 17,6/88 = 0,2 mol\nM(CH₃COONa) = 82 g/mol\nm(muối) = 0,2 × 82 = 16,4 gam",
    aiExplanation:
      "📌 **Phản ứng xà phòng hóa este:**\n\nCH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH\n\n**Bước 1:** Tính số mol este\n- M(CH₃COOC₂H₅) = 12×4 + 8 + 16×2 = 88 g/mol\n- n = 17,6 ÷ 88 = **0,2 mol**\n\n**Bước 2:** Theo PTHH, tỉ lệ 1:1\n- n(CH₃COONa) = n(este) = 0,2 mol\n\n**Bước 3:** Tính khối lượng muối\n- M(CH₃COONa) = 12×2 + 3 + 16×2 + 23 = 82 g/mol\n- m = 0,2 × 82 = **16,4 gam**\n\n💡 **Mẹo:** Trong phản ứng xà phòng hóa, este + NaOH luôn cho muối + ancol.",
    source: "Đề thi thử THPT 2024",
  },
  {
    id: "q-004",
    type: "multiple_choice",
    content:
      "Tìm giá trị lớn nhất của hàm số f(x) = 2sinx + sin2x trên đoạn [0; π].",
    options: [
      { id: "a", label: "A", content: "3√3/2" },
      { id: "b", label: "B", content: "3" },
      { id: "c", label: "C", content: "2 + √3" },
      { id: "d", label: "D", content: "3/2" },
    ],
    correctAnswer: "a",
    difficulty: "hard",
    subject: "Toán học",
    chapter: "Đạo hàm",
    grade: 12,
    tags: ["cực trị", "lượng giác", "giá trị lớn nhất"],
    explanation:
      "f'(x) = 2cosx + 2cos2x = 2cosx + 2(2cos²x - 1) = 4cos²x + 2cosx - 2\nĐặt t = cosx: 4t² + 2t - 2 = 0 → t = 1/2 hoặc t = -1\nx = π/3 hoặc x = π\nf(0) = 0, f(π/3) = 3√3/2, f(π) = 0\nGTLN = 3√3/2",
    source: "Đề thi THPT QG 2023",
  },
  {
    id: "q-005",
    type: "multiple_choice",
    content:
      "Trong mạch điện xoay chiều RLC nối tiếp, khi xảy ra hiện tượng cộng hưởng thì:",
    options: [
      { id: "a", label: "A", content: "Điện áp hai đầu cuộn cảm bằng 0" },
      { id: "b", label: "B", content: "Cường độ dòng điện trong mạch đạt cực đại" },
      { id: "c", label: "C", content: "Điện áp hai đầu tụ điện bằng 0" },
      { id: "d", label: "D", content: "Công suất tiêu thụ của mạch bằng 0" },
    ],
    correctAnswer: "b",
    difficulty: "easy",
    subject: "Vật lý",
    chapter: "Dòng điện xoay chiều",
    grade: 12,
    tags: ["cộng hưởng", "RLC", "dòng điện xoay chiều"],
    explanation:
      "Khi cộng hưởng: ZL = ZC, tổng trở Z = R (nhỏ nhất) → I = U/R đạt cực đại.",
    source: "Sách giáo khoa Vật lý 12",
  },
];

// ============================================================
// LEARNING STATISTICS
// ============================================================

export const studentStats: LearningStats = {
  totalQuestions: 1247,
  correctAnswers: 892,
  streak: 7,
  totalTime: 4520,
  weeklyProgress: [
    { day: "T2", questions: 25, correct: 18 },
    { day: "T3", questions: 32, correct: 27 },
    { day: "T4", questions: 18, correct: 14 },
    { day: "T5", questions: 28, correct: 22 },
    { day: "T6", questions: 35, correct: 30 },
    { day: "T7", questions: 42, correct: 35 },
    { day: "CN", questions: 15, correct: 12 },
  ],
  subjectAccuracy: [
    { subject: "Toán học", accuracy: 78, total: 520 },
    { subject: "Vật lý", accuracy: 65, total: 380 },
    { subject: "Hóa học", accuracy: 72, total: 347 },
  ],
  weakTopics: [
    { topic: "Dòng điện xoay chiều", subject: "Vật lý", accuracy: 42 },
    { topic: "Hình học không gian", subject: "Toán học", accuracy: 48 },
    { topic: "Amin - Amino axit", subject: "Hóa học", accuracy: 51 },
    { topic: "Tổ hợp - Xác suất", subject: "Toán học", accuracy: 55 },
    { topic: "Sóng cơ", subject: "Vật lý", accuracy: 58 },
  ],
  recentActivity: [
    {
      id: "act-1",
      type: "practice",
      subject: "Toán học",
      title: "Luyện tập: Đạo hàm",
      score: 85,
      date: "2025-07-05T10:30:00",
    },
    {
      id: "act-2",
      type: "homework",
      subject: "Vật lý",
      title: "Bài tập: Dao động cơ",
      score: 72,
      date: "2025-07-04T15:45:00",
    },
    {
      id: "act-3",
      type: "practice",
      subject: "Hóa học",
      title: "Luyện tập: Este - Lipit",
      score: 90,
      date: "2025-07-04T09:00:00",
    },
    {
      id: "act-4",
      type: "review",
      subject: "Toán học",
      title: "Ôn tập: Hàm số",
      score: 68,
      date: "2025-07-03T14:20:00",
    },
    {
      id: "act-5",
      type: "homework",
      subject: "Hóa học",
      title: "Bài kiểm tra: Cacbohidrat",
      score: 78,
      date: "2025-07-02T16:00:00",
    },
  ],
};

// ============================================================
// CLASSES
// ============================================================

export const mockClasses: ClassInfo[] = [
  {
    id: "class-001",
    name: "Toán nâng cao 12A1",
    subject: "Toán học",
    grade: 12,
    studentCount: 35,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH12A1",
    avgScore: 7.8,
  },
  {
    id: "class-002",
    name: "Lý THPT QG 2025",
    subject: "Vật lý",
    grade: 12,
    studentCount: 28,
    tutorName: "Cô Nguyễn Thị Mai",
    inviteCode: "PHY2025",
    avgScore: 6.9,
  },
  {
    id: "class-003",
    name: "Hóa ôn thi ĐH",
    subject: "Hóa học",
    grade: 12,
    studentCount: 32,
    tutorName: "Thầy Lê Hoàng Phúc",
    inviteCode: "CHEM2025",
    avgScore: 7.2,
  },
];

// ============================================================
// ASSIGNMENTS
// ============================================================

export const mockAssignments: Assignment[] = [
  {
    id: "asgn-001",
    title: "Bài tập Đạo hàm - Tuần 27",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    dueDate: "2025-07-08T23:59:00",
    questionCount: 20,
    status: "pending",
  },
  {
    id: "asgn-002",
    title: "Kiểm tra Dao động cơ",
    classId: "class-002",
    className: "Lý THPT QG 2025",
    subject: "Vật lý",
    dueDate: "2025-07-06T18:00:00",
    questionCount: 30,
    status: "in_progress",
    score: 15,
    totalScore: 30,
  },
  {
    id: "asgn-003",
    title: "Ôn tập Este - Lipit",
    classId: "class-003",
    className: "Hóa ôn thi ĐH",
    subject: "Hóa học",
    dueDate: "2025-07-04T23:59:00",
    questionCount: 25,
    status: "graded",
    score: 21,
    totalScore: 25,
  },
  {
    id: "asgn-004",
    title: "Bài tập Hình học không gian",
    classId: "class-001",
    className: "Toán nâng cao 12A1",
    subject: "Toán học",
    dueDate: "2025-07-10T23:59:00",
    questionCount: 15,
    status: "pending",
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
    type: "homework",
    read: false,
    date: "2025-07-05T08:00:00",
  },
  {
    id: "notif-2",
    title: "Sắp hết hạn!",
    message: "Bài kiểm tra Dao động cơ sẽ hết hạn trong 24 giờ",
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
    title: "Gợi ý AI",
    message: "Bạn nên ôn tập thêm về Dòng điện xoay chiều - độ chính xác chỉ 42%",
    type: "info",
    read: true,
    date: "2025-07-04T12:00:00",
  },
];

// ============================================================
// TUTOR DATA
// ============================================================

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
  },
  {
    id: "class-004",
    name: "Toán cơ bản 11B2",
    subject: "Toán học",
    grade: 11,
    studentCount: 40,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATH11B2",
    avgScore: 6.5,
  },
  {
    id: "class-005",
    name: "Luyện đề Toán THPT",
    subject: "Toán học",
    grade: 12,
    studentCount: 45,
    tutorName: "Thầy Trần Văn Hùng",
    inviteCode: "MATHDE25",
    avgScore: 7.1,
  },
];

export const recentSubmissions: StudentSubmission[] = [
  {
    id: "sub-1",
    studentName: "Trần Thị Bảo Ngọc",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 26",
    submittedAt: "2025-07-05T14:30:00",
    score: 18,
    totalScore: 20,
    status: "graded",
  },
  {
    id: "sub-2",
    studentName: "Lê Hoàng Nam",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 26",
    submittedAt: "2025-07-05T13:15:00",
    score: 14,
    totalScore: 20,
    status: "graded",
  },
  {
    id: "sub-3",
    studentName: "Phạm Minh Đức",
    assignmentTitle: "Kiểm tra giữa kỳ",
    submittedAt: "2025-07-05T10:00:00",
    score: 0,
    totalScore: 30,
    status: "submitted",
  },
  {
    id: "sub-4",
    studentName: "Nguyễn Thị Hương",
    assignmentTitle: "Bài tập Đạo hàm - Tuần 26",
    submittedAt: "2025-07-04T22:45:00",
    score: 16,
    totalScore: 20,
    status: "graded",
  },
  {
    id: "sub-5",
    studentName: "Võ Thanh Tùng",
    assignmentTitle: "Kiểm tra giữa kỳ",
    submittedAt: "2025-07-04T20:30:00",
    score: 0,
    totalScore: 30,
    status: "submitted",
  },
];

// ============================================================
// PDF IMPORT JOBS
// ============================================================

export const mockPDFJobs: PDFImportJob[] = [
  {
    id: "pdf-001",
    fileName: "De_thi_THPT_2024_Toan.pdf",
    fileSize: 2450000,
    status: "completed",
    progress: 100,
    totalQuestions: 50,
    extractedQuestions: 50,
    uploadedAt: "2025-07-03T10:00:00",
  },
  {
    id: "pdf-002",
    fileName: "Bai_tap_Dao_ham_chuong_5.pdf",
    fileSize: 1800000,
    status: "reviewing",
    progress: 85,
    totalQuestions: 30,
    extractedQuestions: 28,
    uploadedAt: "2025-07-04T14:30:00",
  },
  {
    id: "pdf-003",
    fileName: "De_cuong_Vat_ly_12.pdf",
    fileSize: 5200000,
    status: "extracting",
    progress: 45,
    totalQuestions: 80,
    extractedQuestions: 36,
    uploadedAt: "2025-07-05T08:00:00",
  },
];

// ============================================================
// AI RECOMMENDATION CARDS
// ============================================================

export const aiRecommendations = [
  {
    id: "rec-1",
    title: "Ôn tập Dòng điện xoay chiều",
    description:
      "Độ chính xác của bạn ở chủ đề này chỉ 42%. AI gợi ý bạn nên làm thêm 20 câu cơ bản.",
    subject: "Vật lý",
    priority: "high" as const,
    estimatedTime: 30,
    questionCount: 20,
  },
  {
    id: "rec-2",
    title: "Luyện Hình học không gian",
    description:
      "Bạn chưa luyện tập chủ đề này trong 2 tuần. Hãy duy trì đều đặn nhé!",
    subject: "Toán học",
    priority: "medium" as const,
    estimatedTime: 45,
    questionCount: 15,
  },
  {
    id: "rec-3",
    title: "Thử thách: Đề thi thử",
    description:
      "Dựa trên tiến độ của bạn, AI đề xuất thử sức với đề thi thử THPT QG.",
    subject: "Tổng hợp",
    priority: "low" as const,
    estimatedTime: 90,
    questionCount: 50,
  },
];

// ============================================================
// TUTOR STATS
// ============================================================

export const tutorStats = {
  totalStudents: 120,
  totalClasses: 3,
  totalAssignments: 24,
  avgClassScore: 7.1,
  submissionRate: 87,
  classPerformance: [
    { className: "Toán nâng cao 12A1", avgScore: 7.8, studentCount: 35, trend: "up" as const },
    { className: "Toán cơ bản 11B2", avgScore: 6.5, studentCount: 40, trend: "stable" as const },
    { className: "Luyện đề Toán THPT", avgScore: 7.1, studentCount: 45, trend: "up" as const },
  ],
  weeklySubmissions: [
    { day: "T2", count: 12 },
    { day: "T3", count: 18 },
    { day: "T4", count: 8 },
    { day: "T5", count: 22 },
    { day: "T6", count: 30 },
    { day: "T7", count: 25 },
    { day: "CN", count: 15 },
  ],
};
