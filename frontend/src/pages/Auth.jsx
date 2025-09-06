import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { client } from '../api'
import { useAuth } from '../state/auth'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [err, setErr] = useState('')
  const nav = useNavigate()
  const { setToken, setUser } = useAuth()

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
      const { data } = await client.post(url, form)
      setToken(data.token); setUser(data.user)
      nav('/')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">{mode === 'login' ? 'Login' : 'Create account'}</h1>
        <div className="flex gap-2 mb-6">
          <button onClick={()=>setMode('login')} className={'flex-1 px-3 py-2 rounded-lg border ' + (mode==='login'?'bg-gray-100':'')}>Login</button>
          <button onClick={()=>setMode('signup')} className={'flex-1 px-3 py-2 rounded-lg border ' + (mode==='signup'?'bg-gray-100':'')}>Sign up</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode==='signup' && (
            <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" required
              value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          )}
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" type="email" required
            value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Password" type="password" required
            value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="w-full bg-blue-600 text-white rounded-lg py-2">Continue</button>
        </form>
      </div>
    </div>
  )
}
