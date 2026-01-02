import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 tracking-tight animate-fade-in text-white">
            Find Your Dream Job <br />
            <span className="text-gradient">in the AI Era</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Connect with top employers and discover opportunities that match your skills.
            The next generation recruitment platform is here.
          </p>
          <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/jobs"
              className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="glass hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            }
            title="Smart Matching"
            description="Our AI-powered algorithm matches your profile with the perfect job opportunities instantly."
            delay="0.2s"
          />
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            }
            title="Verified Recruiters"
            description="Connect with verified recruiters from top companies worldwide. No spam, just opportunities."
            delay="0.4s"
          />
          <FeatureCard
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            }
            title="Career Growth"
            description="Get insights and analytics to improve your profile and increase your hiring chances."
            delay="0.6s"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="10k+" label="Active Jobs" />
            <StatItem number="500+" label="Companies" />
            <StatItem number="50k+" label="Job Seekers" />
            <StatItem number="98%" label="Satisfaction" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <div className="glass-card p-8 hover:bg-slate-800/80 group animate-slide-up" style={{ animationDelay: delay }}>
    <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-primary-400">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </div>
    <h3 className="text-xl font-bold font-heading text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

const StatItem = ({ number, label }) => (
  <div>
    <div className="text-3xl font-bold text-white mb-1">{number}</div>
    <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{label}</div>
  </div>
);

export default Home;
