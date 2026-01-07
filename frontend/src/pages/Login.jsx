import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/panel');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 relative z-10 overflow-y-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-md w-full space-y-8 glass p-8 rounded-2xl shadow-2xl border border-white/40 bg-white/80 my-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center mb-0">
              <img src="/logo.png" alt="BluePrint Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900 tracking-tight">
              BluePrint
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-bold font-display text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">Please sign in to your account.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-600/50 font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 bg-primary-900 relative overflow-hidden items-center justify-center p-12">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary-800 to-primary-950"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary-500/20 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-lg text-center">
          <div className="bg-white/10 p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/30 mb-6 animate-float" style={{ animationDelay: '1s' }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Your Dream Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-100">Awaits</span>
            </h2>
            <p className="text-lg text-primary-100 leading-relaxed">
              Join thousands of professionals who have found their perfect career match with BluePrint.
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
