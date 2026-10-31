import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  Send,
  ShieldAlert,
} from 'lucide-react';
import { Participant, Question } from '../types';
import { AVIATION_QUESTIONS, calculateScore } from '../data/questions';
import {
  updateParticipantProgress,
  submitExam,
  disqualifyParticipant,
} from '../lib/supabase';
import { AntiCheatModal, OfflineBanner } from './AntiCheatBanner';

interface ExamRoomProps {
  participant: Participant;
  examIsOpen: boolean;
  onFinishExam: (score: number, correctCount: number) => void;
  onDisqualified: () => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  participant,
  onFinishExam,
  onDisqualified,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>(
    participant.answers || {}
  );
  const [violationsCount, setViolationsCount] = useState<number>(
    participant.violations_count || 0
  );
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(
    participant.status === 'disqualified'
  );
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [copyWarning, setCopyWarning] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const violationsRef = useRef(violationsCount);
  violationsRef.current = violationsCount;
  const isDisqualifiedRef = useRef(isDisqualified);
  isDisqualifiedRef.current = isDisqualified;
  const lastViolationTimeRef = useRef(0);

  const currentQuestion: Question = AVIATION_QUESTIONS[currentIdx];
  const totalQuestions = AVIATION_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  // 1. Anti-Cheat: Tab Switch, App Switch, and Window Blur Detection (Mobile & Desktop)
  const handleCheatViolation = useCallback(() => {
    if (isDisqualifiedRef.current) return;

    // Cooldown debouncing (1.5s): Mencegah double-strike jika browser mobile mengirim visibilitychange dan pagehide bersamaan
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 1500) {
      return;
    }
    lastViolationTimeRef.current = now;

    const nextCount = violationsRef.current + 1;
    setViolationsCount(nextCount);
    setShowWarningModal(true);

    if (nextCount >= 3) {
      setIsDisqualified(true);
      disqualifyParticipant(
        participant.phone,
        'Pelanggaran anti-curang: 3 kali meninggalkan layar ujian/pindah tab/aplikasi'
      );
      onDisqualified();
    } else {
      updateParticipantProgress(
        participant.phone,
        answers,
        nextCount,
        'in_progress'
      );
    }
  }, [answers, onDisqualified, participant.phone]);

  useEffect(() => {
    // Desktop & Mobile: Visibility Change (tab switch, minimize, home button, app switcher)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        handleCheatViolation();
      }
    };

    // Mobile: Pagehide (iOS Safari & Android Chrome app switch / tab switch)
    const handlePageHide = () => {
      handleCheatViolation();
    };

    // Page Lifecycle API: Freeze (Mobile background freeze)
    const handleFreeze = () => {
      handleCheatViolation();
    };

    // Desktop & Split-Screen Mobile: Focus Blur
    const handleWindowBlur = () => {
      // Pastikan bukan blur internal, melainkan fokus berpindah ke luar jendela browser
      if (document.hidden || !document.hasFocus()) {
        handleCheatViolation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('freeze', handleFreeze);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('freeze', handleFreeze);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleCheatViolation]);

  // 2. Anti-Cheat: Block Copy, Paste, Cut, Selection & Context Menu (Mobile Touch & Desktop)
  useEffect(() => {
    const triggerCopyAlert = (msg: string) => {
      setCopyWarning(msg);
      setTimeout(() => setCopyWarning(null), 3000);
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyAlert('Aksi COPY dinonaktifkan demi integritas ujian!');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerCopyAlert('Aksi PASTE dinonaktifkan demi integritas ujian!');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerCopyAlert('Klik kanan dinonaktifkan selama ujian berlangsung!');
    };

    // Mencegah long-press text selection di HP (Mobile text grab / share toolbar)
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'u', 's', 'p'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        triggerCopyAlert('Pintasan keyboard dinonaktifkan demi integritas ujian!');
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 3. Online/Offline Network Monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 4. Handle Option Selection
  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isDisqualified) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(newAnswers);

    // Sync in background to Supabase
    updateParticipantProgress(
      participant.phone,
      newAnswers,
      violationsCount,
      'in_progress'
    );
  };

  // 5. Submit Answers
  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    const { score, correctCount } = calculateScore(answers);

    try {
      await submitExam(participant.phone, answers, score, correctCount);
      setShowSubmitModal(false);
      onFinishExam(score, correctCount);
    } catch (err) {
      console.error(err);
      setShowSubmitModal(false);
      onFinishExam(score, correctCount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Offline Alert Banner */}
      <OfflineBanner isOffline={isOffline} />

      {/* Copy/Paste Protection Toast */}
      {copyWarning && (
        <div className="fixed top-20 right-4 z-50 bg-[#F43F5E] text-white border-2 border-black rounded-xl px-4 py-2.5 text-xs sm:text-sm font-extrabold brutal-shadow animate-in slide-in-from-top duration-150 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{copyWarning}</span>
        </div>
      )}

      {/* Anti-Cheat Modal */}
      <AntiCheatModal
        isOpen={showWarningModal}
        violationsCount={violationsCount}
        maxViolations={3}
        onDismiss={() => setShowWarningModal(false)}
        isDisqualified={isDisqualified}
      />

      {/* Top Header Card */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 mb-5 brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4 overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={participant.proof_url}
            alt={participant.username}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover border-2 border-black shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Peserta Ujian
            </div>
            <div className="text-sm sm:text-base font-black text-black truncate">
              {participant.username}
            </div>
          </div>
        </div>

        {/* Status Indicators & Submit Button */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Progress Indicator */}
          <div className="px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl border-2 border-black bg-[#FDFBF7] text-[11px] sm:text-xs font-bold font-mono-num brutal-shadow-sm flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span className="whitespace-nowrap">
              <strong className="text-[#10B981] font-black">{answeredCount}</strong> / {totalQuestions}
            </span>
          </div>

          {/* Violations Strike Indicator */}
          <div
            className={`px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl border-2 border-black text-[11px] sm:text-xs font-bold brutal-shadow-sm flex items-center justify-center gap-1.5 ${
              violationsCount === 0
                ? 'bg-[#F0FDF4] text-neutral-800'
                : 'bg-[#FFF1F2] text-[#F43F5E]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Pelanggaran: {violationsCount}/3</span>
          </div>

          {/* Selesai / Submit Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            disabled={isDisqualified}
            className="col-span-2 sm:col-span-1 px-4 py-2.5 sm:py-2 rounded-xl border-2 border-black bg-[#34D399] text-black font-black text-xs sm:text-sm brutal-shadow-sm brutal-btn cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Kumpulkan Ujian</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Question Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 brutal-shadow relative select-none">
            {/* Question Section Badge */}
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b-2 border-black/10">
              <span className="text-xs font-black uppercase tracking-wider text-black bg-[#FFE600] px-3 py-1 rounded-lg border-2 border-black brutal-shadow-sm">
                {currentQuestion.section}: {currentQuestion.sectionTitle}
              </span>
              <span className="text-xs font-extrabold text-neutral-500 font-mono-num">
                Soal #{currentQuestion.id} dari {totalQuestions}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-black text-black leading-relaxed mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={isDisqualified}
                    className={`w-full text-left p-4 rounded-xl border-2 border-black transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#34D399] text-black font-black brutal-shadow translate-x-[-1px] translate-y-[-1px]'
                        : 'bg-[#FDFBF7] text-neutral-900 font-bold hover:bg-[#F3F0E6]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center text-xs font-black shrink-0 ${
                        isSelected ? 'bg-white text-black' : 'bg-white text-neutral-700'
                      }`}
                    >
                      {option.id}
                    </div>
                    <span className="text-sm sm:text-base leading-snug pt-0.5">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="mt-8 pt-4 border-t-2 border-black/10 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className={`px-4 py-2.5 rounded-xl border-2 border-black text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                  currentIdx === 0
                    ? 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed'
                    : 'bg-white text-black brutal-shadow-sm hover:bg-neutral-100 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-xs font-bold text-neutral-500 hidden sm:block">
                Gunakan nomor di samping untuk melompat soal
              </div>

              {currentIdx < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl border-2 border-black bg-[#FFE600] text-black text-xs sm:text-sm font-black brutal-shadow-sm brutal-btn cursor-pointer flex items-center gap-1.5"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  disabled={isDisqualified}
                  className="px-5 py-2.5 rounded-xl border-2 border-black bg-[#34D399] text-black text-xs sm:text-sm font-black brutal-shadow brutal-btn cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Selesai & Kumpulkan</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Question Palette Column */}
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-black rounded-2xl p-5 brutal-shadow sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-black uppercase tracking-wider">
                Daftar Nomor Soal
              </h3>
              <span className="text-xs font-bold text-neutral-500">
                1–30
              </span>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 mb-5">
              {AVIATION_QUESTIONS.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl border-2 border-black font-mono-num font-black text-xs transition-all flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'bg-[#FFE600] text-black ring-2 ring-black brutal-shadow-sm scale-105'
                        : isAnswered
                        ? 'bg-[#34D399] text-black'
                        : 'bg-[#FDFBF7] text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 pt-3 border-t-2 border-black/10 text-xs font-bold text-neutral-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md border border-black bg-[#34D399]" />
                <span>Sudah Dijawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md border border-black bg-[#FFE600]" />
                <span>Sedang Dibuka</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md border border-black bg-[#FDFBF7]" />
                <span>Belum Dijawab ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={isDisqualified}
              className="w-full mt-6 py-3 px-4 rounded-xl border-2 border-black bg-[#818CF8] text-black font-black text-xs uppercase tracking-wider brutal-shadow brutal-btn cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kumpulkan Ujian Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border-3 border-black rounded-2xl p-6 brutal-shadow-lg">
            <h3 className="text-xl font-black text-black mb-2">
              Kumpulkan Lembar Jawaban?
            </h3>
            <p className="text-xs font-semibold text-neutral-600 mb-4">
              Pastikan Anda telah memeriksa semua jawaban sebelum mengirimkan ujian.
            </p>

            <div className="bg-[#FDFBF7] border-2 border-black rounded-xl p-4 mb-5 space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span>Total Soal:</span>
                <span>{totalQuestions} Soal</span>
              </div>
              <div className="flex justify-between text-[#10B981]">
                <span>Sudah Dijawab:</span>
                <span>{answeredCount} Soal</span>
              </div>
              <div className="flex justify-between text-[#F43F5E]">
                <span>Belum Dijawab:</span>
                <span>{totalQuestions - answeredCount} Soal</span>
              </div>
            </div>

            {totalQuestions - answeredCount > 0 && (
              <div className="mb-4 p-3 bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl text-xs font-bold text-[#F43F5E] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Perhatian: Anda masih memiliki {totalQuestions - answeredCount} soal yang belum dijawab!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-black font-bold text-xs bg-white hover:bg-neutral-100 cursor-pointer"
              >
                Kembali Periksa
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl border-2 border-black font-black text-xs bg-[#34D399] text-black brutal-shadow brutal-btn cursor-pointer"
              >
                {isSubmitting ? 'Mengirim...' : 'Ya, Kumpulkan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
