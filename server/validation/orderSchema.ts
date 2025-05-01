import { z } from 'zod';
import { OrderStatus } from '../models/Order';

// Shipping address schema
const shippingAddressSchema = z.object({
  address: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  city: z.string().min(2, 'Thành phố phải có ít nhất 2 ký tự'),
  state: z.string().min(2, 'Tỉnh/Thành phải có ít nhất 2 ký tự'),
  postalCode: z.string().min(4, 'Mã bưu điện phải có ít nhất 4 ký tự'),
  country: z.string().default('Vietnam'),
});

// Payment info schema
const paymentInfoSchema = z.object({
  method: z.enum(['Thanh toán khi nhận hàng (COD)', 'Chuyển khoản ngân hàng', 'Thẻ tín dụng', 'Ví điện tử']),
  transactionId: z.string().optional(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).default('pending'),
});

// Order item schema
const orderItemSchema = z.object({
  productId: z.string().uuid('ID sản phẩm không hợp lệ'),
  quantity: z
    .number()
    .int('Số lượng phải là số nguyên')
    .positive('Số lượng phải lớn hơn 0')
    .or(z.string().regex(/^\d+$/).transform(Number)),
  price: z
    .number()
    .positive('Giá sản phẩm phải là số dương')
    .or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)),
  selectedOptions: z
    .record(z.string(), z.string())
    .optional(),
});

// Create order schema
export const createOrderSchema = z.object({
  userId: z.string().uuid('ID người dùng không hợp lệ'),
  items: z
    .array(orderItemSchema)
    .min(1, 'Đơn hàng phải có ít nhất 1 sản phẩm'),
  shippingAddress: shippingAddressSchema,
  paymentInfo: paymentInfoSchema,
  notes: z.string().optional(),
});

// Update order schema
export const updateOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  shippingAddress: shippingAddressSchema.partial().optional(),
  paymentInfo: paymentInfoSchema.partial().optional(),
  notes: z.string().optional(),
  completedAt: z.string().datetime().optional().nullable(),
});

// Order filter schema
export const orderFilterSchema = z.object({
  userId: z.string().uuid('ID người dùng không hợp lệ').optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z
    .number()
    .int('Số trang phải là số nguyên')
    .positive('Số trang phải lớn hơn 0')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(1),
  limit: z
    .number()
    .int('Số lượng đơn hàng mỗi trang phải là số nguyên')
    .positive('Số lượng đơn hàng mỗi trang phải lớn hơn 0')
    .max(100, 'Số lượng đơn hàng mỗi trang không được vượt quá 100')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(10),
}); 