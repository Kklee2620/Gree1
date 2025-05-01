import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { AppDataSource } from '../database.config';
import { AppError } from '../middleware/errorHandler';
import slugify from '../utils/slugify';
import { Not } from 'typeorm';

// Repositories
const productRepository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository(Category);

/**
 * Tạo sản phẩm mới
 */
export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isActive?: boolean;
  categoryId: string;
  attributes?: { [key: string]: string };
  tags?: string[];
  imageUrls?: string[];
  thumbnailUrl?: string;
  slug?: string;
}): Promise<Product> => {
  // Kiểm tra category
  const category = await categoryRepository.findOne({
    where: { id: productData.categoryId }
  });

  if (!category) {
    throw new AppError('Danh mục không tồn tại', 404);
  }

  // Tạo slug nếu không có
  const slug = productData.slug || slugify(productData.name);

  // Kiểm tra slug đã tồn tại
  const existingProduct = await productRepository.findOne({
    where: { slug }
  });

  if (existingProduct) {
    throw new AppError('Slug đã tồn tại, vui lòng chọn tên sản phẩm khác', 409);
  }

  // Tạo sản phẩm mới
  const newProduct = productRepository.create({
    ...productData,
    slug
  });

  // Lưu vào database
  return await productRepository.save(newProduct);
};

/**
 * Cập nhật sản phẩm
 */
export const updateProduct = async (
  productId: string,
  productData: Partial<{
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    stock: number;
    isActive: boolean;
    categoryId: string;
    attributes: { [key: string]: string };
    tags: string[];
    imageUrls: string[];
    thumbnailUrl: string;
    slug: string;
  }>
): Promise<Product> => {
  // Tìm sản phẩm
  const product = await productRepository.findOne({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  // Nếu thay đổi category, kiểm tra category mới
  if (productData.categoryId) {
    const category = await categoryRepository.findOne({
      where: { id: productData.categoryId }
    });

    if (!category) {
      throw new AppError('Danh mục không tồn tại', 404);
    }
  }

  // Nếu thay đổi tên, tạo slug mới
  let slug = product.slug;
  if (productData.name && productData.name !== product.name) {
    slug = productData.slug || slugify(productData.name);

    // Kiểm tra slug đã tồn tại
    const existingProduct = await productRepository.findOne({
      where: { 
        slug,
        id: Not(productId)
      }
    });

    if (existingProduct) {
      throw new AppError('Slug đã tồn tại, vui lòng chọn tên sản phẩm khác', 409);
    }
  }

  // Cập nhật sản phẩm
  Object.assign(product, {
    ...productData,
    slug
  });

  // Lưu vào database
  return await productRepository.save(product);
};

/**
 * Lấy danh sách sản phẩm
 */
export const getProducts = async (filter: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number; page: number; limit: number; totalPages: number }> => {
  const { search, category, minPrice, maxPrice, isActive, sort = 'newest', page = 1, limit = 10 } = filter;

  // Tạo query builder
  const queryBuilder = productRepository.createQueryBuilder('product');

  // Join với category
  queryBuilder.leftJoinAndSelect('product.category', 'category');

  // Xử lý điều kiện lọc
  if (search) {
    queryBuilder.andWhere(
      '(product.name ILIKE :search OR product.description ILIKE :search)',
      { search: `%${search}%` }
    );
  }

  if (category) {
    queryBuilder.andWhere('category.id = :categoryId OR category.slug = :categorySlug', {
      categoryId: category,
      categorySlug: category
    });
  }

  if (minPrice !== undefined) {
    queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
  }

  if (maxPrice !== undefined) {
    queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
  }

  if (isActive !== undefined) {
    queryBuilder.andWhere('product.isActive = :isActive', { isActive });
  }

  // Sắp xếp
  switch (sort) {
    case 'newest':
      queryBuilder.orderBy('product.createdAt', 'DESC');
      break;
    case 'oldest':
      queryBuilder.orderBy('product.createdAt', 'ASC');
      break;
    case 'price_asc':
      queryBuilder.orderBy('product.price', 'ASC');
      break;
    case 'price_desc':
      queryBuilder.orderBy('product.price', 'DESC');
      break;
    case 'name_asc':
      queryBuilder.orderBy('product.name', 'ASC');
      break;
    case 'name_desc':
      queryBuilder.orderBy('product.name', 'DESC');
      break;
    default:
      queryBuilder.orderBy('product.createdAt', 'DESC');
  }

  // Phân trang
  const offset = (page - 1) * limit;
  queryBuilder.skip(offset).take(limit);

  // Thực thi query
  const [products, total] = await queryBuilder.getManyAndCount();

  // Tính tổng số trang
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    total,
    page,
    limit,
    totalPages
  };
};

/**
 * Lấy chi tiết sản phẩm
 */
export const getProductById = async (productId: string): Promise<Product> => {
  const product = await productRepository.findOne({
    where: { id: productId },
    relations: ['category']
  });

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  return product;
};

/**
 * Lấy chi tiết sản phẩm theo slug
 */
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const product = await productRepository.findOne({
    where: { slug },
    relations: ['category']
  });

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  return product;
};

/**
 * Xóa sản phẩm
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  const product = await productRepository.findOne({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError('Sản phẩm không tồn tại', 404);
  }

  await productRepository.remove(product);
}; 