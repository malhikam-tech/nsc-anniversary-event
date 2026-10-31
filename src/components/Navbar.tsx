import React from 'react';
import { Plane, User, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'user' | 'admin';
  onSelectView: (view: 'user' | 'admin') => void;
  isAdminLoggedIn: boolean;
  participantName?: string;
  onLogoutAdmin?: () => void;
  examIsOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  isAdminLoggedIn,
  onLogoutAdmin,
  examIsOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7] border-b-2 border-black px-3 sm:px-6 py-2.5 sm:py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center brutal-shadow-sm shrink-0">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-black leading-none">
              NUSASKY
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-neutral-600 tracking-wide uppercase leading-tight mt-0.5">
              200 Member
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Responsive & No-Overflow) */}
        <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => onSelectView('user')}
            className={`px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 border-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'user'
                ? 'bg-[#34D399] text-black brutal-shadow-sm'
                : 'bg-white text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            <span>
              <span className="inline sm:hidden">Peserta</span>
              <span className="hidden sm:inline">Portal Peserta</span>
            </span>
          </button>

          <button
            onClick={() => onSelectView('admin')}
            className={`px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg border-2 border-black transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#818CF8] text-black brutal-shadow-sm'
                : 'bg-white text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
            <span>
              <span className="inline sm:hidden">Admin</span>
              <span className="hidden sm:inline">Panel Admin</span>
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary Status or Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentView === 'admin' && isAdminLoggedIn ? (
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#F43F5E] rounded-lg border-2 border-black brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Admin</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black bg-white brutal-shadow-sm whitespace-nowrap">
              <span
                className={`w-2.5 h-2.5 rounded-full border border-black ${
                  examIsOpen ? 'bg-[#34D399]' : 'bg-[#F43F5E]'
                }`}
              />
              <span>{examIsOpen ? 'Sesi Ujian Buka' : 'Sesi Ujian Tutup'}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
