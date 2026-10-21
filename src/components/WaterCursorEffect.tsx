import React, { useEffect, useState, useRef } from 'react';
import { waterAudio } from './WaterAudio';

interface RippleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  maxSize: number;
  opacity: number;
  color: string;
}

export const WaterCursorEffect: React.FC = () => {
  const [ripples, setRipples] = useState<RippleParticle[]>([]);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isPointerFine, setIsPointerFine] = useState<boolean>(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState<boolean>(false);
  const lastSpawnRef = useRef<number>(0);
  const nextIdRef = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);

  // Check if device has a fine pointer (desktop mouse/trackpad vs touch screen)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      setIsPointerFine(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsPointerFine(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Mouse move handler (Desktop & fine pointer)
  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = !!target.closest('button, a, input, select, textarea, [role="button"], .interactive-wave');
        setIsHoveringClickable(isInteractive);
      }

      const now = performance.now();
      // Spawn trailing water ripple every 65ms on movement
      if (now - lastSpawnRef.current > 65) {
        lastSpawnRef.current = now;
        spawnRipple(e.clientX, e.clientY, isHoveringClickable ? '#f59e0b' : '#f43f5e', 24);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Create splash on click
      spawnRipple(e.clientX, e.clientY, '#fbbf24', 48);
      spawnRipple(e.clientX, e.clientY, '#e11d48', 36);
      waterAudio.playRippleSound(1.15);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isPointerFine, isHoveringClickable]);

  // Touch screen support (Mobile & Tablet)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        spawnRipple(touch.clientX, touch.clientY, '#fbbf24', 42);
        waterAudio.playRippleSound(1.0);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastSpawnRef.current > 120 && e.touches.length > 0) {
        lastSpawnRef.current = now;
        const touch = e.touches[0];
        spawnRipple(touch.clientX, touch.clientY, '#f43f5e', 30);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const spawnRipple = (x: number, y: number, color: string, maxSize: number) => {
    const id = nextIdRef.current++;
    setRipples((prev) => [
      ...prev.slice(-24), // Keep max 25 particles in memory for high performance
      {
        id,
        x,
        y,
        size: 6,
        maxSize,
        opacity: 0.65,
        color
      }
    ]);
  };

  // Animation frame loop to expand ripples smoothly
  useEffect(() => {
    const updateRipples = () => {
      setRipples((prev) => {
        if (prev.length === 0) return prev;
        return prev
          .map((r) => {
            const progress = (r.size - 6) / (r.maxSize - 6);
            return {
              ...r,
              size: r.size + 1.8,
              opacity: Math.max(0, 0.65 * (1 - progress))
            };
          })
          .filter((r) => r.size < r.maxSize && r.opacity > 0.02);
      });

      animFrameRef.current = requestAnimationFrame(updateRipples);
    };

    animFrameRef.current = requestAnimationFrame(updateRipples);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden" 
      aria-hidden="true"
    >
      {/* Expanding Water Ripple Rings */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform pointer-events-none"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: `${r.size}px`,
            height: `${r.size}px`,
            border: `1.5px solid ${r.color}`,
            boxShadow: `0 0 10px ${r.color}55, inset 0 0 6px ${r.color}33`,
            opacity: r.opacity
          }}
        />
      ))}

      {/* Desktop Fluid Cursor Follower Glow Dot */}
      {isPointerFine && cursorPos && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            width: isHoveringClickable ? '26px' : '14px',
            height: isHoveringClickable ? '26px' : '14px',
            borderRadius: '9999px',
            background: isHoveringClickable
              ? 'radial-gradient(circle, rgba(251,191,36,0.8) 0%, rgba(225,29,72,0.4) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(244,63,94,0.9) 0%, rgba(251,191,36,0.5) 60%, transparent 100%)',
            boxShadow: isHoveringClickable
              ? '0 0 18px rgba(251,191,36,0.8), 0 0 8px rgba(225,29,72,0.9)'
              : '0 0 12px rgba(244,63,94,0.7)',
            filter: 'blur(0.5px)'
          }}
        >
          {/* Inner droplet nucleus */}
          <div className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
        </div>
      )}
    </div>
  );
};
