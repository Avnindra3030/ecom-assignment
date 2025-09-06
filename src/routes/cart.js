import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.item");
  res.json(cart || { items: [] });
});

// Add item to cart
router.post("/", protect, async (req, res) => {
  const { itemId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.item.toString() === itemId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ item: itemId, quantity: quantity || 1 });
  }

  await cart.save();
  res.json(cart);
});

// Remove item from cart
router.delete("/:itemId", protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.item.toString() !== req.params.itemId
  );

  await cart.save();
  res.json(cart);
});

export default router;
