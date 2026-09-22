import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/axios';
import {
  User,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('INFO');

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await userApi.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        profileImage: profileImage.trim(),
      });
      updateUser(res.data);
      setProfileSuccess('Profile details saved successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters');
      return;
    }

    setPassSaving(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      setPassSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Author Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-neutral-200">
        <img
          src={
            user?.profileImage ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          }
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover border border-neutral-200 shrink-0"
        />

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-neutral-900">{user?.name}</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
              {user?.role?.replace('ROLE_', '')}
            </span>
          </div>

          <p className="text-sm text-neutral-500 font-normal">{user?.email}</p>
          <p className="text-xs text-neutral-400 flex items-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5" /> Member since {formattedDate}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-neutral-200 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab('INFO')}
          className={`pb-3 transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'INFO'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile Information
        </button>

        <button
          onClick={() => setActiveTab('PASSWORD')}
          className={`pb-3 transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'PASSWORD'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" /> Security & Password
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'INFO' && (
        <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-6">
          {profileSuccess && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              Bio
            </label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Short description about your engineering interests..."
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40"
          >
            {profileSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Password Form */}
      {activeTab === 'PASSWORD' && (
        <form onSubmit={handleChangePassword} className="max-w-xl space-y-6">
          {passSuccess && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          {passError && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              New Password (Min 6 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <button
            type="submit"
            disabled={passSaving}
            className="px-5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40"
          >
            {passSaving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};
