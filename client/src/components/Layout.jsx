import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, User, LogOut, LayoutDashboard } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <Wallet size={20} />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter">FinTrack</span>
        </Link>

        <div className="flex gap-8 items-center font-semibold text-sm">
          <Link 
            to="/" 
            className={`flex items-center gap-2 transition-colors ${
              isActive('/') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          
          <Link 
            to="/profile" 
            className={`flex items-center gap-2 transition-colors ${
              isActive('/profile') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <User size={18} />
            Profile
          </Link>

          <div className="h-6 w-[1px] bg-slate-200"></div>

          <button 
            onClick={handleLogout} 
            className="text-slate-400 hover:text-red-500 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};

export default Layout;