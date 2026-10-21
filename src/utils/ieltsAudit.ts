/**
 * Next Border IELTS Official Scoring & Audit Utility
 * Implements strict British Council / IDP / Cambridge IELTS Assessment Rules:
 *
 * Overall Band is the arithmetic mean of the four sub-skill bands rounded to the nearest half-band:
 * - Fractional part < 0.25 rounds down to whole band (e.g., 6.125 -> 6.0)
 * - Fractional part >= 0.25 and < 0.75 rounds to half-band (e.g., 6.25 -> 6.5, 6.625 -> 6.5)
 * - Fractional part >= 0.75 rounds up to next whole band (e.g., 6.75 -> 7.0)
 *
 * Valid IELTS band scores are multiples of 0.5 within the range [0.0, 9.0].
 */

import { IELTSScoreBreakdown, IELTSMockTestHistoryEntry, Lead } from '../types';

/**
 * Validates whether a provided number is a legitimate IELTS Band Score (0.0 - 9.0 in steps of 0.5)
 */
export const isValidIELTSBand = (score: unknown): score is number => {
  if (typeof score !== 'number' || isNaN(score) || !isFinite(score)) return false;
  if (score < 0 || score > 9) return false;
  return (Math.round(score * 10) % 5 === 0);
};

/**
 * Safely clamps and validates a module score to a valid IELTS half-band
 */
export const sanitizeIELTSBand = (val: unknown): number => {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num < 0) return 0;
  if (num > 9) return 9;
  return Math.round(num * 2) / 2;
};

/**
 * Official Cambridge / British Council / IDP IELTS Overall Band Calculation
 */
export const calculateIELTSOverall = (l: number, r: number, w: number, s: number): number => {
  const safeL = sanitizeIELTSBand(l);
  const safeR = sanitizeIELTSBand(r);
  const safeW = sanitizeIELTSBand(w);
  const safeS = sanitizeIELTSBand(s);

  const avg = (safeL + safeR + safeW + safeS) / 4;
  const decimal = avg - Math.floor(avg);

  if (decimal < 0.25) return Math.floor(avg);
  if (decimal < 0.75) return Math.floor(avg) + 0.5;
  return Math.ceil(avg);
};

/**
 * Official CEFR (Common European Framework of Reference) mapping for IELTS
 */
export const getIELTSCefr = (band: number): string => {
  const safeBand = sanitizeIELTSBand(band);
  if (safeBand >= 8.5) return 'C2 Mastery (Native-like)';
  if (safeBand >= 7.0) return 'C1 Advanced (Effective Operational)';
  if (safeBand >= 5.5) return 'B2 Independent (Vantage)';
  if (safeBand >= 4.0) return 'B1 Threshold (Intermediate)';
  if (safeBand >= 3.0) return 'A2 Waystage (Basic)';
  return 'A1 Breakthrough (Beginner)';
};

/**
 * Cambridge IELTS Raw Score to Band Conversion (Listening - 40 questions)
 */
export const convertListeningRawToBand = (raw: number): number => {
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 32) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 26) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 18) return 5.5;
  if (r >= 16) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  return 2.0;
};

/**
 * Cambridge IELTS Raw Score to Band Conversion (Academic Reading - 40 questions)
 */
export const convertAcademicReadingRawToBand = (raw: number): number => {
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r >= 39) return 9.0;
  if (r >= 37) return 8.5;
  if (r >= 35) return 8.0;
  if (r >= 33) return 7.5;
  if (r >= 30) return 7.0;
  if (r >= 27) return 6.5;
  if (r >= 23) return 6.0;
  if (r >= 19) return 5.5;
  if (r >= 15) return 5.0;
  if (r >= 13) return 4.5;
  if (r >= 10) return 4.0;
  if (r >= 8) return 3.5;
  if (r >= 6) return 3.0;
  if (r >= 4) return 2.5;
  return 2.0;
};

/**
 * Cambridge IELTS Raw Score to Band Conversion (General Training Reading - 40 questions)
 */
