import express from 'express';
import Item from '../models/Item.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Create item
router.post('/', protect, async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

// Get items with filters
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);

  const items = await Item.find(filter);
  res.json(items);
});

// Update item
router.put('/:id', protect, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete item
router.delete('/:id', protect, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

export default router;
