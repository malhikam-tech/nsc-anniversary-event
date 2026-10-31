import React from 'react';
import { AlertOctagon, ShieldAlert, PhoneCall, LogOut } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white border-3 border-black rounded-3xl p-6 sm:p-8 brutal-shadow-lg text-center animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Icon Header */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[#F43F5E] border-3 border-black flex items-center justify-center text-white brutal-shadow mb-5">
          <AlertOctagon className="w-10 h-10 stroke-[2.5]" />
        </div>

        {/* Badge Status */}
        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-[#F43F5E] px-3.5 py-1 rounded-md border-2 border-black mb-3 brutal-shadow-sm">
          <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
          <span>Status: Didiskualifikasi</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
          Akses Ujian Telah Dikunci
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-neutral-700 max-w-md mx-auto mb-6 leading-relaxed">
          Anda dinyatakan <strong className="text-[#F43F5E]">DIDISKUALIFIKASI</strong> dari Ujian Aviasi Nusasky Community 200 Member Giveaway karena terdeteksi melanggar tata tertib integritas ujian.
        </p>

        {/* Kotak Informasi Pelanggaran */}
        <div className="bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3 pb-3 border-b border-[#F43F5E]/20">
            <img
              src={participant.proof_url}
              alt={participant.username}
              className="w-12 h-12 rounded-xl object-cover border-2 border-black shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-black truncate">
                {participant.username}
              </div>
              <div className="text-xs font-bold text-neutral-600 font-mono-num">
                {participant.phone}
              </div>
            </div>
          </div>

          <div className="text-xs font-bold text-neutral-900 space-y-1">
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Pelanggaran:</span>
              <span className="text-[#F43F5E] font-black font-mono-num">
                {participant.violations_count || 3} / 3 (Batas Maksimal)
              </span>
            </div>
            <div className="flex flex-col gap-0.5 pt-1">
              <span className="text-neutral-500">Alasan Diskualifikasi:</span>
              <span className="text-neutral-900 font-extrabold bg-white p-2 rounded-lg border border-[#F43F5E]/30">
                {participant.disqualification_reason ||
                  'Terdeteksi meninggalkan layar ujian / berpindah tab atau aplikasi sebanyak 3 kali berturut-turut.'}
              </span>
            </div>
          </div>
        </div>

        {/* Penjelasan Ketentuan */}
        <div className="bg-[#FDFBF7] border-2 border-black rounded-xl p-3.5 mb-6 text-[11px] font-semibold text-neutral-600 text-left">
          <p className="font-bold text-neutral-900 mb-1">
            📌 Aturan Giveaway Komunitas:
          </p>
          <p>
            Sistem anti-curang Nusasky Community mencatat perpindahan tab, pembukaan aplikasi lain di HP, serta tindakan copy-paste. Keputusan sistem dan panitia bersifat final demi sportivitas perayaan 200 member.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://chat.whatsapp.com/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-xl border-2 border-black bg-white hover:bg-neutral-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 brutal-shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Hubungi Panitia WA</span>
          </a>

          <button
            type="button"
            onClick={onExit}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-black bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider brutal-shadow brutal-btn cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi Peserta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
