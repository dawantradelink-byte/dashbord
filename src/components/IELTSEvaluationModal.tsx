import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mail, 
  CheckCircle2, 
  FileText, 
  Mic, 
  Headphones, 
  BookOpen, 
  PenTool, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Award,
  Calendar,
  Phone,
  User,
  Share2,
  Clock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, IELTSScoreBreakdown, LeadStatus } from '../types';
import { NextBorderLogo } from './NextBorderLogo';
import { calculateIELTSOverall, getIELTSCefr } from '../utils/ieltsAudit';

interface IELTSEvaluationModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveEvaluation: (leadId: string, breakdown: IELTSScoreBreakdown, newStatus: LeadStatus) => void;
  language: 'en' | 'bn';
}

export const IELTSEvaluationModal: React.FC<IELTSEvaluationModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveEvaluation
}) => {
  if (!isOpen || !lead) return null;

  const defaultScores = lead.ieltsData?.scores || {
    listening: 7.0,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0,
    overall: 7.0,
    cefrLevel: 'C1 Advanced (Effective Operational)',
    examinerNotes: 'Good logical organization in writing. Speaking was spontaneous with clear pronunciation. Focus on varying sentence clauses to reach Band 8.0.'
  };

  const [listening, setListening] = useState<number>(defaultScores.listening);
  const [reading, setReading] = useState<number>(defaultScores.reading);
  const [writing, setWriting] = useState<number>(defaultScores.writing);
  const [speaking, setSpeaking] = useState<number>(defaultScores.speaking);
  const [notes, setNotes] = useState<string>(defaultScores.examinerNotes);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status || 'Pending Evaluation');
  
  // Explicit confirmation state for result transmission
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    channel: 'WhatsApp' | 'Email';
    draftOpened: boolean;
  } | null>(null);

  const currentOverall = calculateOverall(listening, reading, writing, speaking);

  function calculateOverall(l: number, r: number, w: number, s: number): number {
    return calculateIELTSOverall(l, r, w, s);
  }

  const getCEFR = (band: number): string => {
    return getIELTSCefr(band);
  };

  // Generate official WhatsApp formatted text
  const generateWhatsAppMessage = (): string => {
    return encodeURIComponent(
      `*Next Border Visa Consultancy - IELTS Diagnostic Mock Result*\n\n` +
      `Hello ${lead.name},\n` +
      `Your IELTS Mock Test submitted on ${lead.date} has been manually evaluated by Ishak Dawan (Senior Examiner).\n\n` +
      `🎯 *YOUR EVALUATED BAND SCORES:*\n` +
      `🎧 Listening: *${listening.toFixed(1)}*\n` +
      `📖 Reading: *${reading.toFixed(1)}*\n` +
      `✍️ Writing: *${writing.toFixed(1)}*\n` +
      `🗣️ Speaking: *${speaking.toFixed(1)}*\n` +
      `🏆 *OVERALL BAND: ${currentOverall.toFixed(1)}* (${getCEFR(currentOverall)})\n\n` +
      `📝 *Examiner Feedback & Next Steps:*\n"${notes}"\n\n` +
      `Target Country: ${lead.ieltsData?.targetCountry || 'Abroad'}\n` +
      `To schedule your one-on-one study visa profile evaluation, reply to this message.\n\n` +
      `Best regards,\n` +
      `*Ishak Dawan*\n` +
      `Next Border Visa Consultancy`
    );
  };

  const handleLaunchWhatsApp = () => {
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const msg = generateWhatsAppMessage();
    const url = `https://wa.me/${cleanPhone}?text=${msg}`;

    // Trigger WhatsApp safely avoiding iframe sandbox popup restrictions
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Prompt admin for explicit confirmation before changing status
    setPendingConfirmation({
      channel: 'WhatsApp',
      draftOpened: true
    });
  };

  const handleLaunchEmail = () => {
    const subject = encodeURIComponent(`Your IELTS Mock Test Evaluation Result - Next Border Consultancy`);
    const body = encodeURIComponent(
      `Dear ${lead.name},\n\n` +
      `Your IELTS Mock Test has been manually evaluated by Senior Examiner Ishak Dawan at Next Border Visa Consultancy.\n\n` +
      `Band Score Breakdown:\n` +
      `-----------------------------------------\n` +
      `Listening: ${listening.toFixed(1)}\n` +
      `Reading:   ${reading.toFixed(1)}\n` +
      `Writing:   ${writing.toFixed(1)}\n` +
      `Speaking:  ${speaking.toFixed(1)}\n` +
      `OVERALL BAND SCORE: ${currentOverall.toFixed(1)} (${getCEFR(currentOverall)})\n` +
      `-----------------------------------------\n\n` +
      `Examiner Feedback & Recommendation:\n${notes}\n\n` +
      `Target Country: ${lead.ieltsData?.targetCountry || 'Abroad'}\n\n` +
      `Next Steps:\nWe invite you for a complimentary university admissions and visa counseling session.\n\n` +
      `Warm regards,\n` +
      `Ishak Dawan\n` +
      `Next Border Visa Consultancy`
    );

    const mailto = `mailto:${lead.email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;

    setPendingConfirmation({
      channel: 'Email',
      draftOpened: true
    });
  };

  const confirmResultSent = () => {
    const newStatus: LeadStatus = 'Result Sent';
    setCurrentStatus(newStatus);
    setPendingConfirmation(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    onSaveEvaluation(lead.id, {
      listening,
      reading,
      writing,
      speaking,
      overall: currentOverall,
      cefrLevel: getCEFR(currentOverall),
      examinerNotes: notes,
      evaluatedAt: new Date().toLocaleString(),
      evaluatedBy: 'Ishak Dawan (Senior Examiner)'
    }, newStatus);
  };

  const handleSaveOnly = () => {
    const targetStatus = currentStatus === 'Result Sent' ? 'Result Sent' : 'Evaluated';
    setCurrentStatus(targetStatus);

    onSaveEvaluation(lead.id, {
      listening,
      reading,
      writing,
      speaking,
      overall: currentOverall,
      cefrLevel: getCEFR(currentOverall),
      examinerNotes: notes,
      evaluatedAt: new Date().toLocaleString(),
      evaluatedBy: 'Ishak Dawan (Senior Examiner)'
    }, targetStatus);

    onClose();
  };

  const workflowSteps: LeadStatus[] = ['Submitted', 'Pending Evaluation', 'Evaluated', 'Ready to Send', 'Result Sent'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-panel rounded-3xl border border-rose-500/40 shadow-2xl p-5 md:p-6 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <NextBorderLogo size={46} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-bold text-white">IELTS Mock Test Evaluation Hub</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 border border-rose-500/30 font-medium">
                  {lead.ieltsData?.testType || 'Academic'}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/70 mt-0.5">
                Manual evaluation workflow: Review candidate answers, assign band scores, and send results.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full glass-panel hover:bg-rose-900/50 text-rose-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Progress Bar */}
        <div className="mt-3.5 p-3 rounded-2xl bg-black/40 border border-white/10">
          <div className="flex items-center justify-between text-[11px] font-semibold text-rose-300/80 mb-2">
            <span>Evaluation Workflow Stage:</span>
            <span className="text-white font-mono bg-rose-600/30 px-2 py-0.5 rounded border border-rose-500/30">
              {currentStatus}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {workflowSteps.map((step, idx) => {
              const currentIdx = workflowSteps.indexOf(currentStatus as LeadStatus);
              const isPastOrCurrent = currentIdx >= idx;
              const isCurrent = currentStatus === step;

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStatus(step)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold text-center transition-all truncate border ${
                    isCurrent
                      ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                      : isPastOrCurrent
                      ? 'bg-rose-950/60 text-rose-200 border-rose-500/30 hover:bg-rose-900/40'
                      : 'bg-black/30 text-rose-300/40 border-white/5 hover:text-rose-200'
                  }`}
                  title={`Set status to ${step}`}
                >
                  {idx + 1}. {step}
                </button>
              );
            })}
          </div>
        </div>

        {/* Candidate Profile Strip */}
        <div className="my-3.5 p-3 rounded-2xl bg-rose-950/40 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
            />
            <div>
              <div className="text-[10px] text-rose-300/70">Student Name</div>
              <div className="text-xs font-bold text-white">{lead.name}</div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-rose-300/70 flex items-center gap-1">
              <Phone className="w-3 h-3" /> WhatsApp Contact
            </div>
            <div className="text-xs font-semibold text-rose-200 font-mono mt-0.5">{lead.phone}</div>
          </div>

          <div>
            <div className="text-[10px] text-rose-300/70 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email Address
            </div>
            <div className="text-xs font-semibold text-rose-200 truncate mt-0.5">{lead.email}</div>
          </div>

          <div>
            <div className="text-[10px] text-rose-300/70">Target Country & Band</div>
            <div className="text-xs font-bold text-amber-300 mt-0.5">
              {lead.ieltsData?.targetCountry || 'Canada'} · Band {lead.ieltsData?.targetBand || 7.5}
            </div>
          </div>
        </div>

        {/* Two-Column Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Student Submitted Work */}
          <div className="lg:col-span-7 space-y-3">
            
            {/* Writing Task Section */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-rose-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-200">
                    Writing Task Submission
                  </h4>
                </div>
                {lead.ieltsData?.writingWordCount && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {lead.ieltsData.writingWordCount} Words
                  </span>
                )}
              </div>

              {lead.ieltsData?.writingPrompt && (
                <div className="text-[11px] text-rose-200/80 italic p-2 rounded-lg bg-rose-950/30 border border-white/5 mb-2">
                  <strong>Prompt:</strong> {lead.ieltsData.writingPrompt}
                </div>
              )}

              <div className="text-xs text-white/90 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-line p-2.5 rounded-xl bg-black/40 border border-white/5">
                {lead.ieltsData?.writingSubmission || lead.message}
              </div>
            </div>

            {/* Speaking Test Section */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
              <div className="flex items-center gap-2 mb-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                  Speaking Test Audio & Topic
                </h4>
              </div>

              <div className="text-xs text-rose-200/90 mb-2">
                <strong>Cue Card:</strong> {lead.ieltsData?.speakingTopic || 'Part 2 Cue Card Discussion'}
              </div>

              {/* Simulated Audio Player */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-rose-950/30 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shrink-0 cursor-pointer hover:bg-rose-500 shadow-md text-xs">
                  ▶
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[10px] text-rose-300/80 mb-0.5">
                    <span>Candidate_Speaking_Part2.mp3</span>
                    <span className="font-mono">03:42</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-2/3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reading & Listening Raw Scores */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-sky-400 shrink-0" />
                <div>
                  <div className="text-[9px] text-rose-300/70 uppercase">Raw Listening</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {lead.ieltsData?.rawListeningScore || 34} / 40 Correct
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[9px] text-rose-300/70 uppercase">Raw Reading</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {lead.ieltsData?.rawReadingScore || 33} / 40 Correct
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Band Score Calculator & Actions */}
          <div className="lg:col-span-5 space-y-3">
            
            {/* Scorecard Widget */}
            <div className="p-4 rounded-2xl glass-card-glow border border-rose-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wider">
                  Band Score Evaluator
                </span>
                <span className="text-xs font-mono text-amber-300 font-bold">
                  {getCEFR(currentOverall)}
                </span>
              </div>

              {/* 4 Skills Sliders */}
              <div className="space-y-2.5">
                {[
                  { label: 'Listening', value: listening, set: setListening, icon: Headphones, color: 'text-sky-400' },
                  { label: 'Reading', value: reading, set: setReading, icon: BookOpen, color: 'text-emerald-400' },
                  { label: 'Writing', value: writing, set: setWriting, icon: PenTool, color: 'text-rose-400' },
                  { label: 'Speaking', value: speaking, set: setSpeaking, icon: Mic, color: 'text-amber-400' }
                ].map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.label} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 text-rose-200">
                          <Icon className={`w-3 h-3 ${skill.color}`} />
                          {skill.label}
                        </span>
                        <span className="font-bold text-white font-mono text-xs tabular-nums">
                          {skill.value.toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="3.0"
                        max="9.0"
                        step="0.5"
                        value={skill.value}
                        onChange={(e) => skill.set(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer h-1.5"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Overall Band Big Box */}
              <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-rose-900/60 to-black/80 border border-rose-400/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                    Overall Band Score
                  </div>
                  <div className="text-[10px] text-rose-200/70">
                    Official Half-Band Scale
                  </div>
                </div>

                <div className="text-3xl font-extrabold text-white tracking-tight font-mono text-amber-300 drop-shadow-md">
                  {currentOverall.toFixed(1)}
                </div>
              </div>
            </div>

            {/* Examiner Remarks */}
            <div className="p-3 rounded-2xl bg-black/30 border border-white/10 space-y-1">
              <label className="text-[11px] font-semibold text-rose-200 flex items-center justify-between">
                <span>Examiner Feedback:</span>
                <span className="text-[9px] text-rose-300/60">Sent via WhatsApp/Email</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2 text-xs rounded-xl glass-input text-white focus:outline-none resize-none"
                placeholder="Write personalized advice..."
              />
            </div>

            {/* Confirmation Box (Mandated by Section 6: Do not mark sent falsely) */}
            {pendingConfirmation && (
              <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pendingConfirmation.channel} Draft Opened</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-snug">
                  Did you transmit the result to <strong>{lead.name}</strong>? Confirm only after you have delivered the score.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={confirmResultSent}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm: Result Sent</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentStatus('Ready to Send');
                      setPendingConfirmation(null);
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 text-[11px]"
                  >
                    Keep as Ready to Send
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons: 1-Click WhatsApp & Email Dispatch */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-bold text-xs shadow-lg shadow-green-900/40 transition-all hover:scale-105"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchEmail}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all hover:scale-105"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Email</span>
              </button>
            </div>

            {/* Save Scores & Status Button */}
            <button
              type="button"
              onClick={handleSaveOnly}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Save Evaluation & Close</span>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
