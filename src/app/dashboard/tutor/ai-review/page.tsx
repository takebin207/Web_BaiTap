"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RefreshCw,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wrongQuestionItems, aiReviewSummaries } from "@/data/mock/data";
import MathRenderer from "@/components/ui/math-renderer";

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
      // Mock generated similar questions based on the selected Math 10 question topic
      let generated: typeof similarQuestions = [];
      if (activeWq.question.chapterId === "chap-3") {
        generated = [
          {
            content: `[Tương tự] Cho hàm số bậc hai $y = -x^2 + 2x + 3$. Tọa độ đỉnh của parabol là?`,
            options: ["$(1; 4)$", "$(-1; 0)$", "$(1; 2)$", "$(2; 3)$"],
          },
          {
            content: `[Tương tự] Tìm trục đối xứng của đồ thị hàm số $y = 2x^2 - 4x + 1$.`,
            options: ["$x = 1$", "$x = 2$", "$x = -1$", "$x = -2$"],
          },
        ];
      } else {
        generated = [
          {
            content: `[Tương tự] Trong mặt phẳng tọa độ $Oxy$, cho $\\vec{u} = (2; -3)$ và $\\vec{v} = (1; 4)$. Tìm tọa độ $\\vec{w} = 3\\vec{u} - 2\\vec{v}$.`,
            options: ["$(4; -17)$", "$(4; -1)$", "$(7; -17)$", "$(8; -1)$"],
          },
        ];
      }
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
            Trợ lý AI Ôn tập Toán 10
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Hỗ trợ phân tích câu hỏi làm sai, tạo bài tập tương đương và đề xuất kế hoạch giảng dạy Toán 10.
          </p>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
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

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[var(--text-tertiary)] block">Chọn câu hỏi cần giải thích:</label>
              <select
                value={selectedQuestionId}
                onChange={(e) => {
                  setSelectedQuestionId(e.target.value);
                  setSimilarQuestions(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                {wrongQuestionItems.map((wq) => (
                  <option key={wq.question.id} value={wq.question.id}>
                    ({wq.wrongRate}% sai) - {wq.question.content.slice(0, 60)}...
                  </option>
                ))}
              </select>
            </div>

            {activeWq && (
              <div className="space-y-3.5 pt-1 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--surface-subtle)]">
                  <p className="font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Câu hỏi:</p>
                  <div style={{ color: "var(--text-primary)" }}><MathRenderer text={activeWq.question.content} /></div>
                </div>

                {activeWq.question.aiExplanation ? (
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-150/40 text-xs">
                    <p className="font-bold text-indigo-600 mb-1.5 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Trợ lý AI gợi ý:
                    </p>
                    <p className="whitespace-pre-line text-indigo-900 leading-relaxed">
                      <MathRenderer text={activeWq.question.aiExplanation} />
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-tertiary)]">Không có lời giải thích từ AI cho câu hỏi này.</p>
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
                  2. Tạo câu hỏi ôn tập tương tự
                </h3>
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px]">
                [Mock] AI Generator
              </Badge>
            </div>

            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Tự động sinh các câu hỏi tương tự cùng mạch kiến thức để gia sư giao bài luyện tập thêm.
            </p>

            <Button
              onClick={handleGenerateSimilar}
              disabled={isGenerating}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2"
            >
              {isGenerating ? "Đang sinh đề..." : "Sinh 2 câu hỏi tương tự"}
            </Button>

            <AnimatePresence>
              {similarQuestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2 overflow-hidden text-xs"
                >
                  <span className="font-bold text-indigo-600 block uppercase tracking-wider">
                    Câu hỏi tương đương:
                  </span>
                  {similarQuestions.map((sq, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-xl border border-dashed border-indigo-250 bg-[var(--surface-subtle)]"
                    >
                      <div style={{ color: "var(--text-primary)" }}><MathRenderer text={sq.content} /></div>
                      <div className="grid grid-cols-2 gap-2">
                        {sq.options.map((opt, oIdx) => (
                          <div key={oIdx} className="p-1.5 rounded-lg border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)]">
                            <MathRenderer text={opt} />
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

        {/* Right Side: Weak topics & suggestions */}
        <div className="space-y-6">
          {/* Card 3: Weak topics */}
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
              Các chủ đề rỗng kiến thức nhiều nhất trong bài: <strong>{aiReview.assignmentTitle}</strong>.
            </p>

            <div className="space-y-3.5">
              {aiReview.weakTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
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

          {/* Card 4: Next lesson suggestions */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
              <Calendar className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                4. Đề xuất giảng dạy buổi sau
              </h3>
            </div>

            <div className="space-y-2.5">
              {aiReview.nextLessonSuggestions.map((sug, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg bg-[var(--surface-subtle)] text-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600 font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <span style={{ color: "var(--text-secondary)" }}><MathRenderer text={sug} /></span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        variants={item}
        className="rounded-2xl p-4 border border-[var(--border-default)] text-[10px] leading-relaxed"
        style={{ background: "var(--surface-card)" }}
      >
        <p className="font-bold text-[var(--text-secondary)] mb-1">
          💡 Tích hợp Google Gemini AI:
        </p>
        <p style={{ color: "var(--text-tertiary)" }}>
          Lời giải chi tiết và câu hỏi tương đương Toán 10 được tạo bởi Gemini 1.5. Bộ nhớ cache PostgreSQL giúp tiết kiệm chi phí gọi token khi thực hành lặp lại.
        </p>
      </motion.div>
    </motion.div>
  );
}
