"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  XCircle,
  BookOpen,
  RefreshCw,
  Share2,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockQuestions } from "@/data/mock/data";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuestionDetail({ params }: PageProps) {
  const { id } = use(params);
  const question = mockQuestions.find((q) => q.id === id) || mockQuestions[0];

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAIExplanation, setShowAIExplanation] = useState<boolean>(false);

  // Find similar questions
  const similarQuestions = mockQuestions.filter(
    (q) => q.id !== question.id && q.subject === question.subject
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "hard":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "expert":
        return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      case "expert":
        return "Cực khó";
      default:
        return diff;
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowAIExplanation(false);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Back button and Meta info */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard/student/practice">
          <Button variant="ghost" size="sm" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
            Độ khó: {getDifficultyLabel(question.difficulty)}
          </Badge>
          <Badge variant="secondary">{question.subject}</Badge>
          <span className="text-xs text-[var(--text-tertiary)]">{question.chapter}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left/Middle Column (2/3): Question Area */}
        <div className="space-y-6 lg:col-span-2">
          {/* Question Card */}
          <div
            className="rounded-2xl p-6 border space-y-6"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex justify-between items-start gap-4">
              <h2 className="text-base font-semibold leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {question.content}
              </h2>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Options list */}
            <div className="grid gap-3">
              {question.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOpt = opt.id === question.correctAnswer;
                const isWrongOpt = isSelected && !isCorrectOpt;

                let optionBg = "var(--surface-subtle)";
                let optionBorder = "1px solid var(--border-default)";
                let optionTextColor = "var(--text-primary)";

                if (isSelected) {
                  optionBg = "oklch(0.58 0.2 260 / 0.08)";
                  optionBorder = "1px solid oklch(0.58 0.2 260)";
                }

                if (isSubmitted) {
                  if (isCorrectOpt) {
                    optionBg = "oklch(0.72 0.17 155 / 0.1)";
                    optionBorder = "1px solid oklch(0.72 0.17 155)";
                    optionTextColor = "oklch(0.72 0.17 155)";
                  } else if (isWrongOpt) {
                    optionBg = "oklch(0.65 0.2 25 / 0.1)";
                    optionBorder = "1px solid oklch(0.65 0.2 25)";
                    optionTextColor = "oklch(0.65 0.2 25)";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    disabled={isSubmitted}
                    className="flex items-center gap-4 rounded-xl p-4 text-left text-sm font-medium transition-all duration-150 cursor-pointer"
                    style={{
                      background: optionBg,
                      border: optionBorder,
                      color: optionTextColor,
                    }}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold border"
                      style={{
                        background: isSelected ? "oklch(0.58 0.2 260)" : "var(--bg-primary)",
                        color: isSelected ? "white" : "var(--text-secondary)",
                        borderColor: isSelected ? "oklch(0.58 0.2 260)" : "var(--border-default)",
                      }}
                    >
                      {opt.label}
                    </span>
                    <span className="flex-1">{opt.content}</span>

                    {isSubmitted && isCorrectOpt && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    )}
                    {isSubmitted && isWrongOpt && (
                      <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className="rounded-xl gradient-bg text-white border-0 hover:opacity-90 transition-opacity ml-auto"
                >
                  Nộp bài làm
                </Button>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="h-5 w-5" /> Chính xác!
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-rose-600 flex items-center gap-1.5">
                        <XCircle className="h-5 w-5" /> Chưa chính xác
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-xl h-9">
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Thử lại
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowAIExplanation(!showAIExplanation)}
                      className="rounded-xl h-9 bg-violet-600 hover:bg-violet-700 text-white border-0"
                    >
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      {showAIExplanation ? "Ẩn lời giải AI" : "Xem giải thích AI"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Explanation Panel (Underneath or collapsible) */}
          <AnimatePresence>
            {showAIExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl p-6 border overflow-hidden space-y-4"
                style={{
                  background: "var(--surface-card)",
                  borderColor: "oklch(0.58 0.2 260 / 0.3)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                  <Sparkles className="h-5 w-5 text-violet-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-violet-500">
                    Giải thích chi tiết từ AI (Mock)
                  </h3>
                </div>

                <div
                  className="text-sm space-y-4 whitespace-pre-line leading-relaxed text-[var(--text-secondary)]"
                >
                  {question.aiExplanation || "Đang tải giải thích chi tiết..."}
                </div>

                <div className="bg-violet-500/5 p-4 rounded-xl text-xs text-violet-600 border border-violet-500/10">
                  💡 **Mẹo Học Tập:** Hãy làm tiếp các câu hỏi tương đương bên cạnh để kiểm tra mức độ ghi nhớ kiến thức vừa ôn tập.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (1/3): Similar Questions Panel */}
        <div className="space-y-6">
          <div
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <BookOpen className="h-4.5 w-4.5 text-blue-500" />
                Câu hỏi tương tự
              </h3>
              <Badge variant="secondary" className="text-[10px] font-normal">
                Gợi ý
              </Badge>
            </div>

            <div className="space-y-3">
              {similarQuestions.map((simQ) => (
                <Link key={simQ.id} href={`/dashboard/student/practice/${simQ.id}`}>
                  <div
                    className="rounded-xl p-3.5 transition-colors cursor-pointer border hover:border-blue-500/40 text-left block"
                    style={{ background: "var(--surface-subtle)", borderColor: "transparent" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-inset)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={getDifficultyColor(simQ.difficulty)}>
                        {getDifficultyLabel(simQ.difficulty)}
                      </Badge>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        {simQ.chapter}
                      </span>
                    </div>
                    <p className="text-xs font-medium line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {simQ.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
