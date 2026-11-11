import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CheckCircle2, ChevronRight,
  CircleHelp, Clock3, Contact, Filter, Inbox, Mail, MoreHorizontal, Plus,
  Search, Send, ShieldCheck, Sparkles, Users, Workflow, Zap
} from 'lucide-react';

type Section = 'Overview' | 'Campaigns' | 'Contacts' | 'Inbox' | 'Sender identities' | 'Follow-ups' | 'Reports';

const sections: { id: Section; en: string; bn: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Overview', en: 'Overview', bn: 'ওভারভিউ', icon: Activity },
  { id: 'Campaigns', en: 'Campaigns', bn: 'ক্যাম্পেইন', icon: Send },
  { id: 'Contacts', en: 'Contacts', bn: 'কন্টাক্ট', icon: Users },
  { id: 'Inbox', en: 'Reply inbox', bn: 'রিপ্লাই ইনবক্স', icon: Inbox },
  { id: 'Sender identities', en: 'Sender identities', bn: 'প্রেরকের পরিচয়', icon: Mail },
  { id: 'Follow-ups', en: 'Follow-up flows', bn: 'ফলো-আপ', icon: Workflow },
  { id: 'Reports', en: 'Reports & activity', bn: 'রিপোর্ট ও কার্যক্রম', icon: Activity },
];

const campaigns = [
  { name: 'USA Fall Intake 2027', audience: 'Prospective students', sent: '4,280', rate: '46.2%', status: 'Sample · completed', date: 'Sample entry' },
  { name: 'Europe Scholarship Update', audience: 'Scholarship leads', sent: '2,140', rate: '39.8%', status: 'Sample · draft', date: 'Sample entry' },
  { name: 'IELTS Free Practice Launch', audience: 'Student community', sent: '1,860', rate: '51.4%', status: 'Sample · scheduled', date: 'Sample entry' },
];

const activities = [
  { title: 'Campaign workspace prepared', detail: 'Campaign drafts and audience tools are ready for configuration.', time: 'Preview event', icon: CheckCircle2 },
  { title: 'Reply inbox module prepared', detail: 'Mailbox connection is not configured yet.', time: 'Preview event', icon: Inbox },
  { title: 'Follow-up workflow prepared', detail: 'Automation remains disabled until reviewed and connected.', time: 'Preview event', icon: Workflow },
];

const descriptions: Record<Section, { en: string; bn: string }> = {
  Overview: { en: 'A clear view of your email operations and setup status.', bn: 'আপনার ইমেইল ব্যবস্থাপনা ও সেটআপের সারসংক্ষেপ।' },
  Campaigns: { en: 'Prepare and review campaigns. Sending is not connected in this preview.', bn: 'ক্যাম্পেইন তৈরি ও পর্যালোচনা করুন। এই প্রিভিউতে ইমেইল পাঠানো চালু নেই।' },
  Contacts: { en: 'Organize audiences and prepare safe contact imports.', bn: 'কন্টাক্ট সাজান এবং নিরাপদ ইমপোর্টের প্রস্তুতি নিন।' },
  Inbox: { en: 'A central place for replies after a mailbox is connected.', bn: 'মেইলবক্স যুক্ত হলে সব রিপ্লাই এখানে দেখা যাবে।' },
  'Sender identities': { en: 'Review approved sender addresses and authentication setup.', bn: 'অনুমোদিত প্রেরক ঠিকানা ও অথেনটিকেশন সেটআপ দেখুন।' },
  'Follow-ups': { en: 'Plan respectful follow-up sequences with reply and opt-out safeguards.', bn: 'রিপ্লাই ও অপ্ট-আউট সুরক্ষাসহ ফলো-আপ পরিকল্পনা করুন।' },
  Reports: { en: 'Review delivery, engagement and reply reporting when connected.', bn: 'সংযোগ চালু হলে ডেলিভারি, এনগেজমেন্ট ও রিপ্লাই রিপোর্ট দেখুন।' },
};

