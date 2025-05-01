import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, Package, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getDashboardStats, getRecentOrders, getTopSellingProducts, DashboardStats } from '@/lib/api/statsApi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  amount: number;
  status: string;
}

interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
  imageUrl?: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API từ statsApi
        const statsData = await getDashboardStats();
        setStats(statsData);
        
        // Lấy đơn hàng gần đây
        const ordersData = await getRecentOrders(5);
        setRecentOrders(ordersData);
        
        // Lấy sản phẩm bán chạy
        const productsData = await getTopSellingProducts(5);
        setTopProducts(productsData.map(product => ({
          ...product,
          soldCount: product.totalSold
        })));
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Không thể lấy dữ liệu từ máy chủ');
        toast({
          title: "Lỗi kết nối",
          description: error.message || "Không thể lấy dữ liệu từ máy chủ. Vui lòng thử lại sau.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Trang quản trị</h1>
        <p className="text-gray-500">Xem tổng quan về hoạt động cửa hàng</p>
      </div>
      
      {loading ? (
        <div className="text-center py-16 flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Đang tải số liệu...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Tải lại
          </Button>
        </div>
      ) : !stats ? (
        <div className="text-center py-16 text-red-500">Không lấy được số liệu.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Tổng đơn hàng</CardTitle>
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Khách hàng mới</CardTitle>
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.newCustomers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Sản phẩm bán ra</CardTitle>
                <Package className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.productsSold}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Doanh thu</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats.revenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
            <CardDescription>5 đơn hàng mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-2" />
                      <Skeleton className="h-4 w-16 inline-block" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu đơn hàng gần đây.
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.date}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-right">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.amount)}
                      </div>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-block">
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
            <CardDescription>Top 5 sản phẩm bán chạy nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 border-b pb-3">
                    <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có dữ liệu sản phẩm bán chạy.
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex gap-3 border-b pb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">Đã bán: {product.totalSold} sản phẩm</div>
                    </div>
                    <div className="font-semibold">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
