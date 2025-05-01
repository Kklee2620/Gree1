# Phân tích chi tiết Giao diện Người dùng (UI): Nền tảng Yapee

## 1. Giới thiệu

Báo cáo này cung cấp phân tích chi tiết về thiết kế Giao diện Người dùng (UI), các thành phần, bố cục, màu sắc và luồng tương tác người dùng cho cả Giao diện Web Khách hàng (`web-client-new`) và Bảng điều khiển Quản trị (`quan-ly-dashboard`) của nền tảng thương mại điện tử Yapee, dựa trên mã nguồn được cung cấp.

## 2. Phân tích UI Giao diện Web Khách hàng (`web-client-new`)

**2.1. Thiết kế & Bố cục Tổng thể:**

*   **Cấu trúc:** Tuân theo bố cục thương mại điện tử tiêu chuẩn: Header cố định (Sticky Header), Sidebar tùy chọn (cho điều hướng danh mục), Khu vực Nội dung Chính, và Footer.
*   **Thiết kế Đáp ứng (Responsive):** Bố cục tự điều chỉnh cho các kích thước màn hình khác nhau. Các thay đổi chính bao gồm:
    *   Header thu gọn các biểu tượng và giới thiệu nút menu di động.
    *   Thanh tìm kiếm di chuyển xuống dưới header chính trên di động.
    *   Sidebar bị ẩn trên di động, có thể được thay thế bằng menu di động.
    *   Lưới (ví dụ: lưới sản phẩm, cột footer) điều chỉnh số lượng cột.
*   **Hệ thống Lưới Bố cục (Layout Grid System):**
    *   Sử dụng các tiện ích `container` và `grid` của Tailwind để tạo cấu trúc bố cục nhất quán.
    *   Container chính được căn giữa với lề tự động.
    *   Lưới sản phẩm thay đổi từ 1 cột trên di động sang 2-4 cột trên màn hình lớn hơn.
    *   Footer sử dụng lưới đáp ứng, thay đổi từ 1 cột trên di động sang 4-5 cột trên máy tính.
*   **Hệ thống Khoảng cách (Spacing Hierarchy):**
    *   Khoảng cách nhất quán sử dụng thang đo của Tailwind: khoảng cách nhỏ hơn (`gap-2`, `gap-4`) cho các mục liên quan, khoảng cách lớn hơn (`p-6`, `my-8`) giữa các phần chính.
    *   Duy trì nhịp điệu dọc với lề nhất quán giữa các phần của trang.
*   **Styling:** Sử dụng Tailwind CSS cho styling theo hướng tiện ích (utility-first), tạo ra giao diện sạch sẽ và hiện đại.
*   **Các Thành phần Bố cục Chính:**
    *   `Layout.tsx`: Điều phối cấu trúc chính (Header, Sidebar, Nội dung chính, Footer, CartDrawer).
    *   `Header.tsx`: Header đa phần với thanh trên cùng (khuyến mãi, link xác thực, ngôn ngữ), điều hướng chính (logo, tìm kiếm, biểu tượng), và tìm kiếm/menu dành riêng cho di động.
    *   `Sidebar.tsx`: Điều hướng danh mục chuyên dụng với mega menu kích hoạt khi di chuột cho các danh mục con (chỉ trên máy tính).
    *   `Footer.tsx`: Footer toàn diện với các điểm nổi bật về dịch vụ, thông tin liên hệ, link điều hướng (danh mục, thông tin, dịch vụ khách hàng), đăng ký nhận tin, phương thức thanh toán, và bản quyền.
    *   `CartDrawer.tsx`: Một bảng điều khiển trượt ra (có thể được kích hoạt từ biểu tượng giỏ hàng trên header) để xem và quản lý giỏ hàng nhanh chóng.

**2.2. Thành phần & Tính năng UI chính:**

*   **Điều hướng:**
    *   Header cung cấp điều hướng chính (Logo, Tìm kiếm, Giỏ hàng, Người dùng, Yêu thích, Thông báo).
    *   Sidebar cung cấp duyệt danh mục chi tiết với mega menu đa cấp.
    *   Footer chứa các link điều hướng phụ.
    *   Menu di động cung cấp quyền truy cập vào danh mục và các link chính trên màn hình nhỏ hơn.
