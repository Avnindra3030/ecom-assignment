import { useEffect, useMemo, useState } from 'react'
import NavBar from '../components/NavBar'
import { client } from '../api'
import { useAuth } from '../state/auth'
import { setAuth } from '../api'
import { Link } from 'react-router-dom'

export default function Shop() {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ q:'', category:'', min:'', max:'', sort:'createdAt:desc', page:1 })
  const { token } = useAuth()
  useEffect(()=>{ setAuth(token) }, [token])

  useEffect(()=>{
    (async ()=>{
      const { data } = await client.get('/api/items', { params: filters })
      setItems(data.items); setTotal(data.total)
    })()
  }, [filters])

  async function addToCart(id) {
    if (!token) return alert('Please login first')
    await client.post('/api/cart/add', { itemId: id, qty: 1 })
    alert('Added to cart')
  }

  const categories = useMemo(()=>['apparel','electronics','fitness'], [])

  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 bg-white p-4 rounded-2xl border">
            <h2 className="font-semibold mb-3">Filters</h2>
            <input className="w-full border rounded-lg px-3 py-2 mb-2" placeholder="Search"
              value={filters.q} onChange={e=>setFilters(f=>({...f, q:e.target.value, page:1}))} />
            <select className="w-full border rounded-lg px-3 py-2 mb-2" value={filters.category}
              onChange={e=>setFilters(f=>({...f, category:e.target.value, page:1}))}>
              <option value="">All categories</option>
              {categories.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2 mb-2">
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Min price" type="number"
                value={filters.min} onChange={e=>setFilters(f=>({...f, min:e.target.value, page:1}))} />
              <input className="w-full border rounded-lg px-3 py-2" placeholder="Max price" type="number"
                value={filters.max} onChange={e=>setFilters(f=>({...f, max:e.target.value, page:1}))} />
            </div>
            <select className="w-full border rounded-lg px-3 py-2 mb-2" value={filters.sort}
              onChange={e=>setFilters(f=>({...f, sort:e.target.value}))}>
              <option value="createdAt:desc">Newest</option>
              <option value="price:asc">Price: Low to High</option>
              <option value="price:desc">Price: High to Low</option>
            </select>
          </aside>
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Items</h2>
              <Link to="/cart" className="text-blue-600 underline">Go to cart</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(it => (
                <div key={it._id} className="bg-white border rounded-2xl overflow-hidden">
                  <img src={it.image} alt={it.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <div className="font-semibold">{it.title}</div>
                    <div className="text-sm text-gray-600 capitalize">{it.category}</div>
                    <div className="text-lg font-bold mt-2">₹{it.price}</div>
                    <button onClick={()=>addToCart(it._id)} className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white">Add to cart</button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
