# Kiến trúc Hệ thống EStudy (Architecture Overview)

Kiến trúc phần mềm EStudy tuân thủ mô hình phân lớp chuẩn (Layered Architecture) kết hợp mô hình domain-driven nhẹ nhằm đảm bảo khả năng mở rộng lâu dài và tích hợp AI hiệu quả.

---

## 🏗️ Phân lớp Kiến trúc (Architectural Layers)

Hệ thống được thiết kế theo 4 lớp cốt lõi:

```
┌─────────────────────────────────────────────────────────┐
│               Tầng Presentation (Giao diện)              │
│       - Giao diện Giáo viên, Học sinh, Admin (Next.js)  │
│       - Các component dùng chung (shadcn/ui, Tailwind)  │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Tầng Application (Ứng dụng)              │
│       - API Routes xử lý điều hướng, phân quyền         │
│       - Điều phối tích hợp Gemini API                   │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│                Tầng Domain (Nhiệp vụ lõi)               │
│       - Định nghĩa thực thể: User, Class, Assignment... │
│       - Logic chấm điểm, thu thập câu sai               │
└────────────────────────────┬────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Tầng Infrastructure (Hạ tầng)             │
│       - Lưu trữ dữ liệu: PostgreSQL + Prisma ORM        │
│       - Xác thực: Auth.js (NextAuth)                    │
│       - Caching lớp học & câu hỏi sai để tiết kiệm token│
└─────────────────────────────────────────────────────────┘
```

### 1. Tầng Presentation
* **Công nghệ:** Next.js App Router (React 19, Tailwind CSS v4, Framer Motion).
* **Đặc điểm:** Toàn bộ giao diện hiển thị tiếng Việt, responsive cho cả điện thoại di động và máy tính, sử dụng các token màu sắc đồng bộ từ CSS Custom Properties (`index.css` / `globals.css`).

### 2. Tầng Application
* **Công nghệ:** Next.js Route Handlers.
* **Đặc điểm:** Điều phối luồng xử lý từ Client xuống Database, quản lý tích hợp Google Gemini API để tạo lời giải chi tiết và gợi ý giảng dạy.

### 3. Tầng Domain
* **Đặc điểm:** Định nghĩa rõ ràng các kiểu dữ liệu và thực thể nghiệp vụ:
  * `Assignment`: Quản lý tiêu đề bài tập, danh sách câu hỏi, thời gian làm và hạn nộp.
  * `StudentAttempt`: Ghi nhận câu trả lời thực tế, trạng thái đúng/sai và thời gian làm từng câu của học sinh.
  * `WrongQuestionItem`: Tổng hợp các lỗi sai làm cơ sở phân tích cho AI.

### 4. Tầng Infrastructure
* **Công nghệ:** PostgreSQL, Prisma ORM, Auth.js (NextAuth v5).
* **Đặc điểm:** Quản lý kết nối DB, phân quyền vai trò (Giáo viên, Học sinh).
* **Prisma Client Helper:** Triển khai cơ chế Singleton tại [prisma.ts](file:///d:/Web_BaiTap/ai-learning-platform/src/lib/prisma.ts) giúp quản lý và tái sử dụng kết nối cơ sở dữ liệu an toàn, ngăn chặn việc tạo thừa kết nối trong quá trình hot-reload khi phát triển trên môi trường Local.
* **Tổ chức thư mục Backend:** Cấu trúc theo mô hình phân lớp sạch (Clean Architecture):
  - `src/server/repositories/`: Lớp thao tác cơ sở dữ liệu trực tiếp thông qua Prisma.
  - `src/server/services/`: Lớp xử lý nghiệp vụ chính của ứng dụng.
  - `src/types/`: Các kiểu dữ liệu tùy chỉnh.
* **Tối ưu hóa chi phí AI:** Tích hợp bộ đệm cache cho lời giải câu hỏi. Các câu hỏi có cùng ID hoặc dạng tương đương đã được AI sinh lời giải sẽ được lưu lại để tái sử dụng, giúp giảm thiểu 95% chi phí gọi token API.
