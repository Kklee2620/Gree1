
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import MainLayout from '@/components/layout/MainLayout';

const LoginPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Đăng nhập
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Hoặc{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                đăng ký tài khoản mới
              </Link>
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
