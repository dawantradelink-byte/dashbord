import React from 'react';
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
  ChevronRight
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
  collapsed: boolean;
  onToggleCollapse: () => void;
  language: 'en' | 'bn';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  language
}) => {
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
      className={`relative z-20 flex flex-col justify-between border-r border-white/10 glass-panel transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64 md:w-72'
      }`}
    >
      {/* Top Branding Section */}
      <div className="p-5 flex flex-col items-center border-b border-white/10">
        <div className="flex items-center justify-between w-full">
          {!collapsed ? (
            <div className="flex flex-col items-center mx-auto text-center cursor-pointer group">
              <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                <NextBorderLogo size={82} />
              </div>
              <h2 className="text-sm font-bold tracking-wider text-white uppercase mt-2.5">NEXT BORDER</h2>
              <span className="text-[10px] tracking-widest text-amber-300/80 font-medium uppercase mt-0.5">
                VISA CONSULTANCY
              </span>
            </div>
          ) : (
            <div className="mx-auto cursor-pointer hover:scale-105 transition-transform">
              <NextBorderLogo size={44} />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'en' ? item.labelEn : item.labelBn;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                isActive
                  ? 'glass-pill-active text-white font-semibold shadow-lg'
                  : 'text-rose-200/75 hover:text-white hover:bg-white/5'
              }`}
              title={label}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-rose-300/80'}`} />
              {!collapsed && <span className="truncate">{label}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom Visit Website Action (Image 1 replica) */}
      <div className="p-4 border-t border-white/10">
        <a
          href="https://motionsites.ai/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl glass-panel border-white/15 text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-900/30 transition-all shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {!collapsed && <span>{language === 'en' ? 'Visit Website' : 'ওয়েবসাইট দেখুন'}</span>}
        </a>
      </div>
    </aside>
  );
};
