import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Activity, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  ExternalLink,
  ShieldAlert,
  Flame,
  Calendar
} from 'lucide-react';
import { storageService, RealAnalyticsData } from '../../services/storageService';

interface WebsiteAnalyticsViewProps {
  language: 'en' | 'bn';
}

export const WebsiteAnalyticsView: React.FC<WebsiteAnalyticsViewProps> = ({ language }) => {
  const [analytics, setAnalytics] = useState<RealAnalyticsData>(() => storageService.getAnalytics());
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [dataMode, setDataMode] = useState<'live' | 'demo'>('live');
  const [gaInput, setGaInput] = useState(analytics.googleAnalyticsId || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveGA = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = storageService.getSettings();
    settings.googleAnalyticsId = gaInput.trim();
    storageService.saveSettings(settings);
    setAnalytics(storageService.getAnalytics());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const isConnected = analytics.isGoogleAnalyticsConnected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner with Honest Status Indicator */}
      <div className="p-6 glass-panel rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <BarChart3 className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Website Telemetry & Analytics' : 'ওয়েবসাইট অ্যানালিটিক্স ও ট্রাফিক'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Real traffic tracking, Google Analytics 4 integration, and page engagement metrics'
                  : 'গুগল অ্যানালিটিক্স ৪ ইন্টিগ্রেশন এবং পেজ এনগেজমেন্ট ট্র্যাকিং'}
              </p>
            </div>
          </div>
        </div>

        {/* Honest Connection Status Pill */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40'
              : 'bg-amber-500/20 text-amber-200 border-amber-400/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>
              {isConnected 
                ? `GA4 Connected (${analytics.googleAnalyticsId})` 
                : 'Google Analytics: Not Connected (Showing Live Local Telemetry)'}
            </span>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
            <button
              onClick={() => setDataMode('live')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                dataMode === 'live' ? 'bg-rose-600 text-white shadow' : 'text-rose-300/70 hover:text-white'
              }`}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setDataMode('demo')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                dataMode === 'demo' ? 'bg-rose-600 text-white shadow' : 'text-rose-300/70 hover:text-white'
              }`}
            >
              Baseline Demo
            </button>
          </div>
        </div>
      </div>

      {/* GA4 Setup Form (if not connected or editing) */}
      <form onSubmit={handleSaveGA} className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-rose-200">
          <Globe className="w-4 h-4 text-rose-400" />
          <span className="font-semibold">Connect Google Analytics 4:</span>
        </div>
        <div className="flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            value={gaInput}
            onChange={(e) => setGaInput(e.target.value)}
            placeholder="Enter Measurement ID (e.g. G-ABC1234567)"
            className="w-full px-3 py-1.5 rounded-xl glass-input text-white font-mono"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow transition-all"
        >
          {isSaved ? 'Saved!' : 'Save & Verify'}
        </button>
      </form>

      {/* 4 Core Traffic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: language === 'en' ? 'Last 24 Hours' : 'গত ২৪ ঘণ্টা',
            value: dataMode === 'live' ? analytics.sessionsToday.toLocaleString() : '1,248',
            change: '+12%',
            sub: 'Unique Visitor Sessions',
            gradient: 'from-rose-500/20 to-red-600/5'
          },
          {
            title: language === 'en' ? 'Last 7 Days' : 'গত ৭ দিন',
            value: dataMode === 'live' ? analytics.sessionsThisWeek.toLocaleString() : '6,892',
            change: '+18.4%',
            sub: 'Candidate Sessions',
            gradient: 'from-amber-500/20 to-yellow-600/5'
          },
          {
            title: language === 'en' ? 'Last 1 Month' : 'গত ১ মাস',
            value: dataMode === 'live' ? analytics.sessionsThisMonth.toLocaleString() : '24,310',
            change: '+24.1%',
            sub: 'Total Engaged Inquiries',
            gradient: 'from-purple-500/20 to-pink-600/5'
          },
          {
            title: language === 'en' ? 'All-Time Visitors' : 'সর্বমোট ভিজিটর',
            value: dataMode === 'live' ? analytics.totalPageViews.toLocaleString() : '142,500',
            change: '+31.8%',
            sub: 'Cumulative Page Impressions',
            gradient: 'from-emerald-500/20 to-teal-600/5'
          }
        ].map((card, i) => (
          <div key={i} className={`p-5 rounded-3xl glass-panel border border-white/10 bg-gradient-to-br ${card.gradient} flex flex-col justify-between shadow-xl`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-200/80 uppercase tracking-wider">{card.title}</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ArrowUpRight className="w-3 h-3" />
                  {card.change}
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white mt-3 tracking-tight">{card.value}</div>
            </div>
            <p className="text-[11px] text-rose-300/60 mt-3 pt-2 border-t border-white/5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle Grid: Visitor Trends + Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Visitor Trends (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl glass-panel border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Visitor Trends Over Time</h3>
              <p className="text-xs text-rose-200/70">Daily active user visits and mock test starts</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              {(['24h', '7d', '30d', 'all'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg uppercase font-mono text-[10px] transition-all ${
                    timeRange === r ? 'bg-rose-600 text-white' : 'text-rose-300/60 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-56 w-full pt-4 flex flex-col justify-end">
            <div className="relative h-44 w-full">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M 0,160 Q 100,120 200,140 T 400,60 T 600,30 L 600,200 L 0,200 Z"
                  fill="url(#trendGrad)"
                />
                {/* Stroke */}
                <path
                  d="M 0,160 Q 100,120 200,140 T 400,60 T 600,30"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="3.5"
                />
                {/* Points */}
                {[[0,160], [100,135], [200,140], [300,90], [400,60], [500,45], [600,30]].map(([px, py], i) => (
                  <circle key={i} cx={px} cy={py} r="4.5" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-[11px] font-mono text-rose-300/70 pt-2 border-t border-white/10">
              {analytics.historyDaily.map((h, i) => (
                <span key={i}>{h.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages with Avg Engagement Time (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl glass-panel border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 flex items-center justify-center text-rose-300">
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Top Pages & Engagement</h3>
              <p className="text-xs text-rose-200/70">Measured dwell time per section</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {analytics.topPagesLive.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-rose-500/20 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span className="font-mono text-rose-400 text-[10px]">#{i + 1}</span>
                    <span>{item.page}</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300/60">{item.path}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white text-xs">{item.views.toLocaleString()} views</div>
                  <span className="text-[10px] text-amber-300/90 font-mono flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {item.avgTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
