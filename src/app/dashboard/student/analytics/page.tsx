"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { studentStats } from "@/data/mock/data";
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

export default function StudentAnalytics() {
  const totalQuestions = studentStats.totalQuestions;
  const correctAnswers = studentStats.correctAnswers;
  const overallAccuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Overview Cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl p-5 border"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Tổng câu hỏi đã làm
            </span>
            <HelpCircle className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            {totalQuestions}
          </p>
          <p className="text-[10px] mt-1 text-emerald-600 font-medium">
            +182 câu trong tuần này
          </p>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Độ chính xác trung bình
            </span>
            <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            {overallAccuracy}%
          </p>
          <p className="text-[10px] mt-1 text-emerald-600 font-medium">
            Tăng 2.4% so với tuần trước
          </p>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Thời gian luyện tập
            </span>
            <Clock className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            75h 20m
          </p>
          <p className="text-[10px] mt-1 text-slate-500 font-medium">
            Trung bình 45 phút/ngày
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left/Middle Column (2/3): Subject performance & Weekly logs */}
        <div className="space-y-6 md:col-span-2">
          {/* Subject Accuracy */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Hiệu suất theo môn học
            </h3>
            <div className="space-y-4">
              {studentStats.subjectAccuracy.map((subj) => (
                <div key={subj.subject} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span style={{ color: "var(--text-primary)" }}>{subj.subject}</span>
                    <span style={{ color: "oklch(0.58 0.2 260)" }}>{subj.accuracy}% ({subj.total} câu)</span>
                  </div>
                  <Progress value={subj.accuracy} className="h-2" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity details */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Lịch sử làm bài tập
            </h3>
            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {studentStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-sm"
                      style={{
                        background:
                          activity.type === "practice"
                            ? "oklch(0.58 0.2 260 / 0.1)"
                            : "oklch(0.72 0.17 155 / 0.1)",
                      }}
                    >
                      {activity.type === "practice" ? "📝" : "🎯"}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {activity.title}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {activity.subject} • {new Date(activity.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={activity.score >= 80 ? "default" : "secondary"} className="rounded-xl">
                      {activity.score}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3): Weak topics and metrics */}
        <div className="space-y-6">
          {/* Weak Topics */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Điểm cần cải thiện
              </h3>
            </div>

            <div className="space-y-3.5">
              {studentStats.weakTopics.map((topic) => (
                <div key={topic.topic} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-secondary)] truncate flex-1">{topic.topic}</span>
                    <span className="font-bold text-rose-500 ml-2">{topic.accuracy}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-rose-500"
                      style={{ width: `${topic.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/student/practice">
              <Button size="sm" className="w-full rounded-xl text-xs mt-2 bg-rose-500 hover:bg-rose-600 border-0 text-white">
                Ôn luyện phần yếu ngay
              </Button>
            </Link>
          </motion.div>

          {/* AI insights summary */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{
              background: "var(--surface-card)",
              borderColor: "oklch(0.58 0.2 260 / 0.2)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <div className="flex items-center gap-2">
              <Award className="h-4.5 w-4.5 text-violet-500" />
              <h3 className="text-sm font-bold text-violet-500">Lời khuyên từ AI</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Bạn đang làm rất tốt môn Toán học (78%). Tuy nhiên, Vật lý đang có dấu hiệu đi xuống, đặc biệt là phần **Dòng điện xoay chiều** (chỉ 42%). 
              Hãy dành 15 phút mỗi ngày để ôn tập riêng phần này.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
