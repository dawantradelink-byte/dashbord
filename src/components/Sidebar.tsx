import React, { useState } from 'react';
import { NextBorderLogo } from './NextBorderLogo';
import { 
  Home, 
  Users, 
  GraduationCap, 
  FileText, 
  Award, 
  BarChart3, 
  Cpu, 
  BookOpen, 
  UserCheck, 
  Layers, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff
} from 'lucide-react';

export type NavTab = 
  | 'Dashboard'
  | 'Leads & Inquiries'
  | 'IELTS Mock Test'
  | 'Students / Clients'
  | 'Visa Applications'
  | 'Website Analytics'
  | 'AI Blog Inspector'
  | 'Blog Manager'
  | 'Staff Management'
  | 'Pages'
  | 'Settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  language: 'en' | 'bn';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed = true,
  onToggleCollapse,
  language
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  // Expands smoothly on hover, collapses on mouse leave unless user explicitly pinned it open
  const isExpanded = isPinned || isHovered;

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned((prev) => !prev);
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const navItems: { id: NavTab; labelEn: string; labelBn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'Dashboard', labelEn: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: Home },
    { id: 'Leads & Inquiries', labelEn: 'Leads & Inquiries', labelBn: 'লিডস ও অনুসন্ধান', icon: Users },
    { id: 'IELTS Mock Test', labelEn: 'IELTS Mock Test', labelBn: 'আইইএলটিএস মক টেস্ট', icon: Award },
    { id: 'Students / Clients', labelEn: 'Students / Clients', labelBn: 'শিক্ষার্থী / ক্লায়েন্ট', icon: GraduationCap },
    { id: 'Visa Applications', labelEn: 'Visa Applications', labelBn: 'ভিসা আবেদন', icon: FileText },
    { id: 'Website Analytics', labelEn: 'Website Analytics', labelBn: 'ওয়েবসাইট অ্যানালিটিক্স', icon: BarChart3 },
    { id: 'AI Blog Inspector', labelEn: 'AI Blog Inspector', labelBn: 'এআই ব্লগ ইন্সপেক্টর', icon: Cpu },
    { id: 'Blog Manager', labelEn: 'Blog Manager', labelBn: 'ব্লগ ম্যানেজার', icon: BookOpen },
    { id: 'Staff Management', labelEn: 'Staff Management', labelBn: 'কর্মী ব্যবস্থাপনা', icon: UserCheck },
    { id: 'Pages', labelEn: 'Pages', labelBn: 'পেজ সমূহ', icon: Layers },
    { id: 'Settings', labelEn: 'Settings', labelBn: 'সেটিংস', icon: Settings }
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative z-20 flex flex-col justify-between border-r border-white/10 glass-panel select-none overflow-hidden transition-all duration-300 ease-in-out shrink-0 ${
        isExpanded 
          ? 'w-64 md:w-72 shadow-2xl shadow-rose-950/70 border-rose-500/30' 
          : 'w-20 shadow-lg'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-4 flex flex-col items-center border-b border-white/10 transition-all duration-300">
        <div className="flex items-center justify-between w-full">
          <div 
            onClick={() => onSelectTab('Dashboard')}
            className="flex flex-col items-center mx-auto text-center cursor-pointer group"
          >
            <div className="relative transform group-hover:scale-105 transition-transform duration-300">
              <NextBorderLogo size={isExpanded ? 76 : 42} />
            </div>

            {isExpanded && (
              <div className="mt-2 text-center animate-in fade-in duration-200">
                <h2 className="text-sm font-bold tracking-wider text-white uppercase whitespace-nowrap">
                  NEXT BORDER
                </h2>
                <span className="text-[10px] tracking-widest text-amber-300/80 font-medium uppercase block whitespace-nowrap">
                  VISA CONSULTANCY
                </span>
              </div>
            )}
          </div>

          {/* Pin open toggle button */}
          {isExpanded && (
            <button
              onClick={togglePin}
              className={`p-1.5 rounded-lg text-xs transition-colors shrink-0 ${
                isPinned 
                  ? 'bg-rose-600/40 text-rose-100 hover:bg-rose-600/60 border border-rose-400/40' 
                  : 'text-rose-300/60 hover:text-white hover:bg-white/10'
              }`}
              title={isPinned ? 'Pinned open (Click to auto-collapse on hover)' : 'Pin sidebar open'}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-3 px-2.5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'en' ? item.labelEn : item.labelBn;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center rounded-xl text-xs md:text-sm font-medium transition-all group relative ${
                isExpanded ? 'gap-3.5 px-3 py-2.5 text-left' : 'justify-center p-2.5'
              } ${
                isActive
                  ? 'glass-pill-active text-white font-semibold shadow-lg'
                  : 'text-rose-200/75 hover:text-white hover:bg-white/5'
              }`}
              title={!isExpanded ? label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-rose-300/80'}`} />
              
              {isExpanded && (
                <span className="truncate animate-in fade-in duration-200">{label}</span>
              )}

              {/* Floating Tooltip in collapsed icon mode */}
              {!isExpanded && (
                <span className="absolute left-full ml-3 px-2.5 py-1 rounded-lg glass-panel bg-rose-950/95 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl border border-rose-500/40">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Visit Website Action */}
      <div className="p-3 border-t border-white/10">
        <a
          href="https://nextborder.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full flex items-center justify-center rounded-xl glass-panel border-white/15 text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-900/30 transition-all shadow-sm ${
            isExpanded ? 'gap-2 px-3 py-2.5' : 'p-2.5'
          }`}
          title={!isExpanded ? (language === 'en' ? 'Visit NextBorder' : 'নেক্সট বর্ডার দেখুন') : undefined}
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {isExpanded && (
            <span className="truncate animate-in fade-in duration-200">
              {language === 'en' ? 'NextBorder Portal' : 'নেক্সট বর্ডার পোর্টাল'}
            </span>
          )}
        </a>
      </div>
    </aside>
  );
};
