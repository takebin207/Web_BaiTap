"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Flame,
  Target,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  ClipboardList,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  studentStats,
  aiRecommendations,
  mockAssignments,
  subjects,
  currentStudent,
} from "@/data/mock/data";
import Link from "next/link";

// ============================================================
// Animation Variants
// ============================================================

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// ============================================================
// Helper
// ============================================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function getTodayVN(): string {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

// ============================================================
// Student Dashboard Page
// ============================================================

export default function StudentDashboard() {
  const accuracy = Math.round(
    (studentStats.correctAnswers / studentStats.totalQuestions) * 1000
  ) / 10;
  const todayQuestions = 32;
  const todayGoal = 50;
  const hoursLearned = Math.floor(studentStats.totalTime / 60);
  const minutesLearned = studentStats.totalTime % 60;

  const pendingAssignments = mockAssignments.filter(
    (a) => a.status === "pending" || a.status === "in_progress"
  );

  const maxWeekly = Math.max(...studentStats.weeklyProgress.map((d) => d.questions));

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ==================== Welcome Card ==================== */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 gradient-bg"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm text-white/70">{getTodayVN()}</p>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {getGreeting()}, {currentStudent.name.split(" ").pop()}! 👋
          </h2>
          <p className="mt-2 text-white/80 text-sm sm:text-base">
            Hãy tiếp tục hành trình học tập của bạn. Hôm nay bạn đã hoàn thành{" "}
            <span className="font-semibold text-white">{todayQuestions}/{todayGoal}</span> câu hỏi.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/dashboard/student/practice">
              <Button
                size="sm"
                className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30 transition-all"
              >
                <Zap className="mr-1.5 h-4 w-4" />
                Luyện tập ngay
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ==================== Main Grid ==================== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ========== Left Column (2/3) ========== */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Row */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
          >
            {/* Today's Questions */}
            <div
              className="rounded-2xl p-4 transition-all card-hover"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "oklch(0.58 0.2 260 / 0.1)" }}
                >
                  <Target className="h-4.5 w-4.5" style={{ color: "oklch(0.58 0.2 260)" }} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {todayQuestions}<span className="text-sm font-normal" style={{ color: "var(--text-tertiary)" }}>/{todayGoal}</span>
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Câu hỏi hôm nay
              </p>
              <div className="mt-2">
                <Progress value={(todayQuestions / todayGoal) * 100} className="h-1.5" />
              </div>
            </div>

            {/* Streak */}
            <div
              className="rounded-2xl p-4 transition-all card-hover"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "oklch(0.8 0.15 80 / 0.1)" }}
                >
                  <Flame className="h-4.5 w-4.5 animate-fire" style={{ color: "oklch(0.75 0.18 50)" }} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {studentStats.streak} <span className="text-lg">🔥</span>
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Chuỗi ngày
              </p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{
                      background: i < studentStats.streak
                        ? "oklch(0.75 0.18 50)"
                        : "var(--surface-subtle)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Accuracy */}
            <div
              className="rounded-2xl p-4 transition-all card-hover"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "oklch(0.72 0.17 155 / 0.1)" }}
                >
                  <TrendingUp className="h-4.5 w-4.5" style={{ color: "oklch(0.72 0.17 155)" }} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {accuracy}%
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Độ chính xác
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs" style={{ color: "oklch(0.72 0.17 155)" }}>
                <TrendingUp className="h-3 w-3" /> +3.2% tuần này
              </p>
            </div>

            {/* Time Spent */}
            <div
              className="rounded-2xl p-4 transition-all card-hover"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: "oklch(0.7 0.15 240 / 0.1)" }}
                >
                  <Clock className="h-4.5 w-4.5" style={{ color: "oklch(0.7 0.15 240)" }} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {hoursLearned}h{minutesLearned > 0 ? ` ${minutesLearned}m` : ""}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                Tổng thời gian
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                ~45 phút/ngày
              </p>
            </div>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Tiến độ tuần này
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  Số câu hỏi hoàn thành mỗi ngày
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "oklch(0.58 0.2 260)" }} />
                  Đã làm
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "oklch(0.72 0.17 155)" }} />
                  Đúng
                </span>
              </div>
            </div>
            <div className="flex items-end gap-2 sm:gap-3 h-36 sm:h-44">
              {studentStats.weeklyProgress.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col items-center gap-0.5" style={{ height: "100%" }}>
                    <div className="flex-1 w-full flex items-end justify-center gap-[2px]">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.questions / maxWeekly) * 100}%` }}
                        transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-[18px] rounded-t-md"
                        style={{ background: "oklch(0.58 0.2 260 / 0.25)" }}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.correct / maxWeekly) * 100}%` }}
                        transition={{ delay: index * 0.08 + 0.1, duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-[18px] rounded-t-md"
                        style={{ background: "oklch(0.58 0.2 260)" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5" style={{ color: "oklch(0.58 0.2 260)" }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Gợi ý từ AI
                </h3>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl p-4 transition-shadow cursor-pointer"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.borderColor = "var(--border-focus)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                    e.currentTarget.style.borderColor = "var(--border-default)";
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: "oklch(0.58 0.2 260 / 0.1)" }}
                    >
                      <Sparkles className="h-4 w-4" style={{ color: "oklch(0.58 0.2 260)" }} />
                    </div>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background:
                          rec.priority === "high"
                            ? "oklch(0.65 0.2 25)"
                            : rec.priority === "medium"
                            ? "oklch(0.8 0.15 80)"
                            : "oklch(0.72 0.17 155)",
                      }}
                    />
                  </div>
                  <h4
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {rec.title}
                  </h4>
                  <p
                    className="mt-1.5 text-xs leading-relaxed line-clamp-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {rec.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {rec.estimatedTime}p
                      </span>
                      <span>•</span>
                      <span>{rec.questionCount} câu</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0.5"
                    >
                      {rec.subject}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Continue Learning */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Tiếp tục học
              </h3>
              <button className="text-xs font-medium" style={{ color: "oklch(0.58 0.2 260)" }}>
                Xem tất cả
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {subjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl p-4 transition-all cursor-pointer"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-default)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = subject.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${subject.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {subject.name}
                      </h4>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {subject.chapters[index % subject.chapters.length].name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--text-tertiary)" }}>Tiến độ</span>
                      <span style={{ color: subject.color, fontWeight: 600 }}>
                        {60 + index * 10}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full rounded-full overflow-hidden"
                      style={{ background: "var(--surface-subtle)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${60 + index * 10}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ background: subject.color }}
                      />
                    </div>
                  </div>
                  <Link
                    href="/dashboard/student/practice"
                    className="mt-3 flex items-center gap-1 text-xs font-medium"
                    style={{ color: subject.color }}
                  >
                    Tiếp tục <ArrowRight className="h-3 w-3" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========== Right Column (1/3) ========== */}
        <div className="space-y-6">
          {/* Homework Reminders */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <ClipboardList className="h-4 w-4" style={{ color: "oklch(0.58 0.2 260)" }} />
                Bài tập
              </h3>
              <Badge variant="secondary" className="text-xs">
                {pendingAssignments.length} chưa nộp
              </Badge>
            </div>
            <div className="space-y-3">
              {pendingAssignments.map((assignment) => {
                const dueDate = new Date(assignment.dueDate);
                const now = new Date();
                const hoursLeft = Math.max(0, Math.round((dueDate.getTime() - now.getTime()) / 3600000));
                const isUrgent = hoursLeft <= 24;

                return (
                  <div
                    key={assignment.id}
                    className="rounded-xl p-3 transition-colors cursor-pointer"
                    style={{
                      background: "var(--surface-subtle)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-inset)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {assignment.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                          {assignment.className}
                        </p>
                      </div>
                      {isUrgent && (
                        <Badge className="text-[10px] px-1.5 py-0 shrink-0 ml-2" variant="destructive">
                          Gấp
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {hoursLeft > 0 ? `Còn ${hoursLeft}h` : "Đã hết hạn"}
                      </span>
                      <span>{assignment.questionCount} câu</span>
                    </div>
                    {assignment.status === "in_progress" && assignment.score !== undefined && (
                      <div className="mt-2">
                        <Progress
                          value={(assignment.score / assignment.questionCount) * 100}
                          className="h-1"
                        />
                        <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                          Đã làm {assignment.score}/{assignment.questionCount}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Link href="/dashboard/student/homework">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs rounded-xl"
                style={{ color: "oklch(0.58 0.2 260)" }}
              >
                Xem tất cả bài tập
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </motion.div>

          {/* Weak Topics */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4" style={{ color: "oklch(0.8 0.15 80)" }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Chủ đề cần cải thiện
              </h3>
            </div>
            <div className="space-y-3">
              {studentStats.weakTopics.slice(0, 4).map((topic) => (
                <div key={topic.topic} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {topic.topic}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {topic.subject}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          topic.accuracy < 50
                            ? "oklch(0.65 0.2 25)"
                            : "oklch(0.8 0.15 80)",
                      }}
                    >
                      {topic.accuracy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/student/practice">
              <Button
                size="sm"
                className="w-full mt-4 text-xs rounded-xl gradient-bg text-white border-0 hover:opacity-90"
              >
                Luyện tập ngay
              </Button>
            </Link>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4" style={{ color: "oklch(0.58 0.2 260)" }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Hoạt động gần đây
              </h3>
            </div>
            <div className="space-y-3">
              {studentStats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{
                      background:
                        activity.type === "practice"
                          ? "oklch(0.58 0.2 260 / 0.1)"
                          : activity.type === "homework"
                          ? "oklch(0.8 0.15 80 / 0.1)"
                          : "oklch(0.72 0.17 155 / 0.1)",
                    }}
                  >
                    {activity.type === "practice" ? (
                      <BookOpen className="h-4 w-4" style={{ color: "oklch(0.58 0.2 260)" }} />
                    ) : activity.type === "homework" ? (
                      <ClipboardList className="h-4 w-4" style={{ color: "oklch(0.8 0.15 80)" }} />
                    ) : (
                      <CheckCircle className="h-4 w-4" style={{ color: "oklch(0.72 0.17 155)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {activity.title}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {activity.subject}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          activity.score >= 80
                            ? "oklch(0.72 0.17 155)"
                            : activity.score >= 60
                            ? "oklch(0.8 0.15 80)"
                            : "oklch(0.65 0.2 25)",
                      }}
                    >
                      {activity.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/student/analytics">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs rounded-xl"
                style={{ color: "oklch(0.58 0.2 260)" }}
              >
                Xem phân tích chi tiết
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
