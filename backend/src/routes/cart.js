import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Get cart
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.item');
  res.json(cart || { items: [] });
});

// Add item to cart
router.post('/add', protect, async (req, res) => {
  const { itemId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(i => i.item.toString() === itemId);
  if (existingItem) existingItem.quantity += quantity;
  else cart.items.push({ item: itemId, quantity });

  await cart.save();
  res.json(cart);
});

// Remove item from cart
router.post('/remove', protect, async (req, res) => {
  const { itemId } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });

  cart.items = cart.items.filter(i => i.item.toString() !== itemId);
  await cart.save();
  res.json(cart);
});

export default router;
