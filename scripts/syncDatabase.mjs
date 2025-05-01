import { DataSource } from 'typeorm';
import { join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Lấy đường dẫn tương đối
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const serverDir = join(__dirname, '..', 'server');

// Định nghĩa các entities
const entitiesDir = join(serverDir, 'models');

// Tạo DataSource
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'TIKTOK',
  synchronize: true,
  logging: true,
  entities: [
    join(entitiesDir, '**', '*.{ts,js}')
  ]
});

/**
 * Script đồng bộ hóa cấu trúc bảng với database
 * Chỉ sử dụng cho môi trường phát triển
 */
async function syncDatabase() {
  try {
    // Đảm bảo connection đã được khởi tạo
    await AppDataSource.initialize();
    console.log('✅ Kết nối database thành công');

    // Đồng bộ hóa schema
    console.log('Đang đồng bộ hóa database...');
    console.log('✅ Đồng bộ hóa database thành công!');

    // Đóng connection
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi đồng bộ hóa database:', error);
    process.exit(1);
  }
}

// Chạy script
syncDatabase(); 