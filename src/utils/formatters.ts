/**
 * Format number to Indonesian Rupiah currency format
 * e.g. 500000 -> "Rp 500.000"
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string to Indonesian localized date
 * e.g. "2026-11-23T10:00:00Z" -> "23 November 2026"
 */
export function formatIndonesianDate(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '-';
  }
}

/**
 * Mask NIK for privacy compliance (AC-027, AC-041)
 * e.g. "3201123456780001" -> "3201********0001"
 */
export function maskNIK(nik: string): string {
  if (!nik || nik.length < 8) return nik || '-';
  const prefix = nik.slice(0, 4);
  const suffix = nik.slice(-4);
  const maskedLength = Math.max(0, nik.length - 8);
  return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
}

/**
 * Normalize Indonesian phone numbers to standard format
 * e.g. "08123456789" or "+628123456789"
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return `0${cleaned.slice(2)}`;
  }
  return cleaned;
}
