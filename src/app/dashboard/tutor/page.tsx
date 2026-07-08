"use client";

import { motion } from "framer-motion";
import {
  Users,
  ClipboardList,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  TrendingUp,
  GraduationCap,
  Plus,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  currentTutor,
  tutorStats,
  mockAssignments,
  recentSubmissions,
  wrongQuestionItems,
  aiReviewSummaries,
  sampleChapters,
} from "@/data/mock/data";
import MathRenderer from "@/components/ui/math-renderer";
import {
  getLocalStorageAssignments,
  getLocalStorageAttempts,
} from "@/data/mock/store";
import { useMemo, useState } from "react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function TutorDashboard() {
  const [assignments] = useState(() => getLocalStorageAssignments());
  const [attempts] = useState(() => getLocalStorageAttempts());

  const activeAssignments = assignments.filter((a) => a.status === "active");

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

  const urgentSubmissions = mappedSubmissions.filter((s) => s.status === "submitted");
  const aiReview = aiReviewSummaries[0];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 gradient-bg text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Chào mừng trở lại, {currentTutor.name}! 👋
          </h2>
          <p className="mt-2 text-white/85 text-xs sm:text-sm max-w-xl leading-relaxed">
            🎯 <strong>EStudy giúp giáo viên nắm được học sinh đã làm sai những gì để chuẩn bị cho buổi học tiếp theo một cách hiệu quả nhất.</strong> Hệ thống tự động chấm điểm, khoanh vùng lỗ hổng kiến thức và đề xuất giáo án ôn tập buổi sau.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/dashboard/tutor/assignments/create">
              <Button size="sm" className="rounded-xl bg-white text-indigo-600 border-none hover:bg-white/90 font-medium cursor-pointer">
                <Plus className="mr-1.5 h-4 w-4" /> Tạo bài tập mới
              </Button>
            </Link>
            <Link href="/dashboard/tutor/wrong-questions">
              <Button size="sm" className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30 font-medium cursor-pointer">
                <AlertTriangle className="mr-1.5 h-4 w-4" /> Xem câu học sinh sai
              </Button>
            </Link>
            <Link href="/dashboard/tutor/import/bulk-paste">
              <Button size="sm" className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30 font-medium cursor-pointer">
                📝 Nhập nhanh câu hỏi (Paste)
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Onboarding Core Workflow Stepper */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 border border-indigo-100 bg-gradient-to-r from-indigo-50/20 via-slate-50/50 to-indigo-50/10 space-y-4 text-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Quy trình giảng dạy EStudy
            </h3>
            <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
              Hoàn thành chặng đường ôn luyện của lớp học chỉ với 3 bước đơn giản.
            </p>
          </div>
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 self-start sm:self-center text-[9px] font-semibold px-2 py-0.5">
            Toán Học 10
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Step 1 */}
          <Link href="/dashboard/tutor/import/bulk-paste" className="block group">
            <div
              className="rounded-xl p-4 border border-[var(--border-default)] bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between cursor-pointer space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] border border-indigo-100">
                    1
                  </span>
                  <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-700">Nhập đề thô</Badge>
                </div>
                <h4 className="font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">Soạn câu hỏi nhanh</h4>
                <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                  Copy-paste đề Toán từ Word/PDF vào khung nhập thô. Hệ thống tự động tách câu hỏi, đáp án & lời giải chi tiết.
                </p>
              </div>
              <span className="text-[10px] text-indigo-650 font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 mt-2 transition-transform">
                Nhập câu hỏi ngay →
              </span>
            </div>
          </Link>

          {/* Step 2 */}
          <Link href="/dashboard/tutor/question-bank" className="block group">
            <div
              className="rounded-xl p-4 border border-[var(--border-default)] bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between cursor-pointer space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] border border-indigo-100">
                    2
                  </span>
                  <Badge variant="secondary" className="text-[9px] bg-slate-100 text-slate-700">Tạo đề thi</Badge>
                </div>
                <h4 className="font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">Tạo bài tập & Giao lớp</h4>
                <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                  Chọn câu hỏi từ Ngân hàng đề, thiết lập thời gian làm bài, hạn chót và phát hành trực tuyến cho lớp Toán 10.
                </p>
              </div>
              <span className="text-[10px] text-indigo-650 font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 mt-2 transition-transform">
                Vào Ngân hàng đề →
              </span>
            </div>
          </Link>

          {/* Step 3 */}
          <Link href="/dashboard/tutor/wrong-questions" className="block group">
            <div
              className="rounded-xl p-4 border border-[var(--border-default)] bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between cursor-pointer space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px] border border-indigo-100">
                    3
                  </span>
                  <Badge variant="secondary" className="text-[9px] bg-amber-50 text-amber-700 border-amber-100">AI Review</Badge>
                </div>
                <h4 className="font-bold text-[var(--text-primary)] group-hover:text-indigo-600 transition-colors">Xem phân tích câu sai</h4>
                <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed">
                  Xem chi tiết các câu học sinh làm sai nhiều, các chủ đề học sinh yếu và nhận giáo án ôn tập đề xuất bởi AI.
                </p>
              </div>
              <span className="text-[10px] text-indigo-650 font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 mt-2 transition-transform">
                Xem báo cáo câu sai →
              </span>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Lớp học hoạt động", value: tutorStats.totalClasses, icon: Users, color: "oklch(0.58 0.2 260)" },
          { label: "Tổng học sinh", value: tutorStats.totalStudents, icon: GraduationCap, color: "oklch(0.72 0.17 155)" },
          { label: "Bài tập đang mở", value: activeAssignments.length, icon: ClipboardList, color: "oklch(0.7 0.15 240)" },
          { label: "Bài nộp chờ chấm", value: tutorStats.pendingGrading, icon: FileCheck, color: "oklch(0.65 0.2 25)" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 transition-all duration-200"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${stat.color}15` }}>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {stat.value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Active Assignments */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Bài tập đang diễn ra ({activeAssignments.length})
              </h3>
              <Link href="/dashboard/tutor/assignments">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-500 hover:text-indigo-600">
                  Xem tất cả <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {activeAssignments.map((asgn) => (
                <div key={asgn.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {asgn.title}
                    </h4>
                    <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {asgn.className} • Hạn nộp: {new Date(asgn.dueDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        Nộp bài: <span className="font-bold text-indigo-500">{asgn.submittedCount}</span>/{asgn.totalStudents}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        Tỉ lệ: {Math.round((asgn.submittedCount / asgn.totalStudents) * 100)}%
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Wrong Questions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Câu hỏi sai nhiều nhất
                </h3>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Học sinh hay nhầm lẫn ở các câu hỏi này
                </p>
              </div>
              <Link href="/dashboard/tutor/wrong-questions">
                <Button variant="ghost" size="sm" className="text-xs text-indigo-500 hover:text-indigo-600">
                  Phân tích câu sai <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {wrongQuestionItems.slice(0, 3).map((item) => (
                <div
                  key={item.question.id}
                  className="rounded-xl p-4 transition-colors"
                  style={{ background: "var(--surface-subtle)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-red-500">
                      Tỷ lệ sai: {item.wrongRate}%
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {item.question.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm line-clamp-2 text-left" style={{ color: "var(--text-primary)" }}>
                    <MathRenderer text={item.question.content} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <span>{sampleChapters.find(c => c.id === item.question.chapterId)?.name || item.question.chapterId}</span>
                    <span>Số học sinh sai: {item.wrongCount}/{item.totalAttempts}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* AI Insights & Next Lesson review suggestions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border border-indigo-100 shadow-sm relative overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.03))",
              borderColor: "oklch(0.58 0.2 260 / 0.15)",
            }}
          >
            <div className="absolute top-0 right-0 p-3 pointer-events-none">
              <Sparkles className="h-5 w-5 text-indigo-500/30" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Trợ lý ôn tập AI
                </span>
                <h4 className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Gợi ý bài học tiếp theo
                </h4>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
              {aiReview.summary}
            </p>
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                Đề xuất checklist giảng dạy:
              </span>
              <ul className="space-y-1.5">
                {aiReview.nextLessonSuggestions.slice(0, 3).map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-indigo-100/50 text-[10px] font-bold text-indigo-600">
                      {idx + 1}
                    </span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 border-t border-[var(--border-subtle)] pt-3 text-[10px] flex items-center justify-between" style={{ color: "var(--text-tertiary)" }}>
              <span>Dữ liệu đề xuất giả lập</span>
              <Link href="/dashboard/tutor/ai-review" className="text-indigo-500 font-semibold hover:underline">
                Chi tiết AI Review →
              </Link>
            </div>
          </motion.div>

          {/* Urgent / Unsubmitted List */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Học sinh chưa nộp bài
              </h3>
              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50/50 text-[10px]">
                {tutorStats.studentsNotSubmitted} em trễ
              </Badge>
            </div>
            <div className="space-y-2">
              {[
                { name: "Phạm Minh Đức", class: "Toán nâng cao 12A1", delay: "Trễ 2 ngày" },
                { name: "Võ Thanh Tùng", class: "Toán nâng cao 12A1", delay: "Trễ 1 ngày" },
                { name: "Lê Hoàng Nam", class: "Toán nâng cao 12A1", delay: "Trễ 6 giờ" },
              ].map((student, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-[var(--surface-subtle)]">
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{student.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{student.class}</p>
                  </div>
                  <span className="text-[10px] text-red-500 font-medium">{student.delay}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-3.5" style={{ color: "var(--text-primary)" }}>
              Bài nộp gần đây
            </h3>
            <div className="space-y-3">
              {[...urgentSubmissions, ...mappedSubmissions.filter((s) => s.status === "graded")].slice(0, 4).map((sub) => (
                <div key={sub.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white gradient-bg">
                    {getInitials(sub.studentName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {sub.studentName}
                    </p>
                    <p className="text-[10px] truncate" style={{ color: "var(--text-tertiary)" }}>
                      {sub.assignmentTitle}
                    </p>
                  </div>
                  {sub.status === "submitted" ? (
                    <Badge variant="secondary" className="text-[10px] shrink-0 bg-yellow-50 text-yellow-700 border-yellow-100">
                      Chờ chấm
                    </Badge>
                  ) : (
                    <span className="text-xs font-bold text-green-500 shrink-0">
                      {sub.score}/{sub.totalScore}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
