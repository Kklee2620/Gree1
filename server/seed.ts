import { DataSource } from 'typeorm';
import { AppDataSource } from './typeorm.config';
import { User, UserRole } from './models/User';
import { Category } from './models/Category';
import { Product } from './models/Product';
import * as bcrypt from 'bcrypt';

async function seed() {
  try {
    // Kết nối database
    await AppDataSource.initialize();
    console.log('✅ Kết nối database thành công');

    // Tạo repositories
    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const productRepository = AppDataSource.getRepository(Product);

    // Tạo admin nếu chưa có
    const adminExists = await userRepository.findOne({
      where: { email: 'admin@vibrant.com' }
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      const admin = userRepository.create({
        email: 'admin@vibrant.com',
        name: 'Admin',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true
      });
      
      await userRepository.save(admin);
      console.log('✅ Đã tạo tài khoản admin');
    }

    // Tạo user mẫu nếu chưa có
    const userExists = await userRepository.findOne({
      where: { email: 'user@vibrant.com' }
    });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('User@123', 10);
      
      const user = userRepository.create({
        email: 'user@vibrant.com',
        name: 'User',
        password: hashedPassword,
        role: UserRole.USER,
        isActive: true
      });
      
      await userRepository.save(user);
      console.log('✅ Đã tạo tài khoản user mẫu');
    }

    // Tạo danh mục mẫu
    const categories = [
      { name: 'Quần áo', slug: 'quan-ao', description: 'Các sản phẩm quần áo' },
      { name: 'Giày dép', slug: 'giay-dep', description: 'Các sản phẩm giày dép' },
      { name: 'Phụ kiện', slug: 'phu-kien', description: 'Các sản phẩm phụ kiện' }
    ];

    for (const categoryData of categories) {
      const categoryExists = await categoryRepository.findOne({
        where: { slug: categoryData.slug }
      });

      if (!categoryExists) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`✅ Đã tạo danh mục ${categoryData.name}`);
      }
    }

    // Tạo sản phẩm mẫu
    const getCategories = await categoryRepository.find();
    
    if (getCategories.length > 0) {
      const quanAoCategory = getCategories.find(cat => cat.slug === 'quan-ao');
      const giayDepCategory = getCategories.find(cat => cat.slug === 'giay-dep');
      const phuKienCategory = getCategories.find(cat => cat.slug === 'phu-kien');

      const products = [
        {
          name: 'Áo thun nam',
          slug: 'ao-thun-nam',
          description: 'Áo thun nam chất lượng cao',
          price: 200000,
          originalPrice: 250000,
          stock: 100,
          isActive: true,
          categoryId: quanAoCategory?.id,
          imageUrls: ['https://example.com/image1.jpg'],
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          attributes: { color: 'Đen', size: 'L' },
          tags: ['áo thun', 'nam']
        },
        {
          name: 'Giày thể thao',
          slug: 'giay-the-thao',
          description: 'Giày thể thao nam nữ',
          price: 500000,
          originalPrice: 600000,
          stock: 50,
          isActive: true,
          categoryId: giayDepCategory?.id,
          imageUrls: ['https://example.com/image2.jpg'],
          thumbnailUrl: 'https://example.com/thumb2.jpg',
          attributes: { color: 'Trắng', size: '42' },
          tags: ['giày', 'thể thao']
        },
        {
          name: 'Đồng hồ thông minh',
          slug: 'dong-ho-thong-minh',
          description: 'Đồng hồ thông minh đa chức năng',
          price: 1500000,
          originalPrice: 1800000,
          stock: 30,
          isActive: true,
          categoryId: phuKienCategory?.id,
          imageUrls: ['https://example.com/image3.jpg'],
          thumbnailUrl: 'https://example.com/thumb3.jpg',
          attributes: { color: 'Đen', waterproof: 'Yes' },
          tags: ['đồng hồ', 'thông minh']
        }
      ];

      for (const productData of products) {
        const productExists = await productRepository.findOne({
          where: { slug: productData.slug }
        });

        if (!productExists && productData.categoryId) {
          const product = productRepository.create(productData);
          await productRepository.save(product);
          console.log(`✅ Đã tạo sản phẩm ${productData.name}`);
        }
      }
    }

    console.log('✅ Seed dữ liệu hoàn tất');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
}

// Chạy seed
seed(); 