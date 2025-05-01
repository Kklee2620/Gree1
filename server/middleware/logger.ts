import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Đảm bảo thư mục logs tồn tại
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Đường dẫn file logs
const accessLogPath = path.join(logsDir, 'access.log');
const errorLogPath = path.join(logsDir, 'error.log');

// Format log message
const formatLogMessage = (req: Request, res: Response, responseTime: number) => {
  const { method, originalUrl, ip } = req;
  const { statusCode } = res;
  const timestamp = new Date().toISOString();
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  return `[${timestamp}] ${requestId} ${method} ${originalUrl} ${statusCode} ${responseTime}ms ${ip}`;
};

// Middleware logging cho mọi request
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Thêm ID duy nhất cho request
  const requestId = uuidv4();
  req.headers['x-request-id'] = requestId;
  
  // Ghi thời gian bắt đầu
  const startTime = Date.now();
  
  // Khi response được gửi
  res.on('finish', () => {
    // Tính thời gian xử lý
    const responseTime = Date.now() - startTime;
    
    // Format log message
    const logMessage = formatLogMessage(req, res, responseTime);
    
    // Ghi log vào file
    fs.appendFile(accessLogPath, logMessage + '\n', (err) => {
      if (err) console.error('Lỗi khi ghi access log:', err);
    });
    
    // Nếu là lỗi, ghi vào error log
    if (res.statusCode >= 400) {
      fs.appendFile(errorLogPath, logMessage + '\n', (err) => {
        if (err) console.error('Lỗi khi ghi error log:', err);
      });
    }
  });
  
  next();
};

// Logger for development
export const devLogger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    const { method, originalUrl } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  }
  next();
}; 