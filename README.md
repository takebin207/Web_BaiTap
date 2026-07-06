# EStudy - Giao bài tập & Phân tích câu sai bằng AI

Hệ thống giao bài tập trực tuyến và phân tích lỗi sai thông minh hỗ trợ bởi trí tuệ nhân tạo (AI), được thiết kế dành riêng cho **giáo viên và gia sư**.

Dự án được xây dựng bằng **Next.js 15**, **React 19**, **Tailwind CSS v4**, và **shadcn/ui**.

---

## 🎯 Định vị & Giá trị Cốt lõi (Core Value)

> **"Biết học sinh sai gì — Biết cần dạy gì buổi sau."**

EStudy không phải là một LMS cồng kềnh hay một công cụ AI chat thông thường. Nền tảng tập trung tối ưu hóa **luồng nghiệp vụ ôn tập câu sai** của giáo viên:

1. **Giao bài tập:** Tạo đề trắc nghiệm nhanh từ ngân hàng đề hoặc nhập tay.
2. **Học sinh làm bài:** Trả lời trực tuyến có lưu tự động và đếm thời gian.
3. **Chấm điểm tự động:** Chấm điểm trắc nghiệm khách quan tức thì sau khi nộp.
4. **Phân tích câu sai:** Ghi nhận tỉ lệ sai, câu bị bỏ qua, câu tốn nhiều thời gian và học sinh làm sai.
5. **Gợi ý giảng dạy từ AI:** Trợ lý ảo AI phân tích và đề xuất checklist giáo án ôn tập cho buổi tiếp theo.

---

## 🚀 Tính năng chính (Sprint 1 - UI Prototype)

* **👨‍🏫 Dành cho Giáo viên:**
  * **Tổng quan:** Quản lý nhanh lớp học, bài tập đang diễn ra, học sinh chưa nộp bài, top câu hỏi học sinh sai nhiều nhất và thẻ gợi ý ôn tập từ AI.
  * **Bài tập:** Quản lý bài tập theo trạng thái và thời gian.
  * **Trình tạo bài tập:** Tạo bài tập mới, chọn từ ngân hàng câu hỏi, cấu hình thời gian và chế độ xem đáp án.
  * **Phân tích câu sai:** Bảng phân tích câu sai theo học sinh, câu bị bỏ qua (skip), câu tốn thời gian suy nghĩ của học sinh và gợi ý ôn tập chi tiết.
  * **Ngân hàng câu hỏi:** Bộ lưu trữ câu hỏi phân loại theo môn học, chương học và trạng thái duyệt (`READY`, `DRAFT`, `NEEDS_REVIEW`, `ERROR`).
  * **Trợ lý AI:** Sinh 3 câu hỏi tương đương, xem giải thích đáp án sai nâng cao từ AI.
  * **Nhập đề thi (Import):** Mô phỏng tải đề PDF/Word/Ảnh để AI OCR bóc tách câu hỏi.

* **🧑‍🎓 Dành cho Học sinh:**
  * **Tổng quan:** Xem số bài chưa hoàn thành, lịch sử điểm số, thống kê câu hỏi sai tích lũy và gợi ý học tập từ AI.
  * **Làm bài trực tuyến:** Làm bài trắc nghiệm tương tác với bộ đếm ngược, bản đồ câu hỏi và chỉ báo lưu tự động.
  * **Kết quả:** Điểm số đạt được, thống kê đúng/sai/skip, thời gian làm và lời giải thích chi tiết từ giáo viên/AI.
  * **Ôn câu sai:** Kho tự động lưu các câu làm sai để làm lại hoặc xem AI hướng dẫn.

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

* **Framework:** Next.js 15.2 (App Router)
* **Library:** React 19
* **Styling:** Tailwind CSS v4 (CSS-first configuration)
* **Component Library:** shadcn/ui
* **Animation:** Framer Motion
* **Icons:** Lucide React

---

## 📂 Cấu trúc thư mục chính (Folder Structure)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── admin/       # Giao diện admin (đã tinh giản)
│   │   ├── student/     # Giao diện học sinh (Overview, Assignments, Result, Wrong Questions)
│   │   ├── tutor/       # Giao diện giáo viên (Overview, Assignments, Wrong Questions, Question Bank, AI Review, Import)
│   │   └── layout.tsx   # Layout đa vai trò tích hợp Sidebar & Topbar
│   ├── globals.css      # Cấu hình Design System & Chế độ tối
│   └── layout.tsx       # Cấu hình font Inter & Providers toàn cục
├── components/
│   ├── layout/          # Sidebar & Topbar components (EStudy branding)
│   └── ui/              # Base UI components từ shadcn/ui
├── data/
│   └── mock/
│       └── data.ts      # Toàn bộ cơ sở dữ liệu giả lập chuẩn EStudy
├── docs/
│   ├── product-direction.md # Định hướng sản phẩm chi tiết
│   ├── architecture.md      # Tài liệu kiến trúc 4 lớp của hệ thống
│   └── project-status.md    # Báo cáo trạng thái dự án
└── lib/
    └── utils.ts         # Các hàm helper định dạng và xử lý giao diện
```

---

## 💻 Hướng dẫn Chạy local (Getting Started)

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Khởi chạy máy chủ phát triển (Development Server):
   ```bash
   npm run dev
   ```

3. Mở trình duyệt truy cập:
   * Trang chủ: [http://localhost:3000](http://localhost:3000)
   * Trang giáo viên: [http://localhost:3000/dashboard/tutor](http://localhost:3000/dashboard/tutor)
   * Trang học sinh: [http://localhost:3000/dashboard/student](http://localhost:3000/dashboard/student)