export function EmailCenterView({ language }: { language: 'en' | 'bn' }) {
  const [section, setSection] = useState<Section>('Overview');
  const [search, setSearch] = useState('');
  const isBn = language === 'bn';
  const filteredCampaigns = useMemo(() => campaigns.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.audience.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  const openSection = (next: Section) => setSection(next);

  return (
    <section className="space-y-5 text-white">
      <div className="rounded-3xl border border-rose-300/15 bg-gradient-to-br from-[#260d16]/95 via-[#160a12]/95 to-[#21120e]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:p-7">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.18em] text-amber-200">
              <Sparkles className="h-3 w-3" /> NextBorder · Mail operations
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {isBn ? 'Email Center' : 'Email Center'}<span className="text-amber-300">.</span>
            </h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-rose-100/65">
              {isBn
                ? 'ক্যাম্পেইন, কন্টাক্ট, রিপ্লাই এবং ফলো-আপ এক জায়গায় পরিচালনার জন্য আপনার কেন্দ্রীয় কর্মক্ষেত্র।'
                : 'One workspace for campaigns, contacts, replies and follow-ups across NextBorder.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => openSection('Campaigns')} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 px-4 text-[11px] font-semibold text-white shadow-lg shadow-rose-950/40 transition hover:-translate-y-0.5 hover:brightness-110">
              <Plus className="h-4 w-4" /> {isBn ? 'ক্যাম্পেইন দেখুন' : 'New campaign'}
            </button>
            <button type="button" onClick={() => openSection('Contacts')} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/[.04] px-4 text-[11px] font-semibold text-rose-100/80 transition hover:border-amber-300/35 hover:bg-white/[.08]">
              <Contact className="h-4 w-4" /> {isBn ? 'কন্টাক্ট দেখুন' : 'Manage contacts'}
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {sections.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button key={item.id} type="button" onClick={() => openSection(item.id)} className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-[10px] font-semibold transition ${active ? 'border border-amber-300/35 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-950/20' : 'border border-white/10 bg-black/15 text-rose-100/65 hover:border-white/20 hover:text-white'}`}>
                <Icon className="h-3.5 w-3.5" /> {isBn ? item.bn : item.en}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[.07] px-4 py-3 text-[10px] leading-5 text-amber-100/80">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <span>
            <strong className="font-semibold text-amber-100">{isBn ? 'প্রিভিউ মোড:' : 'Preview mode:'}</strong>{' '}
            {isBn
              ? 'এখানে নমুনা তথ্য দেখানো হচ্ছে। Gmail/SMTP সংযোগ, কন্টাক্ট ইমপোর্ট এবং বাস্তব ইমেইল পাঠানো এখনো চালু করা হয়নি।'
              : 'Figures below are sample data. Gmail/SMTP connection, contact import and real email sending are not enabled yet.'}
          </span>
        </div>
      </div>

      {section === 'Overview' ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              { label: 'Campaign drafts', value: '03', delta: 'Sample', icon: Send },
              { label: 'Contacts', value: '—', delta: 'Not connected', icon: Users },
              { label: 'Reply inbox', value: '—', delta: 'Not connected', icon: Inbox },
              { label: 'Automations', value: '02', delta: 'Prepared only', icon: Workflow },
            ].map((card) => {
              const Icon = card.icon;
              return <div key={card.label} className="rounded-2xl border border-white/10 bg-black/25 p-5 shadow-lg shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-amber-300/25">
                <div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-rose-100/55">{isBn ? card.label : card.label}</span><span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-200/10 text-amber-200"><Icon className="h-4 w-4" /></span></div>
                <div className="mt-4 flex items-end justify-between"><span className="text-3xl font-semibold tracking-tight text-white">{card.value}</span><span className="mb-1 text-[9px] font-semibold text-amber-200/70">{card.delta}</span></div>
              </div>;
            })}
          </div>
          <div className="grid grid-cols-1 gap-5 2xl:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-white">{isBn ? 'সাম্প্রতিক ক্যাম্পেইন' : 'Campaign workspace'}</h3><p className="mt-1 text-[10px] text-rose-100/45">{isBn ? 'নমুনা তথ্য' : 'Illustrative entries only'}</p></div><button type="button" onClick={() => openSection('Campaigns')} className="text-[10px] font-semibold text-amber-200 hover:text-white">{isBn ? 'সব দেখুন' : 'View all'} <ChevronRight className="inline h-3 w-3" /></button></div>
              <div className="mt-5 space-y-3">
                {campaigns.map((item) => <div key={item.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-4">
                  <div><div className="text-[11px] font-semibold text-rose-50">{item.name}</div><div className="mt-1 text-[9px] text-rose-100/45">{item.audience}</div></div>
                  <span className="rounded-full border border-amber-200/15 bg-amber-200/[.07] px-2.5 py-1 text-[9px] text-amber-100/75">{item.status}</span>
                </div>)}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold text-white">{isBn ? 'দ্রুত প্রবেশ' : 'Quick access'}</h3><p className="mt-1 text-[10px] text-rose-100/45">{isBn ? 'ওয়ার্কস্পেস খুলুন' : 'Open a workspace'}</p></div><Zap className="h-4 w-4 text-amber-200" /></div>
              <div className="mt-4 space-y-2">
                {[
                  { label: 'Campaigns', detail: 'Prepare email drafts', icon: Send, target: 'Campaigns' as Section },
                  { label: 'Contacts', detail: 'Review audience tools', icon: Users, target: 'Contacts' as Section },
                  { label: 'Reply inbox', detail: 'Mailbox setup pending', icon: Inbox, target: 'Inbox' as Section },
                  { label: 'Follow-ups', detail: 'Automation setup pending', icon: Workflow, target: 'Follow-ups' as Section },
                ].map((item) => {
                  const Icon = item.icon;
                  return <button type="button" key={item.label} onClick={() => openSection(item.target)} className="flex w-full items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-white/10 hover:bg-white/[.04]">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-200/[.08] text-amber-200"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[11px] font-semibold text-rose-50">{item.label}</span><span className="mt-0.5 block text-[9px] text-rose-100/45">{item.detail}</span></span>
                    <ChevronRight className="h-4 w-4 text-rose-100/35" />
                  </button>;
                })}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between"><div><h3 className="text-sm font-semibold text-white">{isBn ? 'সিস্টেম প্রস্তুতি' : 'Workspace readiness'}</h3><p className="mt-1 text-[10px] text-rose-100/45">{isBn ? 'সংযোগের অবস্থা' : 'Connection status'}</p></div><ShieldCheck className="h-4 w-4 text-emerald-300" /></div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['Admin access', 'Connected', 'Access is inherited from the secure dashboard session.'],
                ['Email provider', 'Not connected', 'No Gmail or SMTP account is linked yet.'],
                ['Sending controls', 'Disabled', 'No campaign can be sent from this preview.'],
              ].map(([title, status, detail]) => <div key={title} className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><div className="text-[10px] font-semibold text-rose-50">{title}</div><div className={`mt-2 text-[10px] font-bold ${status === 'Connected' ? 'text-emerald-300' : 'text-amber-200'}`}>{status}</div><p className="mt-1.5 text-[9px] leading-5 text-rose-100/45">{detail}</p></div>)}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><div className="mb-2 text-[9px] font-bold uppercase tracking-[.18em] text-amber-200/70">Email workspace</div><h3 className="text-xl font-semibold tracking-tight text-white">{isBn ? sections.find((item) => item.id === section)?.bn : section}</h3><p className="mt-1 max-w-xl text-[11px] leading-5 text-rose-100/55">{isBn ? descriptions[section].bn : descriptions[section].en}</p></div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-200/[.07] px-3 py-1.5 text-[9px] font-semibold text-amber-100/75"><Clock3 className="h-3 w-3" /> {isBn ? 'সেটআপ পর্যায়' : 'Setup phase'}</span>
          </div>
          {section === 'Campaigns' ? (
            <>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-100/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={isBn ? 'ক্যাম্পেইন খুঁজুন...' : 'Search campaigns...'} className="h-10 w-full rounded-xl border border-white/10 bg-white/[.04] pl-10 pr-3 text-xs text-white outline-none placeholder:text-rose-100/30 focus:border-amber-200/35" /></div><button type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-[10px] font-semibold text-rose-100/70"><Filter className="h-3.5 w-3.5" /> {isBn ? 'ফিল্টার' : 'Filters'}</button></div>
              <div className="mt-5 space-y-3">{filteredCampaigns.map((item) => <div key={item.name} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[.07] bg-white/[.025] p-4"><div><div className="text-[11px] font-semibold text-rose-50">{item.name}</div><div className="mt-1 text-[9px] text-rose-100/45">{item.audience} · {item.date}</div></div><div className="flex items-center gap-5 text-[10px] text-rose-100/65"><span>{item.sent} sample</span><span>{item.rate} sample</span><span className="rounded-full border border-amber-200/15 bg-amber-200/[.07] px-2.5 py-1 text-amber-100/75">{item.status}</span></div></div>)}</div>
            </>
          ) : (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-dashed border-amber-200/20 bg-amber-200/[.035] p-5"><div className="grid h-9 w-9 place-items-center rounded-xl border border-amber-200/15 bg-amber-200/[.08] text-amber-200"><Sparkles className="h-4 w-4" /></div><div className="mt-3 text-[11px] font-semibold text-rose-50">{isBn ? 'মডিউল প্রস্তুত' : 'Workspace module prepared'}</div><p className="mt-1 text-[10px] leading-5 text-rose-100/50">{isBn ? 'ডেটা মডেল ও নিরাপত্তা যাচাইয়ের পর বাস্তব তথ্য ও কার্যক্রম যুক্ত করা হবে।' : 'Real records and actions will be connected after the data model and safety checks are approved.'}</p></div>
              <div className="rounded-xl border border-white/[.07] bg-white/[.025] p-5"><div className="grid h-9 w-9 place-items-center rounded-xl border border-emerald-200/15 bg-emerald-200/[.08] text-emerald-200"><ShieldCheck className="h-4 w-4" /></div><div className="mt-3 text-[11px] font-semibold text-rose-50">{isBn ? 'অ্যাডমিন সুরক্ষা সক্রিয়' : 'Protected by admin access'}</div><p className="mt-1 text-[10px] leading-5 text-rose-100/50">{isBn ? 'এই প্যানেল বিদ্যমান নিরাপদ অ্যাডমিন সেশনের ভেতরেই কাজ করে।' : 'This panel runs inside the existing secure administrator session.'}</p></div>
            </div>
          )}
        </div>
      )}
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-[9px] text-rose-100/35"><span>© NextBorder · Private email operations</span><span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Protected workspace</span></footer>
    </section>
  );
}
