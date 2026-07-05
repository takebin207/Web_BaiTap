# AI Learning Platform - Nền tảng Học tập Thông minh

Nền tảng học tập thông minh hỗ trợ bởi trí tuệ nhân tạo dành cho học sinh và giáo viên THPT tại Việt Nam. Dự án được phát triển bằng Next.js 15, React 19, Tailwind CSS v4, và shadcn/ui.

---

## 🚀 Tính năng nổi bật (Sprint 1 - UI Prototype)

* **🧑‍🎓 Dành cho Học sinh:**
  * Bảng điều khiển học tập cá nhân hóa (Chuỗi ngày học 🔥, Câu hỏi trong ngày, Tỷ lệ chính xác).
  * Luyện tập trắc nghiệm tương tác theo môn học (Toán, Lý, Hóa) và bộ lọc độ khó.
  * Hộp thoại giải thích chi tiết từng bước giải bằng AI và danh sách câu hỏi tương đương cùng chủ đề.
  * Trang phân tích chi tiết lỗ hổng kiến thức và lời khuyên ôn tập từ AI.
* **👨‍🏫 Dành cho Giáo viên:**
  * Tổng quan lớp học, điểm trung bình và bài nộp cần chấm điểm.
  * Quản lý lớp học, chia sẻ mã mời (Invite Code) gia nhập lớp.
  * Xem danh sách bài tập đã giao và mô phỏng giao bài tự động bằng AI.
  * Biểu đồ cột phân tích lượng bài nộp trong tuần của học sinh.
* **🛡️ Dành cho Quản trị viên:**
  * Giám sát tài nguyên hệ thống (CPU, RAM, API request, Latency).
  * Quản lý ngân hàng câu hỏi (Xem, Sửa, Xóa).
  * Tinh chỉnh cấu hình AI (LLM Model, Temperature, System Prompt).

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

* **Framework:** Next.js 15.2 (App Router)
* **Library:** React 19
* **Styling:** Tailwind CSS v4 (CSS-first configuration)
* **Component Library:** shadcn/ui (Base-nova style)
* **Animation:** Framer Motion (Staggered layout animations)
* **Icons:** Lucide React

---

## 📂 Cấu trúc thư mục chính (Folder Structure)

```
src/
├── app/
│   ├── dashboard/
│   │   ├── admin/       # Trang quản trị viên (Overview, Questions, AI Config)
│   │   ├── student/     # Trang học sinh (Overview, Practice, Analytics)
│   │   ├── tutor/       # Trang giáo viên (Overview, Classes, Assignments, Analytics)
│   │   └── layout.tsx   # Layout đa vai trò tích hợp Sidebar & Topbar
│   ├── globals.css      # Cấu hình Design System & Chế độ tối
│   └── layout.tsx       # Cấu hình font Inter & Providers toàn cục
├── components/
│   ├── layout/          # Sidebar & Topbar components
│   └── ui/              # Base UI components từ shadcn/ui
├── docs/
│   └── project-status.md # Báo cáo trạng thái dự án chi tiết
└── lib/
    ├── mock-data.ts     # Cơ sở dữ liệu giả lập tiếng Việt
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
   * Trang học sinh: [http://localhost:3000/dashboard/student](http://localhost:3000/dashboard/student)
   * Trang giáo viên: [http://localhost:3000/dashboard/tutor](http://localhost:3000/dashboard/tutor)
   * Trang admin: [http://localhost:3000/dashboard/admin](http://localhost:3000/dashboard/admin)

4. Chạy kiểm tra tĩnh và build sản phẩm:
   ```bash
   npm run lint
   npm run build
   ```
