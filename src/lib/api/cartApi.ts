import { Cart, CartItem } from './types';
import { API_URL, getAuthHeaders } from './index';

// Lấy thông tin giỏ hàng hiện tại
export const getCart = async (): Promise<Cart> => {
  const res = await fetch(`${API_URL}/cart`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      // Người dùng chưa đăng nhập, trả về giỏ hàng rỗng
      return { items: [], totalAmount: 0, totalQuantity: 0 };
    }
    throw new Error('Lỗi lấy giỏ hàng');
  }
  
  return res.json();
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId: string, quantity: number = 1, variantId?: string): Promise<Cart> => {
  const res = await fetch(`${API_URL}/cart/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, quantity, variantId }),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi thêm vào giỏ hàng');
  }
  
  return res.json();
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (cartItemId: string, quantity: number): Promise<Cart> => {
  const res = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi cập nhật giỏ hàng');
  }
  
  return res.json();
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartItemId: string): Promise<Cart> => {
  const res = await fetch(`${API_URL}/cart/items/${cartItemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi xóa sản phẩm khỏi giỏ hàng');
  }
  
  return res.json();
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (): Promise<Cart> => {
  const res = await fetch(`${API_URL}/cart`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi xóa giỏ hàng');
  }
  
  return res.json();
};
