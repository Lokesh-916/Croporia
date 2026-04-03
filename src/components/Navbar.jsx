import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('croporia_user') || 'null')
  const isExpert = user?.role === 'Expert'
  const [menuOpen, setMenuOpen] = useState(false)
  const handleLogout = () => { localStorage.removeItem('croporia_token'); localStorage.removeItem('croporia_user'); navigate('/login') }
  const isActive = (p) => location.pathname.startsWith(p)
  const farmerLinks = [{to:'/crops',l:'Wiki'},{to:'/practices',l:'Practices'},{to:'/fields',l:'My Farm'},{to:'/learn',l:'Learn'},{to:'/experts',l:'Experts'},{to:'/simulator',l:'Simulator'},{to:'/predictor',l:'Predict'},{to:'/pest-health',l:'Scan'},{to:'/market',l:'Market'},{to:'/community',l:'Community'}]
  const expertLinks = [{to:'/expert-dashboard',l:'Dashboard'},{to:'/crops',l:'Wiki'},{to:'/practices',l:'Practices'},{to:'/learn',l:'Learn'},{to:'/pest-health',l:'Scan'},{to:'/community',l:'Community'}]
  const links = isExpert ? expertLinks : farmerLinks
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-8 bg-white/95 backdrop-blur border-b border-olive/20 h-14">
      <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
        <img src="/organic.png" alt="Croporia" className="w-6 h-6 object-contain" />
        <span className="font-cinzel font-black text-xl text-black-forest group-hover:text-forest transition-colors">Croporia</span>
        {isExpert && <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-copper bg-vanilla border border-cream px-2 py-0.5 rounded-full">Expert</span>}
      </Link>
      <div className="hidden lg:flex items-center gap-5 text-[11px] font-semibold text-ash uppercase tracking-[0.18em]">
        {links.map(({to,l}) => (<Link key={to} to={to} className={isActive(to)?'text-black-forest border-b-2 border-forest pb-0.5':'hover:text-sage transition-colors'}>{l}</Link>))}
      </div>
      <div className="flex items-center gap-3">
        {user ? (<div className="hidden md:flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-frosted text-black-forest flex items-center justify-center font-semibold text-sm border border-olive">{user.name.charAt(0).toUpperCase()}</div><span className="text-sm font-medium text-ash">{user.name.split(' ')[0]}</span><button onClick={handleLogout} className="text-[11px] font-semibold text-dusty hover:text-red-600 transition-colors uppercase">Logout</button></div>) : (<div className="hidden md:flex items-center gap-3"><Link to="/login" className="text-xs font-medium text-ash hover:text-forest">Login</Link><Link to="/signup" className="text-[11px] font-bold px-4 py-2 border hover:bg-frosted rounded-full border-olive text-black-forest">Join</Link></div>)}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={()=>setMenuOpen(!menuOpen)}>
          <span className="block h-0.5 w-5 bg-ash" />
          <span className="block h-0.5 w-5 bg-ash" />
          <span className="block h-0.5 w-5 bg-ash" />
        </button>
      </div>
      {menuOpen && (<div className="absolute top-14 left-0 right-0 bg-white border-b border-tea px-6 py-4 lg:hidden shadow-lg z-50"><div className="grid grid-cols-3 gap-2 mb-4">{links.map(({to,l})=>(<Link key={to} to={to} onClick={()=>setMenuOpen(false)} className={isActive(to)?'text-xs font-semibold px-2 py-2 rounded-lg text-center bg-frosted text-black-forest':'text-xs font-semibold px-2 py-2 rounded-lg text-center text-ash hover:text-forest'}>{l}</Link>))}</div>{user?(<div className="flex items-center justify-between pt-3 border-t border-tea"><span className="text-sm text-ash">{user.name}</span><button onClick={handleLogout} className="text-xs font-semibold text-red-500">Logout</button></div>):(<div className="flex gap-3 pt-3 border-t border-tea"><Link to="/login" onClick={()=>setMenuOpen(false)} className="flex-1 text-center text-sm text-ash py-2">Login</Link><Link to="/signup" onClick={()=>setMenuOpen(false)} className="flex-1 text-center text-sm font-bold bg-forest text-white rounded-lg py-2">Join</Link></div>)}</div>)}
    </nav>
  )
}