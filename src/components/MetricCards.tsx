import React from 'react';
import { Users, Award, GraduationCap, Plane, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface MetricCardsProps {
  language: 'en' | 'bn';
}

export const MetricCards: React.FC<MetricCardsProps> = ({ language }) => {
  const summary = storageService.getOperationalSummary();

  const cards = [
    {
      id: 'leads',
      labelEn: 'Total Candidate Inquiries',
      labelBn: 'মোট আবেদনকারী লিড',
      subEn: `${summary.pendingLeads} pending evaluation`,
      subBn: `${summary.pendingLeads} টি মূল্যায়নের অপেক্ষায়`,
      value: summary.totalLeads.toString(),
      badge: summary.pendingLeads > 0 ? `${summary.pendingLeads} Pending` : 'Up to date',
      isGold: false,
      icon: <Users className="w-5 h-5 text-white" />,
      history: [Math.max(1, summary.totalLeads - 3), Math.max(1, summary.totalLeads - 2), Math.max(1, summary.totalLeads - 1), summary.totalLeads],
      color: '#ef4444'
    },
    {
      id: 'ielts',
      labelEn: 'IELTS Mock Tests Evaluated',
      labelBn: 'আইইএলটিএস মক টেস্ট মূল্যায়ন',
      subEn: summary.avgBand ? `Average Band Score: ${summary.avgBand}` : 'No evaluated tests yet',
      subBn: summary.avgBand ? `গড় ব্যান্ড স্কোর: ${summary.avgBand}` : 'এখনও কোনো টেস্ট মূল্যায়ন হয়নি',
      value: summary.evaluatedLeads.toString(),
      badge: summary.avgBand ? `Band ${summary.avgBand}` : 'Awaiting',
      isGold: false,
      icon: <Award className="w-5 h-5 text-white" />,
      history: [6.0, 6.5, 7.0, summary.avgBand || 6.5],
      color: '#f43f5e'
    },
    {
      id: 'clients',
      labelEn: 'Enrolled Student Clients',
      labelBn: 'ভর্তি হওয়া শিক্ষার্থী ক্লায়েন্ট',
      subEn: 'In active admissions pipeline',
      subBn: 'ভর্তি কার্যক্রমে সক্রিয় রয়েছে',
      value: summary.totalClients.toString(),
      badge: 'Active Clients',
      isGold: false,
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      history: [1, 2, summary.totalClients, summary.totalClients],
      color: '#f59e0b'
    },
    {
      id: 'visas',
      labelEn: 'Visa Applications Active',
      labelBn: 'সক্রিয় ভিসা আবেদনসমূহ',
      subEn: 'USA, Canada, UK, Schengen',
      subBn: 'ইউএসএ, কানাডা, ইউকে, সেনজেন',
      value: summary.totalVisas.toString(),
      badge: 'In Processing',
      isGold: true,
      icon: <Plane className="w-5 h-5 text-amber-300" />,
      history: [1, 2, 2, summary.totalVisas],
      color: '#fbbf24'
    }
  ];

  // SVG smoothed sparkline generator
  const renderSparkline = (data: number[], color: string, id: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 160;
    const height = 40;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 10) - 5;
      return { x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

    return (
      <svg className="w-full h-10 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${id})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={idx === points.length - 1 ? 3.5 : 2}
            fill="#ffffff"
            stroke={color}
            strokeWidth="1.5"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {cards.map((stat) => {
        return (
          <div
            key={stat.id}
            className="glass-card-glow glass-card-hover rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            {/* Top row: Icon and Titles */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  stat.isGold
                    ? 'bg-gradient-to-br from-amber-500/80 to-amber-700/80 border border-amber-300/40'
                    : 'bg-gradient-to-br from-rose-500/80 to-rose-700/80 border border-rose-300/40'
                }`}
              >
                {stat.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-rose-100 leading-tight">
                  {language === 'bn' ? stat.labelBn : stat.labelEn}
                </div>
                <div className="text-[11px] text-rose-300/70 leading-tight mt-0.5 font-medium">
                  {language === 'bn' ? stat.subBn : stat.subEn}
                </div>
              </div>
            </div>

            {/* Middle row: Big metric & status badge */}
            <div className="flex items-baseline justify-between mt-3 mb-1">
              <div className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight tabular-nums drop-shadow-sm">
                {stat.value}
              </div>

              <div
                className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.isGold
                    ? 'text-amber-300 bg-amber-500/20 border border-amber-400/30'
                    : 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                <span>{stat.badge}</span>
              </div>
            </div>

            {/* Bottom: Sparkline graph */}
            <div className="w-full mt-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              {renderSparkline(stat.history, stat.color, stat.id)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
