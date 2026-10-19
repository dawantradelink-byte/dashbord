import React, { useState, useEffect } from 'react';
import { X, Edit3, Save, Phone, Mail, User, Globe, Award } from 'lucide-react';
import { Lead, LeadStatus, LeadType, LeadSource } from '../types';

interface EditLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedLead: Lead) => void;
  language: 'en' | 'bn';
}

export const EditLeadModal: React.FC<EditLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !lead) return null;

  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [email, setEmail] = useState(lead.email);
  const [type, setType] = useState<LeadType>(lead.type);
  const [source, setSource] = useState<LeadSource>(lead.source);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [message, setMessage] = useState(lead.message);
  const [targetCountry, setTargetCountry] = useState(lead.ieltsData?.targetCountry || 'Canada');
  const [targetBand, setTargetBand] = useState<number>(lead.ieltsData?.targetBand || 7.0);

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setPhone(lead.phone);
      setEmail(lead.email);
      setType(lead.type);
      setSource(lead.source);
      setStatus(lead.status);
      setMessage(lead.message);
      setTargetCountry(lead.ieltsData?.targetCountry || 'Canada');
      setTargetBand(lead.ieltsData?.targetBand || 7.0);
    }
  }, [lead]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Lead = {
      ...lead,
      name,
      phone,
      email,
      type,
      source,
      status,
      message,
      updatedAt: new Date().toLocaleString(),
      ieltsData: type === 'IELTS Mock Test' ? {
        ...(lead.ieltsData || { testType: 'Academic' }),
        targetCountry,
        targetBand
      } : lead.ieltsData
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-rose-500/40 shadow-2xl p-6 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Edit Student / Lead Record</h3>
              <p className="text-xs text-rose-300/70">Update contact details, test parameters, and status</p>
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
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-rose-200 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <label className="text-xs font-semibold text-rose-200 block mb-1">Workflow Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer font-medium"
              >
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
            <label className="text-xs font-semibold text-rose-200 block mb-1">Message / Notes</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-rose-200 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-900/30"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
