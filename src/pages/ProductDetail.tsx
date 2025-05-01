import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ProductDetail as IProductDetail,
  Variant,
  Attribute,
  Review,
} from '@/lib/api';
import { getProductBySlug } from '@/lib/api/productApi';
import { formatCurrency } from '@/lib/utils';
import { useShop } from '@/context/ShopContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, Star, ChevronRight } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<IProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const { addToCart } = useShop();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const productData = await getProductBySlug(slug);
        if (productData) {
          setProduct(productData);
          setMainImageUrl(productData.images[0]?.url || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug, toast]);
  
  const updateSelectedAttributes = (attributeId: string, value: string) => {
    // Cập nhật thuộc tính đã chọn
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeId]: value
    };
    setSelectedAttributes(newSelectedAttributes);
    
    // Tìm biến thể phù hợp với các thuộc tính đã chọn
    if (product) {
      const foundVariant = findMatchingVariant(product.variants, newSelectedAttributes);
      setSelectedVariant(foundVariant);
      
      // Cập nhật ảnh nếu biến thể có ảnh riêng
      if (foundVariant?.imageId) {
        const variantImage = product.images.find(img => img.id === foundVariant.imageId);
        if (variantImage) {
          setMainImageUrl(variantImage.url);
        }
      }
    }
  };
  
  const findMatchingVariant = (variants: Variant[], attributes: Record<string, string>) => {
    const selectedAttributesCount = Object.keys(attributes).length;
    
    return variants.find(variant => {
      const variantAttributes = variant.attributes.reduce((acc, attr) => {
        acc[attr.id] = attr.value;
        return acc;
      }, {} as Record<string, string>);
      
      // Kiểm tra xem tất cả các thuộc tính đã chọn có khớp với biến thể không
      let matchCount = 0;
      for (const [key, value] of Object.entries(attributes)) {
        if (variantAttributes[key] === value) {
          matchCount++;
        }
      }
      
      return matchCount === selectedAttributesCount;
    }) || null;
  };
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    const maxStock = selectedVariant ? selectedVariant.stock : product?.variants[0]?.stock || 10;
    
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };
  
  const getAvailableAttributeValues = (attributeId: string) => {
    if (!product) return [];
    
    // Lấy các giá trị thuộc tính khả dụng dựa trên các thuộc tính đã chọn
    const otherSelectedAttributes = { ...selectedAttributes };
    delete otherSelectedAttributes[attributeId];
    
    const availableValues = new Set<string>();
    
    product.variants.forEach(variant => {
      // Kiểm tra xem biến thể có phù hợp với các thuộc tính khác đã chọn không
      let matches = true;
      for (const [key, value] of Object.entries(otherSelectedAttributes)) {
        const attrMatch = variant.attributes.find(attr => attr.id === key && attr.value === value);
        if (!attrMatch) {
          matches = false;
          break;
        }
      }
      
      // Nếu phù hợp, thêm giá trị thuộc tính này vào danh sách khả dụng
      if (matches) {
        const attr = variant.attributes.find(attr => attr.id === attributeId);
        if (attr) {
          availableValues.add(attr.value);
        }
      }
    });
    
    return Array.from(availableValues);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.variants.length > 0 && !selectedVariant) {
      toast({
        title: "Vui lòng chọn biến thể",
        description: "Hãy chọn đầy đủ các tùy chọn cho sản phẩm này.",
        variant: "destructive",
      });
      return;
    }
    
    // Fixing the missing stock property in the cart item
    const cartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: mainImageUrl || product.images[0]?.url,
      price: selectedVariant ? selectedVariant.price : product.basePrice,
      quantity,
      options: Object.entries(selectedAttributes).map(([id, value]) => {
        const attrName = product.attributes.find(attr => attr.id === id)?.name || id;
        return { name: attrName, value };
      }),
      variantId: selectedVariant?.id,
      stock: selectedVariant ? selectedVariant.stock : product.variants[0]?.stock || 10 // Added stock property
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${product.name} đã được thêm vào giỏ hàng của bạn.`
    });
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= rating ? "currentColor" : "none"} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };
  
  const renderProductContent = () => {
    if (loading || !product) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full h-96 rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full h-20 rounded" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      );
    }
    
    const price = selectedVariant ? selectedVariant.price : product.basePrice;
    const originalPrice = selectedVariant?.originalPrice || product.baseOriginalPrice;
    const currentStock = selectedVariant ? selectedVariant.stock : product.variants[0]?.stock || 0;
    const isInStock = currentStock > 0;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Main Image */}
          <div className="border rounded-lg overflow-hidden mb-4">
            <img 
              src={mainImageUrl || product.images[0]?.url} 
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <button
                key={image.id}
                className={`border rounded overflow-hidden ${
                  mainImageUrl === image.url ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setMainImageUrl(image.url)}
              >
                <img 
                  src={image.thumbnailUrl} 
                  alt={image.altText || product.name}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          {/* Product Info */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-sm text-gray-500">
              {product.reviewCount} đánh giá
            </span>
            
            {product.brand && (
              <>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm">
                  Thương hiệu: <span className="text-primary">{product.brand.name}</span>
                </span>
              </>
            )}
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(price)}
              </span>
              
              {originalPrice && originalPrice > price && (
                <span className="ml-2 text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            
            <div className="mt-2 text-sm">
              {isInStock ? (
                <span className="text-green-500">Còn hàng ({currentStock} sản phẩm)</span>
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </div>
          </div>
          
          {product.shortDescription && (
            <div className="mb-6 text-gray-700">
              {product.shortDescription}
            </div>
          )}
          
          {/* Variants Selection */}
          {product.attributes.map((attribute) => {
            const availableValues = getAvailableAttributeValues(attribute.id);
            
            return (
              <div key={attribute.id} className="mb-4">
                <h3 className="text-sm font-medium mb-2">{attribute.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {availableValues.map((value) => {
                    const isSelected = selectedAttributes[attribute.id] === value;
                    
                    return (
                      <button
                        key={value}
                        className={`px-3 py-1 border rounded-md ${
                          isSelected 
                            ? 'border-primary bg-primary text-white' 
                            : 'border-gray-300 hover:border-primary'
                        }`}
                        onClick={() => updateSelectedAttributes(attribute.id, value)}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Số lượng</h3>
            <div className="flex items-center">
              <button
                className="border rounded-l-md p-2 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleQuantityChange(-1)}
              >
                <Minus size={16} />
              </button>
              
              <div className="border-t border-b px-4 py-2 w-16 text-center">
                {quantity}
              </div>
              
              <button
                className="border rounded-r-md p-2 bg-gray-100 hover:bg-gray-200"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="space-y-4">
            <Button 
              className="w-full"
              disabled={!isInStock}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
            
            <Button variant="outline" className="w-full">
              Mua ngay
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderProductTabs = () => {
    if (loading || !product) return null;
    
    return (
      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full border-b grid grid-cols-3 md:w-auto md:inline-flex rounded-none bg-transparent">
          <TabsTrigger 
            value="description" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
          >
            Mô tả
          </TabsTrigger>
          <TabsTrigger 
            value="specifications" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
          >
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
          >
            Đánh giá ({product.reviewCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
        </TabsContent>
        <TabsContent value="specifications" className="pt-6">
          {product.specifications && product.specifications.length > 0 ? (
            <div className="border rounded overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={spec.name} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="border-r py-3 px-4 font-medium w-1/3">{spec.name}</td>
                      <td className="py-3 px-4">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Không có thông số kỹ thuật</p>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Đánh giá từ khách hàng</h3>
            {/* Đây là phần hiển thị đánh giá, sẽ được thêm khi có API */}
            <p>Hiện chưa có đánh giá nào cho sản phẩm này.</p>
          </div>
        </TabsContent>
      </Tabs>
    );
  };
  
  if (loading && !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          {/* More skeletons... */}
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {product && (
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-primary">Trang chủ</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              
              {product.categories[0] && (
                <>
                  <Link 
                    to={`/category/${product.categories[0].slug}`} 
                    className="hover:text-primary"
                  >
                    {product.categories[0].name}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-1" />
                </>
              )}
              
              <span className="truncate">{product.name}</span>
            </div>
          </div>
        )}
        
        {renderProductContent()}
        {renderProductTabs()}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
