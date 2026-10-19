import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Activity, 
  Eye, 
  Waves, 
  ChevronUp, 
  ChevronDown,
  Fish,
  GraduationCap,
  Layers,
  Zap,
  Palette,
  ExternalLink
} from 'lucide-react';
import { waterAudio } from './WaterAudio';
import { MotionTheme } from './MotionSitesModal';

interface MotionDockProps {
  onToggleZenMode: () => void;
  language: 'en' | 'bn';
  activeTheme?: MotionTheme;
  onSelectTheme?: (theme: MotionTheme) => void;
  onOpenMotionModal?: () => void;
  onOpenPondStudio?: () => void;
}

export const MotionDock: React.FC<MotionDockProps> = ({ 
  onToggleZenMode, 
  language,
  activeTheme = 'pond',
  onSelectTheme,
  onOpenMotionModal,
  onOpenPondStudio
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [koiSpeed, setKoiSpeed] = useState<'calm' | 'natural' | 'lively'>('natural');
  const [pondOpacity, setPondOpacity] = useState<number>(90);
  const [ripplesOnMove, setRipplesOnMove] = useState<boolean>(true);
  const [currentTheme, setCurrentTheme] = useState<MotionTheme>(activeTheme);

  useEffect(() => {
    setCurrentTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    // Sync with global window settings for Koi pond & Motion Theme
    if (typeof window !== 'undefined') {
      (window as any).__KOI_SPEED__ = koiSpeed === 'calm' ? 0.9 : koiSpeed === 'lively' ? 2.5 : 1.6;
      (window as any).__KOI_OPACITY__ = pondOpacity / 100;
      (window as any).__RIPPLES_ENABLED__ = ripplesOnMove;
      (window as any).__MOTION_THEME__ = currentTheme;
    }
  }, [koiSpeed, pondOpacity, ripplesOnMove, currentTheme]);

  const handleToggleAudio = () => {
    const nextState = !isAudioActive;
    setIsAudioActive(nextState);
    if (nextState) {
      waterAudio.start();
      waterAudio.playRippleSound(1.0);
    } else {
      waterAudio.stop();
    }
  };

  const handleTriggerRippleWave = () => {
    waterAudio.playRippleSound(1.2);
    // Dispatch custom event to trigger pond ripples
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('koi-feed', {
        detail: {
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 300,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
        }
      }));
    }
  };

  const handleThemeChange = (theme: MotionTheme) => {
    setCurrentTheme(theme);
    if (typeof window !== 'undefined') {
      (window as any).__MOTION_THEME__ = theme;
    }
    if (onSelectTheme) {
      onSelectTheme(theme);
    }
    handleTriggerRippleWave();
  };

  const themeOptions: { id: MotionTheme; label: string; icon: string }[] = [
    { id: 'pond', label: 'Zen Pond', icon: '🎏' },
    { id: 'cyber', label: 'Cyber Glow', icon: '⚡' },
    { id: 'aurora', label: 'Aurora', icon: '🌌' },
    { id: 'gold', label: '24K Solar', icon: '☀️' }
  ];

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="mb-3 w-80 sm:w-88 glass-panel rounded-3xl border border-rose-500/30 p-4 shadow-2xl backdrop-blur-2xl bg-[#26060c]/95 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">Motion & Pond Controller</h4>
                  <p className="text-[10px] text-rose-300/70">Inspired by motionsites.ai</p>
                </div>
              </div>
              
              {onOpenMotionModal && (
                <button
                  onClick={onOpenMotionModal}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/30 text-[10px] font-semibold flex items-center gap-1 transition-all"
                  title="Explore All Motion Templates"
                >
                  <Layers className="w-3 h-3 text-amber-300" />
                  <span>Templates</span>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="py-3 space-y-3.5 text-xs">
              
              {/* Dedicated Koi Pond Studio (Fish Count, Ripples & Color Themes) Button */}
              {onOpenPondStudio && (
                <button
                  onClick={onOpenPondStudio}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 via-rose-600/30 to-cyan-600/30 hover:from-amber-600/50 hover:to-cyan-600/50 border border-amber-400/40 text-amber-200 hover:text-white font-semibold text-xs flex items-center justify-between transition-all shadow-md group"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>Koi Pond Controls Studio</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold">
                    Multi-Color
                  </span>
                </button>
              )}

              {/* Motion Template Selector (Motionsites.ai inspired) */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-rose-200">
                  <span className="text-[11px] text-rose-300/80 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Motion Atmosphere
                  </span>
                  <span className="text-[10px] font-mono capitalize text-rose-400">{currentTheme}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleThemeChange(t.id)}
                      className={`py-1.5 px-1 text-[10px] font-medium rounded-lg transition-all flex flex-col items-center gap-0.5 ${
                        currentTheme === t.id
                          ? 'bg-gradient-to-b from-rose-600 to-red-700 text-white shadow-md font-bold'
                          : 'text-rose-200/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xs">{t.icon}</span>
                      <span className="truncate w-full text-center">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Stream & Ripples */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div className="flex items-center gap-2 text-rose-200">
                  <Waves className="w-4 h-4 text-rose-400" />
                  <span>Zen Water Ambient</span>
                </div>
                <button
                  onClick={handleToggleAudio}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-xs transition-all ${
                    isAudioActive 
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' 
                      : 'bg-white/10 text-rose-300 hover:bg-white/15'
                  }`}
                >
                  {isAudioActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioActive ? 'Sound ON' : 'Muted'}</span>
                </button>
              </div>

              {/* Feed Fish / Trigger Ripple */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <div className="flex items-center gap-2 text-rose-200">
                  <Fish className="w-4 h-4 text-amber-400" />
                  <span>Interactive Ripples</span>
                </div>
                <button
                  onClick={handleTriggerRippleWave}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-medium text-xs transition-all hover:scale-105 active:scale-95"
                >
                  Drop Pellet 🎏
                </button>
              </div>

              {/* Koi Swim Speed */}
              <div className="pt-1 border-t border-white/5">
                <div className="flex items-center justify-between mb-1.5 text-rose-200">
                  <span className="text-[11px] text-rose-300/80">Motion Velocity</span>
                  <span className="text-[10px] font-mono capitalize text-rose-400">{koiSpeed}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
                  {(['calm', 'natural', 'lively'] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setKoiSpeed(spd)}
                      className={`py-1 text-[11px] font-medium rounded-lg capitalize transition-all ${
                        koiSpeed === spd
                          ? 'bg-rose-600 text-white shadow'
                          : 'text-rose-200/70 hover:text-white'
                      }`}
                    >
                      {spd}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pond Opacity Slider */}
              <div className="pt-1 border-t border-white/5">
                <div className="flex items-center justify-between mb-1.5 text-rose-200">
                  <span className="text-[11px] text-rose-300/80">Glass Transparency</span>
                  <span className="text-[10px] font-mono text-rose-400">{pondOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={pondOpacity}
                  onChange={(e) => setPondOpacity(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-white/10"
                />
              </div>

              {/* Zen Student Mode Switch */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={onToggleZenMode}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-red-800 hover:from-rose-600 hover:to-red-700 text-white font-semibold text-xs shadow-lg shadow-rose-950/60 transition-all hover:scale-[1.02]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Switch to Zen Test-Taker View</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Triggers (Zero Layout Impact) */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl glass-panel border border-rose-500/40 shadow-xl backdrop-blur-xl bg-[#200409]/80 hover:bg-[#2e060e] text-white transition-all"
          title="Open Motion & Pond Controls"
        >
          <div className="w-5 h-5 rounded-full bg-rose-600/40 flex items-center justify-center text-rose-300">
            <Sliders className="w-3 h-3 text-rose-300" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-rose-100">
            {language === 'en' ? 'Motion & Pond' : 'মোশন ও পন্ড'}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-200 capitalize font-mono">
            {currentTheme}
          </span>
          {isAudioActive && (
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-rose-300" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-rose-300" />
          )}
        </motion.button>

        {/* Dedicated Quick Pill for Koi Pond Studio Controls (Fish, Ripples, Theme) */}
        {onOpenPondStudio && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenPondStudio}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl glass-panel border border-amber-400/40 shadow-xl backdrop-blur-xl bg-[#200409]/80 hover:bg-[#2e060e] text-amber-200 hover:text-white transition-all text-xs font-semibold"
            title="Adjust Fish Count, Water Ripples & Ambient Pond Color Theme"
          >
            <Fish className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Pond Controls</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
