"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Users,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  wrongQuestionItems,
  tutorClasses,
  aiReviewSummaries,
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
  const [subjectFilter, setSubjectFilter] = useState("All");

  const aiReview = aiReviewSummaries[0];
  const classStudents = tutorClasses[0]?.students || [];

  // Filtered wrong question items
  const filteredWrongQuestions = wrongQuestionItems.filter((wq) => {
    const matchesSearch = wq.question.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          wq.question.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "All" || wq.question.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Phân tích câu hỏi sai
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tổng hợp dữ liệu sai sót, câu hỏi bị bỏ qua và đề xuất ôn tập bài tiếp theo cho giáo viên.
          </p>
        </div>
      </motion.div>

      {/* Aggregate Stats cards */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tổng lượt trả lời sai
            </span>
            <AlertTriangle className="h-5 w-5 text-red-500 bg-red-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {wrongQuestionItems.reduce((acc, curr) => acc + curr.wrongCount, 0)}
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            Tính trên 35 học sinh lớp Toán nâng cao 12A1
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tỉ lệ trả lời sai cao nhất
            </span>
            <AlertTriangle className="h-5 w-5 text-orange-500 bg-orange-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {Math.max(...wrongQuestionItems.map((q) => q.wrongRate))}%
          </p>
          <p className="text-[10px] mt-1.5 truncate" style={{ color: "var(--text-tertiary)" }}>
            Chủ đề: {wrongQuestionItems.sort((a,b) => b.wrongRate - a.wrongRate)[0]?.question.topic}
          </p>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tổng câu hỏi bị bỏ qua (Skip)
            </span>
            <Clock className="h-5 w-5 text-amber-500 bg-amber-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {wrongQuestionItems.reduce((acc, curr) => acc + curr.skippedCount, 0)}
          </p>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-tertiary)" }}>
            Độ trễ thời gian trả lời trung bình: 135 giây
          </p>
        </div>
      </motion.div>

      {/* Main Grid: AI Suggestions & Wrong Questions Tabs */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Tabs wrong question tables (2/3) */}
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
                  placeholder="Tìm kiếm nội dung câu hỏi hoặc chương học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <option value="All">Tất cả môn học</option>
                  <option value="Toán học">Toán học</option>
                  <option value="Vật lý">Vật lý</option>
                  <option value="Hóa học">Hóa học</option>
                </select>
              </div>
            </div>

            <Tabs defaultValue="most_missed" className="w-full">
              <TabsList className="grid grid-cols-4 w-full bg-[var(--surface-subtle)] p-1 rounded-xl">
                <TabsTrigger value="most_missed" className="text-xs rounded-lg">
                  Sai nhiều nhất
                </TabsTrigger>
                <TabsTrigger value="by_student" className="text-xs rounded-lg">
                  Theo học sinh
                </TabsTrigger>
                <TabsTrigger value="skipped" className="text-xs rounded-lg">
                  Bị bỏ qua (Skip)
                </TabsTrigger>
                <TabsTrigger value="slow" className="text-xs rounded-lg">
                  Mất thời gian
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Sai nhiều nhất */}
              <TabsContent value="most_missed" className="space-y-4 mt-4">
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
                          {wq.question.subject}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          Khối {wq.question.grade}
                        </Badge>
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        ID: {wq.question.id}
                      </span>
                    </div>

                    <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                      {wq.question.content}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                      {wq.question.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border ${
                            opt.id === wq.question.correctAnswer
                              ? "border-green-300 bg-green-50/50 text-green-700 font-semibold"
                              : "border-[var(--border-subtle)]"
                          }`}
                        >
                          <span className="font-bold mr-1.5">{opt.label}.</span>
                          {opt.content}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                      <button
                        onClick={() => toggleExpand(wq.question.id)}
                        className="text-indigo-500 font-semibold flex items-center gap-1 hover:underline"
                      >
                        {expandedQuestionId === wq.question.id ? (
                          <>
                            Thu gọn <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            Xem danh sách học sinh sai ({wq.wrongCount}) <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                      <div className="flex items-center gap-3" style={{ color: "var(--text-tertiary)" }}>
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
                          <p className="text-xs font-semibold text-red-500">
                            Danh sách học sinh trả lời sai:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {wq.studentsWrong.map((std, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-[10px] bg-red-50 text-red-700 border-red-100"
                              >
                                {std}
                              </Badge>
                            ))}
                            {wq.wrongCount > wq.studentsWrong.length && (
                              <span className="text-[10px] self-center ml-1" style={{ color: "var(--text-tertiary)" }}>
                                và {wq.wrongCount - wq.studentsWrong.length} học sinh khác
                              </span>
                            )}
                          </div>
                          {wq.question.aiExplanation && (
                            <div className="mt-2.5 p-3 rounded-lg bg-indigo-50/50 border border-indigo-100/50 text-xs">
                              <p className="font-bold text-indigo-600 mb-1 flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5" /> Lời giải đề xuất từ AI:
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

              {/* Tab 2: Theo học sinh */}
              <TabsContent value="by_student" className="space-y-3 mt-4">
                {classStudents.map((std) => (
                  <div
                    key={std.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] gap-4"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {std.name}
                        </h4>
                        <Badge variant="outline" className="text-[10px]">
                          Điểm TB: {std.avgScore}
                        </Badge>
                      </div>
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex-1 max-w-[200px]">
                          <Progress
                            value={Math.round(((std.totalAttempts - std.wrongCount) / std.totalAttempts) * 100)}
                            className="h-1.5"
                          />
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          Độ chính xác: {Math.round(((std.totalAttempts - std.wrongCount) / std.totalAttempts) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-end gap-2 text-right">
                      <Badge className="bg-red-50 text-red-700 border-red-100 text-[10px]">
                        {std.wrongCount} câu làm sai
                      </Badge>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        Tổng lượt làm bài: {std.totalAttempts}
                      </span>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 3: Bị bỏ qua */}
              <TabsContent value="skipped" className="space-y-4 mt-4">
                {filteredWrongQuestions.filter((q) => q.skippedCount > 0).map((wq) => (
                  <div
                    key={wq.question.id}
                    className="border border-[var(--border-subtle)] rounded-xl p-4"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px]">
                        {wq.skippedCount} học sinh bỏ qua (Skip)
                      </Badge>
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Tỉ lệ skip: {Math.round((wq.skippedCount / wq.totalAttempts) * 100)}%
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {wq.question.content}
                    </p>
                    <p className="text-[10px] mt-2" style={{ color: "var(--text-tertiary)" }}>
                      {wq.question.chapter} • Tốc độ làm TB của các em không skip: {wq.avgTimeSpent} giây
                    </p>
                  </div>
                ))}
              </TabsContent>

              {/* Tab 4: Mất nhiều thời gian */}
              <TabsContent value="slow" className="space-y-4 mt-4">
                {filteredWrongQuestions.sort((a,b) => b.avgTimeSpent - a.avgTimeSpent).map((wq) => (
                  <div
                    key={wq.question.id}
                    className="border border-[var(--border-subtle)] rounded-xl p-4"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> Thời gian TB: {wq.avgTimeSpent} giây / học sinh
                      </span>
                      <Badge variant="outline" className="text-[10px] text-red-500 border-red-100">
                        Tỉ lệ sai: {wq.wrongRate}%
                      </Badge>
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {wq.question.content}
                    </p>
                    <p className="text-[10px] mt-2" style={{ color: "var(--text-tertiary)" }}>
                      {wq.question.chapter} • Đánh giá: Học sinh mất quá nhiều thời gian suy nghĩ, khả năng cao là hổng lý thuyết cơ bản.
                    </p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Right Side: AI review insights & Lesson suggestions (1/3) */}
        <div className="space-y-6">
          {/* AI Review summary */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border border-indigo-150 shadow-sm relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.04))",
              borderColor: "oklch(0.58 0.2 260 / 0.15)",
            }}
          >
            <div className="absolute top-0 right-0 p-3 pointer-events-none">
              <Sparkles className="h-6 w-6 text-indigo-500/20" />
            </div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block">
                  Trí tuệ nhân tạo EStudy
                </span>
                <h3 className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Phân tích lỗi sai & Đề xuất dạy học
                </h3>
              </div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {aiReview.summary}
            </p>
          </motion.div>

          {/* Next Lesson Checklist */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Kế hoạch ôn tập buổi sau
            </h3>
            <div className="space-y-3">
              {aiReview.nextLessonSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border-subtle)]">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {sug}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weak Topics */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Chủ đề rỗng kiến thức
            </h3>
            <div className="space-y-4">
              {aiReview.weakTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                      {topic.topic}
                    </span>
                    <span className="font-bold text-red-500">
                      {topic.wrongRate}% sai
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-[var(--surface-subtle)]">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${topic.wrongRate}%` }}
                    />
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
