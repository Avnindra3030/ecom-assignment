import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Auth from './pages/Auth.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'
import { AuthProvider, useAuth } from './state/auth.jsx'

function Protected({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/auth" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
