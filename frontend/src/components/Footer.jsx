import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-900 border-t border-white/10 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.png"
                alt="Blueprint Logo"
                className="w-10 h-10 object-contain rounded-md"
              />
              <span className="text-2xl font-display font-bold text-white tracking-tight">
                Blueprint
              </span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-xs">
              Empowering the next generation of talent acquisition with smart matching and streamlined tracking.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 text-white">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/jobs" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">
                  AI Match
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-display font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-200 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-primary-300 text-sm">
            © 2025 Blueprint Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;





