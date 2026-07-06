# Định hướng Sản phẩm EStudy (Product Direction)

Tài liệu này xác định vị trí chiến lược, giá trị cốt lõi và lộ trình phát triển của sản phẩm **EStudy**.

---

## 🎯 Định vị Sản phẩm (Product Positioning)

**EStudy** là nền tảng giao bài tập và phân tích câu hỏi làm sai hỗ trợ bởi AI, được thiết kế chuyên biệt cho **giáo viên và gia sư**.

> **Khởi đầu với môn Toán lớp 10 (Chương trình GDPT 2018) do người dùng đã có sẵn tài liệu học tập thực tế để xây dựng dữ liệu mẫu.**

EStudy tập trung giải quyết triệt để **một luồng quy trình nghiệp vụ (core workflow) duy nhất** nhưng mang lại giá trị cao nhất cho giáo viên.

---

## 💎 Giá trị Cốt lõi (Primary Value Proposition)

> **"Biết học sinh sai gì — Biết cần dạy gì buổi sau."**

Nền tảng giúp giáo viên tối ưu hóa thời gian chuẩn bị bài học và tập trung chính xác vào lỗ hổng kiến thức thực tế của học sinh thông qua 5 bước:

1. **Giao bài tập:** Giáo viên tạo đề trắc nghiệm/điền từ ngắn nhanh chóng từ ngân hàng đề Toán 10 hoặc tự soạn thảo.
2. **Học sinh làm bài:** Học sinh trả lời trực tuyến trên mọi thiết bị có bộ đếm thời gian và lưu tự động.
3. **Chấm điểm tự động:** Hệ thống tự động chấm điểm các câu hỏi trắc nghiệm khách quan/đáp án ngắn ngay sau khi học sinh nộp bài.
4. **Ghi nhận sai sót:** Hệ thống đo đếm các câu làm sai, các câu bị bỏ qua (skip), và thời gian làm bài trung bình cho từng câu theo phân loại chương mục Toán 10.
5. **Đề xuất ôn tập từ AI:** Trợ lý AI tổng hợp các câu hỏi sai nhiều nhất của cả lớp, phân tích nguyên nhân và đề xuất giáo án cần ôn tập cho buổi học tiếp theo.

---

## ⚙️ Phạm vi Tính năng (Feature Scope)

### 1. Tính năng cốt lõi gần hạn (Near-term Focus)
* **Ngân hàng đề Toán 10:** Quản lý câu hỏi theo chương trình phổ thông 2018 (Mệnh đề, Bất phương trình, Hàm số bậc hai, Hệ thức lượng, Vectơ, Phương pháp tọa độ, Thống kê, Xác suất).
* **Nhập câu hỏi thủ công:** Giáo viên nhập câu hỏi có LaTeX đầy đủ thuộc tính: chủ đề, độ khó, nhận thức, loại câu hỏi.
* **Nhập nhanh hàng loạt (Bulk Paste):** Cho phép copy-paste thô đề thi từ Word/PDF vào textarea để AI bóc tách và xem trước kết quả.
* **Trình tạo đề theo cấu trúc:** Tự động sinh đề thi dựa trên số câu chỉ định từng chương và ma trận độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao).
* **Phân tích lỗi sai (Trọng tâm):** Bảng tổng hợp câu sai theo chương Toán 10, câu bị bỏ qua, câu làm chậm và đề xuất bài học kế tiếp.

### 2. Tính năng dài hạn tương lai (Future Features)
* **Nhập đề thi thông minh (Import Center):** Giáo viên tải lên tệp đề bài và đáp án riêng biệt (PDF, Word, Ảnh). AI OCR tự động bóc tách và khớp đáp án, chuyển thành câu hỏi có cấu trúc.
* **Hỗ trợ công thức Toán phức tạp:** Nhận dạng công thức toán học (LaTeX) bằng OCR nâng cao.
* **Quy trình phê duyệt (Review Workflow):** Cần giáo viên kiểm duyệt câu hỏi bóc tách trước khi đưa vào ngân hàng đề chính thức.
* **Xuất bản đề (Export):** Xuất đề bài hoặc lời giải chi tiết ra tệp Word (.docx) và PDF chất lượng cao.
