"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { questionBank, studentAttempts } from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentWrongQuestionsPage() {
  const [selectedAsgnId, setSelectedAsgnId] = useState("All");
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Filter attempts
  const gradedAttempts = studentAttempts.filter((att) => att.status === "graded");

  // Collect wrong questions
  const wrongAnswersList = gradedAttempts.flatMap((att) => {
    if (selectedAsgnId !== "All" && att.assignmentId !== selectedAsgnId) {
      return [];
    }

    const wrongAnswers = att.answers.filter((ans) => !ans.isCorrect);

    return wrongAnswers.flatMap((ans) => {
      const q = questionBank.find((question) => question.id === ans.questionId);
      if (!q) return [];
      return [
        {
          question: q,
          selectedAnswer: ans.selectedAnswer,
          assignmentTitle: att.assignmentTitle,
        },
      ];
    });
  });

  const handlePracticeSimilar = () => {
    alert("Đang mô phỏng tự sinh bài tập tương đương từ ngân hàng Toán 10!");
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Ôn tập câu làm sai Toán 10
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Hệ thống tự động lưu trữ các câu hỏi trắc nghiệm/điền đáp án ngắn bạn làm sai để luyện tập lại.
          </p>
        </div>
      </motion.div>

      {/* Filter Row */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            Lọc theo bài tập để rà soát:
          </span>
        </div>

        <select
          value={selectedAsgnId}
          onChange={(e) => setSelectedAsgnId(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] sm:max-w-xs w-full"
          style={{ color: "var(--text-secondary)" }}
        >
          <option value="All">Tất cả bài tập</option>
          {gradedAttempts.map((att) => (
            <option key={att.assignmentId} value={att.assignmentId}>
              {att.assignmentTitle}
            </option>
          ))}
        </select>
      </motion.div>

      {/* List of wrong questions */}
      <motion.div variants={item} className="space-y-3">
        {wrongAnswersList.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-subtle)]"
            style={{ background: "var(--surface-card)" }}
          >
            <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              Hoàn toàn sạch câu sai!
            </p>
            <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Hãy tiếp tục hoàn thành các bài kiểm tra được giao để giữ vững điểm số.
            </p>
          </div>
        ) : (
          wrongAnswersList.map(({ question, selectedAnswer, assignmentTitle }) => {
            const isExpanded = expandedQId === question.id;
            const selectedOpt = question.options?.find((o) => o.id === selectedAnswer);
            const correctOpt = question.options?.find((o) => o.id === question.correctAnswer);

            return (
              <div
                key={question.id}
                className="rounded-2xl p-5 border border-[var(--border-default)] bg-[var(--surface-card)] transition-all hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-50 text-red-700 border-red-100 text-[10px]">
                      Làm sai
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      Toán 10
                    </Badge>
                    <Badge variant="outline" className="text-[9px] uppercase">
                      {question.difficulty}
                    </Badge>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    Nguồn: {assignmentTitle}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs font-medium mb-3.5 leading-relaxed text-left" style={{ color: "var(--text-primary)" }}>
                  {question.content}
                </p>

                {/* Option comparison */}
                {question.questionType === "multiple_choice" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-4">
                    <div className="p-3 rounded-xl border border-red-200 bg-red-50/30 text-red-800">
                      <span className="font-bold mr-1 block text-[10px] uppercase text-red-500">Bạn đã chọn:</span>
                      <span className="font-semibold">{selectedOpt?.label}.</span> {selectedOpt?.content || "Trống"}
                    </div>

                    <div className="p-3 rounded-xl border border-green-200 bg-green-50/30 text-green-800">
                      <span className="font-bold mr-1 block text-[10px] uppercase text-green-500">Đáp án đúng:</span>
                      <span className="font-semibold">{correctOpt?.label}.</span> {correctOpt?.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 mb-4 text-xs">
                    <div className="p-3 rounded-xl border border-red-200 bg-red-50/30 text-red-800">
                      <span className="font-bold mr-1 block text-[10px] uppercase text-red-500">Bạn đã điền:</span>
                      {selectedAnswer || "Bỏ qua"}
                    </div>
                    <div className="p-3 rounded-xl border border-green-200 bg-green-50/30 text-green-800">
                      <span className="font-bold mr-1 block text-[10px] uppercase text-green-500">Đáp án chính xác:</span>
                      {question.correctAnswer}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)] text-xs">
                  <Button
                    onClick={() => setExpandedQId(isExpanded ? null : question.id)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-indigo-500 hover:text-indigo-600 font-semibold flex items-center gap-1 p-0 animate-pulse"
                  >
                    {isExpanded ? "Thu gọn" : "Xem giải thích AI"} {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </Button>

                  <Button
                    onClick={handlePracticeSimilar}
                    variant="outline"
                    size="sm"
                    className="text-xs rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50"
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Luyện câu tương tự
                  </Button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-3 border-t border-dashed border-[var(--border-subtle)] space-y-3 overflow-hidden text-xs"
                    >
                      <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-150/50">
                        <p className="font-bold text-green-700 mb-1">Lời giải chi tiết:</p>
                        <p className="whitespace-pre-line text-green-900 leading-relaxed">
                          {question.explanation}
                        </p>
                      </div>

                      {question.aiExplanation && (
                        <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-150/50 text-indigo-900">
                          <p className="font-bold text-indigo-600 mb-1 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Trợ lý AI gợi ý:
                          </p>
                          <p className="whitespace-pre-line leading-relaxed">
                            {question.aiExplanation}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
