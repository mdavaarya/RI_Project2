import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import { memberService } from '../services/memberService';
import { savingsService } from '../services/savingsService';

describe('Authentication & Registration Logic (AC-006, AC-008, AC-012 - AC-016)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('AC-006: Rejects login with empty fields', async () => {
    const res = await authService.login('', '');
    expect(res.session).toBeNull();
    expect(res.error).toBe('Email dan kata sandi wajib diisi.');
  });

  it('AC-008: Prevents user enumeration on failed login with safe error message', async () => {
    const res = await authService.login('nonexistent@example.com', 'wrongpassword');
    expect(res.session).toBeNull();
    expect(res.error).toBe('Email atau kata sandi tidak cocok. Silakan periksa kembali.');
  });

  it('AC-013 & AC-014: Validates registration fields (NIK 16 digits, email, name)', async () => {
    const invalidNIK = await authService.register({
      nama: 'Budi',
      nik: '12345', // invalid length
      alamat: 'Desa Sukamaju',
      no_hp: '08123456789',
      email: 'budi@example.com',
      password: 'password123',
    });
    expect(invalidNIK.success).toBe(false);
    expect(invalidNIK.error).toContain('16 digit');

    const invalidEmail = await authService.register({
      nama: 'Budi',
      nik: '1234567890123456',
      alamat: 'Desa Sukamaju',
      no_hp: '08123456789',
      email: 'invalid-email',
      password: 'password123',
    });
    expect(invalidEmail.success).toBe(false);
    expect(invalidEmail.error).toContain('email');
  });

  it('AC-015 & AC-017: Successful registration assigns pending status per DEC-02', async () => {
    const res = await authService.register({
      nama: 'Siti Aminah',
      nik: '3201012345670001',
      alamat: 'Dusun Melati RT 01 RW 02',
      no_hp: '081234567890',
      email: 'siti@example.com',
      password: 'password123',
    });

    expect(res.success).toBe(true);
    expect(res.member).not.toBeNull();
    expect(res.member?.status).toBe('pending'); // DEC-02: Pending verification
    expect(res.member?.nomor_anggota).toMatch(/^ANG-\d{6}$/);

    // Can login afterwards
    const loginRes = await authService.login('siti@example.com', 'password123');
    expect(loginRes.session).not.toBeNull();
    expect(loginRes.session?.member?.status).toBe('pending');
  });

  it('AC-016: Prevents duplicate registration with the same email', async () => {
    await authService.register({
      nama: 'Ahmad',
      nik: '3201012345670002',
      alamat: 'Dusun Mawar',
      no_hp: '08111222333',
      email: 'ahmad@example.com',
      password: 'password123',
    });

    const duplicate = await authService.register({
      nama: 'Ahmad Duplikat',
      nik: '3201012345670003',
      alamat: 'Dusun Mawar',
      no_hp: '08111222444',
      email: 'ahmad@example.com',
      password: 'password456',
    });

    expect(duplicate.success).toBe(false);
    expect(duplicate.error).toContain('sudah terdaftar');
  });
});

describe('Savings Balance and Aggregation (AC-018, AC-019, AC-020, AC-023)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('AC-023: Empty savings return zero total without fake numbers', async () => {
    const summary = await savingsService.getSavingsSummary('empty-member-id');
    expect(summary.total).toBe(0);
    expect(summary.pokok).toBe(0);
    expect(summary.wajib).toBe(0);
    expect(summary.sukarela).toBe(0);
    expect(summary.transactionCount).toBe(0);
  });

  it('AC-019: Accurately calculates sum across pokok, wajib, and sukarela', async () => {
    const memberId = 'mem-test-1';

    await savingsService.recordSavings({
      member_id: memberId,
      jenis: 'pokok',
      nominal: 100000,
      keterangan: 'Simpanan Pokok Awal',
    });

    await savingsService.recordSavings({
      member_id: memberId,
      jenis: 'wajib',
      nominal: 25000,
      keterangan: 'Simpanan Wajib Bulan 1',
    });

    await savingsService.recordSavings({
      member_id: memberId,
      jenis: 'sukarela',
      nominal: 50000,
      keterangan: 'Setoran Sukarela',
    });

    const summary = await savingsService.getSavingsSummary(memberId);
    expect(summary.pokok).toBe(100000);
    expect(summary.wajib).toBe(25000);
    expect(summary.sukarela).toBe(50000);
    expect(summary.total).toBe(175000);
    expect(summary.transactionCount).toBe(3);
  });
});
