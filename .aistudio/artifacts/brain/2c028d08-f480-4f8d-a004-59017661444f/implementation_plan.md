# Nusasky Community Aviation Quiz & Giveaway Platform

Platform ujian aviasi interaktif untuk memperingati pencapaian 200 anggota WhatsApp Nusasky Community dengan gaya visual **Neon Brutalism cerah** sesuai gambar referensi, terintegrasi dengan Supabase untuk penyimpanan data peserta, berkas foto bukti identitas ke Storage bucket `proofs`, pengawasan anti-curang bertahap, serta dashboard admin real-time untuk penentuan pemenang giveaway.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Utama yang Telah Dikonfirmasi:**
> 1. **Penanganan Pelanggaran Anti-Curang**: Menggunakan sistem peringatan bertahap (*strike system*). Peserta yang berpindah tab atau blur browser akan mendapat peringatan 1 dan 2; pada peringatan ke-3, ujian langsung dikunci dan peserta didiskualifikasi secara otomatis.
> 2. **Kendali Waktu Ujian**: Waktu ujian tidak dibatasi timer countdown lokal perorangan, melainkan dikontrol secara terpusat oleh Admin (buka/tutup sesi ujian). Peserta hanya dapat memulai dan mengirimkan jawaban ketika status ujian dibuka oleh admin.
> 3. **Penyimpanan Foto Bukti**: Wajib menggunakan Supabase Storage bucket `proofs`. Disertakan panduan skema SQL lengkap untuk tabel dan konfigurasi policy Storage Supabase agar upload publik/peserta berhasil tanpa hambatan.

---

### 1. Overview & Core Concept

- **Tujuan Utama**: Mengadakan kompetisi ujian pengetahuan penerbangan sebanyak 30 soal pilihan ganda bagi anggota Nusasky Community secara adil, transparan, dan terorganisir untuk memperebutkan hadiah giveaway perayaan 200 member.
- **Dua Portal Utama**:
  1. **Portal Peserta**: Registrasi cepat dengan nomor WhatsApp & nama panggilan, upload foto bukti diri ke Supabase Storage, tampilan ruang tunggu sebelum ujian dibuka, lembar soal ujian interaktif dengan navigasi nomor, deteksi perpindahan tab & blokir copy-paste, serta konfirmasi submit.
  2. **Portal Admin (Password Terproteksi: `NSC-ANNIVERSARY-200`)**: Kendali tombol master buka/tutup ujian, kartu metrik statistik, live monitoring peserta (status pengerjaan, jumlah pelanggaran, jawaban masuk secara real-time), tombol diskualifikasi/buka blokir manual, dan tabel rekapitulasi nilai otomatis dengan urutan peringkat skor tertinggi dan waktu submit tercepat.

---

### 2. User Experience & Visual Design

Mengadopsi estetika **Bright Neon Brutalism** yang playful, bersih, dan berkarakter kuat sesuai gambar referensi:

- **Aesthetic Direction**:
  - Warna dasar kanvas: Cream hangat / Soft Vanilla (`#FDFBF7` / `#F8F6EE`).
  - Garis batas tegas hitam pekat (`border-2 border-black` dan `border-[2.5px] border-black`).
  - Bayangan tebal retro (*hard brutalist offset drop-shadow*: `shadow-[3px_3px_0px_#000]` dan `shadow-[5px_5px_0px_#000]`).
  - Sudut melengkung halus (*chunky rounded pill corners* `rounded-2xl` & `rounded-xl`).
  - Aksen warna cerah neon-pastel:
    - *Canary Yellow*: `#FDE047` (highlight status, tombol utama CTA)
    - *Electric Mint / Emerald*: `#34D399` / `#10B981` (status aktif/selesai, jawaban terpilih)
    - *Bubblegum Pink*: `#FB7185` / `#F43F5E` (pelanggaran anti-curang, peringatan, aksi berbahaya)
    - *Sky / Periwinkle Blue*: `#38BDF8` / `#818CF8` (tema aviasi Nusasky, ikon pesawat, status tunggu)
- **Typografi**:
  - Font Display: `Plus Jakarta Sans` / `Outfit` (Bold, clean geometric sans-serif dengan spasi yang lega).
  - Teks Angka & Skor: Monospace tabular (`font-mono tabular-nums`) untuk konsistensi angka dan waktu.
  - Bebas dari AI-slop: Tanpa teks bertele-tele "Quiz Pro 2.5", tanpa watermark pudar, dan tanpa elemen dekoratif yang tidak fungsional.
