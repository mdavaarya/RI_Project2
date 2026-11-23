export type UserRole = 'anggota' | 'pengurus';
export type MemberStatus = 'pending' | 'aktif' | 'nonaktif';
export type SavingsType = 'pokok' | 'wajib' | 'sukarela';
export type LoanStatus = 'diajukan' | 'disetujui' | 'ditolak' | 'lunas';

export interface Profile {
  id: string;
  role: UserRole;
  nama: string;
  no_hp?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  profile_id: string;
  nomor_anggota: string;
  nik: string;
  alamat: string;
  status: MemberStatus;
  tanggal_daftar: string;
  profile?: Profile;
}

export interface SavingsTransaction {
  id: string;
  member_id: string;
  jenis: SavingsType;
  nominal: number;
  tanggal_transaksi: string;
  keterangan?: string | null;
}

export interface SavingsSummary {
  total: number;
  pokok: number;
  wajib: number;
  sukarela: number;
  transactionCount: number;
}

export interface LoanPlaceholder {
  id: string;
  member_id: string;
  jumlah_pengajuan: number;
  status: LoanStatus;
  tanggal_pengajuan: string;
}

export interface HelpContent {
  id: string;
  halaman_terkait: string;
  judul: string;
  konten: string;
  urutan_tampil: number;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  aksi: string;
  timestamp: string;
  detail?: Record<string, unknown> | null;
}
