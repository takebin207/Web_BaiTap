"use client";

import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockAssignments, questionBank } from "@/data/mock/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MathRenderer from "@/components/ui/math-renderer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentPracticeSessionPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const assignment = mockAssignments.find((a) => a.id === id) || mockAssignments[0];
  const questionsList = questionBank.filter((q) => q.status === "READY" && q.chapterId === "chap-1"); // Use Math 10 chap 1 questions

  // Active question index
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(assignment.timeLimit * 60); // seconds
  const [saveStatus, setSaveStatus] = useState("Đã lưu tự động");

  // Timer countdown mock
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const selectAnswer = (qId: string, optionId: string) => {
    setSaveStatus("Đang lưu...");
    setAnswers((prev) => ({ ...prev, [qId]: optionId }));
    setTimeout(() => {
      setSaveStatus("Đã lưu tự động");
    }, 600);
  };

  const handleFinish = () => {
    const answeredCount = Object.keys(answers).length;
    const totalCount = questionsList.length;

    const confirmSubmit = window.confirm(
      `Bạn đã trả lời ${answeredCount}/${totalCount} câu hỏi. Bạn có chắc chắn muốn nộp bài?`
    );
    if (confirmSubmit) {
      alert("Nộp bài thành công!");
      router.push(`/dashboard/student/assignments/${assignment.id}/result`);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
  };

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
              Môn: Toán 10 • {assignment.className}
            </p>
          </div>
        </div>

        {/* Timer & Autosave Status */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
            <Save className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-[10px] text-emerald-500 font-medium">{saveStatus}</span>
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
                {activeQuestion.options.map((opt) => {
                  const isSelected = answers[activeQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => selectAnswer(activeQuestion.id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-xs flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/20 text-indigo-900 font-medium"
                          : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] hover:bg-[var(--surface-inset)]"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-bold text-xs ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-[var(--border-default)] bg-white text-[var(--text-secondary)]"
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
              {questionsList.map((q, idx) => {
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
    </div>
  );
}
