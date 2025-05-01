import { DataSource } from 'typeorm';
import { join } from 'path';
import { User } from './models/User';
import { Order } from './models/Order';
import { OrderItem } from './models/OrderItem';
import { Product } from './models/Product';
import { Category } from './models/Category';
import { Cart } from './models/Cart';
import { Favorite } from './models/Favorite';

// Xác định môi trường
const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'vibrant',
  entities: [User, Order, OrderItem, Product, Category, Cart, Favorite],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],
  migrationsTableName: 'migrations_history',
  synchronize: isDevelopment, // Chỉ bật synchronize trong môi trường development
  logging: true
}); 