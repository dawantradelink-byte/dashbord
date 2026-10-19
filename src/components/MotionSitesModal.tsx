import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Check, 
  Waves, 
  Cpu, 
  Sun, 
  Compass, 
  ExternalLink, 
  Play, 
  Volume2, 
  Sliders, 
  Layers, 
  ArrowRight,
  Eye,
  Zap,
  Fish
} from 'lucide-react';
import { waterAudio } from './WaterAudio';

export type MotionTheme = 'pond' | 'cyber' | 'aurora' | 'gold';

interface MotionSitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: MotionTheme;
  onSelectTheme: (theme: MotionTheme) => void;
  language: 'en' | 'bn';
}

interface TemplateCard {
  id: MotionTheme;
  title: string;
  badge: string;
  tagline: string;
  gradient: string;
  accentColor: string;
  features: string[];
  promptSnippet: string;
}

export const MotionSitesModal: React.FC<MotionSitesModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme,
  language
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MotionTheme>(activeTheme);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const templates: TemplateCard[] = [
    {
      id: 'pond',
      title: 'Liquid Zen Koi Pond',
      badge: 'Signature Fluid Physics',
      tagline: 'Multi-segment articulated spine kinematics with liquid glassmorphism & ripple physics',
      gradient: 'from-[#4a0814] via-[#24040a] to-[#120205]',
      accentColor: 'border-rose-500/50 text-rose-300 shadow-rose-950/60',
      features: [
        '14-joint articulated spine physics on swimming Koi fish',
        'Dynamic cursor avoidance & ripple caustics propagation',
        'Multi-track Web Audio API synthesizing natural water flow',
        'Iridescent ruby glassmorphism with backdrop saturation'
      ],
      promptSnippet: 'Create a liquid-glass interactive dashboard with HTML5 canvas water caustics, multi-joint swimming koi kinematics, and audio-reactive ripples inspired by motionsites.ai'
    },
    {
      id: 'cyber',
      title: 'Cyber Glow Matrix',
      badge: 'High-Velocity Kinetic',
      tagline: 'Perspective cybernetic grid with neon electric cyan and magenta laser pulses',
      gradient: 'from-[#190938] via-[#0b041c] to-[#04010a]',
      accentColor: 'border-cyan-500/50 text-cyan-300 shadow-cyan-950/60',
      features: [
        'Kinetic 3D perspective grid scanning with horizon depth',
        'Electric cyan & hot magenta laser ripple waves',
        'High-contrast holographic glass panels with neon perimeter glow',
        'Ultra-responsive zero-lag canvas render loop'
      ],
      promptSnippet: 'Design a cyberpunk motion hero section with an infinite perspective vector grid, glowing particle data trails, and cyan-magenta liquid glass cards'
    },
    {
      id: 'aurora',
      title: 'Celestial Aurora Borealis',
      badge: 'Chromatic Ethereal Wave',
      tagline: 'Morphing iridescent ribbons of emerald and violet drifting across velvet deep space',
      gradient: 'from-[#062e2a] via-[#091e2b] to-[#040612]',
      accentColor: 'border-emerald-500/50 text-emerald-300 shadow-emerald-950/60',
      features: [
        'Tri-phase sine harmonic fluid wave generation',
        'Chromatic aberration ribbons blending cyan, emerald and amethyst',
        'Floating ethereal starlight dust particles',
        'Velvet obsidian glass cards with micro-shimmer borders'
      ],
      promptSnippet: 'Build an ethereal aurora borealis web experience with multi-layer harmonic wave dispersion, chromatic glass blur, and floating stardust embers'
    },
    {
      id: 'gold',
      title: '24K Solar Luxury Obsidian',
      badge: 'Solar Ray Optics',
      tagline: 'Warm 24K solar flare optics, floating amber embers, and deep obsidian velvet glass',
      gradient: 'from-[#331e05] via-[#1a0f02] to-[#080501]',
      accentColor: 'border-amber-500/50 text-amber-300 shadow-amber-950/60',
      features: [
        'Solar caustic ray refraction with 24K gold optics',
        'Rising thermic gold stardust embers and specular glints',
        'Metallic beveled rim reflections and luxury typography',
        'Deep champagne & amber liquid glass saturation'
      ],
      promptSnippet: 'Craft a high-end luxury obsidian portal with 24K gold ray kinetics, floating solar embers, beveled metallic badges, and liquid champagne glass cards'
    }
  ];

  const handleApply = (theme: MotionTheme) => {
    setSelectedTemplate(theme);
    onSelectTheme(theme);
    // Trigger celebratory wave ripple
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('koi-feed', {
        detail: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      }));
    }
  };

  const handleCopyPrompt = (snippet: string, id: string) => {
    navigator.clipboard?.writeText(snippet);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2500);
  };

  const handleTestRipple = () => {
    waterAudio.playRippleSound(1.2);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('koi-feed', {
        detail: {
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 400,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
        }
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-4xl glass-panel rounded-3xl border border-rose-500/30 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden text-white bg-[#180307]/95 my-8 z-10"
          >
            {/* Top Glow Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-cyan-400" />

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/50">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      MotionSites.ai Template Inspiration
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-400/30">
                      Live Showcase
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-200/70 mt-1">
                    Dynamic Motion Engine & Atmospheric Template Switcher inspired by{' '}
                    <a
                      href="https://motionsites.ai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 hover:text-white underline inline-flex items-center gap-1 font-medium"
                    >
                      motionsites.ai <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full glass-panel hover:bg-white/10 text-rose-200/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Introduction Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-slate-950/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-rose-100">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    Select any template below to dynamically re-theme the background canvas, ripple optics, and atmospheric lighting in real-time.
                  </span>
                </div>
                <button
                  onClick={handleTestRipple}
                  className="shrink-0 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>Test Ripple Pulse</span>
                </button>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((tpl) => {
                  const isActive = activeTheme === tpl.id;
                  return (
                    <motion.div
                      key={tpl.id}
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.2 }}
                      className={`relative rounded-2xl p-5 border transition-all cursor-pointer bg-gradient-to-b ${tpl.gradient} ${
                        isActive
                          ? `border-2 ${tpl.accentColor} ring-2 ring-white/20 shadow-2xl`
                          : 'border-white/10 hover:border-white/30 opacity-90 hover:opacity-100'
                      }`}
                      onClick={() => handleApply(tpl.id)}
                    >
                      {/* Top Bar with Badge & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                          {tpl.badge}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h4 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-rose-200/75 mt-1 leading-relaxed">
                        {tpl.tagline}
                      </p>

                      {/* Feature Bullets */}
                      <ul className="mt-3.5 space-y-1.5 text-[11px] text-white/80">
                        {tpl.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold mt-0.5">✦</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(tpl.id);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-white/15 hover:bg-white/25 text-white'
                          }`}
                        >
                          <Play className="w-3 h-3" />
                          <span>{isActive ? 'Current Template' : 'Apply Template'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPrompt(tpl.promptSnippet, tpl.id);
                          }}
                          className="text-[11px] text-rose-300 hover:text-white transition-colors flex items-center gap-1"
                          title="Copy Motion Prompt snippet"
                        >
                          {copiedPrompt === tpl.id ? (
                            <span className="text-emerald-300 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Copied!
                            </span>
                          ) : (
                            <span>Copy Prompt</span>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Design Principles inspired by MotionSites.ai */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400" />
                  MotionSites.ai Architecture Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-rose-100/90">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-semibold text-white mb-1">Fluid Canvas Physics</div>
                    <p className="text-[11px] text-rose-200/70 leading-relaxed">
                      Custom 60fps render loop with multi-segmented physics, water ripples, and zero CPU blocking.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-semibold text-white mb-1">Liquid Glassmorphism</div>
                    <p className="text-[11px] text-rose-200/70 leading-relaxed">
                      Deep blurred multi-layer cards with 170% saturation, specular reflection, and crimson radiance.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <div className="font-semibold text-white mb-1">Kinetic Typography</div>
                    <p className="text-[11px] text-rose-200/70 leading-relaxed">
                      Vibrant Arabic & English calligraphy with multi-color gradient clips and ambient shadow illumination.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 sm:p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40">
              <div className="text-xs text-rose-300/70">
                Active Theme: <span className="font-semibold text-white capitalize">{activeTheme} Mode</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a
                  href="https://motionsites.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl glass-panel text-xs font-medium text-rose-200 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit MotionSites.ai</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-950/60 w-full sm:w-auto text-center"
                >
                  Done
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
