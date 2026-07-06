"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  FileUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockImportJobs } from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ImportCenterPage() {
  const [jobs, setJobs] = useState(mockImportJobs);

  const handleUploadClick = () => {
    alert("Đã mô phỏng chọn tệp tải lên! Tính năng bóc tách đề thi Toán 10 bằng Gemini OCR sẽ được tích hợp ở giai đoạn sau.");
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-50 text-green-700 border-green-150 text-[10px]">Đã hoàn thành</Badge>;
      case "needs_review":
        return <Badge className="bg-orange-50 text-orange-700 border-orange-150 text-[10px]">Cần giáo viên duyệt</Badge>;
      case "ai_extracting":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-150 text-[10px] animate-pulse">AI đang bóc tách</Badge>;
      case "ocr_processing":
        return <Badge className="bg-purple-50 text-purple-700 border-purple-150 text-[10px] animate-pulse">OCR nhận dạng</Badge>;
      case "error":
        return <Badge className="bg-red-50 text-red-700 border-red-150 text-[10px]">Thất bại</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Nhập đề thi Toán 10 (Import Center)
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Tính năng cao cấp: Nhập tệp đề bài & đáp án riêng biệt để AI tự động chuyển hóa thành ngân hàng câu hỏi.
          </p>
        </div>
        <Badge variant="outline" className="text-amber-600 bg-amber-50/50 border-amber-250 py-1 px-2.5 text-xs font-semibold">
          🚀 Giao diện Thử nghiệm Giai đoạn 1
        </Badge>
      </motion.div>

      {/* Upload layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          variants={item}
          className="rounded-2xl p-6 text-center flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-default)] transition-colors hover:border-indigo-400"
          style={{ background: "var(--surface-card)" }}
        >
          <Upload className="h-10 w-10 text-indigo-500 mb-3" />
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Tải lên tệp đề bài Toán 10 (Câu hỏi)
          </h3>
          <p className="text-xs mb-4 max-w-xs" style={{ color: "var(--text-tertiary)" }}>
            Hỗ trợ định dạng: **PDF**, **Word (.docx)** hoặc **Ảnh chụp đề bài**
          </p>
          <Button
            onClick={handleUploadClick}
            size="sm"
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4"
          >
            Chọn tệp đề bài
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="rounded-2xl p-6 text-center flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-default)] transition-colors hover:border-indigo-400"
          style={{ background: "var(--surface-card)" }}
        >
          <FileText className="h-10 w-10 text-emerald-500 mb-3" />
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
            Tải lên tệp đáp án Toán 10 (Tùy chọn)
          </h3>
          <p className="text-xs mb-4 max-w-xs" style={{ color: "var(--text-tertiary)" }}>
            Hỗ trợ tự động khớp với các câu hỏi tương ứng trong đề.
          </p>
          <Button
            onClick={handleUploadClick}
            size="sm"
            variant="outline"
            className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50/50 text-xs font-semibold px-4"
          >
            Chọn tệp đáp án
          </Button>
        </motion.div>
      </div>

      {/* Warning panel */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4 border border-amber-200 bg-amber-50/40 flex items-start gap-3"
      >
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-800">
            ⚠️ Lưu ý về nhận dạng công thức Toán học lớp 10:
          </h4>
          <p className="text-xs text-amber-700 leading-relaxed">
            Nhận dạng ký hiệu LaTeX cho các vectơ, parabol và bất phương trình có thể phát sinh sai lệch nhỏ. Vui lòng rà soát danh sách câu hỏi ở trạng thái <strong>CẦN DUYỆT</strong> trước khi lưu vào ngân hàng đề chính thức.
          </p>
        </div>
      </motion.div>

      {/* Jobs history */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 sm:p-6 space-y-4"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Tiến trình nạp đề thi Toán 10 ({jobs.length} tệp)
        </h3>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border border-[var(--border-subtle)] space-y-3.5 bg-[var(--surface-subtle)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <FileUp className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold truncate max-w-xs sm:max-w-md" style={{ color: "var(--text-primary)" }}>
                      {job.questionFileName}
                    </h4>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Nạp lúc: {new Date(job.uploadedAt).toLocaleString("vi-VN")} • Định dạng: {job.format.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div>{getStatusDisplay(job.status)}</div>
              </div>

              {job.progress < 100 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    <span>Đang trích xuất công thức...</span>
                    <span>{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-1.5" />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-[10px] pt-2.5 border-t border-[var(--border-subtle)]" style={{ color: "var(--text-tertiary)" }}>
                <div className="flex items-center gap-4">
                  <span>Số câu hỏi: <strong style={{ color: "var(--text-secondary)" }}>{job.extractedCount} câu</strong></span>
                  {job.answerFileName && (
                    <span>Khớp đáp án: <strong style={{ color: "var(--text-secondary)" }}>{job.matchedCount}/{job.extractedCount}</strong></span>
                  )}
                  <span>Cần duyệt: <strong className="text-orange-500 font-bold">{job.needsReviewCount} câu</strong></span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 sm:mt-0">
                  <span>Chi phí AI ước tính: <strong style={{ color: "var(--text-secondary)" }}>{job.estimatedCost}</strong></span>
                  {job.status === "needs_review" ? (
                    <Button
                      onClick={() => alert(`Duyệt ${job.needsReviewCount} câu hỏi Toán 10 từ tệp ${job.questionFileName}`)}
                      size="sm"
                      className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-[10px] py-1 px-2.5 h-6"
                    >
                      Duyệt ngay
                    </Button>
                  ) : job.status === "completed" ? (
                    <span className="text-green-500 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="h-3 w-3" /> Đã lưu
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

import { X } from "lucide-react";
