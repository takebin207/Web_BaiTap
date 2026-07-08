"use client";

import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  ClipboardList,
  BookOpen,
  Calendar,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MathRenderer from "@/components/ui/math-renderer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentPracticeSessionPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  // States
  const [assignment, setAssignment] = useState<any>(null);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Attempt State
  const [hasStarted, setHasStarted] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  // Practice Interface State
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [saveStatus, setSaveStatus] = useState("Đã lưu tự động");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchAssignmentDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/student/assignments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAssignment(data);
          setQuestionsList(data.questions || []);
          setTimeLeft((data.timeLimit || 45) * 60);
          
          if (data.latestAttempt) {
            setLatestAttempt(data.latestAttempt);
            setAttemptId(data.latestAttempt.id);

            // If the latest attempt is IN_PROGRESS, pre-populate student answers
            if (data.latestAttempt.status === "in_progress") {
              const loadedAnswers: Record<string, string> = {};
              data.latestAttempt.answers.forEach((ans: any) => {
                loadedAnswers[ans.questionId] = ans.answer;
              });
              setAnswers(loadedAnswers);
              
              // Calculate adjusted time left
              const timeLimitSecs = (data.timeLimit || 45) * 60;
              const remaining = Math.max(0, timeLimitSecs - data.latestAttempt.timeSpent);
              setTimeLeft(remaining);
            }
          }
        } else {
          setError("Không thể tải chi tiết bài tập.");
        }
      } catch (e) {
        console.error(e);
        setError("Lỗi kết nối máy chủ.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignmentDetail();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || !hasStarted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time is up
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, hasStarted]);

  const selectAnswer = (qId: string, optionId: string) => {
    setSaveStatus("Đang lưu...");
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
    // Simulate autosave response (autosave is backed by DB during start/submit workflow)
    setTimeout(() => {
      setSaveStatus("Đã lưu tự động");
    }, 600);
  };

  const handleStartAttempt = async () => {
    try {
      setSaveStatus("Đang khởi tạo...");
      const res = await fetch(`/api/student/assignments/${id}/start`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setAttemptId(data.attemptId);
        setHasStarted(true);
        setSaveStatus("Đã lưu tự động");
      } else {
        alert("Không thể khởi tạo lượt làm bài mới.");
      }
    } catch (e) {
      console.error(e);
      alert("Gặp lỗi kết nối khi bắt đầu làm bài.");
    }
  };

  const handleFinish = () => {
    setShowConfirmModal(true);
  };

  const handleAutoSubmit = () => {
    alert("Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài làm của bạn.");
    confirmSubmit();
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setSaveStatus("Đang nộp bài...");

    const timeSpentSeconds = (assignment.timeLimit * 60) - timeLeft;

    try {
      const res = await fetch(`/api/student/assignments/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          timeSpentSeconds,
          attemptId,
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/student/assignments/${id}/result`);
      } else {
        const data = await res.json();
        alert(data.error || "Gặp lỗi khi nộp bài.");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi kết nối máy chủ khi nộp bài.");
    } finally {
      setSaveStatus("Đã lưu tự động");
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-[var(--border-default)] bg-[var(--surface-card)]">
        <p className="text-xs font-semibold text-[var(--text-secondary)] animate-pulse">
          Đang chuẩn bị đề thi...
        </p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-red-100 bg-red-50/10 text-red-700">
        <p className="text-xs font-semibold">{error || "Không tìm thấy bài tập."}</p>
        <Link href="/dashboard/student/assignments" className="mt-4">
          <Button size="sm" className="rounded-xl bg-red-600 hover:bg-red-700 text-white border-none cursor-pointer">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  // Render Access Screen if not started yet
  if (!hasStarted && latestAttempt?.status !== "in_progress") {
    const isCompleted =
      latestAttempt?.status === "graded" || latestAttempt?.status === "submitted";

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/dashboard/student/assignments" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Bài tập
          </Link>
          <span>/</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Chi tiết bài tập</span>
        </div>

        {/* Assignment Intro Card */}
        <div
          className="rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
          style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
        >
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-400/5 blur-3xl pointer-events-none" />
          
          <div className="space-y-3">
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 px-2.5 py-0.5 text-[10px] uppercase font-bold">
              Toán 10
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold text-left" style={{ color: "var(--text-primary)" }}>
              {assignment.title}
            </h2>
            <p className="text-xs text-left" style={{ color: "var(--text-tertiary)" }}>
              {assignment.description || "Không có mô tả chi tiết."}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-[var(--border-subtle)] text-xs text-left">
            <div className="space-y-1">
              <span style={{ color: "var(--text-tertiary)" }}>Lớp học:</span>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <BookOpen className="h-4 w-4 text-indigo-500" /> {assignment.className}
              </p>
            </div>
            <div className="space-y-1">
              <span style={{ color: "var(--text-tertiary)" }}>Số câu hỏi:</span>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <ClipboardList className="h-4 w-4 text-emerald-500" /> {questionsList.length} câu hỏi
              </p>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span style={{ color: "var(--text-tertiary)" }}>Thời gian:</span>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <Clock className="h-4 w-4 text-amber-500" /> {assignment.timeLimit} phút
              </p>
            </div>
            <div className="space-y-1 col-span-2">
              <span style={{ color: "var(--text-tertiary)" }}>Hạn nộp:</span>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                <Calendar className="h-4 w-4 text-red-400" />{" "}
                {assignment.deadline
                  ? new Date(assignment.deadline).toLocaleString("vi-VN")
                  : "Không giới hạn"}
              </p>
            </div>
          </div>

          {/* Attempt Status and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Trạng thái bài tập:
              </span>
              <div className="mt-1 flex items-center gap-2">
                {isCompleted ? (
                  <>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold flex items-center gap-1">
                      <Award className="h-3 w-3" /> Đã hoàn thành
                    </Badge>
                    <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Điểm: {latestAttempt.score}/{questionsList.length}
                    </span>
                  </>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-bold">
                    Chưa bắt đầu
                  </Badge>
                )}
              </div>
            </div>

            {isCompleted ? (
              <Link href={`/dashboard/student/assignments/${assignment.id}/result`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 text-xs border-none cursor-pointer">
                  Xem kết quả chi tiết
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleStartAttempt}
                className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 text-xs border-none cursor-pointer flex items-center justify-center gap-2"
              >
                Bắt đầu làm bài <Award className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active question index check
  const activeQuestion = questionsList[activeIdx];

  if (!activeQuestion) {
    return (
      <div className="p-8 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
        Không tìm thấy câu hỏi phù hợp cho bài tập Toán 10 này.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Sticky row */}
      <div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student/assignments">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {assignment.title}
            </h2>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              Môn: Toán 10 • Lớp: {assignment.className}
            </p>
          </div>
        </div>

        {/* Timer & Autosave Status */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            {saveStatus === "Đang lưu..." ? (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
            ) : (
              <span className="flex h-2 w-2 relative">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
            <span className="text-[10px] text-emerald-600 font-medium">{saveStatus}</span>
          </div>

          <Badge className="bg-red-50 text-red-700 border-red-100 px-3 py-1 text-xs font-mono flex items-center gap-1.5">
            <Clock className="h-4 w-4 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </Badge>

          <Button
            onClick={handleFinish}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
          >
            Nộp bài
          </Button>
        </div>
      </div>

      {/* Main Grid: Question (2/3) + Navigator (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Question Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl p-6 space-y-5"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase">
                Câu hỏi {activeIdx + 1}/{questionsList.length}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {activeQuestion.difficulty.toUpperCase()}
              </Badge>
            </div>

            {/* Question Content */}
            <div className="text-sm font-semibold leading-relaxed text-left" style={{ color: "var(--text-primary)" }}>
              <MathRenderer text={activeQuestion.content} />
            </div>

            {/* Multiple Choice Options or short answer */}
            {activeQuestion.questionType === "multiple_choice" && activeQuestion.options ? (
              <div className="space-y-3">
                {activeQuestion.options.map((opt: any) => {
                  const isSelected = answers[activeQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectAnswer(activeQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold"
                          : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-inset)]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-bold text-xs ${
                          isSelected
                            ? "border-indigo-650 dark:border-indigo-550 bg-indigo-600 text-white"
                            : "border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="flex-1"><MathRenderer text={opt.content} /></span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="font-semibold block text-[var(--text-secondary)]">Điền đáp án của bạn:</label>
                <input
                  type="text"
                  placeholder="Nhập câu trả lời ngắn..."
                  value={answers[activeQuestion.id] || ""}
                  onChange={(e) => selectAnswer(activeQuestion.id, e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Question Navigator Side Panel */}
        <div className="space-y-6">
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              Bản đồ câu hỏi
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questionsList.map((q: any, idx: number) => {
                const isAnswered = !!answers[q.id];
                const isActive = idx === activeIdx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-9 w-full rounded-xl flex items-center justify-center text-xs font-bold border transition-colors cursor-pointer ${
                      isActive
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : isAnswered
                        ? "border-indigo-200 bg-indigo-50/40 text-indigo-700"
                        : "border-[var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-inset)]"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap gap-x-4 gap-y-2 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-indigo-600" />
                <span>Đang chọn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-indigo-50 border border-indigo-200" />
                <span>Đã làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-[var(--surface-subtle)] border border-[var(--border-default)]" />
                <span>Chưa làm</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 border border-indigo-100/50"
            style={{ background: "linear-gradient(to bottom right, var(--surface-card), oklch(0.58 0.2 260 / 0.02))" }}
          >
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Chống gian lận
            </h4>
            <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Bộ phân tích hành vi đang tự động ghi nhận thời gian làm bài của từng câu hỏi để đưa ra báo cáo chính xác cho giáo viên.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5 text-center text-xs"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Nộp bài làm trực tuyến
                </h3>
                <p className="text-[10px] text-[var(--text-tertiary)] max-w-xs leading-relaxed">
                  Bạn đang chuẩn bị nộp bài làm của mình. Hãy kiểm tra kỹ các câu hỏi trước khi nộp.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-subtle)] text-left space-y-2 border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Tổng số câu hỏi:</span>
                  <span className="font-bold text-[var(--text-primary)]">{questionsList.length} câu</span>
                </div>
                <div className="flex justify-between">
                  <span>Đã trả lời:</span>
                  <span className="font-bold text-emerald-600">{Object.keys(answers).length} câu</span>
                </div>
                <div className="flex justify-between">
                  <span>Chưa trả lời (bỏ qua):</span>
                  <span className={`font-bold ${questionsList.length - Object.keys(answers).length > 0 ? "text-amber-500 font-semibold" : "text-[var(--text-primary)]"}`}>
                    {questionsList.length - Object.keys(answers).length} câu
                  </span>
                </div>
                <div className="flex justify-between border-t border-[var(--border-subtle)] pt-2 mt-2">
                  <span>Thời gian làm bài còn lại:</span>
                  <span className="font-bold text-red-500">{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1 rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2 text-[10px] cursor-pointer"
                >
                  Quay lại làm tiếp
                </Button>
                <Button
                  onClick={confirmSubmit}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 text-[10px] cursor-pointer"
                >
                  Nộp bài ngay
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
