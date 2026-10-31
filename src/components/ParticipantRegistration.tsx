import React, { useState, useRef } from 'react';
import {
  PartyPopper,
  FileText,
  Target,
  ShieldAlert,
  PlaneTakeoff,
  Camera,
  AlertTriangle,
  X,
  Upload,
} from 'lucide-react';
import { uploadProofPhoto, registerParticipant } from '../lib/supabase';
import { Participant } from '../types';

interface ParticipantRegistrationProps {
  onRegistered: (participant: Participant) => void;
  examIsOpen: boolean;
}

export const ParticipantRegistration: React.FC<ParticipantRegistrationProps> = ({
  onRegistered,
}) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMessage('File harus berupa gambar (JPG, PNG, atau WEBP)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Ukuran file maksimal 10MB');
        return;
      }
      setErrorMessage(null);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanPhone = phone.trim();

    if (!cleanUsername) {
      setErrorMessage('Silakan isi nama panggilan Anda');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage('Silakan isi nomor WhatsApp aktif yang valid (min. 9 digit)');
      return;
    }
    if (!imageFile) {
      setErrorMessage('Wajib mengunggah foto bukti identitas diri Anda dari galeri');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload photo to Supabase storage bucket 'proofs'
      const { url: proofUrl, error: uploadErr } = await uploadProofPhoto(imageFile, cleanPhone);
      if (!proofUrl) {
        throw new Error(uploadErr || 'Gagal mengunggah foto ke storage');
      }

      // 2. Register participant
      const { participant, error: regErr } = await registerParticipant({
        username: cleanUsername,
        phone: cleanPhone,
        proof_url: proofUrl,
        status: 'waiting',
      });

      if (regErr) {
        throw new Error(regErr);
      }

      onRegistered(participant);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat pendaftaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-8">
      {/* Banner Giveaway */}
      <div className="bg-[#FFE600] border-2 border-black rounded-2xl p-5 sm:p-6 mb-6 brutal-shadow relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-wider uppercase text-black bg-white px-2.5 py-1 rounded-md border border-black mb-2.5">
              <PartyPopper className="w-3.5 h-3.5 text-black" />
              <span>200 Member Celebration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-tight">
              Ujian Aviasi Nusasky Community
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-800 mt-1">
              Giveaway khusus anggota komunitas aviasi WhatsApp. Jawab 30 soal pilihan ganda seputar dunia penerbangan!
            </p>
          </div>
          <div className="hidden sm:flex shrink-0 p-3 bg-white border-2 border-black rounded-xl brutal-shadow-sm">
            <PlaneTakeoff className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-black/20 flex flex-wrap items-center gap-4 text-xs font-bold text-neutral-900">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-black" />
            <span>30 Soal Aviasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-black" />
            <span>Nilai Maksimal 100</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-black" />
            <span>Sistem Anti-Curang</span>
          </div>
        </div>
      </div>

      {/* Formulir Pendaftaran */}
      <div className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 brutal-shadow">
        <h2 className="text-xl font-black text-black mb-1">
          Formulir Peserta Ujian
        </h2>
        <p className="text-xs text-neutral-600 font-medium mb-6">
          Pastikan data Anda sesuai dengan akun WhatsApp yang terdaftar di grup Nusasky Community.
        </p>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-[#FFF1F2] border-2 border-[#F43F5E] rounded-xl text-xs font-bold text-[#F43F5E] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Nama Lengkap / Username WA <span className="text-[#F43F5E]">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: Capt. Andi Nugraha"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-[#FDFBF7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all"
            />
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Nomor WhatsApp <span className="text-[#F43F5E]">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-black text-sm font-bold bg-[#FDFBF7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] transition-all"
            />
            <p className="text-[11px] font-semibold text-neutral-500 mt-1">
              Nomor ini digunakan sebagai identifikasi peserta dan pengiriman hadiah giveaway.
            </p>
          </div>

          {/* Upload Foto Bukti Diri */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Foto Bukti Identitas Diri (Dari Galeri) <span className="text-[#F43F5E]">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-black rounded-xl p-6 bg-[#FDFBF7] hover:bg-[#F9F7F1] cursor-pointer text-center transition-colors"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#818CF8] border-2 border-black flex items-center justify-center brutal-shadow-sm mb-3">
                  <Camera className="w-6 h-6 text-black stroke-[2.5]" />
                </div>
                <div className="text-sm font-extrabold text-black">
                  Pilih Foto dari Galeri
                </div>
                <div className="text-xs font-semibold text-neutral-500 mt-1">
                  Ambil swafoto atau tangkapan layar profil WA sebagai bukti keabsahan (Maks. 10MB)
                </div>
              </div>
            ) : (
              <div className="border-2 border-black rounded-xl p-4 bg-[#FDFBF7] flex items-center gap-4">
                <img
                  src={previewUrl}
                  alt="Preview Bukti"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-black shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-black truncate">
                    {imageFile?.name}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500">
                    {((imageFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB · Siap diunggah
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs font-bold text-[#818CF8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Ganti Foto</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-1.5 text-xs font-bold text-[#F43F5E] border-2 border-black rounded-lg bg-white hover:bg-[#FFF1F2] cursor-pointer"
                  title="Hapus foto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Aturan Singkat */}
          <div className="bg-[#F0FDF4] border-2 border-black rounded-xl p-4 text-xs font-semibold text-neutral-800 space-y-1.5">
            <div className="font-extrabold text-black flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-black" />
              <span>Ketentuan Ujian & Anti-Curang:</span>
            </div>
            <p>1. Dilarang berpindah tab atau meminimalkan browser (3 peringatan = diskualifikasi).</p>
            <p>2. Dilarang melakukan copy, paste, dan klik kanan.</p>
            <p>3. Soal hanya bisa dikerjakan setelah sesi dibuka secara resmi oleh Admin.</p>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-6 rounded-xl border-2 border-black font-black text-sm tracking-wide text-black uppercase transition-all ${
              isSubmitting
                ? 'bg-neutral-300 cursor-not-allowed'
                : 'bg-[#34D399] brutal-shadow brutal-btn cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Mengunggah & Mendaftarkan...' : 'Masuk ke Ruang Ujian'}
          </button>
        </form>
      </div>
    </div>
  );
};
