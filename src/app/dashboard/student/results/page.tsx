"use client";

import { motion } from "framer-motion";
import {
  Award,
  Clock,
  Calendar,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLocalStorageAttempts } from "@/data/mock/store";
import { StudentAttempt } from "@/data/mock/data";
import Link from "next/link";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentResultsHistoryPage() {
  const [attempts] = useState<StudentAttempt[]>(() => getLocalStorageAttempts());
  const gradedAttempts = attempts.filter((att) => att.status === "graded");

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Lịch sử điểm số & Kết quả
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tổng hợp kết quả học tập và các bài thi đã làm của bạn.
          </p>
        </div>
      </motion.div>

      {/* Grid of Results cards */}
      <motion.div variants={item} className="space-y-4">
        {gradedAttempts.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-dashed border-[var(--border-default)]"
            style={{ background: "var(--surface-card)" }}
          >
            <Award className="h-8 w-8 mb-2" style={{ color: "var(--text-tertiary)" }} />
            <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
              Chưa có lịch sử làm bài nào được ghi nhận
            </p>
          </div>
        ) : (
          gradedAttempts.map((att) => {
            const wrongCount = att.totalQuestions - att.score;
            const accuracy = Math.round((att.score / att.totalQuestions) * 100);

            return (
              <div
                key={att.id}
                className="rounded-2xl p-5 border border-[var(--border-default)] flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:shadow-sm"
                style={{ background: "var(--surface-card)" }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-[9px]">
                      {att.subject}
                    </Badge>
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Nộp ngày: {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString("vi-VN") : ""}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {att.assignmentTitle}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    Lớp: {att.className}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                      Thời gian làm: {Math.floor(att.timeSpent / 60)} phút
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                      Độ chính xác: {accuracy}%
                    </span>
                    <span className="text-red-500 font-semibold">
                      Sai: {wrongCount} câu
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 border-[var(--border-subtle)] pt-4 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] block" style={{ color: "var(--text-tertiary)" }}>
                      Điểm số đạt được
                    </span>
                    <span className="text-lg font-bold text-green-500">
                      {att.score}/{att.totalQuestions}
                    </span>
                  </div>

                  <Link href={`/dashboard/student/assignments/${att.assignmentId}/result`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold"
                    >
                      Xem đáp án & Lời giải <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
