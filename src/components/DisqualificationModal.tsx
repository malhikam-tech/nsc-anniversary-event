import React from 'react';
import { AlertOctagon, ShieldAlert, PhoneCall, LogOut, Clock } from 'lucide-react';
import { Participant } from '../types';

interface DisqualificationModalProps {
  participant: Participant;
  onExit: () => void;
}

export const DisqualificationModal: React.FC<DisqualificationModalProps> = ({
  participant,
  onExit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3">
      {/* Kotak Modal Proporsional ~3:4 / 4:3 tanpa scroll */}
      <div className="w-[92vw] max-w-[400px] bg-white border-3 border-black rounded-2xl p-4 sm:p-5 brutal-shadow-lg text-left animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b-2 border-black/10">
          <div className="w-9 h-9 rounded-xl bg-[#F43F5E] border-2 border-black flex items-center justify-center text-white shrink-0 brutal-shadow-sm">
            <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#F43F5E] leading-none mb-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Status: Didiskualifikasi</span>
            </div>
            <h2 className="text-base font-black text-black leading-tight truncate">
              Akses Ujian Telah Dikunci
            </h2>
          </div>
          <div className="px-2 py-0.5 rounded-md border border-black bg-[#F43F5E] text-white text-[11px] font-black font-mono-num shrink-0">
            3/3 Strike
          </div>
        </div>

        {/* Data Peserta Ringkas */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-black bg-[#FDFBF7] mb-3">
          <img
            src={participant.proof_url}
            alt={participant.username}
            className="w-9 h-9 rounded-lg object-cover border border-black shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black text-black truncate">
              {participant.username}
            </div>
            <div className="text-[10px] font-semibold text-neutral-500 font-mono-num">
              WA: {participant.phone}
            </div>
          </div>
        </div>

        {/* Kotak Alasan Spesifik */}
        <div className="bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl p-3 mb-3 text-xs space-y-1.5">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#F43F5E]">
            Alasan Diskualifikasi:
          </div>
          <div className="text-xs font-bold text-neutral-900 leading-snug">
            {participant.disqualification_reason ||
              'Terdeteksi meninggalkan layar ujian / berpindah tab atau aplikasi di HP sebanyak 3 kali.'}
          </div>
          <div className="pt-1 border-t border-[#F43F5E]/20 text-[10px] font-semibold text-neutral-500 flex items-center justify-between">
            <span>Sistem Anti-Curang Nusasky</span>
            <span className="font-mono-num font-bold text-black flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>Terkunci Otomatis</span>
            </span>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-neutral-600 mb-4 leading-tight">
          Sesuai aturan giveaway 200 member, lembar jawaban dikunci dan keputusan panitia bersifat mutlak.
        </p>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-white hover:bg-neutral-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 brutal-shadow-sm cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Panitia WA</span>
          </a>

          <button
            type="button"
            onClick={onExit}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-black bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider brutal-shadow brutal-btn cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
