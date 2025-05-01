import React from 'react';
import { Link } from 'react-router-dom';

export const DesktopNavigation: React.FC = () => {
  return (
    <nav className="hidden md:flex space-x-6">
      <Link to="/" className="text-sm font-medium hover:text-primary">
        Trang chủ
      </Link>
      <Link to="/categories" className="text-sm font-medium hover:text-primary">
        Danh mục
      </Link>
      <Link to="/about" className="text-sm font-medium hover:text-primary">
        Giới thiệu
      </Link>
      <Link to="/contact" className="text-sm font-medium hover:text-primary">
        Liên hệ
      </Link>
      <Link to="/faq" className="text-sm font-medium hover:text-primary">
        FAQ
      </Link>
    </nav>
  );
};

export default DesktopNavigation;
