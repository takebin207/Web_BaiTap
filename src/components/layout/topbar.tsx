"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/data/mock/data";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

// ============================================================
// Page title mapping
// ============================================================

const pageTitles: Record<string, string> = {
  "/dashboard/student": "Tổng quan",
  "/dashboard/student/assignments": "Bài tập của tôi",
  "/dashboard/student/results": "Kết quả",
  "/dashboard/student/wrong-questions": "Ôn tập câu sai",
  "/dashboard/student/practice": "Luyện tập",
  "/dashboard/student/analytics": "Phân tích học tập",
  "/dashboard/tutor": "Tổng quan",
  "/dashboard/tutor/classes": "Lớp học",
  "/dashboard/tutor/assignments": "Bài tập",
  "/dashboard/tutor/results": "Kết quả",
  "/dashboard/tutor/wrong-questions": "Câu hỏi sai",
  "/dashboard/tutor/question-bank": "Ngân hàng câu hỏi",
  "/dashboard/tutor/ai-review": "Trợ lý AI",
  "/dashboard/tutor/import": "Nhập đề",
  "/dashboard/tutor/settings": "Cài đặt",
  "/dashboard/admin": "Tổng quan Admin",
  "/dashboard/admin/questions": "Quản lý câu hỏi",
  "/dashboard/admin/settings": "Cài đặt",
};

// ============================================================
// Topbar Component
// ============================================================

interface TopbarProps {
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export function Topbar({ onMenuClick, isMobileMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const getTitle = () => {
    if (pathname.startsWith("/dashboard/student/practice/")) {
      return "Chi tiết Luyện tập";
    }
    return pageTitles[pathname] || "Tổng quan";
  };
  const pageTitle = getTitle();

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      {/* Left: Mobile menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors lg:hidden"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div>
          <h1
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search + Notifications */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200",
            searchFocused ? "w-64" : "w-48"
          )}
          style={{
            background: "var(--surface-subtle)",
            border: searchFocused ? "1px solid var(--border-focus)" : "1px solid transparent",
          }}
        >
          <Search className="h-4 w-4 shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            style={{ color: "var(--text-primary)" }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd
            className="hidden sm:inline-flex h-5 items-center rounded px-1.5 text-[10px] font-medium"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-tertiary)",
              border: "1px solid var(--border-default)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title="Thay đổi giao diện (Sáng/Tối/Hệ thống)"
        >
          {!mounted ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : theme === "dark" ? (
            <Moon className="h-[18px] w-[18px]" />
          ) : theme === "system" ? (
            <Monitor className="h-[18px] w-[18px]" />
          ) : (
            <Sun className="h-[18px] w-[18px]" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white gradient-bg">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-xl)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: "1px solid var(--border-default)" }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Thông báo
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} mới
                  </Badge>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex gap-3 px-4 py-3 transition-colors cursor-pointer"
                      style={{
                        background: notif.read ? "transparent" : "oklch(0.58 0.2 260 / 0.03)",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = notif.read ? "transparent" : "oklch(0.58 0.2 260 / 0.03)")}
                    >
                      <div
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                        style={{
                          background:
                            notif.type === "assignment"
                              ? "oklch(0.58 0.2 260 / 0.1)"
                              : notif.type === "warning"
                              ? "oklch(0.8 0.15 80 / 0.1)"
                              : notif.type === "success"
                              ? "oklch(0.72 0.17 155 / 0.1)"
                              : "oklch(0.7 0.15 240 / 0.1)",
                        }}
                      >
                        {notif.type === "assignment"
                          ? "📝"
                          : notif.type === "warning"
                          ? "⚠️"
                          : notif.type === "success"
                          ? "✅"
                          : "💡"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {notif.title}
                        </p>
                        <p
                          className="text-xs mt-0.5 line-clamp-2"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <div
                          className="mt-2 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: "oklch(0.58 0.2 260)" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div
                  className="px-4 py-2.5 text-center"
                  style={{ borderTop: "1px solid var(--border-default)" }}
                >
                  <button
                    className="text-xs font-medium"
                    style={{ color: "oklch(0.58 0.2 260)" }}
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
