export type LeadStatus = 
  | 'Submitted' 
  | 'Pending Evaluation' 
  | 'Evaluated' 
  | 'Ready to Send' 
  | 'Result Sent'
  | 'New' 
  | 'Contacted' 
  | 'Reviewed';

export type LeadType = 
  | 'IELTS Mock Test' 
  | 'USA Admission' 
  | 'Tourist Visa' 
  | 'Canada Study' 
  | 'UK Student Visa' 
  | 'Australia Study';

export type LeadSource = 'Website' | 'Landing Page' | 'Facebook' | 'Google' | 'Direct';

export interface IELTSScoreBreakdown {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  overall: number;
  cefrLevel: string;
  examinerNotes: string;
  evaluatedAt?: string;
  evaluatedBy?: string;
}

export interface IELTSMockTestHistoryEntry {
  id: string;
  testTitle: string;
  testDate: string;
  testType: 'Academic' | 'General Training' | 'Writing Only' | 'Speaking Only';
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  overall: number;
  cefrLevel: string;
  targetBand?: number;
  examinerNotes?: string;
  evaluatedBy?: string;
  rawListening?: number;
  rawReading?: number;
}

export interface IELTSMockSubmission {
  testType: 'Academic' | 'General Training' | 'Writing Only' | 'Speaking Only';
  targetCountry: string;
  targetBand: number;
  writingPrompt?: string;
  writingSubmission?: string;
  writingWordCount?: number;
  speakingTopic?: string;
  speakingNotes?: string;
  rawListeningScore?: number; // out of 40
  rawReadingScore?: number; // out of 40
  scores?: IELTSScoreBreakdown;
  history?: IELTSMockTestHistoryEntry[];
}

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  type: LeadType;
  source: LeadSource;
  phone: string;
  email: string;
  message: string;
  date: string;
  status: LeadStatus;
  ieltsData?: IELTSMockSubmission;
  unread?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VisitorStat {
  period: string;
  labelEn: string;
  labelBn: string;
  value: string;
  change: string;
  isPositive: boolean;
  history: number[];
}

export interface TopPageItem {
  rank: number;
  page: string;
  pageBn: string;
  avgTime: string;
  visitors: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  type: 'mock_test' | 'visa' | 'urgent';
  studentName: string;
  read: boolean;
}
