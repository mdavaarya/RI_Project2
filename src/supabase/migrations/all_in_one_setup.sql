-- ==============================================================================
-- SIMKOPDES (SISTEM INFORMASI KOPERASI DESA) — ALL-IN-ONE SETUP SCRIPT
-- ==============================================================================
-- Cukup salin seluruh isi file ini ke Supabase Dashboard > SQL Editor, lalu klik RUN.
-- Script ini otomatis membuat:
-- 1. Semua Tabel Database (profiles, members, savings, loans, helpdesk, permohonan)
-- 2. Trigger Otomatis Pembuatan Profil saat Sign-Up
-- 3. Row Level Security (RLS) dan Aturan Kebijakan Akses Keamanan
-- 4. Data Benih (Seed Data) Panduan & FAQ Resmi
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PEMBUATAN TABEL-TABEL
-- ------------------------------------------------------------------------------

-- Tabel Profiles (1:1 dengan auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'anggota' CHECK (role IN ('anggota', 'pengurus')),
    nama TEXT NOT NULL,
    no_hp TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Members (Data keanggotaan koperasi desa)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    nomor_anggota TEXT UNIQUE NOT NULL,
    nik TEXT NOT NULL,
    alamat TEXT NOT NULL,
    domisili_desa TEXT DEFAULT 'Desa Sukamaju',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'aktif', 'nonaktif')),
    tanggal_daftar TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Savings (Transaksi Simpanan Pokok, Wajib, Sukarela)
CREATE TABLE IF NOT EXISTS public.savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    jenis TEXT NOT NULL CHECK (jenis IN ('pokok', 'wajib', 'sukarela')),
    nominal NUMERIC(14,2) NOT NULL CHECK (nominal > 0),
    tanggal_transaksi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    keterangan TEXT
);

-- Tabel Loans (Placeholder lingkup PRD v1.1)
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    jumlah_pengajuan NUMERIC(14,2) NOT NULL CHECK (jumlah_pengajuan > 0),
    status TEXT NOT NULL DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'disetujui', 'ditolak', 'lunas')),
    tanggal_pengajuan TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Permohonan Perpindahan Domisili Koperasi
CREATE TABLE IF NOT EXISTS public.domisili_transfer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    nama_anggota TEXT NOT NULL,
    nomor_anggota TEXT NOT NULL,
    desa_asal TEXT NOT NULL,
    desa_tujuan TEXT NOT NULL,
    alasan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
    catatan_pengurus TEXT,
    tanggal_pengajuan TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Permohonan Penghapusan Akun
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    nama_anggota TEXT NOT NULL,
    nomor_anggota TEXT NOT NULL,
    alasan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
    catatan_pengurus TEXT,
    tanggal_pengajuan TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Helpdesk & Tiket Pengaduan
CREATE TABLE IF NOT EXISTS public.helpdesk_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    nama_pengadu TEXT NOT NULL,
    nomor_anggota TEXT NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL CHECK (kategori IN ('Akun', 'Simpanan', 'Domisili', 'Layanan', 'Lainnya')),
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'ditangani', 'selesai')),
    unread_by_member BOOLEAN DEFAULT FALSE,
    unread_by_admin BOOLEAN DEFAULT TRUE,
    tanggal_buat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Pesan Percakapan Chat Helpdesk
CREATE TABLE IF NOT EXISTS public.helpdesk_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('anggota', 'pengurus', 'system_bot')),
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    tanggal_kirim TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabel Help Contents & FAQ
CREATE TABLE IF NOT EXISTS public.help_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    halaman_terkait TEXT NOT NULL,
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    urutan_tampil INT NOT NULL DEFAULT 0
);

-- Tabel Audit Logs (Opsional)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    aksi TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detail JSONB
);

-- ------------------------------------------------------------------------------
-- 2. TRIGGER & FUNCTIONS
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nama, role, no_hp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nama', 'Pengguna Baru'),
        'anggota',
        NEW.raw_user_meta_data->>'no_hp'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper check pengurus
CREATE OR REPLACE FUNCTION public.is_pengurus()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'pengurus'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domisili_transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles viewable by owner or pengurus" ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_pengurus());

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Members
CREATE POLICY "Members viewable by owner or pengurus" ON public.members FOR SELECT
USING (profile_id = auth.uid() OR public.is_pengurus());

CREATE POLICY "Users can create own membership record" ON public.members FOR INSERT
WITH CHECK (profile_id = auth.uid() AND status = 'pending');

CREATE POLICY "Only pengurus can update member status" ON public.members FOR UPDATE
USING (public.is_pengurus()) WITH CHECK (public.is_pengurus());

