import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('croporia_token')
    localStorage.removeItem('croporia_user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <nav className="sticky top-0 z-40 h-14 flex items-center justify-between px-6 md:px-8 bg-white/92 backdrop-blur border-b border-emerald-50">
      <Link to="/" className="flex items-center gap-2 group">
        <span className="heading-script text-xl text-emerald-800 group-hover:text-emerald-900 transition-colors">
          Croporia
        </span>
        <span className="hidden sm:inline-block text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600/80">
          Farm assistant
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-7 text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
        <Link 
          to="/crops" 
          className={
            isActive('/crops')
              ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
              : 'hover:text-emerald-700 transition-colors'
          }
        >
          Wiki
        </Link>
        <Link 
          to="/practices" 
          className={
            isActive('/practices')
              ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
              : 'hover:text-emerald-700 transition-colors'
          }
        >
          Practices
        </Link>
        <Link 
          to="/fields" 
          className={
            isActive('/fields')
              ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
              : 'hover:text-emerald-700 transition-colors'
          }
        >
          My Farm
        </Link>
        <Link 
          to="/community" 
          className={
            isActive('/community')
              ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
              : 'hover:text-emerald-700 transition-colors'
          }
        >
          Community
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                {user.name.split(' ')[0]}
              </span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-[0.18em]"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-600 hover:text-emerald-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn-secondary text-[11px] px-3 py-1.5 border-emerald-200 text-emerald-800"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
