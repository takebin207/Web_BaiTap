"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Eye,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import MathRenderer from "@/components/ui/math-renderer";
import { sampleChapters, sampleTopics } from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/tutor/assignments/${id}`);
        if (res.ok) {
          const data = await res.json();
          setAssignment(data);
        } else {
          const errData = await res.json();
          setError(errData.error || "Không thể tải chi tiết bài tập.");
        }
      } catch (e) {
        console.error(e);
        setError("Lỗi kết nối máy chủ.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-[var(--border-default)] bg-[var(--surface-card)]">
        <p className="text-xs font-semibold text-[var(--text-secondary)] animate-pulse">
          Đang tải chi tiết bài tập...
        </p>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="rounded-2xl p-10 text-center flex flex-col items-center justify-center border border-red-200 bg-red-50/20 text-red-700">
        <AlertCircle className="h-10 w-10 mb-2.5" />
        <p className="text-sm font-semibold">{error || "Không tìm thấy bài tập."}</p>
        <Link href="/dashboard/tutor/assignments" className="mt-4">
          <Button size="sm" className="rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer border-0">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-150 text-[10px] uppercase font-semibold">Đang mở</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-150 text-[10px] uppercase font-semibold">Nháp</Badge>;
      case "CLOSED":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-150 text-[10px] uppercase font-semibold">Đã đóng</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCognitiveLabel = (lvl: string) => {
    switch (lvl?.toLowerCase()) {
      case "recognition": return "Nhận biết";
      case "understanding": return "Thông hiểu";
      case "application": return "Vận dụng";
      case "advanced_application": return "Vận dụng cao";
      default: return lvl;
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return diff;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header back button row */}
      <motion.div variants={item} className="flex items-center gap-3">
        <Link href="/dashboard/tutor/assignments">
          <Button variant="ghost" size="icon" className="rounded-xl cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Chi tiết bài tập
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Thông tin chi tiết và danh sách câu hỏi đề thi Toán 10.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left main detail side (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 sm:p-6 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Môn học: {assignment.subject === "math" ? "Toán" : assignment.subject} 10
              </span>
              {getStatusBadge(assignment.status)}
            </div>

            <div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {assignment.title}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {assignment.description || "Không có mô tả chi tiết."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <div>
                <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>Giao cho lớp:</span>
                <span className="font-semibold text-[var(--text-primary)]">{assignment.classroom?.name || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>Số lượng câu hỏi:</span>
                <span className="font-semibold text-[var(--text-primary)]">{assignment.questions?.length || 0} câu</span>
              </div>
              <div>
                <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>Thời gian làm bài:</span>
                <span className="font-semibold text-[var(--text-primary)]">{assignment.timeLimitMinutes || "Không giới hạn"} phút</span>
              </div>
              <div>
                <span className="block text-[10px]" style={{ color: "var(--text-tertiary)" }}>Hạn chót nộp bài:</span>
                <span className="font-semibold text-red-500">
                  {assignment.deadline ? new Date(assignment.deadline).toLocaleString("vi-VN") : "Không có hạn chót"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Question List rendering */}
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Danh sách đề bài ({assignment.questions?.length || 0} câu hỏi)
            </h3>

            <div className="space-y-4">
              {assignment.questions?.map((aq: any, idx: number) => {
                const q = aq.question;
                const options = q.options ? (q.options as any[]) : null;

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border p-4 transition-colors border-[var(--border-default)]"
                    style={{ background: "var(--surface-card)" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[8px] uppercase">
                            {sampleChapters.find((c) => c.id === q.chapter)?.name || q.chapter}
                          </Badge>
                          <Badge variant="outline" className="text-[8px] uppercase">
                            {getCognitiveLabel(q.cognitiveLevel)}
                          </Badge>
                          <Badge variant="outline" className="text-[8px] uppercase text-indigo-600">
                            {getDifficultyLabel(q.difficulty)}
                          </Badge>
                        </div>

                        <p className="text-xs font-medium text-left leading-relaxed" style={{ color: "var(--text-primary)" }}>
                          <MathRenderer text={q.content} />
                        </p>

                        {/* Options if MC */}
                        {q.questionType === "MULTIPLE_CHOICE" && options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`p-2.5 rounded-xl border ${
                                  opt.id === q.correctAnswer
                                    ? "border-green-300 bg-green-50/40 text-green-700 font-semibold"
                                    : "border-[var(--border-subtle)] bg-[var(--surface-subtle)]"
                                }`}
                              >
                                <span className="font-bold mr-1.5">{opt.label || opt.id.toUpperCase()}.</span>
                                <MathRenderer text={opt.content} />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Short Answer */}
                        {q.questionType === "SHORT_ANSWER" && (
                          <div className="p-3.5 rounded-xl border border-green-200 bg-green-50/40 text-green-800 text-xs">
                            <strong>Đáp án chính xác:</strong> <MathRenderer text={q.correctAnswer} />
                          </div>
                        )}

                        {/* Explanation */}
                        {q.explanation && (
                          <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] space-y-1 text-xs">
                            <p className="font-semibold text-emerald-600">Lời giải chi tiết:</p>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                              <MathRenderer text={q.explanation} />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right side config summary */}
        <div className="space-y-6 text-xs">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Cài đặt bài thi
            </h3>

            <div className="space-y-3.5 text-[var(--text-secondary)] text-left">
              <div className="flex justify-between">
                <span>Giải thích sau khi nộp:</span>
                <span className="font-bold text-green-600">
                  {assignment.showSolutionsAfterSubmit ? "Cho phép xem" : "Ẩn lời giải"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Trạng thái:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {assignment.status === "ASSIGNED" ? "Đã giao bài" : "Bản nháp"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Ngày tạo:</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {new Date(assignment.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
              <Link href={`/dashboard/student/assignments/${assignment.id}`} className="w-full">
                <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 flex items-center justify-center gap-1.5 cursor-pointer border-0">
                  <Eye className="h-4 w-4" /> Xem trước (Học sinh)
                </Button>
              </Link>
              <Link href="/dashboard/tutor/assignments" className="w-full">
                <Button variant="outline" className="w-full rounded-xl border-[var(--border-default)] text-[var(--text-secondary)] py-2.5 cursor-pointer bg-transparent">
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
