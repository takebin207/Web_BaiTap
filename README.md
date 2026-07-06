# EStudy - Giao bài tập & Phân tích câu sai bằng AI

Hệ thống giao bài tập trực tuyến và phân tích lỗi sai thông minh hỗ trợ bởi trí tuệ nhân tạo (AI), được thiết kế dành riêng cho **giáo viên và gia sư**.

> **Khởi đầu với môn Toán lớp 10 (Chương trình GDPT 2018) do người dùng đã có sẵn tài liệu học tập thực tế.**

Dự án được xây dựng bằng **Next.js 15**, **React 19**, **Tailwind CSS v4**, và **shadcn/ui**.

---

## 🎯 Định vị & Giá trị Cốt lõi (Core Value)

> **"Biết học sinh sai gì — Biết cần dạy gì buổi sau."**

EStudy tập trung tối ưu hóa **luồng nghiệp vụ ôn tập câu sai** của giáo viên:

1. **Giao bài tập:** Tạo đề trắc nghiệm nhanh từ ngân hàng đề Toán 10 hoặc tự soạn thảo.
2. **Học sinh làm bài:** Trả lời trực tuyến có lưu tự động và đếm thời gian.
3. **Chấm điểm tự động:** Chấm điểm trắc nghiệm khách quan/đáp án ngắn tức thì sau khi nộp.
4. **Phân tích câu sai:** Ghi nhận tỉ lệ sai, câu bị bỏ qua, câu tốn nhiều thời gian và danh sách học sinh làm sai.
5. **Gợi ý giảng dạy từ AI:** Trợ lý ảo AI phân tích lỗi sai và đề xuất giáo án ôn tập cho buổi tiếp theo.

---

## 🚀 Phạm vi Tính năng (Sprint 1.5 - Math 10 Focus)

### 1. Tính năng cốt lõi gần hạn (Near-term Focus):
* **Ngân hàng câu hỏi Toán 10:** Quản lý câu hỏi trắc nghiệm/đáp án ngắn theo chương trình GDPT 2018 (Mệnh đề, Tập hợp, Hàm số bậc hai, Vectơ, Hệ thức lượng, Thống kê, Xác suất).
* **Nhập câu hỏi thủ công:** Giao diện điền đầy đủ siêu dữ liệu (Metadata): Chủ đề, Độ khó, Mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao), Loại câu hỏi.
* **Nhập nhanh hàng loạt (Bulk Paste):** Hỗ trợ giáo viên copy-paste nhanh câu hỏi từ tài liệu Word/PDF có sẵn, hiển thị xem trước bóc tách thử nghiệm.
* **Trình thiết lập đề thi:** Hỗ trợ tạo đề theo cấu trúc phân bố ma trận (độ khó và chương học) tự động.
* **Học sinh làm bài & Xem kết quả:** Làm bài trắc nghiệm/điền từ ngắn có bộ đếm thời gian, xem đáp án chi tiết và giải thích AI.
* **Phân tích lỗi sai:** Bảng tổng hợp câu sai, câu bỏ qua, câu làm chậm theo từng chủ đề Toán 10.

### 2. Tính năng dài hạn tương lai (Future Features):
* Tải tệp đề bài & đáp án (PDF, Word, Ảnh) riêng biệt và tự động khớp cặp bằng AI OCR.
* Nhận dạng công thức toán học/hóa học nâng cao.
* Quy trình giáo viên phê duyệt câu hỏi trước khi lưu vào ngân hàng đề chính thức.
* Xuất đề bài và đáp án ra file Word (.docx) và PDF chất lượng cao.

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
