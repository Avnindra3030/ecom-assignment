// frontend/src/components/ProductCard.jsx
import React from "react";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col">
      <div className="h-48 w-full overflow-hidden rounded-t-2xl">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transform hover:scale-105 transition"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold">{product.title}</h3>
          <div className="text-sm text-gray-500 capitalize">{product.category}</div>
        </div>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="font-bold text-lg">₹{product.price}</div>
            <div className="flex items-center text-sm text-gray-500 gap-1">
              <Star size={14} /> <span>{product.rating}</span>
              <span className="mx-1">·</span>
              <span>{product.reviews} reviews</span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow"
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
