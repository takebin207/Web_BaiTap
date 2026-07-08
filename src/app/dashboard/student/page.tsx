"use client";

import { motion } from "framer-motion";
import {
  ClipboardList,
  AlertTriangle,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentDashboard() {
  const { data: session } = useSession();
  const studentName = session?.user?.name || "Học sinh";

  const [assignments, setAssignments] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAsgns, resAttempts] = await Promise.all([
          fetch("/api/student/assignments"),
          fetch("/api/student/attempts"),
        ]);
        if (resAsgns.ok && resAttempts.ok) {
          const dataAsgns = await resAsgns.json();
          const dataAttempts = await resAttempts.json();
          setAssignments(dataAsgns);
          setAttempts(dataAttempts);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingAssignments = assignments.filter((a) => a.status === "active");
  const completedAttempts = attempts;
  const totalWrongQuestions = attempts.reduce(
    (acc, curr) => acc + (curr.answers?.filter((ans: any) => !ans.isCorrect).length || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-[var(--border-default)] bg-[var(--surface-card)]">
        <p className="text-xs font-semibold text-[var(--text-secondary)] animate-pulse">
          Đang tải dữ liệu học tập...
        </p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 gradient-bg text-white shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Chào {studentName}! 👋
          </h2>
          <p className="mt-2 text-white/80 text-sm max-w-xl">
            Hãy tiếp tục làm bài tập được giao và rà soát lại các câu trả lời chưa đúng cùng trợ lý ảo học tập.
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/dashboard/student/assignments">
              <Button size="sm" className="rounded-xl bg-white text-indigo-600 border-none hover:bg-white/90 font-medium">
                <ClipboardList className="mr-1.5 h-4 w-4" /> Làm bài tập
              </Button>
            </Link>
            <Link href="/dashboard/student/wrong-questions">
              <Button size="sm" className="rounded-xl bg-white/20 text-white border-white/20 backdrop-blur hover:bg-white/30 font-medium">
                <AlertTriangle className="mr-1.5 h-4 w-4" /> Ôn câu làm sai
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Bài tập chưa làm
            </span>
            <ClipboardList className="h-5 w-5 text-indigo-500 bg-indigo-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {pendingAssignments.length}
          </p>
          <Link href="/dashboard/student/assignments" className="text-[10px] mt-1.5 text-indigo-500 hover:underline font-semibold block">
            Xem danh sách bài tập →
          </Link>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Câu hỏi làm sai lưu trữ
            </span>
            <AlertTriangle className="h-5 w-5 text-red-500 bg-red-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {totalWrongQuestions}
          </p>
          <Link href="/dashboard/student/wrong-questions" className="text-[10px] mt-1.5 text-red-500 hover:underline font-semibold block">
            Luyện tập lại ngay câu sai →
          </Link>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
              Bài tập đã chấm điểm
            </span>
            <Award className="h-5 w-5 text-green-500 bg-green-50 p-1 rounded-lg" />
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {completedAttempts.length}
          </p>
          <Link href="/dashboard/student/results" className="text-[10px] mt-1.5 text-green-500 hover:underline font-semibold block">
            Xem lịch sử điểm số →
          </Link>
        </div>
      </motion.div>

      {/* Grid: Pending work & recent results */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Pending assignments list (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Bài tập cần hoàn thành
            </h3>

            {pendingAssignments.length === 0 ? (
              <div className="text-center py-6 text-xs" style={{ color: "var(--text-tertiary)" }}>
                Tuyệt vời! Bạn đã hoàn thành tất cả bài tập được giao.
              </div>
            ) : (
              <div className="space-y-3.5">
                {pendingAssignments.map((asgn) => (
                  <div
                    key={asgn.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-[var(--border-subtle)] gap-3"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                          {asgn.title}
                        </span>
                        <Badge variant="outline" className="text-[9px]">
                          {asgn.subject}
                        </Badge>
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        {asgn.questionCount} câu hỏi trắc nghiệm • Thời gian: {asgn.timeLimit} phút
                      </p>
                      <p className="text-[10px] text-red-500 mt-1 font-medium">
                        Hạn nộp: {new Date(asgn.dueDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Link href={`/dashboard/student/assignments/${asgn.id}`}>
                      <Button size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs">
                        Bắt đầu làm bài
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Side: Recent Results & AI suggestion (1/3) */}
        <div className="space-y-6">
          {/* AI Helper suggestions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border border-indigo-100 shadow-sm"
            style={{ background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.02))" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Lời khuyên học tập từ AI
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Dựa trên kết quả bài tập gần nhất, bạn có điểm yếu ở chủ đề <strong>Hàm số bậc hai</strong> và <strong>Vectơ</strong>. Hãy bấm ôn tập câu sai để AI hướng dẫn giải lại chi tiết.
            </p>
            <Link href="/dashboard/student/wrong-questions">
              <Button size="sm" variant="ghost" className="mt-3.5 text-xs text-indigo-500 hover:text-indigo-600 font-semibold p-0">
                Luyện tập ngay câu sai →
              </Button>
            </Link>
          </motion.div>

          {/* Recent results list */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold mb-3.5" style={{ color: "var(--text-primary)" }}>
              Lịch sử điểm số
            </h3>
            {completedAttempts.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                Chưa có dữ liệu bài làm được chấm.
              </p>
            ) : (
              <div className="space-y-3">
                {completedAttempts.map((att) => (
                  <div key={att.id} className="flex justify-between items-center text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {att.assignmentTitle}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        Nộp ngày: {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString("vi-VN") : ""}
                      </p>
                    </div>
                    <span className="font-bold text-green-500 ml-2">
                      {att.score}/{att.totalQuestions}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
