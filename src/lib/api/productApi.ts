import { ProductSummary, ProductDetail, SearchSuggestion } from './types';
import { API_URL, getAuthHeaders } from './index';

// Lấy danh sách sản phẩm
export const getProducts = async (): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/products`);
    
    if (!res.ok) {
      console.error(`Lỗi lấy danh sách sản phẩm: ${res.status}`);
      return []; // Trả về mảng rỗng khi request thất bại
    }
    
    const data = await res.json();
    // Đảm bảo dữ liệu trả về là mảng
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.products)) {
      return data.products;
    } else {
      console.error('Dữ liệu API không phải mảng', data);
      return []; // Trả về mảng rỗng khi dữ liệu không đúng định dạng
    }
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return []; // Trả về mảng rỗng để tránh lỗi trong component
  }
};

// Lấy chi tiết sản phẩm theo slug
export const getProduct = async (slug: string): Promise<ProductDetail | null> => {
  try {
    const res = await fetch(`${API_URL}/products/${slug}`);
    
    if (!res.ok) {
      throw new Error(`Không thể lấy thông tin sản phẩm: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm ${slug}:`, error);
    return null;
  }
};

// Alias cho getProduct để tương thích với các import hiện tại
export const getProductBySlug = async (slug: string): Promise<ProductDetail | null> => {
  return getProduct(slug);
};

// Lấy sản phẩm theo danh mục
export const getProductsByCategory = async (categorySlug: string): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/categories/${categorySlug}/products`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy sản phẩm theo danh mục: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm danh mục ${categorySlug}:`, error);
    return [];
  }
};

// Lấy các sản phẩm liên quan
export const getRelatedProducts = async (productId: string): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/products/${productId}/related`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy sản phẩm liên quan: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm liên quan:', error);
    return [];
  }
};

// Tìm kiếm sản phẩm
export const searchProducts = async (query: string): Promise<ProductSummary[]> => {
  if (!query || query.trim() === '') return [];
  
  try {
    const res = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error(`Lỗi tìm kiếm sản phẩm: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error(`Lỗi khi tìm kiếm sản phẩm "${query}":`, error);
    return [];
  }
};

// Lấy gợi ý tìm kiếm
export const searchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  if (!query || query.trim() === '') return [];
  
  try {
    const res = await fetch(`${API_URL}/search/suggestions?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy gợi ý tìm kiếm: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.suggestions || []);
  } catch (error) {
    console.error('Lỗi khi lấy gợi ý tìm kiếm:', error);
    return [];
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/products/featured`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy sản phẩm nổi bật: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm nổi bật:', error);
    return [];
  }
};

// Lấy sản phẩm mới
export const getNewProducts = async (): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/products/new`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy sản phẩm mới: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm mới:', error);
    return [];
  }
};

// Lấy sản phẩm bán chạy
export const getBestSellingProducts = async (): Promise<ProductSummary[]> => {
  try {
    const res = await fetch(`${API_URL}/products/bestselling`);
    
    if (!res.ok) {
      throw new Error(`Lỗi lấy sản phẩm bán chạy: ${res.status}`);
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : (data.products || []);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm bán chạy:', error);
    return [];
  }
};

// Thêm sản phẩm mới (Admin API)
export const addProduct = async (product: Partial<ProductDetail>): Promise<ProductDetail> => {
  try {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Lỗi khi thêm sản phẩm');
    }
    
    return res.json();
  } catch (error: any) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    throw error;
  }
};

// Cập nhật sản phẩm (Admin API)
export const updateProduct = async (id: string, product: Partial<ProductDetail>): Promise<ProductDetail> => {
  try {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Lỗi khi cập nhật sản phẩm');
    }
    
    return res.json();
  } catch (error: any) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    throw error;
  }
};

// Xóa sản phẩm (Admin API)
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Lỗi khi xóa sản phẩm');
    }
  } catch (error: any) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    throw error;
  }
};
