import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/User';
import { AppDataSource } from '../database.config';

// Extend Express Request interface để thêm thuộc tính user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Lấy Secret Key từ biến môi trường
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

/**
 * Middleware để xác thực người dùng từ JWT token
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Lấy token từ header Authorization hoặc từ cookie
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Tìm user trong database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Tài khoản đã bị vô hiệu hóa' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    // Xử lý lỗi token hết hạn
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token đã hết hạn' });
    }
    
    // Xử lý lỗi token không hợp lệ
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
    
    console.error('Lỗi xác thực:', error);
    return res.status(401).json({ message: 'Xác thực thất bại', error: error.message });
  }
};

/**
 * Middleware để kiểm tra quyền truy cập của người dùng
 * @param roles Danh sách các role được phép truy cập
 */
export const authorize = (roles: UserRole[] = [UserRole.ADMIN]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }
    
    // Kiểm tra nếu role của user nằm trong danh sách được cho phép
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập tài nguyên này'
      });
    }
    
    next();
  };
};

/**
 * Middleware để xác thực MFA nếu được bật
 */
export const verifyMfa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    
    // Bỏ qua nếu không có user hoặc MFA chưa được bật
    if (!user || !user.isMfaEnabled) {
      return next();
    }
    
    // Lấy mã MFA từ body
    const { mfaCode } = req.body;
    
    if (!mfaCode) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã xác thực 2 lớp',
        requireMfa: true
      });
    }
    
    // Import động vì speakeasy là dependency tùy chọn
    const speakeasy = await import('speakeasy');
    
    // Xác thực mã MFA
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret!,
      encoding: 'base32',
      token: mfaCode,
      window: 1 // Cho phép độ trễ 30 giây
    });
    
    if (!verified) {
      return res.status(401).json({
        success: false,
        message: 'Mã xác thực không hợp lệ hoặc đã hết hạn',
        requireMfa: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Lỗi xác thực MFA:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực MFA'
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  
  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Không đủ quyền truy cập' });
  }
  
  next();
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Tìm user trong database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: decoded.userId });
    
    if (user && user.isActive) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Nếu lỗi, coi như không có user
    next();
  }
};

export const generateToken = (userId: string): string => {
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
  
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}; 