import { Router } from 'express';
import { Order } from '../models/Order';
import { AppDataSource } from '../database.config';

const router = Router();
const orderRepository = AppDataSource.getRepository(Order);

// Lấy danh sách đơn hàng
router.get('/', async (req, res) => {
  try {
    const orders = await orderRepository.find({ relations: ['items'] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách đơn hàng' });
  }
});

// Tạo đơn hàng mới
router.post('/', async (req, res) => {
  try {
    const newOrder = orderRepository.create(req.body);
    await orderRepository.save(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi tạo đơn hàng' });
  }
});

// Lấy thông tin đơn hàng theo ID
router.get('/:id', async (req, res) => {
  try {
    const order = await orderRepository.findOne({
      where: { id: req.params.id },
      relations: ['items']
    });
    if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin đơn hàng' });
  }
});

export default router;