import { Router } from 'express';
import Item from '../models/Item.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// List with filters: ?q=&category=&min=&max=&sort=price:asc&page=1&limit=12
router.get('/', async (req, res, next) => {
  try {
    const { q, category, min, max, sort='createdAt:desc', page=1, limit=20 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = Number(min);
      if (max) filter.price.$lte = Number(max);
    }
    const [sortField, sortDir] = sort.split(':');
    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .sort({ [sortField]: sortDir === 'asc' ? 1 : -1 })
      .skip((Number(page)-1)*Number(limit))
      .limit(Number(limit));
    res.json({ items, total });
  } catch (e) { next(e); }
});

// Create
router.post('/', authRequired, async (req, res, next) => {
  try {
    const { title, price, category, image } = req.body;
    const item = await Item.create({ title, price, category, image });
    res.status(201).json(item);
  } catch (e) { next(e); }
});

// Update
router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Delete
router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
