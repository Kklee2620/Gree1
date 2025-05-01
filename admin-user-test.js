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

// Hàm kiểm tra và tạo tài khoản admin
async function setupAdminAccount() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Kết nối database thành công');
    
    // Tạo tài khoản admin
    const adminEmail = 'admin@test.com';
    const adminPassword = 'Admin123';
    
    // Kiểm tra xem admin đã tồn tại chưa
    const checkAdmin = await client.query('SELECT * FROM "user" WHERE email = $1', [adminEmail]);
    
    if (checkAdmin.rows.length === 0) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Insert admin user
      await client.query(`
        INSERT INTO "user" (email, name, password, role)
        VALUES ($1, $2, $3, $4)
      `, [adminEmail, 'Test Admin', hashedPassword, 'admin']);
      
      console.log('Tài khoản admin đã được tạo thành công:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    } else {
      console.log('Tài khoản admin đã tồn tại');
    }
    
    // Hiển thị danh sách tất cả tài khoản với role admin
    const adminAccounts = await client.query('SELECT id, email, name, role FROM "user" WHERE role = $1', ['admin']);
    console.log('\nDanh sách tài khoản admin trong hệ thống:');
    console.table(adminAccounts.rows);
    
  } catch (error) {
    console.error('Lỗi thiết lập tài khoản admin:', error);
  } finally {
    await client.end();
    console.log('Đã đóng kết nối database');
  }
}

// Chạy hàm thiết lập
setupAdminAccount(); 