import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'jobseeker';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, roleParam);
    setLoading(false);

    if (result.success) {
      if (roleParam === 'recruiter' || roleParam === 'admin') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[500px] h-[500px] bg-secondary-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Column - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:px-6 lg:px-8 z-10 transition-all duration-300">
        <div className="w-full max-w-lg">
          <div className="glass-card p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </Link>
              <h2 className="text-3xl font-bold font-heading">Create Account</h2>
              <p className="mt-2 text-slate-400">Join thousands of professionals</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => navigate('/register')}
                      className={`relative flex items-center justify-center py-3 px-4 border rounded-xl transition-all duration-200 ${roleParam !== 'recruiter'
                          ? 'bg-primary-500/20 border-primary-500 ring-1 ring-primary-500 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                      <span className="font-semibold text-sm">Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/register?role=recruiter')}
                      className={`relative flex items-center justify-center py-3 px-4 border rounded-xl transition-all duration-200 ${roleParam === 'recruiter'
                          ? 'bg-primary-500/20 border-primary-500 ring-1 ring-primary-500 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                      <span className="font-semibold text-sm">Recruiter</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white py-3 px-4 rounded-lg font-semibold shadow-lg shadow-primary-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative bg-slate-900/50 backdrop-blur-sm items-center justify-center p-12 overflow-hidden">
        <div className="relative z-10 max-w-lg text-center">
          <div className="mb-8 relative inline-block">
            <div className="absolute inset-0 bg-secondary-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3281/3281329.png"
              alt="Register"
              className="w-64 h-64 object-contain relative z-10 drop-shadow-2xl animate-float"
            />
          </div>
          <h2 className="text-4xl font-bold font-heading mb-6 leading-tight">
            Start Your <span className="text-gradient">Journey</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Create an account to access exclusive job opportunities and connect with top recruiters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
