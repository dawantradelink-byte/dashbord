import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Sliders, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';
import { NotificationItem } from '../types';
import { waterAudio } from './WaterAudio';
import { NextBorderLogo } from './NextBorderLogo';

interface HeaderProps {
  language: 'en' | 'bn';
  onToggleLanguage: (lang: 'en' | 'bn') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  adminMode: boolean;
  onToggleAdminMode: () => void;
  onSelectLeadById?: (id: string) => void;
  onOpenMotionModal?: () => void;
  activeTheme?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  searchQuery,
  onSearchChange,
  adminMode,
  onToggleAdminMode,
  onSelectLeadById,
  onOpenMotionModal,
  activeTheme = 'pond'
}) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [currentTime, setCurrentTime] = useState<string>('Today 19 Oct 2026, 11:05 AM');

  // Real-time clock formatted like the screenshot
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formatted = now.toLocaleDateString('en-GB', options);
      setCurrentTime(`Today ${formatted}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleAudioToggle = () => {
    const playing = waterAudio.toggle();
    setIsAudioPlaying(playing);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="relative z-30 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 glass-panel">
      {/* Left zone: Kalima Tayyiba Multi-Color Calligraphic Headline */}
      <div className="flex items-center">
        <h1 
          dir="rtl" 
          lang="ar" 
          className="kalima-tayba-title text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-[0.2em] text-white flex items-center gap-2.5 sm:gap-4 whitespace-nowrap leading-none py-2 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-950/45 via-amber-950/50 to-rose-950/45 border border-amber-400/30 shadow-[0_4px_30px_rgba(251,191,36,0.22)] backdrop-blur-md select-none group hover:border-amber-300/60 hover:shadow-[0_4px_36px_rgba(251,191,36,0.35)] transition-all duration-300"
          title="لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ"
        >
          {/* Part 1: La ilaha (Ultra-Vivid Neon Emerald & Electric Cyan) */}
          <span className="font-['Aref_Ruqaa','Amiri',serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00ff9d] via-[#00f2fe] to-[#4facfe] drop-shadow-[0_2px_16px_rgba(0,255,157,0.7)]">
            لَا إِلٰهَ
          </span>

          {/* Part 2: Illallah (Ultra-Luminous 24K Solar Flare Gold) */}
          <span className="font-['Aref_Ruqaa','Amiri',serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe259] via-[#ffa751] to-[#ffdd00] drop-shadow-[0_2px_20px_rgba(255,226,89,0.85)]">
            إِلَّا اللهُ
          </span>

          {/* Calligraphic Decorative Star Divider */}
          <span className="text-[#ffd700] text-base sm:text-lg px-0.5 drop-shadow-[0_0_16px_rgba(255,215,0,0.95)] animate-pulse">
            ✦
          </span>

          {/* Part 3: Muhammadur (Ultra-Vibrant Hot Rose, Coral & Fuchsia) */}
          <span className="font-['Aref_Ruqaa','Amiri',serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff0844] via-[#ffb199] to-[#f857a6] drop-shadow-[0_2px_18px_rgba(255,8,68,0.75)]">
            مُحَمَّدٌ
          </span>

          {/* Part 4: Rasulullah (Ultra-Vibrant Sunburst Topaz & Amber with End Verse Ornament) */}
          <span className="font-['Aref_Ruqaa','Amiri',serif] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f7971e] via-[#ffd200] to-[#f39c12] drop-shadow-[0_2px_20px_rgba(247,151,30,0.85)]">
            رَسُولُ اللهِ ۝
          </span>
        </h1>
      </div>

      {/* Center Zone: Next Border Emblem (visible on wide screens) */}
      <div className="hidden xl:flex items-center px-4 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/20 shadow-inner hover:scale-105 transition-transform cursor-pointer">
        <NextBorderLogo size={40} showText={true} />
      </div>

      {/* Right zone: Search & Action Utilities */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
        {/* Search Bar */}
        <div className="relative min-w-[200px] md:w-64">
          <Search className="w-4 h-4 text-rose-300/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={language === 'en' ? 'Search anything...' : 'অনুসন্ধান করুন...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full glass-input text-white placeholder-rose-200/50 transition-all focus:w-72"
          />
        </div>

        {/* Ambient Water Sound Toggle */}
        <button
          onClick={handleAudioToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
            isAudioPlaying
              ? 'bg-rose-500/30 text-rose-200 border-rose-400/50 shadow-md shadow-rose-900/30 animate-pulse'
              : 'bg-white/5 text-rose-200/80 border-white/10 hover:bg-white/10'
          }`}
          title="Toggle relaxing water ripples & stream ambient sound"
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Zen Waves</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-200/60" />
              <span className="hidden sm:inline">Water Sound</span>
            </>
          )}
        </button>

        {/* MotionSites.ai Inspiration Showcase Button */}
        {onOpenMotionModal && (
          <button
            onClick={onOpenMotionModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all border bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-950/40 border-amber-400/30 text-amber-200 hover:text-white hover:border-amber-300 hover:scale-105 active:scale-95 shadow-sm"
            title="Explore Motionsites.ai Inspired Dynamic Templates"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden md:inline">MotionSites</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-amber-400/20 text-amber-300">
              {activeTheme}
            </span>
          </button>
        )}

        {/* Language Switcher: EN | বাংলা */}
        <div className="flex items-center p-0.5 rounded-full bg-black/30 border border-white/15 text-xs font-medium">
          <button
            onClick={() => onToggleLanguage('en')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              language === 'en'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-rose-200/70 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onToggleLanguage('bn')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              language === 'bn'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-rose-200/70 hover:text-white'
            }`}
          >
            বাংলা
          </button>
        </div>

        {/* Subtle Admin Mode Toggle Switch */}
        <button
          onClick={onToggleAdminMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            adminMode
              ? 'bg-rose-600/80 text-white border-rose-400/40 shadow-sm'
              : 'bg-white/10 text-rose-200 border-white/20 hover:bg-white/15'
          }`}
          title="Toggle between Admin Evaluator Dashboard and Zen Student Mock Test Portal"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{adminMode ? 'Admin Panel' : 'Zen Student Mode'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full glass-panel hover:bg-rose-900/40 border-white/15 text-rose-200 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-rose-950 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 glass-panel rounded-2xl shadow-2xl border border-rose-500/30 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-rose-950/40">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-rose-300 hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      if (onSelectLeadById && item.studentName) {
                        // find matching lead
                      }
                    }}
                    className={`p-3.5 hover:bg-rose-900/30 transition-colors cursor-pointer flex items-start gap-3 ${
                      !item.read ? 'bg-rose-500/10' : ''
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0 mt-0.5">
                      {item.type === 'mock_test' ? <Clock className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-rose-200/70 truncate">{item.studentName}</p>
                      <span className="text-[10px] text-rose-300/50 mt-1 block">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date and Time Widget (Image 1 replica) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel border-white/15 text-xs text-rose-200/90 font-medium">
          <Calendar className="w-3.5 h-3.5 text-rose-400" />
          <span className="tabular-nums">{currentTime}</span>
        </div>

      </div>
    </header>
  );
};
