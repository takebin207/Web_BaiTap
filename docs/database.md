# Cơ sở dữ liệu EStudy (Database Documentation)

Tài liệu này chi tiết cấu trúc cơ sở dữ liệu của nền tảng **EStudy** sử dụng **Prisma ORM** và hệ quản trị cơ sở dữ liệu **PostgreSQL** (có thể sử dụng Supabase PostgreSQL).

---

## 1. Kiến trúc Schema Cơ sở Dữ liệu

Lược đồ cơ sở dữ liệu được thiết kế nhằm hỗ trợ quy trình giao bài tập và theo dõi câu hỏi làm sai (Wrong Question Review) cốt lõi của giáo viên và học sinh.

### Sơ đồ mối quan hệ giữa các Bảng (Relational Model)

- **User**: Lưu trữ tài khoản người dùng, phân vai trò (`TUTOR`, `STUDENT`, `ADMIN`).
- **Classroom**: Lớp học được tạo bởi một Giáo viên (`TUTOR`).
- **ClassEnrollment**: Bảng liên kết trung gian (Many-to-Many) giữa học sinh (`STUDENT`) và lớp học (`Classroom`).
- **Question**: Ngân hàng câu hỏi hỗ trợ LaTeX, lưu trữ đầy đủ phân loại chương, chủ đề, độ khó, mức độ nhận thức, đáp án đúng và lời giải chi tiết.
- **Assignment**: Bài tập do giáo viên giao cho một lớp học nhất định.
- **AssignmentQuestion**: Bảng trung gian định nghĩa danh sách và thứ tự (`order`) của các câu hỏi thuộc về một bài tập.
- **Attempt**: Lượt làm bài tập của học sinh, lưu trữ thời gian bắt đầu, nộp bài, tổng điểm và trạng thái làm bài.
- **AttemptAnswer**: Chi tiết đáp án học sinh đã chọn cho từng câu hỏi trong lượt làm bài, bao gồm trạng thái đúng/sai và thời gian làm câu đó.
- **WrongQuestionReview**: Sổ tay/tổng hợp các câu làm sai của học sinh để giáo viên phân tích hoặc học sinh tự luyện tập lại.

---

## 2. Chi tiết các Bảng và Trường Dữ liệu

### User (users)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính dạng UUID |
| `name` | String | | Tên người dùng |
| `email` | String | `unique` | Địa chỉ email đăng nhập |
| `role` | Role (Enum) | `default(STUDENT)` | Vai trò (`TUTOR`, `STUDENT`, `ADMIN`) |
| `createdAt` | DateTime | `default(now())` | Thời gian tạo tài khoản |
| `updatedAt` | DateTime | `@updatedAt` | Thời gian cập nhật tài khoản |

### Classroom (classrooms)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính dạng UUID |
| `name` | String | | Tên lớp học |
| `subject` | String | `default("Toán học")` | Môn học |
| `grade` | String | | Khối lớp (ví dụ: "10") |
| `tutorId` | String | Khóa ngoại tới `User` | ID Giáo viên quản lý lớp |

### ClassEnrollment (class_enrollments)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `classroomId`| String | Khóa ngoại tới `Classroom` | ID lớp học |
| `studentId`  | String | Khóa ngoại tới `User` | ID học sinh |
| `enrolledAt` | DateTime | `default(now())` | Ngày học sinh tham gia lớp |
| *(Composite)*| `[classroomId, studentId]` | `@id` | Khóa chính tổng hợp |

### Question (questions)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính |
| `content` | String (Text) | | Nội dung câu hỏi (chứa LaTeX) |
| `questionType`| QuestionType | | Loại câu hỏi (`MULTIPLE_CHOICE`, `SHORT_ANSWER`...) |
| `options` | Json | Có thể null | Danh sách lựa chọn trắc nghiệm dạng mảng JSON |
| `correctAnswer`| String (Text)| | Đáp án đúng |
| `explanation` | String (Text)| Có thể null | Lời giải chi tiết |
| `chapter` | String | | Tên chương kiến thức |
| `topic` | String | | Tên chủ đề kiến thức |
| `difficulty` | Difficulty | `default(MEDIUM)` | Độ khó (`EASY`, `MEDIUM`, `HARD`) |
| `cognitiveLevel`| CognitiveLevel| `default(UNDERSTANDING)`| Nhận thức (`RECOGNITION`, `UNDERSTANDING`...) |
| `status` | QuestionStatus| `default(DRAFT)` | Trạng thái duyệt (`READY`, `DRAFT`, `NEEDS_REVIEW`...) |
| `createdById`| String | Khóa ngoại tới `User` | Người tạo câu hỏi |

