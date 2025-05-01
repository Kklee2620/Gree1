# Kế hoạch cải tiến dự án

## Phần Admin

### Ưu tiên cao
- [x] Triển khai Sequelize/TypeORM cho quản lý database
  - Mô tả: Chuyển đổi sang ORM để quản lý database hiệu quả hơn
  - Trạng thái: Đã hoàn thành
  - Timeline: 2 tuần

- [x] Thêm MFA cho tài khoản admin
  - Mô tả: Triển khai xác thực đa yếu tố để tăng cường bảo mật
  - Trạng thái: Đã hoàn thành
  - Timeline: 1 tuần

### Ưu tiên trung bình
- [x] Thêm indexing cho các trường thường xuyên tìm kiếm
  - Mô tả: Tối ưu hiệu năng truy vấn database
  - Trạng thái: Đã hoàn thành

## Phần Web-client

### Ưu tiên cao
- [x] Triển khai lazy loading cho hình ảnh
  - Mô tả: Cải thiện hiệu năng tải trang
  - Trạng thái: Đã hoàn thành
  - Timeline: 1 tuần

### Ưu tiên trung bình
- [ ] Cải thiện validation form
  - Mô tả: Tăng cường kiểm tra dữ liệu đầu vào
  - Trạng thái: Chưa bắt đầu

## Timeline tổng thể
- Tuần 1: Triển khai MFA và lazy loading
- Tuần 2-3: Triển khai ORM
- Tuần 4: Tối ưu database indexing