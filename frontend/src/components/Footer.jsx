import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="bg-gray-900 text-white mt-20">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
              <i className="fa-solid fa-house text-white text-xs"></i>
            </div>
            <span className="font-bold text-sm">Rent a House</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-0 max-w-[220px]">
            Find your perfect rental home. Browse thousands of properties worldwide.
          </p>
        </div>
        <div>
          <h6 className="font-bold text-xs text-white mb-4 tracking-wider">Quick Links</h6>
          <div className="flex flex-col gap-2.5">
            {[{ to: '/listing', label: 'Explore Listings' }, { to: '/user/signup', label: 'Sign Up' }, { to: '/user/login', label: 'Login' }].map(({ to, label }) => (
              <Link key={to} to={to} className="text-gray-400 text-xs no-underline transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h6 className="font-bold text-xs text-white mb-4 tracking-wider">Contact</h6>
          <div className="flex flex-col gap-2.5">
            {[{ icon: 'fa-solid fa-envelope', text: 'info@rentahouse.com' }, { icon: 'fa-solid fa-phone', text: '+91 987654321' }].map(({ icon, text }) => (
              <p key={text} className="text-gray-400 text-xs mb-0 flex items-center gap-2">
                <i className={icon} style={{ color: '#0891b2', fontSize: '11px', width: '14px' }}></i> {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-6 flex justify-between items-center flex-wrap gap-2">
        <p className="text-gray-500 text-xs mb-0">© 2024 Rent a House. All rights reserved.</p>
        <p className="text-gray-500 text-xs mb-0">Built with ❤️ for property seekers</p>
      </div>
    </div>
  </footer>
);