"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash,
  Edit2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockQuestions } from "@/data/mock/data";

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

export default function AdminQuestions() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuestions = mockQuestions.filter((q) =>
    q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchQuery.toLowerCase())
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
            placeholder="Tìm kiếm câu hỏi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <Button className="rounded-xl gradient-bg text-white border-0 hover:opacity-90 transition-opacity">
          <Plus className="mr-1.5 h-4 w-4" /> Thêm câu hỏi mới
        </Button>
      </motion.div>

      {/* Questions list */}
      <motion.div variants={item} className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all card-hover"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className={getDifficultyColor(q.difficulty)}>
                  {q.difficulty}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {q.subject}
                </Badge>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {q.chapter}
                </span>
              </div>
              <p className="text-sm font-semibold truncate leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {q.content}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 md:self-center self-end">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg text-rose-500 hover:bg-rose-500/5 hover:text-rose-600 border-rose-500/20">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
