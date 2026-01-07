import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Background Decorations (Light Mode) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary-100/40 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-500"></span>
              </span>
              <span className="text-gray-600 text-sm font-medium tracking-wide">
                #1 PLATFORM FOR HIRING
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-gray-900">
              Find the <span className="text-primary-600">Perfect</span> <br />
              Candidate <span className="text-secondary-500">Fast.</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Connect with top talent and innovative companies. Our AI-powered engine matches skills to opportunities in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/jobs"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 text-lg font-bold text-center transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-500/30"
              >
                Browse Jobs
              </Link>
              {user && (user.role === 'recruiter' || user.role === 'admin') ? (
                <Link
                  to="/recruiter/dashboard"
                  className="bg-white text-secondary-600 border border-gray-200 px-8 py-4 rounded-xl hover:border-secondary-200 hover:bg-secondary-50 text-lg font-bold text-center transition-all duration-300 shadow-md"
                >
                  Post a Job
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-white text-secondary-600 border border-gray-200 px-8 py-4 rounded-xl hover:border-secondary-200 hover:bg-secondary-50 text-lg font-bold text-center transition-all duration-300 shadow-md"
                >
                  Post a Job
                </Link>
              )}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg animate-float">
              {/* Main Card */}
              <div className="glass rounded-2xl p-6 border border-white/40 shadow-2xl relative z-10 bg-white/80">
                <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl h-80 flex items-center justify-center relative overflow-hidden group border border-primary-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>

                  <div className="text-center space-y-4 p-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 bg-gray-200 rounded-full w-32 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-24 mx-auto"></div>
                    </div>
                    <div className="inline-block bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-semibold mt-4">
                      Match Found!
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 glass p-4 rounded-xl border border-white/50 shadow-lg animate-float bg-white/90" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Efficiency</div>
                    <div className="text-sm font-bold text-gray-900">+40%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 glass p-4 rounded-xl border border-white/50 shadow-lg animate-float bg-white/90" style={{ animationDelay: '2s' }}>
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-bold`}>
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-gray-900">500+ Hired</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Why Choose BluePrint?
            </h2>
            <p className="text-gray-600 text-lg">
              Simple, reliable, and effective hiring solutions for modern teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Job Matching",
                desc: "Our AI-powered system matches your skills and preferences with the perfect job opportunities.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                color: "primary" // Blue
              },
              {
                title: "Real-time Tracking",
                desc: "Track your application status in real-time and get instant updates on your job applications.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "secondary" // Orange
              },
              {
                title: "Top Companies",
                desc: "Connect with leading companies and discover exciting career opportunities across industries.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                color: "primary"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl hover:bg-white border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${feature.color}-600`}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
