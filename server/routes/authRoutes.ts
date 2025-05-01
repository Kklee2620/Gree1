import { Router } from 'express';
import * as authService from '../services/authService';
import { validate } from '../middleware/validate';
import { 
  registerSchema, 
  loginSchema, 
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validation/userSchema';
import { authenticate, verifyMfa } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản người dùng mới
 * @access  Public
 */
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, name, password, phoneNumber, address } = req.body;
    const result = await authService.register({
      email,
      name,
      password,
      phoneNumber,
      address
    });
    
    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
router.post('/change-password', authenticate, validate(changePasswordSchema), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập', 401);
    }
    
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    
    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Quên mật khẩu
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);
    
    // Trong thực tế, gửi email với link reset password kèm token
    // Ở đây chỉ trả về token để demo
    res.status(200).json({
      success: true,
      message: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
      data: {
        resetToken,
        resetLink: `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Đặt lại mật khẩu
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordSchema), async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    
    res.status(200).json({
      success: true,
      message: 'Đặt lại mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin người dùng hiện tại
 * @access  Private
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập', 401);
    }
    
    // Loại bỏ thông tin nhạy cảm
    const { password, resetPasswordToken, resetPasswordExpires, mfaSecret, ...userInfo } = req.user;
    
    res.status(200).json({
      success: true,
      data: userInfo
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/setup-mfa
 * @desc    Thiết lập xác thực 2 lớp
 * @access  Private
 */
router.post('/setup-mfa', authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập', 401);
    }
    
    const result = await authService.setupMfa(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Vui lòng quét mã QR bằng ứng dụng xác thực',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/enable-mfa
 * @desc    Kích hoạt xác thực 2 lớp
 * @access  Private
 */
router.post('/enable-mfa', authenticate, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập', 401);
    }
    
    const { mfaCode } = req.body;
    
    if (!mfaCode) {
      throw new AppError('Vui lòng cung cấp mã xác thực', 400);
    }
    
    await authService.verifyAndEnableMfa(req.user.id, mfaCode);
    
    res.status(200).json({
      success: true,
      message: 'Đã kích hoạt xác thực 2 lớp thành công'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/disable-mfa
 * @desc    Vô hiệu hóa xác thực 2 lớp
 * @access  Private
 */
router.post('/disable-mfa', authenticate, verifyMfa, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập', 401);
    }
    
    const { mfaCode } = req.body;
    
    if (!mfaCode) {
      throw new AppError('Vui lòng cung cấp mã xác thực', 400);
    }
    
    await authService.disableMfa(req.user.id, mfaCode);
    
    res.status(200).json({
      success: true,
      message: 'Đã vô hiệu hóa xác thực 2 lớp thành công'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 