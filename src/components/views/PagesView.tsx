import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers, 
  ExternalLink, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Globe, 
  FileCode2,
  Sparkles
} from 'lucide-react';

interface PagesViewProps {
  language: 'en' | 'bn';
}

interface WebPageRecord {
  id: string;
  title: string;
  path: string;
  status: 'Live' | 'Draft' | 'Scheduled';
  lastUpdated: string;
  views: number;
  description: string;
}

export const PagesView: React.FC<PagesViewProps> = ({ language }) => {
  const [pages, setPages] = useState<WebPageRecord[]>([
    {
      id: 'p1',
      title: 'Next Border Main Portal',
      path: '/',
      status: 'Live',
      lastUpdated: '19 Oct 2026',
      views: 48920,
      description: 'Landing page, consultancy credentials, and lead generation forms.'
    },
    {
      id: 'p2',
      title: 'Zen IELTS Mock Practice Hub',
      path: '/ielts-practice',
      status: 'Live',
      lastUpdated: '19 Oct 2026',
      views: 34100,
      description: 'Calm student mock test environment with live timers, audio, and essay submission.'
    },
    {
      id: 'p3',
      title: 'USA F-1 Visa Comprehensive Portal',
      path: '/visa-usa',
      status: 'Live',
      lastUpdated: '16 Oct 2026',
      views: 18450,
      description: 'I-20 guidelines, embassy interview preparation, and SEVIS assistance.'
    },
    {
      id: 'p4',
      title: 'Canada SDS & Study Permit Guide',
      path: '/canada-sds',
      status: 'Live',
      lastUpdated: '15 Oct 2026',
      views: 22100,
      description: 'GIC setup, designated learning institutions, and language requirements.'
    },
    {
      id: 'p5',
      title: 'UK University Admissions & CAS',
      path: '/uk-admissions',
      status: 'Live',
      lastUpdated: '14 Oct 2026',
      views: 12900,
      description: 'Undergraduate and postgraduate scholarship pathways.'
    },
    {
      id: 'p6',
      title: 'Privacy Policy & Terms of Service',
      path: '/privacy',
      status: 'Live',
      lastUpdated: '01 Oct 2026',
      views: 3400,
      description: 'Data protection and candidate privacy standards.'
    }
  ]);

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
              <Layers className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Website Pages & Content Structure' : 'ওয়েবসাইট পেজ ব্যবস্থাপনা'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Manage public landing pages, practice hubs, and visa guides'
                  : 'পাবলিক ল্যান্ডিং পেজ ও স্টুডেন্ট পোর্টাল পেজ সমূহ'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-rose-200 font-mono">
          <Globe className="w-3.5 h-3.5 text-rose-400" />
          <span>{pages.length} Published Routes</span>
        </div>
      </div>

      {/* Pages Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-rose-300/80 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-4 px-4">Page Title & Description</th>
                <th className="py-4 px-4">Route Path</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Updated</th>
                <th className="py-4 px-4">Views</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-4 px-4 max-w-sm">
                    <div className="font-bold text-white text-sm">{p.title}</div>
                    <p className="text-rose-200/70 text-[11px] mt-0.5">{p.description}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-rose-300">
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                      {p.path}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-rose-300/80 text-[11px]">
                    {p.lastUpdated}
                  </td>
                  <td className="py-4 px-4 font-mono text-white text-xs">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-rose-400" />
                      <span>{p.views.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href="https://motionsites.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
