
import React, { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default MainLayout;
