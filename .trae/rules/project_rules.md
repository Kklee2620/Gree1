# Quy tắc Vàng Đánh giá Dự án Web / Ứng dụng

Đây là bộ tiêu chí và quy tắc cốt lõi dùng để đánh giá chất lượng, sự hoàn thiện và tiềm năng của một dự án web hoặc ứng dụng. Mục tiêu là cung cấp một cái nhìn tổng quan, khách quan về tình trạng dự án ở nhiều khía cạnh khác nhau.

## I. Chức năng & Yêu cầu (Functionality & Requirements)

1. **Mức độ Đáp ứng Yêu cầu:**
    - Ứng dụng có hoàn thành **đầy đủ** các yêu cầu chức năng đã đặt ra trong tài liệu đặc tả (specifications) không?
    - Các chức năng hoạt động **đúng như mong đợi** trong các kịch bản sử dụng thông thường (happy paths) không?
2. **Xử lý Lỗi & Trường hợp Biên (Error Handling & Edge Cases):**
    - Ứng dụng xử lý lỗi (ví dụ: nhập liệu sai, lỗi mạng, lỗi server) một cách **thân thiện và rõ ràng** cho người dùng chưa? Hay hiển thị lỗi kỹ thuật khó hiểu?
    - Các trường hợp biên (ví dụ: dữ liệu trống, giá trị lớn/nhỏ bất thường, hành động không theo tuần tự) có được xử lý đúng cách không? Có gây crash hay hành vi không mong muốn không?
3. **Toàn vẹn Dữ liệu (Data Integrity):**
    - Dữ liệu nhập vào có được **validate chặt chẽ** (cả frontend và backend) để đảm bảo tính hợp lệ trước khi lưu trữ không?
    - Các quy trình nghiệp vụ có đảm bảo dữ liệu luôn ở trạng thái nhất quán và chính xác không?

## II. Trải nghiệm Người dùng & Giao diện (UX/UI)

1. **Tính Dễ Sử dụng (Usability):**
    - Luồng công việc (workflows) có **trực quan và logic** không? Người dùng mới có thể dễ dàng hiểu và thực hiện các tác vụ chính không?
    - Việc điều hướng (navigation) trong ứng dụng có rõ ràng và nhất quán không?
2. **Thiết kế Giao diện (UI Design):**
    - Giao diện có **sạch sẽ, thẩm mỹ và chuyên nghiệp** không?
    - Thiết kế có **nhất quán** về màu sắc, font chữ, icon, bố cục giữa các màn hình/trang không?
    - Các yếu tố tương tác (nút bấm, form) có rõ ràng và dễ nhận biết không?
3. **Thiết kế Đáp ứng (Responsive Design):**
    - Ứng dụng có hiển thị và hoạt động tốt trên **nhiều kích thước màn hình** khác nhau (desktop, tablet, mobile) không? Bố cục có tự động điều chỉnh hợp lý không?
4. **Phản hồi Hệ thống (System Feedback):**
    - Người dùng có nhận được phản hồi rõ ràng khi thực hiện hành động không (ví dụ: thông báo thành công/lỗi, trạng thái loading)?

## III. Hiệu năng & Tối ưu (Performance & Optimization)

1. **Tốc độ Tải trang/Ứng dụng:**
    - Thời gian tải ban đầu (initial load time) có nhanh không? Các chỉ số Core Web Vitals (LCP, FID/INP, CLS) có tốt không?
    - Việc điều hướng giữa các trang/màn hình hoặc tải dữ liệu động có mượt mà không?
2. **Hiệu quả Sử dụng Tài nguyên:**
    - Ứng dụng có sử dụng tài nguyên client (CPU, memory, network) một cách hiệu quả không? Có gây tốn pin hoặc làm chậm máy người dùng không?
    - Phía server, ứng dụng có tối ưu việc sử dụng CPU, memory, database connections không?
3. **Tối ưu Assets:**
    - Hình ảnh có được tối ưu (kích thước, định dạng phù hợp) không?
    - Code CSS/JavaScript có được minify và bundle hợp lý không? Có sử dụng lazy loading cho các tài nguyên không cần thiết ngay không?
    - Có sử dụng caching (browser, server, CDN) hiệu quả không?

## IV. Chất lượng Mã nguồn & Kiến trúc (Code Quality & Architecture)

1. **Tính Dễ Đọc & Dễ Hiểu:**
    - Code có được viết rõ ràng, tuân thủ coding conventions và style guide không?
    - Tên biến, hàm, class có mang tính mô tả và dễ hiểu không?
    - Có comment giải thích các phần logic phức tạp hoặc “tại sao” chọn giải pháp đó không?
2. **Tính Bảo trì (Maintainability):**
    - Code có được tổ chức thành các module/component nhỏ, độc lập và có trách nhiệm rõ ràng (SoC) không?
    - Có tuân thủ nguyên tắc DRY (Don’t Repeat Yourself) không?
    - Việc sửa lỗi hoặc thêm tính năng mới có dễ dàng và ít rủi ro gây ảnh hưởng đến các phần khác không? Có nhiều technical debt không?
