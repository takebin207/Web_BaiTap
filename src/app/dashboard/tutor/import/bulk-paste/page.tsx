"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  sampleChapters,
  sampleTopics,
  Question,
  QuestionType,
  QuestionDifficulty,
  CognitiveLevel,
} from "@/data/mock/data";
import { addQuestionsToBank } from "@/data/mock/store";
import MathRenderer from "@/components/ui/math-renderer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Interface for intermediate parsed state
interface ParsedQuestion {
  tempId: string;
  number: string;
  content: string;
  options: { id: string; label: string; content: string }[];
  correctAnswer: string;
  explanation: string;
  chapterId: string;
  topicId: string;
  difficulty: QuestionDifficulty;
  cognitiveLevel: CognitiveLevel;
  status: "NEEDS_REVIEW" | "READY";
  warnings: string[];
  isApproved: boolean;
  isSkipped: boolean;
}

export default function BulkPasteImportPage() {
  const router = useRouter();

  // Settings
  const [chapterId, setChapterId] = useState("chap-3");
  const [topicId, setTopicId] = useState("top-3-3");
  const [defaultDifficulty, setDefaultDifficulty] = useState<QuestionDifficulty>("medium");
  const [defaultCognitive, setDefaultCognitive] = useState<CognitiveLevel>("understanding");
  const [sourceName, setSourceName] = useState("Handout soạn thảo");

  // Input
  const [pasteText, setPasteText] = useState("");
  const [parsedList, setParsedList] = useState<ParsedQuestion[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  // Success state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  // Edit modal / form inside cards
  const [editingTempId, setEditingTempId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    content: "",
    correctAnswer: "",
    explanation: "",
    difficulty: "medium" as QuestionDifficulty,
    cognitiveLevel: "understanding" as CognitiveLevel,
    chapterId: "chap-3",
    topicId: "top-3-3",
  });

  const loadSampleQuestions = () => {
    const sampleText = `Câu 1. Cho hàm số bậc hai $y = x^2 - 4x + 3$. Tọa độ đỉnh của parabol là?
A. $(2; -1)$
B. $(-2; -1)$
C. $(2; 1)$
D. $(-2; 1)$
Đáp án: A
Lời giải: Hoành độ đỉnh là $x = -b / 2a = 2$, tung độ đỉnh là $y = 2^2 - 4\\cdot 2 + 3 = -1$.

Câu 2. Trong mặt phẳng tọa độ $Oxy$, cho vectơ $\\vec{a} = (3; -2)$ và $\\vec{b} = (-1; 5)$. Tính tọa độ của vectơ $\\vec{c} = 2\\vec{a} + 3\\vec{b}$.
A. $(3; 11)$
B. $(5; 11)$
C. $(3; -9)$
D. $(5; -9)$
Đáp án: A
Lời giải: Hoành độ $2\\cdot 3 + 3\\cdot (-1) = 3$. Tung độ $2\\cdot (-2) + 3\\cdot 5 = 11$.

Câu 3. Tìm tập hợp các nghiệm thực của phương trình $(x-1)(x^2-4) = 0$.
Đáp án: {1; 2; -2}
Lời giải: Giải phương trình ta được $x=1$ hoặc $x=\\pm 2$.
`;
    setPasteText(sampleText);
    setParsedList([]);
    setIsParsed(false);
  };

  const clearTextarea = () => {
    setPasteText("");
    setParsedList([]);
    setIsParsed(false);
  };

  // Basic regex quiz parser
  const handleParse = () => {
    if (!pasteText.trim()) {
      alert("Vui lòng dán văn bản câu hỏi vào khung nhập liệu!");
      return;
    }

    // Split on indicators like "Câu 1.", "Câu 2."
    const blocks = pasteText.split(/(?=Câu\s+\d+\.)/gi).filter(b => b.trim().length > 0);

    const questions: ParsedQuestion[] = blocks.map((block, idx) => {
      const warnings: string[] = [];
      const tempId = `parsed-${idx}-${Date.now()}`;

      // Extract Question Number
      const numMatch = block.match(/Câu\s+(\d+)\./i);
      const number = numMatch ? numMatch[1] : `${idx + 1}`;

      // Extract raw lines
      const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);

      // Extract Options: Look for A. B. C. D. lines
      const options: { id: string; label: string; content: string }[] = [];
      const optLabels = ["A", "B", "C", "D"];
      optLabels.forEach((label) => {
        const regex = new RegExp(`^${label}\\.\\s*(.+)$`, "i");
        const foundLine = lines.find(l => regex.test(l));
        if (foundLine) {
          const match = foundLine.match(regex);
          if (match) {
            options.push({
              id: label.toLowerCase(),
              label: label,
              content: match[1].trim(),
            });
          }
        }
      });

      // Extract Correct Answer
      let correctAnswer = "";
      const ansMatch = block.match(/Đáp\s*án\s*:\s*(.+)/i);
      if (ansMatch) {
        correctAnswer = ansMatch[1].trim();
        // If multiple choice, normalize to lowercase option letter
        if (options.length > 0 && /^[A-D]$/i.test(correctAnswer)) {
          correctAnswer = correctAnswer.toLowerCase();
        }
      } else {
        warnings.push("Thiếu thông tin 'Đáp án:'");
      }

      // Extract Explanation
      let explanation = "";
      const expMatch = block.match(/Lời\s*giải\s*:\s*([\s\S]+)$/i);
      if (expMatch) {
        explanation = expMatch[1].trim();
      } else {
        warnings.push("Thiếu thông tin 'Lời giải:'");
      }

      // Extract Content (everything after "Câu X." up to the first option, or answer block)
      let content = "";
      if (lines.length > 0) {
        const cleanBlock = block.replace(/Câu\s+\d+\./i, "").trim();
        // Split by lines, discard options/answer/explanation lines to get core question
        const contentLines = cleanBlock.split("\n").map(l => l.trim()).filter(l => {
          if (/^[A-D]\.\s/i.test(l)) return false;
          if (/^Đáp\s*án\s*:/i.test(l)) return false;
          if (/^Lời\s*giải\s*:/i.test(l)) return false;
          return true;
        });
        content = contentLines.join(" ").trim();
      }

      if (!content) {
        content = "Không thể bóc tách nội dung câu hỏi.";
        warnings.push("Không tìm thấy nội dung câu hỏi");
      }

      if (options.length === 0 && !block.match(/Đáp\s*án\s*:\s*([A-D])/i)) {
        // Short answer fallback
        if (!correctAnswer) {
          warnings.push("Thiếu câu trả lời ngắn");
        }
      } else if (options.length < 4) {
        warnings.push(`Chỉ tìm thấy ${options.length}/4 lựa chọn`);
      }

      // Determine initial status
      const status = warnings.length > 0 ? "NEEDS_REVIEW" : "READY";

      return {
        tempId,
        number,
        content,
        options,
        correctAnswer,
        explanation,
        chapterId,
        topicId,
        difficulty: defaultDifficulty,
        cognitiveLevel: defaultCognitive,
        status,
        warnings,
        isApproved: status === "READY", // Auto-approve if completely parsed with zero warnings
        isSkipped: false,
      };
    });

    setParsedList(questions);
    setIsParsed(true);
  };

  const handleToggleApprove = (tempId: string) => {
    setParsedList(prev =>
      prev.map(q => (q.tempId === tempId ? { ...q, isApproved: !q.isApproved, isSkipped: false } : q))
    );
  };

  const handleToggleSkip = (tempId: string) => {
    setParsedList(prev =>
      prev.map(q => (q.tempId === tempId ? { ...q, isSkipped: !q.isSkipped, isApproved: false } : q))
    );
  };

  const startEdit = (q: ParsedQuestion) => {
    setEditingTempId(q.tempId);
    setEditForm({
      content: q.content,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      cognitiveLevel: q.cognitiveLevel,
      chapterId: q.chapterId,
      topicId: q.topicId,
    });
  };

  const saveEdit = (tempId: string) => {
    setParsedList(prev =>
      prev.map(q => {
        if (q.tempId === tempId) {
          const updatedWarnings = q.warnings.filter(w => {
            if (w.includes("Nội dung") && editForm.content) return false;
            if (w.includes("Đáp án") && editForm.correctAnswer) return false;
            if (w.includes("Lời giải") && editForm.explanation) return false;
            return true;
          });
          const newStatus = updatedWarnings.length === 0 ? "READY" : "NEEDS_REVIEW";

          return {
            ...q,
            content: editForm.content,
            correctAnswer: editForm.correctAnswer,
            explanation: editForm.explanation,
            difficulty: editForm.difficulty,
            cognitiveLevel: editForm.cognitiveLevel,
            chapterId: editForm.chapterId,
            topicId: editForm.topicId,
            warnings: updatedWarnings,
            status: newStatus,
            isApproved: true, // Auto approve edited items
          };
        }
        return q;
      })
    );
    setEditingTempId(null);
  };

  const handleSaveToQuestionBank = () => {
    const approvedList = parsedList.filter(q => q.isApproved && !q.isSkipped);

    if (approvedList.length === 0) {
      alert("Vui lòng duyệt ít nhất một câu hỏi trước khi lưu!");
      return;
    }

    // Convert intermediate ParsedQuestion to core Question model
    const newQuestions: Question[] = approvedList.map((pq, idx) => {
      const isMc = pq.options.length > 0;
      return {
        id: `imported-${Date.now()}-${idx}`,
        content: pq.content,
        options: isMc ? pq.options : undefined,
        correctAnswer: pq.correctAnswer,
        explanation: pq.explanation,
        aiExplanation: `💡 Câu hỏi được nạp hàng loạt từ nguồn soạn thảo.`,
        curriculumId: "cur-2018-math-10",
        subjectId: "math",
        gradeId: "grade-10",
        chapterId: pq.chapterId,
        topicId: pq.topicId,
        questionType: isMc ? "multiple_choice" : "short_answer",
        difficulty: pq.difficulty,
        cognitiveLevel: pq.cognitiveLevel,
        source: sourceName || "Bulk Import",
        status: "READY",
        createdAt: new Date().toISOString(),
      };
    });

    // Save to localStorage
    addQuestionsToBank(newQuestions);
    setSavedCount(newQuestions.length);
    setShowSuccessToast(true);

    setTimeout(() => {
      router.push("/dashboard/tutor/question-bank");
    }, 2000);
  };

  const getCognitiveLabel = (lvl: string) => {
    switch (lvl) {
      case "recognition": return "Nhận biết";
      case "understanding": return "Thông hiểu";
      case "application": return "Vận dụng";
      case "advanced_application": return "Vận dụng cao";
      default: return lvl;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Back button header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Link href="/dashboard/tutor/question-bank">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Nhập hàng loạt câu hỏi (Bulk Paste Import)
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Dán nội dung câu hỏi Toán 10 thô từ handout để AI hoặc trình phân tích bóc tách tức thì (SAMPLE / MOCK / EDITABLE).
          </p>
        </div>
      </motion.div>

      {/* Main split layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: paste box & settings (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                Nội dung đề thi dạng thô
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={loadSampleQuestions}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 text-[10px] h-7"
                >
                  Tải đề mẫu Toán 10
                </Button>
                <Button
                  onClick={clearTextarea}
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-red-500 hover:bg-red-50 text-[10px] h-7"
                >
                  Xóa sạch
                </Button>
              </div>
            </div>

            <textarea
              rows={12}
              placeholder={`Câu 1. Cho hàm số y = x^2 - 4x + 3. Tọa độ đỉnh là?
A. (2; -1)
B. (-2; -1)
C. (2; 1)
D. (-2; 1)
Đáp án: A
Lời giải: Hoành độ x = 2...`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="w-full p-4 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] font-mono text-xs leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            />

            <Button
              onClick={handleParse}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
            >
              Bóc tách câu hỏi (Parse)
            </Button>
          </motion.div>

          {/* Parser Results List */}
          {isParsed && (
            <motion.div variants={item} className="space-y-4">
              <div className="flex justify-between items-center px-1 text-xs text-[var(--text-secondary)]">
                <span>
                  Phát hiện: <strong className="text-indigo-600">{parsedList.length} câu hỏi</strong> (
                  {parsedList.filter(q => q.status === "NEEDS_REVIEW").length} cần duyệt)
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  Chỉ những câu được tick xanh mới lưu vào Ngân hàng
                </span>
              </div>

              <div className="space-y-4">
                {parsedList.map((q, idx) => {
                  const isEditing = editingTempId === q.tempId;

                  return (
                    <div
                      key={q.tempId}
                      className={`rounded-2xl border p-5 space-y-4 bg-[var(--surface-card)] transition-all ${
                        q.isSkipped
                          ? "border-red-200 bg-red-50/5 opacity-60"
                          : q.isApproved
                          ? "border-green-300 bg-green-50/5"
                          : "border-[var(--border-default)]"
                      }`}
                    >
                      {/* Card Header indicators */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold text-xs">
                            {idx + 1}
                          </span>
                          {q.warnings.length > 0 ? (
                            <Badge className="bg-orange-50 text-orange-700 border-orange-100 text-[9px] uppercase font-bold flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Cần duyệt ({q.warnings.length})
                            </Badge>
                          ) : (
                            <Badge className="bg-green-50 text-green-700 border-green-100 text-[9px] uppercase font-bold">
                              Hoàn chỉnh
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <Button
                            onClick={() => handleToggleApprove(q.tempId)}
                            size="sm"
                            variant="outline"
                            className={`rounded-lg text-[10px] py-1 px-2.5 h-6 font-semibold ${
                              q.isApproved
                                ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                                : "border-green-200 text-green-600 hover:bg-green-50/40"
                            }`}
                          >
                            {q.isApproved ? "Đã duyệt" : "Duyệt thông qua"}
                          </Button>
                          <Button
                            onClick={() => handleToggleSkip(q.tempId)}
                            size="sm"
                            variant="outline"
                            className={`rounded-lg text-[10px] py-1 px-2.5 h-6 font-semibold ${
                              q.isSkipped
                                ? "bg-red-650 border-red-650 text-white hover:bg-red-750"
                                : "border-red-200 text-red-500 hover:bg-red-50/40"
                            }`}
                          >
                            Bỏ qua
                          </Button>
                        </div>
                      </div>

                      {/* Display or Edit view */}
                      {isEditing ? (
                        <div className="space-y-3 text-xs">
                          {/* Edit Content */}
                          <div className="space-y-1">
                            <label className="font-semibold text-[var(--text-secondary)]">Nội dung câu hỏi:</label>
                            <textarea
                              rows={2}
                              value={editForm.content}
                              onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full p-2 border rounded-xl"
                            />
                          </div>

                          {/* Edit Answer & Explanation */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-semibold text-[var(--text-secondary)]">Đáp án đúng:</label>
                              <input
                                type="text"
                                value={editForm.correctAnswer}
                                onChange={(e) => setEditForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                                className="w-full p-2 border rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold text-[var(--text-secondary)]">Độ khó:</label>
                              <select
                                value={editForm.difficulty}
                                onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value as QuestionDifficulty }))}
                                className="w-full p-2 border rounded-xl bg-white"
                              >
                                <option value="easy">Dễ</option>
                                <option value="medium">Trung bình</option>
                                <option value="hard">Khó</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-semibold text-[var(--text-secondary)]">Lời giải chi tiết:</label>
                            <textarea
                              rows={2}
                              value={editForm.explanation}
                              onChange={(e) => setEditForm(prev => ({ ...prev, explanation: e.target.value }))}
                              className="w-full p-2 border rounded-xl"
                            />
                          </div>

                          {/* Metadata row */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-semibold text-[var(--text-secondary)]">Chương:</label>
                              <select
                                value={editForm.chapterId}
                                onChange={(e) => setEditForm(prev => ({ ...prev, chapterId: e.target.value, topicId: sampleTopics.find(t => t.chapterId === e.target.value)?.id || "" }))}
                                className="w-full p-2 border rounded-xl bg-white"
                              >
                                {sampleChapters.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="font-semibold text-[var(--text-secondary)]">Nhận thức:</label>
                              <select
                                value={editForm.cognitiveLevel}
                                onChange={(e) => setEditForm(prev => ({ ...prev, cognitiveLevel: e.target.value as CognitiveLevel }))}
                                className="w-full p-2 border rounded-xl bg-white"
                              >
                                <option value="recognition">Nhận biết</option>
                                <option value="understanding">Thông hiểu</option>
                                <option value="application">Vận dụng</option>
                                <option value="advanced_application">Vận dụng cao</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <Button
                              onClick={() => setEditingTempId(null)}
                              variant="ghost"
                              size="sm"
                              className="text-xs rounded-xl"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={() => saveEdit(q.tempId)}
                              size="sm"
                              className="text-xs rounded-xl bg-indigo-600 text-white"
                            >
                              Lưu thay đổi
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3.5 text-xs">
                          {/* Warnings box */}
                          {q.warnings.length > 0 && (
                            <div className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/50 flex flex-col gap-1 text-[10px] text-orange-850">
                              {q.warnings.map((w, wIdx) => (
                                <span key={wIdx}>⚠️ {w}</span>
                              ))}
                            </div>
                          )}

                          {/* Content rendering */}
                          <div className="font-medium text-left leading-relaxed text-[var(--text-primary)]">
                            <MathRenderer text={q.content} />
                          </div>

                          {/* Options list */}
                          {q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className={`p-2 rounded-xl border ${
                                    opt.id === q.correctAnswer
                                      ? "border-green-300 bg-green-50/50 text-green-700 font-semibold"
                                      : "border-[var(--border-subtle)] bg-[var(--surface-subtle)]"
                                  }`}
                                >
                                  <span className="font-bold mr-1">{opt.label}.</span>
                                  <MathRenderer text={opt.content} />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Answer summary */}
                          <div className="flex items-center gap-3">
                            <span>Đáp án đúng: <strong className="text-green-600 font-bold uppercase"><MathRenderer text={q.correctAnswer || "Chưa xác định"} /></strong></span>
                            <span>Mức độ: <Badge variant="outline" className="text-[10px]">{getCognitiveLabel(q.cognitiveLevel)}</Badge></span>
                            <span>Độ khó: <Badge variant="outline" className="text-[10px] text-indigo-600">{q.difficulty.toUpperCase()}</Badge></span>
                          </div>

                          {q.explanation && (
                            <div className="p-3 rounded-xl bg-[var(--surface-subtle)] text-[11px] leading-relaxed text-[var(--text-secondary)]">
                              <strong className="text-indigo-600 block mb-1">Lời giải:</strong>
                              <MathRenderer text={q.explanation} />
                            </div>
                          )}

                          {/* Action row footer */}
                          <div className="flex justify-between items-center text-[10px] text-[var(--text-tertiary)] pt-1.5 border-t border-dashed border-[var(--border-subtle)]">
                            <span>Mạch kiến thức: <span className="font-bold">{sampleChapters.find(c => c.id === q.chapterId)?.name.slice(3) || q.chapterId}</span></span>
                            <button
                              onClick={() => startEdit(q)}
                              className="font-bold text-indigo-500 hover:underline text-xs"
                            >
                              Sửa câu hỏi này
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side: Import settings summary (1/3) */}
        <div className="space-y-6 text-xs">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Cài đặt thuộc tính chung
            </h3>

            {/* Subject, Grade read-only */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-tertiary)]">Môn học</label>
                <input
                  type="text"
                  disabled
                  value="Toán"
                  className="w-full p-2 border rounded-xl bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-[var(--text-tertiary)]">Khối lớp</label>
                <input
                  type="text"
                  disabled
                  value="10"
                  className="w-full p-2 border rounded-xl bg-[var(--surface-subtle)] text-[var(--text-tertiary)]"
                />
              </div>
            </div>

            {/* Chapter */}
            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">Chương mặc định</label>
              <select
                value={chapterId}
                onChange={(e) => {
                  setChapterId(e.target.value);
                  setTopicId(sampleTopics.find(t => t.chapterId === e.target.value)?.id || "");
                }}
                className="w-full p-2 border rounded-xl bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {sampleChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">Chủ đề mặc định</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full p-2 border rounded-xl bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {sampleTopics
                  .filter((t) => t.chapterId === chapterId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">Độ khó mặc định</label>
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value as QuestionDifficulty)}
                className="w-full p-2 border rounded-xl bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>

            {/* Cognitive */}
            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">Nhận thức mặc định</label>
              <select
                value={defaultCognitive}
                onChange={(e) => setDefaultCognitive(e.target.value as CognitiveLevel)}
                className="w-full p-2 border rounded-xl bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <option value="recognition">Nhận biết</option>
                <option value="understanding">Thông hiểu</option>
                <option value="application">Vận dụng</option>
                <option value="advanced_application">Vận dụng cao</option>
              </select>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <label className="font-semibold text-[var(--text-secondary)]">Nguồn đề bài</label>
              <input
                type="text"
                placeholder="Ví dụ: Đề cương lớp 10..."
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                className="w-full p-2 border rounded-xl bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </motion.div>

          {/* Save panel summary */}
          {isParsed && (
            <motion.div
              variants={item}
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
            >
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Hoàn thành nhập đề
              </h3>

              <div className="space-y-3 border-b border-[var(--border-subtle)] pb-4 text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Số câu hỏi đã bóc:</span>
                  <span className="font-bold">{parsedList.length} câu</span>
                </div>
                <div className="flex justify-between">
                  <span>Số câu đã duyệt:</span>
                  <span className="font-bold text-green-600">
                    {parsedList.filter(q => q.isApproved && !q.isSkipped).length} câu
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-red-500 font-medium">
                  <span>Số câu bỏ qua:</span>
                  <span>{parsedList.filter(q => q.isSkipped).length} câu</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSaveToQuestionBank}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
                >
                  Lưu câu hỏi vào ngân hàng
                </Button>
                <p className="text-[10px] text-center" style={{ color: "var(--text-tertiary)" }}>
                  * Ghi lưu vào ngân hàng giả lập local. Tính năng lưu máy chủ chính thức sẽ được cập nhật sau.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-green-600 text-white shadow-xl flex items-center gap-3 max-w-sm text-xs"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Nhập đề thành công!</p>
              <p className="text-[10px] text-green-150">
                Đã thêm {savedCount} câu hỏi Toán 10 mới vào Ngân hàng câu hỏi giả lập.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
