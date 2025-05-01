import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductSummary, getProducts } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import CategorySidebar from '@/components/layout/CategorySidebar';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductSummary | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProducts();
        
        if (!data || data.length === 0) {
          setError('Không có sản phẩm nào để hiển thị. Vui lòng quay lại sau.');
        }
        
        setProducts(data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
        toast({
          variant: "destructive",
          title: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);
  
  const handleQuickView = (product: ProductSummary) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };
  
  // Hiển thị skeleton loader khi đang tải
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar skeleton */}
            <div className="hidden md:block md:col-span-3 lg:col-span-2">
              <div className="border rounded-lg p-4">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Main content skeleton */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              <Skeleton className="h-12 w-48 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar with categories */}
          <div className="hidden md:block md:col-span-3 lg:col-span-2">
            <CategorySidebar />
          </div>
          
          {/* Main content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <h1 className="text-2xl font-bold mb-6">Tất cả sản phẩm</h1>
            
            {error ? (
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Không có sản phẩm nào để hiển thị</p>
                <Button asChild variant="outline">
                  <Link to="/categories">Xem danh mục sản phẩm</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={product}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick view modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default HomePage;
