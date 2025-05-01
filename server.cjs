const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
require('dotenv').config();

// Thiết lập biến môi trường
process.env.NODE_ENV = 'development';

const app = express();
const PORT = process.env.PORT || 3001;

// Thông tin kết nối PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'vibrant'
};

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8082', 'http://localhost:3000', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:8086', 'http://localhost:8081', 'http://localhost:8083'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Database pool cho các request
const pool = new Client(dbConfig);
pool.connect()
  .then(() => console.log('Database kết nối thành công'))
  .catch(err => console.error('Lỗi kết nối database:', err));

// Middleware xác thực
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Tìm user trong database
    const result = await pool.query('SELECT id, email, name, role FROM "user" WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    
    // Gán user vào request
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ', error: error.message });
  }
};

// Middleware phân quyền admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Không đủ quyền truy cập' });
};

// API Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// API Routes - Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
    }
    
    // Tìm user trong database
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1', [email.toLowerCase()]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    const user = result.rows[0];
    
    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }
    
    // Tạo JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // Đặt cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // Trả về thông tin user (không bao gồm password)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Đăng nhập thành công',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tên, email và mật khẩu là bắt buộc' });
    }
    
    // Kiểm tra email đã tồn tại chưa
    const checkEmail = await pool.query('SELECT * FROM "user" WHERE email = $1', [email.toLowerCase()]);
    
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user mới
    const result = await pool.query(`
      INSERT INTO "user" (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, "createdAt"
    `, [name, email.toLowerCase(), hashedPassword, 'user']);
    
    const newUser = result.rows[0];
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: newUser
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Đăng xuất thành công' });
});

app.get('/api/auth/profile', authenticate, (req, res) => {
  res.json({ 
    message: 'Lấy thông tin profile thành công',
    user: req.user 
  });
});

// API Routes - Users (Admin)
app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, "isActive", "createdAt", "updatedAt" FROM "user" ORDER BY "createdAt" DESC');
    
    res.json({
      message: 'Lấy danh sách người dùng thành công',
      users: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// API Routes - Categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "category" WHERE "isActive" = true ORDER BY name');
    
    res.json({
      message: 'Lấy danh sách danh mục thành công',
      categories: result.rows
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query('SELECT * FROM "category" WHERE slug = $1 AND "isActive" = true', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({
      message: 'Lấy thông tin danh mục thành công',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin danh mục:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// API Routes - Products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT p.*, c.name as "categoryName" FROM "product" p LEFT JOIN "category" c ON p."categoryId" = c.id WHERE p."isActive" = true';
    const queryParams = [];
    
    // Filter theo category
    if (category) {
      queryParams.push(category);
      query += ` AND c.slug = $${queryParams.length}`;
    }
    
    // Filter theo search
    if (search) {
      queryParams.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length})`;
    }
    
    // Order by
    if (sort) {
      switch (sort) {
        case 'price_asc':
          query += ' ORDER BY p.price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY p.price DESC';
          break;
        case 'newest':
          query += ' ORDER BY p."createdAt" DESC';
          break;
        default:
          query += ' ORDER BY p.name ASC';
      }
    } else {
      query += ' ORDER BY p."createdAt" DESC';
    }
    
    // Phân trang
    queryParams.push(limit);
    queryParams.push(offset);
    query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;
    
    // Đếm tổng số sản phẩm
    let countQuery = 'SELECT COUNT(*) FROM "product" p LEFT JOIN "category" c ON p."categoryId" = c.id WHERE p."isActive" = true';
    
    if (category) {
      countQuery += ` AND c.slug = $1`;
    }
    
    if (search) {
      countQuery += ` AND (p.name ILIKE $${category ? 2 : 1} OR p.description ILIKE $${category ? 2 : 1})`;
    }
    
    // Thực thi query
    const productsResult = await pool.query(query, queryParams);
    const countResult = await pool.query(countQuery, category ? [category] : search ? [`%${search}%`] : []);
    
    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      message: 'Lấy danh sách sản phẩm thành công',
      products: productsResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalProducts,
        totalPages
      }
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Lấy thông tin sản phẩm và tên danh mục
    const result = await pool.query(`
      SELECT p.*, c.name as "categoryName" 
      FROM "product" p 
      LEFT JOIN "category" c ON p."categoryId" = c.id 
      WHERE p.slug = $1 AND p."isActive" = true
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json({
      message: 'Lấy thông tin sản phẩm thành công',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// API Routes - Admin
app.get('/api/admin/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    // Lấy tổng số đơn hàng
    const ordersResult = await pool.query('SELECT COUNT(*) FROM "order"');
    
    // Lấy tổng số người dùng
    const usersResult = await pool.query('SELECT COUNT(*) FROM "user"');
    
    // Lấy tổng số sản phẩm
    const productsResult = await pool.query('SELECT COUNT(*) FROM "product"');
    
    // Lấy doanh số
    const revenueResult = await pool.query('SELECT SUM(total) FROM "order" WHERE status = \'delivered\'');
    
    res.json({
      message: 'Lấy thông tin dashboard thành công',
      stats: {
        totalOrders: parseInt(ordersResult.rows[0].count),
        totalUsers: parseInt(usersResult.rows[0].count),
        totalProducts: parseInt(productsResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].sum || 0)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin dashboard:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Endpoint không tìm thấy
app.use((req, res) => {
  res.status(404).json({ message: `Không tìm thấy đường dẫn: ${req.originalUrl}` });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500).json({
    message: 'Lỗi server không xác định',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
}); 