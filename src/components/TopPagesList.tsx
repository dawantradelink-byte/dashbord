import React from 'react';
import { Flame, BookOpen, ExternalLink } from 'lucide-react';
import { storageService } from '../services/storageService';

interface TopPagesListProps {
  language: 'en' | 'bn';
}

export const TopPagesList: React.FC<TopPagesListProps> = ({ language }) => {
  const analytics = storageService.getAnalytics();
  const blogs = storageService.getBlogs();
  const isGAConnected = analytics.isGoogleAnalyticsConnected;

  // If GA4 connected, use live telemetry top pages; otherwise display published portal guides
  const items = isGAConnected && analytics.topPagesLive.length > 0
    ? analytics.topPagesLive.map((item, idx) => ({
        rank: idx + 1,
        title: item.page,
        category: item.path,
        metric: `${item.views} views`,
        time: item.avgTime
      }))
    : blogs.slice(0, 5).map((blog, idx) => ({
        rank: idx + 1,
        title: blog.title,
        category: blog.category,
        metric: `${blog.views} views`,
        time: blog.status
      }));

  return (
    <div className="glass-card-glow rounded-2xl p-4.5 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{language === 'en' ? 'Top Content' : 'শীর্ষ কনটেন্ট'}</span>
              <span className="text-[10px] text-rose-300/70 font-normal">
                {isGAConnected ? '(GA4 Live)' : '(Portal Articles)'}
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 text-[11px] font-semibold text-rose-200/60 pb-1.5 border-b border-white/10 px-1 mt-1">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-8 pl-2">{language === 'en' ? 'Resource / Article' : 'রিসোর্স / আর্টিকেল'}</div>
        <div className="col-span-3 text-right">{language === 'en' ? 'Engagement' : 'ভিউ ও অবস্থা'}</div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-white/5 space-y-0.5">
        {items.map((item) => (
          <div
            key={item.rank}
            className="grid grid-cols-12 items-center py-2 px-1 text-xs hover:bg-rose-900/20 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="col-span-1 text-center font-mono text-rose-300/70 font-semibold group-hover:text-rose-200">
              {item.rank}
            </div>

            <div className="col-span-8 pl-2 flex flex-col min-w-0 pr-2">
              <span className="truncate font-medium text-white group-hover:text-rose-200 transition-colors">
                {item.title}
              </span>
              <span className="text-[10px] text-rose-300/60 truncate">
                {item.category}
              </span>
            </div>

            <div className="col-span-3 text-right font-mono font-semibold text-rose-200/90 tabular-nums text-[11px]">
              <div>{item.metric}</div>
              <div className="text-[10px] text-rose-300/50">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
