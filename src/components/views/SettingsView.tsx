import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Save, 
  Shield, 
  Phone, 
  Mail, 
  MessageSquare, 
  BarChart3, 
  CheckCircle2, 
  Sparkles,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { storageService, PortalSettings } from '../../services/storageService';

interface SettingsViewProps {
  language: 'en' | 'bn';
  onShowToast: (msg: string, desc?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ language, onShowToast }) => {
  const [settings, setSettings] = useState<PortalSettings>(() => storageService.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveSettings(settings);
    setSaved(true);
    onShowToast('Settings saved successfully', 'Configuration updated in persistent storage');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data and restore baseline mock leads?')) {
      localStorage.clear();
      window.location.reload();
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
              <Settings className="w-5 h-5 text-rose-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {language === 'en' ? 'Portal & Examiner Settings' : 'পোর্টাল ও পরীক্ষক সেটিংস'}
              </h1>
              <p className="text-xs text-rose-200/70">
                {language === 'en'
                  ? 'Configure WhatsApp result templates, official contacts, and Google Analytics'
                  : 'হোয়াটসঅ্যাপ রেজাল্ট টেমপ্লেট ও কনসালটেন্সি তথ্য কনফিগারেশন'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-950/60 text-rose-300 text-xs border border-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Baseline Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        
        {/* Consultancy Identity */}
        <div className="p-6 glass-panel rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-400" />
            <span>Consultancy & Admin Profile</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-rose-200 block mb-1">Company / Organization Name</label>
              <input
                type="text"
                value={settings.consultancyName}
                onChange={(e) => setSettings({ ...settings, consultancyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Lead Examiner / Managing Director</label>
              <input
                type="text"
                value={settings.primaryCounselor}
                onChange={(e) => setSettings({ ...settings, primaryCounselor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Official WhatsApp & Phone</label>
              <input
                type="text"
                value={settings.officialPhone}
                onChange={(e) => setSettings({ ...settings, officialPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
              />
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Official Inquiries Email</label>
              <input
                type="email"
                value={settings.officialEmail}
                onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Result Message Template */}
        <div className="p-6 glass-panel rounded-3xl border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>IELTS Mock Result Message Template</span>
            </h3>
            <span className="text-[11px] font-mono text-rose-300/70">Dynamic Tags: {'{name}, {overall}, {cefr}, {notes}'}</span>
          </div>
          <p className="text-[11px] text-rose-200/70">
            This formatted draft is prefilled when Ishak Dawan opens the WhatsApp link to transmit the verified test score to the candidate.
          </p>
          <textarea
            rows={4}
            value={settings.whatsappMessageTemplate}
            onChange={(e) => setSettings({ ...settings, whatsappMessageTemplate: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl glass-input text-white font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Analytics & Technical */}
        <div className="p-6 glass-panel rounded-3xl border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-400" />
            <span>Google Analytics 4 & Telemetry</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-rose-200 block mb-1">Google Analytics Measurement ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.googleAnalyticsId}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
              />
              <span className="text-[10px] text-rose-300/60 mt-1 block">
                Leave empty for honest local session mode.
              </span>
            </div>
            <div>
              <label className="text-rose-200 block mb-1">Admin Security Passcode</label>
              <input
                type="password"
                value={settings.adminPasscode}
                onChange={(e) => setSettings({ ...settings, adminPasscode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved to LocalStorage
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </form>
    </motion.div>
  );
};
