import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex flex-col relative">
      
      {/* Top Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
            <Wallet size={18} className="sm:w-5 sm:h-5" />
          </div>
          <span className="font-black text-lg sm:text-xl text-slate-900 tracking-tighter">FinTrack</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex gap-8 items-center font-semibold text-sm">
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
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu Container */}
        <div className="sm:hidden relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-slate-600 p-2 active:scale-90 transition-transform bg-slate-50 rounded-xl border border-slate-100"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-[60]">
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  isActive('/profile') ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'
                }`}
              >
                <User size={18} />
                Profile Settings
              </Link>
              <div className="h-px bg-slate-50 mx-2 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 w-full text-left active:bg-rose-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-32 sm:pb-8 animate-in fade-in duration-500">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-8 py-3 flex justify-around items-center z-[100] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${
            isActive('/') ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard size={22} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
        </Link>

        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all active:scale-90 ${
            isActive('/profile') ? 'text-blue-600' : 'text-slate-400'
          }`}
        >
          <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;