"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AlertCircle, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Determine role from pathname
  const role: "student" | "tutor" | "admin" = pathname.includes("/dashboard/tutor")
    ? "tutor"
    : pathname.includes("/dashboard/admin")
    ? "admin"
    : "student";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "var(--bg-overlay)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar role={role} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          isMobileMenuOpen={mobileMenuOpen}
        />
        <main className="flex-1 overflow-y-auto">
          {showBanner && (
            <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
              <div className="rounded-xl p-3 flex items-start sm:items-center justify-between text-[11px] sm:text-xs font-medium border border-indigo-100 bg-indigo-50/45 text-indigo-800 shadow-sm gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Bản thử nghiệm (Prototype):</strong> Giao diện hoạt động hoàn toàn bằng dữ liệu giả lập. Database và AI Engine thực tế sẽ được tích hợp ở chặng sau.
                  </span>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-500 hover:text-indigo-700 cursor-pointer shrink-0"
                  aria-label="Đóng thông báo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
