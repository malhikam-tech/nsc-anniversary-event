import { Question } from '../types';

export const AVIATION_QUESTIONS: Question[] = [
  // BAGIAN 1 — DASAR PENERBANGAN
  {
    id: 1,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama sayap pada pesawat terbang?',
    options: [
      { id: 'A', text: 'Menghasilkan gaya angkat' },
      { id: 'B', text: 'Menghasilkan tekanan kabin' },
      { id: 'C', text: 'Mengendalikan suhu mesin' },
      { id: 'D', text: 'Mengatur komunikasi radio' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 2,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa kepanjangan dari ATC dalam dunia penerbangan?',
    options: [
      { id: 'A', text: 'Aircraft Travel Control' },
      { id: 'B', text: 'Air Traffic Control' },
      { id: 'C', text: 'Aviation Terminal Communication' },
      { id: 'D', text: 'Air Transport Command' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 3,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama elevator pada pesawat?',
    options: [
      { id: 'A', text: 'Mengendalikan gerakan yaw' },
      { id: 'B', text: 'Mengendalikan gerakan roll' },
      { id: 'C', text: 'Mengendalikan gerakan pitch' },
      { id: 'D', text: 'Mengatur putaran mesin' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 4,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Pesawat yang menggunakan mesin turbofan umumnya termasuk kategori apa?',
    options: [
      { id: 'A', text: 'Glider' },
      { id: 'B', text: 'Balon udara' },
      { id: 'C', text: 'Pesawat layang' },
      { id: 'D', text: 'Pesawat bermesin jet' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 5,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama landing gear pada pesawat?',
    options: [
      { id: 'A', text: 'Mengatur tekanan kabin' },
      { id: 'B', text: 'Menopang pesawat saat di darat dan membantu proses pendaratan' },
      { id: 'C', text: 'Menghasilkan gaya dorong' },
      { id: 'D', text: 'Mengatur arah angin' },
    ],
    correctAnswer: 'B',
  },

  // BAGIAN 2 — AERODINAMIKA DAN INSTRUMEN
  {
    id: 6,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Empat gaya utama yang bekerja pada pesawat dalam penerbangan adalah …',
    options: [
      { id: 'A', text: 'Lift, drag, thrust, dan weight' },
      { id: 'B', text: 'Pitch, roll, yaw, dan thrust' },
      { id: 'C', text: 'Lift, pressure, speed, dan temperature' },
      { id: 'D', text: 'Drag, altitude, heading, dan weight' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 7,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa yang dimaksud dengan stall pada pesawat?',
    options: [
      { id: 'A', text: 'Mesin pesawat selalu berhenti bekerja' },
      { id: 'B', text: 'Pesawat kehilangan seluruh sistem hidraulik' },
      { id: 'C', text: 'Sayap kehilangan sebagian besar kemampuan menghasilkan lift akibat sudut serang yang melampaui batas kritis' },
      { id: 'D', text: 'Pesawat mencapai ketinggian jelajah' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 8,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Instrumen manakah yang menunjukkan ketinggian pesawat berdasarkan tekanan udara?',
    options: [
      { id: 'A', text: 'Airspeed indicator' },
      { id: 'B', text: 'Turn coordinator' },
      { id: 'C', text: 'Heading indicator' },
      { id: 'D', text: 'Altimeter' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 9,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa fungsi utama artificial horizon atau attitude indicator?',
    options: [
      { id: 'A', text: 'Menunjukkan jumlah bahan bakar' },
      { id: 'B', text: 'Menunjukkan sikap pitch dan roll pesawat terhadap horizon' },
      { id: 'C', text: 'Mengukur tekanan oli mesin' },
      { id: 'D', text: 'Menunjukkan jarak menuju bandara' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 10,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa yang ditunjukkan oleh VSI (Vertical Speed Indicator)?',
    options: [
      { id: 'A', text: 'Laju perubahan ketinggian pesawat' },
      { id: 'B', text: 'Kecepatan pesawat terhadap udara' },
      { id: 'C', text: 'Arah hidung pesawat' },
      { id: 'D', text: 'Jumlah putaran mesin' },
    ],
    correctAnswer: 'A',
  },

  // BAGIAN 3 — FASE PENERBANGAN DAN BANDARA
  {
    id: 11,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Urutan fase penerbangan yang paling tepat adalah …',
    options: [
      { id: 'A', text: 'Cruise → taxi → takeoff → landing' },
      { id: 'B', text: 'Landing → climb → taxi → cruise' },
      { id: 'C', text: 'Taxi → takeoff → climb → cruise → descent → approach → landing' },
      { id: 'D', text: 'Takeoff → landing → cruise → taxi' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 12,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Apa arti istilah rotate saat takeoff?',
    options: [
      { id: 'A', text: 'Pesawat mulai berbelok di taxiway' },
      { id: 'B', text: 'Pilot mematikan mesin' },
      { id: 'C', text: 'Pesawat mulai menurunkan hidung' },
      { id: 'D', text: 'Pilot mulai menaikkan hidung pesawat untuk memulai lepas landas' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 13,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Jika runway bernomor 27, arah magnetik runway tersebut kira-kira adalah …',
    options: [
      { id: 'A', text: '090°' },
      { id: 'B', text: '180°' },
      { id: 'C', text: '270°' },
      { id: 'D', text: '360°' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 14,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Dalam sistem PAPI, apa arti tampilan dua lampu putih dan dua lampu merah bagi pilot yang sedang melakukan approach?',
    options: [
      { id: 'A', text: 'Pesawat berada pada sudut pendekatan yang sesuai' },
      { id: 'B', text: 'Pesawat terlalu tinggi' },
      { id: 'C', text: 'Pesawat terlalu rendah' },
      { id: 'D', text: 'Runway sedang ditutup' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 15,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Apa fungsi utama sistem ILS (Instrument Landing System)?',
    options: [
      { id: 'A', text: 'Mengatur distribusi bahan bakar' },
      { id: 'B', text: 'Membantu panduan lateral dan vertikal saat pendekatan pendaratan' },
      { id: 'C', text: 'Mengendalikan pintu kargo' },
      { id: 'D', text: 'Mengatur tekanan ban pesawat' },
    ],
    correctAnswer: 'B',
  },

  // BAGIAN 4 — NAVIGASI, ATC, DAN CUACA
  {
    id: 16,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa arti clearance dalam komunikasi penerbangan?',
    options: [
      { id: 'A', text: 'Laporan kerusakan pesawat' },
      { id: 'B', text: 'Informasi jumlah penumpang' },
      { id: 'C', text: 'Perintah untuk mematikan transponder' },
      { id: 'D', text: 'Otorisasi dari ATC untuk melakukan operasi tertentu sesuai batasan yang diberikan' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 17,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa fungsi utama transponder pesawat?',
    options: [
      { id: 'A', text: 'Menghasilkan tenaga listrik utama' },
      { id: 'B', text: 'Mengendalikan flap' },
      { id: 'C', text: 'Mengirimkan respons elektronik agar pesawat dapat diidentifikasi dan dilacak oleh sistem pengawasan yang sesuai' },
      { id: 'D', text: 'Mengatur tekanan kabin' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 18,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa perbedaan utama antara METAR dan TAF?',
    options: [
      { id: 'A', text: 'METAR melaporkan cuaca yang diamati, sedangkan TAF berisi prakiraan cuaca bandara' },
      { id: 'B', text: 'METAR hanya untuk pesawat militer, sedangkan TAF untuk pesawat sipil' },
      { id: 'C', text: 'METAR berisi rute penerbangan, sedangkan TAF berisi daftar penumpang' },
      { id: 'D', text: 'METAR mengukur kecepatan pesawat, sedangkan TAF mengukur ketinggian' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 19,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa risiko utama wind shear saat takeoff atau landing?',
    options: [
      { id: 'A', text: 'Warna lampu runway berubah' },
      { id: 'B', text: 'Kecepatan dan arah angin berubah sehingga performa serta lintasan pesawat dapat terganggu' },
      { id: 'C', text: 'Frekuensi radio ATC otomatis berganti' },
      { id: 'D', text: 'Berat pesawat langsung bertambah' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 20,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa arti FL350 dalam penerbangan?',
    options: [
      { id: 'A', text: 'Ketinggian 3.500 kaki di atas permukaan tanah' },
      { id: 'B', text: 'Kecepatan 350 knot' },
      { id: 'C', text: 'Jarak 350 mil laut' },
      { id: 'D', text: 'Flight Level 350, yang secara nominal menunjukkan 35.000 kaki tekanan standar' },
    ],
    correctAnswer: 'D',
  },

  // BAGIAN 5 — SISTEM PESAWAT DAN KESELAMATAN
  {
    id: 21,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa fungsi utama sistem pressurization pada pesawat komersial yang terbang di ketinggian tinggi?',
    options: [
      { id: 'A', text: 'Menjaga tekanan kabin pada tingkat yang sesuai bagi penumpang dan awak' },
      { id: 'B', text: 'Menambah daya dorong mesin' },
      { id: 'C', text: 'Mengatur arah pesawat' },
      { id: 'D', text: 'Mendinginkan ban saat taxi' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 22,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa yang dimaksud dengan FOD dalam lingkungan penerbangan?',
    options: [
      { id: 'A', text: 'Flight Operations Document' },
      { id: 'B', text: 'Fuel Output Device' },
      { id: 'C', text: 'Foreign Object Debris, yaitu benda asing yang dapat membahayakan pesawat atau operasional bandara' },
      { id: 'D', text: 'Final Operations Departure' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 23,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa fungsi utama autopilot?',
    options: [
      { id: 'A', text: 'Menggantikan seluruh tanggung jawab pilot' },
      { id: 'B', text: 'Membantu mengendalikan pesawat sesuai mode dan perintah yang dipilih' },
      { id: 'C', text: 'Menjamin pesawat tidak mungkin mengalami stall' },
      { id: 'D', text: 'Mengisi bahan bakar secara otomatis' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 24,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa yang dimaksud dengan CRM (Crew Resource Management)?',
    options: [
      { id: 'A', text: 'Metode mempercepat pesawat saat takeoff' },
      { id: 'B', text: 'Sistem menghitung harga tiket' },
      { id: 'C', text: 'Prosedur mengganti mesin pesawat' },
      { id: 'D', text: 'Penggunaan komunikasi, koordinasi, dan sumber daya tim untuk mendukung keselamatan penerbangan' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 25,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Mengapa checklist digunakan oleh pilot?',
    options: [
      { id: 'A', text: 'Agar pilot tidak perlu memahami sistem pesawat' },
      { id: 'B', text: 'Untuk menggantikan semua prosedur darurat' },
      { id: 'C', text: 'Untuk membantu memastikan langkah penting dilakukan secara sistematis' },
      { id: 'D', text: 'Untuk menentukan harga bahan bakar' },
    ],
    correctAnswer: 'C',
  },

  // BAGIAN 6 — PENGETAHUAN LANJUTAN
  {
    id: 26,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa fungsi utama FMS (Flight Management System)?',
    options: [
      { id: 'A', text: 'Membantu mengelola rute, navigasi, dan perhitungan performa tertentu sesuai kemampuan sistem pesawat' },
      { id: 'B', text: 'Mengendalikan pelayanan makanan' },
      { id: 'C', text: 'Mengatur jadwal awak kabin secara langsung' },
      { id: 'D', text: 'Menggantikan semua komunikasi dengan ATC' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 27,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa arti Mach 0,80?',
    options: [
      { id: 'A', text: 'Pesawat terbang pada 80 knot' },
      { id: 'B', text: 'Pesawat terbang pada 80% kapasitas mesin' },
      { id: 'C', text: 'Pesawat terbang dengan kecepatan 800 km/jam dalam semua kondisi' },
      { id: 'D', text: 'Kecepatan pesawat setara dengan 80% kecepatan suara setempat' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 28,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa tujuan utama sistem anti-ice pada pesawat?',
    options: [
      { id: 'A', text: 'Mempercepat proses boarding' },
      { id: 'B', text: 'Mencegah terbentuknya es pada bagian tertentu yang dilindungi sistem' },
      { id: 'C', text: 'Mengurangi jumlah penumpang' },
      { id: 'D', text: 'Mengatur tekanan ban saat parkir' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 29,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa yang dimaksud dengan ETOPS dalam konteks operasional pesawat bermesin ganda?',
    options: [
      { id: 'A', text: 'Sistem hiburan penumpang jarak jauh' },
      { id: 'B', text: 'Prosedur untuk mempercepat proses boarding' },
      { id: 'C', text: 'Standar operasional yang berkaitan dengan penerbangan jarak tertentu dari bandara pengalihan yang sesuai, berdasarkan persetujuan dan persyaratan yang berlaku' },
      { id: 'D', text: 'Sistem untuk mengatur pencahayaan kabin' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 30,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Mengapa pilot perlu memeriksa NOTAM sebelum penerbangan?',
    options: [
      { id: 'A', text: 'Untuk mengetahui informasi penting tentang fasilitas, prosedur, atau kondisi operasional yang dapat memengaruhi penerbangan' },
      { id: 'B', text: 'Untuk mengetahui daftar makanan penumpang' },
      { id: 'C', text: 'Untuk mengetahui harga tiket semua maskapai' },
      { id: 'D', text: 'Untuk menentukan warna seragam awak kabin' },
    ],
    correctAnswer: 'A',
  },
];

export const calculateScore = (answers: Record<number, 'A' | 'B' | 'C' | 'D'>): { score: number; correctCount: number } => {
  let correctCount = 0;
  AVIATION_QUESTIONS.forEach((q) => {
    if (answers[q.id] === q.correctAnswer) {
      correctCount += 1;
    }
  });
  // Max score 100, 30 questions
  const score = correctCount === 30 ? 100 : Number(((correctCount / 30) * 100).toFixed(2));
  return { score, correctCount };
};
