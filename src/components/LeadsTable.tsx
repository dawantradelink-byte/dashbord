import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  FileText, 
  BarChart3, 
  Clock, 
  ArrowRight, 
  Eye, 
  Mail, 
  MessageSquare, 
  MoreVertical,
  Plus,
  Globe,
  Compass,
  CheckCircle2,
  Trash2,
  UserCheck
} from 'lucide-react';
import { Lead, LeadStatus, LeadType } from '../types';

export type LeadFilterTab = 'Latest Leads' | 'IELTS Mock Test' | 'Visa Inquiries' | 'Website Analytics' | 'Recent Activities';

interface LeadsTableProps {
  leads: Lead[];
  onOpenEvaluation: (lead: Lead) => void;
  onOpenAddModal: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDeleteLead: (id: string) => void;
  language: 'en' | 'bn';
  searchQuery: string;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onOpenEvaluation,
  onOpenAddModal,
  onUpdateStatus,
  onDeleteLead,
  language,
  searchQuery
}) => {
  const [activeTab, setActiveTab] = useState<LeadFilterTab>('Latest Leads');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter based on active tab and search query
  const filteredLeads = leads.filter((lead) => {
    // Search query match
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

    if (activeTab === 'Latest Leads') return true;
    if (activeTab === 'IELTS Mock Test') return lead.type === 'IELTS Mock Test';
    if (activeTab === 'Visa Inquiries') return lead.type !== 'IELTS Mock Test';
    if (activeTab === 'Website Analytics') return lead.source === 'Website';
    if (activeTab === 'Recent Activities') return true;
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map(l => l.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getTypeBadgeStyle = (type: LeadType) => {
    switch (type) {
      case 'IELTS Mock Test':
        return 'bg-blue-600/30 text-blue-200 border border-blue-400/40';
      case 'USA Admission':
        return 'bg-amber-600/30 text-amber-200 border border-amber-400/40';
      case 'Tourist Visa':
        return 'bg-emerald-600/30 text-emerald-200 border border-emerald-400/40';
      case 'Canada Study':
        return 'bg-purple-600/30 text-purple-200 border border-purple-400/40';
      default:
        return 'bg-rose-600/30 text-rose-200 border border-rose-400/40';
    }
  };

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm';
      case 'Contacted':
        return 'bg-amber-500/25 text-amber-300 border border-amber-400/40';
      case 'Reviewed':
        return 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40';
      case 'Evaluated':
      case 'Result Sent':
      case 'Ready to Send':
        return 'bg-purple-500/25 text-purple-200 border border-purple-400/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border border-rose-400/30';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Website':
        return <Globe className="w-3.5 h-3.5 text-rose-300" />;
      case 'Landing Page':
        return <Compass className="w-3.5 h-3.5 text-amber-300" />;
      case 'Facebook':
        return <span className="text-blue-400 font-bold text-xs">f</span>;
      case 'Google':
        return <span className="text-red-400 font-bold text-xs">G</span>;
      default:
        return <Globe className="w-3.5 h-3.5 text-rose-300" />;
    }
  };

  return (
    <div className="glass-card-glow rounded-3xl p-5 md:p-6 select-none shadow-2xl">
      
      {/* Top Tabs and Action Buttons (Image 1 replica) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 rounded-2xl bg-black/40 border border-white/10">
          {[
            { id: 'Latest Leads', labelEn: 'Latest Leads', labelBn: 'সর্বশেষ লিড', icon: Users },
            { id: 'IELTS Mock Test', labelEn: 'IELTS Mock Test', labelBn: 'আইইএলটিএস মক টেস্ট', icon: Award },
            { id: 'Visa Inquiries', labelEn: 'Visa Inquiries', labelBn: 'ভিসা অনুসন্ধান', icon: FileText },
            { id: 'Website Analytics', labelEn: 'Website Analytics', labelBn: 'ওয়েব বিশ্লেষণ', icon: BarChart3 },
            { id: 'Recent Activities', labelEn: 'Recent Activities', labelBn: 'সাম্প্রতিক কাজ', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LeadFilterTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'glass-pill-active text-white shadow-md'
                    : 'text-rose-200/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-rose-300/80'}`} />
                <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600/40 hover:bg-rose-600/60 border border-rose-400/40 text-xs font-semibold text-rose-100 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Add Lead / Mock' : 'নতুন যুক্ত করুন'}</span>
          </button>

          <button
            onClick={() => setActiveTab('Latest Leads')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400/90 to-amber-500/90 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all"
          >
            <span>{language === 'en' ? 'View All Leads' : 'সকল লিড দেখুন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtitle Banner */}
      <div className="flex items-center gap-3 pt-4 pb-3">
        <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/30 flex items-center justify-center text-rose-300">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {language === 'en' ? 'Latest Leads & Inquiries' : 'সর্বশেষ শিক্ষার্থী ও অনুসন্ধানসমূহ'}
          </h3>
          <p className="text-[11px] text-rose-300/60">
            {language === 'en'
              ? 'Students who submitted inquiries, mock tests or contacted you'
              : 'শিক্ষার্থী যারা অনুসন্ধান, মক টেস্ট জমা দিয়েছেন বা যোগাযোগ করেছেন'}
          </p>
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="overflow-x-auto mt-2 rounded-2xl border border-white/10 bg-black/20">
        <table className="w-full text-left text-xs text-rose-100 min-w-[950px]">
          <thead className="bg-rose-950/40 text-[11px] font-semibold text-rose-200/70 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredLeads.length && filteredLeads.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded accent-rose-500 cursor-pointer"
                />
              </th>
              <th className="py-3 px-2 w-8 text-center">#</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Source</th>
              <th className="py-3 px-3">WhatsApp / Email</th>
              <th className="py-3 px-3 max-w-[280px]">Message / Details</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead, idx) => {
              const isSelected = selectedIds.includes(lead.id);

              return (
                <tr
                  key={lead.id}
                  className={`hover:bg-rose-900/25 transition-colors ${
                    isSelected ? 'bg-rose-900/40' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(lead.id)}
                      className="rounded accent-rose-500 cursor-pointer"
                    />
                  </td>

                  {/* Index */}
                  <td className="py-3 px-2 text-center font-mono text-rose-300/70 font-semibold">
                    {idx + 1}
                  </td>

                  {/* Name & Avatar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                      />
                      <span className="font-semibold text-white whitespace-nowrap">
                        {lead.name}
                      </span>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${getTypeBadgeStyle(lead.type)}`}>
                      {lead.type}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-xs text-rose-200/90 whitespace-nowrap">
                      {getSourceIcon(lead.source)}
                      <span>{lead.source}</span>
                    </div>
                  </td>

                  {/* WhatsApp / Email */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-rose-200 hover:text-white hover:underline text-xs flex items-center gap-1"
                        title="Chat on WhatsApp"
                      >
                        {lead.phone}
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="p-1 rounded bg-white/5 hover:bg-rose-500/30 text-rose-300 hover:text-white transition-colors"
                        title={lead.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>

                  {/* Message / Details */}
                  <td className="py-3 px-3 max-w-[260px]">
                    <p className="truncate text-xs text-rose-200/80" title={lead.message}>
                      {lead.message}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 whitespace-nowrap text-xs text-rose-300/70 font-mono">
                    {lead.date}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusBadgeStyle(lead.status)}`}>
                      ✦ {lead.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1 relative">
                      {/* View & Evaluate button */}
                      <button
                        onClick={() => onOpenEvaluation(lead)}
                        className="p-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white transition-all shadow-sm"
                        title={lead.type === 'IELTS Mock Test' ? 'Evaluate IELTS Mock Test' : 'View Details'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* WhatsApp Direct Message */}
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white transition-all"
                        title="Direct WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>

                      {/* Email */}
                      <button
                        onClick={() => onOpenEvaluation(lead)}
                        className="p-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600 text-sky-200 hover:text-white transition-all"
                        title="Send Evaluation Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      {/* More actions dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === lead.id ? null : lead.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-rose-300 hover:text-white transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {openMenuId === lead.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 glass-panel rounded-xl shadow-2xl border border-rose-500/30 p-1.5 z-40 text-left">
                            <button
                              onClick={() => {
                                onUpdateStatus(lead.id, 'Reviewed');
                                setOpenMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 text-[11px] text-white hover:bg-rose-900/40 rounded-lg flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Mark as Reviewed</span>
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(lead.id, 'Contacted');
                                setOpenMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 text-[11px] text-white hover:bg-rose-900/40 rounded-lg flex items-center gap-2"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                              <span>Mark as Contacted</span>
                            </button>
                            <button
                              onClick={() => {
                                onDeleteLead(lead.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 text-[11px] text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 rounded-lg flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              <span>Delete Record</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
