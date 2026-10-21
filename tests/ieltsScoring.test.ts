import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateIELTSOverall,
  isValidIELTSBand,
  sanitizeIELTSBand,
  getIELTSCefr,
  convertListeningRawToBand,
  convertAcademicReadingRawToBand,
  convertGeneralReadingRawToBand,
  auditStudentHistory,
  runFullIELTSAudit
} from '../src/utils/ieltsAudit.js';

test('IELTS Overall Rounding Rule verification according to Cambridge/IDP specification', () => {
  // Fractional part < 0.25 rounds down
  assert.equal(calculateIELTSOverall(6.5, 6.5, 6.0, 5.5), 6.0); // avg = 6.125 -> 6.0
  assert.equal(calculateIELTSOverall(7.0, 7.0, 7.0, 7.0), 7.0); // avg = 7.0 -> 7.0

  // Fractional part >= 0.25 and < 0.75 rounds to half band
  assert.equal(calculateIELTSOverall(6.5, 6.5, 6.0, 6.0), 6.5); // avg = 6.25 -> 6.5
  assert.equal(calculateIELTSOverall(6.5, 6.5, 6.5, 6.0), 6.5); // avg = 6.375 -> 6.5
  assert.equal(calculateIELTSOverall(6.5, 6.5, 6.5, 6.5), 6.5); // avg = 6.5 -> 6.5
  assert.equal(calculateIELTSOverall(7.0, 6.5, 6.5, 6.5), 6.5); // avg = 6.625 -> 6.5

  // Fractional part >= 0.75 rounds up to next whole band
  assert.equal(calculateIELTSOverall(7.0, 7.0, 6.5, 6.5), 7.0); // avg = 6.75 -> 7.0
  assert.equal(calculateIELTSOverall(7.5, 7.0, 6.5, 6.5), 7.0); // avg = 6.875 -> 7.0
});

test('Valid band checking and input sanitization', () => {
  assert.equal(isValidIELTSBand(7.5), true);
  assert.equal(isValidIELTSBand(9.0), true);
  assert.equal(isValidIELTSBand(0.0), true);
  assert.equal(isValidIELTSBand(7.3), false); // Not a valid half-band
  assert.equal(isValidIELTSBand(10.0), false); // Exceeds 9.0
  assert.equal(isValidIELTSBand(-1.0), false); // Negative
  assert.equal(isValidIELTSBand(NaN), false);
  assert.equal(isValidIELTSBand(null), false);

  assert.equal(sanitizeIELTSBand(7.3), 7.5);
  assert.equal(sanitizeIELTSBand(-5), 0);
  assert.equal(sanitizeIELTSBand(12), 9);
});

test('CEFR Level mapping verification', () => {
  assert.equal(getIELTSCefr(8.5), 'C2 Mastery (Native-like)');
  assert.equal(getIELTSCefr(7.5), 'C1 Advanced (Effective Operational)');
  assert.equal(getIELTSCefr(6.0), 'B2 Independent (Vantage)');
  assert.equal(getIELTSCefr(4.5), 'B1 Threshold (Intermediate)');
  assert.equal(getIELTSCefr(3.0), 'A2 Waystage (Basic)');
});

test('Raw Score Conversion Tables (40 questions)', () => {
  // Listening
  assert.equal(convertListeningRawToBand(40), 9.0);
  assert.equal(convertListeningRawToBand(39), 9.0);
  assert.equal(convertListeningRawToBand(35), 8.0);
  assert.equal(convertListeningRawToBand(30), 7.0);
  assert.equal(convertListeningRawToBand(23), 6.0);
  assert.equal(convertListeningRawToBand(16), 5.0);

  // Academic Reading
  assert.equal(convertAcademicReadingRawToBand(40), 9.0);
  assert.equal(convertAcademicReadingRawToBand(35), 8.0);
  assert.equal(convertAcademicReadingRawToBand(30), 7.0);
  assert.equal(convertAcademicReadingRawToBand(23), 6.0);

  // General Reading
  assert.equal(convertGeneralReadingRawToBand(40), 9.0);
  assert.equal(convertGeneralReadingRawToBand(39), 8.5);
  assert.equal(convertGeneralReadingRawToBand(34), 7.0);
  assert.equal(convertGeneralReadingRawToBand(30), 6.0);
});

test('Honest empty state handling when no records exist', () => {
  const audit = runFullIELTSAudit([]);
  assert.equal(audit.totalTestsAudited, 0);
  assert.equal(audit.hasRecords, false);
  assert.equal(audit.averageOverallBand, null);
  assert.equal(audit.averageImprovement, null);
});
