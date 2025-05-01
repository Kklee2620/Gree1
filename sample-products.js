const { Client } = require('pg');
require('dotenv').config();

// Thông tin kết nối PostgreSQL từ file .env
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'vibrant'
};

// Hàm tạo dữ liệu mẫu cho sản phẩm
async function createSampleProducts() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Kết nối database thành công');
    
    // Lấy danh sách category
    const categoryResult = await client.query('SELECT id, slug FROM "category"');
    const categories = categoryResult.rows;
    
    if (categories.length === 0) {
      console.log('Không tìm thấy danh mục sản phẩm');
      return;
    }
    
    const phoneCategory = categories.find(c => c.slug === 'dien-thoai');
    const laptopCategory = categories.find(c => c.slug === 'laptop');
    const tabletCategory = categories.find(c => c.slug === 'may-tinh-bang');
    
    // Mảng sản phẩm mẫu
    const sampleProducts = [
      // Điện thoại
      {
        name: 'iPhone 14 Pro',
        slug: 'iphone-14-pro',
        description: 'iPhone 14 Pro với chip A16 Bionic mạnh mẽ, màn hình Super Retina XDR 6.1 inch với ProMotion, camera chuyên nghiệp 48MP.',
        price: 29990000,
        originalPrice: 32990000,
        stock: 50,
        imageUrls: [
          'https://example.com/images/iphone14pro-1.jpg',
          'https://example.com/images/iphone14pro-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/iphone14pro-thumb.jpg',
        categoryId: phoneCategory.id,
        attributes: JSON.stringify({
          color: 'Deep Purple',
          storage: '256GB',
          ram: '6GB',
          screen: '6.1 inch'
        }),
        tags: ['apple', 'iphone', 'smartphone']
      },
      {
        name: 'Samsung Galaxy S23 Ultra',
        slug: 'samsung-galaxy-s23-ultra',
        description: 'Samsung Galaxy S23 Ultra với bút S-Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 2X 6.8 inch và pin dung lượng lớn.',
        price: 25990000,
        originalPrice: 31990000,
        stock: 35,
        imageUrls: [
          'https://example.com/images/s23ultra-1.jpg',
          'https://example.com/images/s23ultra-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/s23ultra-thumb.jpg',
        categoryId: phoneCategory.id,
        attributes: JSON.stringify({
          color: 'Phantom Black',
          storage: '256GB',
          ram: '8GB',
          screen: '6.8 inch'
        }),
        tags: ['samsung', 'galaxy', 'smartphone']
      },
      
      // Laptop
      {
        name: 'MacBook Pro 14 inch M2 Pro',
        slug: 'macbook-pro-14-inch-m2-pro',
        description: 'MacBook Pro 14 inch với chip M2 Pro, 16GB RAM, 512GB SSD, màn hình Liquid Retina XDR và thời lượng pin lên đến 18 giờ.',
        price: 49990000,
        originalPrice: 52990000,
        stock: 20,
        imageUrls: [
          'https://example.com/images/macbook-pro-14-1.jpg',
          'https://example.com/images/macbook-pro-14-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/macbook-pro-14-thumb.jpg',
        categoryId: laptopCategory.id,
        attributes: JSON.stringify({
          color: 'Space Gray',
          cpu: 'Apple M2 Pro',
          ram: '16GB',
          storage: '512GB SSD',
          screen: '14 inch'
        }),
        tags: ['apple', 'macbook', 'laptop']
      },
      {
        name: 'Dell XPS 13 Plus',
        slug: 'dell-xps-13-plus',
        description: 'Dell XPS 13 Plus với thiết kế cao cấp, bàn phím không khe hở, touchpad vô hình và hiệu suất mạnh mẽ.',
        price: 42990000,
        originalPrice: 45990000,
        stock: 15,
        imageUrls: [
          'https://example.com/images/dell-xps-13-plus-1.jpg',
          'https://example.com/images/dell-xps-13-plus-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/dell-xps-13-plus-thumb.jpg',
        categoryId: laptopCategory.id,
        attributes: JSON.stringify({
          color: 'Platinum',
          cpu: 'Intel Core i7-1260P',
          ram: '16GB',
          storage: '512GB SSD',
          screen: '13.4 inch'
        }),
        tags: ['dell', 'xps', 'laptop']
      },
      
      // Máy tính bảng
      {
        name: 'iPad Pro 12.9 inch M2',
        slug: 'ipad-pro-12-9-inch-m2',
        description: 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR, camera TrueDepth và hỗ trợ Apple Pencil thế hệ 2.',
        price: 32990000,
        originalPrice: 35990000,
        stock: 25,
        imageUrls: [
          'https://example.com/images/ipad-pro-12-1.jpg',
          'https://example.com/images/ipad-pro-12-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/ipad-pro-12-thumb.jpg',
        categoryId: tabletCategory.id,
        attributes: JSON.stringify({
          color: 'Space Gray',
          storage: '256GB',
          connectivity: 'Wi-Fi + Cellular',
          screen: '12.9 inch'
        }),
        tags: ['apple', 'ipad', 'tablet']
      },
      {
        name: 'Samsung Galaxy Tab S9 Ultra',
        slug: 'samsung-galaxy-tab-s9-ultra',
        description: 'Samsung Galaxy Tab S9 Ultra với màn hình Dynamic AMOLED 2X 14.6 inch, bút S Pen, pin 11,200mAh và hiệu suất mạnh mẽ.',
        price: 28990000,
        originalPrice: 32990000,
        stock: 20,
        imageUrls: [
          'https://example.com/images/tab-s9-ultra-1.jpg',
          'https://example.com/images/tab-s9-ultra-2.jpg'
        ],
        thumbnailUrl: 'https://example.com/images/tab-s9-ultra-thumb.jpg',
        categoryId: tabletCategory.id,
        attributes: JSON.stringify({
          color: 'Graphite',
          storage: '256GB',
          connectivity: 'Wi-Fi',
          screen: '14.6 inch'
        }),
        tags: ['samsung', 'galaxy', 'tablet']
      }
    ];
    
    console.log(`Bắt đầu thêm ${sampleProducts.length} sản phẩm mẫu...`);
    
    // Thêm từng sản phẩm vào database
    for (const product of sampleProducts) {
      const checkProduct = await client.query('SELECT * FROM "product" WHERE slug = $1', [product.slug]);
      
      if (checkProduct.rows.length === 0) {
        await client.query(`
          INSERT INTO "product" (
            name, slug, description, price, "originalPrice", stock, "imageUrls", 
            "thumbnailUrl", "categoryId", attributes, tags, "isActive"
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          product.name,
          product.slug,
          product.description,
          product.price,
          product.originalPrice,
          product.stock,
          product.imageUrls,
          product.thumbnailUrl,
          product.categoryId,
          product.attributes,
          product.tags,
          true
        ]);
        
        console.log(`Đã thêm sản phẩm: ${product.name}`);
      } else {
        console.log(`Sản phẩm ${product.name} đã tồn tại`);
      }
    }
    
    console.log('Đã thêm dữ liệu sản phẩm mẫu thành công');
    
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu sản phẩm mẫu:', error);
  } finally {
    await client.end();
    console.log('Đã đóng kết nối database');
  }
}

// Chạy hàm tạo dữ liệu mẫu
createSampleProducts(); 