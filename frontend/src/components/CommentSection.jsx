import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentApi } from '../api/axios';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getByBlog(blogId);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await commentApi.add(blogId, { content: content.trim() });
      setComments([res.data, ...comments]);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await commentApi.delete(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
          Responses ({comments.length})
        </h3>
      </div>

      {/* Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="border border-neutral-200 rounded-lg p-4 bg-white focus-within:border-neutral-400 transition-colors shadow-sm">
            <div className="flex items-center space-x-2.5 mb-3">
              <img
                src={
                  user?.profileImage ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                }
                alt={user?.name}
                className="w-6 h-6 rounded-full object-cover border border-neutral-200"
              />
              <span className="text-xs font-medium text-neutral-800">{user?.name}</span>
            </div>

            <textarea
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-transparent text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none text-sm leading-relaxed"
              disabled={submitting}
            />

            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

            <div className="flex justify-end pt-3 border-t border-neutral-100 mt-2">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Publishing...' : 'Respond'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-6 border border-neutral-200 rounded-lg text-center mb-10 bg-neutral-50">
          <p className="text-sm text-neutral-600 mb-3">
            Join the conversation and share your feedback.
          </p>
          <div className="flex justify-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors"
            >
              Sign In to Respond
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="divide-y divide-neutral-200/80">
        {loading ? (
          <p className="text-xs text-neutral-500 py-4">Loading responses...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-neutral-500 py-8 text-center">
            There are currently no responses for this article. Be the first to start the discussion.
          </p>
        ) : (
          comments.map((comment) => {
            const canDelete = isAdmin || user?.id === comment.user?.id;
            const commentDate = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div key={comment.id} className="py-6 first:pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={
                        comment.user?.profileImage ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
                      }
                      alt={comment.user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-neutral-900">
                          {comment.user?.name}
                        </span>
                        {comment.user?.role === 'ROLE_ADMIN' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-500">{commentDate}</span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete response"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-neutral-800 leading-relaxed pl-9 whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
