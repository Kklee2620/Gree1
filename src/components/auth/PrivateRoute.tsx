
import { Navigate } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useShop();
  const { toast } = useToast();
  
  if (!user.isLoggedIn) {
    toast({
      title: "Yêu cầu đăng nhập",
      description: "Bạn cần đăng nhập để truy cập trang này.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
