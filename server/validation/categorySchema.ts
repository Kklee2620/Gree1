import { z } from 'zod';
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

// Helpers
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Category schema
export const categoryBaseSchema = z.object({
  name: z
    .string()
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự'),
  description: z
    .string()
    .max(1000, 'Mô tả không được vượt quá 1000 ký tự')
    .optional(),
  isActive: z.boolean().default(true),
  parentId: z
    .string()
    .uuid('ID danh mục cha không hợp lệ')
    .optional()
    .nullable(),
  imageUrl: z
    .string()
    .url('URL hình ảnh không hợp lệ')
    .optional()
    .nullable(),
});

// Create category schema
export const createCategorySchema = categoryBaseSchema.extend({
  slug: z
    .string()
    .min(2, 'Slug phải có ít nhất 2 ký tự')
    .max(100, 'Slug không được vượt quá 100 ký tự')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
    .optional()
    .transform(val => val || slugify(categoryBaseSchema.shape.name.parse(val))),
});

// Update category schema
export const updateCategorySchema = createCategorySchema.partial();

// Category filter schema
export const categoryFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().uuid('ID danh mục cha không hợp lệ').optional(),
  page: z
    .number()
    .int('Số trang phải là số nguyên')
    .positive('Số trang phải lớn hơn 0')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(1),
  limit: z
    .number()
    .int('Số lượng danh mục mỗi trang phải là số nguyên')
    .positive('Số lượng danh mục mỗi trang phải lớn hơn 0')
    .max(100, 'Số lượng danh mục mỗi trang không được vượt quá 100')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(10),
});

export class CreateCategorySchema {
  @IsString()
  @MaxLength(100)
  name: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
  
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateCategorySchema {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
  
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
  
  @IsOptional()
  @IsString()
  imageUrl?: string;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 