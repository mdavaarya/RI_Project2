import { supabase, isConfigured } from './supabase';
import { Member, Profile, MemberStatus } from '../types';

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

export const memberService = {
  /**
   * Get member profile by profile_id
   */
  async getMemberByProfileId(profileId: string): Promise<Member | null> {
    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*, profile:profiles(*)')
          .eq('profile_id', profileId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching member:', error);
          return null;
        }
        return data;
      } catch {
        return null;
      }
    }

    const store = getLocalStore();
    const mem = store.members.find((m: any) => m.profile_id === profileId);
    if (!mem) return null;
    const prof = store.profiles.find((p: any) => p.id === profileId);
    return { ...mem, profile: prof };
  },

  /**
   * Get all members (Protected for Pengurus, AC-025, AC-027)
   */
  async getAllMembers(): Promise<Member[]> {
    if (isConfigured) {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*, profile:profiles(*)')
          .order('tanggal_daftar', { ascending: false });

        if (error) {
          console.error('Error fetching members list:', error);
          return [];
        }
        return data || [];
      } catch {
        return [];
      }
    }

    const store = getLocalStore();
    return store.members.map((m: any) => {
      const prof = store.profiles.find((p: any) => p.id === m.profile_id);
      return { ...m, profile: prof };
    });
  },

  /**
   * Update member status by Pengurus (AC-028)
   */
  async updateMemberStatus(memberId: string, status: MemberStatus): Promise<{ success: boolean; error: string | null }> {
    if (isConfigured) {
      try {
        const { error } = await supabase
          .from('members')
          .update({ status })
          .eq('id', memberId);

        if (error) return { success: false, error: error.message };
        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message || 'Gagal mengubah status anggota.' };
      }
    }

    const store = getLocalStore();
    const memIndex = store.members.findIndex((m: any) => m.id === memberId);
    if (memIndex === -1) {
      return { success: false, error: 'Data anggota tidak ditemukan.' };
    }

    store.members[memIndex].status = status;
    saveLocalStore(store);
    return { success: true, error: null };
  },

  /**
   * Update member profile and address
   */
  async updateProfile(
    profileId: string,
    data: { nama?: string; no_hp?: string; alamat?: string; memberId?: string }
  ): Promise<{ success: boolean; error: string | null }> {
    const { nama, no_hp, alamat, memberId } = data;

    if (isConfigured) {
      try {
        if (nama !== undefined || no_hp !== undefined) {
          const profileUpdate: Record<string, any> = { updated_at: new Date().toISOString() };
          if (nama !== undefined) profileUpdate.nama = nama;
          if (no_hp !== undefined) profileUpdate.no_hp = no_hp;

          const { error: profError } = await supabase
            .from('profiles')
            .update(profileUpdate)
            .eq('id', profileId);

          if (profError) return { success: false, error: profError.message };
        }

        if (alamat !== undefined) {
          const query = memberId
            ? supabase.from('members').update({ alamat }).eq('id', memberId)
            : supabase.from('members').update({ alamat }).eq('profile_id', profileId);

          const { error: memError } = await query;
          if (memError) return { success: false, error: memError.message };
        }

        return { success: true, error: null };
      } catch (err: any) {
        return { success: false, error: err.message || 'Gagal memperbarui profil.' };
      }
    }

    const store = getLocalStore();
    const profIndex = store.profiles.findIndex((p: any) => p.id === profileId);
    if (profIndex !== -1) {
      store.profiles[profIndex] = {
        ...store.profiles[profIndex],
        ...(nama !== undefined ? { nama } : {}),
        ...(no_hp !== undefined ? { no_hp } : {}),
        updated_at: new Date().toISOString(),
      };
    }

    if (alamat !== undefined) {
      const memIndex = store.members.findIndex((m: any) =>
        memberId ? m.id === memberId : m.profile_id === profileId
      );
      if (memIndex !== -1) {
        store.members[memIndex].alamat = alamat;
      }
      if (store.activeSession?.member) {
        store.activeSession.member.alamat = alamat;
      }
    }

    if (store.activeSession?.profile && profIndex !== -1) {
      store.activeSession.profile = { ...store.profiles[profIndex] };
    }

    saveLocalStore(store);
    return { success: true, error: null };
  },

  /**
   * Get member counts by status (for Pengurus dashboard, AC-026)
   */
  async getMemberCounts(): Promise<{ total: number; pending: number; aktif: number; nonaktif: number }> {
    const members = await this.getAllMembers();
    return {
      total: members.length,
      pending: members.filter(m => m.status === 'pending').length,
      aktif: members.filter(m => m.status === 'aktif').length,
      nonaktif: members.filter(m => m.status === 'nonaktif').length,
    };
  },
};
