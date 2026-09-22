import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';

export const BlogCard = ({ blog }) => {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <article className="py-6 border-b border-neutral-200/80 last:border-b-0 group">
      <div className="flex flex-col-reverse sm:flex-row items-start justify-between gap-6">
        {/* Text Content */}
        <div className="flex-1 space-y-2.5">
          {/* Author info & publication date */}
          <div className="flex items-center space-x-2 text-xs text-neutral-600">
            <img
              src={
                blog.author?.profileImage ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
              }
              alt={blog.author?.name}
              className="w-5 h-5 rounded-full object-cover border border-neutral-200"
            />
            <span className="font-medium text-neutral-800">{blog.author?.name}</span>
            <span>·</span>
            <span>{formattedDate}</span>
            {blog.category && (
              <>
                <span>·</span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium text-[11px]">
                  {blog.category.name}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <Link to={`/blog/${blog.slug}`} className="block">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug tracking-tight transition-colors">
              {blog.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed font-normal">
            {blog.summary || blog.content?.substring(0, 160) + '...'}
          </p>

          {/* Metadata footer */}
          <div className="flex items-center space-x-4 pt-2 text-xs text-neutral-500">
            <span>5 min read</span>
            <span>·</span>
            <span className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
              <Heart className={`w-3.5 h-3.5 ${blog.likedByCurrentUser ? 'text-red-600 fill-red-600' : ''}`} />
              {blog.likesCount}
            </span>
            <span className="flex items-center gap-1 hover:text-neutral-900 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              {blog.commentsCount}
            </span>
          </div>
        </div>

        {/* Thumbnail on the right */}
        {blog.thumbnail && (
          <Link
            to={`/blog/${blog.slug}`}
            className="w-full sm:w-44 sm:h-28 aspect-[16/9] sm:aspect-auto rounded-lg overflow-hidden shrink-0 border border-neutral-200/80 block bg-neutral-100"
          >
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
              loading="lazy"
            />
          </Link>
        )}
      </div>
    </article>
  );
};
