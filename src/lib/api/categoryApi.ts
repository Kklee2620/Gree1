import { CategoryNode } from './types';
import { API_URL, getAuthHeaders } from './index';

// Lấy danh sách danh mục
export const getCategories = async (): Promise<CategoryNode[]> => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) throw new Error('Lỗi lấy danh sách danh mục');
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Lấy chi tiết danh mục theo slug
export const getCategoryBySlug = async (slug: string): Promise<CategoryNode | null> => {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.category || null;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    return null;
  }
};

// Thêm danh mục mới (Admin API)
export const addCategory = async (category: Partial<CategoryNode>): Promise<CategoryNode> => {
  const res = await fetch(`${API_URL}/admin/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi thêm danh mục');
  }
  
  return res.json();
};

// Cập nhật danh mục (Admin API)
export const updateCategory = async (id: string, category: Partial<CategoryNode>): Promise<CategoryNode> => {
  const res = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi cập nhật danh mục');
  }
  
  return res.json();
};

// Xóa danh mục (Admin API)
export const deleteCategory = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include'
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Lỗi khi xóa danh mục');
  }
};
