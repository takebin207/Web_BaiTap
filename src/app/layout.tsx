import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EStudy - Giao bài tập & Phân tích câu sai bằng AI",
  description:
    "EStudy là nền tảng giao bài tập và ôn tập câu hỏi sai thông minh dành cho gia sư và giáo viên. Theo dõi học tập, chấm điểm tự động và nhận phân tích bài học tiếp theo từ AI.",
  keywords: [
    "EStudy",
    "giao bài tập",
    "phân tích câu sai",
    "gia sư",
    "giáo viên",
    "toán",
    "vật lý",
    "hóa học",
    "AI review",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

