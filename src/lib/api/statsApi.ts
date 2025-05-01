import { API_URL, getAuthHeaders } from './index';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  newCustomers: number;
  productsSold: number;
  revenue: number;
  orderStats: OrderStats;
  salesByCategory: CategorySales[];
  salesByPeriod: PeriodSales[];
}

export interface OrderStats {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

export interface CategorySales {
  categoryId: string;
  categoryName: string;
  amount: number;
  percent: number;
}

export interface PeriodSales {
  period: string;
  amount: number;
  orders: number;
}

// Lấy thống kê tổng quan cho dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const res = await fetch(`${API_URL}/stats/dashboard`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Bạn không có quyền truy cập thông tin này');
      }
      throw new Error('Lỗi lấy thống kê dashboard');
    }
    
    return res.json();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê dashboard:', error);
    
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalUsers: 0,
      newCustomers: 0,
      productsSold: 0,
      revenue: 0,
      orderStats: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        refunded: 0
      },
      salesByCategory: [],
      salesByPeriod: []
    };
  }
};

// Lấy thống kê doanh thu theo thời gian
export const getRevenueBetweenDates = async (
  startDate: string,
  endDate: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
): Promise<PeriodSales[]> => {
  try {
    const url = `${API_URL}/stats/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`;
    
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Lỗi lấy thống kê doanh thu');
    }
    
    return res.json();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê doanh thu:', error);
    return [];
  }
};

// Lấy top sản phẩm bán chạy
export const getTopSellingProducts = async (
  limit: number = 5
): Promise<Array<{ id: string, name: string, totalSold: number, revenue: number, imageUrl?: string }>> => {
  try {
    const res = await fetch(`${API_URL}/stats/products/top-selling?limit=${limit}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Lỗi lấy top sản phẩm bán chạy');
    }
    
    return res.json();
  } catch (error) {
    console.error('Lỗi khi lấy top sản phẩm bán chạy:', error);
    return [];
  }
};

// Lấy danh sách đơn hàng gần đây
export const getRecentOrders = async (
  limit: number = 5
): Promise<Array<{ id: string, orderNumber: string, date: string, customerName: string, amount: number, status: string }>> => {
  try {
    const res = await fetch(`${API_URL}/stats/orders/recent?limit=${limit}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Lỗi lấy đơn hàng gần đây');
    }
    
    return res.json();
  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng gần đây:', error);
    return [];
  }
}; 