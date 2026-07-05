"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  ArrowRight,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockQuestions, subjects } from "@/data/mock/data";
import Link from "next/link";

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

export default function PracticeList() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredQuestions = mockQuestions.filter((q) => {
    const matchSubject =
      selectedSubject === "all" || q.subject.toLowerCase() === selectedSubject.toLowerCase() || (selectedSubject === "Toán học" && q.subject === "Toán học") || (selectedSubject === "Vật lý" && q.subject === "Vật lý") || (selectedSubject === "Hóa học" && q.subject === "Hóa học");
    const matchDifficulty =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const matchSearch =
      q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchDifficulty && matchSearch;
  });

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Subject Selector Row */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          onClick={() => setSelectedSubject("all")}
          className="flex flex-col items-center justify-center rounded-2xl p-4 text-center border transition-all cursor-pointer card-hover"
          style={{
            background: selectedSubject === "all" ? "oklch(0.58 0.2 260 / 0.08)" : "var(--surface-card)",
            borderColor: selectedSubject === "all" ? "oklch(0.58 0.2 260)" : "var(--border-default)",
          }}
        >
          <Layers className="h-6 w-6 mb-2" style={{ color: selectedSubject === "all" ? "oklch(0.58 0.2 260)" : "var(--text-tertiary)" }} />
          <span className="text-sm font-semibold" style={{ color: selectedSubject === "all" ? "oklch(0.58 0.2 260)" : "var(--text-primary)" }}>
            Tất cả môn học
          </span>
        </button>

        {subjects.map((subj) => (
          <button
            key={subj.id}
            onClick={() => setSelectedSubject(subj.name)}
            className="flex flex-col items-center justify-center rounded-2xl p-4 text-center border transition-all cursor-pointer card-hover"
            style={{
              background: selectedSubject === subj.name ? `${subj.color}15` : "var(--surface-card)",
              borderColor: selectedSubject === subj.name ? subj.color : "var(--border-default)",
            }}
          >
            <span className="text-2xl mb-2">{subj.icon}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {subj.name}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Filter and Search controls */}
      <motion.div
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between p-4 rounded-2xl border"
        style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 max-w-md"
          style={{ background: "var(--surface-subtle)" }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Tìm kiếm câu hỏi, chủ đề, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
          <span className="text-xs font-medium mr-2" style={{ color: "var(--text-tertiary)" }}>Độ khó:</span>
          {["all", "easy", "medium", "hard", "expert"].map((diff) => (
            <Button
              key={diff}
              size="sm"
              variant={selectedDifficulty === diff ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(diff)}
              className="rounded-lg text-xs h-8"
            >
              {diff === "all" ? "Tất cả" : getDifficultyLabel(diff)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Questions list */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Danh sách câu hỏi ({filteredQuestions.length})
          </h3>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Dữ liệu giả lập
          </span>
        </div>

        {filteredQuestions.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center border"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <HelpCircle className="mx-auto h-8 w-8 mb-3" style={{ color: "var(--text-tertiary)" }} />
            <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Không tìm thấy câu hỏi</h4>
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl p-5 border transition-all card-hover"
                style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                    {getDifficultyLabel(q.difficulty)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {q.subject}
                  </Badge>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {q.chapter}
                  </span>
                  {q.source && (
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      Nguồn: {q.source}
                    </Badge>
                  )}
                </div>

                <p className="text-sm font-medium leading-relaxed mb-4" style={{ color: "var(--text-primary)" }}>
                  {q.content}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex gap-1.5 flex-wrap">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "var(--surface-subtle)", color: "var(--text-secondary)" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/dashboard/student/practice/${q.id}`}>
                    <Button size="sm" className="rounded-xl text-xs gradient-bg text-white border-0 hover:opacity-90 transition-opacity">
                      Luyện tập ngay <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
