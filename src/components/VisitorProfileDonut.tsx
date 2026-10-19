import React from 'react';
import { Users2 } from 'lucide-react';

interface VisitorProfileDonutProps {
  language: 'en' | 'bn';
}

export const VisitorProfileDonut: React.FC<VisitorProfileDonutProps> = ({ language }) => {
  // Donut chart geometry (stroke-dasharray based)
  const size = 130;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const menPct = 0.62;
  const womenPct = 0.38;

  const menDash = menPct * circumference;
  const womenDash = womenPct * circumference;

  return (
    <div className="glass-card-glow rounded-2xl p-4.5 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
          <Users2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {language === 'en' ? 'Visitor Profile' : 'ভিজিটর প্রোফাইল'}
          </h3>
          <p className="text-[11px] text-rose-300/60">
            {language === 'en' ? 'Men and Women (based on available data)' : 'পুরুষ ও নারী (উপলব্ধ তথ্যের ভিত্তিতে)'}
          </p>
        </div>
      </div>

      {/* Donut and Legend Layout */}
      <div className="flex items-center justify-around gap-4 mt-2">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg className="w-32 h-32 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Men Segment (Cyan/Sky) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#38bdf8"
              strokeWidth={strokeWidth}
              strokeDasharray={`${menDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700"
            />

            {/* Women Segment (Rose/Pink) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#fb7185"
              strokeWidth={strokeWidth}
              strokeDasharray={`${womenDash} ${circumference}`}
              strokeDashoffset={-menDash}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-700"
            />
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-white tracking-tight tabular-nums">
              24.3K
            </span>
            <span className="text-[10px] text-rose-200/70 uppercase tracking-wider">
              {language === 'en' ? 'Visitors' : 'ভিজিটর'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 min-w-[100px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
              <span className="text-xs text-rose-100 font-medium">
                {language === 'en' ? 'Men' : 'পুরুষ'}
              </span>
            </div>
            <span className="text-xs font-bold text-white tabular-nums">62%</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
              <span className="text-xs text-rose-100 font-medium">
                {language === 'en' ? 'Women' : 'নারী'}
              </span>
            </div>
            <span className="text-xs font-bold text-white tabular-nums">38%</span>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-rose-300/60 leading-tight">
            IELTS Mock Takers: 58% Men / 42% Women
          </div>
        </div>
      </div>
    </div>
  );
};
