"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ClipboardList,
  CheckCircle,
  GraduationCap,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { tutorStats, recentSubmissions } from "@/data/mock/data";

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

export default function TutorAnalytics() {
  const maxSubmissions = Math.max(...tutorStats.weeklySubmissions.map((d) => d.count));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Metrics row */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tổng số học sinh", value: tutorStats.totalStudents, icon: GraduationCap, color: "text-blue-500 bg-blue-500/10" },
          { label: "Điểm trung bình", value: tutorStats.avgClassScore.toFixed(1), icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Số lượng bài tập", value: tutorStats.totalAssignments, icon: ClipboardList, color: "text-amber-500 bg-amber-500/10" },
          { label: "Tỷ lệ nộp bài", value: `${tutorStats.submissionRate}%`, icon: CheckCircle, color: "text-purple-500 bg-purple-500/10" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 border"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 md:col-span-2">
          {/* Submissions Bar Chart */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Bài nộp trong tuần qua
            </h3>
            <div className="flex items-end gap-2 sm:gap-4 h-36 pt-4">
              {tutorStats.weeklySubmissions.map((day, i) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxSubmissions) * 100}%` }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="w-full max-w-[28px] rounded-t-lg"
                    style={{ background: "oklch(0.58 0.2 260)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance list by Class */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Hiệu suất học tập các lớp
            </h3>
            <div className="space-y-4">
              {tutorStats.classPerformance.map((cls) => (
                <div key={cls.className} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span style={{ color: "var(--text-primary)" }}>{cls.className}</span>
                    <span style={{ color: "oklch(0.58 0.2 260)" }}>{cls.avgScore}/10</span>
                  </div>
                  <Progress value={(cls.avgScore / 10) * 100} className="h-2" />
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                    Sĩ số: {cls.studentCount} học sinh • Xu hướng: {cls.trend === "up" ? "Tăng trưởng" : "Ổn định"}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3): Recent Submissions */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Chi tiết bài nộp mới nhất
            </h3>

            <div className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {sub.studentName}
                    </p>
                    <p className="text-xs truncate max-w-[150px]" style={{ color: "var(--text-tertiary)" }}>
                      {sub.assignmentTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    {sub.status === "submitted" ? (
                      <Badge variant="secondary" className="text-[10px]">Chờ chấm</Badge>
                    ) : (
                      <span className="text-xs font-bold text-emerald-500">
                        {sub.score}/{sub.totalScore}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
