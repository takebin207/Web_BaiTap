"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardList,
  Database,
  Users,
  Upload,
  ChevronLeft,
  LogOut,
  Repeat,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { currentStudent, currentTutor, type User } from "@/data/mock/data";

// ============================================================
// Navigation Items — EStudy
// ============================================================

const tutorNavItems = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard/tutor" },
  { label: "Lớp học", icon: Users, href: "/dashboard/tutor/classes" },
  { label: "Bài tập", icon: ClipboardList, href: "/dashboard/tutor/assignments" },
  { label: "Kết quả", icon: CheckSquare, href: "/dashboard/tutor/results" },
  { label: "Câu hỏi sai", icon: AlertTriangle, href: "/dashboard/tutor/wrong-questions" },
  { label: "Ngân hàng câu hỏi", icon: Database, href: "/dashboard/tutor/question-bank" },
  { label: "Trợ lý AI", icon: Sparkles, href: "/dashboard/tutor/ai-review" },
  { label: "Nhập đề", icon: Upload, href: "/dashboard/tutor/import" },
  { label: "Cài đặt", icon: Settings, href: "/dashboard/tutor/settings" },
];

const studentNavItems = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard/student" },
  { label: "Bài tập", icon: ClipboardList, href: "/dashboard/student/assignments" },
  { label: "Kết quả", icon: CheckSquare, href: "/dashboard/student/results" },
  { label: "Ôn tập câu sai", icon: AlertTriangle, href: "/dashboard/student/wrong-questions" },
];

const adminNavItems = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard/admin" },
  { label: "Quản lý câu hỏi", icon: Database, href: "/dashboard/admin/questions" },
  { label: "Cài đặt", icon: Settings, href: "/dashboard/admin/settings" },
];

// ============================================================
// Sidebar Component
// ============================================================

interface SidebarProps {
  role: "student" | "tutor" | "admin";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function Sidebar({ role, collapsed = false, onToggleCollapse, className }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "student" ? studentNavItems : role === "tutor" ? tutorNavItems : adminNavItems;
  const user: User = role === "student" ? currentStudent : role === "tutor" ? currentTutor : { id: "admin-001", name: "Quản trị viên", email: "admin@gmail.com", role: "admin" };
  const otherRole = role === "student" ? "tutor" : role === "tutor" ? "student" : "tutor";
  const otherRoleLabel = role === "student" ? "Giáo viên" : role === "tutor" ? "Học sinh" : "Giáo viên";

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[260px]",
        className
      )}
      style={{
        background: "var(--bg-primary)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center justify-between px-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-bg">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold whitespace-nowrap overflow-hidden"
                style={{ color: "var(--text-primary)" }}
              >
                E<span className="gradient-text">Study</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:opacity-80"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  collapsed && "justify-center px-2"
                )}
                style={{
                  background: active ? "oklch(0.58 0.2 260 / 0.08)" : "transparent",
                  color: active ? "oklch(0.58 0.2 260)" : "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "var(--surface-subtle)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <item.icon
                  className={cn("h-[18px] w-[18px] shrink-0", active && "stroke-[2.5]")}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 h-6 w-[3px] rounded-r-full"
                    style={{ background: "oklch(0.58 0.2 260)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        className="shrink-0 px-3 py-3 space-y-2"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        {/* Role switcher */}
        <Link href={`/dashboard/${otherRole}`}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium cursor-pointer transition-colors",
              collapsed && "justify-center px-2"
            )}
            style={{ color: "var(--text-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-subtle)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Repeat className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Chuyển sang {otherRoleLabel}</span>}
          </div>
        </Link>

        {/* User info */}
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5",
            collapsed && "justify-center px-2"
          )}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white gradient-bg"
          >
            {getInitials(user.name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {user.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-tertiary)" }}
              >
                {role === "student"
                  ? `Lớp ${user.grade} • ${user.school}`
                  : role === "tutor"
                  ? "Giáo viên"
                  : "Quản trị viên"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              className="shrink-0 rounded-md p-1.5 transition-colors hover:opacity-80"
              style={{ color: "var(--text-tertiary)" }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
