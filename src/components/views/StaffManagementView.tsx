import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  FileText, 
  GraduationCap,
  Sparkles,
  Plus
} from 'lucide-react';
import { storageService, StaffMember } from '../../services/storageService';

interface StaffManagementViewProps {
  language: 'en' | 'bn';
}

export const StaffManagementView: React.FC<StaffManagementViewProps> = ({ language }) => {
  const [staff, setStaff] = useState<StaffMember[]>(() => storageService.getStaff());

  const handleToggleStatus = (id: string) => {
    const updated = staff.map((s) => s.id === id ? { ...s, activeStatus: !s.activeStatus } : s);
    setStaff(updated);
    storageService.saveStaff(updated);
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
              <UserCheck className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Staff & Examiner Roster' : 'টিম ও পরীক্ষক তালিকা'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Certified examiners, licensed visa processing counselors, and admissions coordinators'
                  : 'সার্টিফাইড আইইএলটিএস পরীক্ষক ও অভিজ্ঞ ভিসা কাউন্সিলরবৃন্দ'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{staff.filter(s => s.activeStatus).length} Active On-Duty</span>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500/40 shadow-lg"
                />
                <button
                  onClick={() => handleToggleStatus(member.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                    member.activeStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-rose-950/60 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {member.activeStatus ? 'Active' : 'On Leave'}
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-bold text-white text-base">{member.name}</h3>
                <p className="text-xs font-medium text-rose-300/80 mt-0.5">{member.role}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-amber-300">
                  {member.department}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-rose-200/80">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </a>
                <a
                  href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-300 transition-colors font-mono text-emerald-400"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{member.phone}</span>
                </a>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-rose-300/60 font-mono">
              <span>Next Border Official</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
