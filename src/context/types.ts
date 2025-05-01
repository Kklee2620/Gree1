import { UserProfile, ProductSummary, NotificationSummary } from '@/lib/api/types';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  thumbnailUrl?: string;
  subtotal: number;
}

export type ShopContextType = {
  // Thông tin người dùng
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Trạng thái giỏ hàng
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  
  // Chức năng giỏ hàng
  addToCart: (product: ProductSummary, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  
  // Ngôn ngữ và tìm kiếm
  language: string;
  currency: string;
  searchQuery: string;
  setLanguage: (language: string) => void;
  setCurrency: (currency: string) => void;
  setSearchQuery: (query: string) => void;
  
  // Sản phẩm yêu thích
  favorites: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isProductInFavorites: (productId: string) => boolean;
}; 