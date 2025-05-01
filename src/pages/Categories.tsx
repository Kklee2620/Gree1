
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryNode, getCategories } from '@/lib/api';
import MainLayout from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách danh mục. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);
  
  const renderCategoryGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group border rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div className="relative h-48">
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Không có hình ảnh</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-medium text-lg mb-2">{category.name}</h3>
              <p className="text-gray-500 text-sm">
                {category.children.length > 0 
                  ? `${category.children.length} danh mục con` 
                  : 'Xem sản phẩm'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Danh mục sản phẩm</h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span>Danh mục</span>
          </div>
        </div>
        
        {renderCategoryGrid()}
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
