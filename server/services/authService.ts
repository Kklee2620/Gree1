import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../models/User';
import { AppDataSource } from '../database.config';
import { AppError } from '../middleware/errorHandler';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Secret key cho JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
const SALT_ROUNDS = 10;

// Repository
const userRepository = AppDataSource.getRepository(User);

/**
 * Đăng ký người dùng mới
 */
export const register = async (userData: {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}): Promise<{ user: User; token: string }> => {
  // Kiểm tra email tồn tại
  const existingUser = await userRepository.findOne({
    where: { email: userData.email }
  });
  
  if (existingUser) {
    throw new AppError('Email đã tồn tại trong hệ thống', 409);
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  
  // Tạo user mới
  const newUser = userRepository.create({
    ...userData,
    password: hashedPassword,
    role: UserRole.USER
  });
  
  // Lưu vào database
  const savedUser = await userRepository.save(newUser);
  
  // Xóa password trước khi trả về
  const { password, ...userWithoutPassword } = savedUser;
  
  // Tạo JWT token
  const token = jwt.sign({ id: savedUser.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  
  return { user: userWithoutPassword as User, token };
};

/**
 * Đăng nhập
 */
export const login = async (email: string, password: string): Promise<{ user: User; token: string; requireMfa: boolean }> => {
  // Tìm user theo email
  const user = await userRepository.findOne({
    where: { email }
  });
  
  if (!user) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }
  
  if (!user.isActive) {
    throw new AppError('Tài khoản đã bị vô hiệu hóa', 403);
  }
  
  // Kiểm tra password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }
  
  // Xóa password trước khi trả về
  const { password: _, ...userWithoutPassword } = user;
  
  // Tạo JWT token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
  
  // Kiểm tra MFA
  const requireMfa = user.isMfaEnabled;
  
  return { user: userWithoutPassword as User, token, requireMfa };
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
  // Tìm user theo id
  const user = await userRepository.findOne({
    where: { id: userId }
  });
  
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404);
  }
  
  // Kiểm tra mật khẩu hiện tại
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isPasswordValid) {
    throw new AppError('Mật khẩu hiện tại không chính xác', 401);
  }
  
  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Cập nhật mật khẩu
  user.password = hashedPassword;
  await userRepository.save(user);
};

/**
 * Quên mật khẩu - Tạo token reset
 */
export const forgotPassword = async (email: string): Promise<string> => {
  // Tìm user theo email
  const user = await userRepository.findOne({
    where: { email }
  });
  
  if (!user) {
    throw new AppError('Email không tồn tại trong hệ thống', 404);
  }
  
  // Tạo token reset
  const resetToken = uuidv4();
  
  // Thiết lập thời gian hết hạn (1 giờ)
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1);
  
  // Cập nhật token reset
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = resetExpires;
  await userRepository.save(user);
  
  return resetToken;
};

/**
 * Đặt lại mật khẩu bằng token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // Tìm user theo token reset
  const user = await userRepository.findOne({
    where: { resetPasswordToken: token }
  });
  
  if (!user) {
    throw new AppError('Token không hợp lệ hoặc đã hết hạn', 400);
  }
  
  // Kiểm tra thời gian hết hạn
  if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new AppError('Token đã hết hạn', 400);
  }
  
  // Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Cập nhật mật khẩu và xóa token reset
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  
  await userRepository.save(user);
};

/**
 * Thiết lập MFA
 */
export const setupMfa = async (userId: string): Promise<{ secret: string; qrCode: string }> => {
  // Tìm user theo id
  const user = await userRepository.findOne({
    where: { id: userId }
  });
  
  if (!user) {
    throw new AppError('Người dùng không tồn tại', 404);
  }
  
  // Tạo secret mới
  const secret = speakeasy.generateSecret({ name: `Vibrant eShop:${user.email}` });
  
  // Lưu secret vào user
  user.mfaSecret = secret.base32;
  await userRepository.save(user);
  
  // Tạo QR code
  const qrCode = await qrcode.toDataURL(secret.otpauth_url || '');
  
  return { secret: secret.base32, qrCode };
};

/**
 * Xác nhận và kích hoạt MFA
 */
export const verifyAndEnableMfa = async (userId: string, mfaCode: string): Promise<boolean> => {
  // Tìm user theo id
  const user = await userRepository.findOne({
    where: { id: userId }
  });
  
  if (!user || !user.mfaSecret) {
    throw new AppError('Người dùng không tồn tại hoặc chưa thiết lập MFA', 404);
  }
  
  // Xác thực mã MFA
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: mfaCode,
    window: 1 // Cho phép độ trễ 30 giây
  });
  
  if (!verified) {
    throw new AppError('Mã xác thực không hợp lệ hoặc đã hết hạn', 401);
  }
  
  // Kích hoạt MFA
  user.isMfaEnabled = true;
  await userRepository.save(user);
  
  return true;
};

/**
 * Vô hiệu hóa MFA
 */
export const disableMfa = async (userId: string, mfaCode: string): Promise<boolean> => {
  // Tìm user theo id
  const user = await userRepository.findOne({
    where: { id: userId }
  });
  
  if (!user || !user.isMfaEnabled || !user.mfaSecret) {
    throw new AppError('Người dùng không tồn tại hoặc chưa kích hoạt MFA', 404);
  }
  
  // Xác thực mã MFA
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: mfaCode,
    window: 1 // Cho phép độ trễ 30 giây
  });
  
  if (!verified) {
    throw new AppError('Mã xác thực không hợp lệ hoặc đã hết hạn', 401);
  }
  
  // Vô hiệu hóa MFA
  user.isMfaEnabled = false;
  user.mfaSecret = null;
  await userRepository.save(user);
  
  return true;
}; 