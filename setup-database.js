const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Thông tin kết nối PostgreSQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'vibrant'
};

// Hàm tạo bảng
async function setupDatabase() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Kết nối database thành công');
    
    // Tạo kiểu enum
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    
    // Tạo bảng User
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        "avatarUrl" VARCHAR(255),
        "phoneNumber" VARCHAR(100),
        address TEXT,
        "isMfaEnabled" BOOLEAN DEFAULT false,
        "mfaSecret" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT true,
        "resetPasswordToken" VARCHAR(255),
        "resetPasswordExpires" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
    `);
    
    // Tạo bảng Category
    await client.query(`
      CREATE TABLE IF NOT EXISTS "category" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        "imageUrl" VARCHAR(255),
        "isActive" BOOLEAN DEFAULT true,
        "parentId" UUID,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("parentId") REFERENCES "category"(id)
      );
      CREATE INDEX IF NOT EXISTS idx_category_name ON "category"(name);
      CREATE INDEX IF NOT EXISTS idx_category_slug ON "category"(slug);
    `);
    
    // Tạo bảng Product
    await client.query(`
      CREATE TABLE IF NOT EXISTS "product" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        "originalPrice" DECIMAL(10, 2),
        stock INTEGER DEFAULT 0,
        "isActive" BOOLEAN DEFAULT true,
        "imageUrls" TEXT[],
        "thumbnailUrl" VARCHAR(255),
        "categoryId" UUID NOT NULL,
        attributes JSONB,
        tags TEXT[],
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("categoryId") REFERENCES "category"(id)
      );
      CREATE INDEX IF NOT EXISTS idx_product_name ON "product"(name);
      CREATE INDEX IF NOT EXISTS idx_product_slug ON "product"(slug);
      CREATE INDEX IF NOT EXISTS idx_product_category ON "product"("categoryId");
    `);
    
    // Tạo bảng Order
    await client.query(`
      CREATE TABLE IF NOT EXISTS "order" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        "shippingCost" DECIMAL(10, 2) DEFAULT 0,
        discount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        status order_status DEFAULT 'pending',
        "shippingAddress" JSONB,
        "paymentInfo" JSONB,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        "completedAt" TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "user"(id)
      );
      CREATE INDEX IF NOT EXISTS idx_order_user ON "order"("userId");
      CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
    `);
    
    // Tạo bảng OrderItem
    await client.query(`
      CREATE TABLE IF NOT EXISTS "order_item" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "productId" UUID NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        "selectedOptions" JSONB,
        "orderId" UUID NOT NULL,
        FOREIGN KEY ("productId") REFERENCES "product"(id),
        FOREIGN KEY ("orderId") REFERENCES "order"(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_order_item_order ON "order_item"("orderId");
    `);
    
    // Tạo bảng Cart
    await client.query(`
      CREATE TABLE IF NOT EXISTS "cart" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "productId" UUID NOT NULL,
        quantity INTEGER DEFAULT 1,
        "selectedOptions" JSONB,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "user"(id),
        FOREIGN KEY ("productId") REFERENCES "product"(id)
      );
      CREATE INDEX IF NOT EXISTS idx_cart_user ON "cart"("userId");
    `);
    
    // Tạo bảng Favorite
    await client.query(`
      CREATE TABLE IF NOT EXISTS "favorite" (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL,
        "productId" UUID NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "user"(id),
        FOREIGN KEY ("productId") REFERENCES "product"(id),
        UNIQUE("userId", "productId")
      );
      CREATE INDEX IF NOT EXISTS idx_favorite_user ON "favorite"("userId");
      CREATE INDEX IF NOT EXISTS idx_favorite_product ON "favorite"("productId");
    `);
    
    console.log('Các bảng database đã được tạo thành công');
    
    // Tạo tài khoản admin
    const adminEmail = 'Admin@yapee.com';
    
    // Kiểm tra xem admin đã tồn tại chưa
    const checkAdmin = await client.query('SELECT * FROM "user" WHERE email = $1', [adminEmail]);
    
    if (checkAdmin.rows.length === 0) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123', salt);
      
      // Insert admin user
      await client.query(`
        INSERT INTO "user" (email, name, password, role)
        VALUES ($1, $2, $3, $4)
      `, [adminEmail, 'Administrator', hashedPassword, 'admin']);
      
      console.log('Tài khoản admin đã được tạo thành công:');
      console.log('Email: Admin@yapee.com');
      console.log('Password: Admin123');
    } else {
      console.log('Tài khoản admin đã tồn tại');
    }
    
    // Tạo dữ liệu mẫu cho các danh mục
    const categories = [
      { name: 'Điện thoại', slug: 'dien-thoai', description: 'Các loại điện thoại di động', imageUrl: 'https://example.com/images/phones.jpg' },
      { name: 'Laptop', slug: 'laptop', description: 'Các loại máy tính xách tay', imageUrl: 'https://example.com/images/laptops.jpg' },
      { name: 'Máy tính bảng', slug: 'may-tinh-bang', description: 'Các loại máy tính bảng', imageUrl: 'https://example.com/images/tablets.jpg' }
    ];
    
    for (const category of categories) {
      const checkCategory = await client.query('SELECT * FROM "category" WHERE slug = $1', [category.slug]);
      
      if (checkCategory.rows.length === 0) {
        await client.query(`
          INSERT INTO "category" (name, slug, description, "imageUrl")
          VALUES ($1, $2, $3, $4)
        `, [category.name, category.slug, category.description, category.imageUrl]);
        
        console.log(`Danh mục "${category.name}" đã được tạo`);
      }
    }
    
    console.log('Thiết lập database đã hoàn tất');
    
  } catch (error) {
    console.error('Lỗi thiết lập database:', error);
  } finally {
    await client.end();
    console.log('Đã đóng kết nối database');
  }
}

// Chạy hàm thiết lập
setupDatabase(); 