### Assignment (assignments)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính |
| `title` | String | | Tiêu đề bài tập |
| `description`| String (Text) | Có thể null | Mô tả chi tiết yêu cầu bài tập |
| `classId` | String | Khóa ngoại tới `Classroom` | ID lớp được giao bài |
| `createdById`| String | Khóa ngoại tới `User` | ID giáo viên giao bài |
| `timeLimitMinutes`| Int | Có thể null | Thời gian làm bài (phút) |
| `deadline` | DateTime | Có thể null | Hạn nộp bài |
| `showSolutionsAfterSubmit`| Boolean | `default(true)`| Cho phép học sinh xem lời giải ngay sau nộp |
| `status` | AssignmentStatus| `default(DRAFT)` | Trạng thái bài tập (`DRAFT`, `ASSIGNED`, `CLOSED`) |

### Attempt (attempts)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính |
| `assignmentId`| String | Khóa ngoại tới `Assignment`| ID bài tập tương ứng |
| `studentId` | String | Khóa ngoại tới `User` | ID học sinh làm bài |
| `startedAt` | DateTime | `default(now())` | Thời gian bắt đầu làm |
| `submittedAt`| DateTime | Có thể null | Thời gian nộp bài |
| `timeSpentSeconds`| Int | Có thể null | Tổng thời gian làm bài (giây) |
| `score` | Float | Có thể null | Điểm số đạt được |
| `status` | AttemptStatus| `default(IN_PROGRESS)`| Trạng thái bài làm (`IN_PROGRESS`, `SUBMITTED`, `GRADED`)|

### AttemptAnswer (attempt_answers)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính |
| `attemptId` | String | Khóa ngoại tới `Attempt` | ID lượt làm bài |
| `questionId` | String | Khóa ngoại tới `Question` | ID câu hỏi |
| `answer` | String (Text)| | Đáp án thực tế học sinh đã điền/chọn |
| `isCorrect` | Boolean | Có thể null | Đánh giá đúng/sai |
| `timeSpentSeconds`| Int | Có thể null | Thời gian học sinh dừng chân làm câu hỏi này |

### WrongQuestionReview (wrong_question_reviews)
| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `id` | String | `@id @default(uuid())` | Khóa chính |
| `assignmentId`| String | Khóa ngoại tới `Assignment`| Bài tập có câu làm sai |
| `questionId` | String | Khóa ngoại tới `Question` | Câu hỏi làm sai |
| `studentId` | String | Khóa ngoại tới `User` | ID học sinh |
| `topic` | String | | Chủ đề của câu hỏi làm sai để phân loại |
| `reason` | ReviewReason| | Nguyên nhân sai (`WRONG`, `SKIPPED`, `LONG_TIME`...) |
| `priority` | Int | `default(1)` | Độ ưu tiên cần ôn luyện lại |

---

## 3. Các Script và Lệnh Vận hành DB (Prisma CLI)

Hệ thống đã cấu hình sẵn các phím tắt lệnh trong `package.json`:

1. **Khởi tạo và cập nhật schema vào DB (Không chạy destructive migrations tự động)**:
   ```bash
   npm run db:migrate --name init_backend_v1
   ```
2. **Sinh mã nguồn Prisma Client (tự động cập nhật kiểu dữ liệu TS)**:
   ```bash
   npm run db:generate
   ```
3. **Nạp dữ liệu mẫu (Seeding) chương trình Toán 10**:
   ```bash
   npm run db:seed
   ```
4. **Mở trình duyệt trực quan cơ sở dữ liệu (Prisma Studio)**:
   ```bash
   npm run db:studio
   ```

---

## 4. Biến môi trường cần thiết

Thiết lập file `.env` tại thư mục gốc với nội dung:
```env
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>?schema=public"
```
*Lưu ý: Không bao giờ đẩy file `.env` chứa thông tin đăng nhập thực tế lên Git.*
