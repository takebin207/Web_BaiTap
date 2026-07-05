import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduAI - Nền tảng học tập thông minh",
  description:
    "Nền tảng học tập AI dành cho học sinh THPT Việt Nam. Luyện thi, ôn tập, và nâng cao kiến thức với sự hỗ trợ của trí tuệ nhân tạo.",
  keywords: [
    "học tập",
    "AI",
    "THPT",
    "luyện thi",
    "toán",
    "vật lý",
    "hóa học",
    "Việt Nam",
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
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
