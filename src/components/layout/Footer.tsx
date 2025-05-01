import React from 'react';
import { Link } from 'react-router-dom';

// Import logo trực tiếp
import logoYapee from '/images/yapee-logo.png';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src={logoYapee} 
                alt="Yapee" 
                className="h-12 w-auto" 
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Yapee cung cấp các sản phẩm chất lượng cao với giá cả phải chăng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">Trang chủ</Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-primary">Danh mục</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary">Liên hệ</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary">Chính sách vận chuyển</Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to="/payment" className="text-gray-600 hover:text-primary">Phương thức thanh toán</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary">Câu hỏi thường gặp</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>Địa chỉ: 74 đường số 13, Phường Bình Trị Đông B, quận Bình Tân, Thành phố Hồ Chí Minh</li>
              <li>Email: cskh@yapee.vn</li>
              <li>Hotline: 0333.938.014</li>
              <li>Thời gian làm việc: 8h00 - 19h00, từ Thứ Hai đến Chủ Nhật</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Yapee. Tất cả quyền được bảo lưu.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
