import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        bio: bio.trim(),
        profileImage: profileImage.trim() || undefined,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block font-serif text-2xl font-bold text-neutral-900 tracking-tight">
              BlogSpace
            </Link>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight mt-3">
              Create Your Account
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Join our community of developers and writers.
            </p>
          </div>

          {/* Error */}
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
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sujay Shinde"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sujay@example.com"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Avatar Image URL (Optional)
              </label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Bio (Optional)
              </label>
              <textarea
                rows="2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Software engineer interested in distributed systems..."
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-neutral-900 underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
