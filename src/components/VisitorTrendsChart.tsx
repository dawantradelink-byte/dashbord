import React, { useState, useMemo } from 'react';
import { BarChart3, ChevronDown, Activity, Info } from 'lucide-react';
import { storageService } from '../services/storageService';

interface VisitorTrendsChartProps {
  language: 'en' | 'bn';
}

export const VisitorTrendsChart: React.FC<VisitorTrendsChartProps> = ({ language }) => {
  const [range, setRange] = useState<'7' | '14' | '30'>('7');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const analytics = storageService.getAnalytics();
  const leads = storageService.getLeads();
  const isGAConnected = analytics.isGoogleAnalyticsConnected;

  // Derive real data points from candidate leads / mock submissions or GA4 history
  const data = useMemo(() => {
    if (isGAConnected && analytics.historyDaily && analytics.historyDaily.length > 0) {
      return analytics.historyDaily.map((d) => ({
        date: d.date,
        count: d.views,
        countFormatted: d.views >= 1000 ? `${(d.views / 1000).toFixed(1)}K` : d.views.toString()
      }));
    }

    // Default to genuine inquiry activity by day
    const days = range === '7' ? 7 : range === '14' ? 14 : 30;
    const result = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      // Count leads received or updated around this date
      const matchingCount = leads.filter((l) => {
        return l.createdAt && l.createdAt.includes(dateStr);
      }).length;

      result.push({
        date: dateStr,
        count: matchingCount,
        countFormatted: matchingCount.toString()
      });
    }

    // If all zero and we have existing leads with dates, display a baseline timeline of existing lead counts
    const totalCount = result.reduce((acc, curr) => acc + curr.count, 0);
    if (totalCount === 0 && leads.length > 0) {
      // Group leads by createdAt
      const dateMap: Record<string, number> = {};
      leads.forEach((l) => {
        const parts = l.createdAt ? l.createdAt.split(',')[0].trim() : 'Active';
        dateMap[parts] = (dateMap[parts] || 0) + 1;
      });
      const entries = Object.entries(dateMap);
      if (entries.length > 0) {
        return entries.slice(-7).map(([date, count]) => ({
          date,
          count,
          countFormatted: count.toString()
        }));
      }
    }

    return result;
  }, [range, isGAConnected, analytics.historyDaily, leads]);

  const maxVal = Math.max(...data.map((d) => d.count), 5);
  const chartHeight = 150;
  const chartWidth = 500;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const innerW = chartWidth - paddingLeft - paddingRight;
  const innerH = chartHeight - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / Math.max(1, data.length - 1)) * innerW;
    const y = paddingTop + innerH - (d.count / maxVal) * innerH;
    return { ...d, x, y };
  });

  // Calculate smooth SVG cubic bezier path
  let pathD = points.length > 0 ? `M ${points[0].x} ${points[0].y}` : '';
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerH} L ${points[0].x} ${paddingTop + innerH} Z`
    : '';

  return (
    <div className="glass-card-glow rounded-2xl p-4.5 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {language === 'en' ? 'Candidate Activity Trend' : 'আবেদনকারী কার্যক্রমের ধারা'}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                isGAConnected 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
              }`}>
                {isGAConnected ? 'GA4 Connected' : 'Portal Records'}
              </span>
            </div>
            <p className="text-[11px] text-rose-300/60">
              {isGAConnected 
                ? (language === 'en' ? 'Google Analytics 4 Live Telemetry' : 'গুগল অ্যানালিটিক্স ৪ ট্র্যাকিং')
                : (language === 'en' ? 'Verified student mock & inquiry submissions' : 'যাচাইকৃত শিক্ষার্থী টেস্ট ও অনুসন্ধান')}
            </p>
          </div>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as '7' | '14' | '30')}
            className="appearance-none bg-rose-950/40 hover:bg-rose-900/40 border border-white/15 text-rose-200 text-xs rounded-lg pl-3 pr-7 py-1 focus:outline-none cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-rose-300/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="relative w-full h-[180px] mt-2">
        {data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-rose-300/60 text-xs">
            <Info className="w-6 h-6 mb-1 text-rose-400" />
            <span>No activity recorded in this period yet.</span>
          </div>
        ) : (
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="60%" stopColor="#dc2626" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#991b1b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines and Y-axis labels */}
            {[maxVal, Math.round(maxVal * 0.75), Math.round(maxVal * 0.5), Math.round(maxVal * 0.25), 0].map((val, i) => {
              const y = paddingTop + innerH - (val / maxVal) * innerH;
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={paddingLeft - 6}
                    y={y + 3}
                    textAnchor="end"
                    fill="rgba(255, 200, 200, 0.5)"
                    fontSize="8.5"
                    className="font-mono tabular-nums"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Area fill */}
            {areaD && <path d={areaD} fill="url(#areaGradient)" />}

            {/* Smooth Red Trendline */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            )}

            {/* Data Nodes & X-Axis Labels */}
            {points.map((p, idx) => (
              <g key={idx} className="cursor-pointer">
                {hoveredIndex === idx && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={paddingTop + innerH}
                    stroke="rgba(255, 255, 255, 0.35)"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIndex === idx ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#e11d48"
                  strokeWidth="2"
                  className="transition-all"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />

                <text
                  x={p.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="rgba(255, 210, 210, 0.65)"
                  fontSize="8"
                  className="font-mono"
                >
                  {p.date}
                </text>
              </g>
            ))}
          </svg>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute -top-3 px-2.5 py-1.5 rounded-lg bg-black/80 border border-rose-500/50 backdrop-blur-md text-[11px] text-white shadow-xl pointer-events-none -translate-x-1/2"
            style={{
              left: `${(points[hoveredIndex].x / chartWidth) * 100}%`
            }}
          >
            <div className="font-bold text-rose-300">{points[hoveredIndex].date}</div>
            <div className="text-white font-medium">
              {points[hoveredIndex].count} {isGAConnected ? 'visitors' : 'submissions'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
