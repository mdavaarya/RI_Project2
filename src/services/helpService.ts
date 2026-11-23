import { supabase, isConfigured } from './supabase';
import { HelpContent } from '../types';

// Default static help content adhering to PRD v1.1 and FR-05
export const DEFAULT_HELP_CONTENTS: HelpContent[] = [
  {
    id: 'h1',
    halaman_terkait: 'login',
    judul: 'Cara Masuk ke Akun SIMKOPDES',
    konten: 'Gunakan alamat email dan kata sandi yang telah Anda daftarkan. Pastikan huruf besar dan kecil sesuai. Bila Anda lupa kata sandi, klik tombol "Lupa Kata Sandi" untuk melakukan pemulihan.',
    urutan_tampil: 1,
  },
  {
    id: 'h2',
    halaman_terkait: 'pendaftaran',
    judul: 'Panduan Pendaftaran Anggota Baru',
    konten: 'Calon anggota melengkapi formulir dengan Nama Lengkap, NIK 16 digit angka, Alamat Domisili, Nomor HP/WhatsApp aktif, Email, serta Kata Sandi akun. Setelah formulir dikirim, permohonan Anda tercatat dengan status Menunggu (Pending).',
    urutan_tampil: 2,
  },
  {
    id: 'h3',
    halaman_terkait: 'dashboard_anggota',
    judul: 'Memahami Status Keanggotaan dan Saldo Simpanan',
    konten: 'Beranda anggota menyajikan status keanggotaan Anda (Menunggu, Aktif, atau Nonaktif) dan total saldo simpanan riil (Simpanan Pokok, Simpanan Wajib, dan Simpanan Sukarela) yang tersimpan di sistem.',
    urutan_tampil: 3,
  },
  {
    id: 'h4',
    halaman_terkait: 'riwayat_simpanan',
    judul: 'Riwayat Transaksi Simpanan',
    konten: 'Pada menu Riwayat Simpanan, Anda dapat melihat rincian setiap transaksi simpanan Anda, meliputi jenis simpanan, tanggal transaksi, nominal, dan catatan transaksi dari pengurus.',
    urutan_tampil: 4,
  },
  {
    id: 'h5',
    halaman_terkait: 'profil',
    judul: 'Profil dan Data Keanggotaan',
    konten: 'Halaman ini menampilkan data diri anggota. Nomor Anggota dan Status Keanggotaan ditentukan oleh koperasi dan tidak dapat diedit secara bebas demi keamanan data Anda.',
    urutan_tampil: 5,
  },
  {
    id: 'h6',
    halaman_terkait: 'kelola_anggota',
    judul: 'Panduan Pengurus: Kelola Anggota',
    konten: 'Pengurus koperasi dapat meninjau daftar permohonan pendaftaran anggota, memeriksa data anggota, dan memperbarui status keanggotaan sesuai hasil verifikasi lapangan.',
    urutan_tampil: 6,
  },
];

export const helpService = {
  /**
   * Get all help contents or filter by related page (AC-032)
   */
  async getHelpContents(halamanTerkait?: string): Promise<HelpContent[]> {
    if (isConfigured) {
      try {
        let query = supabase
          .from('help_contents')
          .select('*')
          .order('urutan_tampil', { ascending: true });

        if (halamanTerkait) {
          query = query.eq('halaman_terkait', halamanTerkait);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch {
        // Fall back to static content
      }
    }

    if (halamanTerkait) {
      return DEFAULT_HELP_CONTENTS.filter(h => h.halaman_terkait === halamanTerkait);
    }
    return DEFAULT_HELP_CONTENTS;
  },
};
