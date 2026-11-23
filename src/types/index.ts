export type UserRole = 'anggota' | 'pengurus';
export type MemberStatus = 'pending' | 'aktif' | 'nonaktif';
export type SavingsType = 'pokok' | 'wajib' | 'sukarela';
export type LoanStatus = 'diajukan' | 'disetujui' | 'ditolak' | 'lunas';

export const DAFTAR_DESA = [
  'Desa Sukamaju',
  'Desa Sukamakmur',
  'Desa Karanganyar',
  'Desa Wanasari',
  'Desa Mekarjaya',
  'Desa Tanjungwangi',
] as const;

export type NamaDesa = (typeof DAFTAR_DESA)[number];

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
  domisili_desa?: string;
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

// Fitur Baru: Pengajuan Perpindahan Domisili Koperasi (PRD v2.0 FR-03)
export interface DomisiliTransferRequest {
  id: string;
  member_id: string;
  nama_anggota: string;
  nomor_anggota: string;
  desa_asal: string;
  desa_tujuan: string;
  alasan: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  tanggal_pengajuan: string;
  catatan_pengurus?: string;
}

// Fitur Baru: Pengajuan Penghapusan Akun (PRD v2.0 FR-04)
export interface AccountDeletionRequest {
  id: string;
  member_id: string;
  nama_anggota: string;
  nomor_anggota: string;
  alasan: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  tanggal_pengajuan: string;
  catatan_pengurus?: string;
}

// Fitur Baru: Helpdesk Internal & Chat (PRD v2.0 FR-05)
export type TicketStatus = 'menunggu' | 'ditangani' | 'selesai';
export type TicketCategory = 'Akun' | 'Simpanan' | 'Domisili' | 'Layanan' | 'Lainnya';

export interface HelpdeskTicket {
  id: string;
  member_id: string;
  nama_pengadu: string;
  nomor_anggota: string;
  judul: string;
  kategori: TicketCategory;
  status: TicketStatus;
  tanggal_buat: string;
  updated_at: string;
  unread_by_member?: boolean;
  unread_by_admin?: boolean;
}

export interface HelpdeskMessage {
  id: string;
  ticket_id: string;
  sender_role: 'anggota' | 'pengurus' | 'system_bot';
  sender_name: string;
  message: string;
  tanggal_kirim: string;
}
