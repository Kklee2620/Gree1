
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShop } from '@/context/ShopContext';
import { ProductSummary } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: ProductSummary;
  onQuickView?: (product: ProductSummary) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, currency } = useShop();
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      options: [],
      stock: 999, // Placeholder stock value
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };
  
  return (
    <div className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Discount badge */}
      {product.originalPrice && (
        <Badge className="absolute top-2 right-2 bg-accent">
          {Math.round((1 - product.price / product.originalPrice) * 100)}% Giảm
        </Badge>
      )}
      
      {/* Stock status */}
      {product.stockStatus === 'out_of_stock' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <span className="text-white font-medium px-4 py-2 bg-black bg-opacity-75 rounded">
            Hết hàng
          </span>
        </div>
      )}
      
      {/* Image container */}
      <Link to={`/product/${product.slug}`} className="block relative pt-[100%]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white text-gray-800 hover:bg-primary hover:text-white"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white text-gray-800 hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={product.stockStatus === 'out_of_stock'}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white text-gray-800 hover:bg-primary hover:text-white"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-1 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">
              {formatCurrency(product.price, currency.code)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatCurrency(product.originalPrice, currency.code)}
              </span>
            )}
          </div>
          
          {/* Star rating */}
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
