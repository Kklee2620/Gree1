import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Câu hỏi thường gặp</h1>
        <p className="text-gray-500 mb-12 text-center max-w-2xl mx-auto">
          Những câu hỏi phổ biến về sản phẩm, đơn hàng, thanh toán và vận chuyển
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Làm thế nào để đặt hàng trên trang web?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Để đặt hàng trên trang web của chúng tôi, bạn cần thực hiện các bước sau:
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Chọn sản phẩm bạn muốn mua và nhấp vào "Thêm vào giỏ hàng"</li>
                  <li>Đi đến giỏ hàng bằng cách nhấp vào biểu tượng giỏ hàng ở góc trên bên phải</li>
                  <li>Kiểm tra sản phẩm và số lượng, sau đó nhấp "Thanh toán"</li>
                  <li>Nhập thông tin giao hàng và thanh toán</li>
                  <li>Xem lại đơn hàng và nhấp "Đặt hàng" để hoàn tất</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Những phương thức thanh toán nào được chấp nhận?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau để mang lại sự thuận tiện cho bạn:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Thẻ tín dụng/thẻ ghi nợ (Visa, MasterCard, JCB)</li>
                  <li>Ví điện tử (MoMo, ZaloPay, VNPay)</li>
                  <li>Chuyển khoản ngân hàng</li>
                  <li>Thanh toán khi nhận hàng (COD)</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Thời gian giao hàng là bao lâu?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Thời gian giao hàng phụ thuộc vào khu vực của bạn:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Nội thành Hà Nội và TP.HCM: 1-2 ngày làm việc</li>
                  <li>Các thành phố lớn khác: 2-3 ngày làm việc</li>
                  <li>Khu vực khác: 3-5 ngày làm việc</li>
                </ul>
                Lưu ý: Thời gian giao hàng có thể bị ảnh hưởng bởi các điều kiện thời tiết, ngày lễ hoặc sự kiện đặc biệt.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Làm thế nào để theo dõi đơn hàng của tôi?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Sau khi đơn hàng của bạn được xác nhận, bạn sẽ nhận được email xác nhận kèm theo mã đơn hàng và thông tin theo dõi. Bạn có thể:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Đăng nhập vào tài khoản của bạn và truy cập phần "Đơn hàng của tôi"</li>
                  <li>Sử dụng công cụ theo dõi đơn hàng trên trang web với mã đơn hàng</li>
                  <li>Liên hệ với bộ phận hỗ trợ khách hàng qua email hoặc số điện thoại</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Chính sách đổi trả sản phẩm như thế nào?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Chúng tôi áp dụng chính sách đổi trả trong vòng 30 ngày kể từ ngày mua với các điều kiện sau:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Sản phẩm còn nguyên vẹn, không có dấu hiệu đã qua sử dụng</li>
                  <li>Còn đầy đủ tem, nhãn, bao bì gốc</li>
                  <li>Có hóa đơn mua hàng hoặc chứng từ mua hàng</li>
                </ul>
                Chúng tôi sẽ hoàn tiền hoặc đổi sản phẩm mới tùy thuộc vào yêu cầu của bạn và tình trạng hàng tồn kho.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Làm thế nào để tạo tài khoản?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Để tạo tài khoản, hãy làm theo các bước sau:
                <ol className="list-decimal ml-5 mt-2 space-y-1">
                  <li>Nhấp vào "Đăng ký" ở góc trên bên phải trang web</li>
                  <li>Nhập địa chỉ email, mật khẩu và thông tin cá nhân theo yêu cầu</li>
                  <li>Xác nhận email thông qua liên kết được gửi đến địa chỉ email của bạn</li>
                  <li>Đăng nhập và bắt đầu mua sắm!</li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 py-2 shadow-sm">
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                Tôi có thể hủy đơn hàng đã đặt không?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Có, bạn có thể hủy đơn hàng trong một số trường hợp:
                <ul className="list-disc ml-5 mt-2 space-y-1">
                  <li>Đơn hàng chưa được xác nhận: Bạn có thể hủy trực tiếp qua tài khoản</li>
                  <li>Đơn hàng đã xác nhận nhưng chưa giao cho đơn vị vận chuyển: Liên hệ với bộ phận CSKH để được hỗ trợ hủy</li>
                  <li>Đơn hàng đã giao cho đơn vị vận chuyển: Việc hủy đơn sẽ khó khăn hơn và có thể phát sinh phí vận chuyển</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg border">
            <h3 className="text-xl font-semibold mb-4">Bạn có câu hỏi khác?</h3>
            <p className="text-gray-600 mb-4">
              Nếu bạn không tìm thấy câu trả lời cho câu hỏi của mình, vui lòng liên hệ với chúng tôi qua:
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@vibrant.com" className="text-primary hover:underline">support@vibrant.com</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700">Hotline: 1900 1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQPage; 