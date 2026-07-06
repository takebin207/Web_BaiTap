"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  wrongQuestionItems,
  tutorClasses,
  aiReviewSummaries,
  sampleChapters,
  sampleTopics,
} from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WrongQuestionsPage() {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chapterFilter, setChapterFilter] = useState("All");

  const aiReview = aiReviewSummaries[0];
  const classStudents = tutorClasses[0]?.students || [];

  // Filtered wrong question items
  const filteredWrongQuestions = wrongQuestionItems.filter((wq) => {
    const matchesSearch =
      wq.question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wq.question.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChapter = chapterFilter === "All" || wq.question.chapterId === chapterFilter;
    return matchesSearch && matchesChapter;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  const getTypeLabel = (t: string) => {
    return t === "multiple_choice" ? "Trắc nghiệm" : "Đáp án ngắn";
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Phân tích câu hỏi sai Toán 10
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tổng hợp dữ liệu sai sót, câu hỏi bị bỏ qua và đề xuất giáo án ôn tập theo chương trình GDPT 2018.
          </p>
        </div>
      </motion.div>

      {/* Aggregate Stats */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tổng lượt trả lời sai Toán 10
            </span>
            <AlertTriangle className="h-5 w-5 text-red-500 bg-red-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {wrongQuestionItems.reduce((acc, curr) => acc + curr.wrongCount, 0)}
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            Dữ liệu tích lũy từ các bài kiểm tra đã chấm
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tỉ lệ sai sót cao nhất
            </span>
            <AlertTriangle className="h-5 w-5 text-orange-500 bg-orange-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {wrongQuestionItems.length > 0 ? Math.max(...wrongQuestionItems.map((q) => q.wrongRate)) : 0}%
          </p>
          <p className="text-[10px] mt-1.5 truncate" style={{ color: "var(--text-tertiary)" }}>
            Chủ đề: {sampleTopics.find(t => t.id === wrongQuestionItems[0]?.question.topicId)?.name || "N/A"}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tổng lượt bỏ qua (Skip)
            </span>
            <Clock className="h-5 w-5 text-amber-500 bg-amber-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {wrongQuestionItems.reduce((acc, curr) => acc + curr.skippedCount, 0)}
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            Ảnh hưởng đến đánh giá lỗ hổng kiến thức
          </p>
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wrong questions list (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            {/* Search/Filter Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                <input
                  type="text"
                  placeholder="Tìm nội dung câu hỏi sai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                <select
                  value={chapterFilter}
                  onChange={(e) => setChapterFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
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
            </div>

            <Tabs defaultValue="most_missed" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-[var(--surface-subtle)] p-1 rounded-xl">
                <TabsTrigger value="most_missed" className="text-xs rounded-lg">Sai nhiều nhất</TabsTrigger>
                <TabsTrigger value="by_student" className="text-xs rounded-lg">Theo học sinh</TabsTrigger>
                <TabsTrigger value="skipped" className="text-xs rounded-lg">Bị bỏ qua</TabsTrigger>
                <TabsTrigger value="slow" className="text-xs rounded-lg">Mất thời gian</TabsTrigger>
              </TabsList>

              {/* Tab 1: Most Missed */}
              <TabsContent value="most_missed" className="space-y-4 mt-4 text-xs">
                {filteredWrongQuestions.map((wq) => (
                  <div
                    key={wq.question.id}
                    className="border border-[var(--border-subtle)] rounded-xl p-4 transition-all hover:shadow-sm"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-50 text-red-600 border-red-100 text-[10px]">
                          Tỷ lệ sai: {wq.wrongRate}%
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {getTypeLabel(wq.question.questionType)}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {sampleChapters.find((c) => c.id === wq.question.chapterId)?.name || wq.question.chapterId}
                        </Badge>
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        ID: {wq.question.id}
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-xs font-semibold mb-3 text-left" style={{ color: "var(--text-primary)" }}>
                      {wq.question.content}
                    </p>

                    {/* Options if MC */}
                    {wq.question.questionType === "multiple_choice" && wq.question.options && (
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {wq.question.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2 rounded-lg border ${
                              opt.id === wq.question.correctAnswer
                                ? "border-green-300 bg-green-50/50 text-green-700 font-semibold"
                                : "border-[var(--border-subtle)] bg-white"
                            }`}
                          >
                            <span className="font-bold mr-1">{opt.label}.</span> {opt.content}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border-subtle)]">
                      <button
                        onClick={() => toggleExpand(wq.question.id)}
                        className="text-indigo-500 font-semibold flex items-center gap-1 hover:underline"
                      >
                        {expandedQuestionId === wq.question.id ? (
                          <>Thu gọn <ChevronUp className="h-3 w-3" /></>
                        ) : (
                          <>Xem học sinh sai ({wq.wrongCount}) <ChevronDown className="h-3 w-3" /></>
                        )}
                      </button>
                      <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        <span>Thời gian TB: {wq.avgTimeSpent}s</span>
                        <span>Bỏ qua: {wq.skippedCount} lượt</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedQuestionId === wq.question.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 pt-3 border-t border-dashed border-[var(--border-subtle)] space-y-2 overflow-hidden"
                        >
                          <p className="font-semibold text-red-500">Danh sách học sinh chọn sai:</p>
                          <div className="flex flex-wrap gap-1">
                            {wq.studentsWrong.map((std, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[9px] bg-red-50 text-red-700">
                                {std}
                              </Badge>
                            ))}
                          </div>
                          {wq.question.aiExplanation && (
                            <div className="mt-2.5 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/50">
                              <p className="font-bold text-indigo-600 mb-1 flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5" /> Phân tích lời giải AI:
                              </p>
                              <p className="whitespace-pre-line leading-relaxed text-indigo-900">
                                {wq.question.aiExplanation}
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 2: By Student */}
              <TabsContent value="by_student" className="space-y-3 mt-4 text-xs">
                {classStudents.map((std) => (
                  <div
                    key={std.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-subtle)] gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>{std.name}</h4>
                        <Badge variant="outline" className="text-[9px]">Điểm trung bình: {std.avgScore}</Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex-1 max-w-[200px]">
                          <Progress value={Math.round(((std.totalAttempts - std.wrongCount) / std.totalAttempts) * 100)} className="h-1.5" />
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          Độ chính xác: {Math.round(((std.totalAttempts - std.wrongCount) / std.totalAttempts) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-red-50 text-red-700 border-red-100">{std.wrongCount} câu làm sai</Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 3: Skipped */}
              <TabsContent value="skipped" className="space-y-3 mt-4 text-xs">
                {filteredWrongQuestions.filter((q) => q.skippedCount > 0).map((wq) => (
                  <div key={wq.question.id} className="border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--surface-subtle)]">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100">{wq.skippedCount} học sinh skip</Badge>
                      <span style={{ color: "var(--text-tertiary)" }}>ID: {wq.question.id}</span>
                    </div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{wq.question.content}</p>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 4: Slow */}
              <TabsContent value="slow" className="space-y-3 mt-4 text-xs">
                {filteredWrongQuestions.map((wq) => (
                  <div key={wq.question.id} className="border border-[var(--border-subtle)] rounded-xl p-4 bg-[var(--surface-subtle)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-600">Thời gian làm trung bình: {wq.avgTimeSpent}s</span>
                      <Badge variant="outline" className="text-red-500 border-red-150">Sai {wq.wrongRate}%</Badge>
                    </div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{wq.question.content}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* AI lesson suggestions side panel (1/3) */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border border-indigo-100 shadow-sm relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.04))",
              borderColor: "oklch(0.58 0.2 260 / 0.15)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-3.5 text-xs">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">AI Review EStudy</span>
                <h3 className="font-semibold" style={{ color: "var(--text-secondary)" }}>Đề xuất giảng dạy Toán 10</h3>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {aiReview.summary}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Kế hoạch ôn tập đề xuất
            </h3>
            <div className="space-y-3">
              {aiReview.nextLessonSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p style={{ color: "var(--text-secondary)" }}>{sug}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Độ chính xác theo chủ đề Toán 10
            </h3>
            <div className="space-y-4">
              {aiReview.weakTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{topic.topic}</span>
                    <span className="font-bold text-red-500">{topic.wrongRate}% sai</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-[var(--surface-subtle)]">
                    <div className="h-full rounded-full bg-red-500" style={{ width: `${topic.wrongRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
