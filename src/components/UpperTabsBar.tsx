import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Users, 
  Award, 
  GraduationCap, 
  FileText, 
  BarChart3, 
  BookOpen, 
  UserCheck, 
  Settings,
  Waves,
  Sparkles
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { waterAudio } from './WaterAudio';

interface UpperTabsBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: 'en' | 'bn';
}

interface TabItem {
  id: NavTab;
  labelEn: string;
  labelBn: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

export const UpperTabsBar: React.FC<UpperTabsBarProps> = ({
  activeTab,
  onSelectTab,
  language
}) => {
  const [hoveredTab, setHoveredTab] = useState<NavTab | null>(null);
  const [waveCursorX, setWaveCursorX] = useState<number | null>(null);
  const [waveIntensity, setWaveIntensity] = useState<number>(0);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastSoundRef = useRef<number>(0);

  const tabs: TabItem[] = [
    { id: 'Dashboard', labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: Home },
    { id: 'Leads & Inquiries', labelEn: 'Leads & Inquiries', labelBn: 'লিডস ও অনুসন্ধান', icon: Users, badge: 'New' },
    { id: 'IELTS Mock Test', labelEn: 'IELTS Mock Test', labelBn: 'আইইএলটিএস মক টেস্ট', icon: Award },
    { id: 'Students / Clients', labelEn: 'Students', labelBn: 'শিক্ষার্থী', icon: GraduationCap },
    { id: 'Visa Applications', labelEn: 'Visa Cases', labelBn: 'ভিসা আবেদন', icon: FileText },
    { id: 'Website Analytics', labelEn: 'Analytics', labelBn: 'অ্যানালিটিক্স', icon: BarChart3 },
    { id: 'Blog Manager', labelEn: 'Blog Hub', labelBn: 'ব্লগ হাব', icon: BookOpen },
    { id: 'Staff Management', labelEn: 'Staff', labelBn: 'কর্মী দল', icon: UserCheck },
    { id: 'Settings', labelEn: 'Settings', labelBn: 'সেটিংস', icon: Settings }
  ];

  // Mouse wave movement handler over upper tabs
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (barRef.current) {
      const rect = barRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      setWaveCursorX(relativeX);
      setWaveIntensity(1);

      // Throttled subtle water chime on wave pass
      const now = performance.now();
      if (now - lastSoundRef.current > 180) {
        lastSoundRef.current = now;
        waterAudio.playRippleSound(1.1 + (relativeX / rect.width) * 0.4);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
    setWaveCursorX(null);
    setWaveIntensity(0);
  };

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div 
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-20 w-full px-4 sm:px-6 py-2.5 glass-panel border-b border-white/10 select-none overflow-hidden"
    >
      {/* Background Interactive Liquid Wave Ambient Glow tracking cursor */}
      {waveCursorX !== null && (
        <div
          className="absolute top-0 bottom-0 pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: `${waveCursorX - 90}px`,
            width: '180px',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.35) 0%, rgba(251,191,36,0.18) 45%, transparent 75%)',
            filter: 'blur(8px)'
          }}
        />
      )}

      {/* Undulating Water Wave Ribbon Line under tabs */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden pointer-events-none opacity-80">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1200 8" 
          preserveAspectRatio="none"
        >
          <path
            d={
              waveCursorX !== null
                ? `M 0 4 Q ${waveCursorX * 0.5} ${2 + Math.sin(Date.now() / 200) * 2}, ${waveCursorX} 7 T 1200 4`
                : "M 0 4 Q 300 1, 600 4 T 1200 4"
            }
            fill="none"
            stroke="url(#wave-gradient)"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="35%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Scrollable Tabs Container (Touch-swipe friendly on Mobile & Tablet) */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-1 snap-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isHovered = hoveredTab === tab.id;

          return (
            <button
              key={tab.id}
              data-active={isActive}
              type="button"
              onClick={() => {
                onSelectTab(tab.id);
                waterAudio.playRippleSound(1.2);
              }}
              onMouseEnter={() => setHoveredTab(tab.id)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 snap-center shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white border-rose-400/60 shadow-lg shadow-rose-950/60'
                  : isHovered
                  ? 'bg-rose-950/60 text-white border-amber-400/50 shadow-md shadow-rose-950/30 -translate-y-0.5'
                  : 'bg-black/30 hover:bg-white/5 text-rose-200/75 border-white/5'
              }`}
            >
              {/* Tab Icon with micro-glow */}
              <div className={`transition-transform duration-200 ${isHovered ? 'scale-110 text-amber-300' : isActive ? 'text-white' : 'text-rose-300/80'}`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Tab Label */}
              <span className="tracking-wide">
                {language === 'en' ? tab.labelEn : tab.labelBn}
              </span>

              {/* Notification / Alert Badge */}
              {tab.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {tab.badge}
                </span>
              )}

              {/* Liquid Wave Ripple Highlight on Hover */}
              <AnimatePresence>
                {isHovered && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 via-amber-500/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Tab Liquid Underline Light */}
              {isActive && (
                <motion.div
                  layoutId="activeUpperTabWave"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 via-rose-300 to-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
