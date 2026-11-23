import { AccountDeletionRequest, DomisiliTransferRequest } from '../types';

const DELETION_KEY = 'simkopdes_account_deletions';
const DOMISILI_KEY = 'simkopdes_domisili_transfers';

function getStore<T>(key: string, defaultVal: T[]): T[] {
  const data = localStorage.getItem(key);
  if (!data) return defaultVal;
  try {
    return JSON.parse(data);
  } catch {
    return defaultVal;
  }
}

function saveStore<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const accountActionService = {
  // --- Account Deletion Requests (PRD v2.0 FR-04) ---
  async requestAccountDeletion(params: {
    member_id: string;
    nama_anggota: string;
    nomor_anggota: string;
    alasan: string;
  }): Promise<{ success: boolean; data?: AccountDeletionRequest; error?: string }> {
    if (!params.alasan.trim()) {
      return { success: false, error: 'Alasan pengajuan penghapusan akun wajib diisi.' };
    }

    const items = getStore<AccountDeletionRequest>(DELETION_KEY, []);
    const existingActive = items.find(
      (item) => item.member_id === params.member_id && item.status === 'menunggu'
    );
    if (existingActive) {
      return { success: false, error: 'Anda sudah memiliki permohonan penghapusan akun yang sedang ditinjau.' };
    }

    const newReq: AccountDeletionRequest = {
      id: `del-${Date.now()}`,
      member_id: params.member_id,
      nama_anggota: params.nama_anggota,
      nomor_anggota: params.nomor_anggota,
      alasan: params.alasan.trim(),
      status: 'menunggu',
      tanggal_pengajuan: new Date().toISOString(),
    };

    items.unshift(newReq);
    saveStore(DELETION_KEY, items);
    return { success: true, data: newReq };
  },

  async getDeletionRequests(memberId?: string): Promise<AccountDeletionRequest[]> {
    const items = getStore<AccountDeletionRequest>(DELETION_KEY, []);
    if (memberId) {
      return items.filter((item) => item.member_id === memberId);
    }
    return items;
  },

  async updateDeletionStatus(
    requestId: string,
    status: 'menunggu' | 'disetujui' | 'ditolak',
    catatan?: string
  ): Promise<{ success: boolean; error?: string }> {
    const items = getStore<AccountDeletionRequest>(DELETION_KEY, []);
    const idx = items.findIndex((i) => i.id === requestId);
    if (idx === -1) return { success: false, error: 'Permohonan tidak ditemukan.' };

    items[idx].status = status;
    if (catatan) items[idx].catatan_pengurus = catatan;
    saveStore(DELETION_KEY, items);
    return { success: true };
  },

  // --- Domisili Transfer Requests (PRD v2.0 FR-03) ---
  async requestDomisiliTransfer(params: {
    member_id: string;
    nama_anggota: string;
    nomor_anggota: string;
    desa_asal: string;
    desa_tujuan: string;
    alasan: string;
  }): Promise<{ success: boolean; data?: DomisiliTransferRequest; error?: string }> {
    if (!params.desa_tujuan) {
      return { success: false, error: 'Pilih desa domisili tujuan.' };
    }
    if (params.desa_asal === params.desa_tujuan) {
      return { success: false, error: 'Desa tujuan tidak boleh sama dengan domisili asal.' };
    }
    if (!params.alasan.trim()) {
      return { success: false, error: 'Alasan perpindahan domisili koperasi wajib diisi.' };
    }

    const items = getStore<DomisiliTransferRequest>(DOMISILI_KEY, []);
    const existing = items.find(
      (item) => item.member_id === params.member_id && item.status === 'menunggu'
    );
    if (existing) {
      return { success: false, error: 'Anda masih memiliki permohonan perpindahan domisili yang sedang menunggu verifikasi.' };
    }

    const newReq: DomisiliTransferRequest = {
      id: `dom-${Date.now()}`,
      member_id: params.member_id,
      nama_anggota: params.nama_anggota,
      nomor_anggota: params.nomor_anggota,
      desa_asal: params.desa_asal,
      desa_tujuan: params.desa_tujuan,
      alasan: params.alasan.trim(),
      status: 'menunggu',
      tanggal_pengajuan: new Date().toISOString(),
    };

    items.unshift(newReq);
    saveStore(DOMISILI_KEY, items);
    return { success: true, data: newReq };
  },

  async getDomisiliTransferRequests(memberId?: string): Promise<DomisiliTransferRequest[]> {
    const items = getStore<DomisiliTransferRequest>(DOMISILI_KEY, []);
    if (memberId) {
      return items.filter((item) => item.member_id === memberId);
    }
    return items;
  },

  async updateDomisiliStatus(
    requestId: string,
    status: 'menunggu' | 'disetujui' | 'ditolak',
    catatan?: string
  ): Promise<{ success: boolean; error?: string }> {
    const items = getStore<DomisiliTransferRequest>(DOMISILI_KEY, []);
    const idx = items.findIndex((i) => i.id === requestId);
    if (idx === -1) return { success: false, error: 'Permohonan perpindahan tidak ditemukan.' };

    items[idx].status = status;
    if (catatan) items[idx].catatan_pengurus = catatan;
    saveStore(DOMISILI_KEY, items);
    return { success: true };
  },
};