*   **Trang chủ (`HomePage.tsx`):**
    *   `Hero.tsx`: Carousel ảnh đáp ứng, tự động phát với lớp phủ văn bản và nút kêu gọi hành động.
    *   `PromoBanner.tsx`: Có thể là các banner quảng cáo tĩnh.
    *   `ProductSection.tsx`: Thành phần tái sử dụng để hiển thị lưới sản phẩm (ví dụ: Nổi bật, Mới về) với tiêu đề và link.
    *   `CategoryBanner.tsx`: Hiển thị các danh mục sản phẩm chính một cách trực quan.
    *   `DealSection.tsx`: Nổi bật các sản phẩm có ưu đãi hoặc giảm giá đặc biệt.
*   **Hiển thị sản phẩm:**
    *   `ProductCard.tsx`: Bố cục thẻ tiêu chuẩn hiển thị hình ảnh, tên, giá (gốc/giảm giá), đánh giá, và huy hiệu (Mới, Bán chạy, Giảm giá %). Bao gồm hiệu ứng di chuột để hiển thị các hành động nhanh (Thêm vào giỏ hàng, Thêm vào yêu thích).
    *   `ProductGrid.tsx`: Có thể được sử dụng trong `ProductSection` để sắp xếp các thành phần `ProductCard` thành lưới.
*   **Yếu tố tương tác:**
    *   Nút bấm: Được tạo kiểu nhất quán bằng Tailwind, với các hành động chính thường sử dụng màu cam nhấn.
    *   Form (`AddressForm.tsx`, `PaymentForm.tsx`, `ReviewForm.tsx`): Sử dụng `react-hook-form` và `zod` cho cấu trúc và xác thực.
    *   Tìm kiếm (`SearchInput.tsx`, Header): Thanh tìm kiếm tích hợp.
    *   Bộ chuyển đổi ngôn ngữ (`LanguageSwitcher.tsx`): Cho phép người dùng thay đổi ngôn ngữ giao diện (sử dụng `i18next`).
    *   Thông báo (`react-hot-toast`): Được sử dụng để phản hồi (ví dụ: sản phẩm đã được thêm vào giỏ hàng).

**2.3. Luồng tương tác người dùng:**

*   **Khám phá sản phẩm:** Người dùng vào Trang chủ -> Tương tác với slider Hero/Banner quảng cáo -> Duyệt các Khu vực sản phẩm (Nổi bật, Mới) -> Sử dụng Sidebar/Banner danh mục để điều hướng danh mục -> Sử dụng thanh tìm kiếm -> Nhấp vào `ProductCard` để xem chi tiết.
*   **Thêm vào giỏ hàng:** Người dùng xem `ProductCard` (trên danh sách hoặc trang chi tiết) -> Nhấp nút "Thêm vào giỏ hàng" -> Nhận phản hồi trực quan (trạng thái tải/thành công) -> Số lượng giỏ hàng cập nhật trên header -> Thông báo toast xác nhận việc thêm.
*   **Quản lý giỏ hàng:** Người dùng nhấp vào biểu tượng giỏ hàng trên header -> `CartDrawer` trượt vào -> Người dùng có thể xem các mặt hàng, điều chỉnh số lượng, hoặc tiến hành thanh toán.
*   **Xác thực:** Người dùng nhấp Đăng nhập/Đăng ký trên thanh trên cùng -> Điều hướng đến trang xác thực tương ứng -> Hoàn thành form -> Chuyển hướng đến trang trước đó hoặc trang tổng quan tài khoản.
*   **Quy trình thanh toán:** Giỏ hàng -> Nhập địa chỉ -> Chi tiết thanh toán -> Xác nhận đơn hàng (dựa trên cấu trúc thành phần).
*   **Quản lý tài khoản:** Người dùng truy cập trang tài khoản -> Xem đơn hàng, danh sách yêu thích, chi tiết cá nhân (dựa trên cấu trúc trang).

**2.4. Yếu tố Thiết kế Trực quan:**

