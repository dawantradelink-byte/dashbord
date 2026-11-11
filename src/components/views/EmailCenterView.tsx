import React, { useMemo, useRef, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownToLine, ArrowLeft, ArrowRight, Bell, Check,
  CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3, CloudUpload,
  Copy, FileSpreadsheet, FileText, Filter, Inbox, Mail, Paperclip, Plus,
  RefreshCw, Search, Send, Settings2, ShieldCheck, Sparkles, Trash2, Upload,
  Users, Workflow, Zap, X
} from 'lucide-react';

type Section = 'Overview' | 'Sheets' | 'Campaigns' | 'Compose' | 'Follow-ups' | 'Replies' | 'Templates' | 'Senders' | 'AI Agent';
type SheetFile = { id: string; name: string; size: string; type: string; rows: number | null; headers: string[]; status: 'Ready' | 'Needs Excel parser' };
type ReplyItem = { id: string; name: string; email: string; subject: string; date: string; preview: string; status: 'New reply' | 'In progress' | 'Handled' };
type MailTemplate = { id: string; name: string; purpose: string; subject: string; body: string; };
type Sender = { id: string; email: string; label: string; enabled: boolean; dailyLimit: number; sentToday: number; };

const NAV: { id: Section; en: string; bn: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Overview', en: 'Overview', bn: 'ওভারভিউ', icon: Activity },
  { id: 'Sheets', en: 'Import sheets', bn: 'শিট ইমপোর্ট', icon: FileSpreadsheet },
  { id: 'Campaigns', en: 'Campaigns', bn: 'ক্যাম্পেইন', icon: Send },
  { id: 'Compose', en: 'Compose email', bn: 'ইমেইল লিখুন', icon: Mail },
  { id: 'Follow-ups', en: 'Follow-up rules', bn: 'ফলো-আপ নিয়ম', icon: Workflow },
  { id: 'Replies', en: 'Replies & alerts', bn: 'রিপ্লাই ও অ্যালার্ট', icon: Inbox },
  { id: 'Templates', en: 'Email templates', bn: 'ইমেইল টেমপ্লেট', icon: FileText },
  { id: 'Senders', en: 'Business senders', bn: 'বিজনেস ইমেইল', icon: RefreshCw },
  { id: 'AI Agent', en: 'AI assistant', bn: 'এআই সহকারী', icon: Sparkles },
];

const INITIAL_SENDERS: Sender[] = [
  { id: 's1', email: 'admissions@nextborder.online', label: 'Admissions', enabled: true, dailyLimit: 35, sentToday: 0 },
  { id: 's2', email: 'info@nextborder.online', label: 'General enquiries', enabled: true, dailyLimit: 35, sentToday: 0 },
  { id: 's3', email: 'students@nextborder.online', label: 'Student support', enabled: true, dailyLimit: 35, sentToday: 0 },
];
const INITIAL_TEMPLATES: MailTemplate[] = [
  { id: 't1', name: 'Initial student enquiry', purpose: 'First contact', subject: 'Your NextBorder study-abroad enquiry', body: 'Hello {{first_name}},\n\nThank you for contacting NextBorder. We would be happy to understand your study plans and guide you through the next steps.\n\nBest regards,\nNextBorder Team' },
  { id: 't2', name: 'Friendly follow-up', purpose: 'Follow-up', subject: 'Just checking in about your plans', body: 'Hello {{first_name}},\n\nI wanted to follow up on my previous email. Have you had a chance to review the information?\n\nYou can simply reply to this email with your questions.\n\nBest regards,\nNextBorder Team' },
  { id: 't3', name: 'Document reminder', purpose: 'Documents', subject: 'A quick reminder about your documents', body: 'Hello {{first_name}},\n\nThis is a gentle reminder about the documents we discussed. Please let us know if you need any help.\n\nBest regards,\nNextBorder Team' },
];
const SAMPLE_REPLIES: ReplyItem[] = [
  { id: 'r1', name: 'Ayesha Rahman', email: 'ayesha@example.com', subject: 'USA admission requirements', date: 'Just now', preview: 'Thank you for the details. Can we arrange a call this week?', status: 'New reply' },
  { id: 'r2', name: 'Tanvir Hasan', email: 'tanvir@example.com', subject: 'Scholarship information', date: 'Yesterday', preview: 'I received the university list. I have one question about funding.', status: 'In progress' },
];
const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = '';
    } else cell += ch;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}
const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

function ActionButton({ children, onClick, kind = 'primary', disabled = false, className = '', type = 'button' }: {
  children: React.ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'quiet' | 'danger';
  disabled?: boolean; className?: string; type?: 'button' | 'submit';
}) {
  const styles = {
    primary: 'border border-rose-300/20 bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-950/35 hover:brightness-110',
    secondary: 'border border-white/15 bg-white/[.055] text-rose-50 hover:border-amber-200/30 hover:bg-white/[.09]',
    quiet: 'border border-transparent bg-transparent text-rose-100/65 hover:bg-white/[.06] hover:text-white',
    danger: 'border border-red-300/20 bg-red-500/10 text-red-200 hover:bg-red-500/15',
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={cx('inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-45', styles[kind], className)}>{children}</button>;
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={cx('rounded-2xl border border-white/10 bg-[#190b12]/80 p-5 shadow-[0_18px_55px_-34px_rgba(0,0,0,.8)] backdrop-blur-xl sm:p-6', className)}>{children}</section>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.12em] text-rose-100/55">{children}</label>;
}
function Field({ label, value, onChange, placeholder = '', type = 'text', className = '' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string;
}) {
  return <div className={className}><Label>{label}</Label><input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 text-xs text-white outline-none placeholder:text-rose-100/25 focus:border-amber-200/40 focus:ring-2 focus:ring-amber-200/10" /></div>;
}

