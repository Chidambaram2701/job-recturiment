import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src="/logo.png"
                alt="Blueprint Logo"
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                BluePrint
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Browse Jobs</Link>
            {user && (
              <>
                {user.role === 'jobseeker' && (
                  <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Dashboard</Link>
                )}
                {user.role === 'recruiter' && (
                  <Link to="/recruiter/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Recruiter Dashboard</Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/panel" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Admin Panel</Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-gray-900 leading-none">{user.name}</div>
                  <div className="text-xs text-primary-600 font-medium mt-1 capitalize">{user.role}</div>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold shadow-sm ring-2 ring-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium text-sm px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all duration-300"
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
