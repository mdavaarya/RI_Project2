-- Row Level Security (RLS) Policies for SIMKOPDES
-- All public tables MUST have RLS enabled (AC-040)

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is 'pengurus'
CREATE OR REPLACE FUNCTION public.is_pengurus()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'pengurus'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
-- Anyone authenticated can view their own profile; pengurus can view all
CREATE POLICY "Profiles viewable by owner or pengurus"
ON public.profiles FOR SELECT
USING (
    auth.uid() = id OR public.is_pengurus()
);

-- Users can update only their own profile (name, phone), role is protected
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- 2. MEMBERS POLICIES
-- Members can view their own membership; pengurus can view all
CREATE POLICY "Members viewable by owner or pengurus"
ON public.members FOR SELECT
USING (
    profile_id = auth.uid() OR public.is_pengurus()
);

-- Calon anggota can insert their own pending registration
CREATE POLICY "Users can create own membership record"
ON public.members FOR INSERT
WITH CHECK (
    profile_id = auth.uid() AND status = 'pending'
);

-- Members can update their own member record (alamat), pengurus can update all
CREATE POLICY "Members can update own member info or pengurus all"
ON public.members FOR UPDATE
USING (profile_id = auth.uid() OR public.is_pengurus())
WITH CHECK (profile_id = auth.uid() OR public.is_pengurus());

-- 3. SAVINGS POLICIES (Read-Only for Members per DEC-04 & AC-020)
-- Members can only read their own savings records
CREATE POLICY "Members can view own savings"
ON public.savings FOR SELECT
USING (
    member_id IN (
        SELECT id FROM public.members WHERE profile_id = auth.uid()
    )
    OR public.is_pengurus()
);

-- Only pengurus / service role can insert savings
CREATE POLICY "Only pengurus can record savings"
ON public.savings FOR INSERT
WITH CHECK (public.is_pengurus());

-- 4. LOANS POLICIES (Placeholder per DEC-05)
CREATE POLICY "Members can view own loans"
ON public.loans FOR SELECT
USING (
    member_id IN (
        SELECT id FROM public.members WHERE profile_id = auth.uid()
    )
    OR public.is_pengurus()
);

-- 5. HELP CONTENTS POLICIES (Public read)
CREATE POLICY "Help contents are readable by all"
ON public.help_contents FOR SELECT
USING (true);

-- 6. AUDIT LOGS POLICIES
CREATE POLICY "Audit logs viewable by pengurus only"
ON public.audit_logs FOR SELECT
USING (public.is_pengurus());

CREATE POLICY "Authenticated users can insert audit log"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);
