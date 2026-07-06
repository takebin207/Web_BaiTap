# Báo cáo Trạng thái Dự án: EStudy Prototype

Tài liệu này cung cấp thông tin chi tiết về hiện trạng phát triển của bản thử nghiệm giao diện cao cấp (high-fidelity prototype) dành cho hệ thống **EStudy** — Nền tảng giao bài tập và phân tích câu hỏi làm sai hỗ trợ bởi AI.

---

## 1. Trạng thái Dự án hiện tại

Bản mẫu hiện tại là một ứng dụng **Next.js 15** sử dụng **React 19**, **Tailwind CSS v4**, **Framer Motion**, và **shadcn/ui**. Dự án được xây dựng hoàn chỉnh dưới dạng tĩnh (static mock-up) chạy trực tiếp trên Localhost để đánh giá luồng nghiệp vụ ôn tập câu sai.

* **Build & Compile:** Đã vượt qua kiểm tra TypeScript và `next build` thành công.
* **Linting:** Kết quả `eslint` hoàn toàn sạch lỗi, không còn bất kỳ cảnh báo hoặc lỗi type check nào.
* **Đổi tên thương hiệu:** Toàn bộ dự án đã được chuyển đổi thương hiệu từ EduAI sang **EStudy**.

---

## 2. Các trang đã triển khai (Implemented Pages)

### 👨‍🏫 Giáo viên (Tutor Pages)
* **Tổng quan Giáo viên (`/dashboard/tutor`):** Dashboard hiển thị lớp học, số học sinh, danh sách bài tập đang diễn ra, danh sách học sinh chưa nộp bài, các bài nộp gần đây, top câu hỏi học sinh sai nhiều nhất và thẻ gợi ý ôn tập nhanh từ AI.
* **Danh sách Lớp học (`/dashboard/tutor/classes`):** Hiển thị danh sách các lớp học hiện tại, sĩ số học sinh, điểm trung bình lớp và chức năng sao chép mã mời học sinh.
* **Quản lý Bài tập (`/dashboard/tutor/assignments`):** Quản lý bài tập theo trạng thái tab (Tất cả, Đang mở, Bản nháp, Đã đóng, Đã chấm), số lượng câu hỏi, thời gian làm và hạn nộp bài.
* **Trình tạo Bài tập mới (`/dashboard/tutor/assignments/create`):** Biểu mẫu thiết lập tiêu đề, môn học, thời gian làm, lớp nhận bài, hạn nộp, công tắc bật/tắt hiển thị lời giải và chọn nhanh câu hỏi từ ngân hàng hoặc thêm thủ công.
* **Bảng kết quả (`/dashboard/tutor/results`):** Xem chi tiết điểm số của học sinh và bấm chấm điểm giả lập.
* **Phân tích câu hỏi sai (`/dashboard/tutor/wrong-questions` - Cốt lõi):** Phân tích câu sai theo học sinh, câu bị bỏ qua, câu mất quá nhiều thời gian làm và các chủ đề rỗng kiến thức kèm giáo án ôn tập buổi sau từ AI.
* **Ngân hàng câu hỏi (`/dashboard/tutor/question-bank`):** Bộ lưu trữ câu hỏi được phân loại theo bộ môn, khối, chương học và trạng thái duyệt (`READY`, `DRAFT`, `NEEDS_REVIEW`, `ERROR`).
* **Trợ lý AI ôn tập (`/dashboard/tutor/ai-review`):** Giao diện giải thích câu sai, tạo 3 câu tương đương và gợi ý giáo án buổi học sau từ AI.
* **Nhập đề thi (`/dashboard/tutor/import`):** Mô phỏng tải lên tệp đề bài & đáp án (PDF, Word, Ảnh), tiến trình OCR bóc tách và khớp đáp án tự động từ AI.

### 🧑‍🎓 Học sinh (Student Pages)
* **Tổng quan Học sinh (`/dashboard/student`):** Hiển thị số bài tập chưa làm, lịch sử điểm số, thống kê số câu làm sai lưu trữ và lời khuyên học tập từ AI.
* **Bài tập của tôi (`/dashboard/student/assignments`):** Danh sách bài tập giáo viên giao kèm trạng thái làm bài (Chưa làm, Đã nộp, Đã chấm).
* **Làm bài trực tuyến (`/dashboard/student/assignments/[id]`):** Giao diện làm trắc nghiệm tương tác với bộ đếm ngược thời gian, chỉ báo lưu tự động và bản đồ câu hỏi.
* **Kết quả bài làm (`/dashboard/student/assignments/[id]/result`):** Điểm số đạt được, thống kê đúng/sai/skip, thời gian làm bài chi tiết và xem lời giải thích chi tiết của giáo viên / AI.
* **Ôn tập câu làm sai (`/dashboard/student/wrong-questions`):** Kho lưu trữ các câu hỏi trắc nghiệm đã làm sai, cho phép xem lời giải AI giải thích chi tiết và bấm "Luyện câu tương tự".

---

## 3. Đánh giá Kiến trúc (Architecture Audit)

* **Hiện trạng thực tế:** Toàn bộ mã nguồn tập trung ở tầng **Presentation** (`src/app` và `src/components`). Tầng nghiệp vụ và hạ tầng được giả lập thông qua tệp dữ liệu Mock Data tại `src/data/mock/data.ts`.
* **Đánh giá:** Giao diện được tối ưu hóa tối đa cho nghiệp vụ giao bài và rà soát lỗi sai của học sinh. Sẵn sàng tích hợp PostgreSQL, Prisma và Gemini API ở giai đoạn tiếp theo.

---

## 4. Các tính năng chưa triển khai ở Giai đoạn 1

Đây là các thành phần **tuyệt đối KHÔNG** được xây dựng trong giai đoạn này để tránh lãng phí nguồn lực:
* **Hệ thống xác thực (Authentication):** Đăng nhập hiện tại chỉ là chuyển hướng trang đơn thuần.
* **Cơ sở dữ liệu (Database):** Chưa kết nối PostgreSQL thực tế.
* **Tích hợp Gemini API:** Chưa gọi API thực tế.
* **Xử lý OCR PDF/Word:** Chưa tích hợp Vision API hoặc Document AI.

---

## 5. Kế hoạch hành động cho Giai đoạn 2

1. Thiết lập **Prisma ORM** và kết nối tới database **PostgreSQL**.
2. Thiết lập **Auth.js** và phân quyền truy cập.
3. Thiết lập kết nối **Gemini API** để giải thích câu sai trực tiếp.
