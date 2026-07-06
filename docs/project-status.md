# Báo cáo Trạng thái Dự án: EStudy Prototype (Toán 10)

Tài liệu này cung cấp thông tin chi tiết về hiện trạng phát triển của bản thử nghiệm giao diện cao cấp (high-fidelity prototype) dành cho hệ thống **EStudy** — Nền tảng giao bài tập và phân tích câu hỏi làm sai hỗ trợ bởi AI, tập trung vào **Toán lớp 10 chương trình GDPT 2018**.

---

## 1. Trạng thái Dự án hiện tại

Bản mẫu hiện tại là một ứng dụng **Next.js 15** sử dụng **React 19**, **Tailwind CSS v4**, **Framer Motion**, và **shadcn/ui**. Dự án được xây dựng hoàn chỉnh dưới dạng tĩnh (static mock-up) chạy trực tiếp trên Localhost.

* **Build & Compile:** Đã vượt qua kiểm tra TypeScript và `next build` thành công.
* **Linting:** Kết quả `eslint` hoàn toàn sạch lỗi.
* **Tập trung học liệu:** Toàn bộ dữ liệu giả lập được cấu trúc hóa theo chương trình **Toán 10 GDPT 2018**.

---

## 2. Các phân hệ đã triển khai (Implemented Features)

### 👨‍🏫 Giáo viên (Tutor Features)
* **Tổng quan Giáo viên (`/dashboard/tutor`):** Dashboard hiển thị lớp học, số học sinh, danh sách bài tập Toán 10 đang diễn ra, danh sách học sinh chưa nộp bài, các bài nộp gần đây, top câu hỏi học sinh sai nhiều nhất và gợi ý giáo án buổi sau từ AI.
* **Wrong Question Review (`/dashboard/tutor/wrong-questions`):** Báo cáo phân tích câu sai theo từng chương/chủ đề Toán 10 (Hàm số bậc hai, Vectơ...), hiển thị học sinh làm sai, câu bị bỏ qua, câu làm chậm và đề xuất giáo án ôn tập chi tiết.
* **Assignment Builder (`/dashboard/tutor/assignments/create`):** Trình giao bài tập Toán 10 mới, cho phép chọn câu từ ngân hàng, thêm thủ công hoặc **tự động phân bổ sinh đề theo ma trận độ nhận thức & chương kiến thức**.
* **Question Bank (`/dashboard/tutor/question-bank`):** Quản lý câu hỏi Toán 10 có bộ lọc nâng cao (Chương, Chủ đề, Nhận thức, Độ khó, Loại câu hỏi, Trạng thái), tích hợp hai trình nhập liệu mockup:
  * **Manual Entry Form:** Form điền đầy đủ thuộc tính của câu hỏi Toán 10 (LaTeX, Chương, Chủ đề, Đáp án...).
  * **Bulk Paste Import (`/dashboard/tutor/import/bulk-paste`):** Trình nhập nhanh hàng loạt từ văn bản thô với bộ phân tích cú pháp regex phía máy khách (Client-side Parser). Hỗ trợ tự động phân tích câu hỏi/đáp án/lời giải, hiển thị cảnh báo lỗi (Warnings), cho phép rà soát duyệt hoặc bỏ qua, chỉnh sửa trực tiếp, và đồng bộ hóa qua `localStorage` vào Ngân hàng câu hỏi.
* **Import Center (`/dashboard/tutor/import`):** Mô phỏng nạp đề thi & đáp án từ PDF/Word Toán 10, hiển thị tiến trình bóc tách và khớp đáp án tự động từ AI, đồng thời tích hợp lối tắt truy cập nhanh vào trình Nhập thô bằng Copy-Paste.

### 🧑‍🎓 Học sinh (Student Features)
* **Overview & Assignments:** Hiển thị bài tập Toán 10 cần làm, lịch sử điểm số và khuyên học tập từ AI.
* **Practice UI (`/dashboard/student/assignments/[id]`):** Làm bài trắc nghiệm/điền từ ngắn trực tuyến có bộ đếm thời gian và tự động lưu.
* **Result & Review (`/dashboard/student/assignments/[id]/result`):** Báo cáo điểm số chi tiết, so sánh đáp án đúng/sai, thời gian làm từng câu và xem giải thích lời giải chi tiết từ giáo viên/AI.
* **Wrong Questions Pocket (`/dashboard/student/wrong-questions`):** Tự động gom câu học sinh làm sai Toán 10, cho phép bấm "Luyện câu tương tự" và xem giải thích chi tiết.

---

## 3. Các tính năng chưa triển khai ở Giai đoạn 1

* **Database (PostgreSQL / Prisma):** Chưa kết nối cơ sở dữ liệu thực tế.
* **Gemini API:** Chưa gọi API thực tế để giải thích câu hỏi hoặc sinh câu hỏi tương tự.
* **OCR PDF/Word:** Chưa tích hợp Vision API hoặc Document AI để đọc tệp tải lên thực tế.
* **Authentication:** Đăng nhập vẫn là giả lập chuyển vai trò.

---

## 4. Kế hoạch hành động cho Giai đoạn 2

1. Thiết lập **Prisma ORM** và kết nối tới cơ sở dữ liệu **PostgreSQL**.
2. Thiết kế lược đồ (Schema) cho lớp học, bài tập, câu hỏi Toán 10 và các lượt nộp bài.
3. Cài đặt **Auth.js (NextAuth v5)** phân quyền Giáo viên và Học sinh.
4. Triển khai API lưu trữ kết quả và chấm điểm tự động.
