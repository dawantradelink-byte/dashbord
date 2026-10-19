import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Globe, 
  Calendar,
  Building,
  Trash2
} from 'lucide-react';
import { VisaApplication, storageService } from '../../services/storageService';

interface VisaApplicationsViewProps {
  language: 'en' | 'bn';
}

export const VisaApplicationsView: React.FC<VisaApplicationsViewProps> = ({ language }) => {
  const [visas, setVisas] = useState<VisaApplication[]>(() => storageService.getVisas());
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [country, setCountry] = useState<VisaApplication['country']>('Canada');
  const [visaType, setVisaType] = useState<VisaApplication['visaType']>('Student (F1 / Tier 4 / Study Permit)');
  const [intakeSeason, setIntakeSeason] = useState('Fall 2027 Intake');
  const [casI20Number, setCasI20Number] = useState('');
  const [deadline, setDeadline] = useState('15 Dec 2026');

  const handleAddVisa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const newVisa: VisaApplication = {
      id: `v_${Date.now()}`,
      studentName,
      country,
      visaType,
      intakeSeason,
      applicationStatus: 'Documents Gathering',
      casI20Number: casI20Number || undefined,
      deadline,
      lastUpdated: new Date().toLocaleDateString('en-GB')
    };

    const updated = storageService.addVisa(newVisa);
    setVisas(updated);
    setIsAdding(false);
    setStudentName('');
    setCasI20Number('');
  };

  const handleDeleteVisa = (id: string) => {
    if (window.confirm('Delete this visa application record?')) {
      const updated = storageService.deleteVisa(id);
      setVisas(updated);
    }
  };

  const handleStatusChange = (id: string, status: VisaApplication['applicationStatus']) => {
    const updated = storageService.updateVisa(id, { applicationStatus: status });
    setVisas(updated);
  };

  const filtered = visas.filter((v) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = v.studentName.toLowerCase().includes(q) || v.country.toLowerCase().includes(q) || (v.casI20Number && v.casI20Number.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedCountry !== 'All' && v.country !== selectedCountry) return false;
    return true;
  });

  const getStatusBadge = (status: VisaApplication['applicationStatus']) => {
    switch (status) {
      case 'Documents Gathering':
        return 'text-amber-300 bg-amber-500/20 border-amber-400/30';
      case 'SOP / Essay Review':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30';
      case 'Application Submitted':
        return 'text-purple-300 bg-purple-500/20 border-purple-400/30';
      case 'Biometrics / Interview':
        return 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30';
      case 'Visa Granted':
        return 'text-emerald-300 bg-emerald-500/20 border-emerald-400/30 font-bold';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Visa Applications Board' : 'ভিসা আবেদন বোর্ড'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'F-1 (USA), SDS Study Permits (Canada), UK CAS & Tier 4, and Schengen visa files'
                  : 'ইউএসএ এফ-১, কানাডা এসডিএস, ইউকে টিয়ার ৪ ও শেঞ্জেন ভিসা ট্র্যাকিং'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close' : 'New Visa File'}</span>
        </button>
      </div>

      {/* Add Visa Modal/Card */}
      {isAdding && (
        <form onSubmit={handleAddVisa} className="p-5 glass-panel rounded-3xl border border-rose-500/40 space-y-4 text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-white text-sm">Open New Visa Processing File</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-rose-200 block mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
                placeholder="Candidate Name"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Destination Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white bg-rose-950"
              >
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Schengen">Schengen</option>
              </select>
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Visa Category</label>
              <select
                value={visaType}
                onChange={(e) => setVisaType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white bg-rose-950"
              >
                <option value="Student (F1 / Tier 4 / Study Permit)">Student (F1 / Tier 4 / Study Permit)</option>
                <option value="Tourist / Visit">Tourist / Visit</option>
                <option value="Work Permit">Work Permit</option>
              </select>
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Intake Season</label>
              <input
                type="text"
                value={intakeSeason}
                onChange={(e) => setIntakeSeason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
                placeholder="e.g. Fall 2027 Intake"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">I-20 / CAS / Application ID (Optional)</label>
              <input
                type="text"
                value={casI20Number}
                onChange={(e) => setCasI20Number(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
                placeholder="e.g. I20-N0019283"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Submission Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
                placeholder="e.g. 15 Nov 2026"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-rose-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow-lg shadow-rose-900/40"
            >
              Create Visa Record
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300/60" />
          <input
            type="text"
            placeholder="Search visa applications by name, country, or tracking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-white placeholder-rose-200/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-rose-300/70">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
          >
            <option value="All">All Countries</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Schengen">Schengen</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-rose-300/80 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-4 px-4">Applicant</th>
                <th className="py-4 px-4">Destination</th>
                <th className="py-4 px-4">Visa Category</th>
                <th className="py-4 px-4">Intake & Reference</th>
                <th className="py-4 px-4">Processing Stage</th>
                <th className="py-4 px-4">Deadline</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((visa) => (
                <tr key={visa.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {visa.studentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-medium">
                      <Globe className="w-3 h-3 text-rose-400" />
                      {visa.country}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-rose-200/80">
                    {visa.visaType}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{visa.intakeSeason}</div>
                    {visa.casI20Number && (
                      <span className="text-[10px] font-mono text-amber-300/80">{visa.casI20Number}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] border ${getStatusBadge(visa.applicationStatus)}`}>
                        {visa.applicationStatus}
                      </span>
                      <select
                        value={visa.applicationStatus}
                        onChange={(e) => handleStatusChange(visa.id, e.target.value as any)}
                        className="text-[10px] py-0.5 px-1.5 rounded bg-black/40 border border-white/10 text-rose-300 cursor-pointer"
                      >
                        <option value="Documents Gathering">Documents Gathering</option>
                        <option value="SOP / Essay Review">SOP / Essay Review</option>
                        <option value="Application Submitted">Application Submitted</option>
                        <option value="Biometrics / Interview">Biometrics / Interview</option>
                        <option value="Visa Granted">Visa Granted</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-300/80 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <span>{visa.deadline}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteVisa(visa.id)}
                      className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-200 hover:bg-rose-900/40 transition-colors"
                      title="Delete Visa Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
