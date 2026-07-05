# Nhật ký Thay đổi (Changelog): AI Learning Platform

Toàn bộ các thay đổi lớn của dự án sẽ được ghi nhận tại tài liệu này.

---

## [0.1.0] - 2026-07-06
### Added
- **Landing Page (`/`):** Giao diện giới thiệu sản phẩm cao cấp, bảng thống kê và khối kêu gọi hành động (CTA).
- **Student Flow (`/dashboard/student`):**
  - Giao diện Tổng quan (Dashboard) hiển thị streak, biểu đồ tiến độ học tập và gợi ý từ AI.
  * Danh sách luyện tập (`/dashboard/student/practice`) với bộ lọc tìm kiếm và phân loại độ khó.
  * Chi tiết câu hỏi và làm bài tương tác (`/dashboard/student/practice/[id]`).
  * Tích hợp giải thích AI và gợi ý câu hỏi tương tự cùng môn học dạng mock.
  * Giao diện phân tích tiến độ học tập (`/dashboard/student/analytics`).
- **Tutor Flow (`/dashboard/tutor`):**
  * Giao diện Tổng quan thống kê bài tập, sĩ số lớp học và tiến trình nộp bài.
  * Danh sách lớp học và hiển thị mã mời (`/dashboard/tutor/classes`).
  * Danh sách giao bài tập và giao bài mới bằng AI giả lập (`/dashboard/tutor/assignments`).
  * Giao diện phân tích kết quả lớp học (`/dashboard/tutor/analytics`).
- **Admin Flow (`/dashboard/admin`):**
  * Giao diện Tổng quan giám sát CPU/RAM, API latencies logs.
  * Giao diện quản lý ngân hàng câu hỏi (`/dashboard/admin/questions`).
  * Cấu hình tham số AI Prompts và LLM Models (`/dashboard/admin/ai-config`).
- **Layout & Navigation:** Sidebar đa vai trò (Student, Tutor, Admin) co giãn, Topbar tiêu đề động đồng bộ URL và hộp thoại thông báo giả lập.
- **Mock Data (`src/lib/mock-data.ts`):** Kho dữ liệu giả lập tiếng Việt hoàn chỉnh cho Toán, Lý, Hóa THPT.
- **Documentation:** Thêm `docs/project-status.md`, `ROADMAP.md`, và `.env.example`.

### Fixed
- Sửa lỗi React Purity (`react-hooks/purity`) liên quan đến hàm `Math.random()` tại trang chi tiết môn học của học sinh.
- Dọn dẹp toàn bộ 31 cảnh báo import dư thừa trên ESLint.
