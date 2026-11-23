import { supabase, isConfigured } from './supabase';
import { Profile, Member } from '../types';

export interface UserSession {
  user: {
    id: string;
    email: string;
  };
  profile: Profile | null;
  member: Member | null;
}

// Local mock storage key for offline / fallback mode
const MOCK_STORAGE_KEY = 'simkopdes_local_store';

const DEFAULT_USERS = [
  {
    id: 'usr-pengurus-demo',
    email: 'admin@simkopdes.id',
    aliases: ['admin', 'pengurus', 'pengurus@simkopdes.id', 'admin@simkopdes.id', 'admin@gmail.com'],
    password: 'password123',
    alternatePasswords: ['admin', 'admin123', 'password123', 'pengurus', 'pengurus123'],
  },
  {
    id: 'usr-anggota-demo',
    email: 'anggota@simkopdes.id',
    aliases: ['anggota', 'anggota@simkopdes.id', 'budi', 'user'],
    password: 'password123',
    alternatePasswords: ['password123', 'anggota123', 'user123'],
  },
];

function getLocalStore() {
  let store: any = null;
  const data = localStorage.getItem(MOCK_STORAGE_KEY);
  if (data) {
    try {
      store = JSON.parse(data);
    } catch {
      store = null;
    }
  }

  if (!store || !Array.isArray(store.users)) {
    store = { users: [], profiles: [], members: [], savings: [], activeSession: null };
  }

  // Ensure default demo admin and member are always available for testing
  for (const defaultUser of DEFAULT_USERS) {
    const exists = store.users.some(
      (u: any) =>
        u.email?.toLowerCase() === defaultUser.email.toLowerCase() ||
        (Array.isArray(u.aliases) && u.aliases.some((a: string) => defaultUser.aliases.includes(a.toLowerCase())))
    );
    if (!exists) {
      store.users.unshift(defaultUser);
    }
  }

  if (!store.profiles.some((p: any) => p.id === 'usr-pengurus-demo')) {
    store.profiles.unshift({
      id: 'usr-pengurus-demo',
      role: 'pengurus' as const,
      nama: 'Bapak Hartono (Pengurus Koperasi)',
      no_hp: '081234567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (!store.profiles.some((p: any) => p.id === 'usr-anggota-demo')) {
    store.profiles.unshift({
      id: 'usr-anggota-demo',
      role: 'anggota' as const,
      nama: 'Budi Santoso',
      no_hp: '081298765432',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (!store.members.some((m: any) => m.profile_id === 'usr-anggota-demo')) {
    store.members.unshift({
      id: 'mem-anggota-demo',
      profile_id: 'usr-anggota-demo',
      nomor_anggota: 'ANG-100201',
      nik: '3201012345670001',
      alamat: 'Dusun Sukamaju RT 02 RW 03, Desa Mandiri',
      domisili_desa: 'Desa Sukamaju',
      status: 'aktif' as const,
      tanggal_daftar: new Date().toISOString(),
    });
  }

  if (!store.savings || store.savings.length === 0) {
    store.savings = [
      {
        id: 'sav-1',
        member_id: 'mem-anggota-demo',
        jenis: 'pokok' as const,
        nominal: 100000,
        tanggal_transaksi: new Date().toISOString(),
        keterangan: 'Setoran Simpanan Pokok Awal',
      },
      {
        id: 'sav-2',
        member_id: 'mem-anggota-demo',
        jenis: 'wajib' as const,
        nominal: 25000,
        tanggal_transaksi: new Date().toISOString(),
        keterangan: 'Simpanan Wajib Bulan Berjalan',
      },
    ];
  }

  saveLocalStore(store);
  return store;
}

function saveLocalStore(store: unknown) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(store));
}

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string):Promise<{ session: UserSession | null; error: string | null }> {
    if (!email || !password) {
      return { session: null, error: 'Email dan kata sandi wajib diisi.' };
    }

    if (isConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Standardized safe error message to prevent enumeration (AC-008)
          return { session: null, error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' };
        }

        if (!data.user) {
          return { session: null, error: 'Login belum berhasil. Silakan coba kembali.' };
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // Fetch member
        const { data: member } = await supabase
          .from('members')
          .select('*, profile:profiles(*)')
          .eq('profile_id', data.user.id)
          .maybeSingle();

        return {
          session: {
            user: { id: data.user.id, email: data.user.email || email },
            profile: profile || null,
            member: member || null,
          },
          error: null,
        };
      } catch (err: unknown) {
        return { session: null, error: 'Terjadi kendala koneksi ke server. Silakan coba beberapa saat lagi.' };
      }
    }

    // Offline / demo fallback for testing environments
    const store = getLocalStore();
    const cleanIdent = email.trim().toLowerCase();

    const existingUser = store.users.find((u: any) => {
      if (u.email && u.email.toLowerCase() === cleanIdent) return true;
      if (Array.isArray(u.aliases) && u.aliases.some((a: string) => a.toLowerCase() === cleanIdent)) return true;
      return false;
    });

    if (!existingUser) {
      return { session: null, error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' };
    }

    const isPasswordMatch =
      existingUser.password === password ||
      (Array.isArray(existingUser.alternatePasswords) && existingUser.alternatePasswords.includes(password));

    if (!isPasswordMatch) {
      return { session: null, error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.' };
    }

    const profile = store.profiles.find((p: any) => p.id === existingUser.id) || null;
    const member = store.members.find((m: any) => m.profile_id === existingUser.id) || null;

    const session: UserSession = {
      user: { id: existingUser.id, email: existingUser.email },
      profile,
      member,
    };

    store.activeSession = session;
    saveLocalStore(store);

    return { session, error: null };
  },

  /**
   * Register new member
   */
  async register(params: {
    nama: string;
    nik: string;
    alamat: string;
    no_hp: string;
    email: string;
    password: string;
    domisili_desa?: string;
  }): Promise<{ success: boolean; member: Member | null; error: string | null }> {
    const { nama, nik, alamat, no_hp, email, password, domisili_desa = 'Desa Sukamaju' } = params;

    // Validation
    if (!nama.trim()) return { success: false, member: null, error: 'Nama lengkap wajib diisi.' };
    if (!/^\d{16}$/.test(nik)) return { success: false, member: null, error: 'NIK harus tepat 16 digit angka.' };
    if (!alamat.trim()) return { success: false, member: null, error: 'Alamat lengkap wajib diisi.' };
    if (!no_hp.trim()) return { success: false, member: null, error: 'Nomor HP wajib diisi.' };
    if (!email.trim() || !email.includes('@')) return { success: false, member: null, error: 'Format email tidak valid.' };
    if (password.length < 6) return { success: false, member: null, error: 'Kata sandi minimal 6 karakter.' };

    const nomorAnggota = `ANG-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isConfigured) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nama, no_hp },
          },
        });

        if (authError) {
          return { success: false, member: null, error: authError.message };
        }

        if (!authData.user) {
          return { success: false, member: null, error: 'Pendaftaran belum dapat diproses oleh server.' };
        }

        // Insert profile
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          nama,
          no_hp,
          role: 'anggota',
        });

        if (profileError) {
          return { success: false, member: null, error: 'Gagal membuat profil anggota.' };
        }

        // Insert member record with 'pending' status per DEC-02
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .insert({
            profile_id: authData.user.id,
            nomor_anggota: nomorAnggota,
            nik,
            alamat,
            status: 'pending',
          })
          .select()
          .single();

        if (memberError) {
          return { success: false, member: null, error: memberError.message };
        }

        return { success: true, member: memberData, error: null };
      } catch (err: unknown) {
        return { success: false, member: null, error: 'Koneksi gagal saat mendaftar. Silakan coba lagi.' };
      }
    }

    // Local fallback persistence
    const store = getLocalStore();
    if (store.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, member: null, error: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.' };
    }

    const userId = `usr-${Date.now()}`;
    const newProfile: Profile = {
      id: userId,
      nama,
      no_hp,
      role: 'anggota',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      profile_id: userId,
      nomor_anggota: nomorAnggota,
      nik,
      alamat,
      domisili_desa,
      status: 'pending', // Pending approval per DEC-02
      tanggal_daftar: new Date().toISOString(),
      profile: newProfile,
    };

    store.users.push({ id: userId, email, password });
    store.profiles.push(newProfile);
    store.members.push(newMember);
    saveLocalStore(store);

    return { success: true, member: newMember, error: null };
  },

  /**
   * Get current session
   */
  async getCurrentSession(): Promise<UserSession | null> {
    if (isConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const { data: member } = await supabase
          .from('members')
          .select('*, profile:profiles(*)')
          .eq('profile_id', session.user.id)
          .maybeSingle();

        return {
          user: { id: session.user.id, email: session.user.email || '' },
          profile: profile || null,
          member: member || null,
        };
      } catch {
        return null;
      }
    }

    const store = getLocalStore();
    return store.activeSession || null;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    if (isConfigured) {
      await supabase.auth.signOut();
    }
    const store = getLocalStore();
    store.activeSession = null;
    saveLocalStore(store);
  },

  /**
   * Reset password request via email (AC-011)
   */
  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Format email tidak valid.' };
    }

    if (isConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, error: null };
    }

    // Safe response in offline mode
    return { success: true, error: null };
  },
};
