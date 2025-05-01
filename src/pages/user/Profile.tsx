import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, Key, ShoppingBag } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useShop } from '@/context/ShopContext';

const ProfilePage = () => {
  const { user } = useShop();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Đây là nơi bạn sẽ gọi API để cập nhật thông tin người dùng
    // Trong ví dụ này, chúng tôi sẽ giả lập thành công
    
    setTimeout(() => {
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật",
      });
      
      setIsEditing(false);
    }, 1000);
  };

  const handleCancel = () => {
    // Reset form data và tắt chế độ chỉnh sửa
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    setIsEditing(false);
  };

  // Tạo chữ cái đầu cho avatar fallback
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Tài khoản của tôi</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="text-2xl">{getInitials(user?.name || '')}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                
                <nav className="space-y-2">
                  <a href="#profile" className="flex items-center p-2 rounded-md hover:bg-gray-100 text-primary font-medium">
                    <User className="h-5 w-5 mr-3" />
                    <span>Thông tin cá nhân</span>
                  </a>
                  <a href="/orders" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    <span>Đơn hàng của tôi</span>
                  </a>
                  <a href="#security" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Key className="h-5 w-5 mr-3" />
                    <span>Bảo mật</span>
                  </a>
                  <a href="#settings" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Cài đặt</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="security">Bảo mật</TabsTrigger>
                <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Xem và cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Họ và tên</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true} // Email thường không thể thay đổi
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input 
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Địa chỉ</Label>
                          <Input 
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                    
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" type="button" onClick={handleCancel}>
                            Hủy
                          </Button>
                          <Button type="submit">Lưu thay đổi</Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button type="button" onClick={() => setIsEditing(true)}>
                            Chỉnh sửa
                          </Button>
                        </div>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật</CardTitle>
                    <CardDescription>
                      Quản lý mật khẩu và thiết lập bảo mật cho tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Đổi mật khẩu</h3>
                        <p className="text-sm text-gray-500">
                          Mật khẩu của bạn phải có ít nhất 8 ký tự và bao gồm số, chữ cái và ký tự đặc biệt
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Mật khẩu mới</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Đổi mật khẩu</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Tùy chọn</CardTitle>
                    <CardDescription>
                      Quản lý tùy chọn và cài đặt tài khoản
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Nhận thông báo qua email</h3>
                          <p className="text-sm text-gray-500">Nhận email về đơn hàng, ưu đãi đặc biệt và thông tin sản phẩm mới</p>
                        </div>
                        <Button variant="outline" size="sm">Quản lý</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Ngôn ngữ và khu vực</h3>
                          <p className="text-sm text-gray-500">Đặt ngôn ngữ và múi giờ cho tài khoản của bạn</p>
                        </div>
                        <Button variant="outline" size="sm">Thay đổi</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Xóa tài khoản</h3>
                          <p className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</p>
                        </div>
                        <Button variant="destructive" size="sm">Xóa tài khoản</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage; 