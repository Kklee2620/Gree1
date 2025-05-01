import { z } from 'zod';
import { IsString, IsNumber, IsOptional, IsArray, Min, MaxLength, IsBoolean } from 'class-validator';

// Helpers
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Base product schema
export const productBaseSchema = z.object({
  name: z
    .string()
    .min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự')
    .max(200, 'Tên sản phẩm không được vượt quá 200 ký tự'),
  description: z
    .string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(5000, 'Mô tả không được vượt quá 5000 ký tự'),
  price: z
    .number()
    .positive('Giá sản phẩm phải là số dương')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)),
  originalPrice: z
    .number()
    .positive('Giá gốc phải là số dương')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number))
    .optional()
    .nullable(),
  stock: z
    .number()
    .int('Số lượng phải là số nguyên')
    .nonnegative('Số lượng không được âm')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(0),
  isActive: z.boolean().default(true),
  categoryId: z.string().uuid('ID danh mục không hợp lệ'),
  attributes: z
    .record(z.string(), z.string())
    .optional(),
  tags: z
    .array(z.string())
    .or(z.string().transform(value => value.split(',').map(tag => tag.trim())))
    .optional(),
});

// Create product schema
export const createProductSchema = productBaseSchema.extend({
  slug: z
    .string()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .max(200, 'Slug không được vượt quá 200 ký tự')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .optional()
    .transform(val => val || slugify(productBaseSchema.shape.name.parse(val))),
  imageUrls: z
    .array(z.string().url('URL hình ảnh không hợp lệ'))
    .min(1, 'Cần ít nhất 1 hình ảnh cho sản phẩm')
    .or(z.string().transform(value => value.split(',').map(url => url.trim())))
    .optional(),
  thumbnailUrl: z
    .string()
    .url('URL hình ảnh đại diện không hợp lệ')
    .optional(),
});

// Update product schema
export const updateProductSchema = createProductSchema.partial();

// Product filter schema
export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z
    .number()
    .nonnegative('Giá tối thiểu không được âm')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number))
    .optional(),
  maxPrice: z
    .number()
    .positive('Giá tối đa phải là số dương')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number))
    .optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
  page: z
    .number()
    .int('Số trang phải là số nguyên')
    .positive('Số trang phải lớn hơn 0')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(1),
  limit: z
    .number()
    .int('Số lượng sản phẩm mỗi trang phải là số nguyên')
    .positive('Số lượng sản phẩm mỗi trang phải lớn hơn 0')
    .max(100, 'Số lượng sản phẩm mỗi trang không được vượt quá 100')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(10),
  isActive: z.boolean().optional(),
});

export class CreateProductSchema {
  @IsString()
  @MaxLength(200)
  name: string;
  
  @IsString()
  @MaxLength(2000)
  description: string;
  
  @IsNumber()
  @Min(0)
  price: number;
  
  @IsNumber()
  @IsOptional()
  @Min(0)
  originalPrice?: number;
  
  @IsNumber()
  @Min(0)
  stock: number;
  
  @IsString()
  categoryId: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
  
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
  
  @IsOptional()
  attributes?: Record<string, string>;
}

export class UpdateProductSchema {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
  
  @IsOptional()
  @IsString()
  categoryId?: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
  
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
  
  @IsOptional()
  attributes?: Record<string, string>;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 