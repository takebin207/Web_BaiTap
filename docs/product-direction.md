# Định hướng Sản phẩm EStudy (Product Direction)

Tài liệu này xác định vị trí chiến lược, giá trị cốt lõi và lộ trình phát triển của sản phẩm **EStudy**.

---

## 🎯 Định vị Sản phẩm (Product Positioning)

**EStudy** là nền tảng giao bài tập và phân tích câu hỏi làm sai hỗ trợ bởi AI, được thiết kế chuyên biệt cho **giáo viên và gia sư**.

* **KHÔNG PHẢI** là một nền tảng học tập chung chung (Broad AI Learning Platform).
* **KHÔNG PHẢI** là một hệ thống LMS đồ sộ đầy đủ chức năng như Moodle/Canvas.
* **KHÔNG PHẢI** là một ChatGPT wrapper đơn giản để chat tự do.

EStudy tập trung giải quyết triệt để **một luồng quy trình nghiệp vụ (core workflow) duy nhất** nhưng mang lại giá trị cao nhất cho giáo viên.

---

## 💎 Giá trị Cốt lõi (Primary Value Proposition)

> **"Biết học sinh sai gì — Biết cần dạy gì buổi sau."**

Nền tảng giúp giáo viên tối ưu hóa thời gian chuẩn bị bài học và tập trung chính xác vào lỗ hổng kiến thức thực tế của học sinh thông qua 5 bước:

1. **Giao bài tập:** Giáo viên tạo đề trắc nghiệm nhanh chóng từ ngân hàng câu hỏi hoặc tự soạn thảo.
2. **Học sinh làm bài:** Học sinh trả lời trực tuyến trên mọi thiết bị có bộ đếm thời gian và lưu tự động.
3. **Chấm điểm tự động:** Hệ thống tự động chấm điểm các câu hỏi trắc nghiệm khách quan ngay sau khi học sinh nộp bài.
4. **Ghi nhận sai sót:** Hệ thống đo đếm các câu làm sai, các câu bị bỏ qua (skip), và thời gian làm bài trung bình cho từng câu.
5. **Đề xuất ôn tập từ AI:** Trợ lý AI tổng hợp các câu hỏi sai nhiều nhất của cả lớp, phân tích nguyên nhân và đề xuất checklist nội dung giáo án cần ôn tập cho buổi học tiếp theo.

---

## ⚙️ Phạm vi Tính năng (Feature Scope)

### 1. Tính năng cốt lõi (Giai đoạn hiện tại)
* **Quản lý lớp học:** Giáo viên tạo lớp, quản lý danh sách học sinh và kết quả trung bình.
* **Quản lý bài tập:** Tạo bài tập với cấu hình thời gian làm bài, hạn nộp và chế độ bật/tắt hiển thị lời giải.
* **Giao diện làm bài:** Học sinh làm bài trực tuyến với bộ đếm ngược, hiển thị trạng thái "đã lưu tự động" và xem điểm kèm giải thích AI sau khi hoàn thành.
* **Phân tích câu hỏi sai (Trọng tâm):** Bảng tổng hợp câu sai theo học sinh, câu bị bỏ qua, câu mất quá nhiều thời gian làm và các chủ đề rỗng kiến thức.
* **Ngân hàng câu hỏi:** Bộ lưu trữ câu hỏi được phân loại theo bộ môn, khối, chương học và trạng thái duyệt (`READY`, `DRAFT`, `NEEDS_REVIEW`, `ERROR`).
* **Trợ lý AI ôn tập:** Đề xuất giáo án ôn tập buổi sau, giải thích chi tiết đáp án sai và sinh câu hỏi tương tự cùng dạng.

### 2. Tính năng tương lai (Không ưu tiên ở hiện tại)
* **Nhập đề thi thông minh (Import Center):** Giáo viên tải lên tệp đề bài và tệp đáp án riêng biệt (PDF, Word, Ảnh). AI OCR (Gemini/Vision API) tự động bóc tách và khớp đáp án, chuyển thành câu hỏi có cấu trúc.
* **Hỗ trợ công thức Toán/Lý/Hóa:** Nhận dạng công thức toán học phức tạp bằng OCR nâng cao.
* **Xuất bản đề (Export):** Xuất đề bài hoặc lời giải chi tiết ra tệp Word/PDF để giáo viên in ấn phát cho học sinh học trực tiếp.
