import React from 'react';
import { AlertOctagon, WifiOff } from 'lucide-react';

interface AntiCheatModalProps {
  isOpen: boolean;
  violationsCount: number;
  maxViolations: number;
  onDismiss: () => void;
  isDisqualified: boolean;
}

export const AntiCheatModal: React.FC<AntiCheatModalProps> = ({
  isOpen,
  violationsCount,
  maxViolations,
  onDismiss,
  isDisqualified,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-lg animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#F43F5E] border-2 border-black flex items-center justify-center brutal-shadow-sm text-white shrink-0">
            <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-black uppercase tracking-tight">
              {isDisqualified ? 'Diskualifikasi' : `Peringatan Anti-Curang (${violationsCount}/${maxViolations})`}
            </h3>
            <span className="text-xs font-bold text-neutral-600">
              Sistem Pengawasan Nusasky
            </span>
          </div>
        </div>

        <div className="bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl p-4 mb-5 text-sm font-semibold text-neutral-900 leading-relaxed">
          {isDisqualified ? (
            <p>
              Anda telah melakukan <strong className="text-[#F43F5E]">3 kali pelanggaran</strong> (berpindah tab, beralih aplikasi di ponsel, atau meminimalkan browser). Sesuai aturan giveaway Nusasky Community, status Anda dinyatakan <strong className="text-[#F43F5E]">DIDISKUALIFIKASI</strong> dan lembar ujian dikunci.
            </p>
          ) : violationsCount === 1 ? (
            <p>
              Terdeteksi berpindah tab, membuka aplikasi lain, atau meninggalkan layar ujian! Mohon tetap fokus pada halaman ini. Copy-paste dan membuka aplikasi lain di HP dilarang keras.
            </p>
          ) : (
            <p>
              <strong className="text-[#F43F5E]">Peringatan Terakhir!</strong> Anda telah terdeteksi meninggalkan layar ujian sebanyak 2 kali. Jika Anda keluar atau berpindah aplikasi sekali lagi, sistem akan mendiskualifikasi Anda secara permanen.
            </p>
          )}
        </div>

        {!isDisqualified ? (
          <button
            onClick={onDismiss}
            className="w-full py-3 px-4 bg-[#FFE600] text-black font-extrabold text-sm rounded-xl border-2 border-black brutal-shadow brutal-btn cursor-pointer"
          >
            Saya Mengerti & Kembali Mengerjakan
          </button>
        ) : (
          <div className="text-center p-2 text-xs font-bold text-neutral-500">
            Hubungi Admin Nusasky Community di grup WhatsApp jika Anda merasa ini adalah kekeliruan teknis.
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
    <div className="sticky top-[58px] sm:top-[65px] z-30 bg-[#F43F5E] text-white border-b-2 border-black px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>KONEKSI TERPUTUS: Sambungan internet Anda tidak stabil atau terputus.</span>
        </div>
        <span className="hidden md:inline bg-black/20 px-2 py-0.5 rounded text-xs">
          Jawaban tersimpan aman di perangkat dan akan disinkronkan saat terhubung kembali.
        </span>
      </div>
    </div>
  );
};
