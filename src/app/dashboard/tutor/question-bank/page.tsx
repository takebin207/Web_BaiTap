"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  sampleChapters,
  sampleTopics,
  Question,
} from "@/data/mock/data";
import MathRenderer from "@/components/ui/math-renderer";
import Link from "next/link";
import { useRouter } from "next/navigation";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function mapDbQuestionToFrontend(dbQ: any): Question {
  return {
    id: dbQ.id,
    content: dbQ.content,
    options: dbQ.options ? (dbQ.options as any) : undefined,
    correctAnswer: dbQ.correctAnswer,
    explanation: dbQ.explanation || "",
    curriculumId: "cur-2018-math-10",
    subjectId: dbQ.subject || "math",
    gradeId: dbQ.grade || "grade-10",
    chapterId: dbQ.chapter || "chap-1",
    topicId: dbQ.topic || "top-1-1",
    questionType: dbQ.questionType.toLowerCase() as any,
    difficulty: dbQ.difficulty.toLowerCase() as any,
    cognitiveLevel: dbQ.cognitiveLevel.toLowerCase() as any,
    source: dbQ.source || "",
    status: dbQ.status,
    createdAt: dbQ.createdAt,
  };
}

export default function QuestionBankPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter] = useState("All"); // Kept local since grade 10 math is primary focus
  const [gradeFilter] = useState("All");
  const [chapterFilter, setChapterFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [cognitiveFilter, setCognitiveFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showManualModal, setShowManualModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

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

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tutor/questions");
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(mapDbQuestionToFrontend);
        setQuestions(mapped);
      } else {
        console.error("Không thể lấy dữ liệu câu hỏi từ API");
      }
    } catch (e) {
      console.error("Lỗi khi kết nối API câu hỏi:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.content) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const options = manualForm.questionType === "multiple_choice" ? [
      { id: "a", label: "A", content: manualForm.optA || "" },
      { id: "b", label: "B", content: manualForm.optB || "" },
      { id: "c", label: "C", content: manualForm.optC || "" },
      { id: "d", label: "D", content: manualForm.optD || "" },
    ] : null;

    const payload = {
      content: manualForm.content,
      questionType: manualForm.questionType.toUpperCase(),
      options: options,
      correctAnswer: manualForm.correctAnswer,
      explanation: manualForm.explanation,
      subject: "math",
      grade: "grade-10",
      chapter: manualForm.chapterId,
      topic: manualForm.topicId,
      difficulty: manualForm.difficulty.toUpperCase(),
      cognitiveLevel: manualForm.cognitiveLevel.toUpperCase(),
      source: manualForm.source || null,
      status: editingQuestionId ? undefined : "DRAFT",
    };

    try {
      let res;
      if (editingQuestionId) {
        res = await fetch(`/api/tutor/questions/${editingQuestionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/tutor/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingQuestionId ? "Đã lưu chỉnh sửa câu hỏi!" : "Đã tạo câu hỏi nháp mới!");
        setShowManualModal(false);
        setEditingQuestionId(null);
        setManualForm({
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
        fetchQuestions();
      } else {
        const err = await res.json();
        alert("Lỗi khi lưu câu hỏi: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống khi lưu câu hỏi");
    }
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestionId(q.id);
    const optA = q.options?.find(o => o.id === 'a')?.content || "";
    const optB = q.options?.find(o => o.id === 'b')?.content || "";
    const optC = q.options?.find(o => o.id === 'c')?.content || "";
    const optD = q.options?.find(o => o.id === 'd')?.content || "";

    setManualForm({
      content: q.content,
      optA,
      optB,
      optC,
      optD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
      chapterId: q.chapterId,
      topicId: q.topicId,
      difficulty: q.difficulty,
      cognitiveLevel: q.cognitiveLevel,
      questionType: q.questionType,
      source: q.source || "",
    });
    setShowManualModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    try {
      const res = await fetch(`/api/tutor/questions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const result = await res.json();
        alert(result.message);
        fetchQuestions();
      } else {
        const err = await res.json();
        alert("Lỗi khi xóa câu hỏi: " + err.error);
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi hệ thống khi xóa câu hỏi");
    }
  };

  const simulateBulkParse = () => {
    if (!bulkText) {
      alert("Vui lòng dán câu hỏi vào ô trống!");
      return;
    }
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

  const handleBulkSave = async () => {
    if (!bulkPreview) return;
    
    let savedCount = 0;
    for (const p of bulkPreview) {
      try {
        const payload = {
          content: p.content,
          questionType: "MULTIPLE_CHOICE",
          options: [
            { id: "a", label: "A", content: "Lựa chọn A" },
            { id: "b", label: "B", content: "Lựa chọn B" },
            { id: "c", label: "C", content: "Lựa chọn C" },
            { id: "d", label: "D", content: "Lựa chọn D" },
          ],
          correctAnswer: p.key.toLowerCase(),
          explanation: "Lời giải thô được nhập hàng loạt tự động.",
          subject: "math",
          grade: "grade-10",
          chapter: "chap-1",
          topic: "top-1-1",
          difficulty: "MEDIUM",
          cognitiveLevel: "UNDERSTANDING",
          status: "NEEDS_REVIEW",
        };
        const res = await fetch("/api/tutor/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) savedCount++;
      } catch (e) {
        console.error(e);
      }
    }
    
    alert(`Đã lưu thành công ${savedCount}/${bulkPreview.length} câu hỏi được bóc tách vào Cơ sở dữ liệu dưới trạng thái 'NEEDS_REVIEW'.`);
    setShowBulkModal(false);
    setBulkText("");
    setBulkPreview(null);
    fetchQuestions();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "READY":
        return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200/20 text-[9px] uppercase font-semibold">Sẵn sàng</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border border-gray-200/20 text-[9px] uppercase font-semibold">Nháp</Badge>;
      case "NEEDS_REVIEW":
        return <Badge className="bg-yellow-500/10 text-yellow-755 dark:text-yellow-400 border border-yellow-200/20 text-[9px] uppercase font-semibold">Cần duyệt</Badge>;
      case "REVIEW_REQUIRED":
        return <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200/20 text-[9px] uppercase font-semibold">Cần sửa</Badge>;
      case "ERROR":
        return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/20 text-[9px] uppercase font-semibold">Lỗi OCR</Badge>;
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
            Bộ học liệu và ngân hàng câu hỏi lớp 10 chương trình GDPT 2018 (Kết nối Cơ sở dữ liệu).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowBulkModal(true)}
            size="sm"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-sm text-xs border-0 cursor-pointer"
          >
            <Sparkles className="mr-1.5 h-4 w-4 text-amber-100 animate-pulse" /> Nhập nhanh câu hỏi (Paste)
          </Button>
          <Button
            onClick={() => {
              setEditingQuestionId(null);
              setManualForm({
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
              setShowManualModal(true);
            }}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm text-xs border-0 cursor-pointer"
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
                className="w-full pl-8 pr-3 py-1 text-xs rounded-xl border border border-[var(--border-default)] bg-[var(--bg-secondary)]"
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
                    {t.name
                  }</option>
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

      {/* Question List rendering */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs text-[var(--text-tertiary)]">
          <span>Tìm thấy <span className="font-semibold text-indigo-500">{filteredQuestions.length}</span> câu hỏi Toán 10</span>
          <button onClick={toggleSelectAll} className="font-medium text-indigo-500 hover:underline cursor-pointer">
            {selectedIds.length === filteredQuestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-[var(--border-default)] bg-[var(--surface-card)]">
            <p className="text-xs font-semibold text-[var(--text-secondary)] animate-pulse">
              Đang tải danh sách câu hỏi từ Cơ sở dữ liệu...
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)] bg-[var(--surface-card)]">
            <FolderOpen className="h-10 w-10 mb-2 text-[var(--text-tertiary)]" />
            <p className="text-xs font-semibold mb-3.5 text-[var(--text-secondary)]">
              Không tìm thấy câu hỏi Toán 10 nào phù hợp
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
                                    <span className="font-bold mr-1.5">{opt.label || opt.id.toUpperCase()}.</span>
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
                          
                          {/* CRUD Action buttons */}
                          <button
                            onClick={() => handleOpenEdit(q)}
                            className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            Xóa
                          </button>
                          
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : q.id)}
                            className="font-bold text-indigo-500 flex items-center gap-1 hover:underline text-xs cursor-pointer"
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

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-4 bg-[var(--surface-card)]/95 backdrop-blur border border-[var(--border-default)] max-w-md w-[90%] sm:w-full justify-between text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                {selectedIds.length}
              </span>
              <span className="font-semibold text-[var(--text-secondary)]">Câu hỏi đã chọn</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedIds([])}
                variant="ghost"
                size="sm"
                className="text-[10px] text-red-500 hover:bg-red-500/10 rounded-xl px-2.5 py-1.5 h-7 cursor-pointer"
              >
                Bỏ chọn
              </Button>
              <Button
                onClick={() => {
                  localStorage.setItem("estudy_selected_question_ids", JSON.stringify(selectedIds));
                  router.push("/dashboard/tutor/assignments/create");
                }}
                size="sm"
                className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold px-3 py-1.5 h-7 cursor-pointer"
              >
                Tạo bài tập từ câu đã chọn
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL A: MANUAL QUESTION ENTRY / EDIT FORM
          ============================================================ */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--surface-card)] rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 border border-[var(--border-default)]"
            >
              <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  {editingQuestionId ? "Chỉnh sửa câu hỏi (Toán 10)" : "Thêm câu hỏi thủ công (Toán 10)"}
                </h3>
                <button onClick={() => setShowManualModal(false)} className="text-[var(--text-tertiary)] hover:text-red-500 cursor-pointer">
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
                    className="w-full p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                </div>

                {/* Multiple choice options */}
                {manualForm.questionType === "multiple_choice" && (
                  <div className="space-y-1.5">
                    <label className="font-semibold block text-[var(--text-secondary)]">Các phương án trả lời:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Lựa chọn A"
                        value={manualForm.optA}
                        onChange={(e) => setManualForm(prev => ({ ...prev, optA: e.target.value }))}
                        className="p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="Lựa chọn B"
                        value={manualForm.optB}
                        onChange={(e) => setManualForm(prev => ({ ...prev, optB: e.target.value }))}
                        className="p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="Lựa chọn C"
                        value={manualForm.optC}
                        onChange={(e) => setManualForm(prev => ({ ...prev, optC: e.target.value }))}
                        className="p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        placeholder="Lựa chọn D"
                        value={manualForm.optD}
                        onChange={(e) => setManualForm(prev => ({ ...prev, optD: e.target.value }))}
                        className="p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                )}

                {/* Correct answer & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[var(--text-secondary)]">Đáp án đúng</label>
                    {manualForm.questionType === "multiple_choice" ? (
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
                    ) : (
                      <input
                        type="text"
                        placeholder="Nhập giá trị đáp án chính xác..."
                        value={manualForm.correctAnswer}
                        onChange={(e) => setManualForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                        className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                      />
                    )}
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
                      onChange={(e) => setManualForm(prev => ({ ...prev, chapterId: e.target.value, topicId: "All" }))}
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
                      className="w-full p-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
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
                    className="w-full p-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  />
                </div>

                <div className="flex gap-2 pt-3 justify-end border-t border-[var(--border-subtle)]">
                  <Button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    variant="outline"
                    className="rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                  >
                    {editingQuestionId ? "Lưu thay đổi" : "Lưu câu hỏi nháp"}
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
                <button onClick={() => setShowBulkModal(false)} className="text-[var(--text-tertiary)] hover:text-red-500 cursor-pointer">
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
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
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
                        className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 cursor-pointer"
                      >
                        Lưu vào Cơ sở dữ liệu
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
