import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { blogApi, categoryApi, tagApi } from '../api/axios';
import { BlogCard } from '../components/BlogCard';
import { CategoryBadge } from '../components/CategoryBadge';
import { Pagination } from '../components/Pagination';
import { Loader } from '../components/Loader';
import { EmptyState } from '../components/EmptyState';
import { Search, Compass, Tag as TagIcon, Layers } from 'lucide-react';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load categories and tags
  useEffect(() => {
    Promise.all([categoryApi.getAll(), tagApi.getAll()])
      .then(([catRes, tagRes]) => {
        setCategories(catRes.data);
        setTags(tagRes.data);
      })
      .catch((err) => console.error('Error loading explore metadata:', err));
  }, []);

  // Sync category param from URL if present
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(Number(cat));
    }
  }, [searchParams]);

  // Fetch blogs when filters change
  useEffect(() => {
    fetchFilteredBlogs();
  }, [page, selectedCategory, selectedTag, activeKeyword]);

  const fetchFilteredBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 8,
        sortBy: 'createdAt',
        sortDir: 'desc',
      };

      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedTag) params.tag = selectedTag;
      if (activeKeyword) params.keyword = activeKeyword;

      const res = await blogApi.getAll(params);
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error('Error fetching explore stories:', err);
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
    setSelectedTag('');
    if (selectedCategory === id) {
      setSelectedCategory(null);
      setSearchParams({});
    } else {
      setSelectedCategory(id);
      setSearchParams({ category: id });
    }
  };

  const handleTagSelect = (tagName) => {
    setPage(0);
    if (selectedTag === tagName) {
      setSelectedTag('');
    } else {
      setSelectedTag(tagName);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTag('');
    setSearchQuery('');
    setActiveKeyword('');
    setPage(0);
    setSearchParams({});
  };

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <header className="border-b border-neutral-200 pb-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              <Compass className="w-4 h-4 text-neutral-800" />
              <span>Topic Directory</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              Explore Topics & Insights
            </h1>
            <p className="mt-2 text-sm text-neutral-600 max-w-xl font-normal">
              Browse stories across specific technology stacks, architectural paradigms, and engineering best practices.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="w-full md:w-80 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all topics..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-full text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors shadow-sm"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Category Overview Cards (Top Editorial Grid) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neutral-700" />
            <span>Select a Category</span>
          </h2>
          {(selectedCategory || selectedTag || activeKeyword) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2"
            >
              Reset all filters ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-900 hover:bg-neutral-50/50'
                }`}
              >
                <h3 className={`font-semibold text-sm ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                  {cat.name}
                </h3>
                <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {cat.description || 'Articles on ' + cat.name}
                </p>
                <span className={`inline-block mt-3 text-[11px] font-medium ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                  {cat.blogCount || 0} stories
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Popular Tags */}
      {tags.length > 0 && (
        <section className="py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none border-b border-neutral-200/80 pb-4">
          <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1 shrink-0 mr-1">
            <TagIcon className="w-3 h-3" /> Tags:
          </span>
          {tags.map((t) => {
            const isTagActive = selectedTag === t.name;
            return (
              <button
                key={t.id}
                onClick={() => handleTagSelect(t.name)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 ${
                  isTagActive
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/60'
                }`}
              >
                #{t.name}
              </button>
            );
          })}
        </section>
      )}

      {/* Stories Results Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-900">
              {activeKeyword
                ? `Results for "${activeKeyword}"`
                : activeCategoryObj
                ? `Stories in ${activeCategoryObj.name}`
                : selectedTag
                ? `Stories tagged #${selectedTag}`
                : 'All Explore Stories'}
            </h2>
            {activeCategoryObj && (
              <p className="text-xs text-neutral-500 mt-0.5">{activeCategoryObj.description}</p>
            )}
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            {totalElements} {totalElements === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {loading ? (
          <Loader text="Loading explore stories..." />
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No matching stories found"
            message="No articles were found matching your criteria. Try picking another topic or clearing search."
          />
        ) : (
          <div className="divide-y divide-neutral-200">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
};
