import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deactivateUser, activateUser, User } from '@/lib/api/userApi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CustomerFormData {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
}

const AdminCustomers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(null);
  const [newCustomer, setNewCustomer] = useState<CustomerFormData>({ 
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setCustomers(data.users.filter(user => user.role === 'user'));
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast({ 
          title: 'Lỗi', 
          description: 'Không thể tải danh sách khách hàng. Vui lòng thử lại sau.', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [toast]);
  
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );
  
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.password) {
      toast({
        title: "Không thể thêm khách hàng",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc (tên, email, mật khẩu)",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSavingCustomer(true);
      const createdCustomer = await createUser({
        name: newCustomer.name,
        email: newCustomer.email,
        password: newCustomer.password,
        phone: newCustomer.phone,
        role: 'user'
      });
      
      setCustomers([...customers, createdCustomer]);
      
      toast({
        title: "Thêm khách hàng thành công",
        description: `Khách hàng "${createdCustomer.name}" đã được thêm vào hệ thống.`
      });
      
      setIsAddDialogOpen(false);
      setNewCustomer({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (error: any) {
      toast({
        title: "Lỗi khi thêm khách hàng",
        description: error.message || "Đã xảy ra lỗi khi thêm khách hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setSavingCustomer(false);
    }
  };
  
  const handleEditCustomer = async () => {
    if (!currentCustomer) return;
    
    try {
      setSavingCustomer(true);
      const updatedCustomer = await updateUser(currentCustomer.id, {
        name: currentCustomer.name,
        email: currentCustomer.email,
        phone: currentCustomer.phone
      });
      
      setCustomers(customers.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      ));
      
      toast({
        title: "Cập nhật khách hàng",
        description: `Thông tin khách hàng "${updatedCustomer.name}" đã được cập nhật.`
      });
      
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi khi cập nhật khách hàng",
        description: error.message || "Đã xảy ra lỗi khi cập nhật khách hàng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setSavingCustomer(false);
    }
  };
  
  const handleDeleteCustomer = async () => {
    if (!currentCustomer?.id) return;
    
    try {
      setDeletingCustomer(true);
      // Sử dụng deactivateUser thay vì xóa hoàn toàn
      await deactivateUser(currentCustomer.id);
      
      // Cập nhật danh sách khách hàng
      setCustomers(customers.map(customer => 
        customer.id === currentCustomer.id ? {...customer, isActive: false} : customer
      ));
      
      toast({
        title: "Vô hiệu hóa tài khoản",
        description: "Tài khoản khách hàng đã được vô hiệu hóa thành công."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Lỗi khi vô hiệu hóa tài khoản",
        description: error.message || "Đã xảy ra lỗi khi vô hiệu hóa tài khoản. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setDeletingCustomer(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      if (user.isActive) {
        await deactivateUser(user.id);
        toast({
          title: "Vô hiệu hóa tài khoản",
          description: "Tài khoản khách hàng đã được vô hiệu hóa thành công."
        });
      } else {
        await activateUser(user.id);
        toast({
          title: "Kích hoạt tài khoản",
          description: "Tài khoản khách hàng đã được kích hoạt thành công."
        });
      }
      
      // Cập nhật danh sách khách hàng
      setCustomers(customers.map(customer => 
        customer.id === user.id ? {...customer, isActive: !user.isActive} : customer
      ));
    } catch (error: any) {
      toast({
        title: "Lỗi khi thay đổi trạng thái tài khoản",
        description: error.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Danh sách khách hàng</h1>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khách hàng..."
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khách hàng mới</DialogTitle>
                  <DialogDescription>
                    Điền đầy đủ thông tin khách hàng vào các trường bên dưới.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Tên khách hàng
                    </Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Mật khẩu
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newCustomer.password}
                      onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleAddCustomer}
                    disabled={savingCustomer}
                  >
                    {savingCustomer ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Thêm khách hàng
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Đang tải danh sách khách hàng...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16">Không có khách hàng nào.</div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className={!customer.isActive ? "bg-muted/50" : ""}>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "Chưa cập nhật"}</TableCell>
                    <TableCell>
                      {format(new Date(customer.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </TableCell>
                    <TableCell>
                      {customer.isActive ? (
                        <span className="text-green-600 font-medium">Hoạt động</span>
                      ) : (
                        <span className="text-red-600 font-medium">Vô hiệu hóa</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setCurrentCustomer(customer);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant={customer.isActive ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleToggleUserStatus(customer)}
                        >
                          {customer.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin khách hàng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khách hàng "{currentCustomer?.name}"
            </DialogDescription>
          </DialogHeader>
          
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Tên khách hàng
                </Label>
                <Input
                  id="edit-name"
                  value={currentCustomer.name}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentCustomer.email}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="edit-phone"
                  value={currentCustomer.phone || ''}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleEditCustomer}
              disabled={savingCustomer}
            >
              {savingCustomer ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận vô hiệu hóa tài khoản</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn vô hiệu hóa tài khoản khách hàng "{currentCustomer?.name}"? Hành động này có thể hoàn tác sau.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              type="submit" 
              variant="destructive"
              onClick={handleDeleteCustomer}
              disabled={deletingCustomer}
            >
              {deletingCustomer ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Vô hiệu hóa tài khoản
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCustomers;