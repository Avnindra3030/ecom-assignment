import { Router } from 'express';
import User from '../models/User.js';
import Item from '../models/Item.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// Get current user's cart
router.get('/', authRequired, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.item');
    res.json({ cart: user.cart || [] });
  } catch (e) { next(e); }
});

// Add item to cart: { itemId, qty }
router.post('/add', authRequired, async (req, res, next) => {
  try {
    const { itemId, qty=1 } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const user = await User.findById(req.user.id);
    const existing = user.cart.find(c => c.item.toString() === itemId);
    if (existing) existing.qty += Number(qty);
    else user.cart.push({ item: itemId, qty: Number(qty) });
    await user.save();
    await user.populate('cart.item');
    res.json({ cart: user.cart });
  } catch (e) { next(e); }
});

// Update qty: { itemId, qty }
router.patch('/update', authRequired, async (req, res, next) => {
  try {
    const { itemId, qty } = req.body;
    const user = await User.findById(req.user.id);
    const existing = user.cart.find(c => c.item.toString() === itemId);
    if (!existing) return res.status(404).json({ error: 'Not in cart' });
    if (qty <= 0) user.cart = user.cart.filter(c => c.item.toString() != itemId);
    else existing.qty = Number(qty);
    await user.save();
    await user.populate('cart.item');
    res.json({ cart: user.cart });
  } catch (e) { next(e); }
});

// Remove item: { itemId }
router.delete('/remove', authRequired, async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(c => c.item.toString() !== itemId);
    await user.save();
    await user.populate('cart.item');
    res.json({ cart: user.cart });
  } catch (e) { next(e); }
});

export default router;
