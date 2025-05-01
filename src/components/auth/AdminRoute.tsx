
import { Navigate } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useShop();
  const { toast } = useToast();
  
  // Checking if user is logged in and has admin role
  if (!user.isLoggedIn || user.role !== 'admin') {
    toast({
      title: "Truy cập bị từ chối",
      description: "Bạn không có quyền truy cập vào trang quản trị.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default AdminRoute;
