import React, { useState, useEffect } from 'react';
import { adminApi, categoryApi, blogApi } from '../api/axios';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import {
  Trash2,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Users tab
  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(0);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);

  // Categories tab
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catMsg, setCatMsg] = useState('');

  // Blogs moderation tab
  const [blogs, setBlogs] = useState([]);
  const [blogsPage, setBlogsPage] = useState(0);
  const [blogsTotalPages, setBlogsTotalPages] = useState(0);
  const [blogsLoading, setBlogsLoading] = useState(true);

  const [activeSection, setActiveSection] = useState('CATEGORIES'); // CATEGORIES, USERS, BLOGS

  useEffect(() => {
    loadStats();
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeSection === 'USERS') loadUsers();
    if (activeSection === 'BLOGS') loadBlogs();
  }, [activeSection, usersPage, blogsPage]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await adminApi.getUsers({ page: usersPage, size: 10 });
      setUsers(res.data.content || []);
      setUsersTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadBlogs = async () => {
    setBlogsLoading(true);
    try {
      const res = await blogApi.getAll({ page: blogsPage, size: 10, sortBy: 'createdAt', sortDir: 'desc' });
      setBlogs(res.data.content || []);
      setBlogsTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load blogs', err);
    } finally {
      setBlogsLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatLoading(true);
    setCatMsg('');

    try {
      await categoryApi.create({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
      });
      setNewCatName('');
      setNewCatDesc('');
      setCatMsg('Category created successfully.');
      loadCategories();
      loadStats();
    } catch (err) {
      setCatMsg(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await categoryApi.delete(id);
      loadCategories();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user? All their authored articles and comments will be permanently removed.')) return;
    try {
      await adminApi.deleteUser(id);
      loadUsers();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await adminApi.deleteBlog(id);
      loadBlogs();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
          Admin Console
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          System metrics, category controls, and content moderation.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Users</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.totalUsers}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Stories</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.totalBlogs}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Published</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.publishedBlogs}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Drafts</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.draftBlogs}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Comments</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.totalComments}</p>
        </div>

        <div className="p-4 rounded-lg border border-neutral-200 bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">Likes</span>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{statsLoading ? '-' : stats?.totalLikes}</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-6 border-b border-neutral-200 text-xs uppercase tracking-wider font-semibold">
        {[
          { id: 'CATEGORIES', label: 'Categories' },
          { id: 'USERS', label: 'User Directory' },
          { id: 'BLOGS', label: 'Article Moderation' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`pb-3 transition-colors border-b-2 -mb-px ${
              activeSection === sec.id
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* CATEGORIES SECTION */}
      {activeSection === 'CATEGORIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Category Form */}
          <div className="lg:col-span-4 p-6 rounded-lg border border-neutral-200 bg-white space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add New Category
            </h3>

            {catMsg && (
              <p className="text-xs p-2.5 rounded bg-neutral-50 border border-neutral-200 text-neutral-700">
                {catMsg}
              </p>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Microservices, Cloud"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 focus:outline-none focus:border-neutral-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={catLoading}
                className="w-full py-2 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40"
              >
                {catLoading ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-8 border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
              <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Categories ({categories.length})
              </h3>
            </div>

            <div className="divide-y divide-neutral-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">{cat.name}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{cat.description || 'No description'}</p>
                    <span className="inline-block text-[11px] text-neutral-400 mt-1">
                      {cat.blogCount || 0} stories
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* USERS SECTION */}
      {activeSection === 'USERS' && (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              User Directory
            </h3>
          </div>

          {usersLoading ? (
            <Loader text="Loading directory..." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">User</th>
                    <th className="px-6 py-3.5">Email</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Joined</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="px-6 py-3.5 flex items-center space-x-2.5">
                        <img
                          src={
                            u.profileImage ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                        />
                        <span className="font-medium text-neutral-900">{u.name}</span>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-500">{u.email}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            u.role === 'ROLE_ADMIN'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {u.role?.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-neutral-200 p-2">
                <Pagination
                  currentPage={usersPage}
                  totalPages={usersTotalPages}
                  onPageChange={(p) => setUsersPage(p)}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* BLOGS MODERATION SECTION */}
      {activeSection === 'BLOGS' && (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
            <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              Moderate Stories
            </h3>
          </div>

          {blogsLoading ? (
            <Loader text="Loading stories..." />
          ) : (
            <div className="divide-y divide-neutral-100">
              {blogs.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 text-[11px] text-neutral-500">
                      <span className="font-semibold uppercase tracking-wider text-neutral-700">{b.status}</span>
                      <span>·</span>
                      <span>By {b.author?.name}</span>
                    </div>
                    <Link
                      to={`/blog/${b.slug}`}
                      className="font-medium text-sm text-neutral-900 hover:underline mt-0.5 block"
                    >
                      {b.title}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/blog/${b.slug}`}
                      className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                      title="View story"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(b.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-neutral-200 p-2">
                <Pagination
                  currentPage={blogsPage}
                  totalPages={blogsTotalPages}
                  onPageChange={(p) => setBlogsPage(p)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
