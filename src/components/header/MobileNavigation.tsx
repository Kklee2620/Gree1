import React from 'react';
import { Link } from 'react-router-dom';

interface MobileNavigationProps {
  isOpen: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  
  return (
    <nav className="md:hidden py-4 border-t mt-4">
      <ul className="flex flex-col space-y-4">
        <li>
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Trang chủ
          </Link>
        </li>
        <li>
          <Link to="/categories" className="text-sm font-medium hover:text-primary">
            Danh mục
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            Giới thiệu
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">
            Liên hệ
          </Link>
        </li>
        <li>
          <Link to="/faq" className="text-sm font-medium hover:text-primary">
            FAQ
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavigation;
