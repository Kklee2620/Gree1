import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CategoryNode, getCategories } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export const CategorySidebar: React.FC = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
  const handleMouseLeave = () => {
    setActiveCategory(null);
  };
  
  if (isLoading) {
    return (
      <div className="hidden md:block w-64 bg-white border-r h-full">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-36" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b">
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="hidden md:block w-64 bg-white border-r h-full">
        <div className="p-4 border-b font-medium">
          Danh mục sản phẩm
        </div>
        <div className="p-4 text-gray-500">Không có danh mục nào.</div>
      </div>
    );
  }
  
  return (
    <div className="hidden md:block w-64 bg-white border-r h-full">
      <div className="p-4 border-b font-medium">
        Danh mục sản phẩm
      </div>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className="relative"
            onMouseEnter={() => handleCategoryHover(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={`/category/${category.slug}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50 border-b"
            >
              <span>{category.name}</span>
              {category.children && category.children.length > 0 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Link>
            
            {/* Mega Menu for subcategories */}
            {activeCategory === category.id && category.children && category.children.length > 0 && (
              <div className="absolute left-full top-0 w-[500px] bg-white shadow-lg border rounded-md z-20 p-4 grid grid-cols-2 gap-4">
                {category.children.map((subCategory) => (
                  <div key={subCategory.id} className="p-2">
                    <Link
                      to={`/category/${subCategory.slug}`}
                      className="font-medium hover:text-primary block mb-2"
                    >
                      {subCategory.name}
                    </Link>
                    {subCategory.imageUrl && (
                      <img
                        src={subCategory.imageUrl}
                        alt={subCategory.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                    )}
                    
                    {/* Third-level categories if any */}
                    {subCategory.children && subCategory.children.length > 0 && (
                      <ul className="space-y-1 mt-2">
                        {subCategory.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              to={`/category/${child.slug}`}
                              className="text-sm text-gray-600 hover:text-primary"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;
