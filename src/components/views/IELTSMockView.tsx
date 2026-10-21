import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Send, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Mic, 
  Sparkles, 
  Eye, 
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Plus
} from 'lucide-react';
import { Lead, LeadStatus, IELTSMockTestHistoryEntry } from '../../types';
import { IELTSPerformanceProgressionChart } from '../IELTSPerformanceProgressionChart';
import { countWords } from '../../utils/ieltsAudit';

interface IELTSMockViewProps {
  leads: Lead[];
  onOpenEvaluation: (lead: Lead) => void;
  onOpenZenTestMode: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onAddTestEntry?: (leadId: string, entry: IELTSMockTestHistoryEntry) => void;
  language: 'en' | 'bn';
}

export const IELTSMockView: React.FC<IELTSMockViewProps> = ({
  leads,
  onOpenEvaluation,
  onOpenZenTestMode,
  onUpdateStatus,
  onAddTestEntry,
  language
}) => {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'both' | 'chart_only' | 'cards_only'>('both');

  // Filter only IELTS Mock Test leads
  const ieltsLeads = leads.filter((l) => l.type === 'IELTS Mock Test');

  const filtered = ieltsLeads.filter((l) => {
    if (selectedStatusTab === 'All') return true;
    if (selectedStatusTab === 'Pending') return l.status === 'Submitted' || l.status === 'Pending Evaluation' || l.status === 'New';
    if (selectedStatusTab === 'Evaluated') return l.status === 'Evaluated' || l.status === 'Ready to Send';
    if (selectedStatusTab === 'Sent') return l.status === 'Result Sent';
    return true;
  });

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'Submitted':
      case 'New':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30';
      case 'Pending Evaluation':
        return 'text-amber-300 bg-amber-500/20 border-amber-400/30';
      case 'Evaluated':
        return 'text-purple-300 bg-purple-500/20 border-purple-400/30';
      case 'Ready to Send':
        return 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30';
      case 'Result Sent':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30';
      default:
        return 'text-rose-300 bg-rose-500/20 border-rose-400/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Award className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'IELTS Mock Test Evaluation Hub' : 'আইইএলটিএস মক টেস্ট মূল্যায়ন হাব'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en' 
                  ? 'Manual scoring workflow: Submitted → Pending Evaluation → Evaluated → Ready to Send → Result Sent' 
                  : 'ম্যানুয়াল মূল্যায়ন প্রক্রিয়া এবং হোয়াটসঅ্যাপ/ইমেইলে ফলাফল প্রেরণ'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenZenTestMode}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{language === 'en' ? 'Launch Zen Student Test View' : 'জেন স্টুডেন্ট টেস্ট ভিউ খুলুন'}</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', count: ieltsLeads.length, color: 'from-rose-600/30 to-red-600/10' },
          { label: 'Pending Evaluation', count: ieltsLeads.filter(l => l.status === 'Submitted' || l.status === 'Pending Evaluation' || l.status === 'New').length, color: 'from-amber-600/30 to-yellow-600/10' },
          { label: 'Evaluated / Ready', count: ieltsLeads.filter(l => l.status === 'Evaluated' || l.status === 'Ready to Send').length, color: 'from-blue-600/30 to-cyan-600/10' },
          { label: 'Results Dispatched', count: ieltsLeads.filter(l => l.status === 'Result Sent').length, color: 'from-emerald-600/30 to-teal-600/10' },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br ${item.color}`}>
            <span className="text-[11px] text-rose-200/80 uppercase tracking-wider block font-medium">{item.label}</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{item.count}</div>
          </div>
        ))}
      </div>

      {/* Historical Performance Tracking Chart Component */}
      {(viewMode === 'both' || viewMode === 'chart_only') && (
        <IELTSPerformanceProgressionChart
          leads={leads}
          onAddTestEntry={onAddTestEntry || (() => {})}
          language={language}
        />
      )}

      {/* View Switcher and Filter Tabs */}
      {(viewMode === 'both' || viewMode === 'cards_only') && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-200/70 font-medium">Submissions:</span>
              {['All', 'Pending', 'Evaluated', 'Sent'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedStatusTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedStatusTab === tab
                      ? 'glass-pill-active text-white shadow-lg'
                      : 'text-rose-300/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-rose-300/60 font-mono">
                Showing {filtered.length} of {ieltsLeads.length} mock tests
              </span>
            </div>
          </div>

          {/* IELTS Test Submissions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((lead) => {
              const ielts = lead.ieltsData;
              const scores = ielts?.scores;
              const wordCount = ielts?.writingSubmission ? countWords(ielts.writingSubmission) : (ielts?.writingWordCount || 0);

              return (
                <div
                  key={lead.id}
                  className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-rose-500/40"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{lead.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-rose-200">
                              {ielts?.testType || 'Academic'}
                            </span>
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] text-rose-300/70 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-400" />
                              {lead.phone}
                            </span>
                            <span>·</span>
                            <span className="truncate max-w-[140px]">{lead.email}</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>

                    {/* Test Content Details */}
                    <div className="py-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-rose-200/80">
                        <span>Target: <strong className="text-white">{ielts?.targetCountry || 'Canada'}</strong></span>
                        <span>Target Band: <strong className="text-amber-400 font-mono">{ielts?.targetBand ? ielts.targetBand.toFixed(1) : '7.5'}</strong></span>
                        <span className="text-rose-300/60 font-mono text-[10px]">{lead.date}</span>
                      </div>

                      {/* Essay Snapshot */}
                      {ielts?.writingSubmission ? (
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-rose-300">
                            <span className="font-semibold flex items-center gap-1">
                              <FileText className="w-3 h-3 text-rose-400" />
                              Writing Task 2 Essay
                            </span>
                            <span className="font-mono text-[10px]">{wordCount} words (Audited)</span>
                          </div>
                          <p className="text-[11px] text-rose-200/70 line-clamp-2 italic">
                            "{ielts.writingSubmission}"
                          </p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-rose-300/60 italic">{lead.message}</p>
                      )}

                  {/* Evaluated Band Scores (if scored) */}
                  {scores && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 to-black/60 border border-rose-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-rose-300">Evaluated Scorecard</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-amber-300 font-mono">Overall: Band {scores.overall.toFixed(1)}</span>
                          <span className="text-[10px] text-rose-300/70">({scores.cefrLevel})</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-rose-300/70 block">Listening</span>
                          <strong className="text-white text-xs">{scores.listening.toFixed(1)}</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-rose-300/70 block">Reading</span>
                          <strong className="text-white text-xs">{scores.reading.toFixed(1)}</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-rose-300/70 block">Writing</span>
                          <strong className="text-white text-xs">{scores.writing.toFixed(1)}</strong>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-rose-300/70 block">Speaking</span>
                          <strong className="text-white text-xs">{scores.speaking.toFixed(1)}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="text-[11px] text-rose-300/70">
                  {lead.status === 'Result Sent' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Result Sent to Candidate
                    </span>
                  ) : lead.status === 'Evaluated' ? (
                    <span className="text-cyan-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Ready for WhatsApp dispatch
                    </span>
                  ) : (
                    <span className="text-amber-300 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Needs Senior Examiner Review
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onOpenEvaluation(lead)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{scores ? 'View / Re-evaluate' : 'Evaluate & Send Result'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </motion.div>
  );
};
