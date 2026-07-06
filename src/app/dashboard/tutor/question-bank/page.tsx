"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  Database,
  Calendar,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { questionBank, subjects } from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function QuestionBankPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  const filteredQuestions = questionBank.filter((q) => {
    const matchesSearch = q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (q.source && q.source.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = subjectFilter === "All" || q.subject === subjectFilter;
    const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    const matchesGrade = gradeFilter === "All" || q.grade === Number(gradeFilter);

    return matchesSearch && matchesSubject && matchesDifficulty && matchesStatus && matchesGrade;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  const handleCreateNew = () => {
    alert("Đã mô phỏng mở form tạo câu hỏi trắc nghiệm mới! Tính năng đang phát triển.");
  };

  const handleAddToAssignment = () => {
    alert(`Đã chọn ${selectedIds.length} câu hỏi để chuẩn bị tạo bài tập mới!`);
    setSelectedIds([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "READY":
        return <Badge className="bg-green-50 text-green-700 border-green-150 text-[9px] uppercase font-semibold">Sẵn sàng</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-150 text-[9px] uppercase font-semibold">Nháp</Badge>;
      case "NEEDS_REVIEW":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-150 text-[9px] uppercase font-semibold">Cần duyệt</Badge>;
      case "REVIEW_REQUIRED":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-150 text-[9px] uppercase font-semibold">Cần sửa</Badge>;
      case "ERROR":
        return <Badge className="bg-red-50 text-red-700 border-red-150 text-[9px] uppercase font-semibold">Lỗi OCR</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Ngân hàng câu hỏi
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Lưu trữ câu hỏi trắc nghiệm, phân loại môn học, bài tập và quản lý trạng thái câu hỏi.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCreateNew}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Tạo câu hỏi mới
          </Button>
        </div>
      </motion.div>

      {/* Filter panel */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
          <Filter className="h-4 w-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Bộ lọc tìm kiếm
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
          {/* Search query */}
          <div className="space-y-1 sm:col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Tìm nội dung / nguồn</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="text"
                placeholder="Nhập từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Môn học</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả môn</option>
              <option value="Toán học">Toán học</option>
              <option value="Vật lý">Vật lý</option>
              <option value="Hóa học">Hóa học</option>
            </select>
          </div>

          {/* Grade */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Khối lớp</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả khối</option>
              <option value="10">Khối 10</option>
              <option value="11">Khối 11</option>
              <option value="12">Khối 12</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Mức độ</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả độ khó</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
              <option value="expert">Cực khó</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="READY">Sẵn sàng (READY)</option>
              <option value="DRAFT">Nháp (DRAFT)</option>
              <option value="NEEDS_REVIEW">Cần duyệt (NEEDS_REVIEW)</option>
              <option value="REVIEW_REQUIRED">Cần sửa (REVIEW_REQUIRED)</option>
              <option value="ERROR">Lỗi OCR (ERROR)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Bulk actions sticky panel */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center justify-between gap-4 px-5 py-3 rounded-2xl bg-indigo-900 text-white shadow-xl max-w-lg w-[calc(100%-2rem)]"
        >
          <span className="text-xs font-semibold">
            Đã chọn: <span className="text-indigo-200 font-bold">{selectedIds.length}</span> câu hỏi
          </span>
          <div className="flex gap-2">
            <Button
              onClick={handleAddToAssignment}
              size="sm"
              className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs py-1.5"
            >
              Thêm vào bài tập
            </Button>
            <Button
              onClick={() => setSelectedIds([])}
              variant="ghost"
              size="sm"
              className="rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-xs py-1.5"
            >
              Bỏ chọn tất cả
            </Button>
          </div>
        </motion.div>
      )}

      {/* Questions list container */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <span>Tìm thấy <span className="font-semibold text-indigo-500">{filteredQuestions.length}</span> câu hỏi phù hợp</span>
          <button
            onClick={toggleSelectAll}
            className="font-medium text-indigo-500 hover:underline"
          >
            {selectedIds.length === filteredQuestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả hiển thị"}
          </button>
        </div>

        {filteredQuestions.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)]"
            style={{ background: "var(--surface-card)" }}
          >
            <FolderOpen className="h-10 w-10 mb-2" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              Không tìm thấy câu hỏi nào
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Hãy thử nới lỏng các tiêu chí lọc tìm kiếm.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuestions.map((q) => {
              const isSelected = selectedIds.includes(q.id);
              const isExpanded = expandedId === q.id;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all duration-200 p-4 ${
                    isSelected ? "border-indigo-400 bg-indigo-50/10" : "border-[var(--border-default)]"
                  }`}
                  style={{ background: "var(--surface-card)" }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(q.id)}
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                    />

                    {/* Content preview */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(q.status)}
                        <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                          {q.subject}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] font-semibold">
                          Khối {q.grade}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                          {q.difficulty}
                        </Badge>
                      </div>

                      <p
                        onClick={() => toggleSelect(q.id)}
                        className="text-xs font-medium cursor-pointer leading-relaxed text-left"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {isExpanded ? q.content : `${q.content.slice(0, 160)}${q.content.length > 160 ? "..." : ""}`}
                      </p>

                      {/* Expandable answers / explanation details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-4 overflow-hidden"
                          >
                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {q.options.map((opt) => (
                                <div
                                  key={opt.id}
                                  className={`p-2.5 rounded-xl border ${
                                    opt.id === q.correctAnswer
                                      ? "border-green-300 bg-green-50/50 text-green-700 font-semibold"
                                      : "border-[var(--border-subtle)] bg-[var(--surface-subtle)]"
                                  }`}
                                >
                                  <span className="font-bold mr-1.5">{opt.label}.</span>
                                  {opt.content}
                                </div>
                              ))}
                            </div>

                            {/* Detailed explanation */}
                            <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] text-xs space-y-1.5">
                              <p className="font-semibold text-emerald-600">Lời giải chi tiết:</p>
                              <p className="whitespace-pre-line text-[var(--text-secondary)] leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>

                            {/* AI assistant explanation if available */}
                            {q.aiExplanation && (
                              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50 text-xs space-y-1.5">
                                <p className="font-semibold text-indigo-600 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5" /> Lời giải nâng cao (AI gợi ý):
                                </p>
                                <p className="whitespace-pre-line text-indigo-900 leading-relaxed">
                                  {q.aiExplanation}
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Footer Row */}
                      <div className="mt-3.5 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        <div className="flex items-center gap-3">
                          <span>Chủ đề: <span className="font-medium text-[var(--text-secondary)]">{q.topic}</span></span>
                          <span>Chương: <span className="font-medium text-[var(--text-secondary)]">{q.chapter}</span></span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 sm:mt-0">
                          {q.source && <span>Nguồn: {q.source}</span>}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : q.id)}
                            className="font-bold text-indigo-500 flex items-center gap-1 hover:underline text-xs"
                          >
                            {isExpanded ? "Thu gọn" : "Xem chi tiết"} {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