-- Savings (Read-only for members)
CREATE POLICY "Members can view own savings" ON public.savings FOR SELECT
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

CREATE POLICY "Only pengurus can record savings" ON public.savings FOR INSERT
WITH CHECK (public.is_pengurus());

-- Loans
CREATE POLICY "Members can view own loans" ON public.loans FOR SELECT
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

-- Domisili Transfer
CREATE POLICY "Domisili transfer viewable by owner or pengurus" ON public.domisili_transfer_requests FOR SELECT
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

CREATE POLICY "Members can insert domisili transfer" ON public.domisili_transfer_requests FOR INSERT
WITH CHECK (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()));

CREATE POLICY "Only pengurus can update domisili transfer" ON public.domisili_transfer_requests FOR UPDATE
USING (public.is_pengurus()) WITH CHECK (public.is_pengurus());

-- Account Deletion
CREATE POLICY "Account deletion viewable by owner or pengurus" ON public.account_deletion_requests FOR SELECT
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

CREATE POLICY "Members can insert account deletion" ON public.account_deletion_requests FOR INSERT
WITH CHECK (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()));

CREATE POLICY "Only pengurus can update account deletion" ON public.account_deletion_requests FOR UPDATE
USING (public.is_pengurus()) WITH CHECK (public.is_pengurus());

-- Helpdesk
CREATE POLICY "Helpdesk tickets viewable by owner or pengurus" ON public.helpdesk_tickets FOR SELECT
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

CREATE POLICY "Members can create helpdesk tickets" ON public.helpdesk_tickets FOR INSERT
WITH CHECK (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()));

CREATE POLICY "Pengurus and owners can update tickets" ON public.helpdesk_tickets FOR UPDATE
USING (member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid()) OR public.is_pengurus());

-- Helpdesk Messages
CREATE POLICY "Helpdesk messages viewable by ticket owner or pengurus" ON public.helpdesk_messages FOR SELECT
USING (ticket_id IN (SELECT id FROM public.helpdesk_tickets WHERE member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())) OR public.is_pengurus());

CREATE POLICY "Users can insert helpdesk messages" ON public.helpdesk_messages FOR INSERT
WITH CHECK (ticket_id IN (SELECT id FROM public.helpdesk_tickets WHERE member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())) OR public.is_pengurus());

-- Help Contents (Public Read)
CREATE POLICY "Help contents are readable by all" ON public.help_contents FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 4. SEED DATA (PANDUAN & FAQ RESMI)
-- ------------------------------------------------------------------------------

INSERT INTO public.help_contents (halaman_terkait, judul, konten, urutan_tampil)
VALUES
(
    'login',
    'Cara Masuk ke Akun SIMKOPDES',
    'Gunakan alamat email atau identitas akun dan kata sandi yang telah Anda daftarkan. Jika lupa kata sandi, gunakan fitur Lupa Kata Sandi untuk menerima instruksi pemulihan.',
    1
),
(
    'pendaftaran',
    'Syarat dan Langkah Pendaftaran Anggota Baru',
    'Calon anggota melengkapi formulir dengan Nama Lengkap, NIK 16 digit, Pilihan Domisili Desa, Alamat, Nomor HP, Email, dan Kata Sandi. Permohonan Anda akan tercatat dengan status Menunggu untuk verifikasi pengurus.',
    2
),
(
    'dashboard_anggota',
    'Memahami Status Keanggotaan dan Saldo Simpanan',
    'Beranda anggota menampilkan status keanggotaan Anda serta ringkasan akumulasi saldo simpanan pokok, simpanan wajib, dan simpanan sukarela dari pencatatan riil koperasi.',
    3
),
(
    'riwayat_simpanan',
    'Memeriksa Riwayat Transaksi Simpanan',
    'Pada menu Riwayat Simpanan, Anda dapat melihat rincian setiap transaksi simpanan beserta jenis simpanan, nominal rupiah, tanggal transaksi, dan keterangan.',
    4
),
(
    'profil',
    'Pengelolaan Profil & Perpindahan Domisili',
    'Halaman profil memungkinkan Anda memperbarui nomor kontak, mengajukan perpindahan domisili koperasi desa jika berpindah tempat tinggal, atau mengajukan permohonan penutupan akun.',
    5
),
(
    'kelola_anggota',
    'Panduan Pengurus: Kelola dan Verifikasi Anggota',
    'Pengurus koperasi dapat meninjau permohonan pendaftaran, menyetujui perpindahan domisili, menindaklanjuti pengajuan hapus akun, dan membalas chat bantuan anggota.',
    6
)
ON CONFLICT DO NOTHING;
