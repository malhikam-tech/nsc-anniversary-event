import React from 'react';
import { AlertOctagon, WifiOff, ShieldAlert, Clock } from 'lucide-react';

interface AntiCheatModalProps {
  isOpen: boolean;
  violationsCount: number;
  maxViolations: number;
  detectedAction?: string;
  violationTime?: string;
  onDismiss: () => void;
  isDisqualified: boolean;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  isOpen,
  violationsCount,
  maxViolations,
  detectedAction = 'Berpindah tab atau aplikasi lain di HP',
  violationTime,
  onDismiss,
  isDisqualified,
}) => {
  if (!isOpen) return null;

  const remaining = Math.max(0, maxViolations - violationsCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3">
      {/* Kotak Modal Proporsional ~3:4 / 4:3 tanpa scroll */}
      <div className="w-[92vw] max-w-[390px] bg-white border-3 border-black rounded-2xl p-4 sm:p-5 brutal-shadow-lg text-left animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b-2 border-black/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F43F5E] border-2 border-black flex items-center justify-center text-white shrink-0 brutal-shadow-sm">
              <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-black uppercase tracking-tight leading-none">
                {isDisqualified ? 'Didiskualifikasi' : 'Peringatan Anti-Curang'}
              </h3>
              <span className="text-[10px] font-bold text-neutral-500 leading-none">
                Sistem Deteksi Nusasky
              </span>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded-md border border-black bg-[#FFF1F2] text-[#F43F5E] text-xs font-black font-mono-num shrink-0">
            {violationsCount}/{maxViolations}
          </div>
        </div>

        {/* Kotak Deteksi Spesifik */}
        <div className="bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl p-3 mb-3 text-xs space-y-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#F43F5E] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Aksi Terdeteksi Sistem:</span>
            </span>
            <div className="text-xs font-black text-neutral-900 mt-0.5 leading-snug">
              {detectedAction}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#F43F5E]/20 text-[11px] font-bold text-neutral-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Waktu Kejadian:</span>
            </span>
            <span className="font-mono-num text-black font-black">
              {violationTime || new Date().toLocaleTimeString('id-ID')} WIB
            </span>
          </div>
        </div>

        {/* Pesan Tingkat Pelanggaran */}
        <div className="bg-[#FDFBF7] border border-black rounded-xl p-2.5 mb-3.5 text-[11px] font-semibold text-neutral-800 leading-tight">
          {isDisqualified ? (
            <p className="text-[#F43F5E] font-black">
              Batas 3 pelanggaran terlampaui. Ujian Anda otomatis dikunci.
            </p>
          ) : violationsCount === 1 ? (
            <p>
              <strong className="text-[#F43F5E]">Peringatan Ke-1:</strong> Tersisa{' '}
              <strong className="text-black font-bold font-mono-num">{remaining} kesempatan</strong>. Dilarang berpindah tab, meminimalkan browser, atau membuka aplikasi lain di HP.
            </p>
          ) : (
            <p>
              <strong className="text-[#F43F5E]">PERINGATAN TERAKHIR (Ke-2):</strong> Tersisa{' '}
              <strong className="text-[#F43F5E] font-black font-mono-num">1 kesempatan lagi</strong>! Jika keluar sekali lagi, Anda langsung didiskualifikasi permanen.
            </p>
          )}
        </div>

        {/* Tombol Aksi */}
        {!isDisqualified ? (
          <button
            onClick={onDismiss}
            className="w-full py-2.5 px-4 bg-[#FFE600] hover:bg-[#FDD835] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black brutal-shadow brutal-btn cursor-pointer"
          >
            Saya Paham & Kembali Mengerjakan
          </button>
        ) : (
          <div className="text-center text-[10px] font-bold text-neutral-500">
            Hubungi panitia Nusasky Community untuk konfirmasi lebih lanjut.
          </div>
        )}
      </div>
    </div>
  );
};

interface OfflineBannerProps {
  isOffline: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null;

  return (
    <div className="sticky top-[58px] sm:top-[65px] z-30 bg-[#F43F5E] text-white border-b-2 border-black px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-bold">
        <div className="flex items-center gap-2">
          <WifiOff className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span>KONEKSI TERPUTUS: Tetap di halaman ini, jawaban Anda aman.</span>
        </div>
      </div>
    </div>
  );
};