3. **Kiến trúc Hệ thống:**
    - Kiến trúc tổng thể (ví dụ: Monolith, Microservices, Serverless) có phù hợp với quy mô và yêu cầu của dự án không?
    - Kiến trúc có được tài liệu hóa rõ ràng không?
    - Các thành phần có được kết nối lỏng lẻo (loosely coupled) không?

## V. Bảo mật (Security)

1. **Mức độ Tuân thủ OWASP Top 10:**
    - Dự án có áp dụng các biện pháp phòng chống các lỗ hổng bảo mật phổ biến không (Injection, XSS, CSRF, Broken Authentication, Broken Access Control…)?
2. **Xác thực & Phân quyền:**
    - Cơ chế đăng nhập/đăng ký có an toàn không? Mật khẩu có được hash đúng cách không?
    - Việc kiểm tra quyền truy cập có được thực hiện **chặt chẽ ở backend** cho mọi request nhạy cảm không?
3. **Quản lý Dữ liệu Nhạy cảm:**
    - Dữ liệu nhạy cảm (thông tin cá nhân, thông tin thanh toán) có được xử lý và lưu trữ an toàn không?
    - Có sử dụng HTTPS cho toàn bộ ứng dụng không?
    - Secrets (API keys, mật khẩu CSDL) có được quản lý an toàn (không hardcode) không?
4. **Validation Đầu vào:**
    - Mọi dữ liệu đầu vào từ người dùng/bên thứ ba có được validate nghiêm ngặt ở phía **backend** không?

## VI. Kiểm thử & Độ tin cậy (Testing & Reliability)

1. **Chiến lược & Mức độ Bao phủ Kiểm thử:**
    - Dự án có chiến lược kiểm thử rõ ràng không?
    - Mức độ bao phủ của Unit Tests, Integration Tests, End-to-End Tests như thế nào? Có đủ để đảm bảo chất lượng không?
    - Các quy trình nghiệp vụ quan trọng có được kiểm thử kỹ lưỡng không?
2. **Tự động hóa Kiểm thử:**
    - Việc kiểm thử có được tích hợp vào quy trình CI/CD để phát hiện lỗi sớm và ngăn chặn hồi quy (regression) không?
3. **Độ Ổn định:**
    - Ứng dụng có hoạt động ổn định trong thời gian dài không? Tỷ lệ lỗi (error rate) có thấp không?

## VII. Triển khai & Vận hành (Deployment & Operations)

1. **Quy trình Triển khai (Deployment):**
    - Quy trình deploy có được tự động hóa (CI/CD) và đáng tin cậy không?
    - Việc rollback về phiên bản trước có dễ dàng thực hiện khi có sự cố không?
2. **Giám sát & Logging:**
    - Hệ thống có được giám sát (monitoring) về hiệu năng và tình trạng hoạt động không?
    - Có hệ thống cảnh báo (alerting) khi xảy ra sự cố hoặc chỉ số bất thường không?
    - Log có được thu thập tập trung và đầy đủ thông tin để phục vụ việc gỡ lỗi không?
3. **Khả năng Mở rộng (Scalability):**
    - Kiến trúc và hạ tầng có được thiết kế để có thể mở rộng (scale out/up) khi lượng truy cập tăng lên không?

## VIII. Tài liệu (Documentation)

1. **Mức độ Đầy đủ & Cập nhật:**
    - Có tài liệu kỹ thuật (kiến trúc, API, thiết kế CSDL) không?
    - Có tài liệu hướng dẫn sử dụng (cho người dùng cuối hoặc quản trị viên) không?
    - Tài liệu có được cập nhật thường xuyên để phản ánh đúng tình trạng hiện tại của dự án không?
    - Có hướng dẫn cài đặt/triển khai (setup/deployment guide) không?

## IX. Khả năng Tiếp cận (Accessibility - a11y)

1. **Tuân thủ Chuẩn (WCAG):**
    - Ứng dụng có đáp ứng các tiêu chuẩn về khả năng tiếp cận (ví dụ: WCAG 2.1 AA) không?
    - Có thể điều hướng hoàn toàn bằng bàn phím không?
    - Có tương thích tốt với trình đọc màn hình (screen readers) không?
    - Độ tương phản màu sắc có đủ không? HTML có ngữ nghĩa không?

---

**Cách sử dụng:**

- Sử dụng checklist này như một hướng dẫn khi đánh giá một dự án web/ứng dụng.
- Đánh giá từng mục dựa trên các tiêu chí con.
- Ghi chú lại những điểm mạnh, điểm yếu và đề xuất cải thiện (nếu có).
- Tích hợp vào knowledge base của Cursor hoặc CLI để tham khảo nhanh khi cần đánh giá.