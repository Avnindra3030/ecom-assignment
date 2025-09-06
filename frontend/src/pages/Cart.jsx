import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { client, setAuth } from '../api'
import { useAuth } from '../state/auth'

export default function Cart() {
  const [cart, setCart] = useState([])
  const { token } = useAuth()

  useEffect(()=>{ setAuth(token) }, [token])

  async function load() {
    const { data } = await client.get('/api/cart')
    setCart(data.cart || [])
  }
  useEffect(()=>{ load() }, [])

  async function update(itemId, qty) {
    await client.patch('/api/cart/update', { itemId, qty })
    load()
  }
  async function remove(itemId) {
    await client.delete('/api/cart/remove', { data: { itemId } })
    load()
  }

  const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0)

  return (
    <div>
      <NavBar />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-4">Your Cart</h1>
        <div className="bg-white border rounded-2xl">
          {cart.length === 0 ? (
            <div className="p-6 text-gray-600">Your cart is empty.</div>
          ) : cart.map(c => (
            <div key={c.item._id} className="flex items-center gap-4 p-4 border-b">
              <img src={c.item.image} className="w-24 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-medium">{c.item.title}</div>
                <div className="text-sm text-gray-600 capitalize">{c.item.category}</div>
                <div className="text-lg font-semibold">₹{c.item.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded-lg" onClick={()=>update(c.item._id, c.qty-1)}>-</button>
                <div className="w-10 text-center">{c.qty}</div>
                <button className="px-2 py-1 border rounded-lg" onClick={()=>update(c.item._id, c.qty+1)}>+</button>
              </div>
              <button className="px-3 py-1 border rounded-lg" onClick={()=>remove(c.item._id)}>Remove</button>
            </div>
          ))}
          {cart.length>0 && (
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold">Total: ₹{total}</div>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
