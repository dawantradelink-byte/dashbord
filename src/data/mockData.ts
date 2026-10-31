import { Lead, VisitorStat, TopPageItem, NotificationItem } from '../types';

/**
 * Blank Template Initial Data
 * All dynamic records and placeholder mock numbers have been removed
 * while preserving 100% of the type schemas, layouts, and label structures.
 */

export const INITIAL_LEADS: Lead[] = [];

export const METRIC_CARDS: VisitorStat[] = [
  {
    period: '24h',
    labelEn: 'Last 24 Hours',
    labelBn: 'গত ২৪ ঘণ্টা',
    value: '0',
    change: '—',
    isPositive: true,
    history: [0, 0, 0, 0]
  },
  {
    period: '7d',
    labelEn: 'Last 7 Days',
    labelBn: 'গত ৭ দিন',
    value: '0',
    change: '—',
    isPositive: true,
    history: [0, 0, 0, 0]
  },
  {
    period: '1m',
    labelEn: 'Last 1 Month',
    labelBn: 'গত ১ মাস',
    value: '0',
    change: '—',
    isPositive: true,
    history: [0, 0, 0, 0]
  },
  {
    period: 'total',
    labelEn: 'Total Visitors',
    labelBn: 'সর্বমোট ভিজিটর',
    value: '0',
    change: '—',
    isPositive: true,
    history: [0, 0, 0, 0]
  }
];

export const VISITOR_TRENDS_DATA: { date: string; count: number; countFormatted: string }[] = [];

export const TOP_PAGES: TopPageItem[] = [];

export const NOTIFICATIONS: NotificationItem[] = [];
