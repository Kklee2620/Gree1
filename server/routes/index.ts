import { Express } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import statsRoutes from './statsRoutes';
import authRoutes from './authRoutes';
import stripeRoutes from './stripeRoutes';

const API_PREFIX = '/api';

/**
 * Khởi tạo tất cả routes của API
 * @param app Express application instance
 */
export default function setupRoutes(app: Express) {
  // Đăng ký các routes
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/products`, productRoutes);
  app.use(`${API_PREFIX}/categories`, categoryRoutes);
  app.use(`${API_PREFIX}/cart`, cartRoutes);
  app.use(`${API_PREFIX}/orders`, orderRoutes);
  app.use(`${API_PREFIX}/stats`, statsRoutes);
  app.use(`${API_PREFIX}/payment`, stripeRoutes);
  
  // Không tìm thấy route
  app.use(`${API_PREFIX}/*`, (req, res) => {
    res.status(404).json({
      message: `API endpoint không tồn tại: ${req.method} ${req.originalUrl}`
    });
  });
  
  // Root API route
  app.get(API_PREFIX, (req, res) => {
    res.json({
      message: 'Chào mừng đến với API của Vibrant Shop',
      version: '1.0.0',
      endpoints: [
        '/api/auth',
        '/api/users',
        '/api/products',
        '/api/categories',
        '/api/cart',
        '/api/orders',
        '/api/stats',
        '/api/payment'
      ]
    });
  });
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});