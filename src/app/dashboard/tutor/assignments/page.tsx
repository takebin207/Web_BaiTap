"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Sparkles,
  Calendar,
  BookOpen,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments } from "@/lib/mock-data";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function AssignmentList() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssignments = mockAssignments.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="text-xs">Chưa làm</Badge>;
      case "in_progress":
        return <Badge className="text-xs text-amber-500 bg-amber-500/10 border-amber-500/20">Đang làm</Badge>;
      case "submitted":
        return <Badge className="text-xs text-blue-500 bg-blue-500/10 border-blue-500/20">Chờ chấm</Badge>;
      case "graded":
        return <Badge className="text-xs text-emerald-500 bg-emerald-500/10 border-emerald-500/20">Đã chấm</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header action */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 max-w-sm border"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập, lớp học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-violet-500/30 text-violet-600 hover:bg-violet-500/5">
            <Sparkles className="mr-1.5 h-4 w-4 text-violet-500" /> Tạo đề bằng AI
          </Button>
          <Button className="rounded-xl gradient-bg text-white border-0 hover:opacity-90 transition-opacity">
            <Plus className="mr-1.5 h-4 w-4" /> Giao bài mới
          </Button>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div variants={item} className="grid gap-4">
        {filteredAssignments.map((asg) => (
          <div
            key={asg.id}
            className="rounded-2xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all card-hover"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
                style={{ background: "oklch(0.58 0.2 260 / 0.1)" }}
              >
                📝
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {asg.title}
                </h4>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                  Lớp: <span className="font-semibold text-[var(--text-secondary)]">{asg.className}</span> • Môn: {asg.subject}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-3.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Hạn nộp: {new Date(asg.dueDate).toLocaleDateString("vi-VN")}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {asg.questionCount} câu hỏi
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:self-center self-end">
              {getStatusBadge(asg.status)}
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
