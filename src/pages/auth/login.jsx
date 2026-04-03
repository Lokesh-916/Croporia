import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const data = await res.json()
      if (res.ok) { localStorage.setItem('croporia_token', data.token); localStorage.setItem('croporia_user', JSON.stringify(data.user)); navigate('/community') }
      else setError(data.error || 'Login failed')
    } catch { setError('Cannot connect to server') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-vanilla flex items-center justify-center relative overflow-hidden font-sans px-4">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tea rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-olive rounded-full blur-[100px] opacity-30 pointer-events-none" />
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-3xl border border-olive/30 shadow-[0_20px_60px_-15px_rgba(20,54,1,0.12)] relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/organic.png" alt="Croporia" className="w-7 h-7 object-contain" />
            <span className="font-cinzel font-black text-2xl text-black-forest group-hover:text-forest transition-colors">Croporia</span>
          </Link>
          <p className="text-sm font-semibold text-ash/70 tracking-widest uppercase mt-3">Welcome back</p>
        </div>
        {error && <div className="bg-red-50 text-red-700 text-sm font-semibold p-4 rounded-xl mb-6 border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-ash uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-palm" />
              <input type="email" required placeholder="farmer@croporia.com" className="w-full bg-frosted/50 pl-11 pr-5 py-3.5 rounded-xl text-sm font-medium text-black-forest border border-olive/40 focus:border-forest focus:ring-4 focus:ring-forest/10 transition-all outline-none" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-ash uppercase tracking-widest">Password</label>
              <a href="#" className="text-xs font-semibold text-forest hover:text-black-forest transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-palm" />
              <input type="password" required placeholder="••••••••" className="w-full bg-frosted/50 pl-11 pr-5 py-3.5 rounded-xl text-sm font-medium text-black-forest border border-olive/40 focus:border-forest focus:ring-4 focus:ring-forest/10 transition-all outline-none" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full mt-2 bg-black-forest hover:bg-forest text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-medium text-ash">New to Croporia? <Link to="/signup" className="font-bold text-black-forest hover:text-forest transition-colors underline underline-offset-4">Register your farm</Link></p>
      </div>
    </div>
  )
}
