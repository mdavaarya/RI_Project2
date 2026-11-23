import { describe, it, expect } from 'vitest';
import { formatRupiah, formatIndonesianDate, maskNIK, normalizePhoneNumber } from '../utils/formatters';

describe('Formatters and Privacy Protection (AC-027, AC-037, AC-041)', () => {
  it('formats Rupiah correctly with Indonesian locale', () => {
    expect(formatRupiah(500000)).toMatch(/Rp\s?500\.000/);
    expect(formatRupiah(0)).toMatch(/Rp\s?0/);
    expect(formatRupiah(NaN)).toBe('Rp 0');
  });

  it('formats Indonesian date correctly', () => {
    const formatted = formatIndonesianDate('2026-11-23T00:00:00Z');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('November');
    expect(formatted).toContain('23');
  });

  it('masks NIK to protect personal privacy according to AC-027 & AC-041', () => {
    const rawNIK = '3201123456780001';
    const masked = maskNIK(rawNIK);
    expect(masked).toBe('3201********0001');
    expect(masked).not.toBe(rawNIK);
    expect(masked.length).toBe(16);
  });

  it('normalizes Indonesian telephone numbers', () => {
    expect(normalizePhoneNumber('0812-3456-7890')).toBe('081234567890');
    expect(normalizePhoneNumber('+6281234567890')).toBe('081234567890');
  });
});
