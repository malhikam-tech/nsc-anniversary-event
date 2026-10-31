/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ParticipantRegistration } from './components/ParticipantRegistration';
import { WaitingLobby } from './components/WaitingLobby';
import { ExamRoom } from './components/ExamRoom';
import { SubmissionSuccess } from './components/SubmissionSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import { Participant, ExamSettings } from './types';
import { fetchExamSettings, supabase } from './lib/supabase';
import { Lock, AlertTriangle, ArrowLeft } from 'lucide-react';

const ADMIN_PASSWORD = 'NSC-ANNIVERSARY-200';

export default function App() {
  const [currentView, setCurrentView] = useState<'user' | 'admin'>('user');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);

  const [examSettings, setExamSettings] = useState<ExamSettings>({
    id: 'singleton',
    is_open: false,
    announcement: 'Ujian Aviasi Nusasky 200 Member Giveaway akan segera dibuka oleh Admin!',
    max_violations: 3,
  });

  const [participant, setParticipant] = useState<Participant | null>(() => {
    try {
      const saved = localStorage.getItem('nusasky_active_participant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [examStage, setExamStage] = useState<
    'register' | 'waiting' | 'in_progress' | 'submitted' | 'disqualified'
  >(() => {
    try {
      const saved = localStorage.getItem('nusasky_active_participant');
      if (saved) {
        const p: Participant = JSON.parse(saved);
        if (p.status === 'submitted') return 'submitted';
        if (p.status === 'disqualified') return 'disqualified';
        return 'waiting';
      }
      return 'register';
    } catch {
      return 'register';
    }
  });

  // Load exam settings and setup realtime listener
  const refreshSettings = async () => {
    const settings = await fetchExamSettings();
    setExamSettings(settings);
  };

  useEffect(() => {
    refreshSettings();

    // Check admin session
    const adminSession = sessionStorage.getItem('nusasky_admin_auth');
    if (adminSession === 'true') {
      setIsAdminLoggedIn(true);
    }

    // Subscribe to realtime exam_settings changes
    const channel = supabase
      .channel('public_exam_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'exam_settings' },
        (payload) => {
          if (payload.new) {
            setExamSettings(payload.new as ExamSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update localStorage whenever participant changes
  useEffect(() => {
    if (participant) {
      localStorage.setItem('nusasky_active_participant', JSON.stringify(participant));
    }
  }, [participant]);

  // Handle Admin Login
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('nusasky_admin_auth', 'true');
      setAdminPasswordError(null);
      setAdminPasswordInput('');
    } else {
      setAdminPasswordError('Kata sandi salah! Akses khusus pengurus komunitas.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('nusasky_admin_auth');
    setCurrentView('user');
  };

  // Participant Registration handler
  const handleRegistered = (newParticipant: Participant) => {
    setParticipant(newParticipant);
    if (examSettings.is_open) {
      setExamStage('waiting');
    } else {
      setExamStage('waiting');
    }
  };

  // Participant Exam Completed
  const handleFinishExam = (score: number, correctCount: number) => {
    if (participant) {
      const updated: Participant = {
        ...participant,
        status: 'submitted',
        score,
        correct_answers: correctCount,
        submitted_at: new Date().toISOString(),
      };
      setParticipant(updated);
    }
    setExamStage('submitted');
  };

  // Participant Disqualified
  const handleDisqualified = () => {
    if (participant) {
      const updated: Participant = {
        ...participant,
        status: 'disqualified',
        violations_count: 3,
        disqualification_reason: 'Pelanggaran anti-curang bertahap (3 kali)',
      };
      setParticipant(updated);
    }
    setExamStage('disqualified');
  };

  // Switch or Reset participant
  const handleSwitchUser = () => {
    if (confirm('Keluar dari sesi peserta ini dan daftarkan nomor baru?')) {
      localStorage.removeItem('nusasky_active_participant');
      setParticipant(null);
      setExamStage('register');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 flex flex-col font-sans selection:bg-[#FFE600] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setAdminPasswordError(null);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        participantName={participant?.username}
        onLogoutAdmin={handleAdminLogout}
        examIsOpen={examSettings.is_open}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          isAdminLoggedIn ? (
            <AdminDashboard
              examSettings={examSettings}
              onUpdateSettings={setExamSettings}
              onLogout={handleAdminLogout}
            />
          ) : (
            /* Admin Login Gate */
            <div className="max-w-md mx-auto px-4 py-16">
              <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 brutal-shadow">
                <div className="w-14 h-14 rounded-2xl bg-[#818CF8] border-2 border-black flex items-center justify-center mb-4 brutal-shadow-sm">
                  <Lock className="w-7 h-7 text-black stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-black text-black tracking-tight mb-1">
                  Login Panel Admin
                </h2>
                <p className="text-xs font-semibold text-neutral-600 mb-6">
                  Khusus pengurus Nusasky Community untuk memantau ujian dan membuka soal.
                </p>

                {adminPasswordError && (
                  <div className="mb-4 p-3 bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl text-xs font-bold text-[#F43F5E] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{adminPasswordError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                      Kata Sandi Admin
                    </label>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="Masukkan sandi khusus panitia"
                      required
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-[#FDFBF7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#FFE600] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black brutal-shadow brutal-btn cursor-pointer"
                  >
                    Masuk ke Dashboard Admin
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentView('user')}
                    className="text-xs font-bold text-neutral-600 hover:text-black underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Peserta</span>
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Participant View */
          <>
            {!participant || examStage === 'register' ? (
              <ParticipantRegistration
                onRegistered={handleRegistered}
                examIsOpen={examSettings.is_open}
              />
            ) : examStage === 'waiting' ? (
              <WaitingLobby
                participant={participant}
                examSettings={examSettings}
                onStartExam={() => setExamStage('in_progress')}
                onRefreshStatus={refreshSettings}
                onSwitchUser={handleSwitchUser}
              />
            ) : examStage === 'in_progress' ? (
              <ExamRoom
                participant={participant}
                examIsOpen={examSettings.is_open}
                onFinishExam={handleFinishExam}
                onDisqualified={handleDisqualified}
              />
            ) : (
              <SubmissionSuccess
                participant={participant}
                score={participant.score}
                correctCount={participant.correct_answers}
                onRestart={() => {
                  if (participant.status === 'disqualified') {
                    handleSwitchUser();
                  } else {
                    setExamStage('waiting');
                  }
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs font-bold text-neutral-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Nusasky Aviation Community · 200 Members Milestone</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
