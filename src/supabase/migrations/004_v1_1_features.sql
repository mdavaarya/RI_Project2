-- SIMKOPDES Migration v1.1.0: Domisili, Penghapusan Akun, dan Helpdesk Chat

-- 1. Tambah kolom domisili_desa pada tabel members
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS domisili_desa TEXT DEFAULT 'Desa Sukamaju';

-- 2. Buat tabel domisili_transfer_requests
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

-- 3. Buat tabel account_deletion_requests
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

-- 4. Buat tabel helpdesk_tickets
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

-- 5. Buat tabel helpdesk_messages
CREATE TABLE IF NOT EXISTS public.helpdesk_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES public.helpdesk_tickets(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('anggota', 'pengurus', 'system_bot')),
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    tanggal_kirim TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.domisili_transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpdesk_messages ENABLE ROW LEVEL SECURITY;

-- Policies for domisili_transfer_requests
CREATE POLICY "Domisili transfer viewable by owner or pengurus"
ON public.domisili_transfer_requests FOR SELECT
USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_pengurus()
);

CREATE POLICY "Members can insert domisili transfer"
ON public.domisili_transfer_requests FOR INSERT
WITH CHECK (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
);

CREATE POLICY "Only pengurus can update domisili transfer status"
ON public.domisili_transfer_requests FOR UPDATE
USING (public.is_pengurus())
WITH CHECK (public.is_pengurus());

-- Policies for account_deletion_requests
CREATE POLICY "Account deletion viewable by owner or pengurus"
ON public.account_deletion_requests FOR SELECT
USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_pengurus()
);

CREATE POLICY "Members can insert account deletion"
ON public.account_deletion_requests FOR INSERT
WITH CHECK (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
);

CREATE POLICY "Only pengurus can update account deletion status"
ON public.account_deletion_requests FOR UPDATE
USING (public.is_pengurus())
WITH CHECK (public.is_pengurus());

-- Policies for helpdesk_tickets
CREATE POLICY "Helpdesk tickets viewable by owner or pengurus"
ON public.helpdesk_tickets FOR SELECT
USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_pengurus()
);

CREATE POLICY "Members can create helpdesk tickets"
ON public.helpdesk_tickets FOR INSERT
WITH CHECK (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
);

CREATE POLICY "Pengurus and owners can update tickets"
ON public.helpdesk_tickets FOR UPDATE
USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    OR public.is_pengurus()
);

-- Policies for helpdesk_messages
CREATE POLICY "Helpdesk messages viewable by ticket owner or pengurus"
ON public.helpdesk_messages FOR SELECT
USING (
    ticket_id IN (
        SELECT id FROM public.helpdesk_tickets 
        WHERE member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    )
    OR public.is_pengurus()
);

CREATE POLICY "Authenticated users can insert helpdesk messages"
ON public.helpdesk_messages FOR INSERT
WITH CHECK (
    ticket_id IN (
        SELECT id FROM public.helpdesk_tickets 
        WHERE member_id IN (SELECT id FROM public.members WHERE profile_id = auth.uid())
    )
    OR public.is_pengurus()
);
