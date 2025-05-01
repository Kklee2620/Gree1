import React from 'react';
import { useShop } from '@/context/ShopContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, addToCart } = useShop();
  const { toast } = useToast();
  
  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  const handleRemoveFromFavorites = (productId: string, productName: string) => {
    removeFromFavorites(productId);
    
    toast({
      title: "Đã xóa khỏi danh sách yêu thích",
      description: `Sản phẩm "${productName}" đã được xóa khỏi danh sách yêu thích của bạn.`
    });
  };
  
  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.productId,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      options: [],
      stock: 100 // Assuming we have stock information
    });
    
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `Sản phẩm "${product.name}" đã được thêm vào giỏ hàng.`
    });
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sản phẩm yêu thích</h1>
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold">Danh sách yêu thích trống</h3>
            <p className="text-gray-500 mt-2">Bạn chưa thêm sản phẩm nào vào danh sách yêu thích</p>
            <Button className="mt-6" asChild>
              <a href="/">Tiếp tục mua sắm</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link to={`/product/${product.productId}`}>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromFavorites(product.productId, product.name)}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100"
                    aria-label="Remove from favorites"
                  >
                    <X size={18} className="text-gray-700" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Link to={`/product/${product.productId}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-primary">{product.name}</h3>
                  </Link>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-lg">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                    
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={16} />
                      <span>Thêm vào giỏ</span>
                    </Button>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Đã thêm vào ngày {product.addedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;
