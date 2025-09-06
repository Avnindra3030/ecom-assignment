// frontend/src/components/NavBar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../state/auth";

export default function NavBar({ cartCount = 0, onSearch }) {
  const { token, setToken, setUser } = useAuth();
  const [q, setQ] = useState("");
  const nav = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    if (onSearch) onSearch(q);
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold text-indigo-600">ShopNow</Link>

          <form onSubmit={submitSearch} className="hidden sm:flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-80 px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-lg">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <button onClick={() => nav("/auth")} className="px-4 py-2 border rounded-lg">Sign in</button>
          ) : (
            <button
              onClick={() => { setToken(null); setUser(null); nav("/"); }}
              className="px-4 py-2 border rounded-lg"
            >
              Logout
            </button>
          )}

          <Link to="/cart" className="relative">
            <ShoppingCart size={26} className="text-indigo-600" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

