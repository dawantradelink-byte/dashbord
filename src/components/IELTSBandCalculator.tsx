import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Award, 
  Sparkles, 
  Info, 
  ChevronDown, 
  RotateCcw,
  Check,
  ShieldCheck,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { 
  convertListeningRawToBand,
  convertAcademicReadingRawToBand,
  convertGeneralReadingRawToBand,
  calculateIELTSOverall,
  getIELTSCefr,
  getRawScoreBandDetail
} from '../utils/ieltsAudit';

export interface IELTSBandCalculatorProps {
  initialTestType?: 'Academic' | 'General Training';
  initialListeningRaw?: number;
  initialReadingRaw?: number;
  initialWritingBand?: number;
  initialSpeakingBand?: number;
  onApplyScores?: (scores: {
    listeningBand: number;
    readingBand: number;
    writingBand: number;
    speakingBand: number;
    overallBand: number;
    rawListening: number;
    rawReading: number;
    testType: 'Academic' | 'General Training';
  }) => void;
  language?: 'en' | 'bn';
}

export const IELTSBandCalculator: React.FC<IELTSBandCalculatorProps> = ({
  initialTestType = 'Academic',
  initialListeningRaw = 32,
  initialReadingRaw = 30,
  initialWritingBand = 6.5,
  initialSpeakingBand = 7.0,
  onApplyScores,
  language = 'en'
}) => {
  const [testType, setTestType] = useState<'Academic' | 'General Training'>(initialTestType);
  const [listeningRaw, setListeningRaw] = useState<number>(initialListeningRaw);
  const [readingRaw, setReadingRaw] = useState<number>(initialReadingRaw);
  const [writingBand, setWritingBand] = useState<number>(initialWritingBand);
  const [speakingBand, setSpeakingBand] = useState<number>(initialSpeakingBand);
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Real-time calculation for Listening
  const listeningDetail = useMemo(() => {
    return getRawScoreBandDetail(listeningRaw, 'listening');
  }, [listeningRaw]);

  // Real-time calculation for Reading (Academic or General)
  const readingDetail = useMemo(() => {
    return getRawScoreBandDetail(
      readingRaw,
      testType === 'Academic' ? 'academicReading' : 'generalReading'
    );
  }, [readingRaw, testType]);

  // Official Cambridge / British Council / IDP overall band calculation with rounding
  const overallBand = useMemo(() => {
    return calculateIELTSOverall(
      listeningDetail.band,
      readingDetail.band,
      writingBand,
      speakingBand
    );
  }, [listeningDetail.band, readingDetail.band, writingBand, speakingBand]);

  const cefrDescription = useMemo(() => {
    return getIELTSCefr(overallBand);
  }, [overallBand]);

  const handleApply = () => {
    if (onApplyScores) {
      onApplyScores({
        listeningBand: listeningDetail.band,
        readingBand: readingDetail.band,
        writingBand,
        speakingBand,
        overallBand,
        rawListening: listeningRaw,
        rawReading: readingRaw,
        testType
      });
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  const handlePreset = (targetBand: number) => {
    if (targetBand === 6.5) {
      setListeningRaw(27);
      setReadingRaw(testType === 'Academic' ? 28 : 32);
      setWritingBand(6.0);
      setSpeakingBand(6.5);
    } else if (targetBand === 7.0) {
      setListeningRaw(30);
      setReadingRaw(testType === 'Academic' ? 30 : 34);
      setWritingBand(6.5);
      setSpeakingBand(7.0);
    } else if (targetBand === 7.5) {
      setListeningRaw(33);
      setReadingRaw(testType === 'Academic' ? 33 : 36);
      setWritingBand(7.0);
      setSpeakingBand(7.5);
    } else if (targetBand === 8.0) {
      setListeningRaw(35);
      setReadingRaw(testType === 'Academic' ? 35 : 37);
      setWritingBand(7.5);
      setSpeakingBand(8.0);
    } else {
      setListeningRaw(20);
      setReadingRaw(20);
      setWritingBand(5.5);
      setSpeakingBand(5.5);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-rose-500/30 p-5 sm:p-6 text-white shadow-2xl space-y-6">
      
      {/* Top Banner & Module Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/60 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {language === 'en' ? 'Official IELTS Band Calculator' : 'অফিসিয়াল আইইএলটিএস ব্যান্ড ক্যালকুলেটর'}
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-medium">
                Official Standards
              </span>
            </div>
            <p className="text-xs text-rose-200/70 mt-0.5">
              {language === 'en'
                ? 'Converts raw scores (0–40) into official IELTS band scores with Cambridge / IDP rounding rules.'
                : 'কেমব্রিজ ও আইডিপি রাউন্ডিং নিয়ম অনুযায়ী র স্কোর (০–৪০) থেকে তাৎক্ষণিক ব্যান্ড স্কোর রূপান্তর।'}
            </p>
          </div>
        </div>

        {/* Test Type Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTestType('Academic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                testType === 'Academic'
                  ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              Academic
            </button>
            <button
              type="button"
              onClick={() => setTestType('General Training')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                testType === 'General Training'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              General Training
            </button>
          </div>
        </div>
      </div>

      {/* Target Presets & Reset Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-rose-200/80 font-medium">
            {language === 'en' ? 'Target Score Benchmarks:' : 'টার্গেট স্কোর বেঞ্চমার্ক:'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: 'Band 6.5', val: 6.5 },
            { label: 'Band 7.0', val: 7.0 },
            { label: 'Band 7.5', val: 7.5 },
            { label: 'Band 8.0', val: 8.0 },
            { label: 'Reset', val: 0 }
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset.val)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-white/10 text-rose-200 hover:text-white transition-all text-[11px] font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Raw Score Cards (Listening & Reading) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* LISTENING CARD */}
        <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-200">Listening Raw Score</h4>
                <p className="text-[10px] text-sky-300/60">40 Questions · Standard Scale</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 bg-sky-500/20 px-3 py-1 rounded-xl border border-sky-400/40">
              <span className="text-[10px] text-sky-300 uppercase font-semibold">Band</span>
              <span className="text-xl font-bold font-mono text-sky-300">
                {listeningDetail.band.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stepper + Slider Control */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-200/80">Correct Answers:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setListeningRaw((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95 transition-transform"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={listeningRaw}
                  onChange={(e) => setListeningRaw(Math.max(0, Math.min(40, parseInt(e.target.value) || 0)))}
                  className="w-12 text-center py-1 px-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono font-bold text-xs"
                />
                <button
                  type="button"
                  onClick={() => setListeningRaw((prev) => Math.min(40, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95 transition-transform"
                >
                  +
                </button>
                <span className="text-xs text-rose-300/60 font-mono">/ 40</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={listeningRaw}
              onChange={(e) => setListeningRaw(parseInt(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
          </div>

          {/* Bracket range & Gap to next band */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200/80">
            <span>
              Band {listeningDetail.band.toFixed(1)} Bracket: <strong>{listeningDetail.minRawForCurrentBand}–{listeningDetail.maxRawForCurrentBand}</strong>
            </span>
            {listeningDetail.nextBand ? (
              <span className="text-amber-300 font-medium">
                +{listeningDetail.neededForNextBand} for Band {listeningDetail.nextBand.toFixed(1)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Max Band 9.0 Achieved</span>
            )}
          </div>
        </div>

        {/* READING CARD */}
        <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Reading Raw Score ({testType === 'Academic' ? 'Academic' : 'General'})
                </h4>
                <p className="text-[10px] text-emerald-300/60">40 Questions · {testType} Scale</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 bg-emerald-500/20 px-3 py-1 rounded-xl border border-emerald-400/40">
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">Band</span>
              <span className="text-xl font-bold font-mono text-emerald-300">
                {readingDetail.band.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stepper + Slider Control */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-200/80">Correct Answers:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReadingRaw((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95 transition-transform"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={readingRaw}
                  onChange={(e) => setReadingRaw(Math.max(0, Math.min(40, parseInt(e.target.value) || 0)))}
                  className="w-12 text-center py-1 px-1 rounded-lg bg-black/60 border border-white/20 text-white font-mono font-bold text-xs"
                />
                <button
                  type="button"
                  onClick={() => setReadingRaw((prev) => Math.min(40, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95 transition-transform"
                >
                  +
                </button>
                <span className="text-xs text-rose-300/60 font-mono">/ 40</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={readingRaw}
              onChange={(e) => setReadingRaw(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
            />
          </div>

          {/* Bracket range & Gap to next band */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>
              Band {readingDetail.band.toFixed(1)} Bracket: <strong>{readingDetail.minRawForCurrentBand}–{readingDetail.maxRawForCurrentBand}</strong>
            </span>
            {readingDetail.nextBand ? (
              <span className="text-amber-300 font-medium">
                +{readingDetail.neededForNextBand} for Band {readingDetail.nextBand.toFixed(1)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Max Band 9.0 Achieved</span>
            )}
          </div>
        </div>

      </div>

      {/* Complete Overall Band Prediction with Writing & Speaking Sliders */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-950/70 via-black/80 to-black/90 border border-white/15 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                {language === 'en' ? 'Predicted Overall Band Score' : 'আনুমানিক সামগ্রিক ব্যান্ড স্কোর'}
              </h3>
              <p className="text-[10px] text-rose-300/70">
                Cambridge IDP Official Formula: Arithmetic average rounded to nearest half-band
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-amber-500/20 px-3.5 py-1.5 rounded-2xl border border-amber-400/40">
              <span className="text-xs text-amber-200/80 font-semibold">Overall:</span>
              <span className="text-2xl font-bold font-mono text-amber-300">
                {overallBand.toFixed(1)}
              </span>
            </div>
            <div className="text-[11px] px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-rose-200 font-medium">
              {cefrDescription}
            </div>
          </div>
        </div>

        {/* Sliders for Writing and Speaking Band Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-rose-200">
                <PenTool className="w-3.5 h-3.5 text-purple-400" />
                <span>Writing Band:</span>
              </div>
              <span className="font-bold font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-400/30">
                {writingBand.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={writingBand}
              onChange={(e) => setWritingBand(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-rose-200">
                <Mic className="w-3.5 h-3.5 text-amber-400" />
                <span>Speaking Band:</span>
              </div>
              <span className="font-bold font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                {speakingBand.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="0.5"
              value={speakingBand}
              onChange={(e) => setSpeakingBand(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Live Calculation Formula Strip */}
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-rose-200/90 flex-wrap">
            <span>({listeningDetail.band.toFixed(1)} + {readingDetail.band.toFixed(1)} + {writingBand.toFixed(1)} + {speakingBand.toFixed(1)}) / 4</span>
            <span>=</span>
            <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">
              {((listeningDetail.band + readingDetail.band + writingBand + speakingBand) / 4).toFixed(3)}
            </span>
            <span className="text-amber-300 font-bold">➔ Band {overallBand.toFixed(1)}</span>
          </div>

          <div className="text-[11px] text-rose-300/70 font-sans">
            Rounding rule: .25 ➔ .5 · .75 ➔ .0
          </div>
        </div>
      </div>

      {/* Footer bar with conversion reference and apply buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowTableModal(!showTableModal)}
          className="flex items-center gap-1.5 text-xs text-rose-300/80 hover:text-white transition-colors self-start"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showTableModal ? 'Hide Official Conversion Reference' : 'View Official Cambridge Raw-to-Band Tables'}</span>
        </button>

        {onApplyScores && (
          <div className="flex items-center gap-2.5">
            {appliedNotice && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Scores Applied to Evaluation!
              </span>
            )}
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Converted Scores</span>
            </button>
          </div>
        )}
      </div>

      {/* Expandable Official Cambridge Raw-to-Band Table Card */}
      {showTableModal && (
        <div className="p-4 rounded-2xl bg-black/60 border border-white/15 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h5 className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official IELTS Raw Score Conversion Reference (Cambridge / British Council / IDP)</span>
            </h5>
            <span className="text-[10px] text-rose-300/70 font-mono">40 Questions Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
            
            <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 space-y-1">
              <div className="font-bold text-sky-300 border-b border-sky-500/20 pb-1 mb-1.5">
                Listening (All Candidates)
              </div>
              <div className="flex justify-between"><span>39–40</span> <span className="font-bold text-sky-200">Band 9.0</span></div>
              <div className="flex justify-between"><span>37–38</span> <span className="font-bold text-sky-200">Band 8.5</span></div>
              <div className="flex justify-between"><span>35–36</span> <span className="font-bold text-sky-200">Band 8.0</span></div>
              <div className="flex justify-between"><span>32–34</span> <span className="font-bold text-sky-200">Band 7.5</span></div>
              <div className="flex justify-between"><span>30–31</span> <span className="font-bold text-sky-200">Band 7.0</span></div>
              <div className="flex justify-between"><span>26–29</span> <span className="font-bold text-sky-200">Band 6.5</span></div>
              <div className="flex justify-between"><span>23–25</span> <span className="font-bold text-sky-200">Band 6.0</span></div>
              <div className="flex justify-between"><span>18–22</span> <span className="font-bold text-sky-200">Band 5.5</span></div>
              <div className="flex justify-between"><span>16–17</span> <span className="font-bold text-sky-200">Band 5.0</span></div>
              <div className="flex justify-between"><span>13–15</span> <span className="font-bold text-sky-200">Band 4.5</span></div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
              <div className="font-bold text-emerald-300 border-b border-emerald-500/20 pb-1 mb-1.5">
                Academic Reading
              </div>
              <div className="flex justify-between"><span>39–40</span> <span className="font-bold text-emerald-200">Band 9.0</span></div>
              <div className="flex justify-between"><span>37–38</span> <span className="font-bold text-emerald-200">Band 8.5</span></div>
              <div className="flex justify-between"><span>35–36</span> <span className="font-bold text-emerald-200">Band 8.0</span></div>
              <div className="flex justify-between"><span>33–34</span> <span className="font-bold text-emerald-200">Band 7.5</span></div>
              <div className="flex justify-between"><span>30–32</span> <span className="font-bold text-emerald-200">Band 7.0</span></div>
              <div className="flex justify-between"><span>27–29</span> <span className="font-bold text-emerald-200">Band 6.5</span></div>
              <div className="flex justify-between"><span>23–26</span> <span className="font-bold text-emerald-200">Band 6.0</span></div>
              <div className="flex justify-between"><span>19–22</span> <span className="font-bold text-emerald-200">Band 5.5</span></div>
              <div className="flex justify-between"><span>15–18</span> <span className="font-bold text-emerald-200">Band 5.0</span></div>
              <div className="flex justify-between"><span>13–14</span> <span className="font-bold text-emerald-200">Band 4.5</span></div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1">
              <div className="font-bold text-amber-300 border-b border-amber-500/20 pb-1 mb-1.5">
                General Training Reading
              </div>
              <div className="flex justify-between"><span>40</span> <span className="font-bold text-amber-200">Band 9.0</span></div>
              <div className="flex justify-between"><span>39</span> <span className="font-bold text-amber-200">Band 8.5</span></div>
              <div className="flex justify-between"><span>37–38</span> <span className="font-bold text-amber-200">Band 8.0</span></div>
              <div className="flex justify-between"><span>36</span> <span className="font-bold text-amber-200">Band 7.5</span></div>
              <div className="flex justify-between"><span>34–35</span> <span className="font-bold text-amber-200">Band 7.0</span></div>
              <div className="flex justify-between"><span>32–33</span> <span className="font-bold text-amber-200">Band 6.5</span></div>
              <div className="flex justify-between"><span>30–31</span> <span className="font-bold text-amber-200">Band 6.0</span></div>
              <div className="flex justify-between"><span>27–29</span> <span className="font-bold text-amber-200">Band 5.5</span></div>
              <div className="flex justify-between"><span>23–26</span> <span className="font-bold text-amber-200">Band 5.0</span></div>
              <div className="flex justify-between"><span>19–22</span> <span className="font-bold text-amber-200">Band 4.5</span></div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
