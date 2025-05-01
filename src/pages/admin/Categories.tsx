import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Plus, Trash2, Loader2, ArrowUpDown, GripVertical } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API_URL } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

const AdminCategories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id' | 'order'>>({ name: '', slug: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`, { credentials: 'include' });
        if (!res.ok) throw new Error('Lỗi lấy danh sách danh mục');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error: any) {
        toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [toast]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast({
        title: "Không thể thêm danh mục",
        description: "Vui lòng nhập tên danh mục",
        variant: "destructive"
      });
      return;
    }
    const newCat: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      slug: newCategory.slug,
      order: categories.length + 1
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    toast({
      title: "Thêm danh mục thành công",
      description: `Danh mục \"${newCategory.name}\" đã được thêm.`
    });
    setIsAddDialogOpen(false);
    setNewCategory({ name: '', slug: '' });
  };
  
  const handleEditCategory = () => {
    if (!currentCategory) return;
    const updated = categories.map(cat =>
      cat.id === currentCategory.id ? { ...cat, ...currentCategory } : cat
    );
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    toast({
      title: "Cập nhật danh mục",
      description: `Danh mục \"${currentCategory.name}\" đã được cập nhật.`
    });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    const updated = categories.filter(cat => cat.id !== currentCategory.id)
      .map((cat, idx) => ({ ...cat, order: idx + 1 }));
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    toast({
      title: "Xóa danh mục",
      description: `Danh mục \"${currentCategory.name}\" đã được xóa.`
    });
    setIsDeleteDialogOpen(false);
  };
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(categories);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    const updated = reordered.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    setCategories(updated);
    localStorage.setItem('categories', JSON.stringify(updated));
    toast({
      title: "Sắp xếp danh mục",
      description: "Thứ tự danh mục đã được cập nhật."
    });
  };
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <p className="text-gray-500">Thêm, sửa, xóa và sắp xếp danh mục sản phẩm</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Thêm danh mục</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục mới</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên danh mục
                </Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({
                    ...newCategory,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                  })}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleAddCategory}>
                Thêm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="text-center py-16">Đang tải danh mục...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16">Không có danh mục nào.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Thứ tự</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">{category.order}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên danh mục
              </Label>
              <Input
                id="name"
                value={currentCategory?.name || ''}
                onChange={(e) => currentCategory && setCurrentCategory({
                  ...currentCategory,
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleEditCategory}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa danh mục</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{currentCategory?.name}"?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;