- **Alur Pengguna**:
  1. *Landing & Registrasi*: Peserta memasukkan Username, No. HP WhatsApp, dan memilih foto dari galeri. Unggah langsung ke Supabase Storage `proofs`.
  2. *Lobby Tunggu*: Menampilkan status sesi ujian ("Menunggu admin membuka ujian" vs "Ujian Telah Dibuka").
  3. *Ruang Ujian*: 30 soal pilihan ganda aviasi dengan tombol navigasi A-B-C-D yang responsif, palet nomor 1–30 untuk melompat antar soal, indikator koneksi online/offline real-time, dan monitor pelanggaran anti-curang.
  4. *Layar Hasil/Selesai*: Tanda terima pengiriman ujian dengan nomor urut pendaftaran dan instruksi menunggu pengumuman pemenang di grup WhatsApp.

---

### 3. Key Product Decisions & Trade-Offs

- **Supabase Client & Direct Storage Integration**:
  - Menggunakan `@supabase/supabase-js` resmi yang dikonfigurasikan dengan URL `https://ckbirxkmyglcblqwxuvf.supabase.co` dan API key publik yang disediakan.
  - Upload file bukti langsung ke Supabase Storage bucket `proofs` dengan penamaan file unik berbasis timestamp (`proof_<phone>_<timestamp>.<ext>`), lalu menyimpan public URL-nya ke tabel peserta.
- **Skema SQL Lengkap yang Disediakan**:
  - Kami sediakan file skema SQL (`supabase_schema.sql`) yang bisa langsung dijalankan oleh admin di Supabase SQL Editor untuk membuat tabel `participants`, `quiz_sessions`, `answers_log`, dan bucket `proofs` beserta security policies-nya.
- **Sistem Anti-Curang Multi-Lapis**:
  - Event listener `visibilitychange` & `window.blur` untuk mendeteksi peserta meninggalkan tab/browser.
  - Blokir klik kanan (`contextmenu`) dan tombol pintas copy (`ctrl+c`, `meta+c`, `ctrl+u`).
  - Monitor koneksi internet (`window.addEventListener('offline')` dan `'online'`) dengan banner peringatan brutalist jika koneksi peserta terputus saat pengerjaan.
  - Setiap pelanggaran dicatat ke state dan dikirim ke Supabase agar admin dapat melihatnya secara langsung.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NUSASKY QUIZ PLATFORM                           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│         HALAMAN USER          │           │         HALAMAN ADMIN         │
│  - Registrasi (No HP + Foto)  │           │  - Autentikasi Sandi          │
│  - Storage Upload `proofs`    │           │    (NSC-ANNIVERSARY-200)      │
│  - Ruang Ujian (30 Soal)      │           │  - Sakelar Buka/Tutup Ujian   │
│  - Anti-Cheat & Offline alert │           │  - Real-Time Live Monitoring  │
│  - Pengiriman Jawaban         │           │  - Leaderboard & Rekap Nilai  │
│  - Modal Hasil & Sukses       │           │  - Ekspor Data & Blokir User  │
└───────────────┬───────────────┘           └───────────────┬───────────────┘
                │                                           │
                └─────────────────────┬─────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │     SUPABASE BACKEND      │
                        │ - Table: participants     │
                        │ - Table: exam_settings    │
                        │ - Storage: proofs bucket  │
                        │ - Realtime Subscription   │
                        └───────────────────────────┘
```

#### Rencana Struktur Data & Skema SQL Supabase:
1. **Tabel `exam_settings`**:
   - `id` (int/text primary key, default 'singleton')
   - `is_open` (boolean, default false)
   - `announcement` (text)
   - `updated_at` (timestamp)
2. **Tabel `participants`**:
   - `id` (uuid default gen_random_uuid())
   - `username` (text)
   - `phone` (text)
   - `proof_url` (text)
   - `status` (text: 'waiting', 'in_progress', 'submitted', 'disqualified')
   - `violations_count` (int default 0)
   - `score` (numeric default 0)
   - `correct_answers` (int default 0)
   - `answers` (jsonb)
   - `created_at` (timestamp)
   - `submitted_at` (timestamp)
3. **Storage Bucket `proofs`**:
   - Bucket public untuk menyimpan foto identitas bukti peserta.

---

### Verifikasi & Rencana Eksekusi Setelah Persetujuan:
1. Menyediakan script SQL lengkap yang dapat disalin dengan 1-klik di panel Admin.
2. Memasang dependensi `@supabase/supabase-js` dan canvas confetti untuk perayaan hasil.
3. Membangun halaman antarmuka pengguna dengan komponen Neon Brutalism cerah.
4. Membangun dashboard admin dengan sistem autentikasi aman, pengawasan peserta, dan kalkulasi nilai otomatis (skor maks 100 untuk 30 soal, nilai per soal ~3.333 poin).
5. Menguji anti-curang, upload gambar, dan kompilasi aplikasi.
