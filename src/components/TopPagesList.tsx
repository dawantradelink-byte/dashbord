import React from 'react';
import { Flame, Clock } from 'lucide-react';
import { TOP_PAGES } from '../data/mockData';

interface TopPagesListProps {
  language: 'en' | 'bn';
}

export const TopPagesList: React.FC<TopPagesListProps> = ({ language }) => {
  return (
    <div className="glass-card-glow rounded-2xl p-4.5 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
          <Flame className="w-4 h-4 text-rose-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {language === 'en' ? 'Top Pages' : 'শীর্ষ পেজ'}
            <span className="text-[11px] font-normal text-rose-300/70 ml-1.5">
              (Most Time Spent)
            </span>
          </h3>
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-12 text-[11px] font-semibold text-rose-200/60 pb-1.5 border-b border-white/10 px-1 mt-1">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-8 pl-2">{language === 'en' ? 'Page' : 'পেজের নাম'}</div>
        <div className="col-span-3 text-right">{language === 'en' ? 'Avg. Time' : 'গড় সময়'}</div>
      </div>

      {/* Pages List */}
      <div className="divide-y divide-white/5 space-y-0.5">
        {TOP_PAGES.map((item) => (
          <div
            key={item.rank}
            className="grid grid-cols-12 items-center py-2 px-1 text-xs hover:bg-rose-900/20 rounded-lg transition-colors group cursor-pointer"
          >
            <div className="col-span-1 text-center font-mono text-rose-300/70 font-semibold group-hover:text-rose-200">
              {item.rank}
            </div>

            <div className="col-span-8 pl-2 flex items-center gap-2 min-w-0">
              <span className="truncate font-medium text-white group-hover:text-rose-200 transition-colors">
                {language === 'en' ? item.page : item.pageBn}
              </span>
            </div>

            <div className="col-span-3 text-right font-mono font-semibold text-rose-200/90 tabular-nums">
              {item.avgTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
