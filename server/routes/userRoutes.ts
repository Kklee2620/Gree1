import { Router } from 'express';
import { User } from '../models/User';
import { AppDataSource } from '../database.config';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Lấy danh sách người dùng
router.get('/', async (req, res) => {
  try {
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách người dùng' });
  }
});

// Tạo người dùng mới
router.post('/', async (req, res) => {
  try {
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi tạo người dùng' });
  }
});

// Lấy thông tin người dùng theo ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userRepository.findOneBy({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin người dùng' });
  }
});

export default router;