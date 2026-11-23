import { supabase, isConfigured } from './supabase';
import { SavingsTransaction, SavingsSummary, SavingsType } from '../types';

const MOCK_STORAGE_KEY = 'simkopdes_local_store';

function getLocalStore() {
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (!data) return { users: [], profiles: [], members: [], savings: [], activeSession: null };
  try {
    return JSON.parse(data);
  } catch {
    return { users: [], profiles: [], members: [], savings: [], activeSession: null };
  }
}

function saveLocalStore(store: unknown) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
}

export const savingsService = {
  /**
   * Get savings transactions for a specific member (Read-Only for Member, AC-020, AC-021)
   */
  async getSavingsByMemberId(memberId: string): Promise<SavingsTransaction[]> {
    if (!memberId) return [];

    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('savings')
          .select('*')
          .eq('member_id', memberId)
          .order('tanggal_transaksi', { ascending: false });

        if (error) {
          console.error('Error fetching savings:', error);
          return [];
        }
        return data || [];
      } catch {
        return [];
      }
    }

    const store = getLocalStore();
    return (store.savings || [])
      .filter((s: any) => s.member_id === memberId)
      .sort((a: any, b: any) => new Date(b.tanggal_transaksi).getTime() - new Date(a.tanggal_transaksi).getTime());
  },

  /**
   * Calculate aggregated summary of savings for a member (AC-018, AC-019)
   */
  async getSavingsSummary(memberId: string): Promise<SavingsSummary> {
    const transactions = await this.getSavingsByMemberId(memberId);

    const summary: SavingsSummary = {
      total: 0,
      pokok: 0,
      wajib: 0,
      sukarela: 0,
      transactionCount: transactions.length,
    };

    for (const tx of transactions) {
      const amount = Number(tx.nominal) || 0;
      summary.total += amount;

      if (tx.jenis === 'pokok') {
        summary.pokok += amount;
      } else if (tx.jenis === 'wajib') {
        summary.wajib += amount;
      } else if (tx.jenis === 'sukarela') {
        summary.sukarela += amount;
      }
    }

    return summary;
  },

  /**
   * Record a savings transaction (Admin / Pengurus action, DEC-04)
   */
  async recordSavings(data: {
    member_id: string;
    jenis: SavingsType;
    nominal: number;
    keterangan?: string;
  }): Promise<{ success: boolean; error: string | null }> {
    if (data.nominal <= 0) {
      return { success: false, error: 'Nominal simpanan harus lebih besar dari 0.' };
    }

    if (isConfigured) {
      try {
        const { error } = await supabase.from('savings').insert([
          {
            member_id: data.member_id,
            jenis: data.jenis,
            nominal: data.nominal,
            keterangan: data.keterangan || null,
          },
        ]);

        if (error) return { success: false, error: error.message };
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message || 'Gagal mencatat transaksi simpanan.' };
      }
    }

    const store = getLocalStore();
    const newTx: SavingsTransaction = {
      id: `sav-${Date.now()}`,
      member_id: data.member_id,
      jenis: data.jenis,
      nominal: data.nominal,
      tanggal_transaksi: new Date().toISOString(),
      keterangan: data.keterangan || null,
    };

    store.savings = store.savings || [];
    store.savings.push(newTx);
    saveLocalStore(store);

    return { success: true, error: null };
  },
};
