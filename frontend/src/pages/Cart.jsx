// frontend/src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useAuth } from "../state/auth";
import { client, setAuth } from "../api";

const LOCAL_CART_KEY = "local_cart_v1";

export default function Cart() {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setAuth(token); }, [token]);

  useEffect(() => { loadCart(); }, [token]);

  async function loadCart() {
    setLoading(true);
    try {
      if (token) {
        // try to load server cart
        const res = await client.get("/api/cart");
        if (res?.data?.cart) {
          // server returns cart items with item populated
          setCart(res.data.cart.map(c => ({ id: c.item._id, product: c.item, qty: c.qty })));
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      // ignore, fall back to local
    }
    // fallback: localStorage
    const local = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
    setCart(local);
    setLoading(false);
  }

  async function updateQty(itemId, qty) {
    try {
      if (token) {
        await client.patch("/api/cart/update", { itemId, qty });
        loadCart();
      } else {
        const local = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
        const exists = local.find(c => c.id === itemId);
        if (exists) {
          if (qty <= 0) {
            const next = local.filter(c => c.id !== itemId);
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(next));
            setCart(next);
          } else {
            exists.qty = qty;
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(local));
            setCart(local);
          }
        }
      }
    } catch (e) {
      console.error(e);
      alert("Could not update quantity");
    }
  }
  async function removeItem(itemId) {
    try {
      if (token) {
        await client.delete("/api/cart/remove", { data: { itemId } });
        loadCart();
      } else {
        const local = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]").filter(c => c.id !== itemId);
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(local));
        setCart(local);
      }
    } catch (e) {
      console.error(e);
      alert("Could not remove item");
    }
  }

  const total = cart.reduce((s, c) => s + (c.product.price || 0) * c.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar cartCount={cart.reduce((s,c)=> s + c.qty,0)} />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">Your cart</h1>
        {loading ? (
          <div>Loading...</div>
        ) : cart.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl text-gray-600">Your cart is empty.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            {cart.map(c => (
              <div key={c.id} className="flex items-center gap-4 p-4 border-b">
                <img src={c.product.image} alt={c.product.title} className="w-28 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-medium">{c.product.title}</div>
                  <div className="text-sm text-gray-500">₹{c.product.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(c.id, c.qty - 1)} className="px-2 py-1 border rounded">-</button>
                  <div className="w-10 text-center">{c.qty}</div>
                  <button onClick={() => updateQty(c.id, c.qty + 1)} className="px-2 py-1 border rounded">+</button>
                </div>
                <button onClick={() => removeItem(c.id)} className="px-3 py-1 border rounded">Remove</button>
              </div>
            ))}
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold">Total: ₹{total}</div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Checkout</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
