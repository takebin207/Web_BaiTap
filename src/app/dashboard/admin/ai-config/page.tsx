"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sliders,
  Save,
  Terminal,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function AIConfig() {
  const [model, setModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.3);
  const [systemPrompt, setSystemPrompt] = useState(
    "Bạn là một trợ lý giáo dục AI xuất sắc dành cho học sinh THPT tại Việt Nam. Hãy giải thích chi tiết các bước giải bài tập Toán, Lý, Hóa một cách khoa học, sư phạm."
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Configuration Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main settings card */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-6"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <Sliders className="h-5 w-5 text-indigo-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Tham số cấu hình AI Model
              </h3>
            </div>

            {/* Model select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                Lựa chọn Mô hình LLM (Mock):
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", desc: "Độ chính xác cao nhất" },
                  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", desc: "Tốc độ nhanh nhất" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className="rounded-xl p-4 text-left border transition-all cursor-pointer card-hover"
                    style={{
                      background: model === m.id ? "oklch(0.58 0.2 260 / 0.08)" : "var(--surface-subtle)",
                      borderColor: model === m.id ? "oklch(0.58 0.2 260)" : "transparent",
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature slider mock */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <label style={{ color: "var(--text-secondary)" }}>Độ sáng tạo (Temperature):</label>
                <span style={{ color: "oklch(0.58 0.2 260)" }}>{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                <span>Chính xác & Nhất quán (0.0)</span>
                <span>Tự do & Sáng tạo (1.0)</span>
              </div>
            </div>

            {/* System prompt textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                System Prompt (Prompt Chỉ thị):
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-xl p-3.5 text-xs border outline-none placeholder:text-[var(--text-tertiary)] bg-transparent resize-none leading-relaxed"
                style={{ color: "var(--text-primary)", borderColor: "var(--border-default)" }}
              />
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <Button variant="outline" className="rounded-xl h-9 text-xs">
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Khôi phục mặc định
              </Button>
              <Button className="rounded-xl h-9 text-xs gradient-bg text-white border-0 hover:opacity-90">
                <Save className="mr-1.5 h-3.5 w-3.5" /> Lưu cấu hình
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3): Testing area */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className="flex items-center gap-2 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <Terminal className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Thử nghiệm Prompt
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Bạn có thể viết câu hỏi thử nghiệm tại đây để kiểm tra đầu ra từ cấu hình prompt hiện tại.
            </p>
            <textarea
              placeholder="Ví dụ: Giải bài toán tìm cực trị hàm số..."
              rows={3}
              className="w-full rounded-xl p-3 text-xs border outline-none bg-transparent resize-none"
              style={{ color: "var(--text-primary)", borderColor: "var(--border-default)" }}
            />
            <Button className="w-full rounded-xl h-9 text-xs" variant="secondary">
              <Play className="mr-1.5 h-3.5 w-3.5 text-indigo-500" /> Chạy thử Prompt
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
