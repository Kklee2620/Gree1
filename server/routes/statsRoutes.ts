import { Router } from 'express';
import { AppDataSource } from '../database.config';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { authenticate, requireAdmin } from '../middleware/auth';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

const router = Router();

// Lấy thống kê tổng quan cho dashboard
router.get('/dashboard', authenticate, requireAdmin, async (req, res) => {
  try {
    // Lấy tổng số đơn hàng
    const totalOrders = await AppDataSource.getRepository(Order).count();
    
    // Lấy tổng doanh thu
    const { totalRevenue } = await AppDataSource.getRepository(Order)
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'totalRevenue')
      .where('order.status != :cancelledStatus', { cancelledStatus: 'cancelled' })
      .getRawOne();
    
    // Lấy tổng số sản phẩm
    const totalProducts = await AppDataSource.getRepository(Product).count({
      where: { isActive: true }
    });
    
    // Lấy tổng số người dùng
    const totalUsers = await AppDataSource.getRepository(User).count();
    
    // Lấy số khách hàng mới trong tháng hiện tại
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const newCustomers = await AppDataSource.getRepository(User).count({
      where: {
        createdAt: MoreThanOrEqual(firstDayOfMonth)
      }
    });
    
    // Lấy số sản phẩm đã bán trong 30 ngày qua
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { productsSold } = await AppDataSource
      .getRepository('OrderItem')
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('SUM(orderItem.quantity)', 'productsSold')
      .where('order.createdAt >= :date', { date: thirtyDaysAgo })
      .andWhere('order.status != :cancelledStatus', { cancelledStatus: 'cancelled' })
      .getRawOne();
    
    // Lấy doanh thu 30 ngày qua
    const { revenue } = await AppDataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'revenue')
      .where('order.createdAt >= :date', { date: thirtyDaysAgo })
      .andWhere('order.status != :cancelledStatus', { cancelledStatus: 'cancelled' })
      .getRawOne();
    
    // Thống kê đơn hàng theo trạng thái
    const orderStats = await AppDataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany()
      .then(results => {
        const stats: Record<string, number> = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
          refunded: 0
        };
        
        results.forEach(item => {
          stats[item.status] = parseInt(item.count);
        });
        
        return stats;
      });
    
    // Thống kê doanh thu theo danh mục
    const salesByCategory = await AppDataSource
      .query(`
        SELECT
          c.id as "categoryId",
          c.name as "categoryName",
          SUM(oi.price * oi.quantity) as "amount",
          SUM(oi.price * oi.quantity) * 100.0 / (
            SELECT SUM(oi2.price * oi2.quantity) 
            FROM order_item oi2 
            INNER JOIN product p2 ON oi2.product_id = p2.id
            INNER JOIN "order" o2 ON oi2.order_id = o2.id
            WHERE o2.status != 'cancelled'
          ) as "percent"
        FROM
          order_item oi
          INNER JOIN product p ON oi.product_id = p.id
          INNER JOIN category c ON p.category_id = c.id
          INNER JOIN "order" o ON oi.order_id = o.id
        WHERE
          o.status != 'cancelled'
        GROUP BY
          c.id, c.name
        ORDER BY
          "amount" DESC
        LIMIT 5
      `);
    
    // Thống kê doanh thu theo thời gian
    const salesByPeriod = await AppDataSource
      .query(`
        SELECT
          to_char(o.created_at, 'YYYY-MM-DD') as "period",
          SUM(o.total_amount) as "amount",
          COUNT(o.id) as "orders"
        FROM
          "order" o
        WHERE
          o.created_at >= NOW() - INTERVAL '30 days'
          AND o.status != 'cancelled'
        GROUP BY
          to_char(o.created_at, 'YYYY-MM-DD')
        ORDER BY
          "period" ASC
      `);
    
    // Trả về kết quả
    res.json({
      totalOrders,
      totalRevenue: parseFloat(totalRevenue) || 0,
      totalProducts,
      totalUsers,
      newCustomers,
      productsSold: parseInt(productsSold) || 0,
      revenue: parseFloat(revenue) || 0,
      orderStats,
      salesByCategory,
      salesByPeriod
    });
  } catch (error) {
    console.error('Lỗi lấy thống kê dashboard:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy thống kê doanh thu theo khoảng thời gian
router.get('/revenue', authenticate, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Thiếu startDate hoặc endDate' });
    }
    
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Định dạng ngày không hợp lệ' });
    }
    
    // Format theo groupBy
    let format = '%Y-%m-%d';
    if (groupBy === 'month') {
      format = '%Y-%m';
    } else if (groupBy === 'week') {
      format = '%Y-%U';
    }
    
    // Query doanh thu theo khoảng thời gian
    const results = await AppDataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .select(`DATE_FORMAT(order.createdAt, '${format}')`, 'period')
      .addSelect('SUM(order.totalAmount)', 'amount')
      .addSelect('COUNT(order.id)', 'orders')
      .where('order.createdAt BETWEEN :start AND :end', { start, end })
      .andWhere('order.status != :cancelledStatus', { cancelledStatus: 'cancelled' })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();
    
    res.json(results);
  } catch (error) {
    console.error('Lỗi lấy thống kê doanh thu:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy top sản phẩm bán chạy
router.get('/products/top-selling', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const parsedLimit = parseInt(limit as string) || 5;
    
    const topProducts = await AppDataSource
      .query(`
        SELECT
          p.id,
          p.name,
          p.thumbnail_url as "imageUrl",
          SUM(oi.quantity) as "totalSold",
          SUM(oi.price * oi.quantity) as "revenue"
        FROM
          order_item oi
          INNER JOIN product p ON oi.product_id = p.id
          INNER JOIN "order" o ON oi.order_id = o.id
        WHERE
          o.status != 'cancelled'
        GROUP BY
          p.id, p.name, p.thumbnail_url
        ORDER BY
          "totalSold" DESC
        LIMIT ${parsedLimit}
      `);
    
    res.json(topProducts);
  } catch (error) {
    console.error('Lỗi lấy top sản phẩm bán chạy:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy đơn hàng gần đây
router.get('/orders/recent', authenticate, requireAdmin, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const parsedLimit = parseInt(limit as string) || 5;
    
    const recentOrders = await AppDataSource
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .select([
        'order.id',
        'order.orderNumber',
        'order.createdAt',
        'order.totalAmount',
        'order.status',
        'user.firstName',
        'user.lastName'
      ])
      .orderBy('order.createdAt', 'DESC')
      .take(parsedLimit)
      .getMany();
    
    // Format kết quả
    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      customerName: order.user 
        ? `${order.user.firstName} ${order.user.lastName}` 
        : 'Khách hàng ẩn danh',
      amount: order.totalAmount,
      status: order.status
    }));
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Lỗi lấy đơn hàng gần đây:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

export default router; 