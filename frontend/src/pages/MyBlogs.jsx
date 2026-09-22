import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../api/axios';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { Pagination } from '../components/Pagination';
import {
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageSquare,
  PenSquare,
} from 'lucide-react';

export const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMyBlogs();
  }, [page, activeTab]);

  const fetchMyBlogs = async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (activeTab !== 'ALL') {
        params.status = activeTab;
      }
      const res = await blogApi.getMyBlogs(params);
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error('Failed to load my blogs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      await blogApi.delete(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
            Your Stories
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your published articles, edits, and drafts.
          </p>
        </div>

        <Link
          to="/create-blog"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors"
        >
          <PenSquare className="w-3.5 h-3.5" />
          Write Story
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-neutral-200 text-sm">
        {['ALL', 'PUBLISHED', 'DRAFT'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setPage(0);
            }}
            className={`pb-3 font-medium transition-colors border-b-2 -mb-px text-xs uppercase tracking-wider ${
              activeTab === tab
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            {tab === 'ALL' ? 'All Stories' : tab === 'PUBLISHED' ? 'Published' : 'Drafts'}
          </button>
        ))}
      </div>

      {/* Stories Table / List */}
      {loading ? (
        <Loader text="Loading your stories..." />
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No stories found"
          message="You have no articles under this tab."
        />
      ) : (
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Article</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Engagement</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {blogs.map((blog) => {
                const formattedDate = blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent';

                return (
                  <tr key={blog.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="font-medium text-neutral-900 hover:underline block text-sm"
                        >
                          {blog.title}
                        </Link>
                        {blog.category && (
                          <span className="text-[11px] text-neutral-500 font-normal">
                            {blog.category.name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          blog.status === 'PUBLISHED'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-neutral-400" />
                          {blog.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-neutral-400" />
                          {blog.commentsCount}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-neutral-500">
                      {formattedDate}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                          title="View article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-blog/${blog.id}`}
                          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                          title="Edit article"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="border-t border-neutral-200 p-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
