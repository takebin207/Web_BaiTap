"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Copy,
  Check,
  ChevronRight,
  TrendingUp,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tutorClasses } from "@/lib/mock-data";

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

export default function ClassList() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredClasses = tutorClasses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.inviteCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="Tìm kiếm lớp học, mã mời..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <Button className="rounded-xl gradient-bg text-white border-0 hover:opacity-90 transition-opacity">
          <Plus className="mr-1.5 h-4 w-4" /> Tạo lớp học mới
        </Button>
      </motion.div>

      {/* Class cards grid */}
      <motion.div variants={item} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="rounded-2xl p-5 border flex flex-col justify-between transition-all card-hover"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="text-xs">
                  Khối {cls.grade}
                </Badge>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {cls.subject}
                </span>
              </div>

              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {cls.name}
              </h3>

              <div className="flex items-center gap-4 text-xs mt-4" style={{ color: "var(--text-secondary)" }}>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  {cls.studentCount} học sinh
                </span>
                <span className="flex items-center gap-1 font-semibold" style={{ color: "oklch(0.72 0.17 155)" }}>
                  <TrendingUp className="h-4 w-4" />
                  ĐTB: {cls.avgScore}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between gap-2" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-mono tracking-wider font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Mã: {cls.inviteCode}
                </span>
                <button
                  onClick={() => handleCopyCode(cls.inviteCode, cls.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  {copiedId === cls.id ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" style={{ color: "var(--text-tertiary)" }} />
                  )}
                </button>
              </div>

              <Button variant="ghost" size="sm" className="rounded-lg text-xs h-8">
                Chi tiết <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
