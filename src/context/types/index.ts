// Core types for user, products, and app settings
export type Language = {
  code: string;
  name: string;
};

export type Currency = {
  code: string;
  symbol: string;
};

// User related types
export type UserRole = 'user' | 'admin';

export type UserProfileSummary = {
  isLoggedIn: boolean;
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: UserRole;
  token?: string;
};

export type NotificationSummary = {
  unreadCount: number;
};

// Shopping related types
export type ProductOption = {
  name: string; 
  value: string;
};

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  options: ProductOption[];
  lineTotal: number;
  stock: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  currency: string;
};

export type FavoriteItem = {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
  addedAt: Date;
};

// Main context type
export type ShopContextType = {
  // User state
  user: UserProfileSummary;
  notifications: NotificationSummary;
  login: (userData: UserProfileSummary) => void;
  logout: () => void;
  
  // Cart state
  cart: Cart;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id' | 'lineTotal'>) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  
  // Locale and search state
  language: Language;
  currency: Currency;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  
  // Favorites state
  favorites: FavoriteItem[];
  addToFavorites: (product: Omit<FavoriteItem, 'id' | 'addedAt'>) => void;
  removeFromFavorites: (productId: string) => void;
  isProductInFavorites: (productId: string) => boolean;
};
