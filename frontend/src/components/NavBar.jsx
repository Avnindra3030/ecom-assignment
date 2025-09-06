import { Link } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function NavBar() {
  const { token, setToken, setUser } = useAuth()
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <Link to="/" className="text-xl font-semibold">Shop<span className="text-blue-600">Smart</span></Link>
      <div className="flex items-center gap-3">
        <Link to="/cart" className="px-3 py-1 rounded-lg border">Cart</Link>
        {!token ? (
          <Link to="/auth" className="px-3 py-1 rounded-lg bg-blue-600 text-white">Login</Link>
        ) : (
          <button onClick={()=>{ setToken(null); setUser(null); }} className="px-3 py-1 rounded-lg border">Logout</button>
        )}
      </div>
    </div>
  )
}
