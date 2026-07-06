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
  ClipboardList,
  Sparkles,
  X,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  questionBank,
  sampleChapters,
  sampleTopics,
  Question,
} from "@/data/mock/data";
import MathRenderer from "@/components/ui/math-renderer";
import { getLocalStorageQuestions } from "@/data/mock/store";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function QuestionBankPage() {
  const [questions] = useState<Question[]>(() => getLocalStorageQuestions());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [cognitiveFilter, setCognitiveFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showManualModal, setShowManualModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Manual form state
  const [manualForm, setManualForm] = useState({
    content: "",
    optA: "",
    optB: "",
    optC: "",
    optD: "",
    correctAnswer: "a",
    explanation: "",
    chapterId: "chap-1",
    topicId: "top-1-1",
    difficulty: "medium",
    cognitiveLevel: "understanding",
    questionType: "multiple_choice",
    source: "",
  });

  // Bulk paste state
  const [bulkText, setBulkText] = useState("");
  const [bulkPreview, setBulkPreview] = useState<Array<{ content: string; key: string }> | null>(null);

  // Filter local logic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.source && q.source.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = subjectFilter === "All" || q.subjectId === "math";
    const matchesGrade = gradeFilter === "All" || q.gradeId === "grade-10";
    const matchesChapter = chapterFilter === "All" || q.chapterId === chapterFilter;
    const matchesTopic = topicFilter === "All" || q.topicId === topicFilter;
    const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
    const matchesCognitive = cognitiveFilter === "All" || q.cognitiveLevel === cognitiveFilter;
    const matchesType = typeFilter === "All" || q.questionType === typeFilter;
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesGrade &&
      matchesChapter &&
      matchesTopic &&
      matchesDifficulty &&
      matchesCognitive &&
      matchesType &&
      matchesStatus
    );
  });

  // Checkbox interactions
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

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.content) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }
    alert(
      `[MOCK SAVE] Đã mô phỏng lưu câu hỏi mới vào Ngân hàng câu hỏi dưới trạng thái 'DRAFT':\n"${manualForm.content.slice(
        0,
        50
      )}..."`
    );
    setShowManualModal(false);
  };

  const simulateBulkParse = () => {
    if (!bulkText) {
      alert("Vui lòng dán câu hỏi vào ô trống!");
      return;
    }
    // Simulate simple regex splitting
    const questionBlocks = bulkText.split(/(?=Câu\s+\d+\.)/gi).filter((block) => block.trim().length > 0);
    const parsed = questionBlocks.map((block, idx) => {
      const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      const questionLine = lines[0] || `Câu hỏi ${idx + 1}`;
      const answerMatch = block.match(/Đáp\s*án\s*:\s*([A-D])/i);
      const answer = answerMatch ? answerMatch[1] : "?";
      return {
        content: questionLine,
        key: answer,
      };
    });
    setBulkPreview(parsed);
  };

  const handleBulkSave = () => {
    if (!bulkPreview) return;
    alert(`[MOCK SAVE] Đã mô phỏng lưu ${bulkPreview.length} câu hỏi được bóc tách vào Ngân hàng câu hỏi dưới trạng thái 'NEEDS_REVIEW'.`);
    setShowBulkModal(false);
    setBulkText("");
    setBulkPreview(null);
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

  const getCognitiveLabel = (lvl: string) => {
    switch (lvl) {
      case "recognition": return "Nhận biết";
      case "understanding": return "Thông hiểu";
      case "application": return "Vận dụng";
      case "advanced_application": return "Vận dụng cao";
      default: return lvl;
    }
  };

  const getTypeLabel = (t: string) => {
    switch (t) {
      case "multiple_choice": return "Trắc nghiệm";
      case "short_answer": return "Đáp án ngắn";
      case "essay": return "Tự luận";
      case "image_based": return "Dựa trên hình ảnh";
      default: return t;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Ngân hàng câu hỏi Toán 10
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Bộ học liệu và ngân hàng câu hỏi lớp 10 chương trình GDPT 2018 (SAMPLE / MOCK / EDITABLE).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/tutor/import/bulk-paste">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold"
            >
              <ClipboardList className="mr-1.5 h-4 w-4" /> Nhập hàng loạt (Paste)
            </Button>
          </Link>
          <Button
            onClick={() => setShowManualModal(true)}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm text-xs"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Thêm câu thủ công
          </Button>
        </div>
      </motion.div>

      {/* Advanced Filters Card */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 space-y-4"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2.5">
          <Filter className="h-4 w-4 text-indigo-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Bộ lọc kiến thức Toán 10
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Search */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Tìm nội dung</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Chapter */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Chương / Mạch</label>
            <select
              value={chapterFilter}
              onChange={(e) => {
                setChapterFilter(e.target.value);
                setTopicFilter("All");
              }}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả chương</option>
              {sampleChapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Chủ đề chi tiết</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả chủ đề</option>
              {sampleTopics
                .filter((t) => chapterFilter === "All" || t.chapterId === chapterFilter)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Độ khó</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Mọi mức độ</option>
              <option value="easy">Dễ</option>
              <option value="medium">Trung bình</option>
              <option value="hard">Khó</option>
            </select>
          </div>

          {/* Cognitive Level */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Nhận thức</label>
            <select
              value={cognitiveFilter}
              onChange={(e) => setCognitiveFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Tất cả mức độ</option>
              <option value="recognition">Nhận biết</option>
              <option value="understanding">Thông hiểu</option>
              <option value="application">Vận dụng</option>
              <option value="advanced_application">Vận dụng cao</option>
            </select>
          </div>

          {/* Question Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Loại câu hỏi</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <option value="All">Mọi loại</option>
              <option value="multiple_choice">Trắc nghiệm</option>
              <option value="short_answer">Điền đáp án ngắn</option>
              <option value="essay">Tự luận</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">Trạng thái duyệt</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
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
              onClick={() => {
                alert(`Đã mô phỏng nạp ${selectedIds.length} câu hỏi vào trình tạo bài tập!`);
                setSelectedIds([]);
              }}
              size="sm"
              className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs py-1.5"
            >
              Tạo bài tập
            </Button>
            <Button
              onClick={() => setSelectedIds([])}
              variant="ghost"
              size="sm"
              className="rounded-xl text-white/80 hover:text-white hover:bg-white/10 text-xs py-1.5"
            >
              Bỏ chọn
            </Button>
          </div>
        </motion.div>
      )}

      {/* Question List rendering */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs text-[var(--text-tertiary)]">
          <span>Tìm thấy <span className="font-semibold text-indigo-500">{filteredQuestions.length}</span> câu hỏi Toán 10</span>
          <button onClick={toggleSelectAll} className="font-medium text-indigo-500 hover:underline">
            {selectedIds.length === filteredQuestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--surface-card)]">
            <FolderOpen className="h-10 w-10 mb-2 text-[var(--text-tertiary)]" />
            <p className="text-xs font-semibold mb-3.5 text-[var(--text-secondary)]">
              Không tìm thấy câu hỏi Toán 10 nào phù hợp
            </p>
            <Link href="/dashboard/tutor/import/bulk-paste">
              <Button size="sm" className="rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs py-1.5 px-3">
                Nhập câu hỏi từ văn bản thô
              </Button>
            </Link>
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
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(q.id)}
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {getStatusBadge(q.status)}
                        <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                          {getTypeLabel(q.questionType)}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-semibold">
                          {getCognitiveLabel(q.cognitiveLevel)}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-semibold text-indigo-600">
                          {q.difficulty.toUpperCase()}
                        </Badge>
                      </div>

                      <p
                        onClick={() => toggleSelect(q.id)}
                        className="text-xs font-medium cursor-pointer leading-relaxed text-left"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <MathRenderer text={q.content} />
                      </p>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-4 overflow-hidden text-xs"
                          >
                            {/* Options if MC */}
                            {q.questionType === "multiple_choice" && q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                                    <MathRenderer text={opt.content} />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Short Answer exact solution */}
                            {q.questionType === "short_answer" && (
                              <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/40 text-green-800">
                                <strong>Đáp án chính xác:</strong> <MathRenderer text={q.correctAnswer} />
                              </div>
                            )}

                            {/* Explanation */}
                            <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] space-y-1.5">
                              <p className="font-semibold text-emerald-600">Lời giải chi tiết:</p>
                              <p className="whitespace-pre-line text-[var(--text-secondary)] leading-relaxed">
                                <MathRenderer text={q.explanation} />
                              </p>
                            </div>

                            {q.aiExplanation && (
                              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/50 space-y-1.5">
                                <p className="font-semibold text-indigo-600 flex items-center gap-1">
                                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Trợ lý AI gợi ý:
                                </p>
                                <p className="whitespace-pre-line text-indigo-950 leading-relaxed">
                                  <MathRenderer text={q.aiExplanation} />
                                </p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Footer Row info */}
                      <div className="mt-3.5 pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        <div className="flex items-center gap-3">
                          <span>Chương: <span className="font-semibold text-[var(--text-secondary)]">{sampleChapters.find(c => c.id === q.chapterId)?.name || q.chapterId}</span></span>
                          <span>Chủ đề: <span className="font-semibold text-[var(--text-secondary)]">{sampleTopics.find(t => t.id === q.topicId)?.name || q.topicId}</span></span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 sm:mt-0">
                          {q.source && <span>Nguồn: {q.source}</span>}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : q.id)}
                            className="font-bold text-indigo-500 flex items-center gap-1 hover:underline text-xs"
                          >
                            {isExpanded ? "Thu gọn" : "Xem lời giải"} {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
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

      {/* ============================================================
          MODAL A: MANUAL QUESTION ENTRY MOCK DRAWERS
          ============================================================ */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Thêm câu hỏi thủ công (Toán 10)
                </h3>
                <button onClick={() => setShowManualModal(false)} className="text-[var(--text-tertiary)] hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleManualSave} className="space-y-4 text-xs">
                {/* Content */}
                <div className="space-y-1">
                  <label className="font-semibold block text-[var(--text-secondary)]">Nội dung câu hỏi (hỗ trợ LaTeX):</label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Cho tam giác ABC có góc A = 60..."
                    value={manualForm.content}
                    onChange={(e) => setManualForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-default)]"
                  />
                </div>

                {/* Multiple choice options */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Lựa chọn A"
                    value={manualForm.optA}
                    onChange={(e) => setManualForm(prev => ({ ...prev, optA: e.target.value }))}
                    className="p-2 rounded-xl border border-[var(--border-default)]"
                  />
                  <input
                    type="text"
                    placeholder="Lựa chọn B"
                    value={manualForm.optB}
                    onChange={(e) => setManualForm(prev => ({ ...prev, optB: e.target.value }))}
                    className="p-2 rounded-xl border border-[var(--border-default)]"
                  />
                  <input
                    type="text"
                    placeholder="Lựa chọn C"
                    value={manualForm.optC}
                    onChange={(e) => setManualForm(prev => ({ ...prev, optC: e.target.value }))}
                    className="p-2 rounded-xl border border-[var(--border-default)]"
                  />
                  <input
                    type="text"
                    placeholder="Lựa chọn D"
                    value={manualForm.optD}
                    onChange={(e) => setManualForm(prev => ({ ...prev, optD: e.target.value }))}
                    className="p-2 rounded-xl border border-[var(--border-default)]"
                  />
                </div>

                {/* Correct answer & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Đáp án đúng</label>
                    <select
                      value={manualForm.correctAnswer}
                      onChange={(e) => setManualForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Loại câu hỏi</label>
                    <select
                      value={manualForm.questionType}
                      onChange={(e) => setManualForm(prev => ({ ...prev, questionType: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      <option value="multiple_choice">Trắc nghiệm</option>
                      <option value="short_answer">Điền đáp án ngắn</option>
                    </select>
                  </div>
                </div>

                {/* Chapter & Topic */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Chương / Mạch kiến thức</label>
                    <select
                      value={manualForm.chapterId}
                      onChange={(e) => setManualForm(prev => ({ ...prev, chapterId: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      {sampleChapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>{ch.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Chủ đề chi tiết</label>
                    <select
                      value={manualForm.topicId}
                      onChange={(e) => setManualForm(prev => ({ ...prev, topicId: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      {sampleTopics.filter(t => t.chapterId === manualForm.chapterId).map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Difficulty & Cognitive Level */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Độ khó</label>
                    <select
                      value={manualForm.difficulty}
                      onChange={(e) => setManualForm(prev => ({ ...prev, difficulty: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung bình</option>
                      <option value="hard">Khó</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Mức độ nhận thức</label>
                    <select
                      value={manualForm.cognitiveLevel}
                      onChange={(e) => setManualForm(prev => ({ ...prev, cognitiveLevel: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    >
                      <option value="recognition">Nhận biết</option>
                      <option value="understanding">Thông hiểu</option>
                      <option value="application">Vận dụng</option>
                      <option value="advanced_application">Vận dụng cao</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Nguồn đề</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Đề thi học kỳ..."
                      value={manualForm.source}
                      onChange={(e) => setManualForm(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                    />
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1">
                  <label className="font-semibold block text-[var(--text-secondary)]">Lời giải chi tiết:</label>
                  <textarea
                    rows={2}
                    placeholder="Nhập lời giải hoặc hướng dẫn làm bài..."
                    value={manualForm.explanation}
                    onChange={(e) => setManualForm(prev => ({ ...prev, explanation: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-default)]"
                  />
                </div>

                <div className="flex gap-2 pt-3 justify-end border-t border-[var(--border-subtle)]">
                  <Button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    variant="outline"
                    className="rounded-xl border-[var(--border-default)] text-[var(--text-secondary)]"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Lưu câu hỏi nháp
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL B: BULK PASTE IMPORT MOCK CONTROLS
          ============================================================ */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Nhập hàng loạt câu hỏi trắc nghiệm Toán 10 (Paste)
                </h3>
                <button onClick={() => setShowBulkModal(false)} className="text-[var(--text-tertiary)] hover:text-red-500">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Textarea Input */}
                <div className="space-y-2">
                  <label className="font-semibold block text-[var(--text-secondary)]">Dán văn bản câu hỏi vào đây:</label>
                  <textarea
                    rows={10}
                    placeholder="Câu 1. Cho hàm số...
A. ...
B. ...
C. ...
D. ...
Đáp án: B
Lời giải: ...
"
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--border-default)] font-mono text-[10px]"
                  />
                  <Button
                    onClick={simulateBulkParse}
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Chạy thử bóc tách (Parse)
                  </Button>
                </div>

                {/* Format guide & Simulator Preview */}
                <div className="space-y-3 p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-1">
                      <Sparkles className="h-4 w-4" /> Định dạng mẫu chuẩn:
                    </h4>
                    <pre className="p-2 rounded bg-white border border-[var(--border-default)] text-[9px] font-mono leading-relaxed overflow-x-auto">
                      {`Câu 1. Parabol y = x^2 có đỉnh là?
A. (0;0)
B. (1;1)
C. (2;4)
D. (-1;1)
Đáp án: A
Lời giải: Thay tọa độ ta thấy đỉnh là gốc tọa độ.`}
                    </pre>
                  </div>

                  {bulkPreview && (
                    <div className="space-y-2 pt-3 border-t border-dashed border-[var(--border-subtle)]">
                      <p className="font-semibold text-emerald-600">Kết quả bóc tách thử nghiệm:</p>
                      <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                        Phát hiện: <strong className="text-indigo-600">{bulkPreview.length} câu hỏi</strong>.
                        Tất cả câu hỏi sẽ được gán trạng thái <strong className="text-orange-500">CẦN DUYỆT</strong>.
                      </p>
                      <div className="max-h-[120px] overflow-y-auto space-y-1 text-[9px]">
                        {bulkPreview.map((item, idx) => (
                          <div key={idx} className="p-1 rounded bg-white flex justify-between">
                            <span className="truncate max-w-[200px]">{item.content}</span>
                            <span className="font-bold text-green-600">Đáp án: {item.key}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={handleBulkSave}
                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5"
                      >
                        Lưu vào Ngân hàng câu hỏi
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
