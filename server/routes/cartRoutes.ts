import { Router } from 'express';
import { AppDataSource } from '../database.config';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';
import { validate } from '../validation/validator';
import { addToCartSchema, updateCartItemSchema } from '../validation/cartSchema';

const router = Router();
const cartRepository = AppDataSource.getRepository(Cart);
const productRepository = AppDataSource.getRepository(Product);
const userRepository = AppDataSource.getRepository(User);

// Lấy giỏ hàng của người dùng hiện tại
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Lấy giỏ hàng với sản phẩm
    const cartItems = await cartRepository.find({
      where: { userId },
      relations: ['product']
    });
    
    // Tính tổng giỏ hàng
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    // Transform data để trả về
    const items = cartItems.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      thumbnailUrl: item.product.thumbnailUrl,
      stock: item.product.stock,
      subtotal: item.product.price * item.quantity
    }));
    
    res.json({
      message: 'Lấy giỏ hàng thành công',
      cart: {
        items,
        total,
        count: items.length
      }
    });
  } catch (error) {
    console.error('Lỗi lấy giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/', authenticate, validate(addToCartSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    // Kiểm tra sản phẩm tồn tại và còn hàng
    const product = await productRepository.findOneBy({ id: productId });
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    if (!product.isActive) {
      return res.status(400).json({ message: 'Sản phẩm không khả dụng' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Số lượng vượt quá hàng tồn kho',
        availableStock: product.stock
      });
    }
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await cartRepository.findOne({
      where: { userId, productId }
    });
    
    if (cartItem) {
      // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
      const newQuantity = cartItem.quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({ 
          message: 'Số lượng vượt quá hàng tồn kho',
          availableStock: product.stock,
          currentlyInCart: cartItem.quantity
        });
      }
      
      cartItem.quantity = newQuantity;
      await cartRepository.save(cartItem);
    } else {
      // Thêm mới nếu sản phẩm chưa có trong giỏ hàng
      cartItem = cartRepository.create({
        userId,
        productId,
        quantity
      });
      
      await cartRepository.save(cartItem);
    }
    
    res.status(201).json({
      message: 'Thêm vào giỏ hàng thành công',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity
      }
    });
  } catch (error) {
    console.error('Lỗi thêm vào giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/:id', authenticate, validate(updateCartItemSchema), async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;
    
    // Tìm item trong giỏ hàng
    const cartItem = await cartRepository.findOne({
      where: { id, userId },
      relations: ['product']
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    // Kiểm tra số lượng tồn kho
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Số lượng vượt quá hàng tồn kho',
        availableStock: cartItem.product.stock
      });
    }
    
    // Cập nhật số lượng
    cartItem.quantity = quantity;
    await cartRepository.save(cartItem);
    
    res.json({
      message: 'Cập nhật giỏ hàng thành công',
      cartItem: {
        id: cartItem.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity
      }
    });
  } catch (error) {
    console.error('Lỗi cập nhật giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Tìm item trong giỏ hàng
    const cartItem = await cartRepository.findOne({
      where: { id, userId }
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    // Xóa khỏi giỏ hàng
    await cartRepository.remove(cartItem);
    
    res.json({
      message: 'Đã xóa sản phẩm khỏi giỏ hàng'
    });
  } catch (error) {
    console.error('Lỗi xóa sản phẩm khỏi giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa toàn bộ giỏ hàng
router.delete('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Xóa tất cả giỏ hàng của người dùng
    await cartRepository.delete({ userId });
    
    res.json({
      message: 'Đã xóa toàn bộ giỏ hàng'
    });
  } catch (error) {
    console.error('Lỗi xóa toàn bộ giỏ hàng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

export default router; 