"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { recentSubmissions } from "@/data/mock/data";
import { getLocalStorageAttempts } from "@/data/mock/store";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TutorResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [attempts] = useState(() => getLocalStorageAttempts());

  const mappedSubmissions = useMemo(() => {
    const list = attempts.map((att) => ({
      id: att.id,
      studentName: att.studentName,
      assignmentTitle: att.assignmentTitle,
      submittedAt: att.submittedAt || new Date().toISOString(),
      score: att.score,
      totalScore: att.totalQuestions,
      status: att.status === "graded" ? ("graded" as const) : ("submitted" as const),
    }));
    return list.length > 0 ? list : recentSubmissions;
  }, [attempts]);

  const filteredSubmissions = mappedSubmissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGrade = (id: string) => {
    alert(`Đã mô phỏng chấm bài cho lượt nộp ID: ${id}.`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Bảng kết quả & Điểm số
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Xem danh sách bài tập đã nộp, trạng thái chấm và kết quả chi tiết của học sinh.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh hoặc bài tập..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="submitted">Chờ chấm (submitted)</option>
            <option value="graded">Đã chấm (graded)</option>
          </select>
        </div>
      </motion.div>

      {/* Submissions List */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] pb-2" style={{ color: "var(--text-tertiary)" }}>
                <th className="py-3 font-semibold">Học sinh</th>
                <th className="py-3 font-semibold">Tên bài tập</th>
                <th className="py-3 font-semibold">Thời gian nộp</th>
                <th className="py-3 font-semibold">Trạng thái</th>
                <th className="py-3 font-semibold text-center">Điểm số</th>
                <th className="py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--surface-subtle)] transition-colors">
                  <td className="py-4 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {sub.studentName}
                  </td>
                  <td className="py-4" style={{ color: "var(--text-secondary)" }}>
                    {sub.assignmentTitle}
                  </td>
                  <td className="py-4" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(sub.submittedAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="py-4">
                    <Badge
                      className={
                        sub.status === "graded"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-yellow-50 text-yellow-700 border-yellow-100"
                      }
                    >
                      {sub.status === "graded" ? "Đã chấm" : "Chờ chấm"}
                    </Badge>
                  </td>
                  <td className="py-4 text-center font-bold text-sm">
                    {sub.status === "graded" ? (
                      <span className="text-green-500">
                        {sub.score}/{sub.totalScore}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-tertiary)" }}>—</span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {sub.status === "submitted" ? (
                      <Button
                        onClick={() => handleGrade(sub.id)}
                        size="sm"
                        className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 px-2.5 h-7"
                      >
                        Chấm bài
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-[10px] py-1 px-2.5 h-7 text-indigo-500 hover:text-indigo-600 font-semibold"
                        onClick={() => alert(`Xem bài làm chi tiết của ${sub.studentName}`)}
                      >
                        Xem chi tiết
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
