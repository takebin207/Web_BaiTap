"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Database,
  Trash2,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tutorClasses, subjects } from "@/data/mock/data";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CreateAssignmentPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("math");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(45);
  const [dueDate, setDueDate] = useState("2026-07-15T23:59");
  const [showSolutions, setShowSolutions] = useState(true);
  const [questions, setQuestions] = useState<Array<{ id: string; content: string; difficulty: string }>>([]);

  const handleClassToggle = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const addManualQuestion = () => {
    const newQ = {
      id: `manual-${Date.now()}`,
      content: "Nhập nội dung câu hỏi mới tại đây...",
      difficulty: "medium",
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const selectFromBank = () => {
    // Mock selecting from bank - adds 2 standard questions
    const mockSelected = [
      { id: "q-001", content: "Cho hàm số y = x³ - 3x² + 2. Tìm các khoảng đồng biến...", difficulty: "medium" },
      { id: "q-006", content: "Cho log₂3 = a. Hãy tính log₈27 theo a.", difficulty: "hard" },
    ];
    setQuestions((prev) => {
      const existingIds = prev.map((q) => q.id);
      const toAdd = mockSelected.filter((q) => !existingIds.includes(q.id));
      return [...prev, ...toAdd];
    });
    alert("Đã mô phỏng chọn 2 câu hỏi từ Ngân hàng câu hỏi EStudy!");
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handlePublish = (status: "draft" | "active") => {
    if (!title) {
      alert("Vui lòng nhập tên bài tập!");
      return;
    }
    if (selectedClasses.length === 0) {
      alert("Vui lòng chọn ít nhất một lớp học!");
      return;
    }
    alert(
      `Đã mô phỏng thành công! Bài tập '${title}' đã được lưu dưới dạng: ${
        status === "active" ? "ĐANG MỞ (GIAO BÀI)" : "BẢN NHÁP"
      }`
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Back link & Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Link href="/dashboard/tutor/assignments">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Tạo bài tập mới
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Thiết lập thông số và danh sách câu hỏi kiểm tra.
          </p>
        </div>
      </motion.div>

      {/* Main Grid: Form (2/3) + Sidebar Stats (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Tên bài tập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Kiểm tra Đạo hàm số học - Tuần 28"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            {/* Subject & Time Limit */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Môn học
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Clock className="h-3.5 w-3.5" /> Thời gian làm bài (phút)
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>

            {/* Class selection checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>
                Giao cho lớp học <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {tutorClasses.map((cls) => (
                  <label
                    key={cls.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors text-xs font-medium ${
                      selectedClasses.includes(cls.id)
                        ? "border-indigo-500 bg-indigo-50/30 text-indigo-700"
                        : "border-[var(--border-default)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-inset)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(cls.id)}
                      onChange={() => handleClassToggle(cls.id)}
                      className="rounded border-[var(--border-default)] text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                    <span>{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date & Solution switch */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                  <Calendar className="h-3.5 w-3.5" /> Hạn nộp bài
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--surface-subtle)]">
                  <input
                    type="checkbox"
                    checked={showSolutions}
                    onChange={(e) => setShowSolutions(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      Xem lời giải ngay sau khi nộp
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Học sinh thấy ngay đáp án và giải thích AI sau khi bấm nộp
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Question List Builder Card */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Danh sách câu hỏi ({questions.length})
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={selectFromBank}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"
                >
                  <Database className="mr-1.5 h-3.5 w-3.5" /> Chọn từ Ngân hàng
                </Button>
                <Button
                  onClick={addManualQuestion}
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Thêm câu thủ công
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)]"
                style={{ background: "var(--surface-subtle)" }}
              >
                <BookOpen className="h-8 w-8 mb-2.5" style={{ color: "var(--text-tertiary)" }} />
                <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  Chưa có câu hỏi nào được chọn
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Sử dụng hai nút phía trên để thêm câu hỏi thủ công hoặc import nhanh từ ngân hàng đề của EStudy.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-subtle)] transition-colors hover:border-indigo-300"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <Badge variant="outline" className="text-[9px] uppercase">
                          {q.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs truncate font-medium" style={{ color: "var(--text-primary)" }}>
                        {q.content}
                      </p>
                    </div>
                    <Button
                      onClick={() => removeQuestion(q.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Summary & Publish Column */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Tóm tắt thông số
            </h3>

            <div className="space-y-3.5 text-xs text-[var(--text-secondary)] border-b border-[var(--border-subtle)] pb-4">
              <div className="flex justify-between">
                <span>Số câu hỏi:</span>
                <span className="font-bold text-indigo-600">{questions.length} câu</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian:</span>
                <span className="font-semibold">{timeLimit} phút</span>
              </div>
              <div className="flex justify-between">
                <span>Lớp chỉ định:</span>
                <span className="font-semibold">
                  {selectedClasses.length === 0
                    ? "Chưa chọn lớp"
                    : `${selectedClasses.length} lớp học`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => handlePublish("active")}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm py-2.5 text-xs"
              >
                Giao bài tập ngay
              </Button>
              <Button
                onClick={() => handlePublish("draft")}
                variant="outline"
                className="w-full rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2.5 text-xs"
              >
                Lưu làm bản nháp
              </Button>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-2xl p-5 border border-indigo-100/50"
            style={{ background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.02))" }}
          >
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Gợi ý sinh câu hỏi AI
            </h4>
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Phiên bản tích hợp Gemini API sau này sẽ cho phép nhập file đề PDF để AI bóc tách câu hỏi tự động hoặc sinh đề ngẫu nhiên cùng mức độ khó ngay tại trang này.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
