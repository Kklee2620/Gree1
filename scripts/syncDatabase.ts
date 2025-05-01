import 'reflect-metadata';
import { AppDataSource } from '../server/typeorm.config';

/**
 * Script đồng bộ hóa cấu trúc bảng với database
 * Chỉ sử dụng cho môi trường phát triển
 */
async function syncDatabase() {
  try {
    // Đảm bảo connection đã được khởi tạo
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Đồng bộ hóa schema
    console.log('Đang đồng bộ hóa database...');
    await AppDataSource.synchronize(true); // Force = true -> drop tables first
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