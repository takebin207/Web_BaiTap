"use client";

import { motion } from "framer-motion";
import {
  Brain,
  BookOpen,
  BarChart3,
  Upload,
  Sparkles,
  Users,
  GraduationCap,
  Shield,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ============================================================
// Animation Variants
// ============================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

// ============================================================
// Features Data
// ============================================================

const features = [
  {
    icon: Brain,
    title: "AI Giải thích thông minh",
    description:
      "Nhận lời giải chi tiết từ AI cho mọi câu hỏi. Hiểu sâu, nhớ lâu với phương pháp giải thích cá nhân hóa.",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: BookOpen,
    title: "Ngân hàng câu hỏi",
    description:
      "Hàng nghìn câu hỏi Toán, Lý, Hóa được phân loại theo chương, mức độ, và dạng bài. Cập nhật liên tục.",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: BarChart3,
    title: "Phân tích học tập",
    description:
      "Theo dõi tiến độ, xác định điểm yếu, và nhận gợi ý ôn tập từ AI. Biểu đồ trực quan, dễ hiểu.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: Upload,
    title: "Nhập đề từ PDF",
    description:
      "Upload file PDF, AI tự động trích xuất câu hỏi, đáp án và lời giải. Tiết kiệm hàng giờ nhập liệu.",
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Target,
    title: "Luyện tập cá nhân hóa",
    description:
      "AI phân tích điểm yếu và tạo bộ đề riêng cho bạn. Tập trung vào những gì cần cải thiện nhất.",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: Users,
    title: "Quản lý lớp học",
    description:
      "Giáo viên tạo lớp, giao bài, theo dõi tiến độ học sinh. Học sinh nộp bài và nhận phản hồi ngay.",
    color: "from-indigo-500 to-blue-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
];

const stats = [
  { value: "10,000+", label: "Câu hỏi", icon: BookOpen },
  { value: "2,500+", label: "Học sinh", icon: GraduationCap },
  { value: "150+", label: "Giáo viên", icon: Users },
  { value: "98%", label: "Hài lòng", icon: Star },
];

const testimonials = [
  {
    name: "Nguyễn Thị Lan",
    role: "Học sinh lớp 12 - THPT Chu Văn An",
    content:
      "Từ khi sử dụng EduAI, điểm Toán của em tăng từ 6.5 lên 8.5. Tính năng AI giải thích giúp em hiểu rõ từng bước giải.",
    avatar: "NL",
    rating: 5,
  },
  {
    name: "Thầy Phạm Văn Đức",
    role: "Giáo viên Vật lý - THPT Nguyễn Huệ",
    content:
      "Tính năng nhập đề từ PDF giúp tôi tiết kiệm rất nhiều thời gian. Thay vì mất cả ngày nhập liệu, giờ chỉ cần vài phút.",
    avatar: "PĐ",
    rating: 5,
  },
  {
    name: "Trần Minh Khoa",
    role: "Học sinh lớp 11 - THPT Lê Hồng Phong",
    content:
      "Em thích nhất tính năng gợi ý ôn tập. AI biết em yếu chỗ nào và cho bài tập phù hợp. Rất tiện lợi!",
    avatar: "MK",
    rating: 5,
  },
];

// ============================================================
// Landing Page Component
// ============================================================

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* ============ Navbar ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Edu<span className="gradient-text">AI</span>
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#features"
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                Tính năng
              </a>
              <a
                href="#stats"
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                Thống kê
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--text-secondary)' }}
              >
                Đánh giá
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard/student">
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/dashboard/student">
                <Button className="gradient-bg border-0 text-white text-sm font-semibold px-5 rounded-xl shadow-md hover:opacity-90 transition-opacity">
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============ Hero Section ============ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
            style={{ background: 'oklch(0.58 0.2 260)' }}
          />
          <div
            className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
            style={{ background: 'oklch(0.65 0.22 300)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-5 blur-3xl"
            style={{ background: 'oklch(0.7 0.18 340)' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-6 inline-flex">
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Sparkles className="h-4 w-4" style={{ color: 'oklch(0.58 0.2 260)' }} />
                Powered by AI
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Học thông minh hơn với{" "}
              <span className="gradient-text">Trí tuệ nhân tạo</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Nền tảng luyện thi THPT Quốc gia được hỗ trợ bởi AI. Luyện tập
              cá nhân hóa, giải thích chi tiết, và phân tích điểm yếu — tất cả
              trong một.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/dashboard/student">
                <Button
                  size="lg"
                  className="gradient-bg border-0 text-white h-12 px-8 text-base font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all hover:shadow-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Bắt đầu luyện tập
                </Button>
              </Link>
              <Link href="/dashboard/tutor">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold rounded-xl transition-all"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Dành cho giáo viên
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center justify-center gap-6 text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" style={{ color: 'oklch(0.72 0.17 155)' }} />
                Miễn phí
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" style={{ color: 'oklch(0.72 0.17 155)' }} />
                Không cần thẻ tín dụng
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" style={{ color: 'oklch(0.72 0.17 155)' }} />
                10,000+ câu hỏi
              </span>
            </motion.div>
          </motion.div>

          {/* Hero Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
            className="mx-auto mt-16 max-w-5xl"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-default)',
              }}
            >
              {/* Fake dashboard preview */}
              <div
                className="aspect-[16/9] p-6 sm:p-8"
                style={{ background: 'var(--bg-secondary)' }}
              >
                {/* Topbar */}
                <div
                  className="mb-6 flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background: 'var(--surface-card)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg gradient-bg" />
                    <div
                      className="h-3 w-24 rounded-full"
                      style={{ background: 'var(--border-default)' }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="h-8 w-20 rounded-lg"
                      style={{ background: 'var(--surface-subtle)' }}
                    />
                    <div
                      className="h-8 w-8 rounded-full"
                      style={{ background: 'var(--surface-subtle)' }}
                    />
                  </div>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {[
                    { label: "Câu hỏi hôm nay", value: "32/50", color: "oklch(0.58 0.2 260)" },
                    { label: "Chuỗi ngày", value: "7 🔥", color: "oklch(0.8 0.15 80)" },
                    { label: "Độ chính xác", value: "78%", color: "oklch(0.72 0.17 155)" },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="rounded-xl p-4 sm:p-5"
                      style={{
                        background: 'var(--surface-card)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {card.label}
                      </p>
                      <p
                        className="mt-1 text-xl sm:text-2xl font-bold"
                        style={{ color: card.color }}
                      >
                        {card.value}
                      </p>
                      <div
                        className="mt-2 h-1.5 w-full rounded-full overflow-hidden"
                        style={{ background: 'var(--surface-subtle)' }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${60 + i * 15}%` }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: card.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div
                  className="mt-4 sm:mt-6 rounded-xl p-4 sm:p-5"
                  style={{
                    background: 'var(--surface-card)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div className="flex items-end gap-2 sm:gap-3 h-20 sm:h-28">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 1.4 + i * 0.08, duration: 0.5 }}
                        className="flex-1 rounded-t-md"
                        style={{
                          background: `oklch(0.58 0.2 260 / ${0.3 + (h / 100) * 0.7})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Gradient overlay at bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-20"
                style={{
                  background: `linear-gradient(to top, var(--bg-primary), transparent)`,
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ Stats Section ============ */}
      <section id="stats" className="py-16 sm:py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                className="text-center"
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: 'oklch(0.58 0.2 260 / 0.1)' }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: 'oklch(0.58 0.2 260)' }} />
                </div>
                <p
                  className="text-3xl font-extrabold tracking-tight sm:text-4xl"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ Features Section ============ */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'oklch(0.58 0.2 260)' }}
            >
              Tính năng nổi bật
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Mọi thứ bạn cần để{" "}
              <span className="gradient-text">đạt điểm cao</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-4 max-w-2xl text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Từ luyện đề đến phân tích điểm yếu, EduAI cung cấp đầy đủ công cụ
              giúp bạn chuẩn bị tốt nhất cho kỳ thi THPT Quốc gia.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-6 transition-all cursor-pointer"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--border-focus)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-default)';
                }}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color}`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ How it works ============ */}
      <section className="py-20 sm:py-28" style={{ background: 'var(--bg-secondary)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'oklch(0.58 0.2 260)' }}
            >
              Cách hoạt động
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Bắt đầu trong 3 bước đơn giản
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {[
              {
                step: "01",
                title: "Đăng ký tài khoản",
                description:
                  "Tạo tài khoản miễn phí chỉ trong 30 giây. Chọn lớp và các môn học bạn muốn ôn tập.",
                icon: Shield,
              },
              {
                step: "02",
                title: "Bắt đầu luyện tập",
                description:
                  "Chọn môn, chương, mức độ khó. AI sẽ tạo bộ đề phù hợp với trình độ của bạn.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Theo dõi tiến bộ",
                description:
                  "Xem biểu đồ tiến độ, nhận gợi ý ôn tập, và cải thiện điểm yếu với sự hỗ trợ của AI.",
                icon: TrendingUp,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="relative text-center"
              >
                <div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: 'oklch(0.58 0.2 260 / 0.1)',
                  }}
                >
                  <item.icon className="h-8 w-8" style={{ color: 'oklch(0.58 0.2 260)' }} />
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'oklch(0.58 0.2 260)' }}
                >
                  Bước {item.step}
                </span>
                <h3
                  className="mt-2 text-xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.description}
                </p>

                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8">
                    <ArrowRight
                      className="h-5 w-5"
                      style={{ color: 'var(--border-strong)' }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      <section id="testimonials" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'oklch(0.58 0.2 260)' }}
            >
              Đánh giá
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Học sinh & giáo viên nói gì?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mt-16 grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-6 transition-all"
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white gradient-bg"
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA Section ============ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-3xl gradient-bg px-8 py-16 text-center sm:px-16"
          >
            {/* Decorative circles */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />

            <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sẵn sàng đạt điểm cao?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base text-white/80">
              Tham gia cùng hàng nghìn học sinh đang sử dụng EduAI để chuẩn bị
              cho kỳ thi THPT Quốc gia.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard/student">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold rounded-xl shadow-lg transition-all hover:shadow-xl"
                  style={{
                    background: 'white',
                    color: 'oklch(0.58 0.2 260)',
                  }}
                >
                  Bắt đầu miễn phí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer
        className="py-12"
        style={{
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-default)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Brain className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Edu<span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              © 2025 EduAI. Nền tảng học tập thông minh cho học sinh Việt Nam.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
