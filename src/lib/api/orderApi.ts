import { API_URL, getAuthHeaders } from './index';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

// Lấy danh sách đơn hàng của người dùng hiện tại
export const getUserOrders = async (): Promise<Order[]> => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Bạn cần đăng nhập để xem đơn hàng');
    }
    throw new Error('Lỗi lấy danh sách đơn hàng');
  }
  
  return res.json();
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  const res = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Bạn cần đăng nhập để xem đơn hàng');
    } else if (res.status === 403) {
      throw new Error('Bạn không có quyền xem đơn hàng này');
    }
    throw new Error('Lỗi lấy thông tin đơn hàng');
  }
  
  return res.json();
};

// Tạo đơn hàng mới (checkout)
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi tạo đơn hàng');
  }
  
  return res.json();
};

// Hủy đơn hàng
export const cancelOrder = async (orderId: string, reason?: string): Promise<Order> => {
  const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi hủy đơn hàng');
  }
  
  return res.json();
};

// ADMIN APIs

// Lấy tất cả đơn hàng (Admin API)
export const getAllOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: OrderStatus
): Promise<{ orders: Order[], total: number, pages: number }> => {
  let url = `${API_URL}/admin/orders?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }
  
  const res = await fetch(url, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi lấy danh sách đơn hàng');
  }
  
  return res.json();
};

// Cập nhật trạng thái đơn hàng (Admin API)
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> => {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes }),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi cập nhật trạng thái đơn hàng');
  }
  
  return res.json();
}; 