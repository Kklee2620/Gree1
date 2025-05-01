// Export API URL và các hằng số quan trọng trước
import { toast } from '@/components/ui/use-toast';

// API URL dựa vào môi trường 
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Các hàm tiện ích cơ bản
// Kiểm tra xác thực
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Lấy token xác thực từ localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Lưu token xác thực vào localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Xóa token xác thực khỏi localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Headers chuẩn cho các request cần xác thực
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Hàm tiện ích tạo độ trễ cho việc mô phỏng request API
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Export types first
export * from './types';
export * from './enums';
export * from './utils';

// Các kiểu dữ liệu chung
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  }
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hàm chung để gọi API
export const apiCall = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  showErrorToast: boolean = true
): Promise<T> => {
  const url = `${API_URL}/api${endpoint}`;
  const token = getAuthToken();
  
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Thêm token vào header nếu tồn tại
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include' // Cho phép gửi cookies
    };
    
    // Thêm body nếu là phương thức không phải GET
    if (method !== 'GET' && data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    // Kiểm tra lỗi từ server
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Lỗi không xác định' };
      }
      
      if (response.status === 401) {
        // Lỗi xác thực - xóa token và thông báo
        removeAuthToken();
        console.error('Lỗi xác thực:', errorData);
        if (showErrorToast) {
          toast({
            title: 'Phiên đăng nhập hết hạn',
            description: 'Vui lòng đăng nhập lại để tiếp tục.',
            variant: 'destructive'
          });
        }
      } else {
        console.error('Lỗi API:', errorData);
        if (showErrorToast) {
          toast({
            title: 'Đã xảy ra lỗi',
            description: errorData.message || 'Không thể thực hiện yêu cầu',
            variant: 'destructive'
          });
        }
      }
      
      throw new Error(errorData.message || 'Lỗi API');
    }
    
    // Xử lý phản hồi thành công
    return await response.json() as T;
  } catch (error) {
    console.error('Lỗi request:', error);
    if (showErrorToast) {
      toast({
        title: 'Đã xảy ra lỗi',
        description: error instanceof Error ? error.message : 'Không thể kết nối đến server',
        variant: 'destructive'
      });
    }
    throw error;
  }
};

// Các API endpoint
export const api = {
  // Xác thực
  auth: {
    login: (email: string, password: string) => 
      apiCall<{token: string, user: UserProfile}>('/auth/login', 'POST', { email, password }),
    
    register: (name: string, email: string, password: string) => 
      apiCall<{user: UserProfile}>('/auth/register', 'POST', { name, email, password }),
    
    logout: () => 
      apiCall<{message: string}>('/auth/logout', 'POST'),
    
    getProfile: () => 
      apiCall<{user: UserProfile}>('/auth/profile')
  },
  
  // Sản phẩm
  products: {
    getAll: (params?: {
      category?: string,
      search?: string,
      sort?: string,
      page?: number,
      limit?: number
    }) => {
      // Xây dựng query string từ params
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      return apiCall<{products: ProductSummary[]}>(`/products${queryString}`);
    },
    
    getById: (id: string) => 
      apiCall<{product: ProductSummary}>(`/products/${id}`),
    
    getByCategory: (categorySlug: string) => 
      apiCall<{products: ProductSummary[]}>(`/categories/${categorySlug}/products`)
  },
  
  // Danh mục
  categories: {
    getAll: () => 
      apiCall<{categories: {id: string, name: string, slug: string}[]}>('/categories'),
    
    getBySlug: (slug: string) => 
      apiCall<{category: {id: string, name: string, slug: string, description?: string}}>(`/categories/${slug}`)
  }
};

// Export the API module functions AFTER defining all helper functions
export * from './categoryApi';
export * from './productApi';
export * from './cartApi';
export * from './userApi';
export * from './orderApi';
export * from './statsApi';

// Export lại hàm searchSuggestions với tên getSearchSuggestions để tương thích với hooks
import { searchSuggestions } from './productApi';
export const getSearchSuggestions = searchSuggestions;

export default api;
