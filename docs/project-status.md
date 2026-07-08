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

## 3. Các tính năng đã và đang triển khai (Backend Foundation & CRUD v1)

* **Database (PostgreSQL & Prisma ORM) [ĐÃ HOÀN THÀNH]:** Thiết lập Prisma, lược đồ quan hệ đầy đủ (User, Classroom, ClassEnrollment, Question, Assignment, Attempt, AttemptAnswer, WrongQuestionReview) và kịch bản Seed dữ liệu Toán 10.
* **Kiến trúc Clean Architecture [ĐÃ HOÀN THÀNH]:** Bố cục thư mục `src/server/repositories`, `src/server/services`, `src/types`, và Prisma Client helper.
* **Question Bank CRUD v1 [ĐÃ HOÀN THÀNH]:** Triển khai tầng lưu trữ (Repository), nghiệp vụ (Service), các đầu API `/api/tutor/questions` và tích hợp giao diện quản trị ngân hàng câu hỏi (đọc, thêm mới, sửa đổi, và xóa/ẩn an toàn).
* **Assignment Builder v1 [ĐÃ HOÀN THÀNH]:** Triển khai API giao bài `/api/tutor/assignments` cùng các tầng Repository & Service. Đồng bộ hóa quy trình chọn câu hỏi từ Ngân hàng, cấu hình các trường bài tập, xuất bản bài tập (giao bài hoặc lưu nháp) và trang chi tiết đề thi dành cho giáo viên.
* **Authentication (Auth.js v5) [ĐÃ HOÀN THÀNH]:** Phân quyền Giáo viên và Học sinh sử dụng JWT Session với giao diện Đăng nhập mẫu cao cấp.
* **Student Attempt v1 [ĐÃ HOÀN THÀNH]:** Hệ thống hóa luồng làm bài và nộp bài dựa trên DB. Học sinh có thể xem trang chi tiết bài tập, bắt đầu/tiếp tục làm bài (lưu trạng thái `IN_PROGRESS` vào DB), làm bài có đếm giờ và nộp bài để chấm trắc nghiệm tự động (lưu trạng thái `GRADED` cùng các câu trả lời vào `AttemptAnswer` trong DB).

## 4. Các tính năng chưa triển khai (Future Phases)

* **Gemini API:** Chưa gọi API thực tế để giải thích câu hỏi hoặc sinh câu hỏi tương tự (sẽ tích hợp ở Phase sau).
* **OCR PDF/Word:** Chưa tích hợp Vision API hoặc Document AI để đọc tệp tải lên thực tế.
* **Wrong Question Review v1:** Sổ tay lưu câu sai sẽ được tinh chỉnh hoàn thiện ở sprint tiếp theo để hỗ trợ các báo cáo sâu hơn.

---

## 5. Kế hoạch hành động tiếp theo

1. Tích hợp Google Gemini API để giải thích lời giải chi tiết cho câu sai của học sinh.
2. Xây dựng thuật toán AI tự động gợi ý đề thi ôn tập tương tự dựa trên lịch sử câu sai của học sinh.
3. Hoàn thiện các giao diện báo cáo chuyên sâu của giáo viên liên quan đến dữ liệu lượt làm bài thực tế trong DB.
