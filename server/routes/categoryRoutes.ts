import { Router } from 'express';
import { AppDataSource } from '../database.config';
import { Category } from '../models/Category';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../validation/validator';
import { createCategorySchema, updateCategorySchema } from '../validation/categorySchema';

const router = Router();
const categoryRepository = AppDataSource.getRepository(Category);

// Lấy tất cả danh mục (public)
router.get('/', async (req, res) => {
  try {
    const categories = await categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
    
    res.json({
      message: 'Lấy danh sách danh mục thành công',
      categories
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy chi tiết danh mục theo slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const category = await categoryRepository.findOne({
      where: { slug, isActive: true }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({
      message: 'Lấy thông tin danh mục thành công',
      category
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Các routes cho Admin

// Lấy tất cả danh mục (bao gồm cả không active) - Admin only
router.get('/admin/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const categories = await categoryRepository.find({
      order: { name: 'ASC' }
    });
    
    res.json({
      message: 'Lấy tất cả danh mục thành công',
      categories
    });
  } catch (error) {
    console.error('Lỗi lấy tất cả danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Tạo danh mục mới
router.post('/', authenticate, requireAdmin, validate(createCategorySchema), async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    // Tạo slug từ tên danh mục
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await categoryRepository.findOne({
      where: { slug }
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Danh mục với slug này đã tồn tại' });
    }
    
    // Tạo danh mục mới
    const category = categoryRepository.create({
      name,
      slug,
      description,
      imageUrl,
      isActive: true
    });
    
    await categoryRepository.save(category);
    
    res.status(201).json({
      message: 'Tạo danh mục thành công',
      category
    });
  } catch (error) {
    console.error('Lỗi tạo danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật danh mục
router.put('/:id', authenticate, requireAdmin, validate(updateCategorySchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;
    
    // Tìm danh mục
    const category = await categoryRepository.findOneBy({ id });
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    // Cập nhật thông tin
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (imageUrl !== undefined) category.imageUrl = imageUrl;
    if (isActive !== undefined) category.isActive = isActive;
    
    // Cập nhật slug nếu đổi tên
    if (name && name !== category.name) {
      const newSlug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Kiểm tra slug mới đã tồn tại chưa
      const existingCategory = await categoryRepository.findOne({
        where: { slug: newSlug }
      });
      
      if (existingCategory && existingCategory.id !== id) {
        return res.status(400).json({ message: 'Danh mục với slug này đã tồn tại' });
      }
      
      category.slug = newSlug;
    }
    
    await categoryRepository.save(category);
    
    res.json({
      message: 'Cập nhật danh mục thành công',
      category
    });
  } catch (error) {
    console.error('Lỗi cập nhật danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa danh mục (soft delete - chỉ cập nhật isActive = false)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tìm danh mục
    const category = await categoryRepository.findOneBy({ id });
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    // Kiểm tra danh mục có sản phẩm chưa
    const productCount = await AppDataSource
      .getRepository('Product')
      .createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId: id })
      .getCount();
    
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục này vì còn chứa sản phẩm',
        productCount
      });
    }
    
    // Cập nhật isActive = false thay vì xóa
    category.isActive = false;
    await categoryRepository.save(category);
    
    res.json({
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    console.error('Lỗi xóa danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

export default router; 