export const convertGeneralReadingRawToBand = (raw: number): number => {
  const r = Math.max(0, Math.min(40, Math.round(raw)));
  if (r === 40) return 9.0;
  if (r === 39) return 8.5;
  if (r >= 37) return 8.0;
  if (r === 36) return 7.5;
  if (r >= 34) return 7.0;
  if (r >= 32) return 6.5;
  if (r >= 30) return 6.0;
  if (r >= 27) return 5.5;
  if (r >= 23) return 5.0;
  if (r >= 19) return 4.5;
  if (r >= 15) return 4.0;
  if (r >= 12) return 3.5;
  if (r >= 9) return 3.0;
  if (r >= 6) return 2.5;
  return 2.0;
};

export interface RawScoreConversionDetail {
  rawScore: number;
  maxScore: number;
  band: number;
  cefr: string;
  minRawForCurrentBand: number;
  maxRawForCurrentBand: number;
  nextBand: number | null;
  neededForNextBand: number | null;
}

/**
 * Calculates detailed band conversion metadata, score brackets, and gap to next band
 */
export const getRawScoreBandDetail = (
  raw: number,
  module: 'listening' | 'academicReading' | 'generalReading'
): RawScoreConversionDetail => {
  const safeRaw = Math.max(0, Math.min(40, Math.round(Number(raw) || 0)));
  const converter =
    module === 'listening'
      ? convertListeningRawToBand
      : module === 'academicReading'
      ? convertAcademicReadingRawToBand
      : convertGeneralReadingRawToBand;

  const currentBand = converter(safeRaw);
  const cefr = getIELTSCefr(currentBand);

  let minRaw = safeRaw;
  while (minRaw > 0 && converter(minRaw - 1) === currentBand) {
    minRaw--;
  }

  let maxRaw = safeRaw;
  while (maxRaw < 40 && converter(maxRaw + 1) === currentBand) {
    maxRaw++;
  }

  let nextBand: number | null = null;
  let neededForNextBand: number | null = null;

  for (let r = safeRaw + 1; r <= 40; r++) {
    const b = converter(r);
    if (b > currentBand) {
      nextBand = b;
      neededForNextBand = r - safeRaw;
      break;
    }
  }

  return {
    rawScore: safeRaw,
    maxScore: 40,
    band: currentBand,
    cefr,
    minRawForCurrentBand: minRaw,
    maxRawForCurrentBand: maxRaw,
    nextBand,
    neededForNextBand
  };
};

