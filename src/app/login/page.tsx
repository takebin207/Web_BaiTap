"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoAccounts = [
  {
    name: "Thầy Nguyễn Văn Nam",
    email: "nam.teacher@estudy.vn",
    role: "Tutor",
    roleLabel: "Giáo viên",
    bgColor: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    name: "Em Nguyễn Hải An",
    email: "an.nguyen@estudy.vn",
    role: "Student",
    roleLabel: "Học sinh",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    name: "Em Trần Quốc Bình",
    email: "binh.tran@estudy.vn",
    role: "Student",
    roleLabel: "Học sinh",
    bgColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Tài khoản hoặc mật khẩu không chính xác.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: demoEmail,
        password: "password",
        redirect: false,
      });

      if (res?.error) {
        setError("Không thể đăng nhập nhanh.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Đã xảy ra lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: "var(--bg-secondary)" }}>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Top Header Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg shadow-lg shadow-indigo-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-3" style={{ color: "var(--text-primary)" }}>
            Chào mừng bạn đến với <span className="gradient-text">EStudy</span>
          </h2>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            Nền tảng giao bài tập Toán 10 và Phân tích câu sai thông minh
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs text-left"
          >
            {error}
          </motion.div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
          <div className="space-y-1.5">
            <label className="font-semibold block" style={{ color: "var(--text-secondary)" }}>
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="email"
                required
                placeholder="ten@estudy.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-sm transition-all focus:border-indigo-500 outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold block" style={{ color: "var(--text-secondary)" }}>
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4.5 w-4.5" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] text-sm transition-all focus:border-indigo-500 outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 text-xs border-none flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập vào hệ thống"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-[var(--border-subtle)]" />
          <span className="flex-shrink mx-4 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            ĐĂNG NHẬP NHANH BẢN DEMO
          </span>
          <div className="flex-grow border-t border-[var(--border-subtle)]" />
        </div>

        {/* Quick Demo Logins */}
        <div className="space-y-2.5 text-left">
          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            Bấm chọn tài khoản dưới đây để đăng nhập nhanh với vai trò tương ứng:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc.email)}
                disabled={loading}
                className={`p-3 rounded-xl border text-xs text-left transition-all hover:shadow-sm cursor-pointer flex justify-between items-center ${acc.bgColor}`}
              >
                <div>
                  <p className="font-bold">{acc.name}</p>
                  <p className="opacity-80 text-[10px]">{acc.email}</p>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold border border-current">
                  {acc.roleLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
