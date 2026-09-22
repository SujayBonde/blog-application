import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogApi, likeApi } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge } from '../components/CategoryBadge';
import { CommentSection } from '../components/CommentSection';
import { Loader } from '../components/Loader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Heart,
  Calendar,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  Share2,
  Check,
  Bookmark,
  MessageSquare,
} from 'lucide-react';

export const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await blogApi.getBySlug(slug);
      setBlog(res.data);
      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.likedByCurrentUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Story not found');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (likeLoading) return;

    setLikeLoading(true);
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);

    try {
      const res = await likeApi.toggle(blog.id);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article? This action cannot be undone.')) {
      return;
    }
    try {
      await blogApi.delete(blog.id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete story');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return <Loader text="Loading article..." />;
  }

  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-2">Article Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">{error || 'The article you are looking for does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === blog.author?.id;
  const canModify = isAuthor || isAdmin;
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="max-w-prose-article mx-auto px-4 sm:px-6 py-10">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200 text-xs text-neutral-500 mb-8">
        <Link to="/" className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> All Stories
        </Link>

        {canModify && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/edit-blog/${blog.id}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <Edit3 className="w-3 h-3" /> Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Article Header */}
      <header className="space-y-6 mb-8">
        {blog.category && (
          <div className="flex items-center space-x-2">
            <CategoryBadge name={blog.category.name} />
          </div>
        )}

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.15]">
          {blog.title}
        </h1>

        {blog.summary && (
          <p className="text-lg text-neutral-600 font-normal leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Author Line */}
        <div className="flex items-center justify-between pt-4 border-t border-b border-neutral-200/80 py-4">
          <div className="flex items-center space-x-3">
            <img
              src={
                blog.author?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
              }
              alt={blog.author?.name}
              className="w-11 h-11 rounded-full object-cover border border-neutral-200"
            />
            <div>
              <p className="text-sm font-semibold text-neutral-900">{blog.author?.name}</p>
              <div className="flex items-center space-x-2 text-xs text-neutral-500">
                <span>{formattedDate}</span>
                <span>·</span>
                <span>5 min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
              title="Share article"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Thumbnail */}
      {blog.thumbnail && (
        <div className="mb-10">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full rounded-lg object-cover max-h-[440px] border border-neutral-200"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="editorial-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </article>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-wrap items-center gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-xs px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/80 font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Minimal Action Toolbar (Like, Comments, Share) */}
      <div className="mt-8 py-3 border-y border-neutral-200 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={`inline-flex items-center gap-2 text-sm transition-colors ${
              isLiked ? 'text-red-600 font-medium' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <span className="inline-flex items-center gap-2 text-sm text-neutral-600">
            <MessageSquare className="w-4 h-4" />
            <span>{blog.commentsCount}</span>
          </span>
        </div>

        <button
          onClick={handleShare}
          className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link copied' : 'Share'}</span>
        </button>
      </div>

      {/* Author Bio Box */}
      {blog.author && (
        <div className="mt-12 p-6 bg-white rounded-lg border border-neutral-200 flex items-start space-x-4">
          <img
            src={
              blog.author.profileImage ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
            }
            alt={blog.author.name}
            className="w-14 h-14 rounded-full object-cover border border-neutral-200 shrink-0"
          />
          <div className="space-y-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Written by</p>
            <h4 className="text-base font-bold text-neutral-900">{blog.author.name}</h4>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              {blog.author.bio || 'Full stack engineer writing about Spring Boot, React, and distributed systems architecture.'}
            </p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <CommentSection blogId={blog.id} />
    </div>
  );
};
