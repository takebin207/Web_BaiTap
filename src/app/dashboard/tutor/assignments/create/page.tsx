"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Database,
  Trash2,
  Sparkles,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tutorClasses, sampleChapters } from "@/data/mock/data";
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

function mapDbQuestionToFrontend(dbQ: any) {
  return {
    id: dbQ.id,
    content: dbQ.content,
    difficulty: dbQ.difficulty.toLowerCase(),
    chapterId: dbQ.chapter || "chap-1",
  };
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(45);
  const [dueDate, setDueDate] = useState("2026-10-15T23:59");
  const [showSolutions, setShowSolutions] = useState(true);
  const [questions, setQuestions] = useState<Array<{ id: string; content: string; difficulty: string; chapterId: string }>>([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    id: string;
    title: string;
    questionsCount: number;
    timeLimit: number;
    className: string;
    dueDate: string;
  } | null>(null);

  // Load selected questions from database on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loadQuestions = async () => {
      try {
        const storedIdsStr = localStorage.getItem("estudy_selected_question_ids");
        if (storedIdsStr) {
          const storedIds: string[] = JSON.parse(storedIdsStr);
          if (storedIds.length > 0) {
            const res = await fetch("/api/tutor/questions");
            if (res.ok) {
              const bank = await res.json();
              const matched = bank
                .filter((q: any) => storedIds.includes(q.id))
                .map(mapDbQuestionToFrontend);
              
              if (matched.length > 0) {
                setTimeout(() => {
                  setQuestions(matched);
                }, 0);
              }
            }
            localStorage.removeItem("estudy_selected_question_ids");
          }
        }
      } catch (e) {
        console.error("Lỗi khi tải câu hỏi đã chọn:", e);
      }
    };
    loadQuestions();
  }, []);

  // Auto-generation parameters
  const [showAutoStructure, setShowAutoStructure] = useState(false);
  const [structureParams, setStructureParams] = useState({
    chap1Count: 5,
    chap3Count: 5,
    chap5Count: 5,
    chap7Count: 5,
    recognitionPct: 40,
    understandingPct: 30,
    applicationPct: 20,
    advApplicationPct: 10,
  });

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const addManualQuestion = () => {
    const newQ = {
      id: `manual-${Date.now()}`,
      content: "Nhập nội dung câu hỏi tự luận/điền khuyết mới...",
      difficulty: "medium",
      chapterId: "chap-1",
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const selectFromBank = () => {
    // Redirect tutor to Question Bank page to pick live questions from database
    router.push("/dashboard/tutor/question-bank");
  };

  const handleGenerateByStructure = async () => {
    const totalSelected =
      structureParams.chap1Count +
      structureParams.chap3Count +
      structureParams.chap5Count +
      structureParams.chap7Count;

    if (totalSelected === 0) {
      alert("Vui lòng chọn số câu lớn hơn 0!");
      return;
    }

    try {
      const res = await fetch("/api/tutor/questions");
      if (res.ok) {
        const bank = await res.json();
        const mappedBank = bank.map(mapDbQuestionToFrontend);
        const generated: typeof questions = [];

        const getQuestionsForChapter = (chapId: string, count: number) => {
          const chapQuestions = mappedBank.filter((q: any) => q.chapterId === chapId);
          return chapQuestions.slice(0, count);
        };

        generated.push(...getQuestionsForChapter("chap-1", structureParams.chap1Count));
        generated.push(...getQuestionsForChapter("chap-3", structureParams.chap3Count));
        generated.push(...getQuestionsForChapter("chap-5", structureParams.chap5Count));
        generated.push(...getQuestionsForChapter("chap-7", structureParams.chap7Count));

        if (generated.length === 0) {
          alert("Không tìm thấy câu hỏi nào tương ứng trong cơ sở dữ liệu để tạo đề!");
          return;
        }

        setQuestions(generated);
        setShowAutoStructure(false);
        alert(`Đã tự động phân bổ và chọn ${generated.length} câu hỏi phù hợp từ cơ sở dữ liệu dựa trên ma trận!`);
      }
    } catch (e) {
      console.error("Lỗi khi kết nối để sinh đề tự động:", e);
      alert("Lỗi khi sinh đề tự động từ database");
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handlePublish = async (status: "DRAFT" | "ASSIGNED") => {
    if (!title) {
      alert("Vui lòng nhập tên bài tập!");
      return;
    }
    if (selectedClasses.length === 0) {
      alert("Vui lòng chọn ít nhất một lớp học!");
      return;
    }
    if (questions.length === 0) {
      alert("Vui lòng thêm ít nhất một câu hỏi!");
      return;
    }

    const assignedClassName = selectedClasses
      .map((cid) => tutorClasses.find((c) => c.id === cid)?.name || cid)
      .join(", ");

    const payload = {
      title: title,
      description: "Bài tập giao trực tuyến kết nối cơ sở dữ liệu.",
      classId: selectedClasses[0], // Schema supports single classroom assignment for now
      subject: "math",
      grade: "10",
      timeLimitMinutes: timeLimit,
      deadline: new Date(dueDate).toISOString(),
      showSolutionsAfterSubmit: showSolutions,
      status: status,
      questionIds: questions.map((q) => q.id),
    };

    try {
      const res = await fetch("/api/tutor/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessData({
          id: data.id,
          title: title,
          questionsCount: questions.length,
          timeLimit: timeLimit,
          className: assignedClassName,
          dueDate: new Date(dueDate).toLocaleString("vi-VN"),
        });
        setShowSuccess(true);
      } else {
        const err = await res.json();
        alert("Lỗi khi tạo bài tập: " + err.error);
      }
    } catch (err) {
      console.error("Lỗi khi lưu bài tập:", err);
      alert("Lỗi mạng khi lưu bài tập");
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Back button & Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Link href="/dashboard/tutor/assignments">
          <Button variant="ghost" size="icon" className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Tạo bài tập mới (Toán 10)
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tạo đề thi trắc nghiệm Toán lớp 10 theo chương trình GDPT 2018 (kết nối Cơ sở dữ liệu).
          </p>
        </div>
      </motion.div>

      {/* Main layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form area (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            {/* Title */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                Tiêu đề bài kiểm tra <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Kiểm tra giữa kỳ Toán 10 - Chương 3 & 5"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            {/* Subject, Grade, TimeLimit */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold" style={{ color: "var(--text-secondary)" }}>Môn học</label>
                <select disabled className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                  <option value="math">Toán</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold" style={{ color: "var(--text-secondary)" }}>Khối lớp</label>
                <select disabled className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)]">
                  <option value="10">Khối 10</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Clock className="h-3.5 w-3.5" /> Thời gian làm (phút)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* Class toggles */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold block" style={{ color: "var(--text-secondary)" }}>
                Giao cho lớp học <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {tutorClasses.map((cls) => (
                  <label
                    key={cls.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                      selectedClasses.includes(cls.id)
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-700"
                        : "border-[var(--border-default)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-inset)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={() => handleClassToggle(cls.id)}
                      className="rounded border-[var(--border-default)] text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Deadline & Solutions config */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Calendar className="h-3.5 w-3.5" /> Hạn nộp bài
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)]">
                  <input
                    type="checkbox"
                    checked={showSolutions}
                    onChange={(e) => setShowSolutions(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                  />
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Xem lời giải ngay sau khi nộp
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Học sinh xem được lời giải chi tiết sau khi bấm nộp bài
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Question List Card */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Danh sách câu hỏi Toán 10 ({questions.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowAutoStructure(true)}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 cursor-pointer border-0"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Tạo theo cấu trúc ma trận
                </Button>
                <Button
                  onClick={selectFromBank}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 cursor-pointer border-0"
                >
                  <Database className="mr-1.5 h-3.5 w-3.5" /> Chọn từ Ngân hàng
                </Button>
                <Button
                  onClick={addManualQuestion}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 cursor-pointer border-0"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Thêm thủ công
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)]"
                style={{ background: "var(--surface-subtle)" }}
              >
                <BookOpen className="h-8 w-8 mb-2.5 text-[var(--text-tertiary)]" />
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Chưa chọn câu hỏi nào cho đề thi
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Sử dụng công cụ tạo theo cấu trúc ma trận hoặc chọn nhanh câu hỏi có sẵn từ Ngân hàng Toán 10.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] transition-colors hover:border-indigo-300 bg-[var(--surface-subtle)]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <Badge variant="outline" className="text-[8px] uppercase">
                          {sampleChapters.find((c) => c.id === q.chapterId)?.name.slice(0, 15) || q.chapterId}
                        </Badge>
                        <Badge variant="outline" className="text-[8px] uppercase text-indigo-600">
                          {q.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs truncate font-medium text-left" style={{ color: "var(--text-primary)" }}>
                        {q.content}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeQuestion(q.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Summary Area */}
        <div className="space-y-6 text-xs">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Tóm tắt cấu hình đề
            </h3>

            <div className="space-y-3 border-b border-[var(--border-subtle)] pb-4 text-[var(--text-secondary)] text-left">
              <div className="flex justify-between">
                <span>Số câu hỏi chỉ định:</span>
                <span className="font-bold text-indigo-600">{questions.length} câu</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian làm bài:</span>
                <span className="font-semibold">{timeLimit} phút</span>
              </div>
              <div className="flex justify-between">
                <span>Lớp được giao:</span>
                <span className="font-semibold">
                  {selectedClasses.length === 0 ? "Chưa chọn lớp" : `${selectedClasses.length} lớp học`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handlePublish("ASSIGNED")}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 cursor-pointer border-0"
              >
                Phát hành đề Toán 10
              </Button>
              <Button
                onClick={() => handlePublish("DRAFT")}
                variant="outline"
                className="w-full rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2.5 cursor-pointer bg-transparent"
              >
                Lưu làm bản nháp
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          AI MATRIX AUTO GENERATE MODAL (MOCK-DATA BACKED)
          ============================================================ */}
      <AnimatePresence>
        {showAutoStructure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-card)] rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 text-xs border border-[var(--border-default)]"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Cấu trúc ma trận phân bổ đề thi Toán 10
                </h3>
                <button onClick={() => setShowAutoStructure(false)} className="text-[var(--text-tertiary)] hover:text-red-500 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Matrix inputs */}
              <div className="space-y-4">
                <div className="space-y-2 text-left">
                  <h4 className="font-semibold text-indigo-600">1. Số lượng câu hỏi theo chương (Chương trình GDPT 2018):</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 1: Mệnh đề và tập hợp</label>
                      <input
                        type="number"
                        value={structureParams.chap1Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap1Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 3: Hàm số và đồ thị</label>
                      <input
                        type="number"
                        value={structureParams.chap3Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap3Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 5: Vectơ</label>
                      <input
                        type="number"
                        value={structureParams.chap5Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap5Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 7: Thống kê & Xác suất</label>
                      <input
                        type="number"
                        value={structureParams.chap7Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap7Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)] text-left">
                  <h4 className="font-semibold text-indigo-600">2. Phân bố mức độ nhận thức (%):</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Nhận biết</label>
                      <input
                        type="number"
                        value={structureParams.recognitionPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, recognitionPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Thông hiểu</label>
                      <input
                        type="number"
                        value={structureParams.understandingPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, understandingPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Vận dụng</label>
                      <input
                        type="number"
                        value={structureParams.applicationPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, applicationPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Vận dụng cao</label>
                      <input
                        type="number"
                        value={structureParams.advApplicationPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, advApplicationPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-right mt-1" style={{ color: "var(--text-tertiary)" }}>
                    Tổng tỉ lệ: <span className="font-bold text-indigo-600">
                      {structureParams.recognitionPct +
                        structureParams.understandingPct +
                        structureParams.applicationPct +
                        structureParams.advApplicationPct}%
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-[var(--border-subtle)]">
                <Button
                  onClick={() => setShowAutoStructure(false)}
                  variant="outline"
                  className="rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] cursor-pointer bg-transparent"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleGenerateByStructure}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer border-0"
                >
                  Xác nhận sinh đề tự động
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Dialog overlay */}
      <AnimatePresence>
        {showSuccess && successData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-card)] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 text-center text-xs border border-[var(--border-default)]"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-green-600">
                  Giao bài tập thành công!
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)] max-w-xs">
                  Bài tập Toán 10 đã được lưu vào cơ sở dữ liệu thành công. Học sinh có thể bắt đầu làm bài trực tuyến.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] text-left space-y-2 border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                <div>Tiêu đề: <strong className="text-[var(--text-primary)]">{successData.title}</strong></div>
                <div>Lớp học nhận: <span className="font-semibold text-[var(--text-primary)]">{successData.className}</span></div>
                <div>Số câu hỏi: <span className="font-semibold">{successData.questionsCount} câu</span></div>
                <div>Thời gian làm bài: <span className="font-semibold">{successData.timeLimit} phút</span></div>
                <div>Hạn nộp bài: <span className="font-semibold text-red-500">{successData.dueDate}</span></div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link href={`/dashboard/student/assignments/${successData.id}`} className="w-full">
                  <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 cursor-pointer border-0">
                    👉 Xem giao diện học sinh làm bài (Preview)
                  </Button>
                </Link>
                <Link href="/dashboard/tutor/assignments" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2 cursor-pointer bg-transparent">
                    Về trang Quản lý bài tập
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
