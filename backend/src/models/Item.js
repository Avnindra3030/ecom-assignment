import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, index: true },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Item', ItemSchema);
