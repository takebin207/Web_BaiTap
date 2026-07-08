# Hướng dẫn Phát triển Local (Development Guide)

Tài liệu này hướng dẫn cách thiết lập môi trường phát triển cục bộ và cơ sở dữ liệu cho dự án **EStudy**.

---

## 🗄️ 1. Thiết lập Cơ sở dữ liệu Phát triển (Development Database)

EStudy sử dụng **PostgreSQL** làm cơ sở dữ liệu chính. Bạn có hai tùy chọn để chạy PostgreSQL cục bộ:

### Tùy chọn A: Sử dụng Docker Compose (Khuyên dùng)
Dự án đã tích hợp sẵn cấu hình Docker Compose cho PostgreSQL phát triển.

1. Khởi chạy Docker container:
   ```bash
   docker compose up -d
   ```
2. Container sẽ tạo một database tên là `estudy_dev` lắng nghe trên cổng `5432`.

### Tùy chọn B: Sử dụng PostgreSQL Cục bộ cài trực tiếp
Nếu không sử dụng Docker, bạn cần tạo cơ sở dữ liệu thủ công:
- **Tên Database**: `estudy_dev`
- **User**: `estudy`
- **Password**: `estudy_dev_password`
- **Port**: `5432`

---

## ⚙️ 2. Thiết lập Biến môi trường (Environment Variables)

Sao chép `.env.example` thành `.env` ở thư mục gốc:
```bash
cp .env.example .env
```
Cập nhật giá trị `DATABASE_URL` trong file `.env` khớp với kết nối database cục bộ của bạn (đã được cấu hình mặc định khớp với Docker Compose):
```env
DATABASE_URL="postgresql://estudy:estudy_dev_password@localhost:5432/estudy_dev?schema=public"
```

---

## 🛠️ 3. Các Lệnh Prisma (Prisma Workflows)

Dự án cung cấp các lệnh NPM tiện dụng để làm việc với Prisma ORM:

### 1. Đồng bộ Schema & Chạy Migration
Tạo bảng và thiết lập lược đồ quan hệ trong database:
```bash
npm run prisma:migrate
```

### 2. Nạp dữ liệu mẫu (Seed Data)
Nạp dữ liệu giả lập chất lượng cao dành cho Toán học lớp 10 (Chương trình GDPT 2018):
```bash
npm run prisma:seed
```

### 3. Sinh Prisma Client
Sinh client thư viện truy vấn:
```bash
npm run prisma:generate
```

### 4. Quản trị database trực quan (Prisma Studio)
Mở giao diện quản trị cơ sở dữ liệu trên trình duyệt web:
```bash
npm run prisma:studio
```

---

## 🚀 4. Khởi chạy Ứng dụng

Sau khi database đã được migrate và seed thành công:
1. Chạy ứng dụng local ở cổng 5000 (để tránh xung đột cổng):
   ```bash
   npm run dev -- -p 5000
   ```
2. Mở trình duyệt truy cập:
   - 💻 Giao diện: [http://localhost:5000](http://localhost:5000)
