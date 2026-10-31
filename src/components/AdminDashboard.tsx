import React, { useState, useEffect, useMemo } from 'react';
import {
  Crown,
  RotateCcw,
  Power,
  Play,
  Trophy,
  Download,
  ZoomIn,
  Eye,
  Copy,
  Check,
  X,
  ExternalLink,
  Shield,
  Search,
  FileCode,
  Users,
} from 'lucide-react';
import { Participant, ExamSettings } from '../types';
import {
  fetchAllParticipants,
  updateExamSettings,
  disqualifyParticipant,
  reinstateParticipant,
  supabase,
} from '../lib/supabase';
import { AVIATION_QUESTIONS } from '../data/questions';

interface AdminDashboardProps {
  examSettings: ExamSettings;
  onUpdateSettings: (settings: ExamSettings) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  examSettings,
  onUpdateSettings,
  onLogout,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'recap' | 'schema'>(
    'monitoring'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProofUrl, setSelectedProofUrl] = useState<{
    url: string;
    username: string;
  } | null>(null);
  const [selectedAnswersParticipant, setSelectedAnswersParticipant] =
    useState<Participant | null>(null);
  const [announcementInput, setAnnouncementInput] = useState(
    examSettings.announcement || ''
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Load participants
  const loadParticipants = async () => {
    setIsLoading(true);
    const data = await fetchAllParticipants();
    setParticipants(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadParticipants();

    // Setup Supabase Realtime channel for live updates
    const channel = supabase
      .channel('admin_participants_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'participants' },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    // Auto-poll every 5 seconds as fallback
    const interval = setInterval(() => {
      loadParticipants();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  // Toggle Exam Open / Closed
  const handleToggleExam = async () => {
    setIsUpdatingStatus(true);
    const nextState = !examSettings.is_open;
    const ok = await updateExamSettings({
      is_open: nextState,
      announcement: announcementInput,
    });
    if (ok) {
      onUpdateSettings({
        ...examSettings,
        is_open: nextState,
        announcement: announcementInput,
      });
    }
    setIsUpdatingStatus(false);
  };

  const handleSaveAnnouncement = async () => {
    setIsUpdatingStatus(true);
    await updateExamSettings({ announcement: announcementInput });
    onUpdateSettings({
      ...examSettings,
      announcement: announcementInput,
    });
    setIsUpdatingStatus(false);
  };

  // Disqualify / Reinstate
  const handleDisqualify = async (phone: string, username: string) => {
    const reason = prompt(
      `Masukkan alasan diskualifikasi untuk ${username}:`,
      'Dihentikan secara manual oleh Admin'
    );
    if (reason) {
      await disqualifyParticipant(phone, reason);
      loadParticipants();
    }
  };

  const handleReinstate = async (phone: string) => {
    if (confirm('Pulihkan status peserta ini dan hapus catatan pelanggaran?')) {
      await reinstateParticipant(phone);
      loadParticipants();
    }
  };

  // Filtered participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery);
      const matchStatus =
        statusFilter === 'all' ? true : p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [participants, searchQuery, statusFilter]);

  // Ranked participants for Winner Determination / Recap
  const leaderboard = useMemo(() => {
    return [...participants]
      .filter((p) => p.status === 'submitted')
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const timeA = a.submitted_at ? new Date(a.submitted_at).getTime() : 0;
        const timeB = b.submitted_at ? new Date(b.submitted_at).getTime() : 0;
        return timeA - timeB;
      });
  }, [participants]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = participants.length;
    const submitted = participants.filter((p) => p.status === 'submitted').length;
    const inProgress = participants.filter((p) => p.status === 'in_progress').length;
    const disqualified = participants.filter(
      (p) => p.status === 'disqualified'
    ).length;
    const waiting = participants.filter((p) => p.status === 'waiting').length;

    const submittedScores = participants
      .filter((p) => p.status === 'submitted')
      .map((p) => Number(p.score));

    const highestScore =
      submittedScores.length > 0 ? Math.max(...submittedScores) : 0;
    const avgScore =
      submittedScores.length > 0
        ? (
            submittedScores.reduce((acc, curr) => acc + curr, 0) /
            submittedScores.length
          ).toFixed(1)
        : '0';

    return { total, submitted, inProgress, disqualified, waiting, highestScore, avgScore };
  }, [participants]);

  // Export to CSV
  const handleExportCSV = () => {
    if (participants.length === 0) {
      alert('Belum ada data peserta untuk diekspor');
      return;
    }

    const headers = [
      'Peringkat',
      'Nama Peserta',
      'Nomor WhatsApp',
      'Status',
      'Skor',
      'Benar (dari 30)',
      'Pelanggaran',
      'Waktu Selesai',
      'Alasan Diskualifikasi',
      'Link Bukti',
    ];

    const rows = leaderboard.map((p, idx) => [
      idx + 1,
      `"${p.username.replace(/"/g, '""')}"`,
      `"${p.phone}"`,
      p.status,
      p.score,
      p.correct_answers,
      p.violations_count,
      p.submitted_at ? new Date(p.submitted_at).toLocaleString('id-ID') : '-',
      `"${(p.disqualification_reason || '').replace(/"/g, '""')}"`,
      `"${p.proof_url}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Pemenang_Nusasky_Quiz_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sqlSchemaText = `-- Jalankan skrip ini di SQL Editor Supabase:
CREATE TABLE IF NOT EXISTS public.exam_settings (
    id TEXT PRIMARY KEY DEFAULT 'singleton',
    is_open BOOLEAN NOT NULL DEFAULT false,
    announcement TEXT DEFAULT 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!',
    max_violations INTEGER NOT NULL DEFAULT 3,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.exam_settings (id, is_open, announcement, max_violations)
VALUES ('singleton', false, 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!', 3)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    proof_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    violations_count INTEGER NOT NULL DEFAULT 0,
    score NUMERIC NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    submitted_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    disqualification_reason TEXT
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('proofs', 'proofs', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
ON CONFLICT (id) DO UPDATE SET public = true;

ALTER TABLE public.exam_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all exam_settings" ON public.exam_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all participants" ON public.participants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public storage proofs" ON storage.objects FOR ALL USING (bucket_id = 'proofs') WITH CHECK (bucket_id = 'proofs');
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Header Admin */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black bg-[#818CF8] px-3 py-1 rounded-md border-2 border-black brutal-shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator Panel</span>
            </span>
            <span className="text-xs font-bold text-neutral-500">
              WhatsApp Nusasky Community
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">
            Dashboard Kontrol & Rekapitulasi Nilai
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadParticipants}
            disabled={isLoading}
            className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl border-2 border-black brutal-shadow-sm hover:bg-neutral-100 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Memuat...' : 'Refresh Data'}</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-[#F43F5E] text-white text-xs font-black rounded-xl border-2 border-black brutal-shadow-sm hover:bg-red-600 transition-all cursor-pointer"
          >
            Keluar Panel
          </button>
        </div>
      </div>

      {/* Kontrol Utama Sesi Ujian */}
      <div className="bg-[#FFE600] border-3 border-black rounded-2xl p-5 sm:p-6 mb-8 brutal-shadow">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-black bg-white px-2.5 py-0.5 rounded border border-black inline-block mb-1.5">
              Kendali Sesi Ujian Terpusat
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-black flex items-center gap-2">
              <span>Status Ujian:</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border-2 border-black text-sm font-black ${examSettings.is_open ? 'bg-[#34D399]' : 'bg-[#F43F5E] text-white'}`}>
                {examSettings.is_open ? 'SEDANG DIBUKA' : 'DITUTUP'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1 max-w-xl">
              {examSettings.is_open
                ? 'Semua peserta yang terdaftar dapat mulai membaca dan menjawab 30 butir soal aviasi.'
                : 'Peserta hanya dapat mendaftar dan berada di ruang tunggu sampai Anda membuka sesi ini.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleExam}
              disabled={isUpdatingStatus}
              className={`py-3.5 px-6 rounded-xl border-2 border-black font-black text-sm tracking-wide uppercase transition-all brutal-shadow brutal-btn cursor-pointer flex items-center gap-2 ${
                examSettings.is_open
                  ? 'bg-[#F43F5E] text-white hover:bg-red-600'
                  : 'bg-[#34D399] text-black hover:bg-emerald-400'
              }`}
            >
              {isUpdatingStatus ? (
                <span>Memproses...</span>
              ) : examSettings.is_open ? (
                <>
                  <Power className="w-4 h-4 stroke-[2.5]" />
                  <span>Tutup Sesi Ujian</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 stroke-[2.5]" />
                  <span>Buka Sesi Ujian Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Pengumuman */}
        <div className="mt-4 pt-4 border-t-2 border-black/20 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="Ketik pesan/pengumuman yang ditampilkan di layar ruang tunggu peserta..."
            className="flex-1 min-w-[280px] px-3.5 py-2 text-xs sm:text-sm font-bold bg-white border-2 border-black rounded-xl focus:outline-none"
          />
          <button
            onClick={handleSaveAnnouncement}
            disabled={isUpdatingStatus}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl border-2 border-black hover:bg-neutral-800 cursor-pointer"
          >
            Simpan Pengumuman
          </button>
        </div>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <div className="bg-white border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
            Total Peserta
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black font-mono-num mt-1">
            {stats.total}
          </div>
        </div>

        <div className="bg-[#F0FDF4] border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-wider">
            Sudah Selesai
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#10B981] font-mono-num mt-1">
            {stats.submitted}
          </div>
        </div>

        <div className="bg-[#FEFCE8] border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-wider">
            Sedang Mengerjakan
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#D97706] font-mono-num mt-1">
            {stats.inProgress}
          </div>
        </div>

        <div className="bg-[#FFF1F2] border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-600 uppercase tracking-wider">
            Didiskualifikasi
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F43F5E] font-mono-num mt-1">
            {stats.disqualified}
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
            Skor Tertinggi
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black font-mono-num mt-1">
            {stats.highestScore}
          </div>
        </div>

        <div className="bg-white border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
          <div className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
            Rata-Rata Nilai
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black font-mono-num mt-1">
            {stats.avgScore}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl border-2 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-[#34D399] text-black brutal-shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Live Monitoring ({participants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recap')}
            className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl border-2 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recap'
                ? 'bg-[#FFE600] text-black brutal-shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Rekap Pemenang ({leaderboard.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-xs sm:text-sm font-black rounded-xl border-2 border-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[#818CF8] text-black brutal-shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>SQL Schema Supabase</span>
          </button>
        </div>

        {activeTab === 'recap' && (
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#34D399] text-black font-black text-xs rounded-xl border-2 border-black brutal-shadow-sm brutal-btn flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV Pemenang</span>
          </button>
        )}
      </div>

      {/* TAB 1: LIVE MONITORING */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border-2 border-black rounded-2xl p-4 brutal-shadow-sm">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama peserta atau nomor WhatsApp..."
                className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm font-bold bg-[#FDFBF7] border-2 border-black rounded-xl focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#FDFBF7] border-2 border-black rounded-xl font-bold text-xs"
              >
                <option value="all">Semua Status</option>
                <option value="waiting">Menunggu</option>
                <option value="in_progress">Sedang Ujian</option>
                <option value="submitted">Sudah Selesai</option>
                <option value="disqualified">Didiskualifikasi</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border-2 border-black rounded-2xl overflow-hidden brutal-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F6EE] border-b-2 border-black text-neutral-800 font-black uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Peserta & Foto Bukti</th>
                    <th className="py-3.5 px-4">WhatsApp</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Progres Soal</th>
                    <th className="py-3.5 px-4">Pelanggaran</th>
                    <th className="py-3.5 px-4">Skor Akhir</th>
                    <th className="py-3.5 px-4">Waktu Submit</th>
                    <th className="py-3.5 px-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10">
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-neutral-500 font-bold">
                        {isLoading ? 'Memuat data peserta...' : 'Belum ada peserta yang mendaftar'}
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((p) => {
                      const answered = Object.keys(p.answers || {}).length;
                      return (
                        <tr key={p.phone} className="hover:bg-[#FDFBF7] transition-colors">
                          {/* Nama & Foto */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  setSelectedProofUrl({
                                    url: p.proof_url,
                                    username: p.username,
                                  })
                                }
                                title="Klik untuk memperbesar foto bukti"
                                className="relative group shrink-0 cursor-pointer"
                              >
                                <img
                                  src={p.proof_url}
                                  alt={p.username}
                                  className="w-10 h-10 rounded-lg object-cover border-2 border-black group-hover:scale-105 transition-transform"
                                />
                                <span className="absolute -bottom-1 -right-1 bg-black text-white p-0.5 rounded">
                                  <ZoomIn className="w-2.5 h-2.5" />
                                </span>
                              </button>
                              <div>
                                <div className="font-black text-sm text-black">
                                  {p.username}
                                </div>
                                <div className="text-[10px] text-neutral-500 font-semibold font-mono-num">
                                  Daftar: {new Date(p.created_at).toLocaleTimeString('id-ID')}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* WhatsApp */}
                          <td className="py-3 px-4 font-bold font-mono-num">
                            <a
                              href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-black hover:text-[#10B981] hover:underline inline-flex items-center gap-1"
                            >
                              <span>{p.phone}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {p.status === 'submitted' ? (
                              <span className="px-2.5 py-1 rounded-md border border-black text-[11px] font-black bg-[#34D399] text-black">
                                Selesai
                              </span>
                            ) : p.status === 'in_progress' ? (
                              <span className="px-2.5 py-1 rounded-md border border-black text-[11px] font-black bg-[#FFE600] text-black">
                                Mengerjakan
                              </span>
                            ) : p.status === 'disqualified' ? (
                              <span className="px-2.5 py-1 rounded-md border border-black text-[11px] font-black bg-[#F43F5E] text-white">
                                Didiskualifikasi
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-md border border-black text-[11px] font-black bg-neutral-200 text-neutral-700">
                                Menunggu
                              </span>
                            )}
                          </td>

                          {/* Progres Soal */}
                          <td className="py-3 px-4 font-mono-num font-bold">
                            <button
                              onClick={() => setSelectedAnswersParticipant(p)}
                              className="hover:underline font-bold text-black inline-flex items-center gap-1 cursor-pointer"
                              title="Klik untuk melihat detail jawaban peserta"
                            >
                              <span>{answered}/30 ({Math.round((answered / 30) * 100)}%)</span>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          {/* Pelanggaran */}
                          <td className="py-3 px-4 font-mono-num font-bold">
                            <span
                              className={`px-2 py-0.5 rounded font-black ${
                                p.violations_count >= 3
                                  ? 'bg-[#F43F5E] text-white'
                                  : p.violations_count > 0
                                  ? 'bg-[#FFE600] text-black'
                                  : 'text-neutral-600'
                              }`}
                            >
                              {p.violations_count}/3
                            </span>
                          </td>

                          {/* Skor */}
                          <td className="py-3 px-4 font-mono-num font-black text-sm">
                            {p.status === 'submitted' ? (
                              <span className="text-black">{p.score}</span>
                            ) : (
                              <span className="text-neutral-400">-</span>
                            )}
                          </td>

                          {/* Waktu Submit */}
                          <td className="py-3 px-4 text-neutral-600 font-mono-num text-[11px]">
                            {p.submitted_at
                              ? new Date(p.submitted_at).toLocaleTimeString('id-ID')
                              : '-'}
                          </td>

                          {/* Aksi */}
                          <td className="py-3 px-4 text-right">
                            {p.status === 'disqualified' ? (
                              <button
                                onClick={() => handleReinstate(p.phone)}
                                className="px-2.5 py-1 text-[11px] font-black bg-[#34D399] text-black rounded border border-black hover:bg-emerald-400 cursor-pointer"
                              >
                                Pulihkan
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDisqualify(p.phone, p.username)}
                                className="px-2.5 py-1 text-[11px] font-black bg-[#F43F5E] text-white rounded border border-black hover:bg-red-600 cursor-pointer"
                              >
                                Blokir
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REKAPITULASI NILAI & PENENTUAN PEMENANG */}
      {activeTab === 'recap' && (
        <div className="space-y-6">
          <div className="bg-[#FFE600] border-2 border-black rounded-2xl p-5 brutal-shadow">
            <h3 className="text-xl font-black text-black">
              Leaderboard & Penentuan Pemenang Otomatis
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">
              Urutan peringkat disusun secara objektif berdasarkan <strong>Skor Tertinggi (Maks. 100)</strong>, dan jika skor imbang diprioritaskan kepada peserta yang <strong>Submit Lebih Cepat</strong>.
            </p>
          </div>

          <div className="bg-white border-2 border-black rounded-2xl overflow-hidden brutal-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F6EE] border-b-2 border-black text-neutral-800 font-black uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4 w-16 text-center">Peringkat</th>
                    <th className="py-3.5 px-4">Nama Pemenang / Peserta</th>
                    <th className="py-3.5 px-4">WhatsApp</th>
                    <th className="py-3.5 px-4">Skor Akhir</th>
                    <th className="py-3.5 px-4">Jawaban Benar</th>
                    <th className="py-3.5 px-4">Waktu Penyelesaian</th>
                    <th className="py-3.5 px-4 text-center">Foto Bukti</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10">
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500 font-bold">
                        Belum ada peserta yang mengumpulkan jawaban ujian.
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((p, idx) => {
                      const isTop1 = idx === 0;
                      const isTop2 = idx === 1;
                      const isTop3 = idx === 2;

                      return (
                        <tr
                          key={p.phone}
                          className={`${
                            isTop1
                              ? 'bg-[#FEFCE8]'
                              : isTop2
                              ? 'bg-[#F0FDF4]'
                              : isTop3
                              ? 'bg-[#EFF6FF]'
                              : 'hover:bg-[#FDFBF7]'
                          } transition-colors`}
                        >
                          {/* Peringkat */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`w-7 h-7 mx-auto rounded-full border-2 border-black flex items-center justify-center font-black font-mono-num text-xs ${
                                isTop1
                                  ? 'bg-[#FFE600] text-black shadow-sm'
                                  : isTop2
                                  ? 'bg-[#34D399] text-black shadow-sm'
                                  : isTop3
                                  ? 'bg-[#818CF8] text-black shadow-sm'
                                  : 'bg-white text-neutral-700'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>

                          {/* Nama */}
                          <td className="py-3.5 px-4 font-black text-sm text-black">
                            <div className="flex items-center gap-2">
                              <span>{p.username}</span>
                              {isTop1 && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#FFE600] px-2 py-0.5 rounded border border-black font-extrabold">
                                  <Crown className="w-3 h-3 text-black" />
                                  <span>Juara 1</span>
                                </span>
                              )}
                              {isTop2 && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#34D399] px-2 py-0.5 rounded border border-black font-extrabold">
                                  <Trophy className="w-3 h-3 text-black" />
                                  <span>Juara 2</span>
                                </span>
                              )}
                              {isTop3 && (
                                <span className="inline-flex items-center gap-1 text-xs bg-[#818CF8] px-2 py-0.5 rounded border border-black font-extrabold">
                                  <Trophy className="w-3 h-3 text-black" />
                                  <span>Juara 3</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* WhatsApp */}
                          <td className="py-3.5 px-4 font-mono-num font-bold">
                            <a
                              href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-black hover:text-[#10B981] hover:underline inline-flex items-center gap-1"
                            >
                              <span>{p.phone}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>

                          {/* Skor */}
                          <td className="py-3.5 px-4 font-mono-num font-black text-base text-black">
                            {p.score}
                          </td>

                          {/* Jawaban Benar */}
                          <td className="py-3.5 px-4 font-mono-num font-bold text-neutral-700">
                            {p.correct_answers} / 30 Soal
                          </td>

                          {/* Waktu Submit */}
                          <td className="py-3.5 px-4 font-mono-num text-xs text-neutral-600">
                            {p.submitted_at
                              ? new Date(p.submitted_at).toLocaleTimeString('id-ID') +
                                ' WIB'
                              : '-'}
                          </td>

                          {/* Bukti */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() =>
                                setSelectedProofUrl({
                                  url: p.proof_url,
                                  username: p.username,
                                })
                              }
                              className="px-2.5 py-1 text-xs font-bold bg-white border border-black rounded hover:bg-neutral-100 cursor-pointer"
                            >
                              Lihat Foto
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SQL SCHEMA SUPABASE */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-black text-black">
                  Skema SQL Database & Storage Supabase
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-neutral-600 mt-1">
                  Jalankan skrip SQL di bawah ini di <strong>SQL Editor</strong> dashboard proyek Supabase Anda:{' '}
                  <a
                    href="https://supabase.com/dashboard/project/ckbirxkmyglcblqwxuvf/sql"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#818CF8] underline font-bold inline-flex items-center gap-1"
                  >
                    <span>Buka Supabase SQL Editor</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </p>
              </div>

              <button
                onClick={copySqlToClipboard}
                className="px-4 py-2.5 bg-[#FFE600] text-black font-black text-xs rounded-xl border-2 border-black brutal-shadow-sm brutal-btn flex items-center gap-2 cursor-pointer"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Skrip SQL</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] leading-relaxed border-2 border-black">
              {sqlSchemaText}
            </pre>
          </div>
        </div>
      )}

      {/* Modal Foto Bukti Diri Peserta */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="max-w-md w-full bg-white border-3 border-black rounded-2xl p-5 brutal-shadow-lg animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black/10">
              <h4 className="font-black text-sm text-black">
                Foto Bukti: {selectedProofUrl.username}
              </h4>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="p-1 rounded-lg border border-black font-black text-xs hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={selectedProofUrl.url}
              alt="Bukti Identitas"
              className="w-full max-h-[380px] object-contain rounded-xl border-2 border-black bg-neutral-50 mb-4"
            />
            <div className="flex justify-between items-center">
              <a
                href={selectedProofUrl.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#818CF8] hover:underline inline-flex items-center gap-1"
              >
                <span>Buka URL Asli di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedProofUrl(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl border border-black hover:bg-neutral-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Jawaban Peserta */}
      {selectedAnswersParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="max-w-2xl w-full bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black/10 shrink-0">
              <div>
                <h4 className="font-black text-base text-black">
                  Lembar Jawaban: {selectedAnswersParticipant.username}
                </h4>
                <div className="text-xs font-semibold text-neutral-500 font-mono-num">
                  Skor: {selectedAnswersParticipant.score} · Benar:{' '}
                  {selectedAnswersParticipant.correct_answers}/30
                </div>
              </div>
              <button
                onClick={() => setSelectedAnswersParticipant(null)}
                className="p-1.5 rounded-lg border border-black font-black text-xs hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 pr-2 flex-1">
              {AVIATION_QUESTIONS.map((q) => {
                const userChoice =
                  selectedAnswersParticipant.answers?.[q.id];
                const isCorrect = userChoice === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border-2 border-black text-xs ${
                      !userChoice
                        ? 'bg-[#FDFBF7]'
                        : isCorrect
                        ? 'bg-[#F0FDF4]'
                        : 'bg-[#FFF1F2]'
                    }`}
                  >
                    <div className="flex justify-between font-bold mb-1">
                      <span>Soal #{q.id}</span>
                      <span className="font-black">
                        {!userChoice ? (
                          <span className="text-neutral-400">Belum Dijawab</span>
                        ) : isCorrect ? (
                          <span className="text-[#10B981] inline-flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>BENAR (Pilihan: {userChoice})</span>
                          </span>
                        ) : (
                          <span className="text-[#F43F5E] inline-flex items-center gap-1">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                            <span>SALAH (Pilihan: {userChoice}, Kunci: {q.correctAnswer})</span>
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-neutral-800 font-medium">{q.question}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t-2 border-black/10 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedAnswersParticipant(null)}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl border border-black hover:bg-neutral-800 cursor-pointer"
              >
                Tutup Lembar Jawaban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
