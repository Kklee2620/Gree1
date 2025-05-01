import { useState, useEffect, useCallback } from 'react';
import { CartItem } from '../types';

export const useCartActions = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = useCallback((item: Omit<CartItem, 'id' | 'subtotal'>) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.productId === item.productId
      );

      if (existingItemIndex >= 0) {
        // Cập nhật nếu đã tồn tại
        const existingItem = prevCart[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;
        
        if (newQuantity <= item.stock) {
          const updatedItems = [...prevCart];
          const subtotal = item.price * newQuantity;
          
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity,
            subtotal
          };
          
          return updatedItems;
        }
        
        return prevCart; // Nếu vượt quá tồn kho, giữ nguyên
      } else {
        // Thêm mới nếu chưa tồn tại
        const newItem: CartItem = {
          ...item,
          id: `item_${Date.now()}_${Math.round(Math.random() * 1000)}`,
          subtotal: item.price * item.quantity
        };
        
        return [...prevCart, newItem];
      }
    });

    // Mở giỏ hàng khi thêm sản phẩm
    setIsCartOpen(true);
  }, []);

  // Cập nhật số lượng sản phẩm
  const updateCartItem = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setCart(prevCart => {
      const updatedItems = prevCart.map(item => {
        if (item.id === itemId && quantity <= item.stock) {
          return {
            ...item,
            quantity,
            subtotal: item.price * quantity
          };
        }
        return item;
      });

      return updatedItems;
    });
  }, []);

  // Xóa sản phẩm khỏi giỏ hàng
  const removeCartItem = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  }, []);

  // Xóa toàn bộ giỏ hàng
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    setCart
  };
};
