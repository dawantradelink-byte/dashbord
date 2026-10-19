import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  Globe, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  FileText,
  Trash2,
  Edit2
} from 'lucide-react';
import { StudentClient, storageService } from '../../services/storageService';

interface ClientsViewProps {
  language: 'en' | 'bn';
}

export const ClientsView: React.FC<ClientsViewProps> = ({ language }) => {
  const [clients, setClients] = useState<StudentClient[]>(() => storageService.getClients());
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [isAdding, setIsAdding] = useState(false);

  // New Client Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+880');
  const [newCountry, setNewCountry] = useState('Canada');
  const [newUniversity, setNewUniversity] = useState('');
  const [newCounselor, setNewCounselor] = useState('Ishak Dawan');
  const [newNotes, setNewNotes] = useState('');

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newClient: StudentClient = {
      id: `c_${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      targetCountry: newCountry,
      targetUniversity: newUniversity,
      currentStage: 'Initial Inquiry',
      assignedCounselor: newCounselor,
      notes: newNotes,
      createdAt: new Date().toLocaleDateString('en-GB'),
      updatedAt: new Date().toLocaleDateString('en-GB')
    };

    const updated = storageService.addClient(newClient);
    setClients(updated);
    setIsAdding(false);
    setNewName('');
    setNewEmail('');
    setNewUniversity('');
    setNewNotes('');
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      const updated = storageService.deleteClient(id);
      setClients(updated);
    }
  };

  const handleStageChange = (id: string, stage: StudentClient['currentStage']) => {
    const updated = storageService.updateClient(id, { currentStage: stage });
    setClients(updated);
  };

  const filtered = clients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q) || c.targetCountry.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStage !== 'All' && c.currentStage !== selectedStage) return false;
    return true;
  });

  const getStageColor = (stage: StudentClient['currentStage']) => {
    switch (stage) {
      case 'Initial Inquiry':
        return 'text-blue-300 bg-blue-500/20 border-blue-400/30';
      case 'IELTS Preparation':
        return 'text-amber-300 bg-amber-500/20 border-amber-400/30';
      case 'Document Review':
        return 'text-purple-300 bg-purple-500/20 border-purple-400/30';
      case 'Visa Processing':
        return 'text-cyan-300 bg-cyan-500/20 border-cyan-400/30';
      case 'Visa Approved':
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Students & Client CRM' : 'শিক্ষার্থী ও ক্লায়েন্ট সিআরএম'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Track admission journeys, study permits, and counselor assignments'
                  : 'ভর্তি প্রক্রিয়া, স্টাডি পারমিট এবং কাউন্সিলর দায়িত্ব ট্র্যাকিং'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-semibold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Enroll New Student'}</span>
        </button>
      </div>

      {/* Adding Form */}
      {isAdding && (
        <form onSubmit={handleAddClient} className="p-5 glass-panel rounded-3xl border border-rose-500/40 space-y-4 text-xs animate-in fade-in duration-200">
          <h3 className="font-bold text-white text-sm">Enroll New Student Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-rose-200 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
                placeholder="e.g. Shakib Al Hasan"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">WhatsApp / Phone</label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Target Country</label>
              <select
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white bg-rose-950"
              >
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany / Europe">Germany / Europe</option>
              </select>
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Target University / Program</label>
              <input
                type="text"
                value={newUniversity}
                onChange={(e) => setNewUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
                placeholder="e.g. University of Toronto"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Assigned Counselor</label>
              <select
                value={newCounselor}
                onChange={(e) => setNewCounselor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-white bg-rose-950"
              >
                <option value="Ishak Dawan">Ishak Dawan (Managing Director)</option>
                <option value="Ayesha Rahman">Ayesha Rahman (Visa Lead)</option>
                <option value="Kazi Mominul">Kazi Mominul (Admissions)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-rose-200 block mb-1">Counseling Notes / Profile History</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white resize-none"
              placeholder="Academic background, target intake, funding details..."
            />
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
              Save Student Record
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search */}
      <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300/60" />
          <input
            type="text"
            placeholder="Search students by name, country, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-white placeholder-rose-200/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-rose-300/70">Stage:</span>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-white bg-rose-950/80 cursor-pointer"
          >
            <option value="All">All Stages</option>
            <option value="Initial Inquiry">Initial Inquiry</option>
            <option value="IELTS Preparation">IELTS Preparation</option>
            <option value="Document Review">Document Review</option>
            <option value="Visa Processing">Visa Processing</option>
            <option value="Visa Approved">Visa Approved</option>
          </select>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-rose-500/30 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-white text-base">{client.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-rose-300/70 mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-rose-400" />
                    <span>Target: <strong>{client.targetCountry}</strong></span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="p-1 rounded-lg text-rose-400/60 hover:text-rose-300 hover:bg-white/5 transition-colors"
                  title="Delete student"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="py-3 space-y-2 text-xs">
                {client.targetUniversity && (
                  <p className="text-rose-200 font-medium truncate">
                    🏛️ {client.targetUniversity}
                  </p>
                )}

                <div className="space-y-1 text-xs">
                  <a
                    href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:underline font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{client.phone}</span>
                  </a>
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-1.5 text-rose-300/80 hover:underline truncate"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{client.email}</span>
                  </a>
                </div>

                {client.notes && (
                  <p className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-rose-200/70 italic line-clamp-2">
                    "{client.notes}"
                  </p>
                )}

                <div className="text-[11px] text-rose-300/60 flex items-center justify-between pt-1">
                  <span>Counselor: <strong>{client.assignedCounselor}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStageColor(client.currentStage)}`}>
                {client.currentStage}
              </span>

              <select
                value={client.currentStage}
                onChange={(e) => handleStageChange(client.id, e.target.value as any)}
                className="text-[10px] py-1 px-2 rounded-lg bg-black/40 border border-white/10 text-rose-300 cursor-pointer"
              >
                <option value="Initial Inquiry">Initial Inquiry</option>
                <option value="IELTS Preparation">IELTS Preparation</option>
                <option value="Document Review">Document Review</option>
                <option value="Visa Processing">Visa Processing</option>
                <option value="Visa Approved">Visa Approved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
