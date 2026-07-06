"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tutorClasses, sampleChapters } from "@/data/mock/data";
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
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(45);
  const [dueDate, setDueDate] = useState("2026-10-15T23:59");
  const [showSolutions, setShowSolutions] = useState(true);
  const [questions, setQuestions] = useState<Array<{ id: string; content: string; difficulty: string; chapterId: string }>>([]);

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
      content: "Nhập nội dung câu hỏi trắc nghiệm Toán 10 mới...",
      difficulty: "medium",
      chapterId: "chap-1",
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const selectFromBank = () => {
    const mockSelected = [
      { id: "m10-q01", content: "Cho mệnh đề chứa biến P(x): x^2 - 3x + 2 = 0...", difficulty: "easy", chapterId: "chap-1" },
      { id: "m10-q04", content: "Cho hàm số bậc hai y = x^2 - 4x + 3. Tọa độ đỉnh I...", difficulty: "medium", chapterId: "chap-3" },
      { id: "m10-q07", content: "Trong mặt phẳng tọa độ Oxy, cho vectơ a = (3; -2)...", difficulty: "easy", chapterId: "chap-5" },
    ];
    setQuestions((prev) => {
      const existingIds = prev.map((q) => q.id);
      const toAdd = mockSelected.filter((q) => !existingIds.includes(q.id));
      return [...prev, ...toAdd];
    });
    alert("Đã mô phỏng chọn 3 câu hỏi trắc nghiệm từ Ngân hàng đề Toán 10!");
  };

  const handleGenerateByStructure = () => {
    const totalSelected =
      structureParams.chap1Count +
      structureParams.chap3Count +
      structureParams.chap5Count +
      structureParams.chap7Count;

    if (totalSelected === 0) {
      alert("Vui lòng chọn số câu lớn hơn 0!");
      return;
    }

    // Generate mock question list
    const generated: typeof questions = [];
    
    // Add mock propositional logic questions
    for (let i = 0; i < structureParams.chap1Count; i++) {
      generated.push({
        id: `auto-chap1-${i}`,
        content: `[Mệnh đề & Tập hợp] Câu hỏi trắc nghiệm tự động về lý thuyết/phép toán tập hợp số ${i + 1}`,
        difficulty: i % 2 === 0 ? "easy" : "medium",
        chapterId: "chap-1",
      });
    }

    // Add mock quadratic functions questions
    for (let i = 0; i < structureParams.chap3Count; i++) {
      generated.push({
        id: `auto-chap3-${i}`,
        content: `[Hàm số & Đồ thị] Câu hỏi tự động về tính đỉnh parabol/xét dấu tam thức số ${i + 1}`,
        difficulty: i === 0 ? "easy" : i === 1 ? "medium" : "hard",
        chapterId: "chap-3",
      });
    }

    // Add mock vectors questions
    for (let i = 0; i < structureParams.chap5Count; i++) {
      generated.push({
        id: `auto-chap5-${i}`,
        content: `[Vectơ] Câu hỏi trắc nghiệm tự động về phép cộng/trừ/tọa độ vectơ số ${i + 1}`,
        difficulty: i % 2 === 0 ? "medium" : "hard",
        chapterId: "chap-5",
      });
    }

    // Add mock statistics/probability questions
    for (let i = 0; i < structureParams.chap7Count; i++) {
      generated.push({
        id: `auto-chap7-${i}`,
        content: `[Thống kê & Xác suất] Câu hỏi tự động về số trung vị/phương sai số ${i + 1}`,
        difficulty: i === 0 ? "easy" : "medium",
        chapterId: "chap-7",
      });
    }

    setQuestions(generated);
    setShowAutoStructure(false);
    alert(
      `[AI GENERATE MOCK] Đã tự động phân bổ sinh đề thi gồm ${totalSelected} câu hỏi dựa trên cấu trúc phân bố ma trận độ khó!`
    );
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
      `Đã giao bài tập thành công! Bài kiểm tra Toán 10 '${title}' được phát hành cho lớp: ${selectedClasses.join(
        ", "
      )}.`
    );
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Back button & Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Link href="/dashboard/tutor/assignments">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Tạo bài tập mới (Toán 10)
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tạo đề thi trắc nghiệm Toán lớp 10 theo chương trình GDPT 2018.
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
                      className="rounded border-[var(--border-default)] text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
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
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <div>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Xem lời giải ngay sau khi nộp
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Học sinh xem được lời giải chi tiết và gợi ý AI sau khi bấm nộp
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
                  className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Tạo theo cấu trúc ma trận
                </Button>
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

            <div className="space-y-3 border-b border-[var(--border-subtle)] pb-4 text-[var(--text-secondary)]">
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
                onClick={() => handlePublish("active")}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
              >
                Phát hành đề Toán 10
              </Button>
              <Button
                onClick={() => handlePublish("draft")}
                variant="outline"
                className="w-full rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2.5"
              >
                Lưu làm bản nháp
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          AI MATRIX AUTO GENERATE MODAL (MOCK)
          ============================================================ */}
      <AnimatePresence>
        {showAutoStructure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Cấu trúc ma trận phân bổ đề thi Toán 10
                </h3>
                <button onClick={() => setShowAutoStructure(false)} className="text-[var(--text-tertiary)] hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Matrix inputs */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-600">1. Số lượng câu hỏi theo chương (Chương trình GDPT 2018):</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 1: Mệnh đề và tập hợp</label>
                      <input
                        type="number"
                        value={structureParams.chap1Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap1Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 3: Hàm số và đồ thị</label>
                      <input
                        type="number"
                        value={structureParams.chap3Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap3Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 5: Vectơ</label>
                      <input
                        type="number"
                        value={structureParams.chap5Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap5Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px]">Chương 7: Thống kê & Xác suất</label>
                      <input
                        type="number"
                        value={structureParams.chap7Count}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, chap7Count: Number(e.target.value) }))}
                        className="w-full p-2 border border-[var(--border-default)] rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
                  <h4 className="font-semibold text-indigo-600">2. Phân bố mức độ nhận thức (%):</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Nhận biết</label>
                      <input
                        type="number"
                        value={structureParams.recognitionPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, recognitionPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Thông hiểu</label>
                      <input
                        type="number"
                        value={structureParams.understandingPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, understandingPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Vận dụng</label>
                      <input
                        type="number"
                        value={structureParams.applicationPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, applicationPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1 text-center">
                      <label className="text-[9px]">Vận dụng cao</label>
                      <input
                        type="number"
                        value={structureParams.advApplicationPct}
                        onChange={(e) => setStructureParams(prev => ({ ...prev, advApplicationPct: Number(e.target.value) }))}
                        className="w-full p-2 text-center border border-[var(--border-default)] rounded-xl font-bold"
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
                  className="rounded-xl border-[var(--border-default)] text-[var(--text-secondary)]"
                >
                  Hủy bỏ
                </Button>
                <Button
                  onClick={handleGenerateByStructure}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Xác nhận sinh đề tự động
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
