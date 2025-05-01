import { API_URL, getAuthHeaders, setAuthToken, removeAuthToken } from './index';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Đăng nhập
export const login = async (credentials: AuthCredentials): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include'
  });
  
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Email hoặc mật khẩu không chính xác');
    }
    throw new Error('Lỗi đăng nhập, vui lòng thử lại sau');
  }
  
  const data = await res.json();
  
  // Lưu token vào localStorage
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

// Đăng ký
export const register = async (userData: RegisterData): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    if (res.status === 409) {
      throw new Error('Email đã được sử dụng');
    }
    throw new Error(error.message || 'Lỗi đăng ký, vui lòng thử lại sau');
  }
  
  const data = await res.json();
  
  // Lưu token vào localStorage
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

// Đăng xuất
export const logout = async (): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
  } catch (error) {
    console.error('Lỗi khi gọi API đăng xuất:', error);
  } finally {
    // Luôn xóa token khỏi localStorage kể cả khi API lỗi
    removeAuthToken();
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        removeAuthToken();
        return null;
      }
      throw new Error('Lỗi lấy thông tin người dùng');
    }
    
    return res.json();
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    return null;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi cập nhật thông tin');
  }
  
  return res.json();
};

// Đổi mật khẩu
export const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> => {
  const res = await fetch(`${API_URL}/auth/password`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi đổi mật khẩu');
  }
  
  return res.json();
};

// ADMIN APIs

// Lấy danh sách người dùng (Admin API)
export const getAllUsers = async (
  page: number = 1, 
  limit: number = 10
): Promise<{ users: User[], total: number, pages: number }> => {
  const res = await fetch(`${API_URL}/admin/users?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi lấy danh sách người dùng');
  }
  
  return res.json();
};

// Lấy thông tin chi tiết người dùng (Admin API)
export const getUserById = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi lấy thông tin người dùng');
  }
  
  return res.json();
};

// Tạo người dùng mới (Admin API)
export const createUser = async (userData: RegisterData & { role?: 'user' | 'admin' }): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi tạo người dùng');
  }
  
  return res.json();
};

// Cập nhật thông tin người dùng (Admin API)
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi cập nhật người dùng');
  }
  
  return res.json();
};

// Vô hiệu hóa người dùng (Admin API)
export const deactivateUser = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/deactivate`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi vô hiệu hóa người dùng');
  }
  
  return res.json();
};

// Kích hoạt người dùng (Admin API)
export const activateUser = async (userId: string): Promise<User> => {
  const res = await fetch(`${API_URL}/admin/users/${userId}/activate`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi kích hoạt người dùng');
  }
  
  return res.json();
}; 