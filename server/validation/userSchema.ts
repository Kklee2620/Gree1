import { z } from 'zod';
import { UserRole } from '../models/User';

// Regex patterns
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const PHONE_REGEX = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;

// Base user schema
export const userBaseSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(5, 'Email phải có ít nhất 5 ký tự')
    .max(100, 'Email không được vượt quá 100 ký tự'),
  name: z
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được vượt quá 100 ký tự'),
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ')
    .optional()
    .nullable(),
  address: z.string().optional().nullable(),
});

// Đăng ký
export const registerSchema = userBaseSchema.extend({
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// Đăng nhập
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  mfaCode: z.string().optional(),
});

// Đổi mật khẩu
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    ),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
  path: ['newPassword'],
});

// Quên mật khẩu
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

// Reset mật khẩu
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token không hợp lệ'),
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// MFA
export const mfaSchema = z.object({
  mfaCode: z
    .string()
    .min(6, 'Mã xác thực phải có 6 chữ số')
    .max(6, 'Mã xác thực phải có 6 chữ số')
    .regex(/^[0-9]+$/, 'Mã xác thực chỉ được chứa số'),
});

// Tạo user (admin)
export const createUserSchema = userBaseSchema.extend({
  password: z
    .string()
    .regex(
      PASSWORD_REGEX,
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
    ),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  isActive: z.boolean().default(true),
});

// Cập nhật user
export const updateUserSchema = userBaseSchema
  .partial()
  .extend({
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
  });

// User filters
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  page: z
    .number()
    .int('Số trang phải là số nguyên')
    .positive('Số trang phải lớn hơn 0')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(1),
  limit: z
    .number()
    .int('Số lượng người dùng mỗi trang phải là số nguyên')
    .positive('Số lượng người dùng mỗi trang phải lớn hơn 0')
    .max(100, 'Số lượng người dùng mỗi trang không được vượt quá 100')
    .or(z.string().regex(/^\d+$/).transform(Number))
    .default(10),
}); 