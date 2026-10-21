import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Headphones, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  RotateCcw,
  Sliders,
  Check,
  ChevronDown,
  Info
} from 'lucide-react';
import { 
  getRawScoreBandDetail, 
  calculateIELTSOverall, 
  getIELTSCefr 
} from '../utils/ieltsAudit';

export interface IELTSRawScoreCalculatorProps {
  initialTestType?: 'Academic' | 'General Training';
  initialListeningRaw?: number;
  initialReadingRaw?: number;
  initialWritingBand?: number;
  initialSpeakingBand?: number;
  onApplyScores?: (result: {
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
  compact?: boolean;
}

export const IELTSRawScoreCalculator: React.FC<IELTSRawScoreCalculatorProps> = ({
  initialTestType = 'Academic',
  initialListeningRaw = 32,
  initialReadingRaw = 30,
  initialWritingBand = 6.5,
  initialSpeakingBand = 7.0,
  onApplyScores,
  language = 'en',
  compact = false
}) => {
  const [testType, setTestType] = useState<'Academic' | 'General Training'>(initialTestType);
  const [listeningRaw, setListeningRaw] = useState<number>(initialListeningRaw);
  const [readingRaw, setReadingRaw] = useState<number>(initialReadingRaw);
  const [writingBand, setWritingBand] = useState<number>(initialWritingBand);
  const [speakingBand, setSpeakingBand] = useState<number>(initialSpeakingBand);
  const [showFullOverall, setShowFullOverall] = useState<boolean>(true);
  const [showConversionTables, setShowConversionTables] = useState<boolean>(false);
  const [appliedToast, setAppliedToast] = useState<boolean>(false);

  // Real-time Listening conversion calculation
  const listeningDetail = useMemo(() => {
    return getRawScoreBandDetail(listeningRaw, 'listening');
  }, [listeningRaw]);

  // Real-time Reading conversion calculation based on selected test type
  const readingDetail = useMemo(() => {
    return getRawScoreBandDetail(
      readingRaw, 
      testType === 'Academic' ? 'academicReading' : 'generalReading'
    );
  }, [readingRaw, testType]);

  // Real-time predicted overall band score according to Cambridge/IDP rounding rules
  const overallBand = useMemo(() => {
    return calculateIELTSOverall(
      listeningDetail.band,
      readingDetail.band,
      writingBand,
      speakingBand
    );
  }, [listeningDetail.band, readingDetail.band, writingBand, speakingBand]);

  const overallCefr = useMemo(() => {
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
      setAppliedToast(true);
      setTimeout(() => setAppliedToast(false), 2500);
    }
  };

  const handlePreset = (targetBand: number) => {
    if (targetBand === 7.0) {
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
      setListeningRaw(0);
      setReadingRaw(0);
      setWritingBand(5.0);
      setSpeakingBand(5.0);
    }
  };

  return (
    <div className="glass-panel rounded-3xl border border-rose-500/30 p-5 md:p-6 text-white shadow-2xl space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/50">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-bold text-white tracking-wide">
                {language === 'en' ? 'Official IELTS Raw Score Calculator' : 'অফিসিয়াল আইইএলটিএস র স্কোর ক্যালকুলেটর'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                Cambridge / IDP
              </span>
            </div>
            <p className="text-xs text-rose-200/70">
              {language === 'en' 
                ? 'Converts Listening & Reading correct answers (0–40) into verified Band Scores in real-time.' 
                : 'লিসেনিং ও রিডিং সঠিক উত্তর সংখ্যা (০–৪০) থেকে তাৎক্ষণিক সঠিক ব্যান্ড স্কোর রূপান্তর।'}
            </p>
          </div>
        </div>

        {/* Module / Test Type Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 self-start sm:self-auto">
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

      {/* Target Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-rose-300/80 font-medium">
          {language === 'en' ? 'Quick Targets:' : 'কুইক টার্গেট:'}
        </span>
        <div className="flex items-center gap-1.5">
          {[
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

      {/* Interactive Raw Score Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* LISTENING MODULE */}
        <div className="p-4.5 rounded-2xl bg-black/40 border border-sky-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                <Headphones className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Listening Module</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-sky-300/70">Band</span>
              <span className="text-lg font-bold font-mono text-sky-300 bg-sky-500/20 px-2.5 py-0.5 rounded-lg border border-sky-400/40">
                {listeningDetail.band.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stepper + Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-200/80">Correct Answers:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setListeningRaw(Math.max(0, listeningRaw - 1))}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={listeningRaw}
                  onChange={(e) => setListeningRaw(Math.max(0, Math.min(40, parseInt(e.target.value) || 0)))}
                  className="w-12 text-center py-0.5 px-1 rounded-md bg-black/60 border border-white/20 text-white font-mono font-bold text-xs"
                />
                <button
                  type="button"
                  onClick={() => setListeningRaw(Math.min(40, listeningRaw + 1))}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95"
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

          {/* Metadata Bracket & Next Target */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200/80">
            <span>
              Bracket: <strong>{listeningDetail.minRawForCurrentBand}–{listeningDetail.maxRawForCurrentBand}</strong> / 40
            </span>
            {listeningDetail.nextBand ? (
              <span className="text-amber-300 font-medium">
                +{listeningDetail.neededForNextBand} for Band {listeningDetail.nextBand.toFixed(1)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Maximum Band 9.0</span>
            )}
          </div>
        </div>

        {/* READING MODULE */}
        <div className="p-4.5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                Reading ({testType === 'Academic' ? 'Academic' : 'General'})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-300/70">Band</span>
              <span className="text-lg font-bold font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-400/40">
                {readingDetail.band.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stepper + Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-200/80">Correct Answers:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReadingRaw(Math.max(0, readingRaw - 1))}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={readingRaw}
                  onChange={(e) => setReadingRaw(Math.max(0, Math.min(40, parseInt(e.target.value) || 0)))}
                  className="w-12 text-center py-0.5 px-1 rounded-md bg-black/60 border border-white/20 text-white font-mono font-bold text-xs"
                />
                <button
                  type="button"
                  onClick={() => setReadingRaw(Math.min(40, readingRaw + 1))}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center justify-center active:scale-95"
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

          {/* Metadata Bracket & Next Target */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80">
            <span>
              Bracket: <strong>{readingDetail.minRawForCurrentBand}–{readingDetail.maxRawForCurrentBand}</strong> / 40
            </span>
            {readingDetail.nextBand ? (
              <span className="text-amber-300 font-medium">
                +{readingDetail.neededForNextBand} for Band {readingDetail.nextBand.toFixed(1)}
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold">Maximum Band 9.0</span>
            )}
          </div>
        </div>

      </div>

      {/* Overall Score Prediction Section */}
      {showFullOverall && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-br from-rose-950/60 to-black/80 border border-white/15 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'en' ? 'Full Overall Band Projection' : 'সামগ্রিক ব্যান্ড স্কোর প্রক্ষেপণ'}
              </h4>
              <span className="text-[10px] text-rose-300/70 font-mono">
                Formula: Avg(L, R, W, S) Rounding
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-rose-200/70">Projected:</span>
                <span className="text-xl font-bold font-mono text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-xl border border-amber-400/40">
                  {overallBand.toFixed(1)}
                </span>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 text-rose-200 border border-white/15 font-medium truncate">
                {overallCefr}
              </span>
            </div>
          </div>

          {/* Optional Writing and Speaking Adjustment Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-200/80">Writing Assessed Band:</span>
                <span className="font-bold font-mono text-purple-300">{writingBand.toFixed(1)}</span>
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
                <span className="text-rose-200/80">Speaking Assessed Band:</span>
                <span className="font-bold font-mono text-amber-300">{speakingBand.toFixed(1)}</span>
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

          {/* 4-Skill Calculation Breakdown Strip */}
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="text-rose-300/80 flex items-center gap-1.5">
              <span>L: {listeningDetail.band.toFixed(1)}</span>
              <span>+</span>
              <span>R: {readingDetail.band.toFixed(1)}</span>
              <span>+</span>
              <span>W: {writingBand.toFixed(1)}</span>
              <span>+</span>
              <span>S: {speakingBand.toFixed(1)}</span>
              <span>=</span>
              <span className="text-white font-bold">
                {((listeningDetail.band + readingDetail.band + writingBand + speakingBand) / 4).toFixed(3)} avg
              </span>
            </div>

            <div className="text-[11px] text-rose-200/70 font-sans">
              Official Rule: .25 rounds to .5 · .75 rounds to .0
            </div>
          </div>
        </div>
      )}

      {/* Action and Conversion Reference Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowConversionTables(!showConversionTables)}
          className="flex items-center gap-1.5 text-xs text-rose-300/80 hover:text-white transition-colors self-start"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showConversionTables ? 'Hide Conversion Table Reference' : 'View Official Conversion Reference'}</span>
        </button>

        {onApplyScores && (
          <div className="flex items-center gap-2">
            {appliedToast && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                Applied to Evaluation!
              </span>
            )}
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply Converted Scores</span>
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Official Conversion Table Reference Card */}
      {showConversionTables && (
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-3 animate-in fade-in duration-200">
          <h5 className="font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>Cambridge / British Council / IDP Official Conversion Ranges (40 Questions)</span>
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20">
              <div className="font-bold text-sky-300 mb-1 border-b border-sky-500/20 pb-1">Listening (Both)</div>
              <div>39–40: Band 9.0</div>
              <div>37–38: Band 8.5</div>
              <div>35–36: Band 8.0</div>
              <div>32–34: Band 7.5</div>
              <div>30–31: Band 7.0</div>
              <div>26–29: Band 6.5</div>
              <div>23–25: Band 6.0</div>
              <div>18–22: Band 5.5</div>
              <div>16–17: Band 5.0</div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
              <div className="font-bold text-emerald-300 mb-1 border-b border-emerald-500/20 pb-1">Academic Reading</div>
              <div>39–40: Band 9.0</div>
              <div>37–38: Band 8.5</div>
              <div>35–36: Band 8.0</div>
              <div>33–34: Band 7.5</div>
              <div>30–32: Band 7.0</div>
              <div>27–29: Band 6.5</div>
              <div>23–26: Band 6.0</div>
              <div>19–22: Band 5.5</div>
              <div>15–18: Band 5.0</div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20">
              <div className="font-bold text-amber-300 mb-1 border-b border-amber-500/20 pb-1">General Training Reading</div>
              <div>40: Band 9.0</div>
              <div>39: Band 8.5</div>
              <div>37–38: Band 8.0</div>
              <div>36: Band 7.5</div>
              <div>34–35: Band 7.0</div>
              <div>32–33: Band 6.5</div>
              <div>30–31: Band 6.0</div>
              <div>27–29: Band 5.5</div>
              <div>23–26: Band 5.0</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
