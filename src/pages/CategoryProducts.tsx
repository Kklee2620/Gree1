import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ProductSummary, 
  CategoryNode, 
  getProducts, 
  getCategories 
} from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const CategoryProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [quickViewProduct, setQuickViewProduct] = useState<ProductSummary | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { toast } = useToast();
  
  // React Query for categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // React Query for products
  const { data: allProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60, // 1 minute
  });

  // Tìm danh mục hiện tại dựa vào slug
  const findCategory = (nodes: CategoryNode[] = [], targetSlug: string): CategoryNode | null => {
    for (const node of nodes) {
      if (node.slug === targetSlug) {
        return node;
      }
      
      if (node.children.length > 0) {
        const found = findCategory(node.children, targetSlug);
        if (found) return found;
      }
    }
    return null;
  };

  const currentCategory = findCategory(categories, slug || '');
  
  // Lọc sản phẩm thuộc danh mục hiện tại
  const products = (allProducts || []).filter(
    product => product.category === (currentCategory?.name || '')
  );

  const handleQuickView = (product: ProductSummary) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };
  
  const renderProductGrid = () => {
    if (isCategoriesLoading || isProductsLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Không có sản phẩm</h3>
          <p className="text-gray-500">
            Chúng tôi chưa có sản phẩm nào trong danh mục này. Vui lòng kiểm tra lại sau.
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={handleQuickView}
          />
        ))}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/categories" className="hover:text-primary">Danh mục</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>{isCategoriesLoading ? 'Đang tải...' : currentCategory?.name || 'Không tìm thấy danh mục'}</span>
          </div>
        </div>
        
        {/* Category Header */}
        <div className="mb-8">
          {isCategoriesLoading ? (
            <>
              <Skeleton className="h-8 w-1/3 mb-3" />
              <Skeleton className="h-4 w-2/3" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">{currentCategory?.name}</h1>
              <div className="text-gray-600">
                {products.length} sản phẩm trong danh mục này
              </div>
            </>
          )}
        </div>
        
        {/* Category Banner */}
        {currentCategory?.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={currentCategory.imageUrl} 
              alt={currentCategory.name} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Products Grid */}
        {renderProductGrid()}
        
        {/* QuickView Modal */}
        <QuickViewModal 
          isOpen={isQuickViewOpen} 
          onClose={() => setIsQuickViewOpen(false)} 
          product={quickViewProduct}
        />
      </div>
    </MainLayout>
  );
};

export default CategoryProductsPage;
