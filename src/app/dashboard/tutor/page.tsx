"use client";

import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  TrendingUp,
  Upload,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  tutorClasses,
  tutorStats,
  recentSubmissions,
  currentTutor,
} from "@/lib/mock-data";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function TutorDashboard() {
  const maxSubmissions = Math.max(...tutorStats.weeklySubmissions.map((d) => d.count));

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 gradient-bg">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {getGreeting()}, {currentTutor.name}! 👋
          </h2>
          <p className="mt-2 text-white/80 text-sm">
            Bạn có <span className="font-semibold text-white">{recentSubmissions.filter(s => s.status === "submitted").length} bài nộp</span> chưa chấm và{" "}
            <span className="font-semibold text-white">{tutorStats.totalStudents} học sinh</span> đang hoạt động.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/tutor/pdf-import">
              <Button size="sm" className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30">
                <Upload className="mr-1.5 h-4 w-4" /> Nhập PDF
              </Button>
            </Link>
            <Link href="/dashboard/tutor/assignments">
              <Button size="sm" className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30">
                <Sparkles className="mr-1.5 h-4 w-4" /> Tạo đề AI
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Học sinh", value: tutorStats.totalStudents, icon: GraduationCap, color: "oklch(0.58 0.2 260)" },
          { label: "Lớp học", value: tutorStats.totalClasses, icon: Users, color: "oklch(0.7 0.15 240)" },
          { label: "Bài tập", value: tutorStats.totalAssignments, icon: ClipboardList, color: "oklch(0.8 0.15 80)" },
          { label: "Điểm TB", value: tutorStats.avgClassScore.toFixed(1), icon: TrendingUp, color: "oklch(0.72 0.17 155)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 card-hover"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${stat.color}15` }}>
              <stat.icon className="h-4.5 w-4.5" style={{ color: stat.color }} />
            </div>
            <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Classes */}
          <motion.div variants={item} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Lớp học của tôi</h3>
              <Link href="/dashboard/tutor/classes">
                <Button variant="ghost" size="sm" className="text-xs" style={{ color: "oklch(0.58 0.2 260)" }}>
                  Xem tất cả <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {tutorClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between rounded-xl p-4 transition-colors cursor-pointer"
                  style={{ background: "var(--surface-subtle)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-inset)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: "oklch(0.58 0.2 260 / 0.1)" }}>📐</div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{cls.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{cls.studentCount} học sinh • ĐTB {cls.avgScore}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Submissions Chart */}
          <motion.div variants={item} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Bài nộp trong tuần</h3>
            <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>Tỉ lệ nộp bài: {tutorStats.submissionRate}%</p>
            <div className="flex items-end gap-2 sm:gap-4 h-36">
              {tutorStats.weeklySubmissions.map((day, i) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / maxSubmissions) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="w-full max-w-[28px] rounded-t-lg"
                    style={{ background: "oklch(0.58 0.2 260)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{day.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Class Performance */}
          <motion.div variants={item} className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Kết quả theo lớp</h3>
            <div className="space-y-4">
              {tutorStats.classPerformance.map((cls) => (
                <div key={cls.className}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{cls.className}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: "oklch(0.58 0.2 260)" }}>{cls.avgScore}</span>
                      {cls.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5" style={{ color: "oklch(0.72 0.17 155)" }} />
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>—</span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-subtle)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cls.avgScore / 10) * 100}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: "oklch(0.58 0.2 260)" }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{cls.studentCount} học sinh</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Recent Submissions */}
          <motion.div variants={item} className="rounded-2xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Bài nộp gần đây</h3>
              <Badge variant="secondary" className="text-xs">
                {recentSubmissions.filter(s => s.status === "submitted").length} chờ chấm
              </Badge>
            </div>
            <div className="space-y-3">
              {recentSubmissions.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white gradient-bg">
                    {sub.studentName.split(" ").pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{sub.studentName}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>{sub.assignmentTitle}</p>
                  </div>
                  {sub.status === "submitted" ? (
                    <Badge className="text-[10px] shrink-0" variant="secondary">Chờ chấm</Badge>
                  ) : (
                    <span className="text-sm font-bold shrink-0" style={{ color: "oklch(0.72 0.17 155)" }}>
                      {sub.score}/{sub.totalScore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="rounded-2xl p-5" style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Thao tác nhanh</h3>
            <div className="space-y-2">
              {[
                { label: "Tạo bài tập mới", icon: ClipboardList, href: "/dashboard/tutor/assignments" },
                { label: "Nhập đề từ PDF", icon: Upload, href: "/dashboard/tutor/pdf-import" },
                { label: "Tạo đề bằng AI", icon: Sparkles, href: "/dashboard/tutor/question-bank" },
                { label: "Xem thống kê", icon: BarChart3, href: "/dashboard/tutor/analytics" },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <action.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{action.label}</span>
                    <ChevronRight className="ml-auto h-3.5 w-3.5" style={{ color: "var(--text-tertiary)" }} />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
