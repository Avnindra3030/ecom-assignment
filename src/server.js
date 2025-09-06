import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();

const app = express();
app.use(express.json());

// Allow multiple origins (local + Vercel frontend)
app.use(
  cors({
    origin: process.env.ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecom_assign";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Base route
app.get("/", (req, res) =>
  res.json({ ok: true, service: "ecom-backend is running" })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
