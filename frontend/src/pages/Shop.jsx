// frontend/src/pages/Shop.jsx
import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import { products as dummyProducts } from "../data/products";
import { useAuth } from "../state/auth";
import { client, setAuth } from "../api";

const LOCAL_CART_KEY = "local_cart_v1";

export default function Shop() {
  const { token } = useAuth();
  const [items, setItems] = useState(dummyProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { setAuth(token); }, [token]);

  useEffect(() => {
    // load local cart count
    const local = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
    setCartCount(local.reduce((s, c) => s + c.qty, 0));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(dummyProducts.map(p => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter(p => (!query || p.title.toLowerCase().includes(query.toLowerCase())))
      .filter(p => (!category || category === "All" ? true : p.category === category))
      .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
      .sort((a, b) => {
        if (sort === "low") return a.price - b.price;
        if (sort === "high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [items, query, category, sort, priceRange]);

  async function addToCart(product) {
    // If you have a backend item id and authenticated, you could try to POST to /api/cart/add here.
    // For dummy-data UX we save cart locally so the UI feels real.
    try {
      if (token && product.apiId) {
        // optional: persist to backend if product.apiId is set
        await client.post("/api/cart/add", { itemId: product.apiId, qty: 1 });
        // fetch new cart count from server if needed
      } else {
        // localStorage cart
        const local = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
        const existing = local.find(c => c.id === product.id);
        if (existing) existing.qty += 1;
        else local.push({ id: product.id, product, qty: 1 });
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(local));
        setCartCount(local.reduce((s, c) => s + c.qty, 0));
      }
      alert("Added to cart");
    } catch (e) {
      console.error(e);
      alert("Could not add to cart");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar cartCount={cartCount} onSearch={setQuery} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select className="w-full border rounded-lg px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c === "All" ? "" : c}>{c}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Sort</label>
              <select className="w-full border rounded-lg px-3 py-2" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Price up to</label>
              <input type="range" min="0" max="50000" value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} />
              <div className="text-sm text-gray-700 mt-1">Up to ₹{priceRange[1]}</div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Featured products</h2>
                <p className="text-sm text-gray-600">{filtered.length} results</p>
              </div>
              <div className="flex items-center gap-2">
                <input placeholder="Search products..." value={query} onChange={e => setQuery(e.target.value)}
                  className="border rounded-lg px-3 py-2 hidden sm:block w-64" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
