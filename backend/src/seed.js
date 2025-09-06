import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from './models/Item.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecom_assign';
await mongoose.connect(MONGO_URI);

await Item.deleteMany({});
await Item.insertMany([
  { title: 'Classic White Tee', price: 499, category: 'apparel', image: 'https://picsum.photos/seed/tee/400/300' },
  { title: 'Denim Jeans', price: 1299, category: 'apparel', image: 'https://picsum.photos/seed/jeans/400/300' },
  { title: 'Wireless Mouse', price: 899, category: 'electronics', image: 'https://picsum.photos/seed/mouse/400/300' },
  { title: 'Mechanical Keyboard', price: 3499, category: 'electronics', image: 'https://picsum.photos/seed/keyboard/400/300' },
  { title: 'Sports Water Bottle', price: 299, category: 'fitness', image: 'https://picsum.photos/seed/bottle/400/300' },
]);
console.log('Seed complete');
process.exit(0);
