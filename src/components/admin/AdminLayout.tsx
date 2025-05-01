
import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  List
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, logout } = useShop();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/admin' },
    { icon: Package, name: 'Sản phẩm', path: '/admin/products' },
    { icon: List, name: 'Danh mục', path: '/admin/categories' },
    { icon: ShoppingCart, name: 'Đơn hàng', path: '/admin/orders' },
    { icon: Users, name: 'Khách hàng', path: '/admin/customers' },
    { icon: Settings, name: 'Cài đặt', path: '/admin/settings' },
  ];
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi tài khoản quản trị."
    });
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const Sidebar = () => (
    <div className={`flex flex-col h-full`}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {!isSidebarCollapsed && (
            <Link to="/admin" className="text-xl font-bold text-primary">
              ShopAdmin
            </Link>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
            className="hidden lg:flex"
          >
            {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMobileSidebar}
            className="lg:hidden"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isSidebarCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <Separator />
      
      <div className="p-4">
        {!isSidebarCollapsed ? (
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 mr-3 flex items-center justify-center">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              {user.name?.charAt(0) || 'A'}
            </div>
          </div>
        )}
        
        <Button
          variant="outline"
          className={`w-full flex items-center justify-center ${
            isSidebarCollapsed ? 'px-2' : 'px-4'
          }`}
          onClick={handleLogout}
        >
          <LogOut className={`h-4 w-4 ${isSidebarCollapsed ? '' : 'mr-2'}`} />
          {!isSidebarCollapsed && <span>Đăng xuất</span>}
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block bg-white border-r transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[80px]' : 'w-[250px]'
        }`}
      >
        <Sidebar />
      </aside>
      
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${
          isMobileSidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={toggleMobileSidebar}
      ></div>
      
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r z-50 transition-all duration-300 w-[250px] lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b">
          <div className="px-4 py-3 flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileSidebar}
            >
              <Menu size={16} />
            </Button>
            
            <div className="text-lg font-semibold lg:hidden">ShopAdmin</div>
            
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <a href="/" target="_blank">Xem cửa hàng</a>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
