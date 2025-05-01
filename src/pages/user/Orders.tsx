import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { getUserOrders, Order, OrderStatus } from '@/lib/api/orderApi';

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'processing':
      return <Badge className="bg-blue-500">Đang xử lý</Badge>;
    case 'shipped':
      return <Badge className="bg-orange-500">Đang giao hàng</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500">Đã giao hàng</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Đã hủy</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>;
    case 'refunded':
      return <Badge className="bg-purple-500">Đã hoàn tiền</Badge>;
    default:
      return <Badge className="bg-gray-500">Không xác định</Badge>;
  }
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getUserOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
          <p className="text-gray-500">Quản lý và theo dõi các đơn hàng của bạn</p>
        </div>
        
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Đang tải đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Bạn chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6 text-center">
                Khi bạn mua sắm, đơn hàng của bạn sẽ xuất hiện ở đây để bạn có thể theo dõi trạng thái.
              </p>
              <Button className="px-6">Mua sắm ngay</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: vi })}
                    </TableCell>
                    <TableCell>{order.items.reduce((total, item) => total + item.quantity, 0)}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <FileText className="h-4 w-4 mr-1" /> Chi tiết
                      </Button>
                      {order.status === 'pending' && (
                        <Button variant="destructive" size="sm">
                          Hủy
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserOrdersPage;
