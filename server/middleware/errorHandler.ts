import { Request, Response, NextFunction } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// Custom Error class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware xử lý lỗi tập trung
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log lỗi
  console.error(`ERROR [${req.method}] ${req.url}:`, err);
  
  // Lỗi không tìm thấy entity (từ TypeORM)
  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({
      message: 'Không tìm thấy dữ liệu yêu cầu',
      error: err.message
    });
  }
  
  // Lỗi truy vấn (từ TypeORM)
  if (err instanceof QueryFailedError) {
    // Check PostgreSQL unique constraint error
    if (err.message.includes('duplicate key') || err.message.includes('unique constraint')) {
      return res.status(409).json({
        message: 'Dữ liệu đã tồn tại',
        error: err.message
      });
    }
    
    // Lỗi foreign key
    if (err.message.includes('foreign key constraint')) {
      return res.status(409).json({
        message: 'Dữ liệu có liên kết tới bảng khác',
        error: err.message
      });
    }
    
    return res.status(400).json({
      message: 'Lỗi truy vấn database',
      error: err.message
    });
  }
  
  // Lỗi validation hoặc lỗi từ middleware khác
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      error: err.message
    });
  }
  
  // Lỗi xác thực
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Xác thực thất bại',
      error: err.message
    });
  }
  
  // Lỗi từ chối quyền truy cập
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      message: 'Không đủ quyền truy cập',
      error: err.message
    });
  }
  
  // Lỗi liên quan đến timeout
  if (err.name === 'TimeoutError') {
    return res.status(408).json({
      message: 'Yêu cầu đã hết thời gian',
      error: err.message
    });
  }
  
  // Lỗi mặc định - server
  return res.status(500).json({
    message: 'Lỗi hệ thống',
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
};

// Middleware bắt lỗi 404
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const err = new AppError(`Không tìm thấy đường dẫn: ${req.originalUrl}`, 404);
  next(err);
}; 