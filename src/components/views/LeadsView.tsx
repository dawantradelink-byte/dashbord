import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Award, 
  ExternalLink,
  MessageSquare,
  FileSpreadsheet,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Lead, LeadStatus, LeadType } from '../../types';

interface LeadsViewProps {
  leads: Lead[];
  onOpenEvaluation: (lead: Lead) => void;
  onOpenAddModal: () => void;
  onOpenEditModal: (lead: Lead) => void;
  onOpenDeleteModal: (lead: Lead) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  language: 'en' | 'bn';
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onOpenEvaluation,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onUpdateStatus,
  language,
  searchQuery,
  onSearchChange
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filtered = leads.filter((lead) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.type.toLowerCase().includes(q) ||
        lead.message.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Type filter
    if (filterType !== 'All' && lead.type !== filterType) return false;

    // Status filter
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;

    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'Submitted':
      case 'New':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'Pending Evaluation':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
      case 'Evaluated':
      case 'Reviewed':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
      case 'Ready to Send':
        return 'bg-cyan-500/20 text-cyan-200 border-cyan-400/30';
      case 'Result Sent':
      case 'Contacted':
        return 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const getTypeBadge = (type: LeadType) => {
    switch (type) {
      case 'IELTS Mock Test':
        return 'bg-rose-500/20 text-rose-200 border-rose-400/30';
      case 'USA Admission':
        return 'bg-amber-500/20 text-amber-200 border-amber-400/30';
      case 'Canada Study':
        return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'UK Student Visa':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      default:
        return 'bg-purple-500/20 text-purple-200 border-purple-400/30';
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
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {language === 'en' ? 'Leads & Inquiries Directory' : 'লিডস ও অনুসন্ধান তালিকা'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-mono text-rose-300">
              {filtered.length} {language === 'en' ? 'Records' : 'রেকর্ড'}
            </span>
          </div>
          <p className="text-xs text-rose-200/70 mt-1">
            {language === 'en'
              ? 'Student admissions, IELTS candidate inquiries, and direct communication channels.'
              : 'শিক্ষার্থী ভর্তি, আইইএলটিএস প্রার্থী অনুসন্ধান এবং সরাসরি যোগাযোগ মাধ্যম।'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'Add New Lead' : 'নতুন লিড যুক্ত করুন'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300/60" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search by name, phone, email, or details...' : 'নাম, ফোন বা ইমেইল দিয়ে অনুসন্ধান...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-white placeholder-rose-200/40"
          />
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-2">
          <span className="text-rose-300/70">{language === 'en' ? 'Type:' : 'ধরণ:'}</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="IELTS Mock Test">IELTS Mock Test</option>
            <option value="USA Admission">USA Admission</option>
            <option value="Canada Study">Canada Study</option>
            <option value="UK Student Visa">UK Student Visa</option>
            <option value="Tourist Visa">Tourist Visa</option>
          </select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-rose-300/70">{language === 'en' ? 'Status:' : 'অবস্থা:'}</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Pending Evaluation">Pending Evaluation</option>
            <option value="Evaluated">Evaluated</option>
            <option value="Ready to Send">Ready to Send</option>
            <option value="Result Sent">Result Sent</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-rose-300/80 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-4 px-4">Student / Candidate</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Contact (WhatsApp & Email)</th>
                <th className="py-4 px-4">Message / Requirements</th>
                <th className="py-4 px-4">Workflow Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-rose-300/60">
                    No leads found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.04] transition-colors group">
                    {/* Student Profile */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="w-9 h-9 rounded-full object-cover border border-rose-500/30"
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{lead.name}</div>
                          <span className="text-[10px] text-rose-300/60 font-mono">ID #{lead.id} · {lead.source}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold border ${getTypeBadge(lead.type)}`}>
                        {lead.type}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-xs hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span>{lead.phone}</span>
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 text-rose-300/80 hover:text-white text-xs truncate max-w-[180px] hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </a>
                      </div>
                    </td>

                    {/* Message / Inquiry */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-rose-200/80 leading-relaxed text-xs">
                        {lead.message}
                      </p>
                      {lead.ieltsData && (
                        <div className="mt-1 text-[11px] text-amber-300/90 font-mono flex items-center gap-1">
                          <span>Target: {lead.ieltsData.targetCountry || 'Canada'}</span>
                          <span>· Band {lead.ieltsData.targetBand || 7.0}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge & Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border text-center ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                          className="text-[10px] py-0.5 px-1.5 rounded bg-black/40 border border-white/10 text-rose-300 cursor-pointer"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Pending Evaluation">Pending Evaluation</option>
                          <option value="Evaluated">Evaluated</option>
                          <option value="Ready to Send">Ready to Send</option>
                          <option value="Result Sent">Result Sent</option>
                          <option value="Contacted">Contacted</option>
                        </select>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-rose-300/70 font-mono text-[11px]">
                      {lead.date}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.type === 'IELTS Mock Test' && (
                          <button
                            onClick={() => onOpenEvaluation(lead)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-all hover:scale-105"
                            title="Evaluate IELTS Mock & Dispatch"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenEditModal(lead)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all"
                          title="Edit Lead"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenDeleteModal(lead)}
                          className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-500/20 transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
