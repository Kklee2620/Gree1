import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useShop } from '@/context/ShopContext';
import { ProductDetail, ProductSummary } from '@/lib/api';
import { getProductBySlug } from '@/lib/api/productApi';
import { formatCurrency } from '@/lib/utils';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSummary | null;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, product }) => {
  const { addToCart, currency } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      getProductBySlug(product.slug)
        .then((data) => {
          if (data) {
            setProductDetail(data);
            // Reset state
            setQuantity(1);
            setSelectedVariant(null);
            setSelectedAttributes({});
          }
        })
        .catch((error) => {
          console.error('Error loading product details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, product]);

  const handleClose = () => {
    onClose();
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!productDetail) return;

    // Find the selected variant if any
    const variant = productDetail.variants.find(v => v.id === selectedVariant);
    
    addToCart({
      productId: productDetail.id,
      variantId: variant?.id,
      name: productDetail.name,
      imageUrl: productDetail.images[0].url,
      price: variant?.price || productDetail.basePrice,
      quantity,
      options: Object.entries(selectedAttributes).map(([name, value]) => ({ name, value })),
      stock: variant?.stock || 100, // Fallback stock value
    });
    
    onClose();
  };

  // Get unique attribute names
  const getUniqueAttributes = () => {
    if (!productDetail?.variants.length) return [];
    
    const attributes = new Set<string>();
    productDetail.variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        attributes.add(attr.name);
      });
    });
    
    return Array.from(attributes);
  };

  // Get unique values for a specific attribute
  const getAttributeValues = (attributeName: string) => {
    if (!productDetail?.variants.length) return [];
    
    const values = new Set<string>();
    productDetail.variants.forEach(variant => {
      const attr = variant.attributes.find(a => a.name === attributeName);
      if (attr) values.add(attr.value);
    });
    
    return Array.from(values);
  };

  // Handle attribute selection
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Find a matching variant
    if (productDetail) {
      const matchingVariant = productDetail.variants.find(variant => {
        return Object.entries(newAttributes).every(([attrName, attrValue]) => {
          const attr = variant.attributes.find(a => a.name === attrName);
          return attr && attr.value === attrValue;
        });
      });

      setSelectedVariant(matchingVariant?.id || null);
    }
  };

  // Check if a specific attribute value is available
  const isAttributeValueAvailable = (attributeName: string, value: string) => {
    if (!productDetail?.variants.length) return true;
    
    // Filter variants based on current selections except the current attribute
    const filteredVariants = productDetail.variants.filter(variant => {
      return Object.entries(selectedAttributes).every(([name, val]) => {
        // Skip the current attribute we're checking
        if (name === attributeName) return true;
        
        // Check if this variant matches our other selected attributes
        const attr = variant.attributes.find(a => a.name === name);
        return attr && attr.value === val;
      });
    });
    
    // Check if any of the filtered variants have the value we're checking
    return filteredVariants.some(variant => {
      const attr = variant.attributes.find(a => a.name === attributeName);
      return attr && attr.value === value;
    });
  };

  if (!product || !productDetail) {
    return null;
  }

  const variant = selectedVariant 
    ? productDetail.variants.find(v => v.id === selectedVariant)
    : null;

  const price = variant?.price || productDetail.basePrice;
  const originalPrice = variant?.originalPrice || productDetail.baseOriginalPrice;
  const stock = variant?.stock || 100; // Default stock if no variant selected

  return (
    <Dialog open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {productDetail.name}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="relative">
              <img
                src={
                  variant?.imageId
                    ? productDetail.images.find(img => img.id === variant.imageId)?.url || productDetail.images[0].url
                    : productDetail.images[0].url
                }
                alt={productDetail.name}
                className="w-full h-auto object-cover rounded-md"
              />
              
              {productDetail.stockStatus === 'out_of_stock' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-md">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{productDetail.name}</h2>
                <p className="text-sm text-gray-500">
                  SKU: {variant?.sku || productDetail.sku}
                </p>
              </div>

              <div className="mb-4 flex items-center">
                <div className="flex items-center mr-4">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm">{productDetail.averageRating}</span>
                </div>
                <span className="text-sm text-gray-500">
                  ({productDetail.reviewCount} đánh giá)
                </span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold">
                  {formatCurrency(price, currency.code)}
                </span>
                {originalPrice && (
                  <span className="ml-2 text-gray-500 line-through">
                    {formatCurrency(originalPrice, currency.code)}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-700">
                  {productDetail.shortDescription || productDetail.description.substring(0, 150) + '...'}
                </p>
              </div>

              {/* Attributes */}
              {getUniqueAttributes().map(attributeName => (
                <div key={attributeName} className="mb-4">
                  <h3 className="font-medium mb-2">{attributeName}</h3>
                  <div className="flex flex-wrap gap-2">
                    {getAttributeValues(attributeName).map(value => {
                      const isAvailable = isAttributeValueAvailable(attributeName, value);
                      const isSelected = selectedAttributes[attributeName] === value;

                      return (
                        <button
                          key={value}
                          className={`px-3 py-1 border rounded-md ${
                            isSelected 
                              ? 'border-primary bg-primary text-white' 
                              : isAvailable 
                                ? 'hover:border-primary' 
                                : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => isAvailable && handleAttributeChange(attributeName, value)}
                          disabled={!isAvailable}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Số lượng</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-1 border rounded-l-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stock}
                    className="px-3 py-1 border rounded-r-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex space-x-4">
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={productDetail.stockStatus === 'out_of_stock'}
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="secondary" className="flex-1">
                  Mua ngay
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
