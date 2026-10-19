import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fish, 
  Waves, 
  Palette, 
  Sparkles, 
  Sliders, 
  X, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Eye,
  SlidersHorizontal,
  Zap,
  Check
} from 'lucide-react';
import { waterAudio } from './WaterAudio';

export type PondColorTheme = 'crimson' | 'cyan' | 'emerald' | 'violet' | 'amber' | 'obsidian';

export interface KoiPondSettings {
  fishCount: number;
  rippleIntensity: number; // 0.2 to 2.5
  colorTheme: PondColorTheme;
  customHue: number; // -1 for preset, or 0-360
  opacity: number; // 40 to 100
  multiColorHighlight: boolean;
}

interface KoiPondControlsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const KoiPondControlsPanel: React.FC<KoiPondControlsPanelProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'ripples' | 'theme'>('fish');
  const [fishCount, setFishCount] = useState<number>(() => {
    return (typeof window !== 'undefined' && (window as any).__KOI_COUNT__) || 4;
  });
  const [rippleIntensity, setRippleIntensity] = useState<number>(() => {
    return (typeof window !== 'undefined' && (window as any).__RIPPLE_INTENSITY__) || 1.0;
  });
  const [colorTheme, setColorTheme] = useState<PondColorTheme>(() => {
    return (typeof window !== 'undefined' && (window as any).__POND_COLOR_THEME__) || 'crimson';
  });
  const [customHue, setCustomHue] = useState<number>(() => {
    return (typeof window !== 'undefined' && (window as any).__POND_CUSTOM_HUE__) ?? -1;
  });
  const [pondOpacity, setPondOpacity] = useState<number>(() => {
    return (typeof window !== 'undefined' && Math.round(((window as any).__KOI_OPACITY__ || 0.9) * 100)) || 90;
  });
  const [multiColorMode, setMultiColorMode] = useState<boolean>(true);

  // Sync state to window & dispatch event
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__KOI_COUNT__ = fishCount;
      (window as any).__RIPPLE_INTENSITY__ = rippleIntensity;
      (window as any).__POND_COLOR_THEME__ = colorTheme;
      (window as any).__POND_CUSTOM_HUE__ = customHue;
      (window as any).__KOI_OPACITY__ = pondOpacity / 100;

      window.dispatchEvent(
        new CustomEvent('pond-settings-changed', {
          detail: {
            fishCount,
            rippleIntensity,
            colorTheme,
            customHue,
            opacity: pondOpacity / 100,
            multiColorMode
          }
        })
      );
    }
  }, [fishCount, rippleIntensity, colorTheme, customHue, pondOpacity, multiColorMode]);

  const handleTriggerRipple = () => {
    waterAudio.playRippleSound(1.1);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('koi-feed', {
          detail: {
            x: window.innerWidth / 2 + (Math.random() - 0.5) * 350,
            y: window.innerHeight / 2 + (Math.random() - 0.5) * 200,
            intensity: rippleIntensity
          }
        })
      );
    }
  };

  const handleResetDefaults = () => {
    setFishCount(4);
    setRippleIntensity(1.0);
    setColorTheme('crimson');
    setCustomHue(-1);
    setPondOpacity(90);
    setMultiColorMode(true);
  };

  const themePresets: { id: PondColorTheme; name: string; bg: string; border: string; glow: string }[] = [
    { id: 'crimson', name: 'Crimson Ruby', bg: 'bg-[#420811]', border: 'border-rose-500', glow: '#ef4444' },
    { id: 'cyan', name: 'Cyan Lagoon', bg: 'bg-[#083244]', border: 'border-cyan-400', glow: '#06b6d4' },
    { id: 'emerald', name: 'Imperial Emerald', bg: 'bg-[#083824]', border: 'border-emerald-400', glow: '#10b981' },
    { id: 'violet', name: 'Midnight Amethyst', bg: 'bg-[#280a3c]', border: 'border-purple-400', glow: '#a855f7' },
    { id: 'amber', name: 'Solar Amber', bg: 'bg-[#382005]', border: 'border-amber-400', glow: '#f59e0b' },
    { id: 'obsidian', name: 'Charcoal Noir', bg: 'bg-[#1a1a20]', border: 'border-slate-400', glow: '#94a3b8' }
  ];

  const koiVarieties = [
    { name: 'Calico Multi-Color', color: 'bg-gradient-to-r from-red-500 via-cyan-400 to-amber-400', desc: 'Turquoise cyan, coral red, sunny gold, sumi black' },
    { name: 'Asagi Azure', color: 'bg-gradient-to-r from-sky-400 to-red-500', desc: 'Celestial azure spine, flame scarlet fins' },
    { name: 'Emerald Midori', color: 'bg-gradient-to-r from-emerald-400 to-amber-300', desc: 'Jade green with 24K gold Kinrin scales' },
    { name: 'Midnight Gold', color: 'bg-gradient-to-r from-slate-900 to-yellow-400', desc: 'Obsidian black with luminous sunbursts' },
    { name: 'Grand Kohaku', color: 'bg-gradient-to-r from-red-600 to-stone-100', desc: 'Classic scarlet hi patches on snow ivory' },
    { name: 'Golden Yamabuki', color: 'bg-gradient-to-r from-amber-400 to-yellow-200', desc: 'Solid 24K radiant gold with metallic luster' },
    { name: 'Sacred Tancho', color: 'bg-gradient-to-r from-stone-100 via-stone-100 to-red-600', desc: 'Pure pearl white with red circular crown' },
    { name: 'Sanke Tri-Color', color: 'bg-gradient-to-r from-red-500 via-stone-900 to-stone-100', desc: 'Scarlet, sumi velvet black, and white' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="fixed bottom-20 left-4 sm:left-6 z-40 w-88 sm:w-96 glass-panel rounded-3xl border border-rose-500/40 shadow-2xl backdrop-blur-2xl bg-[#1d0308]/95 text-white overflow-hidden select-none"
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          {/* Top Decorative Color Accent Bar */}
          <div 
            className="h-1.5 w-full transition-colors duration-500"
            style={{ 
              background: customHue >= 0 
                ? `hsl(${customHue}, 85%, 55%)` 
                : colorTheme === 'cyan' 
                ? 'linear-gradient(90deg, #06b6d4, #3b82f6)' 
                : colorTheme === 'emerald'
                ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                : colorTheme === 'violet'
                ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                : colorTheme === 'amber'
                ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                : colorTheme === 'obsidian'
                ? 'linear-gradient(90deg, #64748b, #94a3b8)'
                : 'linear-gradient(90deg, #ef4444, #f59e0b)'
            }} 
          />

          {/* Panel Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-950/50">
                <Fish className="w-4 h-4 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  <span>Koi Pond Studio</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] uppercase font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Live
                  </span>
                </h3>
                <p className="text-[10px] text-rose-200/70">Canvas Physics & Atmosphere</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetDefaults}
                className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset to default settings"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close controls"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 bg-black/30 p-1 text-xs">
            <button
              onClick={() => setActiveTab('fish')}
              className={`flex-1 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'fish'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <Fish className="w-3.5 h-3.5" />
              <span>Fish ({fishCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('ripples')}
              className={`flex-1 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'ripples'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Ripples ({rippleIntensity}x)</span>
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'theme'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-200/70 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Theme</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
            
            {/* TAB 1: FISH COUNT & MULTI-COLOR VARIETIES */}
            {activeTab === 'fish' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                
                {/* Fish Count Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-rose-100 flex items-center gap-1.5">
                      <Fish className="w-3.5 h-3.5 text-amber-400" />
                      Number of Swimming Koi
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded-md bg-amber-400/10">
                      {fishCount} {fishCount === 1 ? 'Koi' : 'Koi Fish'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
                    {[1, 2, 4, 6, 8].map((count) => (
                      <button
                        key={count}
                        onClick={() => setFishCount(count)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          fishCount === count
                            ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                            : 'text-rose-200/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>

                  {/* Continuous Slider */}
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={fishCount}
                    onChange={(e) => setFishCount(parseInt(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-1.5 rounded-lg bg-white/10 mt-2"
                  />
                </div>

                {/* Multi-Color Koi Showcase Badge */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-amber-950/40 border border-amber-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Multi-Color Koi Collection</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> 8 Varieties
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-100/75 leading-relaxed">
                    Includes vibrant Calico (Turquoise & Coral), Celestial Asagi Azure, Emerald Jade Midori, 24K Yamabuki Gold, and Sacred Tancho.
                  </p>
                </div>

                {/* Active Fish Variety Chips */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-rose-300/80 font-medium">Currently in Pond:</div>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {koiVarieties.slice(0, fishCount).map((v, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${v.color} shadow-sm`} />
                          <span className="text-xs font-semibold text-white truncate">{v.name}</span>
                        </div>
                        <span className="text-[10px] text-rose-200/60 font-mono shrink-0">#{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: WATER RIPPLE INTENSITY & WAVE DYNAMICS */}
            {activeTab === 'ripples' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                
                {/* Ripple Intensity Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-rose-100 flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      Water Ripple Intensity
                    </span>
                    <span className="text-[11px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded-md bg-cyan-400/10">
                      {Math.round(rippleIntensity * 100)}% ({rippleIntensity.toFixed(1)}x)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.1"
                    value={rippleIntensity}
                    onChange={(e) => setRippleIntensity(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-white/10"
                  />
                  <div className="flex justify-between text-[10px] text-rose-300/60 mt-1 font-mono">
                    <span>Gentle (0.3x)</span>
                    <span>Natural (1.0x)</span>
                    <span>Shockwave (2.5x)</span>
                  </div>
                </div>

                {/* Ripple Presets */}
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
                  {[
                    { label: 'Soft', val: 0.5 },
                    { label: 'Normal', val: 1.0 },
                    { label: 'Vibrant', val: 1.8 },
                    { label: 'Storm', val: 2.5 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setRippleIntensity(p.val)}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        Math.abs(rippleIntensity - p.val) < 0.15
                          ? 'bg-cyan-600 text-white font-bold shadow'
                          : 'text-rose-200/70 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Interactive Wave Trigger Button */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="text-[11px] text-rose-200/80">
                    Click anywhere on the pond or trigger shockwave pulse:
                  </div>
                  <button
                    onClick={handleTriggerRipple}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Waves className="w-4 h-4 animate-pulse" />
                    <span>Trigger Water Shockwave Ripple</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 3: AMBIENT POND COLOR THEME */}
            {activeTab === 'theme' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                
                {/* Color Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-rose-100 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      Ambient Pond Color Theme
                    </span>
                    <span className="text-[10px] font-mono capitalize text-rose-300">
                      {customHue >= 0 ? `Custom Hue ${customHue}°` : colorTheme}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {themePresets.map((t) => {
                      const isSelected = colorTheme === t.id && customHue < 0;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setColorTheme(t.id);
                            setCustomHue(-1);
                            handleTriggerRipple();
                          }}
                          className={`p-2.5 rounded-xl flex flex-col items-center gap-1.5 border transition-all text-center ${
                            isSelected
                              ? `${t.border} bg-white/10 shadow-lg ring-1 ring-white/30 font-bold text-white`
                              : 'border-white/10 bg-black/30 hover:bg-white/5 text-rose-200/70 hover:text-white'
                          }`}
                        >
                          <span 
                            className={`w-5 h-5 rounded-full ${t.bg} border-2 border-white/40 shadow-inner`}
                            style={{ boxShadow: isSelected ? `0 0 10px ${t.glow}` : undefined }}
                          />
                          <span className="text-[11px] truncate w-full">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Hue Spectrum Slider */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-rose-200 font-medium">Custom Spectrum Hue</span>
                    <button
                      onClick={() => setCustomHue(-1)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        customHue < 0 ? 'text-amber-400' : 'text-rose-300 hover:text-white underline'
                      }`}
                    >
                      {customHue < 0 ? 'Using Preset' : 'Reset to Preset'}
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customHue < 0 ? 350 : customHue}
                    onChange={(e) => setCustomHue(parseInt(e.target.value))}
                    className="w-full cursor-pointer h-2 rounded-lg"
                    style={{
                      background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
                    }}
                  />
                </div>

                {/* Pond Glass Transparency */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1 text-rose-200">
                    <span className="text-[11px] text-rose-300/80">Pond Glass Transparency</span>
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

              </div>
            )}

          </div>

          {/* Bottom Footer Actions */}
          <div className="p-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs">
            <span className="text-[10px] text-rose-300/60 font-mono">
              Non-intrusive Canvas Layer
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Done
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
