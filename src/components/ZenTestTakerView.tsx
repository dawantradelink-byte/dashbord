import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  BookOpen, 
  PenTool, 
  Mic, 
  CheckCircle2, 
  Shield, 
  Volume2, 
  VolumeX,
  Phone,
  Mail,
  User,
  Compass,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead } from '../types';
import { waterAudio } from './WaterAudio';
import { NextBorderLogo } from './NextBorderLogo';

interface ZenTestTakerViewProps {
  onTestSubmitted: (newLead: Lead) => void;
  onExitToAdmin: () => void;
  language: 'en' | 'bn';
}

export const ZenTestTakerView: React.FC<ZenTestTakerViewProps> = ({
  onTestSubmitted,
  onExitToAdmin,
  language
}) => {
  const [activeModule, setActiveModule] = useState<'writing' | 'speaking' | 'full'>('writing');
  const [candidateName, setCandidateName] = useState('');
  const [whatsapp, setWhatsapp] = useState('+8801');
  const [email, setEmail] = useState('');
  const [targetCountry, setTargetCountry] = useState('Canada');
  const [essayText, setEssayText] = useState('');
  const [speakingNotes, setSpeakingNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 min timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Focus timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleAudio = () => {
    const active = waterAudio.toggle();
    setIsAudioActive(active);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !whatsapp.trim() || !email.trim()) return;

    const newLead: Lead = {
      id: Date.now().toString(),
      name: candidateName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      type: 'IELTS Mock Test',
      source: 'Website',
      phone: whatsapp,
      email,
      message: `Completed IELTS ${activeModule === 'writing' ? 'Writing Task 2' : 'Full Mock Test'}. Word count: ${wordCount}. Requesting evaluation.`,
      date: 'Just now',
      status: 'New',
      unread: true,
      ieltsData: {
        testType: 'Academic',
        targetCountry,
        targetBand: 7.5,
        writingPrompt: 'Some people believe that university education should be free for everyone, regardless of their financial background. To what extent do you agree or disagree?',
        writingSubmission: essayText,
        writingWordCount: wordCount,
        speakingTopic: activeModule === 'speaking' ? 'Part 2 Cue Card: Describe an experience that made you proud of your achievements.' : undefined,
        speakingNotes,
        rawListeningScore: 33,
        rawReadingScore: 32
      }
    };

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });

    onTestSubmitted(newLead);
    setSubmitted(true);
  };

  return (
    <div className="relative z-20 min-h-screen flex flex-col justify-between p-6 md:p-10 select-none">
      
      {/* Top Zen Bar: Discreet Branding & Minimalist Controls */}
      <div className="flex items-center justify-between glass-panel px-6 py-3 rounded-2xl border border-white/10 shadow-xl max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <NextBorderLogo size={42} />
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">NEXT BORDER IELTS SANCTUARY</h2>
            <p className="text-[10px] text-rose-300/70 tracking-widest uppercase">Zen Distraction-Free Test Chamber</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`p-2 rounded-full border transition-all ${
              isAudioActive
                ? 'bg-rose-600/40 border-rose-400/50 text-white'
                : 'bg-white/5 border-white/10 text-rose-200 hover:text-white'
            }`}
            title="Relaxing Water Ambience"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Discreet Examiner Switch (User Requirement: subtle toggle menu) */}
          <button
            onClick={onExitToAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-white/15 text-xs text-rose-200 hover:text-white transition-all shadow-sm"
            title="Switch back to Admin Evaluation Console"
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Admin Console</span>
          </button>
        </div>
      </div>

      {/* Main Test Chamber */}
      <div className="max-w-4xl mx-auto w-full my-8">
        {!submitted ? (
          <div className="glass-panel rounded-3xl p-6 md:p-9 border border-rose-500/30 shadow-2xl space-y-6">
            
            {/* Module Picker & Timer Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveModule('writing')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeModule === 'writing' ? 'bg-rose-600 text-white' : 'text-rose-200/70 hover:text-white'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Writing Task 2</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModule('speaking')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeModule === 'speaking' ? 'bg-rose-600 text-white' : 'text-rose-200/70 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Speaking Practice</span>
                </button>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 text-rose-200 font-mono text-sm">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>{formatTimer(timeLeft)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-400/30 transition-colors"
                >
                  {isTimerRunning ? 'Pause' : 'Start Timer'}
                </button>
              </div>
            </div>

            {/* Prompt Card */}
            <div className="p-4.5 rounded-2xl bg-black/40 border border-rose-500/20">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                Official IELTS Academic Question
              </div>
              <p className="text-sm text-white/95 leading-relaxed font-medium">
                "Some people believe that university education should be free for everyone, regardless of their financial background. To what extent do you agree or disagree?"
              </p>
              <div className="text-[11px] text-rose-300/70 mt-2">
                Write at least 250 words. Give reasons for your answer and include relevant examples.
              </div>
            </div>

            {/* Essay Input with Word Counter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="text-rose-200 font-medium">Your Essay Response:</label>
                <span className={`font-mono font-semibold ${wordCount >= 250 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {wordCount} / 250 words {wordCount >= 250 ? '✓' : ''}
                </span>
              </div>
              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                rows={10}
                placeholder="Type your essay smoothly here... Watch the peaceful koi swim beneath as you compose your thoughts."
                className="w-full p-4 text-sm rounded-2xl glass-input text-white leading-relaxed resize-none focus:outline-none"
              />
            </div>

            {/* Candidate WhatsApp & Email Submission form */}
            <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-rose-950/40 border border-white/10 space-y-4">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Provide your WhatsApp & Email to receive your evaluated result:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-rose-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-rose-300 block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-rose-300 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-rose-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ishak Dawan will personally evaluate your score & feedback.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit IELTS Mock Test</span>
                </button>
              </div>
            </form>

          </div>
        ) : (
          /* Submission Confirmation Card */
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-rose-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/80 flex items-center justify-center mx-auto text-emerald-300 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              Mock Test Successfully Submitted!
            </h3>

            <p className="text-sm text-rose-200/90 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{candidateName}</strong>. Your mock submission is now in Ishak Dawan's evaluation queue. You will receive your official IELTS Band Score breakdown and personalized examiner feedback directly on WhatsApp (<span className="font-mono text-white">{whatsapp}</span>) and Email (<span className="text-white">{email}</span>).
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEssayText('');
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-rose-200 transition-colors"
              >
                Submit Another Test
              </button>

              <button
                onClick={onExitToAdmin}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-900/40 transition-all flex items-center gap-1.5"
              >
                <span>Open Admin Evaluator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Zen Quote */}
      <div className="text-center text-xs text-rose-300/50 max-w-md mx-auto">
        "Like the serene koi navigating gentle waters, practice brings mastery and peace to the mind."
      </div>
    </div>
  );
};
