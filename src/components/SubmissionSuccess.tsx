import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Check, Info, ArrowLeft, Award } from 'lucide-react';
import { Participant } from '../types';

interface SubmissionSuccessProps {
  participant: Participant;
  score: number;
  correctCount: number;
  onRestart?: () => void;
}

export const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  participant,
  score,
  correctCount,
  onRestart,
}) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#34D399', '#818CF8', '#F43F5E'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-10">
      {/* Kartu Sukses Brutalist */}
      <div className="bg-[#34D399] border-3 border-black rounded-3xl p-6 sm:p-8 brutal-shadow-lg text-center relative overflow-hidden mb-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-white border-2 border-black flex items-center justify-center mb-4 brutal-shadow">
          <Trophy className="w-10 h-10 text-black stroke-[2.5]" />
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-black bg-white px-3 py-1 rounded-md border border-black mb-3">
          <Award className="w-3.5 h-3.5 text-black" />
          <span>Tanda Terima Resmi</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight mb-2">
          Jawaban Berhasil Dikirim!
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-neutral-900 max-w-md mx-auto">
          Terima kasih telah berpartisipasi dalam Ujian Aviasi Perayaan 200 Member Nusasky Community.
        </p>

        {/* Skor Box */}
        <div className="mt-6 bg-white border-2 border-black rounded-2xl p-5 brutal-shadow max-w-sm mx-auto text-center">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Hasil Ujian Anda
          </div>
          <div className="text-4xl sm:text-5xl font-black text-black font-mono-num my-1">
            {score}
            <span className="text-lg font-bold text-neutral-400">/100</span>
          </div>
          <div className="text-xs font-extrabold text-[#10B981] flex items-center justify-center gap-1">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{correctCount} dari 30 Soal Terjawab Benar</span>
          </div>
        </div>
      </div>

      {/* Rincian Peserta */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 brutal-shadow mb-6">
        <h3 className="text-sm font-black text-black uppercase tracking-wider mb-4 pb-2 border-b-2 border-black/10">
          Data Peserta Ujian:
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={participant.proof_url}
            alt={participant.username}
            className="w-16 h-16 rounded-xl object-cover border-2 border-black shrink-0"
          />
          <div className="space-y-0.5">
            <div className="text-base font-black text-black">
              {participant.username}
            </div>
            <div className="text-xs font-semibold text-neutral-600">
              WhatsApp: {participant.phone}
            </div>
            <div className="text-[11px] font-bold text-neutral-500 font-mono-num">
              Dikirim pada: {new Date().toLocaleTimeString('id-ID')} WIB
            </div>
          </div>
        </div>

        <div className="bg-[#FDFBF7] border-2 border-black rounded-xl p-4 text-xs font-semibold text-neutral-800 space-y-2">
          <div className="font-bold text-black flex items-center gap-1.5">
            <Info className="w-4 h-4 text-black shrink-0" />
            <span>Informasi Pengumuman Pemenang Giveaway:</span>
          </div>
          <p>
            1. Pemenang giveaway akan ditentukan oleh para admin berdasarkan perolehan nilai tertinggi dan waktu submit tercepat.
          </p>
          <p>
            2. Foto bukti diri Anda telah terverifikasi di server dan akan dicocokkan dengan keanggotaan WhatsApp Nusasky Community.
          </p>
          <p>
            3. Pantau terus pengumuman resminya di grup WhatsApp utama!
          </p>
        </div>
      </div>

      {onRestart && (
        <button
          onClick={onRestart}
          className="w-full py-3.5 px-4 bg-white hover:bg-neutral-100 text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black brutal-shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      )}
    </div>
  );
};
