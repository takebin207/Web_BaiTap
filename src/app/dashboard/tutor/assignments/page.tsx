"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments } from "@/data/mock/data";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "closed" | "graded">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = mockAssignments.filter((asgn) => {
    const matchesTab = activeTab === "all" || asgn.status === activeTab;
    const matchesSearch = asgn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          asgn.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Quản lý bài tập
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Giao bài tập mới, theo dõi tiến độ nộp bài và chấm điểm tự động.
          </p>
        </div>
        <Link href="/dashboard/tutor/assignments/create">
          <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm">
            <Plus className="mr-1.5 h-4 w-4" /> Tạo bài tập mới
          </Button>
        </Link>
      </motion.div>

      {/* Filter Tabs & Search Row */}
      <motion.div
        variants={item}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex flex-wrap gap-1 bg-[var(--surface-subtle)] p-1 rounded-xl">
          {(
            [
              { id: "all", label: "Tất cả" },
              { id: "active", label: "Đang mở" },
              { id: "draft", label: "Bản nháp" },
              { id: "closed", label: "Đã đóng" },
              { id: "graded", label: "Đã chấm" },
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

      {/* Assignment Cards list */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((asgn) => (
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
                    asgn.status === "active"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : asgn.status === "draft"
                      ? "bg-gray-50 text-gray-700 border-gray-100"
                      : asgn.status === "closed"
                      ? "bg-orange-50 text-orange-700 border-orange-100"
                      : "bg-green-50 text-green-700 border-green-100"
                  }
                >
                  {asgn.status === "active"
                    ? "Đang mở"
                    : asgn.status === "draft"
                    ? "Bản nháp"
                    : asgn.status === "closed"
                    ? "Đã đóng"
                    : "Đã chấm"}
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
                  <span>Thời gian: {asgn.timeLimit} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                  <span>Hạn nộp: {new Date(asgn.dueDate).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] block" style={{ color: "var(--text-tertiary)" }}>
                  Tiến độ nộp bài
                </span>
                <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                  {asgn.submittedCount}/{asgn.totalStudents} học sinh
                </span>
              </div>
              <Link href={`/dashboard/tutor/wrong-questions?asgn=${asgn.id}`}>
                <Button variant="ghost" size="sm" className="text-xs text-indigo-500 hover:text-indigo-600 gap-1 pr-0">
                  Phân tích <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
