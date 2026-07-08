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

### 1. Tính năng cốt lõi đã triển khai (Implemented Features):
* **Ngân hàng câu hỏi Toán 10 [DATABASE-BACKED]:** Quản lý câu hỏi trắc nghiệm/đáp án ngắn theo chương trình GDPT 2018. Tất cả thao tác xem, tạo mới, chỉnh sửa, và xóa đều được lưu vào cơ sở dữ liệu.
* **Nhập nhanh hàng loạt (Bulk Paste):** Trình bóc tách regex chuyển đổi văn bản thô thành câu hỏi có công thức LaTeX và đồng bộ trực tiếp vào cơ sở dữ liệu.
* **Trình thiết lập đề thi (Assignment Builder v1) [DATABASE-BACKED]:** Giao diện thiết lập bài tập mới từ các câu hỏi trong ngân hàng câu hỏi.
* **Đăng nhập & Phân quyền (Authentication) [DATABASE-BACKED]:** Tích hợp Auth.js (NextAuth v5) phân quyền Giáo viên - Học sinh với JWT Session.
* **Làm bài & Chấm điểm tích hợp DB (Student Attempt v1) [DATABASE-BACKED]:** Quy trình làm bài trực tuyến đầy đủ, tự động tạo lượt làm bài `IN_PROGRESS`, theo dõi bộ đếm thời gian, chấm điểm trắc nghiệm khách quan tự động (không dùng AI) và cập nhật trạng thái kết quả bài làm vào database.
* **Hồ sơ câu sai (Wrong Question Review v1):** Ghi nhận các câu học sinh làm sai hoặc bỏ qua vào cơ sở dữ liệu để phục vụ rà soát lỗi.
* **Chế độ Giao diện Sáng/Tối (Dark Mode Foundation):** Tích hợp thư viện `next-themes` và `ThemeProvider` toàn cục, thêm nút chuyển đổi giao diện (Theme Toggle) ở Header cho phép chuyển đổi chế độ Sáng (Light), Tối (Dark), và Hệ thống (System) với hệ màu CSS Variables đồng bộ.

### 2. Tính năng dài hạn tương lai (Future Features):
* **Google Gemini API OCR & Explain:** Tự động OCR tệp đề, giải thích lỗi sai và tự sinh câu tương đương sử dụng AI.
* **Xuất đề Word/PDF:** Xuất đề thi và đáp án chất lượng cao.

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

---

## 🗄️ Cấu hình Cơ sở dữ liệu (Prisma & PostgreSQL)

Dự án sử dụng Prisma ORM để quản lý và kết nối tới cơ sở dữ liệu PostgreSQL.

### Các bước cài đặt:

1. **Thiết lập biến môi trường**:
   Sao chép file `.env.example` thành `.env` ở thư mục gốc:
   ```bash
   cp .env.example .env
   ```
   Cập nhật `DATABASE_URL` trong file `.env` với đường dẫn kết nối PostgreSQL của bạn.

2. **Khởi tạo và đẩy Schema lên Database**:
   ```bash
   npm run db:migrate --name init_database_foundation
   ```

3. **Sinh Prisma Client**:
   ```bash
   npm run db:generate
   ```

4. **Nạp dữ liệu mẫu (Toán lớp 10 chương trình GDPT 2018)**:
   ```bash
   npm run db:seed
   ```

5. **Xem và quản lý cơ sở dữ liệu trực quan**:
   ```bash
   npm run db:studio
   ```

Chi tiết lược đồ dữ liệu và các trường xem tại [docs/database.md](file:///d:/Web_BaiTap/ai-learning-platform/docs/database.md).
