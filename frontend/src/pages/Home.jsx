import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { blogApi, categoryApi } from '../api/axios';
import { BlogCard } from '../components/BlogCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { Pagination } from '../components/Pagination';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { Search, ArrowRight, TrendingUp } from 'lucide-react';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error loading categories:', err));
  }, []);

  // Sync category or explore from URL if provided
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(Number(cat));
    }
  }, [searchParams]);

  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, [page, selectedCategory, activeKeyword]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 8,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }
      if (activeKeyword) {
        params.keyword = activeKeyword;
      }

      const res = await blogApi.getAll(params);
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveKeyword(searchQuery.trim());
  };

  const handleCategorySelect = (id) => {
    setPage(0);
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setActiveKeyword('');
    setPage(0);
  };

  const featuredBlog = blogs.length > 0 && !activeKeyword && !selectedCategory && page === 0 ? blogs[0] : null;
  const feedBlogs = featuredBlog ? blogs.slice(1) : blogs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Editorial Masthead / Header */}
      <header className="border-b border-neutral-200 pb-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
              A publication for engineering, systems architecture & craftsmanship.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
              Curated articles on Spring Boot 3, PostgreSQL modeling, distributed systems, and modern React interface design.
            </p>
          </div>

          {/* Minimal Search Input */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-full text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
              />
            </div>
          </form>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-6 scrollbar-none">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
              selectedCategory === null && !activeKeyword
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/60'
            }`}
          >
            All Stories
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="shrink-0">
              <CategoryBadge
                name={cat.name}
                active={selectedCategory === cat.id}
                onClick={() => handleCategorySelect(cat.id)}
              />
            </div>
          ))}

          {(selectedCategory !== null || activeKeyword) && (
            <button
              onClick={clearFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 ml-2 shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      {/* Editorial Featured Article (Medium-style split preview) */}
      {featuredBlog && (
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold mb-4">
            Featured Story
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image */}
            <div className="lg:col-span-7">
              <Link to={`/blog/${featuredBlog.slug}`} className="block overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 group">
                <img
                  src={featuredBlog.thumbnail}
                  alt={featuredBlog.title}
                  className="w-full aspect-[16/9] object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
              </Link>
            </div>

            {/* Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center space-x-2 text-xs text-neutral-600">
                <img
                  src={featuredBlog.author?.profileImage}
                  alt={featuredBlog.author?.name}
                  className="w-6 h-6 rounded-full object-cover border border-neutral-200"
                />
                <span className="font-medium text-neutral-900">{featuredBlog.author?.name}</span>
                <span>·</span>
                <span>
                  {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {featuredBlog.category && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-neutral-600">{featuredBlog.category.name}</span>
                  </>
                )}
              </div>

              <Link to={`/blog/${featuredBlog.slug}`} className="block group">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 group-hover:text-neutral-700 leading-snug tracking-tight">
                  {featuredBlog.title}
                </h2>
              </Link>

              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {featuredBlog.summary}
              </p>

              <div className="pt-2">
                <Link
                  to={`/blog/${featuredBlog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:gap-2 transition-all"
                >
                  Read full story <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main 2-Column Content: Left Feed (68%), Right Sidebar (32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Latest Articles */}
        <main className="lg:col-span-8">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <h2 className="text-sm uppercase tracking-wider font-semibold text-neutral-900">
              {activeKeyword
                ? `Search: "${activeKeyword}" (${totalElements})`
                : selectedCategory
                ? `Category: ${categories.find((c) => c.id === selectedCategory)?.name || ''}`
                : 'Latest Stories'}
            </h2>
            <span className="text-xs text-neutral-500">Page {page + 1} of {Math.max(totalPages, 1)}</span>
          </div>

          {loading ? (
            <Loader text="Loading stories..." />
          ) : feedBlogs.length === 0 ? (
            <EmptyState
              title="No stories found"
              message="No articles match your selected topic or query."
            />
          ) : (
            <div className="divide-y divide-neutral-200">
              {feedBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </main>

        {/* Right Column: Editorial Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          {/* Trending Stories */}
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <div className="flex items-center space-x-2 text-neutral-900 font-semibold text-sm mb-4">
              <TrendingUp className="w-4 h-4 text-neutral-800" />
              <span>Trending on BlogSpace</span>
            </div>

            <div className="space-y-5">
              {blogs.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <span className="font-serif text-2xl font-bold text-neutral-300 leading-none">
                    0{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500">
                      <span className="font-medium text-neutral-800">{item.author?.name}</span>
                      <span>·</span>
                      <span>{item.category?.name}</span>
                    </div>
                    <Link
                      to={`/blog/${item.slug}`}
                      className="font-serif text-sm font-bold text-neutral-900 hover:text-neutral-700 leading-snug line-clamp-2 block"
                    >
                      {item.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Topics */}
          <div className="border border-neutral-200 rounded-lg p-6 bg-white">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-900 mb-3">
              Recommended Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.id)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Editorial Masthead note */}
          <div className="p-6 bg-neutral-100 rounded-lg border border-neutral-200 text-xs text-neutral-600 space-y-2">
            <p className="font-semibold text-neutral-900">Writing for BlogSpace</p>
            <p className="leading-relaxed">
              Have an engineering architecture insight or full stack tutorial? Join our community of developers and share your knowledge.
            </p>
            <Link
              to="/create-blog"
              className="inline-block pt-1 font-medium text-neutral-900 underline underline-offset-2"
            >
              Start writing →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};
