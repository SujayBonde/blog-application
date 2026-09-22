import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-neutral-100">
          <div className="space-y-2">
            <Link to="/" className="flex items-baseline space-x-1.5">
              <span className="font-serif text-xl font-bold text-neutral-900 tracking-tight">
                BlogSpace
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block"></span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-md">
              An open publication dedicated to software architecture, Spring Boot 3, modern frontend systems, and developer craftsmanship.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-neutral-600">
            <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-neutral-900 transition-colors">Explore</Link>
            <Link to="/login" className="hover:text-neutral-900 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-neutral-900 transition-colors">Register</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} BlogSpace. Built with Spring Boot 3, PostgreSQL, and React.</p>
          <div className="flex items-center space-x-4">
            <span>This is made with ❤️ by Sujay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
