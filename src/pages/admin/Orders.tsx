import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { API_URL } from '@/lib/api';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: Date;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  items: OrderItem[];
  address: string;
  phone: string;
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'processing':
      return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">Đang xử lý</span>;
    case 'shipped':
      return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs">Đang vận chuyển</span>;
    case 'delivered':
      return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs">Đã giao hàng</span>;
    case 'cancelled':
      return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs">Đã hủy</span>;
    default:
      return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">Không xác định</span>;
  }
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, { credentials: 'include' });
        if (!res.ok) throw new Error('Lỗi lấy danh sách đơn hàng');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error: any) {
        toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: any) => {
    setCurrentOrder(order);
    setIsDetailsOpen(true);
  };

  const handleChangeStatusClick = (order: any) => {
    setCurrentOrder(order);
    setIsChangeStatusOpen(true);
  };

  const handleChangeStatus = (status: OrderStatus) => {
    if (!currentOrder) return;
    
    const updatedOrders = orders.map(order => 
      order.id === currentOrder.id ? { ...order, status } : order
    );
    
    setOrders(updatedOrders);
    setIsChangeStatusOpen(false);
    
    toast({
      title: "Trạng thái đơn hàng đã được cập nhật",
      description: `Đơn hàng ${currentOrder.id} đã được chuyển sang trạng thái mới.`
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="processing">Đang xử lý</SelectItem>
              <SelectItem value="shipped">Đang vận chuyển</SelectItem>
              <SelectItem value="delivered">Đã giao hàng</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-16">Đang tải đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">Không có đơn hàng nào.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Tổng tiền</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>{format(new Date(order.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>Chi tiết</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Dialog chi tiết đơn hàng có thể bổ sung sau */}
    </AdminLayout>
  );
};

export default AdminOrders;
