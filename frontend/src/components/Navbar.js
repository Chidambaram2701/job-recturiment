import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass bg-slate-900/80' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-primary-500/25">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold font-heading text-white tracking-tight">
                Job<span className="text-primary-400">Portal</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/') ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/jobs') ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                {user.role === 'recruiter' || user.role === 'admin' ? (
                  <Link
                    to="/recruiter/dashboard"
                    className={`text-sm font-medium transition-colors duration-200 ${isActive('/recruiter/dashboard') ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Recruiter Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors duration-200 ${isActive('/dashboard') ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/panel"
                    className={`text-sm font-medium transition-colors duration-200 ${isActive('/admin/panel') ? 'text-primary-400' : 'text-slate-300 hover:text-white'}`}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-6 pl-6 border-l border-slate-700">
                  <span className="text-slate-400 text-sm">Welcome, <span className="text-white font-semibold">{user.name}</span></span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





