"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments, questionBank, studentAttempts } from "@/data/mock/data";
import Link from "next/link";
import MathRenderer from "@/components/ui/math-renderer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentResultPage({ params }: PageProps) {
  const { id } = use(params);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const assignment = mockAssignments.find((a) => a.id === id) || mockAssignments[0];
  const attempt = studentAttempts.find((att) => att.assignmentId === id) || studentAttempts[0];
  
  // Use Math 10 questions that match subject
  const questionsList = questionBank.filter((q) => q.status === "READY" && q.subjectId === "math");

  const correctCount = attempt.score;
  const totalCount = attempt.totalQuestions;
  const incorrectCount = totalCount - correctCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student/assignments">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Kết quả bài làm: {assignment.title}
            </h2>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Môn: Toán 10 • Lớp: {assignment.className}
            </p>
          </div>
        </div>
        <Link href="/dashboard/student/wrong-questions">
          <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
            Tập trung ôn câu sai
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>Điểm số đạt</span>
          <p className="text-3xl font-extrabold mt-2 text-indigo-600">
            {correctCount}/{totalCount}
          </p>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Độ chính xác: {Math.round((correctCount / totalCount) * 100)}%
          </span>
        </div>

        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>Số câu đúng</span>
          <p className="text-3xl font-extrabold mt-2 text-green-500">
            {correctCount}
          </p>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Hoàn thành tốt
          </span>
        </div>

        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}>Số câu sai/bỏ qua</span>
          <p className="text-3xl font-extrabold mt-2 text-red-500">
            {incorrectCount}
          </p>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Cần rà soát lại
          </span>
        </div>

        <div
          className="rounded-2xl p-5 text-center"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <span className="font-semibold" style={{ color: "var(--text-tertiary)" }}><span className="inline-flex items-center"><Clock className="h-3 w-3 mr-0.5" /> Thời gian làm</span></span>
          <p className="text-3xl font-extrabold mt-2 text-indigo-600">
            {Math.floor(attempt.timeSpent / 60)} phút
          </p>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Tốc độ TB: ~{Math.round(attempt.timeSpent / totalCount)}s/câu
          </span>
        </div>
      </div>

      {/* Review details */}
      <div
        className="rounded-2xl p-5 sm:p-6 space-y-4"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Chi tiết kết quả từng câu hỏi
        </h3>

        <div className="space-y-4">
          {questionsList.map((q, idx) => {
            const studentAns = attempt.answers.find((ans) => ans.questionId === q.id);
            const isCorrect = studentAns?.isCorrect || false;
            const skipped = !studentAns || studentAns.selectedAnswer === null;
            const isExpanded = expandedQId === q.id;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-[var(--border-subtle)]"
                style={{ background: "var(--surface-subtle)" }}
              >
                <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold text-xs">
                      {idx + 1}
                    </span>
                    {skipped ? (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[10px]">
                        Bỏ qua
                      </Badge>
                    ) : isCorrect ? (
                      <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Đúng
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 border-red-100 text-[10px] flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Sai
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    Thời gian làm: {studentAns?.timeSpent || 0} giây
                  </span>
                </div>

                <div className="text-xs font-semibold leading-relaxed mb-3.5 text-left" style={{ color: "var(--text-primary)" }}>
                  <MathRenderer text={q.content} />
                </div>

                {/* Answers list */}
                {q.questionType === "multiple_choice" && q.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    {q.options.map((opt) => {
                      const isSelected = studentAns?.selectedAnswer === opt.id;
                      const isCorrectAns = opt.id === q.correctAnswer;

                      let borderStyle = "border-[var(--border-subtle)] bg-white";
                      if (isCorrectAns) {
                        borderStyle = "border-green-300 bg-green-50/50 text-green-700 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        borderStyle = "border-red-300 bg-red-50/50 text-red-700";
                      }

                      return (
                        <div key={opt.id} className={`p-2 rounded-xl border flex items-center gap-2 ${borderStyle}`}>
                          <span className="font-bold">{opt.label}.</span>
                          <span><MathRenderer text={opt.content} /></span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-1 mb-3 text-xs">
                    <div className="p-2.5 rounded-xl border border-green-200 bg-green-50/30 text-green-800">
                      <strong>Đáp án đúng:</strong> <MathRenderer text={q.correctAnswer} />
                    </div>
                    {!isCorrect && studentAns && (
                      <div className="p-2.5 rounded-xl border border-red-200 bg-red-50/30 text-red-850 mt-1">
                        <strong>Đáp án bạn điền:</strong> <MathRenderer text={studentAns.selectedAnswer || "Bỏ qua"} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2.5 border-t border-[var(--border-subtle)] text-xs">
                  <button
                    onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                    className="text-indigo-500 font-semibold flex items-center gap-1 hover:underline"
                  >
                    {isExpanded ? "Thu gọn lời giải" : "Xem lời giải AI"} {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-dashed border-[var(--border-subtle)] space-y-3 overflow-hidden text-xs"
                    >
                      <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-150/50">
                        <p className="font-bold text-green-700 mb-1">Lời giải của giáo viên:</p>
                        <p className="whitespace-pre-line text-green-900 leading-relaxed"><MathRenderer text={q.explanation} /></p>
                      </div>

                      {q.aiExplanation && (
                        <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-150/50 text-indigo-900">
                          <p className="font-bold text-indigo-600 mb-1 flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5" /> Trợ lý AI phân tích:
                          </p>
                          <p className="whitespace-pre-line leading-relaxed"><MathRenderer text={q.aiExplanation} /></p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
