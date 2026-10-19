import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Award, Globe, FileText } from 'lucide-react';
import { Lead, LeadType, LeadSource } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
  language: 'en' | 'bn';
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  language
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+8801');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<LeadType>('IELTS Mock Test');
  const [source, setSource] = useState<LeadSource>('Website');
  const [message, setMessage] = useState('');
  const [targetCountry, setTargetCountry] = useState('Canada');
  const [targetBand, setTargetBand] = useState<number>(7.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLead: Lead = {
      id: Date.now().toString(),
      name,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=120&auto=format&fit=crop&q=80`,
      type,
      source,
      phone,
      email,
      message: message || (type === 'IELTS Mock Test' ? 'Submitted IELTS Mock Test for evaluation.' : 'Visa inquiry submitted.'),
      date: 'Just now',
      status: 'New',
      unread: true,
      ieltsData: type === 'IELTS Mock Test' ? {
        testType: 'Academic',
        targetCountry,
        targetBand,
        writingSubmission: message || 'Student submitted Writing Task essay. Ready for review.',
        rawListeningScore: 32,
        rawReadingScore: 31
      } : undefined
    };

    onAddLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-rose-500/30 shadow-2xl p-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add New Lead / Mock Test</h3>
              <p className="text-xs text-rose-300/70">Register incoming student or mock test taker</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-rose-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-rose-200 block mb-1">Student Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shakil Chowdhury"
              className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-rose-200 block mb-1">WhatsApp Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+88017XXXXXXXX"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-rose-200 block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-rose-200 block mb-1">Inquiry / Test Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as LeadType)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
              >
                <option value="IELTS Mock Test">IELTS Mock Test</option>
                <option value="USA Admission">USA Admission</option>
                <option value="Canada Study">Canada Study</option>
                <option value="UK Student Visa">UK Student Visa</option>
                <option value="Tourist Visa">Tourist Visa</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-rose-200 block mb-1">Acquisition Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
              >
                <option value="Website">Website</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Facebook">Facebook</option>
                <option value="Google">Google</option>
                <option value="Direct">Direct / Walk-in</option>
              </select>
            </div>
          </div>

          {type === 'IELTS Mock Test' && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-rose-950/30 border border-white/10">
              <div>
                <label className="text-[11px] font-semibold text-rose-300 block mb-1">Target Country</label>
                <input
                  type="text"
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg glass-input text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-rose-300 block mb-1">Target Band</label>
                <input
                  type="number"
                  step="0.5"
                  min="5.0"
                  max="9.0"
                  value={targetBand}
                  onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg glass-input text-white font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-rose-200 block mb-1">Message or Test Notes</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Student request or essay draft..."
              className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-rose-200 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-900/30"
            >
              Add Student Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
