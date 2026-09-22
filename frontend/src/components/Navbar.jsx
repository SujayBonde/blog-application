import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenSquare,
  Search,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Masthead */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-baseline space-x-1.5 group">
              <span className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
                BlogSpace
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block mb-1"></span>
            </Link>

            {/* Desktop Navigation Links (Center-Left) */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/"
                className={`transition-colors py-1 ${
                  isActive('/')
                    ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`transition-colors py-1 ${
                  isActive('/explore')
                    ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Explore
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-blogs"
                  className={`transition-colors py-1 ${
                    isActive('/my-blogs')
                      ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  My Articles
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`transition-colors py-1 flex items-center gap-1 ${
                    isActive('/admin')
                      ? 'text-neutral-900 font-semibold border-b-2 border-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-neutral-500" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right Section: Write CTA, Search trigger & User Profile */}
          <div className="hidden md:flex items-center space-x-5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/create-blog"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <PenSquare className="w-4 h-4 text-neutral-500" />
                  <span>Write</span>
                </Link>

                <div className="h-4 w-px bg-neutral-200"></div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-neutral-100 transition-colors text-left"
                  >
                    <img
                      src={
                        user?.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                    />
                    <span className="text-sm font-medium text-neutral-800">
                      {user?.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1.5 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-xs text-neutral-500">Signed in as</p>
                        <p className="font-medium text-neutral-900 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                          {user?.role?.replace('ROLE_', '')}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <User className="w-4 h-4 text-neutral-400" />
                        Profile Settings
                      </Link>

                      <Link
                        to="/my-blogs"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <BookOpen className="w-4 h-4 text-neutral-400" />
                        Stories & Drafts
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <Shield className="w-4 h-4 text-neutral-400" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-neutral-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-neutral-600 hover:bg-neutral-50 hover:text-red-600 text-left"
                      >
                        <LogOut className="w-4 h-4 text-neutral-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded-full transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-800 hover:bg-neutral-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMenuOpen(false)}
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/explore') ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-800 hover:bg-neutral-50'
            }`}
          >
            Explore
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-blog"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-50"
              >
                ✍️ Write Story
              </Link>
              <Link
                to="/my-blogs"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-50"
              >
                My Articles
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Profile ({user?.name})
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Admin Console
                </Link>
              )}
              <div className="border-t border-neutral-100 pt-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-neutral-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg border border-neutral-300 text-neutral-800 font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium text-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
