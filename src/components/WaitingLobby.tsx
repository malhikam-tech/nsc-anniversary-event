import React from 'react';
import {
  PlaneTakeoff,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  User,
} from 'lucide-react';
import { Participant, ExamSettings } from '../types';

interface WaitingLobbyProps {
  participant: Participant;
  examSettings: ExamSettings;
  onStartExam: () => void;
  onRefreshStatus: () => void;
  onSwitchUser: () => void;
}

export const WaitingLobby: React.FC<WaitingLobbyProps> = ({
  participant,
  examSettings,
  onStartExam,
  onRefreshStatus,
  onSwitchUser,
}) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
      {/* Kartu Profil Peserta */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 mb-6 brutal-shadow">
        <div className="flex items-center gap-4">
          <img
            src={participant.proof_url}
            alt={participant.username}
            className="w-16 h-16 rounded-xl object-cover border-2 border-black shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
              <User className="w-3.5 h-3.5" />
              <span>Peserta Terverifikasi</span>
            </div>
            <h2 className="text-xl font-black text-black truncate">
              {participant.username}
            </h2>
            <div className="text-xs font-semibold text-neutral-700">
              WhatsApp: {participant.phone}
            </div>
          </div>
          <button
            onClick={onSwitchUser}
            className="text-xs font-bold text-neutral-600 hover:text-black border-2 border-black rounded-lg px-2.5 py-1 bg-[#FDFBF7] cursor-pointer"
          >
            Ganti
          </button>
        </div>
      </div>

      {/* Status Box */}
      <div
        className={`border-3 border-black rounded-2xl p-6 sm:p-8 brutal-shadow mb-6 text-center ${
          examSettings.is_open ? 'bg-[#34D399]' : 'bg-[#FFE600]'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-black flex items-center justify-center mb-4 brutal-shadow-sm">
          {examSettings.is_open ? (
            <PlaneTakeoff className="w-8 h-8 text-black stroke-[2.5]" />
          ) : (
            <Clock className="w-8 h-8 text-black stroke-[2.5]" />
          )}
        </div>

        <h3 className="text-2xl font-black text-black tracking-tight mb-2">
          {examSettings.is_open ? 'Sesi Ujian Telah Dibuka!' : 'Menunggu Admin Membuka Sesi'}
        </h3>

        <p className="text-sm font-semibold text-neutral-900 max-w-md mx-auto mb-6">
          {examSettings.is_open
            ? 'Admin telah membuka akses soal. Siapkan diri Anda dan klik tombol di bawah untuk mulai menjawab 30 soal aviasi.'
            : examSettings.announcement ||
              'Admin sedang mempersiapkan lembar soal. Harap menunggu aba-aba resmi dari pengurus di grup WhatsApp Nusasky.'}
        </p>

        {examSettings.is_open ? (
          <button
            onClick={onStartExam}
            className="w-full py-4 px-6 bg-black text-white font-black text-base rounded-xl border-2 border-black hover:bg-neutral-800 brutal-shadow brutal-btn cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Mulai Kerjakan Soal Sekarang</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={onRefreshStatus}
            className="py-3 px-6 bg-white text-black font-extrabold text-xs sm:text-sm rounded-xl border-2 border-black brutal-shadow-sm hover:bg-neutral-100 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Periksa Status Ujian Terkini</span>
          </button>
        )}
      </div>

      {/* Catatan Penting */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow text-xs font-semibold text-neutral-800 space-y-3">
        <h4 className="font-black text-sm text-black uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-black" />
          <span>Instruksi Ujian Aviasi:</span>
        </h4>
        <div className="flex items-start gap-2">
          <span className="font-black text-black">1.</span>
          <span>
            Total <strong>30 soal pilihan ganda</strong> dengan 4 opsi (A, B, C, D).
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-black text-black">2.</span>
          <span>
            Jawaban Anda otomatis tersimpan saat Anda memilih opsi, sehingga aman bila koneksi terputus sesaat.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-black text-black">3.</span>
          <span>
            <strong>Peringatan Anti-Curang:</strong> Jangan beralih ke tab lain atau aplikasi lain. Sistem akan mencatat setiap perpindahan tab dan setelah 3 kali pelanggaran, Anda akan didiskualifikasi secara otomatis.
          </span>
        </div>
      </div>
    </div>
  );
};