export function EmailCenterView({ language }: { language: 'en' | 'bn' }) {
  const [section, setSection] = useState<Section>('Overview');
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [senders, setSenders] = useState(INITIAL_SENDERS);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [replies, setReplies] = useState(SAMPLE_REPLIES);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [composeTo, setComposeTo] = useState('');
  const [composeFrom, setComposeFrom] = useState(INITIAL_SENDERS[0].email);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeCc, setComposeCc] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [followDays, setFollowDays] = useState([3, 7, 14]);
  const [grayDays, setGrayDays] = useState('20');
  const [followEnabled, setFollowEnabled] = useState(true);
  const [grayEnabled, setGrayEnabled] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(false);
  const [rotation, setRotation] = useState('round-robin');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiActions, setAiActions] = useState(['label-replies', 'update-sheets', 'gray-list']);
  const [campaignStarted, setCampaignStarted] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const isBn = language === 'bn';
  const enabledSenders = senders.filter(s => s.enabled);
  const newReplies = replies.filter(r => r.status === 'New reply').length;
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3600); };
  const csvContacts = files.reduce((total, f) => total + (f.rows ? Math.max(0, f.rows - 1) : 0), 0);
  const filteredFiles = useMemo(() => files.filter(f => f.name.toLowerCase().includes(search.toLowerCase())), [files, search]);
  const filteredReplies = useMemo(() => replies.filter(r => [r.name, r.email, r.subject].some(v => v.toLowerCase().includes(query.toLowerCase()))), [replies, query]);
  const sectionTitle = NAV.find(n => n.id === section);
  const move = (next: Section) => { setSection(next); setToast(''); };

  const handleFiles = async (selected: FileList | null) => {
    if (!selected?.length) return;
    const additions: SheetFile[] = [];
    for (const file of Array.from(selected)) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const id = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      if (ext === 'csv' || file.type === 'text/csv') {
        try {
          const parsed = parseCsv(await file.text());
          additions.push({ id, name: file.name, size: formatSize(file.size), type: 'CSV', rows: parsed.length, headers: parsed[0] ?? [], status: 'Ready' });
        } catch {
          additions.push({ id, name: file.name, size: formatSize(file.size), type: 'CSV', rows: null, headers: [], status: 'Ready' });
        }
      } else {
        additions.push({ id, name: file.name, size: formatSize(file.size), type: ext?.toUpperCase() || 'FILE', rows: null, headers: [], status: 'Needs Excel parser' });
      }
    }
    setFiles(prev => [...prev, ...additions]);
    showToast(`${additions.length} file(s) added to this preview`);
  };

  const toggleAiAction = (id: string) => setAiActions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleSender = (id: string) => setSenders(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  const addFollowDay = () => setFollowDays(prev => [...prev, Math.max(1, (prev[prev.length - 1] || 0) + 7)]);
  const updateFollowDay = (index: number, value: number) => setFollowDays(prev => prev.map((d, i) => i === index ? value : d));
  const requestBrowserAlerts = async () => {
    if (!('Notification' in window)) { showToast('This browser does not support desktop notifications.'); return; }
    const permission = await Notification.requestPermission();
    setBrowserAlerts(permission === 'granted');
    showToast(permission === 'granted' ? 'Browser notifications enabled on this device.' : 'Notification permission was not granted.');
  };
  const saveTemplate = () => {
    if (!templateName.trim() || !templateSubject.trim() || !templateBody.trim()) { showToast('Add a name, subject and email text first.'); return; }
    setTemplates(prev => [{ id: `t${Date.now()}`, name: templateName, purpose: 'Custom template', subject: templateSubject, body: templateBody }, ...prev]);
    setTemplateName(''); setTemplateSubject(''); setTemplateBody(''); setShowTemplateForm(false);
    showToast('Template saved in this preview.');
  };
  const saveDraft = () => {
    if (!composeTo.trim() || !composeSubject.trim()) { showToast('Add the recipient and subject before saving.'); return; }
    showToast('Draft saved in this preview only. Mailbox connection is not enabled.');
  };
  const sendManual = () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) { showToast('Complete To, Subject and message first.'); return; }
    showToast('Preview only: connect an approved mailbox before sending real email.');
  };

  const statusPill = (label: string, tone: 'green' | 'amber' | 'red' = 'amber') => <span className={cx('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold', tone === 'green' ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200' : tone === 'red' ? 'border-red-300/20 bg-red-300/10 text-red-200' : 'border-amber-200/20 bg-amber-200/[.08] text-amber-100')}>{tone === 'green' ? <CheckCircle2 className="h-3 w-3" /> : tone === 'red' ? <AlertCircle className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}{label}</span>;

  return (
    <div className="email-center space-y-5 text-white">
      <style>{`
        .email-center button { transition: transform 320ms cubic-bezier(.34,1.56,.64,1), filter 180ms ease, background-color 180ms ease, border-color 180ms ease; transform-origin: center; }
        .email-center button:active { transform: scale(.95); }
        .email-center button:focus-visible { outline: 2px solid rgba(252,211,77,.8); outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .email-center button { transition: none; } .email-center button:active { transform: none; } }
      `}</style>

      <div className="overflow-hidden rounded-[26px] border border-rose-300/15 bg-[radial-gradient(ellipse_at_top_right,rgba(190,90,50,.18),transparent_38%),linear-gradient(125deg,#260d18,#140910_58%,#1c100d)] p-5 shadow-2xl shadow-black/25 sm:p-7">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/[.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.2em] text-amber-100/80"><Sparkles className="h-3 w-3" /> NextBorder · Mail operations</div>
            <h2 className="text-2xl font-semibold tracking-[-.04em] sm:text-3xl">Email Center<span className="text-amber-300">.</span></h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-rose-100/60">{isBn ? 'শিট, ইমেইল, ফলো-আপ ও রিপ্লাই এক জায়গা থেকে পরিচালনা করুন।' : 'Your simple command center for contact sheets, email campaigns, follow-ups and replies.'}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {statusPill('Preview mode')}
            {statusPill('Mailbox not connected')}
          </div>
        </div>
        <div className="mt-6 flex gap-1.5 overflow-x-auto border-t border-white/10 pt-4 pb-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = section === item.id;
            return <button key={item.id} type="button" onClick={() => move(item.id)} className={cx('inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-[10px] font-semibold transition', active ? 'border-amber-200/30 bg-amber-200/[.12] text-amber-100 shadow-lg shadow-amber-950/15' : 'border-white/[.08] bg-black/15 text-rose-100/55 hover:border-white/20 hover:text-white')}>
              <Icon className="h-3.5 w-3.5" /> {isBn ? item.bn : item.en}
              {item.id === 'Replies' && newReplies > 0 ? <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[8px] text-white">{newReplies}</span> : null}
            </button>;
          })}
        </div>
      </div>

      {section === 'Overview' ? <>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: 'Contact sheets', value: String(files.length), sub: files.length ? 'Added in this preview' : 'No sheets imported', icon: FileSpreadsheet },
            { label: 'CSV contacts', value: csvContacts.toLocaleString(), sub: 'Rows detected from CSV', icon: Users },
            { label: 'New replies', value: String(newReplies), sub: 'Needs your attention', icon: Inbox },
            { label: 'Active senders', value: String(enabledSenders.length), sub: 'Rotation pool configured', icon: RefreshCw },
          ].map((m) => { const Icon = m.icon; return <Panel key={m.label} className="p-4 transition duration-300 hover:-translate-y-0.5 hover:border-amber-200/20"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-rose-100/55">{m.label}</span><span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-200/[.07] text-amber-200"><Icon className="h-4 w-4" /></span></div><div className="mt-3 text-3xl font-semibold tracking-tight">{m.value}</div><p className="mt-1 text-[9px] text-rose-100/35">{m.sub}</p></Panel>; })}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
          <Panel>
            <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Start here</h3><p className="mt-1 text-[10px] text-rose-100/40">A straightforward setup path</p></div><Zap className="h-4 w-4 text-amber-200" /></div>
            <div className="mt-5 space-y-3">
              {[
                { n: '01', title: 'Import your contact sheets', detail: 'Upload several CSV or Excel files together.', target: 'Sheets' as Section, done: files.length > 0 },
                { n: '02', title: 'Check sender addresses', detail: 'Choose which business email addresses join rotation.', target: 'Senders' as Section, done: enabledSenders.length > 0 },
                { n: '03', title: 'Set your follow-up schedule', detail: 'Choose the delay and the 20-day Gray List rule.', target: 'Follow-ups' as Section, done: followEnabled && grayEnabled },
                { n: '04', title: 'Connect replies and alerts', detail: 'Notify you quickly so you can answer personally.', target: 'Replies' as Section, done: instantAlerts },
              ].map(s => <button key={s.n} type="button" onClick={() => move(s.target)} className="flex w-full items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3.5 text-left transition hover:border-amber-200/20 hover:bg-white/[.035]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[.05] font-mono text-[10px] text-amber-200">{s.n}</span><span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold text-rose-50">{s.title}</span><span className="mt-1 block text-[9px] text-rose-100/40">{s.detail}</span></span>{s.done ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <ChevronRight className="h-4 w-4 text-rose-100/35" />}</button>)}
            </div>
          </Panel>
          <Panel>
            <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Your attention queue</h3><p className="mt-1 text-[10px] text-rose-100/40">Replies that need a human response</p></div><Bell className="h-4 w-4 text-amber-200" /></div>
            {replies.filter(r => r.status !== 'Handled').slice(0, 3).map(r => <button key={r.id} type="button" onClick={() => move('Replies')} className="mt-3 flex w-full items-start gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3 text-left hover:border-amber-200/20"><span className="mt-0.5 h-2 w-2 rounded-full bg-rose-400" /><span className="min-w-0 flex-1"><span className="block text-[10px] font-semibold">{r.name}</span><span className="mt-1 block truncate text-[9px] text-rose-100/45">{r.subject} · {r.preview}</span></span><span className="text-[8px] text-rose-100/35">{r.date}</span></button>)}
            <ActionButton kind="secondary" className="mt-4 w-full" onClick={() => move('Replies')}>Open reply inbox <ArrowRight className="h-3.5 w-3.5" /></ActionButton>
          </Panel>
        </div>
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Automation safety</h3><p className="mt-1 text-[10px] text-rose-100/40">What the system will and will not do</p></div>{statusPill('Human replies stay manual', 'green')}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/[.07] bg-black/15 p-4"><ShieldCheck className="h-4 w-4 text-emerald-300" /><h4 className="mt-2 text-[10px] font-semibold">You handle replies</h4><p className="mt-1 text-[9px] leading-5 text-rose-100/40">The AI flags the reply and creates a separate reply list. It will not answer people on your behalf.</p></div>
            <div className="rounded-xl border border-white/[.07] bg-black/15 p-4"><Clock3 className="h-4 w-4 text-amber-200" /><h4 className="mt-2 text-[10px] font-semibold">20-day Gray List</h4><p className="mt-1 text-[9px] leading-5 text-rose-100/40">Contacts with no reply after your chosen period are moved to a separate Gray List sheet.</p></div>
            <div className="rounded-xl border border-white/[.07] bg-black/15 p-4"><RefreshCw className="h-4 w-4 text-amber-200" /><h4 className="mt-2 text-[10px] font-semibold">Sender rotation</h4><p className="mt-1 text-[9px] leading-5 text-rose-100/40">Only verified and enabled business sender accounts can be used by the rotation service.</p></div>
          </div>
        </Panel>
      </> : null}

      {section === 'Sheets' ? <div className="space-y-5">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">Import multiple contact sheets</h3><p className="mt-1 max-w-xl text-[10px] leading-5 text-rose-100/45">Choose several spreadsheets at once. Keep each original sheet as its own list, then select which list a campaign should use.</p></div><span className="rounded-full border border-amber-200/15 bg-amber-200/[.06] px-3 py-1 text-[9px] text-amber-100/75">Multiple files supported in preview</span></div>
          <input ref={fileInput} type="file" multiple accept=".csv,.xlsx,.xls,.ods" className="hidden" onChange={e => { void handleFiles(e.target.files); e.currentTarget.value = ''; }} />
          <button type="button" onClick={() => fileInput.current?.click()} className="mt-5 flex min-h-44 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200/25 bg-amber-200/[.035] p-6 text-center transition hover:border-amber-200/50 hover:bg-amber-200/[.06]">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/20 bg-amber-200/[.08] text-amber-200"><CloudUpload className="h-6 w-6" /></span>
            <span className="mt-3 text-sm font-semibold">Click to choose spreadsheets</span>
            <span className="mt-1 text-[10px] text-rose-100/45">Select multiple CSV, XLSX or XLS files at once</span>
            <span className="mt-3 rounded-lg bg-white/[.07] px-3 py-1.5 text-[9px] font-semibold text-amber-100">Browse files</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[9px] text-rose-100/40"><ShieldCheck className="h-3 w-3 text-emerald-300" /> CSV headers and row counts are read locally in this preview. Files are not uploaded to a server.</div>
        </Panel>
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Your contact lists</h3><p className="mt-1 text-[10px] text-rose-100/40">{files.length} file(s) in this preview</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-100/35" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a sheet..." className="h-9 w-48 rounded-xl border border-white/10 bg-black/20 pl-9 pr-3 text-[10px] outline-none focus:border-amber-200/30" /></div></div>
          {filteredFiles.length ? <div className="mt-4 space-y-2">{filteredFiles.map(f => <div key={f.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-300/[.08] text-emerald-200"><FileSpreadsheet className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold">{f.name}</span><span className="mt-1 block text-[9px] text-rose-100/35">{f.type} · {f.size} · {f.rows ? `${Math.max(0, f.rows - 1)} contact rows detected` : 'Row count not parsed yet'}</span>{f.headers.length ? <span className="mt-1 block truncate text-[8px] text-rose-100/25">Columns: {f.headers.slice(0, 7).join(' · ')}</span> : null}</span>{f.status === 'Ready' ? statusPill('CSV ready', 'green') : statusPill('Excel parser needed')}<button type="button" onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))} aria-label="Remove sheet" className="rounded-lg p-2 text-rose-100/35 hover:bg-red-400/10 hover:text-red-200"><Trash2 className="h-3.5 w-3.5" /></button></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-white/10 py-10 text-center"><FileSpreadsheet className="mx-auto h-6 w-6 text-rose-100/25" /><p className="mt-2 text-[10px] text-rose-100/45">No sheets imported yet. Choose multiple files above to begin.</p></div>}
        </Panel>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel><div className="flex items-center gap-2"><Users className="h-4 w-4 text-amber-200" /><h3 className="text-xs font-semibold">Reply Leads sheet</h3></div><p className="mt-2 text-[10px] leading-5 text-rose-100/45">A separate list automatically created for contacts who reply. The reply itself stays in your inbox for you to handle manually.</p>{statusPill('Created when mailbox is connected', 'amber')}</Panel>
          <Panel><div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-amber-200" /><h3 className="text-xs font-semibold">Gray List sheet</h3></div><p className="mt-2 text-[10px] leading-5 text-rose-100/45">A separate sheet for contacts who have not replied after the configured 20-day period. They are excluded from follow-up campaigns until reviewed.</p>{statusPill('Rule configurable below', 'amber')}</Panel>
        </div>
      </div> : null}

      {section === 'Campaigns' ? <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
        <Panel>
          <h3 className="text-sm font-semibold">Create an email campaign</h3><p className="mt-1 text-[10px] text-rose-100/40">Pick a sheet, choose a message and review it before sending.</p>
          <div className="mt-5 space-y-4">
            <Field label="Campaign name" value={campaignName} onChange={setCampaignName} placeholder="e.g. USA January Intake" />
            <div><Label>Contact sheet</Label><select className="h-11 w-full rounded-xl border border-white/10 bg-[#10080d] px-3 text-xs text-white outline-none focus:border-amber-200/40"><option value="">Choose an imported sheet</option>{files.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
            <div><Label>Email template</Label><select className="h-11 w-full rounded-xl border border-white/10 bg-[#10080d] px-3 text-xs text-white outline-none focus:border-amber-200/40">{templates.map(t => <option key={t.id}>{t.name}</option>)}</select></div>
            <div><Label>Sender pool</Label><div className="rounded-xl border border-white/10 bg-black/20 p-3 text-[10px] text-rose-100/65">{enabledSenders.length} active sender(s) · {rotation === 'round-robin' ? 'Round-robin rotation' : 'Weighted rotation'}{enabledSenders.length === 0 ? ' · Add a verified sender first' : ''}</div></div>
            <div className="rounded-xl border border-amber-200/15 bg-amber-200/[.045] p-3 text-[9px] leading-5 text-amber-100/70">Before live sending, the system will check duplicates, invalid addresses, unsubscribes, sender verification, daily limits and follow-up eligibility.</div>
            <div className="flex flex-wrap gap-2"><ActionButton onClick={() => showToast('Campaign saved as a local preview draft.')} kind="secondary"><Check className="h-3.5 w-3.5" /> Save draft</ActionButton><ActionButton onClick={() => { if (!campaignName.trim() || !files.length) { showToast('Add a campaign name and import a contact sheet first.'); return; } setCampaignStarted(false); showToast('Campaign review prepared. Live sending is not connected.'); }}>Review campaign <ArrowRight className="h-3.5 w-3.5" /></ActionButton></div>
            {campaignStarted ? <p className="text-[10px] text-emerald-200">Campaign ready for review.</p> : null}
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" /><h3 className="text-sm font-semibold">Safe sending checklist</h3></div>
          {['Only contact people who can lawfully receive your message.','Keep an unsubscribe / do-not-contact list.','Stop all future follow-ups as soon as someone replies.','Respect sender mailbox limits and provider policies.','Review a small test campaign before larger sends.'].map((item,i) => <div key={item} className="mt-4 flex items-start gap-2 text-[10px] leading-5 text-rose-100/60"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />{item}</div>)}
        </Panel>
      </div> : null}

      {section === 'Compose' ? <Panel className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Compose email</h3><p className="mt-1 text-[10px] text-rose-100/40">A familiar inbox-style composer for one-to-one messages.</p></div>{statusPill('Mailbox not connected')}</div>
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 border-b border-white/[.07] pb-3"><span className="w-14 text-[10px] text-rose-100/40">From</span><select value={composeFrom} onChange={e => setComposeFrom(e.target.value)} className="h-9 flex-1 bg-transparent text-xs text-white outline-none">{senders.map(s => <option key={s.id} value={s.email} className="bg-[#170b11]">{s.email}{s.enabled ? '' : ' (disabled)'}</option>)}</select></div>
          <div className="flex items-center gap-3 border-b border-white/[.07] pb-3"><span className="w-14 text-[10px] text-rose-100/40">To</span><input value={composeTo} onChange={e => setComposeTo(e.target.value)} placeholder="name@example.com" className="h-9 flex-1 bg-transparent text-xs outline-none placeholder:text-rose-100/25" /><button type="button" onClick={() => setShowCc(v => !v)} className="text-[9px] text-amber-100/65 hover:text-amber-100">{showCc ? 'Hide Cc' : 'Cc'}</button></div>
          {showCc ? <div className="flex items-center gap-3 border-b border-white/[.07] pb-3"><span className="w-14 text-[10px] text-rose-100/40">Cc</span><input value={composeCc} onChange={e => setComposeCc(e.target.value)} placeholder="copy@example.com" className="h-9 flex-1 bg-transparent text-xs outline-none placeholder:text-rose-100/25" /></div> : null}
          <div className="flex items-center gap-3 border-b border-white/[.07] pb-3"><span className="w-14 text-[10px] text-rose-100/40">Subject</span><input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Write a clear subject" className="h-9 flex-1 bg-transparent text-xs outline-none placeholder:text-rose-100/25" /></div>
          <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} rows={13} placeholder="Write your message..." className="min-h-64 w-full resize-y rounded-xl border border-white/[.07] bg-black/20 p-4 text-xs leading-6 text-white outline-none placeholder:text-rose-100/25 focus:border-amber-200/30" />
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2 text-[9px] text-rose-100/35"><Paperclip className="h-3.5 w-3.5" /> Attachments and signature will be connected with the mailbox service.</div><div className="flex flex-wrap gap-2"><ActionButton kind="secondary" onClick={saveDraft}>Save draft</ActionButton><ActionButton onClick={sendManual}><Send className="h-3.5 w-3.5" /> Send email</ActionButton></div></div>
        </div>
      </Panel> : null}

      {section === 'Follow-ups' ? <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Automatic follow-up schedule</h3><p className="mt-1 text-[10px] text-rose-100/40">Set when a reminder is eligible to go out after the first email.</p></div><button type="button" onClick={() => setFollowEnabled(v => !v)} className={cx('rounded-full px-3 py-1.5 text-[9px] font-bold', followEnabled ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-rose-100/50')}>{followEnabled ? 'ON' : 'OFF'}</button></div>
          <div className="mt-5 space-y-3">{followDays.map((day,i) => <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-200/[.08] text-[10px] font-semibold text-amber-100">{i+1}</span><div className="min-w-0 flex-1"><div className="text-[10px] font-semibold">Follow-up email {i+1}</div><div className="mt-1 text-[9px] text-rose-100/35">Send only if no reply and not unsubscribed</div></div><span className="text-[9px] text-rose-100/45">After</span><input type="number" min="1" max="90" value={day} onChange={e => updateFollowDay(i, Number(e.target.value))} className="h-9 w-16 rounded-lg border border-white/10 bg-black/25 px-2 text-center text-xs text-white outline-none focus:border-amber-200/35" /><span className="text-[9px] text-rose-100/45">days</span><button type="button" aria-label="Remove follow-up step" onClick={() => setFollowDays(prev => prev.filter((_,idx) => idx !== i))} className="rounded-lg p-2 text-rose-100/35 hover:bg-red-400/10 hover:text-red-200"><X className="h-3.5 w-3.5" /></button></div>)}</div>
          <ActionButton kind="secondary" className="mt-3" onClick={addFollowDay}><Plus className="h-3.5 w-3.5" /> Add follow-up step</ActionButton>
          <div className="mt-5 rounded-xl border border-white/[.07] bg-black/15 p-4"><Label>Template to use</Label><select className="h-10 w-full rounded-xl border border-white/10 bg-[#10080d] px-3 text-xs text-white outline-none">{templates.map(t => <option key={t.id}>{t.name}</option>)}</select><p className="mt-2 text-[9px] leading-5 text-rose-100/35">Use a different saved template at each step later. All steps stop automatically when the recipient replies, unsubscribes or is manually paused.</p></div>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">20-day Gray List</h3><p className="mt-1 text-[10px] text-rose-100/40">Keep silent contacts in a separate sheet.</p></div><button type="button" onClick={() => setGrayEnabled(v => !v)} className={cx('rounded-full px-3 py-1.5 text-[9px] font-bold', grayEnabled ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-rose-100/50')}>{grayEnabled ? 'ON' : 'OFF'}</button></div>
            <div className="mt-4"><Field label="Move to Gray List after" value={grayDays} onChange={setGrayDays} type="number" /><p className="mt-2 text-[9px] text-rose-100/35">Days without a reply, counted from the first campaign email.</p></div>
            <div className="mt-4 rounded-xl border border-amber-200/15 bg-amber-200/[.04] p-3 text-[10px] leading-5 text-amber-100/65">Create and maintain a separate sheet named <strong>Gray List</strong>. Exclude those contacts from all further automatic follow-ups until you review them.</div>
          </Panel>
          <Panel>
            <h3 className="text-sm font-semibold">Follow-up safeguards</h3>
            {['Stop the sequence immediately when a reply arrives.','Never send to unsubscribed or bounced addresses.','Do not send a second follow-up on the same day.','Keep a record of every scheduled and sent message.'].map(x => <p key={x} className="mt-3 flex gap-2 text-[9px] leading-5 text-rose-100/55"><ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300" />{x}</p>)}
          </Panel>
        </div>
        <div className="xl:col-span-2"><ActionButton onClick={() => showToast('Follow-up rules saved in this preview only. Live scheduler is not connected.')}><Check className="h-3.5 w-3.5" /> Save follow-up settings</ActionButton></div>
      </div> : null}

      {section === 'Replies' ? <div className="space-y-5">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">Reply inbox · Your manual action queue</h3><p className="mt-1 text-[10px] text-rose-100/40">The agent sorts and alerts. You personally handle every reply.</p></div>{statusPill(`${newReplies} needs attention`, newReplies ? 'red' : 'green')}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/[.07] bg-black/15 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold"><Bell className="h-4 w-4 text-amber-200" /> Instant reply notification</div><p className="mt-1 text-[9px] leading-5 text-rose-100/40">Notify you as soon as a connected mailbox receives a reply.</p><button type="button" onClick={() => setInstantAlerts(v => !v)} className={cx('mt-3 rounded-full px-3 py-1.5 text-[9px] font-bold', instantAlerts ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-rose-100/50')}>{instantAlerts ? 'Enabled in preview' : 'Disabled'}</button></div>
            <div className="rounded-xl border border-white/[.07] bg-black/15 p-4"><div className="flex items-center gap-2 text-[10px] font-semibold"><Zap className="h-4 w-4 text-amber-200" /> Browser notification</div><p className="mt-1 text-[9px] leading-5 text-rose-100/40">Ask this browser for permission to show desktop notifications.</p><ActionButton kind="secondary" className="mt-3 min-h-8 px-3 py-1.5 text-[9px]" onClick={() => void requestBrowserAlerts()}>{browserAlerts ? 'Permission granted' : 'Enable on this device'}</ActionButton></div>
          </div>
        </Panel>
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Reply leads sheet</h3><p className="mt-1 text-[10px] text-rose-100/40">A separate record of contacts who replied</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-rose-100/35" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search replies..." className="h-9 w-48 rounded-xl border border-white/10 bg-black/20 pl-9 pr-3 text-[10px] outline-none focus:border-amber-200/30" /></div></div>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[630px] text-left"><thead><tr className="border-b border-white/10 text-[8px] uppercase tracking-[.12em] text-rose-100/35"><th className="pb-3">Contact</th><th className="pb-3">Subject</th><th className="pb-3">Received</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead><tbody>{filteredReplies.map(r => <tr key={r.id} className="border-b border-white/[.05] last:border-0"><td className="py-3"><div className="text-[10px] font-semibold">{r.name}</div><div className="mt-1 text-[9px] text-rose-100/35">{r.email}</div></td><td className="max-w-[230px] py-3"><div className="truncate text-[10px]">{r.subject}</div><div className="mt-1 truncate text-[9px] text-rose-100/35">{r.preview}</div></td><td className="py-3 text-[9px] text-rose-100/45">{r.date}</td><td className="py-3">{r.status === 'New reply' ? statusPill(r.status, 'red') : r.status === 'Handled' ? statusPill(r.status, 'green') : statusPill(r.status)}</td><td className="py-3"><select value={r.status} onChange={e => setReplies(prev => prev.map(x => x.id === r.id ? { ...x, status: e.target.value as ReplyItem['status'] } : x))} className="h-8 rounded-lg border border-white/10 bg-[#10080d] px-2 text-[9px] text-white"><option>New reply</option><option>In progress</option><option>Handled</option></select></td></tr>)}</tbody></table></div>
          <p className="mt-3 text-[9px] text-rose-100/35">When connected: new replies are added to a separate Reply Leads sheet and removed from follow-up queues immediately.</p>
        </Panel>
      </div> : null}

      {section === 'Templates' ? <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <Panel>
          <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Saved email templates</h3><p className="mt-1 text-[10px] text-rose-100/40">Reusable messages for campaigns and follow-ups.</p></div><ActionButton className="min-h-9 px-3" onClick={() => setShowTemplateForm(v => !v)}><Plus className="h-3.5 w-3.5" /> New template</ActionButton></div>
          <div className="mt-4 space-y-3">{templates.map(t => <div key={t.id} className="rounded-xl border border-white/[.07] bg-black/15 p-4"><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="text-[11px] font-semibold">{t.name}</div><div className="mt-1 text-[9px] text-amber-100/50">{t.purpose}</div></div><ActionButton kind="secondary" className="min-h-8 px-3 py-1 text-[9px]" onClick={() => { setComposeSubject(t.subject); setComposeBody(t.body); move('Compose'); }}>Use in Compose</ActionButton></div><p className="mt-3 text-[10px] text-rose-100/70">{t.subject}</p><p className="mt-2 line-clamp-3 whitespace-pre-line text-[9px] leading-5 text-rose-100/35">{t.body}</p></div>)}</div>
        </Panel>
        <Panel>
          {showTemplateForm ? <><h3 className="text-sm font-semibold">Create a template</h3><div className="mt-4 space-y-3"><Field label="Template name" value={templateName} onChange={setTemplateName} placeholder="e.g. Visa document checklist" /><Field label="Email subject" value={templateSubject} onChange={setTemplateSubject} placeholder="Write the subject" /><div><Label>Email body</Label><textarea value={templateBody} onChange={e => setTemplateBody(e.target.value)} rows={9} className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white outline-none focus:border-amber-200/35" placeholder="Write the template..." /></div><div className="flex gap-2"><ActionButton onClick={saveTemplate}>Save template</ActionButton><ActionButton kind="secondary" onClick={() => setShowTemplateForm(false)}>Cancel</ActionButton></div></div></> : <><h3 className="text-sm font-semibold">Personalize with fields</h3><p className="mt-1 text-[10px] text-rose-100/40">When connected, these placeholders are filled from each contact row.</p><div className="mt-4 flex flex-wrap gap-2">{['{{first_name}}','{{full_name}}','{{email}}','{{country}}','{{service}}','{{consultant_name}}'].map(x => <button type="button" key={x} onClick={() => setTemplateBody(prev => prev + x)} className="rounded-lg border border-white/10 bg-black/15 px-2.5 py-2 font-mono text-[9px] text-amber-100/75 hover:border-amber-200/25">{x} <Copy className="ml-1 inline h-3 w-3" /></button>)}</div><div className="mt-5 rounded-xl border border-amber-200/15 bg-amber-200/[.04] p-4 text-[9px] leading-5 text-amber-100/65">Tip: Keep follow-up messages short, useful and personal. Always include a clear way to opt out of further messages where required.</div></>}
        </Panel>
      </div> : null}

      {section === 'Senders' ? <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Business sender identities</h3><p className="mt-1 text-[10px] text-rose-100/40">Choose which verified mailboxes are available to send from.</p></div>{statusPill(`${enabledSenders.length} enabled`, enabledSenders.length ? 'green' : 'red')}</div>
          <div className="mt-4 space-y-3">{senders.map(s => <div key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3.5"><span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-200/[.07] text-amber-200"><Mail className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold">{s.email}</span><span className="mt-1 block text-[9px] text-rose-100/35">{s.label} · Daily cap {s.dailyLimit}</span></span><button type="button" onClick={() => toggleSender(s.id)} className={cx('rounded-full px-3 py-1.5 text-[9px] font-bold', s.enabled ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-rose-100/45')}>{s.enabled ? 'Enabled' : 'Disabled'}</button></div>)}</div>
          <div className="mt-5"><Label>Rotation method</Label><select value={rotation} onChange={e => setRotation(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#10080d] px-3 text-xs text-white outline-none focus:border-amber-200/35"><option value="round-robin">Round robin · take turns evenly</option><option value="weighted">Weighted · use configured weights</option></select></div>
          <p className="mt-3 text-[9px] leading-5 text-rose-100/35">The live connector must authenticate each sender, check provider limits and rotate only among senders that are verified and healthy. This preview does not send mail.</p>
        </Panel>
        <Panel>
          <h3 className="text-sm font-semibold">Connect a sender</h3><p className="mt-1 text-[10px] text-rose-100/40">The next setup step will securely connect each business mailbox.</p>
          <div className="mt-4 space-y-3">{['Gmail / Google Workspace OAuth','SMTP mailbox connection','Sender verification and test email'].map((s,i) => <div key={s} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[.06] text-[9px] text-amber-100">{i+1}</span><span className="flex-1 text-[10px]">{s}</span>{statusPill('Not connected')}</div>)}</div>
          <div className="mt-4 rounded-xl border border-amber-200/15 bg-amber-200/[.04] p-4 text-[9px] leading-5 text-amber-100/65">Never paste mailbox passwords into this screen. OAuth or server-side encrypted credentials will be used for real sending.</div>
        </Panel>
      </div> : null}

      {section === 'AI Agent' ? <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-amber-200/[.06] px-3 py-1 text-[9px] text-amber-100"><Sparkles className="h-3 w-3" /> Gemini-ready workflow</div><h3 className="text-sm font-semibold">NextBorder AI Mail Assistant</h3><p className="mt-1 max-w-xl text-[10px] leading-5 text-rose-100/40">An assistant for spreadsheet maintenance, reply detection, contact labels and follow-up preparation. You remain in control of human replies.</p></div><button type="button" onClick={() => setAiEnabled(v => !v)} className={cx('rounded-full px-3.5 py-2 text-[9px] font-bold', aiEnabled ? 'bg-emerald-300/10 text-emerald-200' : 'bg-white/10 text-rose-100/50')}>{aiEnabled ? 'Agent enabled in preview' : 'Agent paused'}</button></div>
          <div className="mt-5 space-y-3">
            {[
              ['label-replies','Detect and label incoming replies','Put replied contacts in the separate Reply Leads sheet.'],
              ['update-sheets','Maintain contact sheets','Normalize columns, remove duplicates and preserve the original source sheet.'],
              ['gray-list','Create the 20-day Gray List','Move no-reply contacts after the configured period.'],
              ['prepare-followups','Prepare follow-up tasks','Check timing, template, opt-out and reply status before scheduling.'],
              ['draft-summaries','Summarize replies for you','Show a short summary and suggested next action. Never auto-reply.'],
            ].map(([id,title,detail]) => <label key={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3.5 hover:border-amber-200/20"><input type="checkbox" checked={aiActions.includes(id)} onChange={() => toggleAiAction(id)} className="mt-1 accent-amber-300" /><span><span className="block text-[10px] font-semibold">{title}</span><span className="mt-1 block text-[9px] leading-5 text-rose-100/40">{detail}</span></span></label>)}
          </div>
          <ActionButton className="mt-4" onClick={() => showToast('AI workflow preferences saved in this preview only.')}><Check className="h-3.5 w-3.5" /> Save AI settings</ActionButton>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <h3 className="text-sm font-semibold">AI provider</h3><div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[.07] bg-black/15 p-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-200/[.08] text-amber-200"><Sparkles className="h-5 w-5" /></span><span className="flex-1"><span className="block text-[10px] font-semibold">Google Gemini API</span><span className="mt-1 block text-[9px] text-rose-100/35">Ready to connect · API key not configured</span></span>{statusPill('Not connected')}</div>
            <p className="mt-3 text-[9px] leading-5 text-rose-100/40">The API key must be added as a private server-side environment variable. It must never be embedded in browser code or committed to GitHub.</p>
          </Panel>
          <Panel>
            <h3 className="text-sm font-semibold">Agent permissions</h3>
            <div className="mt-3 space-y-3">{[
              ['Read imported contacts','Allowed after sheet access is connected.'],
              ['Update reply / Gray List records','Allowed with an audit trail.'],
              ['Send follow-up messages','Only through your approved schedule and verified senders.'],
              ['Reply to a person automatically','Never. You handle replies manually.'],
            ].map(([title,desc],i) => <div key={title} className="flex items-start gap-2"><ShieldCheck className={cx('mt-0.5 h-3.5 w-3.5 shrink-0',i===3?'text-emerald-300':'text-amber-200')} /><span><span className="block text-[9px] font-semibold">{title}</span><span className="mt-1 block text-[9px] text-rose-100/35">{desc}</span></span></div>)}</div>
          </Panel>
        </div>
      </div> : null}

      {toast ? <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl border border-amber-200/20 bg-[#1d0d15]/95 px-4 py-3 text-[10px] text-amber-50 shadow-2xl backdrop-blur-xl"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />{toast}<button type="button" aria-label="Dismiss notification" onClick={() => setToast('')} className="ml-2 rounded p-1 hover:bg-white/10"><X className="h-3.5 w-3.5" /></button></div> : null}
    </div>
  );
}
