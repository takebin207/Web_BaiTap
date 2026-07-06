"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments, studentAttempts } from "@/data/mock/data";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getAttemptStatus = (asgnId: string) => {
    return studentAttempts.find((att) => att.assignmentId === asgnId);
  };

  const filteredAssignments = mockAssignments.filter((asgn) => {
    if (asgn.status === "draft") return false; // Students can't see drafts

    const attempt = getAttemptStatus(asgn.id);
    const isCompleted = attempt && (attempt.status === "submitted" || attempt.status === "graded");

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && !isCompleted) ||
      (activeTab === "completed" && isCompleted);

    const matchesSearch = asgn.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Bài tập của tôi
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Danh sách bài tập tự luận/trắc nghiệm do giáo viên giao.
          </p>
        </div>
      </motion.div>

      {/* Tabs Filter & Search Row */}
      <motion.div
        variants={item}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex bg-[var(--surface-subtle)] p-1 rounded-xl">
          {(
            [
              { id: "all", label: "Tất cả bài tập" },
              { id: "pending", label: "Chưa hoàn thành" },
              { id: "completed", label: "Đã hoàn thành" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white shadow-sm text-indigo-600"
                  : "text-[var(--text-secondary)] hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
      </motion.div>

      {/* Assignments list */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((asgn) => {
          const attempt = getAttemptStatus(asgn.id);
          const isGraded = attempt && attempt.status === "graded";
          const isSubmitted = attempt && attempt.status === "submitted";

          return (
            <div
              key={asgn.id}
              className="rounded-2xl p-5 transition-all hover:shadow-md flex flex-col justify-between"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <Badge
                    className={
                      isGraded
                        ? "bg-green-50 text-green-700 border-green-100"
                        : isSubmitted
                        ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    }
                  >
                    {isGraded ? "Đã chấm điểm" : isSubmitted ? "Đã nộp bài" : "Chưa hoàn thành"}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {asgn.subject}
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {asgn.title}
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
                  Lớp: {asgn.className}
                </p>

                <div className="space-y-2 mb-5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span>{asgn.questionCount} câu hỏi trắc nghiệm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span>Thời gian làm: {asgn.timeLimit} phút</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                    <span className="text-red-500 font-medium">
                      Hạn nộp: {new Date(asgn.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between">
                {isGraded ? (
                  <div className="text-left">
                    <span className="text-[10px] block" style={{ color: "var(--text-tertiary)" }}>
                      Điểm đạt được
                    </span>
                    <span className="text-sm font-bold text-green-500">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                  </div>
                ) : isSubmitted ? (
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    Đợi giáo viên chấm...
                  </span>
                ) : (
                  <span className="text-xs text-blue-500 font-medium">
                    Có thể làm ngay
                  </span>
                )}

                {isGraded ? (
                  <Link href={`/dashboard/student/assignments/${asgn.id}/result`}>
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-500 hover:text-indigo-600 gap-1 pr-0">
                      Xem đáp án <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ) : isSubmitted ? (
                  <Button variant="ghost" size="sm" disabled className="text-xs text-[var(--text-tertiary)] gap-1 pr-0">
                    Đã khóa nộp <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Link href={`/dashboard/student/assignments/${asgn.id}`}>
                    <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3">
                      Bắt đầu làm bài
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
