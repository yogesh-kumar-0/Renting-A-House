import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => { setSearchQuery(searchParams.get('search') || ''); }, [searchParams]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    const success = await logout();
    if (success) navigate('/user/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/listing?search=${encodeURIComponent(searchQuery.trim())}` : '/listing');
    setMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname.startsWith('/listing')) {
      navigate(val.trim() ? `/listing?search=${encodeURIComponent(val.trim())}` : '/listing', { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
            <i className="fa-solid fa-house text-white text-sm"></i>
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">Rent a House</span>
        </Link>

        {/* Search — hidden on mobile, visible md+ */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
          <div className="relative w-full">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              type="search"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search destinations, cities..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none transition-all focus:border-red-500 focus:bg-white pl-10"
            />
          </div>
        </form>

        {/* Desktop Nav — hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 ml-auto flex-shrink-0">
          <Link to="/listing" className="px-3.5 py-2 text-gray-500 text-sm font-medium no-underline rounded-lg transition-all hover:text-gray-900 hover:bg-gray-50">
            Explore
          </Link>
          {!user ? (
            <>
              <Link to="/user/login" className="px-3.5 py-2 text-gray-500 text-sm font-medium no-underline rounded-lg transition-all hover:text-gray-900 hover:bg-gray-50">
                Login
              </Link>
              <Link to="/user/signup" className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold no-underline rounded-lg shadow-md hover:shadow-lg transition-all">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/listing/new" className="px-3.5 py-2 text-gray-500 text-xs font-semibold no-underline rounded-lg border border-gray-200 transition-all hover:border-red-500 hover:text-red-500 flex items-center gap-1.5">
                <i className="fa-solid fa-plus text-xs"></i> Add
              </Link>
              <Link to="/user/profile" className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 no-underline transition-all hover:border-red-500 hover:bg-red-50">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-700 font-semibold max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="px-3.5 py-2 text-gray-400 text-xs font-medium border-0 bg-transparent cursor-pointer rounded-lg transition-all hover:text-red-500 hover:bg-red-50">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile right side — avatar/login + hamburger */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          {user ? (
            <Link to="/user/profile" className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold no-underline flex-shrink-0">
              {user.username?.[0]?.toUpperCase()}
            </Link>
          ) : (
            <Link to="/user/login" className="px-3 py-1.5 text-gray-500 text-sm font-medium no-underline rounded-lg transition-all hover:text-gray-900 hover:bg-gray-50">
              Login
            </Link>
          )}

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white transition-all hover:border-red-400 hover:bg-red-50"
            aria-label="Toggle menu"
          >
            <span className={`block w-4.5 h-0.5 bg-gray-600 rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ width: '18px', height: '2px', display: 'block', backgroundColor: '#4b5563', borderRadius: '9999px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }}></span>
            <span className={`block bg-gray-600 rounded-full transition-all duration-300`} style={{ width: '18px', height: '2px', backgroundColor: '#4b5563', borderRadius: '9999px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }}></span>
            <span className={`block bg-gray-600 rounded-full transition-all duration-300`} style={{ width: '18px', height: '2px', display: 'block', backgroundColor: '#4b5563', borderRadius: '9999px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        style={{
          maxHeight: menuOpen ? '500px' : '0',
          opacity: menuOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.25s ease',
        }}
        className="md:hidden border-t border-gray-100 bg-white"
      >
        <div className="px-4 py-4 flex flex-col gap-3">

          {/* Mobile Search */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
              <input
                type="search"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 outline-none focus:border-red-400 focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Divider */}
          <div className="h-px bg-gray-100"></div>

          {/* Mobile Links */}
          <Link to="/listing" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-600 text-sm font-medium no-underline rounded-xl hover:bg-gray-50 transition-all">
            <i className="fa-solid fa-compass text-red-400 w-4 text-center"></i>
            Explore Listings
          </Link>

          {!user ? (
            <>
              <Link to="/user/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-600 text-sm font-medium no-underline rounded-xl hover:bg-gray-50 transition-all">
                <i className="fa-solid fa-right-to-bracket text-red-400 w-4 text-center"></i>
                Login
              </Link>
              <Link to="/user/signup" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold no-underline rounded-xl shadow-md transition-all">
                <i className="fa-solid fa-user-plus text-xs"></i>
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link to="/listing/new" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-600 text-sm font-medium no-underline rounded-xl hover:bg-gray-50 transition-all">
                <i className="fa-solid fa-plus text-red-400 w-4 text-center"></i>
                Add New Listing
              </Link>
              <Link to="/user/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-gray-600 text-sm font-medium no-underline rounded-xl hover:bg-gray-50 transition-all">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span>{user.username}</span>
              </Link>

              {/* Divider */}
              <div className="h-px bg-gray-100"></div>

              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-red-400 text-sm font-medium border-0 bg-transparent cursor-pointer rounded-xl hover:bg-red-50 transition-all w-full text-left">
                <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