export const countWords = (text?: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export interface IELTSAuditReport {
  totalTestsAudited: number;
  totalStudentsAudited: number;
  verifiedAccurateCount: number;
  discrepanciesCount: number;
  overallAccuracyRate: number; // e.g. 100%
  averageOverallBand: number | null;
  averageListening: number | null;
  averageReading: number | null;
  averageWriting: number | null;
  averageSpeaking: number | null;
  highestSkill: { skill: string; avg: number } | null;
  lowestSkill: { skill: string; avg: number } | null;
  averageImprovement: number | null; // delta from first to last test; null if no repeated attempts
  hasRecords: boolean;
  auditTimestamp: string;
}

export const auditStudentHistory = (history: IELTSMockTestHistoryEntry[]): {
  isValid: boolean;
  entriesAudited: number;
  anomalies: string[];
  progressionDelta: number | null;
} => {
  const anomalies: string[] = [];
  if (!history || history.length === 0) {
    return { isValid: true, entriesAudited: 0, anomalies: [], progressionDelta: null };
  }

  history.forEach((entry, idx) => {
    // Validate individual band boundaries
    ['listening', 'reading', 'writing', 'speaking'].forEach((skill) => {
      const val = entry[skill as keyof IELTSMockTestHistoryEntry] as number;
      if (!isValidIELTSBand(val)) {
        anomalies.push(`Entry #${idx + 1} (${entry.testTitle}): Invalid ${skill} score: ${val}`);
      }
    });

    const expected = calculateIELTSOverall(entry.listening, entry.reading, entry.writing, entry.speaking);
    if (Math.abs(entry.overall - expected) > 0.01) {
      anomalies.push(`Entry #${idx + 1} (${entry.testTitle}): Recorded overall ${entry.overall} does not match official calculation ${expected}`);
    }
  });

  const progressionDelta = history.length >= 2 
    ? Number((history[history.length - 1].overall - history[0].overall).toFixed(1))
    : null;

  return {
    isValid: anomalies.length === 0,
    entriesAudited: history.length,
    anomalies,
    progressionDelta
  };
};

export const runFullIELTSAudit = (leads: Lead[]): IELTSAuditReport => {
  let totalTests = 0;
  let accurateTests = 0;
  let discrepancies = 0;
  let sumOverall = 0;
  let sumL = 0;
  let sumR = 0;
  let sumW = 0;
  let sumS = 0;
  let studentImprovementSum = 0;
  let studentImprovementCount = 0;

  const ieltsLeads = (leads || []).filter((l) => l.ieltsData);

  ieltsLeads.forEach((lead) => {
    const ielts = lead.ieltsData!;
    const history = ielts.history || [];

    if (history.length > 0) {
      history.forEach((entry) => {
        totalTests++;
        sumOverall += entry.overall;
        sumL += entry.listening;
        sumR += entry.reading;
        sumW += entry.writing;
        sumS += entry.speaking;

        const expected = calculateIELTSOverall(entry.listening, entry.reading, entry.writing, entry.speaking);
        if (Math.abs(entry.overall - expected) < 0.01) {
          accurateTests++;
        } else {
          discrepancies++;
        }
      });

      if (history.length >= 2) {
        studentImprovementSum += (history[history.length - 1].overall - history[0].overall);
        studentImprovementCount++;
      }
    } else if (ielts.scores) {
      totalTests++;
      sumOverall += ielts.scores.overall;
      sumL += ielts.scores.listening;
      sumR += ielts.scores.reading;
      sumW += ielts.scores.writing;
      sumS += ielts.scores.speaking;

      const expected = calculateIELTSOverall(
        ielts.scores.listening,
        ielts.scores.reading,
        ielts.scores.writing,
        ielts.scores.speaking
      );
      if (Math.abs(ielts.scores.overall - expected) < 0.01) {
        accurateTests++;
      } else {
        discrepancies++;
      }
    }
  });

  const hasRecords = totalTests > 0;

  if (!hasRecords) {
    return {
      totalTestsAudited: 0,
      totalStudentsAudited: 0,
      verifiedAccurateCount: 0,
      discrepanciesCount: 0,
      overallAccuracyRate: 0,
      averageOverallBand: null,
      averageListening: null,
      averageReading: null,
      averageWriting: null,
      averageSpeaking: null,
      highestSkill: null,
      lowestSkill: null,
      averageImprovement: null,
      hasRecords: false,
      auditTimestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
  }

  const avgOverall = Number((sumOverall / totalTests).toFixed(1));
  const avgL = Number((sumL / totalTests).toFixed(1));
  const avgR = Number((sumR / totalTests).toFixed(1));
  const avgW = Number((sumW / totalTests).toFixed(1));
  const avgS = Number((sumS / totalTests).toFixed(1));

  const skills = [
    { skill: 'Listening', avg: avgL },
    { skill: 'Reading', avg: avgR },
    { skill: 'Writing', avg: avgW },
    { skill: 'Speaking', avg: avgS }
  ].sort((a, b) => b.avg - a.avg);

  return {
    totalTestsAudited: totalTests,
    totalStudentsAudited: ieltsLeads.length,
    verifiedAccurateCount: accurateTests,
    discrepanciesCount: discrepancies,
    overallAccuracyRate: Number(((accurateTests / totalTests) * 100).toFixed(1)),
    averageOverallBand: avgOverall,
    averageListening: avgL,
    averageReading: avgR,
    averageWriting: avgW,
    averageSpeaking: avgS,
    highestSkill: skills[0],
    lowestSkill: skills[skills.length - 1],
    averageImprovement: studentImprovementCount > 0 ? Number((studentImprovementSum / studentImprovementCount).toFixed(1)) : null,
    hasRecords: true,
    auditTimestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };
};
