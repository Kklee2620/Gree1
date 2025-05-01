import { DataSource } from 'typeorm';
import { User } from './models/User';
import { Product } from './models/Product';
import { Category } from './models/Category';
import { Order } from './models/Order';
import { OrderItem } from './models/OrderItem';
import { Cart } from './models/Cart';
import { Review } from './models/Review';
import { Payment } from './models/Payment';
import dotenv from 'dotenv';

// Tải biến môi trường
dotenv.config();

// Cấu hình TypeORM DataSource
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'vibrant',
  entities: [
    User,
    Product,
    Category,
    Order,
    OrderItem,
    Cart,
    Review,
    Payment
  ],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in development
  logging: process.env.NODE_ENV === 'development', // Log SQL in development
  subscribers: [],
  migrations: ['./server/migrations/*.ts'],
  migrationsTableName: 'migrations_typeorm',
  migrationsRun: true
});

// Fallback kết nối với SQLite nếu không có cấu hình PostgreSQL
if (!process.env.DB_HOST && process.env.NODE_ENV === 'development') {
  console.warn('💡 Không tìm thấy cấu hình database. Sử dụng SQLite làm database mặc định cho phát triển.');
  
  // Override với SQLite cho development
  Object.assign(AppDataSource.options, {
    type: 'sqlite',
    database: './vibrant-dev.sqlite',
    synchronize: true,
  });
}

// Kết nối database
export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Kết nối database thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error);
    process.exit(1);
  }
}

// Tạo một script để tạo migrations
export const createMigration = async (name: string) => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    console.log('✅ Migrations đã được chạy thành công');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi chạy migrations:', error);
    process.exit(1);
  }
};