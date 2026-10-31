-- ==============================================================================
-- NUSASKY COMMUNITY AVIATION QUIZ (200 MEMBERS GIVEAWAY)
-- SUPABASE DATABASE & STORAGE SCHEMA
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/ckbirxkmyglcblqwxuvf/sql
-- ==============================================================================

-- 1. TABEL PENGATURAN UJIAN (EXAM SETTINGS)
CREATE TABLE IF NOT EXISTS public.exam_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    is_open BOOLEAN NOT NULL DEFAULT false,
    announcement TEXT DEFAULT 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!',
    max_violations INTEGER NOT NULL DEFAULT 3,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Masukkan data awal pengaturan jika belum ada
INSERT INTO public.exam_settings (id, is_open, announcement, max_violations)
VALUES ('singleton', false, 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!', 3)
ON CONFLICT (id) DO NOTHING;

-- 2. TABEL PESERTA (PARTICIPANTS)
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    proof_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'in_progress', 'submitted', 'disqualified'
    violations_count INTEGER NOT NULL DEFAULT 0,
    score NUMERIC NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    disqualification_reason TEXT
);

-- Buat indeks untuk query rekapitulasi nilai dan nomor HP
CREATE INDEX IF NOT EXISTS idx_participants_score ON public.participants (score DESC, submitted_at ASC);
CREATE INDEX IF NOT EXISTS idx_participants_phone ON public.participants (phone);

-- 3. KONFIGURASI STORAGE BUCKET 'proofs'
-- Membuat bucket 'proofs' agar public dapat membaca gambar bukti peserta
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'proofs',
    'proofs',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760;

-- 4. ROW LEVEL SECURITY (RLS) & POLICIES
-- Aktifkan RLS
ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Policy untuk exam_settings: Siapapun dapat membaca (SELECT)
DROP POLICY IF EXISTS "Public read exam settings" ON public.exam_settings;
CREATE POLICY "Public read exam settings" 
ON public.exam_settings FOR SELECT 
USING (true);

-- Policy untuk exam_settings: Siapapun dapat update (atau dengan publishable key)
DROP POLICY IF EXISTS "Allow update exam settings" ON public.exam_settings;
CREATE POLICY "Allow update exam settings" 
ON public.exam_settings FOR ALL 
USING (true)
WITH CHECK (true);

-- Policy untuk participants: Siapapun dapat melihat data peserta
DROP POLICY IF EXISTS "Public read participants" ON public.participants;
CREATE POLICY "Public read participants" 
ON public.participants FOR SELECT 
USING (true);

-- Policy untuk participants: Siapapun dapat mendaftar (INSERT)
DROP POLICY IF EXISTS "Public insert participant" ON public.participants;
CREATE POLICY "Public insert participant" 
ON public.participants FOR INSERT 
WITH CHECK (true);

-- Policy untuk participants: Update data peserta sendiri
DROP POLICY IF EXISTS "Public update participant" ON public.participants;
CREATE POLICY "Public update participant" 
ON public.participants FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Policy untuk Storage bucket 'proofs'
DROP POLICY IF EXISTS "Public Access Proofs Bucket" ON storage.objects;
CREATE POLICY "Public Access Proofs Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'proofs');

DROP POLICY IF EXISTS "Public Upload Proofs Bucket" ON storage.objects;
CREATE POLICY "Public Upload Proofs Bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'proofs');

DROP POLICY IF EXISTS "Public Update Proofs Bucket" ON storage.objects;
CREATE POLICY "Public Update Proofs Bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'proofs');

-- Aktifkan Supabase Realtime untuk tabel participants dan exam_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_settings;
