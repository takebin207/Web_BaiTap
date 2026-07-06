"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  TrendingDown,
  BookOpen,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wrongQuestionItems, aiReviewSummaries } from "@/data/mock/data";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AIReviewAssistantPage() {
  const [selectedQuestionId, setSelectedQuestionId] = useState(wrongQuestionItems[0]?.question.id || "");
  const [similarQuestions, setSimilarQuestions] = useState<Array<{ content: string; options: string[] }> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeWq = wrongQuestionItems.find((wq) => wq.question.id === selectedQuestionId);
  const aiReview = aiReviewSummaries[0];

  const handleGenerateSimilar = () => {
    if (!activeWq) return;
    setIsGenerating(true);
    setTimeout(() => {
      // Mock generated similar questions based on the selected question topic
      const generated = [
        {
          content: `[Tương tự] Tìm các khoảng nghịch biến của hàm số y = -x³ + 3x² - 4.`,
          options: ["(0; 2)", "(-∞; 0) và (2; +∞)", "(-1; 1)", "(-∞; -1) và (1; +∞)"],
        },
        {
          content: `[Tương tự] Cho hàm số y = x³ - 3x. Khẳng định nào sau đây là đúng?`,
          options: [
            "Hàm số đồng biến trên (-1; 1)",
            "Hàm số nghịch biến trên (-∞; -1)",
            "Hàm số nghịch biến trên (-1; 1)",
            "Hàm số đồng biến trên ℝ",
          ],
        },
        {
          content: `[Tương tự] Tìm giá trị cực tiểu của hàm số y = x³ - 3x² + 4.`,
          options: ["y = 0", "y = 4", "y = 2", "y = -2"],
        },
      ];
      setSimilarQuestions(generated);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Trợ lý AI Ôn tập
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Hỗ trợ phân tích câu hỏi sai, tạo câu hỏi tương đương và lên giáo án ôn tập lớp học.
          </p>
        </div>
      </motion.div>

      {/* Main Grid layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Explanations & Question generation */}
        <div className="space-y-6">
          {/* Card 1: Explain wrong answer */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                1. Giải thích câu hỏi học sinh làm sai
              </h3>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-tertiary)] block">Chọn câu hỏi cần giải thích:</label>
              <select
                value={selectedQuestionId}
                onChange={(e) => {
                  setSelectedQuestionId(e.target.value);
                  setSimilarQuestions(null); // reset similar
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {wrongQuestionItems.map((wq) => (
                  <option key={wq.question.id} value={wq.question.id}>
                    ({wq.wrongRate}% sai) - {wq.question.content.slice(0, 70)}...
                  </option>
                ))}
              </select>
            </div>

            {activeWq && (
              <div className="space-y-3.5 pt-1">
                <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)] text-xs">
                  <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Nội dung câu hỏi:</p>
                  <p style={{ color: "var(--text-primary)" }}>{activeWq.question.content}</p>
                </div>

                {activeWq.question.aiExplanation ? (
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-150/40 text-xs">
                    <p className="font-bold text-indigo-600 mb-1.5 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Trợ lý AI gợi ý cách nhớ:
                    </p>
                    <p className="whitespace-pre-line text-indigo-900 leading-relaxed">
                      {activeWq.question.aiExplanation}
                    </p>
                    <div className="mt-3 text-[9px] text-indigo-400 font-medium">
                      [Mock] Câu trả lời sinh tĩnh phục vụ chạy thử.
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-tertiary)]">Không có giải thích nâng cao cho câu này.</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Card 2: Generate similar questions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  2. Tạo câu hỏi tương tự để ôn tập
                </h3>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px]">
                [Mock] AI Generator
              </Badge>
            </div>

            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Tự động sinh ra các câu hỏi tương tự cùng chương học & độ khó để giao bài kiểm tra bù cho học sinh làm sai.
            </p>

            <Button
              onClick={handleGenerateSimilar}
              disabled={isGenerating}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2"
            >
              {isGenerating ? "Đang sinh đề..." : "Sinh 3 câu hỏi tương tự"}
            </Button>

            <AnimatePresence>
              {similarQuestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2 overflow-hidden"
                >
                  <span className="text-[10px] font-bold text-indigo-600 block uppercase tracking-wider">
                    Đề xuất câu hỏi tương đương:
                  </span>
                  {similarQuestions.map((sq, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl border border-dashed border-indigo-200 text-xs"
                      style={{ background: "var(--surface-subtle)" }}
                    >
                      <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                        {sq.content}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {sq.options.map((opt, oIdx) => (
                          <div key={oIdx} className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)]">
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Weak topics + next lesson suggest */}
        <div className="space-y-6">
          {/* Card 3: Summarize weak topics */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  3. Tổng hợp lỗ hổng của lớp
                </h3>
              </div>
              <Badge className="bg-red-50 text-red-700 border-red-100 text-[10px]">
                {aiReview.className}
              </Badge>
            </div>

            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Các lỗ hổng lý thuyết được AI lọc ra dựa trên bài tập <strong>{aiReview.assignmentTitle}</strong>.
            </p>

            <div className="space-y-3.5">
              {aiReview.weakTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                      {topic.topic}
                    </span>
                    <span className="font-bold text-red-500">
                      {topic.wrongRate}% học sinh làm sai
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-[var(--surface-subtle)]">
                    <div
                      className="h-full rounded-full bg-red-500"
                      style={{ width: `${topic.wrongRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Next lesson plan suggest */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Calendar className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                4. Gợi ý nội dung giảng dạy buổi sau
              </h3>
            </div>

            <div className="space-y-2.5">
              {aiReview.nextLessonSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--surface-subtle)] text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <span style={{ color: "var(--text-secondary)" }}>{sug}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Cache Policy description */}
      <motion.div
        variants={item}
        className="rounded-2xl p-4 border border-[var(--border-default)] text-[10px] leading-relaxed"
        style={{ background: "var(--surface-card)" }}
      >
        <p className="font-bold text-[var(--text-secondary)] mb-1">
          💡 Lưu ý kiến trúc tích hợp EStudy AI:
        </p>
        <p style={{ color: "var(--text-tertiary)" }}>
          Kết quả phân tích hiện tại được lấy từ dữ liệu tĩnh. Trong môi trường sản xuất, toàn bộ kết quả phân tích học tập, giải thích lời giải chi tiết và câu hỏi tương tự sẽ được tự động kích hoạt bởi <strong>Gemini 1.5 API</strong>. Kết quả sẽ được lưu vào cơ sở dữ liệu PostgreSQL (cache) nhằm tối ưu tốc độ phản hồi và tiết kiệm 95% chi phí gọi token API.
        </p>
      </motion.div>
    </motion.div>
  );
}
