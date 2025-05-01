import { Router } from 'express';
import { AppDataSource } from '../database.config';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../validation/validator';
import { createProductSchema, updateProductSchema } from '../validation/productSchema';

const router = Router();
const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);

// Lấy danh sách sản phẩm với tìm kiếm, lọc và phân trang
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page as string) || 1;
    const parsedLimit = parseInt(limit as string) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    
    // Tạo query builder với joins
    let queryBuilder = productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });
    
    // Filter theo category
    if (category) {
      queryBuilder = queryBuilder
        .andWhere('category.slug = :categorySlug', { categorySlug: category });
    }
    
    // Tìm kiếm theo tên hoặc mô tả
    if (search) {
      queryBuilder = queryBuilder
        .andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', 
          { search: `%${search}%` });
    }
    
    // Sắp xếp
    if (sort) {
      switch (sort) {
        case 'price_asc':
          queryBuilder = queryBuilder.orderBy('product.price', 'ASC');
          break;
        case 'price_desc':
          queryBuilder = queryBuilder.orderBy('product.price', 'DESC');
          break;
        case 'newest':
          queryBuilder = queryBuilder.orderBy('product.createdAt', 'DESC');
          break;
        default:
          queryBuilder = queryBuilder.orderBy('product.name', 'ASC');
      }
    } else {
      queryBuilder = queryBuilder.orderBy('product.createdAt', 'DESC');
    }
    
    // Thực hiện đếm tổng số kết quả
    const totalProducts = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalProducts / parsedLimit);
    
    // Lấy kết quả phân trang
    const products = await queryBuilder
      .skip(skip)
      .take(parsedLimit)
      .getMany();
    
    // Trả về kết quả
    res.json({
      message: 'Lấy danh sách sản phẩm thành công',
      products,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalProducts,
        totalPages
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy chi tiết sản phẩm theo slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const product = await productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.slug = :slug AND product.isActive = :isActive', { 
        slug, 
        isActive: true 
      })
      .getOne();
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({
      message: 'Lấy thông tin sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Các routes cho Admin

// Tạo sản phẩm mới
router.post('/', authenticate, requireAdmin, validate(createProductSchema), async (req, res) => {
  try {
    const { name, description, price, originalPrice, stock, categoryId, attributes, tags, imageUrls, thumbnailUrl } = req.body;
    
    // Kiểm tra category tồn tại
    const category = await categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      return res.status(400).json({ message: 'Danh mục không tồn tại' });
    }
    
    // Tạo slug từ tên sản phẩm
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Kiểm tra slug đã tồn tại chưa
    const existingProduct = await productRepository.findOneBy({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Sản phẩm với slug này đã tồn tại' });
    }
    
    // Tạo sản phẩm mới
    const product = productRepository.create({
      name,
      slug,
      description,
      price,
      originalPrice,
      stock,
      category,
      categoryId,
      attributes: attributes ? JSON.parse(JSON.stringify(attributes)) : null,
      tags,
      imageUrls,
      thumbnailUrl,
      isActive: true
    });
    
    await productRepository.save(product);
    
    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Lỗi tạo sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật sản phẩm
router.put('/:id', authenticate, requireAdmin, validate(updateProductSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, originalPrice, stock, categoryId, attributes, tags, imageUrls, thumbnailUrl, isActive } = req.body;
    
    // Tìm sản phẩm
    const product = await productRepository.findOneBy({ id });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    // Kiểm tra nếu đổi danh mục
    if (categoryId && categoryId !== product.categoryId) {
      const category = await categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        return res.status(400).json({ message: 'Danh mục không tồn tại' });
      }
      product.category = category;
      product.categoryId = categoryId;
    }
    
    // Cập nhật thông tin
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (stock !== undefined) product.stock = stock;
    if (attributes !== undefined) product.attributes = attributes;
    if (tags !== undefined) product.tags = tags;
    if (imageUrls !== undefined) product.imageUrls = imageUrls;
    if (thumbnailUrl !== undefined) product.thumbnailUrl = thumbnailUrl;
    if (isActive !== undefined) product.isActive = isActive;
    
    // Cập nhật slug nếu đổi tên
    if (name && name !== product.name) {
      const newSlug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Kiểm tra slug mới đã tồn tại chưa
      const existingProduct = await productRepository.findOneBy({ slug: newSlug });
      if (existingProduct && existingProduct.id !== id) {
        return res.status(400).json({ message: 'Sản phẩm với slug này đã tồn tại' });
      }
      
      product.slug = newSlug;
    }
    
    await productRepository.save(product);
    
    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Lỗi cập nhật sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa sản phẩm (soft delete - chỉ cập nhật isActive = false)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tìm sản phẩm
    const product = await productRepository.findOneBy({ id });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    // Cập nhật isActive = false thay vì xóa
    product.isActive = false;
    await productRepository.save(product);
    
    res.json({
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

export default router; 