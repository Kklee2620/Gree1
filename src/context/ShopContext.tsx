import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useCartActions } from './hooks/useCartActions';
import { useFavoriteActions } from './hooks/useFavoriteActions';
import { useUserActions } from './hooks/useUserActions';
import { useLocaleAndSearch } from './hooks/useLocaleAndSearch';
import { ShopContextType, CartItem } from './types';
import { ProductSummary, UserProfile, getAuthToken, isAuthenticated } from '@/lib/api';

// Create the context
const ShopContext = createContext<ShopContextType | undefined>(undefined);

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider: React.FC<ShopProviderProps> = ({ children }) => {
  // Get all the state and functions from our hooks
  const { 
    user, 
    login, 
    logout
  } = useUserActions();
  
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartItem, 
    removeCartItem, 
    setCart
  } = useCartActions();
  
  const { 
    language, 
    currency, 
    searchQuery, 
    setLanguage, 
    setCurrency, 
    setSearchQuery 
  } = useLocaleAndSearch();
  
  const { 
    favorites, 
    setFavorites, 
    addToFavorites, 
    removeFromFavorites, 
    isProductInFavorites 
  } = useFavoriteActions(user);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi khởi tạo
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      
      // Nếu đã đăng nhập, lấy thông tin người dùng từ localStorage để hiển thị nhanh
      // Trong ứng dụng thực tế, nên gọi API để lấy thông tin người dùng mới nhất
      if (authStatus) {
        const storedUser = localStorage.getItem('user_profile');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Giả sử có hàm setUser trong userLogout
            // user(userData);
          } catch (error) {
            console.error('Lỗi phân tích thông tin người dùng:', error);
          }
        }
      } else {
        logout();
      }
    };

    checkAuth();
    
    // Khởi tạo giỏ hàng từ localStorage nếu có
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      }
    }
  }, [logout, setCart]);

  // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng giá trị giỏ hàng
  const cartTotal = cart.reduce((total, item) => total + item.subtotal, 0);

  // Thêm sản phẩm vào giỏ hàng - sử dụng tên mới để tránh xung đột
  const addItemToCart = (product: ProductSummary, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        const updatedCart = [...prevCart];
        const updatedQuantity = updatedCart[existingItemIndex].quantity + quantity;
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedQuantity,
          subtotal: updatedQuantity * updatedCart[existingItemIndex].price
        };
        return updatedCart;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        const newItem: CartItem = {
          id: `temp_${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          stock: product.stock || 100, // Giá trị mặc định nếu không có
          thumbnailUrl: product.thumbnailUrl || product.imageUrl,
          subtotal: product.price * quantity
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.productId === productId ? { 
          ...item, 
          quantity: newQuantity,
          subtotal: item.price * newQuantity
        } : item
      );
    });
  };

  // Xóa toàn bộ giỏ hàng - sử dụng tên mới để tránh xung đột
  const emptyCart = () => {
    setCart([]);
  };

  const value: ShopContextType = {
    // Thông tin người dùng
    user,
    isLoggedIn,
    login,
    logout: logout,
    
    // Trạng thái giỏ hàng
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    
    // Chức năng giỏ hàng
    addToCart: addItemToCart,
    updateCartItem,
    removeCartItem, 
    removeFromCart,
    updateCartItemQuantity,
    clearCart: emptyCart,
    
    // Ngôn ngữ và tìm kiếm
    language,
    currency,
    searchQuery,
    setLanguage,
    setCurrency,
    setSearchQuery,
    
    // Sản phẩm yêu thích
    favorites,
    addToFavorites,
    removeFromFavorites,
    isProductInFavorites
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

// Re-export các định nghĩa từ types.ts
export * from './types';
