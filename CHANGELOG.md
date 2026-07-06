# Nhật ký Thay đổi (Changelog): EStudy

Toàn bộ các thay đổi lớn của dự án sẽ được ghi nhận tại tài liệu này.

---

## [0.2.0] - 2026-07-06
### Added
- **Đổi tên thương hiệu:** Toàn bộ dự án được chuyển đổi tên từ EduAI / AI Learning Platform sang **EStudy**.
- **Định hướng lại sản phẩm:** Chuyển đổi từ nền tảng học tập chung chung sang **Nền tảng giao bài tập và phân tích câu sai thông minh** tập trung hỗ trợ gia sư và giáo viên.
- **Tái cấu trúc Mock Data (`src/data/mock/data.ts`):** Thiết lập cấu trúc dữ liệu mô phỏng hoàn chỉnh luồng nghiệp vụ EStudy (AssignmentSummary, StudentAttempt, WrongQuestionItem, ImportJob, AIReviewSummary).
- **Trình tạo Bài tập mới (`/dashboard/tutor/assignments/create`):** Giao diện thêm câu hỏi thủ công, chọn từ ngân hàng đề, cài đặt thời gian, hạn nộp bài.
- **Phân tích Câu hỏi sai (`/dashboard/tutor/wrong-questions` - Cốt lõi):** Phân tích câu sai theo học sinh, câu bị bỏ qua, câu tốn nhiều thời gian và các chủ đề rỗng kiến thức kèm giáo án đề xuất từ AI.
- **Trợ lý AI Ôn tập (`/dashboard/tutor/ai-review`):** Mô phỏng giải thích đáp án sai nâng cao, sinh 3 câu tương đương cùng dạng.
- **Nhập đề thi (`/dashboard/tutor/import`):** Mô phỏng tiến trình AI OCR bóc tách câu hỏi và đáp án từ PDF/Word/Ảnh.
- **Bảng kết quả (`/dashboard/tutor/results`):** Xem danh sách học sinh nộp bài tập và điểm số.
- **Làm bài trực tuyến (`/dashboard/student/assignments/[id]`):** Giao diện làm trắc nghiệm tương tác với bộ đếm ngược, bản đồ câu hỏi và chỉ báo lưu tự động.
- **Kết quả bài làm (`/dashboard/student/assignments/[id]/result`):** Báo cáo điểm số, thống kê chi tiết đúng/sai/skip và thời gian làm từng câu của học sinh.
- **Ôn tập câu sai (`/dashboard/student/wrong-questions`):** Kho lưu trữ cá nhân để học sinh xem lại đáp án và làm lại câu sai.
- **Tài liệu mới:** Thêm tài liệu định hướng `docs/product-direction.md` và kiến trúc `docs/architecture.md`.

---

## [0.1.0] - 2026-07-06
- Khởi tạo dự án ban đầu dưới tên EduAI.
