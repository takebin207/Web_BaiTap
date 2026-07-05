# Báo cáo Trạng thái Dự án: AI Learning Platform Prototype

Tài liệu này cung cấp thông tin chi tiết về hiện trạng phát triển của bản thử nghiệm cao cấp (high-fidelity prototype) dành cho Nền tảng Học tập hỗ trợ AI (AI Learning Platform).

---

## 1. Trạng thái Dự án hiện tại
Bản mẫu hiện tại là một ứng dụng **Next.js 15** sử dụng **React 19**, **Tailwind CSS v4**, **Framer Motion**, và **shadcn/ui**. Dự án được xây dựng hoàn chỉnh dưới dạng tĩnh (static mock-up) chạy trực tiếp trên Localhost để đánh giá UI/UX và luồng người dùng (User Flows).

* **Build & Compile:** Đã vượt qua kiểm tra TypeScript và `next build` thành công.
* **Linting:** Kết quả `eslint` hiện tại hoàn toàn sạch lỗi, không còn bất kỳ cảnh báo hoặc lỗi type check nào.

---

## 2. Các trang đã triển khai (Implemented Pages)

### 🧑‍🎓 Học sinh (Student Pages)
* **Tổng quan Học sinh (`/dashboard/student`):** Hiển thị chuỗi ngày học (streak), số câu hỏi đã làm, độ chính xác, biểu đồ cột tuần tự tiến trình học, đề xuất AI, bài tập cần nộp, chủ đề yếu, hoạt động gần đây.
* **Danh sách luyện tập (`/dashboard/student/practice`):** Cho phép học sinh lựa chọn môn học (Toán, Lý, Hóa) và lọc câu hỏi theo mức độ khó (Dễ, Trung bình, Khó, Cực khó) kèm ô tìm kiếm thời gian thực.
* **Chi tiết câu hỏi (`/dashboard/student/practice/[id]`):** Giao diện làm bài trắc nghiệm tương tác với lựa chọn câu trả lời trực quan và kiểm tra đáp án đúng/sai tức thời.
* **Giải thích AI & Câu hỏi tương tự:** Tích hợp trực tiếp tại trang chi tiết câu hỏi; hiển thị lời giải từng bước của AI và gợi ý danh sách câu hỏi ôn tập tương tự.
* **Phân tích Học tập (`/dashboard/student/analytics`):** Trực quan hóa độ chính xác theo từng môn, lịch sử ôn tập và biểu đồ lỗ hổng kiến thức cần cải thiện.

### 👨‍🏫 Giáo viên (Tutor Pages)
* **Tổng quan Giáo viên (`/dashboard/tutor`):** Quản lý nhanh số học sinh, lớp học, điểm trung bình lớp và danh sách bài nộp mới nhất của học sinh.
* **Danh sách Lớp học (`/dashboard/tutor/classes`):** Hiển thị danh sách các lớp học hiện tại, sĩ số học sinh, điểm trung bình lớp và chức năng sao chép mã mời học sinh.
* **Danh sách Bài tập (`/dashboard/tutor/assignments`):** Quản lý các bài tập đã giao, số lượng câu hỏi, trạng thái chấm điểm và hạn nộp bài.
* **Thống kê Lớp học (`/dashboard/tutor/analytics`):** Thống kê số lượng bài nộp trong tuần, hiệu suất điểm số của từng lớp học.

### 🛡️ Quản trị viên (Admin Pages)
* **Tổng quan Admin (`/dashboard/admin`):** Theo dõi số lượng câu hỏi hệ thống, người dùng hoạt động, số lượt gọi API AI, hiệu năng CPU/RAM và nhật ký truy cập API.
* **Quản lý câu hỏi (`/dashboard/admin/questions`):** Danh sách toàn bộ ngân hàng câu hỏi, hỗ trợ bộ lọc và mô phỏng các hành động thêm, sửa, xóa câu hỏi.
* **Cấu hình AI (`/dashboard/admin/ai-config`):** Mô phỏng trang điều chỉnh tham số mô hình LLM (Gemini 1.5 Pro / Flash), tinh chỉnh tham số độ sáng tạo (Temperature) và viết System Prompt chỉ thị cho AI.

---

## 3. Đánh giá Kiến trúc & Sự phức tạp (Architecture & Design Audit)

### Kiểm tra Kiến trúc
* **Hiện trạng thực tế:** Do đang ở giai đoạn Prototype phục vụ UI/UX, toàn bộ mã nguồn tập trung ở tầng **Presentation** (`src/app` và `src/components`). Tầng nghiệp vụ và hạ tầng chỉ được giả lập thông qua mô hình kiểu dữ liệu trong tệp `src/data/mock/data.ts`.
* **Đánh giá:** Thiết kế hiện tại **không bị quá tải (over-engineered)**. Cấu trúc thư mục tối giản, tập trung tối đa vào giao diện trực quan và trải nghiệm người dùng, giúp nhà phát triển dễ dàng cấu trúc lại (refactor) khi tích hợp Backend thực tế ở Giai đoạn 2.

---

## 4. Các tính năng chưa triển khai (Missing Backend / DB / Auth / AI)

Đây là các thành phần **tuyệt đối KHÔNG** được xây dựng trong giai đoạn này để tránh lãng phí nguồn lực:
* **Hệ thống xác thực (Authentication):** Chưa tích hợp Auth.js hoặc JWT. Việc đăng nhập hiện tại chỉ là chuyển hướng trang đơn thuần.
* **Cơ sở dữ liệu (Database):** Chưa có Prisma ORM, PostgreSQL hoặc MongoDB.
* **Tích hợp Trí tuệ nhân tạo (AI Engine):** Chưa kết nối API Gemini/OpenAI để sinh lời giải hoặc phân tích văn bản PDF.
* **Xử lý PDF (PDF Processor):** Chưa có thư viện OCR hoặc API phân tích tài liệu để tự động chuyển PDF thành câu hỏi trắc nghiệm.

---

## 5. Kế hoạch hành động cho Sprint tiếp theo (Next Sprint)

1. Thiết lập **Prisma ORM** và kết nối tới database **PostgreSQL**.
2. Triển khai **Auth.js** phục vụ xác thực người dùng và phân quyền tài khoản (Học sinh, Giáo viên, Quản trị viên).