*   **Bảng màu (Color Scheme):**
    *   **Màu chính:** Cam (HSL: 24, 96%, 53% hoặc hex: #ff6600) được sử dụng cho thương hiệu, nút bấm và các điểm nhấn.
    *   **Biến thể màu chính:** Các biến thể Tối (#e65c00) và Sáng (#ff8533) cho trạng thái di chuột và các điểm nhấn khác.
    *   **Màu phụ:** Xanh dương (HSL: 230, 48%, 47% hoặc hex: #3f51b5) được sử dụng hạn chế cho các hành động phụ.
    *   **Màu trung tính:** Nền trắng, văn bản màu xám (nhiều sắc độ) và đường viền.
    *   **Màu ngữ nghĩa:** Đỏ (#ef4444) cho giảm giá/lỗi, Xanh lá (#22c55e) cho trạng thái thành công, Vàng (#f59e0b) cho đánh giá.
    *   **Hỗ trợ Chế độ tối (Dark Mode):** Các biến CSS được định nghĩa cho chế độ tối, mặc dù việc triển khai có thể chưa hoàn chỉnh.
*   **Kiểu chữ (Typography):**
    *   **Font chữ:** Inter (sans-serif) là font chữ chính.
    *   **Kích thước chữ phân cấp:** Theo thang đo của Tailwind từ xs đến 4xl.
    *   **Độ đậm của Font:** Regular (400), Medium (500), Bold (700) cho các mức độ nhấn mạnh khác nhau.
*   **Biểu tượng (Iconography):** Sử dụng biểu tượng Lucide React xuyên suốt để đảm bảo tính nhất quán.
*   **Khoảng cách & Bố cục:** Đệm và lề nhất quán sử dụng thang đo khoảng cách của Tailwind.
*   **Phản hồi Trực quan:** Trạng thái di chuột, chỉ báo tải, trạng thái thành công/lỗi cho các yếu tố tương tác.
*   **Đổ bóng & Độ nổi (Shadows & Elevation):** Bóng đổ nhẹ cho thẻ và trạng thái di chuột, tạo độ sâu tinh tế.
*   **Bo góc (Border Radius):** Bo góc nhất quán (0.5rem hoặc 8px) cho các yếu tố UI, tạo vẻ ngoài hiện đại, thân thiện.

## 3. Phân tích UI Bảng điều khiển Quản trị (`quan-ly-dashboard`)

**3.1. Thiết kế & Bố cục Tổng thể:**

*   **Cấu trúc:** Tuân theo bố cục dashboard quản trị tiêu chuẩn: Sidebar cố định (điều hướng), Header (tìm kiếm, thông báo, menu người dùng), và Khu vực Nội dung Chính.
*   **Tổ chức Bố cục:**
    *   Bố cục ứng dụng toàn chiều cao với sidebar cố định bên trái.
    *   Khu vực nội dung chiếm phần chiều rộng còn lại với header cố định ở trên cùng.
    *   Khu vực nội dung chính cuộn độc lập với đệm để tách biệt nội dung.
    *   Dashboard sử dụng bố cục lưới cho các thẻ thống kê (1-4 cột tùy thuộc vào kích thước màn hình) và các phần biểu đồ.
*   **Hệ thống Khoảng cách:**
    *   Khoảng cách nhất quán với thang đo của Tailwind.
    *   Đệm nội dung (`p-6`) tạo không gian thoáng xung quanh tất cả nội dung.
    *   Các thành phần thẻ sử dụng đệm nội bộ nhất quán (`p-4`) và khoảng cách giữa các yếu tố.
    *   Bảng và các giao diện nhiều dữ liệu sử dụng khoảng cách chặt chẽ hơn để đạt hiệu quả.
*   **Styling:** Sử dụng Tailwind CSS với các thành phần Shadcn UI (xây dựng trên Radix UI primitives), cung cấp giao diện quản trị hiện đại, gắn kết.
*   **Các Thành phần Bố cục Chính:**
    *   `MainLayout.tsx`: Điều phối cấu trúc chính (Sidebar, Header, Nội dung chính).
    *   `Header.tsx`: Chứa chức năng tìm kiếm, bộ chuyển đổi ngôn ngữ, thông báo, và menu thả xuống của người dùng.
    *   `Sidebar.tsx`: Menu điều hướng có thể thu gọn với biểu tượng và nhãn cho các phần quản trị khác nhau.

**3.2. Thành phần & Tính năng UI chính:**

*   **Điều hướng:**
    *   Sidebar cung cấp điều hướng chính với biểu tượng và nhãn cho các phần khác nhau (Dashboard, Sản phẩm, Đơn hàng, Người dùng, Báo cáo, Thống kê, Cài đặt).
    *   Sidebar có thể được thu gọn để chỉ hiển thị biểu tượng, tối đa hóa không gian nội dung.
    *   Header chứa các hành động liên quan đến người dùng (thông báo, menu hồ sơ).
*   **Tổng quan Dashboard (`Dashboard.tsx`):**
    *   `StatsCard.tsx`: Hiển thị các chỉ số chính (doanh thu, đơn hàng, sản phẩm, người dùng) với chỉ báo thay đổi.
    *   `SalesChart.tsx`: Trực quan hóa dữ liệu bán hàng theo thời gian.
    *   Danh sách sản phẩm bán chạy nhất.
*   **Bảng Quản lý Dữ liệu:**
    *   `ProductsTable.tsx`: Bảng toàn diện để quản lý sản phẩm với tìm kiếm, lọc danh mục, và các thao tác CRUD. Hiển thị hình ảnh sản phẩm, chi tiết, giá cả, tồn kho, và huy hiệu trạng thái.
    *   `OrdersTable.tsx`: Bảng để quản lý đơn hàng với tìm kiếm, lọc trạng thái, và xem chi tiết. Hiển thị ID đơn hàng, khách hàng, ngày, tổng tiền, trạng thái với huy hiệu được mã hóa màu.
    *   `UsersTable.tsx`: Có thể là bảng tương tự để quản lý người dùng.
*   **Thành phần Chi tiết & Form:**
    *   `ProductForm.tsx`: Form để thêm/chỉnh sửa chi tiết sản phẩm.
    *   `OrderDetails.tsx`: Dialog modal hiển thị thông tin đơn hàng toàn diện.
    *   `SettingsForm.tsx`: Có thể dùng để cấu hình hệ thống.
*   **Trực quan hóa Dữ liệu:**
    *   Các thành phần biểu đồ khác nhau trong thư mục `statistics` và `reports` để trực quan hóa dữ liệu.
    *   `ReportChart.tsx`, `RevenueStats.tsx`, `ProductStats.tsx`, v.v.
*   **Thư viện Thành phần UI:**
    *   Bộ sưu tập phong phú các thành phần UI tái sử dụng trong thư mục `ui` (nút, thẻ, dialog, dropdown, bảng, v.v.).
    *   Dựa trên Shadcn UI, cung cấp các thành phần dễ tiếp cận và tùy chỉnh được xây dựng trên Radix UI primitives.

**3.3. Luồng tương tác người dùng:**

*   **Tổng quan Dashboard:** Quản trị viên đăng nhập -> Vào Dashboard -> Xem các chỉ số và biểu đồ chính -> Điều hướng đến các phần cụ thể khi cần.
*   **Quản lý Sản phẩm:** Quản trị viên điều hướng đến phần Sản phẩm -> Xem bảng sản phẩm -> Tìm kiếm/lọc sản phẩm -> Thêm sản phẩm mới (mở form) hoặc chỉnh sửa/xóa các sản phẩm hiện có.
*   **Xử lý Đơn hàng:** Quản trị viên điều hướng đến phần Đơn hàng -> Xem bảng đơn hàng -> Lọc theo trạng thái -> Xem chi tiết đơn hàng -> Cập nhật trạng thái đơn hàng (ví dụ: từ "pending" sang "shipped").
*   **Quản lý Người dùng:** Quản trị viên điều hướng đến phần Người dùng -> Xem bảng người dùng -> Tìm kiếm/lọc người dùng -> Xem hoặc chỉnh sửa chi tiết người dùng.
*   **Báo cáo & Phân tích:** Quản trị viên điều hướng đến Báo cáo/Thống kê -> Xem các biểu đồ và trực quan hóa dữ liệu khác nhau -> Có thể xuất dữ liệu.
*   **Cấu hình Hệ thống:** Quản trị viên điều hướng đến Cài đặt -> Cấu hình các tham số hệ thống.

**3.4. Yếu tố Thiết kế Trực quan:**

*   **Bảng màu (Color Scheme):**
    *   **Màu chính:** Xanh dương (HSL: 221.2, 83%, 53.3% hoặc khoảng #3b82f6) được sử dụng cho nút bấm, link và trạng thái hoạt động.
    *   **Màu Sidebar:** Sidebar sử dụng màu xanh dương chính làm nền với văn bản màu trắng để tạo độ tương phản.
    *   **Màu ngữ nghĩa:** Xanh lá cho thành công/trạng thái tích cực, Đỏ cho lỗi/hành động hủy hoại, Vàng cho cảnh báo, Xanh dương cho thông tin.
    *   **Màu trạng thái:** Huy hiệu được mã hóa màu cho trạng thái đơn hàng (vàng cho đang chờ xử lý, xanh dương cho đã giao hàng, xanh lá cho đã hoàn thành, đỏ cho đã hủy).
    *   **Màu trung tính:** Nền trắng, màu xám tinh tế cho đường viền và các yếu tố phụ.
    *   **Hỗ trợ Chế độ tối (Dark Mode):** Các biến màu chế độ tối được định nghĩa toàn diện, có thể được chuyển đổi thông qua next-themes.
*   **Kiểu chữ (Typography):**
    *   **Font chữ:** Nhất quán với giao diện web khách hàng (Inter).
    *   **Phân cấp văn bản:** Phân biệt rõ ràng giữa tiêu đề, văn bản nội dung và nhãn.
    *   **Trình bày dữ liệu:** Nhấn mạnh khả năng đọc cho các giao diện nhiều dữ liệu với kích thước và khoảng cách phù hợp.
*   **Biểu tượng (Iconography):** Sử dụng biểu tượng Lucide React xuyên suốt để đảm bảo tính nhất quán.
*   **Trực quan hóa Dữ liệu:** Sử dụng Recharts cho các biểu đồ và đồ thị với phong cách nhất quán phù hợp với bảng màu tổng thể.
*   **Yếu tố Tương tác:**
    *   Nút bấm, dropdown và các điều khiển form từ thư viện Shadcn UI, mang lại giao diện và cảm nhận gắn kết.
    *   Các hoạt ảnh tùy chỉnh được định nghĩa cho các tương tác (fade-in, slide-in, scale-in).
    *   Hiệu ứng di chuột cho các yếu tố tương tác (hover-scale, hover-card, table-row-hover).
*   **Bo góc (Border Radius):** Bo góc nhất quán (0.5rem) cho các yếu tố UI, phù hợp với giao diện web khách hàng.
*   **Đổ bóng & Độ nổi (Shadows & Elevation):** Bóng đổ tinh tế cho thẻ, dropdown và dialog để tạo phân cấp trực quan.

## 4. Phân tích So sánh

**4.1. Yếu tố Thiết kế Chung:**

*   Cả hai giao diện đều sử dụng React, TypeScript, và Tailwind CSS.
*   Cả hai đều hỗ trợ đa ngôn ngữ thông qua i18next.
*   Cả hai đều sử dụng Lucide React cho biểu tượng.
*   Cả hai đều triển khai các nguyên tắc thiết kế đáp ứng.
*   Cả hai đều sử dụng bo góc (0.5rem) và thang đo khoảng cách nhất quán.
*   Cả hai đều định nghĩa các biến màu cho chế độ sáng và tối.

**4.2. Khác biệt Chính:**

*   **Mục đích & Trọng tâm:**
    *   Web Client: Tối ưu hóa cho việc khám phá sản phẩm, duyệt web và mua hàng. Nhấn mạnh sự hấp dẫn trực quan và dễ dàng điều hướng.
    *   Admin Dashboard: Tối ưu hóa cho việc quản lý dữ liệu, giám sát và các tác vụ quản trị. Nhấn mạnh mật độ thông tin và quy trình làm việc hiệu quả.
*   **Thư viện Thành phần:**
    *   Web Client: Sử dụng nhiều thành phần tùy chỉnh hơn với styling Tailwind.
    *   Admin Dashboard: Tận dụng Shadcn UI (xây dựng trên Radix UI) cho các thành phần nhất quán, dễ tiếp cận.
*   **Bố cục:**
    *   Web Client: Bố cục thương mại điện tử truyền thống với trọng tâm là hiển thị sản phẩm.
    *   Admin Dashboard: Giao diện giống ứng dụng với điều hướng cố định và các chế độ xem tập trung vào dữ liệu.
*   **Màu sắc & Styling:**
    *   Web Client: Rực rỡ hơn với màu sắc thương hiệu (cam #ff6600) được làm nổi bật.
    *   Admin Dashboard: Giao diện chuyên nghiệp hơn với màu xanh dương (#3b82f6) làm màu chính và sử dụng màu sắc chức năng (chỉ báo trạng thái, biểu đồ).
*   **Hoạt ảnh & Tương tác:**
    *   Admin Dashboard định nghĩa các hoạt ảnh rõ ràng hơn (fade-in, slide-in, scale-in) cho các tương tác UI.
    *   Web Client tập trung nhiều hơn vào hiệu ứng di chuột và chuyển tiếp cho việc hiển thị sản phẩm.

**4.3. Điểm Tích hợp:**

*   Cả hai giao diện đều kết nối đến cùng một API backend.
*   Các thay đổi được thực hiện trong Admin Dashboard (ví dụ: cập nhật sản phẩm, thay đổi trạng thái đơn hàng) sẽ được phản ánh trong Web Client.
*   Cấu trúc dữ liệu chung (sản phẩm, đơn hàng, người dùng) nhưng được trình bày khác nhau dựa trên ngữ cảnh và nhu cầu người dùng.

## 5. Triển khai Thực tiễn Tốt nhất về UI

**5.1. Điểm mạnh:**

*   **Tái sử dụng Thành phần:** Cả hai giao diện đều sử dụng phương pháp tiếp cận thành phần mô-đun, thúc đẩy tính nhất quán và khả năng bảo trì.
*   **Thiết kế Đáp ứng:** Các điều chỉnh cho các kích thước màn hình khác nhau được triển khai xuyên suốt.
*   **Cân nhắc về Khả năng Tiếp cận (Accessibility):** Sử dụng HTML ngữ nghĩa, thuộc tính ARIA (đặc biệt là trong Admin Dashboard với các thành phần Radix UI).
*   **Đa ngôn ngữ:** Hỗ trợ tích hợp cho nhiều ngôn ngữ.
*   **Phản hồi Trực quan:** Trạng thái tải, chỉ báo thành công/lỗi, và hiệu ứng di chuột cung cấp phản hồi rõ ràng cho người dùng.
*   **Styling Nhất quán:** Sử dụng các lớp tiện ích Tailwind đảm bảo khoảng cách, màu sắc và kiểu chữ nhất quán.
*   **Hệ thống Màu sắc:** Các biến màu được định nghĩa rõ ràng với ý nghĩa ngữ nghĩa và hỗ trợ chế độ tối.

**5.2. Cải tiến Tiềm năng:**

*   **Chế độ tối (Dark Mode):** Có thể được triển khai đầy đủ cho cả hai giao diện (các biến đã được định nghĩa nhưng việc triển khai có thể chưa hoàn chỉnh).
*   **Tối ưu hóa Hiệu suất:** Tiềm năng cho việc tách mã (code splitting) và tải lười (lazy loading) các thành phần.
*   **Hoạt ảnh:** Các hoạt ảnh tinh tế hơn có thể nâng cao trải nghiệm người dùng, đặc biệt là cho các chuyển tiếp giữa các trạng thái.
*   **Tải Khung xương (Skeleton Loading):** Có thể được triển khai để có trải nghiệm tải tốt hơn.
*   **Độ tương phản Màu sắc:** Đảm bảo tất cả các kết hợp màu sắc đáp ứng tiêu chuẩn tiếp cận WCAG, đặc biệt là văn bản trên nền màu.

## 6. Kết luận

Nền tảng thương mại điện tử Yapee có hai giao diện người dùng riêng biệt nhưng bổ trợ cho nhau: một Giao diện Web Khách hàng được tối ưu hóa cho việc mua sắm và một Bảng điều khiển Quản trị toàn diện để quản lý nền tảng. Cả hai giao diện đều thể hiện các phương pháp phát triển web hiện đại với React, TypeScript và Tailwind CSS, đồng thời mỗi giao diện được điều chỉnh cho phù hợp với nhu cầu và quy trình làm việc cụ thể của người dùng.

Giao diện Web Khách hàng cung cấp trải nghiệm mua sắm hấp dẫn với điều hướng trực quan, hiển thị sản phẩm hấp dẫn về mặt hình ảnh và quy trình thanh toán hợp lý. Bảng màu dựa trên màu cam tạo cảm giác ấm áp, năng động phù hợp với bán lẻ. Bảng điều khiển Quản trị cung cấp các công cụ mạnh mẽ để quản lý sản phẩm, đơn hàng, người dùng và phân tích hiệu suất kinh doanh thông qua giao diện sạch sẽ, tập trung vào dữ liệu với bảng màu xanh dương chuyên nghiệp.

Cùng nhau, các giao diện này tạo thành một hệ sinh thái thương mại điện tử hoàn chỉnh, cân bằng giữa trải nghiệm khách hàng và kiểm soát quản trị, được thống nhất bởi các nguyên tắc thiết kế nhất quán nhưng được phân biệt bởi bố cục và bảng màu dành riêng cho mục đích.
