import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm">
          {/* Masthead Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block font-serif text-2xl font-bold text-neutral-900 tracking-tight">
              BlogSpace
            </Link>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight mt-3">Welcome Back</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in to write, like, and comment on stories.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            No account yet?{' '}
            <Link to="/register" className="font-medium text-neutral-900 underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
