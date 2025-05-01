import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppDataSource } from './database.config';
import setupRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Tải biến môi trường từ file .env
dotenv.config();

// Khởi tạo Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Thư mục logs
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Stream để ghi log
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(helmet()); // Bảo mật HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parser cho JSON
app.use(express.urlencoded({ extended: true })); // Parser cho URL-encoded data
app.use(cookieParser()); // Xử lý cookies
app.use(morgan('combined', { stream: accessLogStream })); // HTTP logging

// Khởi tạo các routes API
setupRoutes(app);

// Middleware xử lý lỗi
app.use(errorHandler);

// Khởi động server
const startServer = async () => {
  try {
    // Kết nối database qua TypeORM
    await AppDataSource.initialize();
    console.log('🗄️  Database đã kết nối thành công');
    
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
      console.log(`📊 API có sẵn tại http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
};

// Xử lý các signals để tắt server một cách an toàn
process.on('SIGINT', async () => {
  console.log('Nhận SIGINT, đang đóng kết nối...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Nhận SIGTERM, đang đóng kết nối...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Khởi động server
startServer();