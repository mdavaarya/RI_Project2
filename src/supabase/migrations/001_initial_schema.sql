-- SIMKOPDES Database Schema Migration v1.1
-- Compliant with PRD v1.1 and FEATURE-LIST-DATA-MODEL.md

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'anggota' CHECK (role IN ('anggota', 'pengurus')),
    nama TEXT NOT NULL,
    no_hp TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    nomor_anggota TEXT UNIQUE NOT NULL,
    nik TEXT NOT NULL,
    alamat TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'aktif', 'nonaktif')),
    tanggal_daftar TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create savings table
CREATE TABLE IF NOT EXISTS public.savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    jenis TEXT NOT NULL CHECK (jenis IN ('pokok', 'wajib', 'sukarela')),
    nominal NUMERIC(14,2) NOT NULL CHECK (nominal > 0),
    tanggal_transaksi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    keterangan TEXT
);

-- 4. Create loans table (Placeholder per DEC-05)
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    jumlah_pengajuan NUMERIC(14,2) NOT NULL CHECK (jumlah_pengajuan > 0),
    status TEXT NOT NULL DEFAULT 'diajukan' CHECK (status IN ('diajukan', 'disetujui', 'ditolak', 'lunas')),
    tanggal_pengajuan TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create help_contents table
CREATE TABLE IF NOT EXISTS public.help_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    halaman_terkait TEXT NOT NULL,
    judul TEXT NOT NULL,
    konten TEXT NOT NULL,
    urutan_tampil INT NOT NULL DEFAULT 0
);

-- 6. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    aksi TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detail JSONB
);

-- Trigger to update updated_at on profiles
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

-- Auto create profile on auth signup trigger (optional helper function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nama, role, no_hp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nama', 'Pengguna Baru'),
        'anggota',
        NEW.raw_user_meta_data->>'no_hp'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
