"use client";

import { motion } from "framer-motion";
import {
  Users,
  Database,
  Brain,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function AdminOverview() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* System status cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tổng số câu hỏi", value: "10,240", icon: Database, color: "text-blue-500 bg-blue-500/10" },
          { label: "Người dùng hoạt động", value: "2,650", icon: Users, color: "text-emerald-500 bg-emerald-500/10" },
          { label: "Yêu cầu AI hôm nay", value: "12,840", icon: Brain, color: "text-purple-500 bg-purple-500/10" },
          { label: "Trạng thái máy chủ", value: "99.9%", icon: Server, color: "text-teal-500 bg-teal-500/10" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 border"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-4.5 w-4.5" />
            </div>
            <p className="mt-3 text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Admin Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 md:col-span-2">
          {/* AI Usage Logs */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Lịch sử tương tác API AI
            </h3>
            <div className="space-y-3.5">
              {[
                { endpoint: "Sinh câu hỏi tự động (OCR/PDF)", method: "POST", status: "200 OK", latency: "1.4s" },
                { endpoint: "Giải thích đáp án (Gemini-1.5-pro)", method: "POST", status: "200 OK", latency: "2.1s" },
                { endpoint: "Phân tích học tập định kỳ", method: "GET", status: "200 OK", latency: "0.8s" },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-2 border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.method}</Badge>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{log.endpoint}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-medium">{log.status}</span>
                    <span style={{ color: "var(--text-tertiary)" }}>{log.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Performance Status */}
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Hiệu năng hạ tầng hệ thống
            </h3>
            <div className="space-y-3">
              {[
                { metric: "CPU Usage", val: 34 },
                { metric: "RAM Usage", val: 56 },
                { metric: "Storage (Database)", val: 12 },
              ].map((perf) => (
                <div key={perf.metric} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-primary)" }}>{perf.metric}</span>
                    <span className="font-bold" style={{ color: "oklch(0.58 0.2 260)" }}>{perf.val}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${perf.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (1/3): Quick Alerts */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="rounded-2xl p-5 border space-y-4"
            style={{ background: "var(--surface-card)", borderColor: "var(--border-default)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Cảnh báo bảo mật / Tải lượng
            </h3>
            <div className="space-y-3">
              {[
                { label: "IP: 192.168.1.105 gửi quá nhiều request", type: "warning" },
                { label: "Sao lưu tự động DB hoàn thành", type: "info" },
                { label: "Độ trễ API tăng đột biến lúc 05:30", type: "error" },
              ].map((alert, i) => (
                <div key={i} className="flex gap-2 text-xs items-start">
                  <span className="mt-0.5">{alert.type === "warning" ? "⚠️" : alert.type === "error" ? "❌" : "ℹ️"}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{alert.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
