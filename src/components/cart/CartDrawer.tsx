import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ShoppingCart, Trash2 } from 'lucide-react';

export const CartDrawer = () => {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateCartItemQuantity } = useShop();

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Giỏ hàng ({cart.length})
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="rounded-full"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="mt-2"
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 my-4">
              <div className="space-y-4 pr-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex border-b border-gray-200 pb-4"
                  >
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.imageUrl || 'https://placehold.co/200x200?text=No+Image'}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-sm font-medium">
                        <h3 className="line-clamp-2">{item.name}</h3>
                        <p className="ml-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} x {item.quantity}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-700"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-700"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t pt-4 flex-col gap-2">
              <div className="flex justify-between py-2">
                <span className="font-medium">Tổng cộng</span>
                <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                >
                  Tiếp tục mua sắm
                </Button>
                <Button asChild>
                  <Link to="/checkout">
                    Thanh toán
                  </Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
