import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogApi, categoryApi } from '../api/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader } from '../components/Loader';
import {
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('PUBLISHED');
  const [categories, setCategories] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, blogRes] = await Promise.all([
        categoryApi.getAll(),
        blogApi.getById(id),
      ]);

      setCategories(catRes.data);
      const b = blogRes.data;

      setTitle(b.title || '');
      setContent(b.content || '');
      setSummary(b.summary || '');
      setThumbnail(b.thumbnail || '');
      setStatus(b.status || 'PUBLISHED');
      if (b.category) {
        setCategoryId(b.category.id);
      } else if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0].id);
      }
      if (b.tags) {
        setTagsInput(b.tags.map((t) => t.name).join(', '));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (statusToSave) => {
    if (!title.trim()) {
      setError('Article title cannot be empty.');
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');

    const tagArray = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || undefined,
      thumbnail: thumbnail.trim() || undefined,
      categoryId: categoryId ? Number(categoryId) : null,
      tags: tagArray,
      status: statusToSave || status,
    };

    try {
      const res = await blogApi.update(id, payload);
      navigate(`/blog/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article');
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Loading editor..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-200 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="flex items-center space-x-3">
          <div className="flex bg-neutral-100 rounded-lg p-0.5 text-xs font-medium border border-neutral-200">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1 rounded-md transition-colors ${
                !previewMode ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1 rounded-md transition-colors ${
                previewMode ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('DRAFT')}
            className="px-3.5 py-1.5 rounded-full border border-neutral-300 text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('PUBLISHED')}
            className="px-4 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors disabled:opacity-40"
          >
            {saving ? 'Updating...' : 'Update Story'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Surface */}
      <div className="space-y-8">
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent font-serif text-3xl sm:text-5xl font-bold text-neutral-900 placeholder-neutral-300 focus:outline-none border-none p-0 leading-tight"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-neutral-100">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-800 focus:outline-none focus:border-neutral-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. springboot, react"
              className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
              Featured Image URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1.5">
            Short Excerpt
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A brief 1-2 sentence description..."
            className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400"
          />
        </div>

        <div className="pt-4 border-t border-neutral-100">
          {previewMode ? (
            <div className="editorial-prose min-h-[420px] p-4 bg-white border border-neutral-200 rounded-lg">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-neutral-400 italic">No content to preview.</p>
              )}
            </div>
          ) : (
            <textarea
              rows="18"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent text-neutral-900 placeholder-neutral-400 text-base leading-relaxed focus:outline-none border-none p-0 resize-y font-serif"
            />
          )}
        </div>
      </div>
    </div>
  );
};
