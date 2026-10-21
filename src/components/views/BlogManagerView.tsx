import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Globe, 
  CheckCircle2, 
  Calendar,
  Tag,
  Share2
} from 'lucide-react';
import { storageService, BlogArticle } from '../../services/storageService';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

interface BlogManagerViewProps {
  language: 'en' | 'bn';
}

export const BlogManagerView: React.FC<BlogManagerViewProps> = ({ language }) => {
  const [blogs, setBlogs] = useState<BlogArticle[]>(() => storageService.getBlogs());
  const [search, setSearch] = useState('');
  const [blogToDelete, setBlogToDelete] = useState<BlogArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<BlogArticle['category']>('IELTS Preparation');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('IELTS, Band 8, Academic');

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBlog: BlogArticle = {
      id: `b_${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: newCategory,
      excerpt: newExcerpt,
      content: newContent,
      author: 'Ishak Dawan',
      status: 'Published',
      isAIGenerated: false,
      humanApproved: true,
      approvedBy: 'Ishak Dawan',
      createdAt: new Date().toLocaleDateString('en-GB'),
      updatedAt: new Date().toLocaleDateString('en-GB'),
      publishedAt: new Date().toLocaleDateString('en-GB'),
      tags: newTags.split(',').map((t) => t.trim()),
      views: 0
    };

    const updated = storageService.addBlog(newBlog);
    setBlogs(updated);
    setIsCreating(false);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      const updated = storageService.deleteBlog(blogToDelete.id);
      setBlogs(updated);
      setBlogToDelete(null);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: BlogArticle['status']) => {
    const nextStatus = currentStatus === 'Published' ? 'Draft' : 'Published';
    const updated = storageService.updateBlog(id, { status: nextStatus });
    setBlogs(updated);
  };

  const filtered = blogs.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <BookOpen className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Blog & Editorial CMS' : 'ব্লগ ও আর্টিকেল ব্যবস্থাপনা'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Publish study abroad advice, IELTS strategy guides, and immigration news'
                  : 'বিদেশে উচ্চশিক্ষা, আইইএলটিএস টিপস ও ভিসা গাইডলাইন প্রকাশনা'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Editor' : 'Write New Article'}</span>
        </button>
      </div>

      {/* Create New Post Form */}
      {isCreating && (
        <form onSubmit={handleCreateBlog} className="p-6 glass-panel rounded-3xl border border-rose-500/40 space-y-4 text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-white text-sm">Draft New Publication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-rose-200 block mb-1">Article Headline</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white text-sm"
                placeholder="e.g. 5 Common Mistakes in IELTS Speaking Part 3"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white bg-rose-950"
              >
                <option value="IELTS Preparation">IELTS Preparation</option>
                <option value="Student Visa">Student Visa</option>
                <option value="Scholarships">Scholarships</option>
                <option value="Immigration">Immigration</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-rose-200 block mb-1">Short Excerpt (SEO Summary)</label>
            <input
              type="text"
              required
              value={newExcerpt}
              onChange={(e) => setNewExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
              placeholder="A concise synopsis displayed on search results and cards..."
            />
          </div>

          <div>
            <label className="text-rose-200 block mb-1">Full Article Body</label>
            <textarea
              rows={6}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-white leading-relaxed resize-y"
              placeholder="Write the full comprehensive guide here..."
            />
          </div>

          <div>
            <label className="text-rose-200 block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-rose-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow-lg shadow-rose-900/40"
            >
              Publish to Website
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300/60" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-white placeholder-rose-200/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-rose-300/70">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="IELTS Preparation">IELTS Preparation</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Scholarships">Scholarships</option>
            <option value="Immigration">Immigration</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((blog) => (
          <div
            key={blog.id}
            className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px]">
                  {blog.category}
                </span>
                <button
                  onClick={() => handleStatusToggle(blog.id, blog.status)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                    blog.status === 'Published'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {blog.status}
                </button>
              </div>

              <h3 className="font-bold text-white text-base mt-2 line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="text-xs text-rose-200/70 mt-2 line-clamp-3 leading-relaxed">
                {blog.excerpt}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {blog.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono text-rose-300/60 bg-white/5 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-rose-300/60 font-mono">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>{blog.views} views</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px]">{blog.updatedAt}</span>
                <button
                  onClick={() => setBlogToDelete(blog)}
                  className="p-1 rounded text-rose-400 hover:text-white transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!blogToDelete}
        title="Delete Blog Article Permanently?"
        message="This will delete the article from the portal and unpublish it from the Next Border student portal."
        itemName={blogToDelete ? blogToDelete.title : undefined}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBlogToDelete(null)}
      />
    </motion.div>
  );
};
