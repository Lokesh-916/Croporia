import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('croporia_user'));

  const handleLogout = () => {
    localStorage.removeItem('croporia_token');
    localStorage.removeItem('croporia_user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-8 bg-white/92 backdrop-blur border-b border-gray-100">
      <Link to="/crops" className="text-gray-900 font-black text-xl tracking-tight">Croporia</Link>
      
      <div className="flex items-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
        <Link 
          to="/crops" 
          className={isActive('/crops') ? "text-green-700 border-b-2 border-green-700 pb-0.5" : "hover:text-green-700 transition-colors"}
        >
          Wiki
        </Link>
        <Link 
          to="/practices" 
          className={isActive('/practices') ? "text-green-700 border-b-2 border-green-700 pb-0.5" : "hover:text-green-700 transition-colors"}
        >
          Practices
        </Link>
        <Link 
          to="/fields" 
          className={isActive('/fields') ? "text-green-700 border-b-2 border-green-700 pb-0.5" : "hover:text-green-700 transition-colors"}
        >
          My Farm
        </Link>
        <Link 
          to="/community" 
          className={isActive('/community') ? "text-green-700 border-b-2 border-green-700 pb-0.5" : "hover:text-green-700 transition-colors"}
        >
          Community
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-green-700 transition-colors">{user.name.split(' ')[0]}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-green-700 transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 bg-[#1a3d0a] text-white text-xs font-bold rounded-lg hover:bg-green-900 transition-colors">Join</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
