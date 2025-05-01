
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { ProductSummary, getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ExtendedProductSummary extends ProductSummary {
  description: string;
}

const AdminProducts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ExtendedProductSummary | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<ExtendedProductSummary>>({
    name: '',
    price: 0,
    originalPrice: undefined,
    imageUrl: '',
    category: '',
    description: '',
    stockStatus: 'in_stock'
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch products with React Query
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    select: (data) => data.map(p => ({ ...p, description: 'Mô tả sản phẩm...' })) as ExtendedProductSummary[]
  });
  
  // Mutations
  const addProductMutation = useMutation({
    mutationFn: (product: Omit<ProductSummary, 'id'>) => addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Thêm sản phẩm thành công",
        description: `Sản phẩm "${newProduct.name}" đã được thêm vào hệ thống.`
      });
      setIsAddDialogOpen(false);
      resetNewProductForm();
    },
    onError: (error) => {
      toast({
        title: "Lỗi khi thêm sản phẩm",
        description: "Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.",
        variant: "destructive"
      });
      console.error("Error adding product:", error);
    }
  });
  
  const updateProductMutation = useMutation({
    mutationFn: (product: ProductSummary) => updateProduct(product),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Cập nhật sản phẩm",
        description: `Sản phẩm "${updatedProduct.name}" đã được cập nhật.`
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi khi cập nhật sản phẩm",
        description: "Đã xảy ra lỗi khi cập nhật sản phẩm. Vui lòng thử lại.",
        variant: "destructive"
      });
      console.error("Error updating product:", error);
    }
  });
  
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: (success, productId) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: "Xóa sản phẩm",
          description: `Sản phẩm đã được xóa thành công.`
        });
      } else {
        toast({
          title: "Không thể xóa sản phẩm",
          description: "Không tìm thấy sản phẩm hoặc đã xảy ra lỗi.",
          variant: "destructive"
        });
      }
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi khi xóa sản phẩm",
        description: "Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.",
        variant: "destructive"
      });
      console.error("Error deleting product:", error);
      setIsDeleteDialogOpen(false);
    }
  });
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  const resetNewProductForm = () => {
    setNewProduct({
      name: '',
      price: 0,
      originalPrice: undefined,
      imageUrl: '',
      category: '',
      description: '',
      stockStatus: 'in_stock'
    });
  };
  
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl || !newProduct.category) {
      toast({
        title: "Không thể thêm sản phẩm",
        description: "Vui lòng điền đầy đủ thông tin sản phẩm",
        variant: "destructive"
      });
      return;
    }
    
    const productToAdd: Omit<ProductSummary, 'id'> = {
      name: newProduct.name!,
      slug: newProduct.name!.toLowerCase().replace(/\s+/g, '-'),
      price: newProduct.price!,
      originalPrice: newProduct.originalPrice,
      imageUrl: newProduct.imageUrl!,
      category: newProduct.category!,
      rating: 0,
      stockStatus: newProduct.stockStatus as 'in_stock' | 'out_of_stock' | 'low_stock'
    };
    
    addProductMutation.mutate(productToAdd);
  };
  
  const handleEditProduct = () => {
    if (!currentProduct?.id) return;
    
    // Pass only ProductSummary fields to updateProduct API
    const productToUpdate: ProductSummary = {
      id: currentProduct.id,
      name: currentProduct.name,
      slug: currentProduct.slug,
      price: currentProduct.price,
      originalPrice: currentProduct.originalPrice,
      imageUrl: currentProduct.imageUrl,
      category: currentProduct.category,
      rating: currentProduct.rating,
      stockStatus: currentProduct.stockStatus
    };
    
    updateProductMutation.mutate(productToUpdate);
  };
  
  const handleDeleteProduct = () => {
    if (!currentProduct?.id) return;
    deleteProductMutation.mutate(currentProduct.id);
  };
  
  const handleEditClick = (product: ExtendedProductSummary) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (product: ExtendedProductSummary) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <p className="text-gray-500">Thêm, sửa, và xóa sản phẩm của cửa hàng</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Thêm sản phẩm</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để thêm sản phẩm mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Giá bán (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">Giá gốc (VNĐ - không bắt buộc)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Link hình ảnh</Label>
                <Input
                  id="imageUrl"
                  value={newProduct.imageUrl || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <div className="flex gap-2">
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thời trang nam">Thời trang nam</SelectItem>
                      <SelectItem value="Thời trang nữ">Thời trang nữ</SelectItem>
                      <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Đồ Gia Dụng">Đồ gia dụng</SelectItem>
                      <SelectItem value="Sách & Giải Trí">Sách & Giải trí</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Plus size={16} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="stockStatus">Trạng thái tồn kho</Label>
                <Select
                  value={newProduct.stockStatus}
                  onValueChange={(value: 'in_stock' | 'out_of_stock' | 'low_stock') => 
                    setNewProduct({ ...newProduct, stockStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">Còn hàng</SelectItem>
                    <SelectItem value="low_stock">Sắp hết hàng</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả sản phẩm</Label>
                <Textarea
                  id="description"
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
              <Button 
                onClick={handleAddProduct}
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm sản phẩm"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin sản phẩm
              </DialogDescription>
            </DialogHeader>
            
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Tên sản phẩm</Label>
                  <Input
                    id="edit-name"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-price">Giá bán (VNĐ)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={currentProduct.price}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-originalPrice">Giá gốc (VNĐ)</Label>
                    <Input
                      id="edit-originalPrice"
                      type="number"
                      value={currentProduct.originalPrice || ''}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-imageUrl">Link hình ảnh</Label>
                  <Input
                    id="edit-imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                  />
                  <div className="h-20 w-20 mt-2 rounded border overflow-hidden">
                    <img 
                      src={currentProduct.imageUrl} 
                      alt={currentProduct.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Danh mục</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Thời trang nam">Thời trang nam</SelectItem>
                      <SelectItem value="Thời trang nữ">Thời trang nữ</SelectItem>
                      <SelectItem value="Điện thoại">Điện thoại</SelectItem>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Đồ Gia Dụng">Đồ gia dụng</SelectItem>
                      <SelectItem value="Sách & Giải Trí">Sách & Giải trí</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-stockStatus">Trạng thái tồn kho</Label>
                  <Select
                    value={currentProduct.stockStatus}
                    onValueChange={(value: 'in_stock' | 'out_of_stock' | 'low_stock') => 
                      setCurrentProduct({ ...currentProduct, stockStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">Còn hàng</SelectItem>
                      <SelectItem value="low_stock">Sắp hết hàng</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Mô tả sản phẩm</Label>
                  <Textarea
                    id="edit-description"
                    value={currentProduct.description || ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button 
                onClick={handleEditProduct}
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Product Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa sản phẩm</DialogTitle>
              <DialogDescription>
                {currentProduct && `Bạn có chắc chắn muốn xóa sản phẩm "${currentProduct.name}" không? Hành động này không thể hoàn tác.`}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteProduct}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xác nhận xóa"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-lg bg-white overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Đang tải sản phẩm...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded overflow-hidden">
                        <img 
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">{formatCurrency(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.stockStatus === 'in_stock' && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Còn hàng</span>
                      )}
                      {product.stockStatus === 'low_stock' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Sắp hết</span>
                      )}
                      {product.stockStatus === 'out_of_stock' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Hết hàng</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteClick(product)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
