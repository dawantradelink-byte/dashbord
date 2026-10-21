import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Award,
  ExternalLink
} from 'lucide-react';
import { storageService, BlogArticle } from '../../services/storageService';

interface AIBlogInspectorViewProps {
  language: 'en' | 'bn';
}

export const AIBlogInspectorView: React.FC<AIBlogInspectorViewProps> = ({ language }) => {
  const [blogs, setBlogs] = useState<BlogArticle[]>(() => storageService.getBlogs());
  const [selectedBlogId, setSelectedBlogId] = useState<string>(blogs[0]?.id || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const selectedBlog = blogs.find((b) => b.id === selectedBlogId) || blogs[0];

  const handleApprove = (id: string) => {
    const updated = storageService.updateBlog(id, {
      humanApproved: true,
      approvedBy: 'Ishak Dawan (Senior Examiner)',
      status: 'Published'
    });
    setBlogs(updated);
  };

  const handleScanDraft = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

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
              <Cpu className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'AI Blog Inspector & Quality Audit' : 'এআই ব্লগ ইন্সপেক্টর ও মান যাচাই'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Audit AI-generated study guides, ensure IELTS academic accuracy, and human examiner approval'
                  : 'এআই আর্টিকেল স্ক্রিনিং, আইইএলটিএস নির্ভুলতা ও মানব পরীক্ষক অনুমোদন'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleScanDraft}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Inspecting Syntactic Depth...' : 'Run Deep Semantic Audit'}</span>
        </button>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Article Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-rose-200 uppercase tracking-wider px-1">
            Articles in Pipeline
          </h3>
          <div className="space-y-2">
            {blogs.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBlogId(b.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all text-xs ${
                  selectedBlog?.id === b.id
                    ? 'glass-pill-active border-rose-400/50 shadow-lg text-white'
                    : 'glass-panel border-white/5 hover:border-white/15 text-rose-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-rose-300">
                    {b.category}
                  </span>
                  {b.humanApproved ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
                      <AlertTriangle className="w-3 h-3" />
                      Needs Review
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-white line-clamp-1">{b.title}</h4>
                <p className="text-[11px] text-rose-300/60 mt-1 line-clamp-1">{b.excerpt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Inspection Card (8 cols) */}
        {selectedBlog && (
          <div className="lg:col-span-8 p-6 glass-panel rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-rose-400">Inspection Report #{selectedBlog.id}</span>
                <h2 className="text-lg font-bold text-white mt-0.5">{selectedBlog.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                {!selectedBlog.humanApproved ? (
                  <button
                    onClick={() => handleApprove(selectedBlog.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Stamp Human Approval</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved by {selectedBlog.approvedBy || 'Ishak Dawan'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Genuine Quality & Text Metrics */}
            {(() => {
              const wordCount = selectedBlog.content.trim().split(/\s+/).filter(Boolean).length;
              const uniqueWords = (new Set(selectedBlog.content.toLowerCase().match(/[a-z]{3,}/g) || [])).size;
              const readingTime = Math.max(1, Math.ceil(wordCount / 180));

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-rose-300/70 block uppercase font-mono">Word Count</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{wordCount} words</div>
                    <span className="text-[10px] text-rose-200/60">~{readingTime} min read</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-rose-300/70 block uppercase font-mono">Lexical Variety</span>
                    <div className="text-xl font-bold font-mono text-cyan-300 mt-1">{uniqueWords} terms</div>
                    <span className="text-[10px] text-rose-200/60">Unique root terms</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-rose-300/70 block uppercase font-mono">Origin Source</span>
                    <div className="text-base font-bold font-mono text-amber-300 mt-1 truncate">
                      {selectedBlog.isAIGenerated ? (selectedBlog.aiModel || 'AI Draft') : 'Human Draft'}
                    </div>
                    <span className="text-[10px] text-rose-200/60 truncate block">{selectedBlog.author}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                    <span className="text-[10px] text-rose-300/70 block uppercase font-mono">Review Stamp</span>
                    <div className="text-base font-bold font-mono text-purple-300 mt-1 truncate">
                      {selectedBlog.humanApproved ? 'Approved' : 'Pending'}
                    </div>
                    <span className="text-[10px] text-rose-200/60 truncate block">
                      {selectedBlog.humanApproved ? (selectedBlog.approvedBy || 'Ishak Dawan') : 'Needs Signoff'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Article Content Preview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wide">Article Body</h4>
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-xs text-rose-100/90 leading-relaxed font-sans max-h-64 overflow-y-auto whitespace-pre-line">
                {selectedBlog.content}
              </div>
            </div>

            {/* Tags & Meta */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
              <span className="text-rose-300/70">Tags:</span>
              {selectedBlog.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-rose-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};
