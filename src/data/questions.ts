import { Question } from '../types';

export const AVIATION_QUESTIONS: Question[] = [
  // BAGIAN 1 — DASAR PENERBANGAN
  {
    id: 1,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama sayap pada pesawat terbang?',
    options: [
      { id: 'A', text: 'Menstabilkan putaran mesin turbofan di ketinggian jelajah' },
      { id: 'B', text: 'Menghasilkan gaya angkat untuk mempertahankan penerbangan' },
      { id: 'C', text: 'Mengatur keseimbangan tekanan udara dan suhu di dalam kabin' },
      { id: 'D', text: 'Menghubungkan sistem navigasi dengan instrumen komunikasi radio' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 2,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa kepanjangan dari ATC dalam dunia penerbangan?',
    options: [
      { id: 'A', text: 'Aviation Terminal Communication' },
      { id: 'B', text: 'Air Transport Command' },
      { id: 'C', text: 'Air Traffic Control' },
      { id: 'D', text: 'Aircraft Travel Control' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 3,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama elevator pada pesawat?',
    options: [
      { id: 'A', text: 'Mengendalikan gerakan rotasi pitch (anggukan naik-turun hidung pesawat)' },
      { id: 'B', text: 'Mengendalikan gerakan rotasi roll (kemiringan sayap ke kiri dan kanan)' },
      { id: 'C', text: 'Mengatur kestabilan putaran mesin dan kecepatan dorong baling-baling' },
      { id: 'D', text: 'Mengendalikan gerakan rotasi yaw (belokan arah ekor dan hidung pesawat)' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 4,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Pesawat yang menggunakan mesin turbofan umumnya termasuk kategori apa?',
    options: [
      { id: 'A', text: 'Kategori pesawat layang tanpa tenaga penggerak mandiri' },
      { id: 'B', text: 'Kategori wahana udara berbasis aerostatik ringan' },
      { id: 'C', text: 'Kategori pesawat terbang bermesin jet modern' },
      { id: 'D', text: 'Kategori pesawat khusus olahraga luncur bebas' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 5,
    section: 'BAGIAN 1',
    sectionTitle: 'Dasar Penerbangan',
    question: 'Apa fungsi utama landing gear pada pesawat?',
    options: [
      { id: 'A', text: 'Menyalurkan tenaga dorong tambahan saat pesawat mulai melaju di landasan' },
      { id: 'B', text: 'Mengontrol sirkulasi udara luar untuk menjaga kestabilan tekanan kabin' },
      { id: 'C', text: 'Mengarahkan aliran angin samping agar tidak mengganggu kestabilan aerodinamika' },
      { id: 'D', text: 'Menopang struktur berat pesawat saat di darat dan meredam benturan saat pendaratan' },
    ],
    correctAnswer: 'D',
  },

  // BAGIAN 2 — AERODINAMIKA DAN INSTRUMEN
  {
    id: 6,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Empat gaya utama yang bekerja pada pesawat dalam penerbangan adalah …',
    options: [
      { id: 'A', text: 'Lift (gaya angkat), atmospheric pressure, airspeed, dan ambient temperature' },
      { id: 'B', text: 'Lift (gaya angkat), drag (hambatan), thrust (dorongan), dan weight (berat)' },
      { id: 'C', text: 'Pitch angle, roll angle, yaw rotation, dan total engine thrust' },
      { id: 'D', text: 'Aerodynamic drag, flight altitude, compass heading, dan aircraft weight' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 7,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa yang dimaksud dengan stall pada pesawat?',
    options: [
      { id: 'A', text: 'Kondisi ketika permukaan sayap kehilangan sebagian besar gaya angkat akibat sudut serang melampaui batas kritis' },
      { id: 'B', text: 'Kondisi operasional normal saat pesawat berhasil mencapai ketinggian jelajah maksimum' },
      { id: 'C', text: 'Situasi darurat ketika seluruh sistem suplai bahan bakar dan mesin utama berhenti bekerja' },
      { id: 'D', text: 'Kegagalan total pada sistem hidraulik yang mengontrol permukaan kemudi sekunder' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 8,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Instrumen manakah yang menunjukkan ketinggian pesawat berdasarkan tekanan udara?',
    options: [
      { id: 'A', text: 'Turn coordinator untuk memantau kualitas belokan' },
      { id: 'B', text: 'Altimeter untuk mengukur elevasi vertikal dari permukaan' },
      { id: 'C', text: 'Airspeed indicator untuk memantau kecepatan laju udara' },
      { id: 'D', text: 'Heading indicator untuk menunjukkan arah mata angin' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa fungsi utama artificial horizon atau attitude indicator?',
    options: [
      { id: 'A', text: 'Menampilkan estimasi jarak tempuh sisa menuju bandara tujuan' },
      { id: 'B', text: 'Mengukur tingkat temperatur dan tekanan oli pada blok mesin utama' },
      { id: 'C', text: 'Menunjukkan orientasi sudut sikap pitch dan roll pesawat terhadap garis horizon' },
      { id: 'D', text: 'Menghitung total volume bahan bakar yang tersisa di dalam tangki' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 10,
    section: 'BAGIAN 2',
    sectionTitle: 'Aerodinamika dan Instrumen',
    question: 'Apa yang ditunjukkan oleh VSI (Vertical Speed Indicator)?',
    options: [
      { id: 'A', text: 'Besarnya laju kecepatan perubahan ketinggian vertikal pesawat per menit' },
      { id: 'B', text: 'Kecepatan laju pesawat secara horizontal terhadap massa udara sekitar' },
      { id: 'C', text: 'Jumlah total putaran poros mesin per menit selama proses penerbangan' },
      { id: 'D', text: 'Arah haluan sudut hidung pesawat terhadap titik referensi magnetik' },
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
      { id: 'A', text: 'Takeoff menuju fase landing, dilanjutkan cruise dan kembali ke taxi area' },
      { id: 'B', text: 'Cruise berlanjut ke taxi, kemudian takeoff dan diakhiri proses landing' },
      { id: 'C', text: 'Taxi, takeoff, climb, cruise, descent, approach, hingga proses landing' },
      { id: 'D', text: 'Landing diawali climb, kemudian masuk ke area taxi dan fase cruise' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 12,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Apa arti istilah rotate saat takeoff?',
    options: [
      { id: 'A', text: 'Instruksi bagi pilot untuk mulai membelokkan pesawat di jalur taxiway' },
      { id: 'B', text: 'Momen ketika pilot mulai menarik kendali untuk mengangkat hidung pesawat lepas landas' },
      { id: 'C', text: 'Prosedur darurat untuk mematikan putaran mesin sesaat sebelum terbang' },
      { id: 'D', text: 'Perintah untuk menurunkan posisi hidung pesawat demi menambah kecepatan' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 13,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Jika runway bernomor 27, arah magnetik runway tersebut kira-kira adalah …',
    options: [
      { id: 'A', text: 'Menghadap ke arah timur pada sudut orientasi 090 derajat' },
      { id: 'B', text: 'Menghadap ke arah selatan pada sudut orientasi 180 derajat' },
      { id: 'C', text: 'Menghadap ke arah utara pada sudut orientasi 360 derajat' },
      { id: 'D', text: 'Menghadap ke arah barat pada sudut orientasi 270 derajat' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 14,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Dalam sistem PAPI, apa arti tampilan dua lampu putih dan dua lampu merah bagi pilot yang sedang melakukan approach?',
    options: [
      { id: 'A', text: 'Posisi lintasan luncur pesawat terlalu tinggi dari jalur standar' },
      { id: 'B', text: 'Kondisi fasilitas operasional runway sedang ditutup sementara' },
      { id: 'C', text: 'Posisi pesawat sudah berada pada sudut pendekatan pendaratan yang sesuai' },
      { id: 'D', text: 'Posisi lintasan luncur pesawat terlalu rendah dari jalur aman' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 15,
    section: 'BAGIAN 3',
    sectionTitle: 'Fase Penerbangan dan Bandara',
    question: 'Apa fungsi utama sistem ILS (Instrument Landing System)?',
    options: [
      { id: 'A', text: 'Memberikan panduan sinyal lateral dan vertikal yang akurat saat pendaratan instrumen' },
      { id: 'B', text: 'Mengatur otomatisasi tekanan pneumatik pada ban roda pendaratan utama' },
      { id: 'C', text: 'Mengontrol sistem katup distribusi bahan bakar antar tangki sayap' },
      { id: 'D', text: 'Mengunci mekanisme buka-tutup pintu kompartemen kargo bawah' },
    ],
    correctAnswer: 'A',
  },

  // BAGIAN 4 — NAVIGASI, ATC, DAN CUACA
  {
    id: 16,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa arti clearance dalam komunikasi penerbangan?',
    options: [
      { id: 'A', text: 'Pemberian otorisasi resmi dari petugas ATC untuk menjalankan prosedur penerbangan tertentu' },
      { id: 'B', text: 'Laporan rutin dari kapten pilot mengenai adanya kerusakan komponen pesawat' },
      { id: 'C', text: 'Perintah darurat untuk segera mematikan perangkat transponder di kokpit' },
      { id: 'D', text: 'Informasi ringkas mengenai jumlah manifest muatan dan total penumpang' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 17,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa fungsi utama transponder pesawat?',
    options: [
      { id: 'A', text: 'Mengatur sudut buka-tutup bidang sayap flap dan slat' },
      { id: 'B', text: 'Memancarkan respons sinyal elektronik agar posisi pesawat terlacak radar pemantau' },
      { id: 'C', text: 'Menghasilkan suplai daya listrik cadangan utama bagi instrumen darurat' },
      { id: 'D', text: 'Menjaga keseimbangan tekanan udara kabin terhadap ketinggian jelajah' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 18,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa perbedaan utama antara METAR dan TAF?',
    options: [
      { id: 'A', text: 'METAR khusus mencatat penerbangan militer, sedangkan TAF untuk penerbangan sipil' },
      { id: 'B', text: 'METAR berfungsi mengukur kecepatan angin, sedangkan TAF mengukur elevasi' },
      { id: 'C', text: 'METAR melaporkan kondisi cuaca aktual hasil observasi, sedangkan TAF berisi prakiraan cuaca' },
      { id: 'D', text: 'METAR merinci dokumen rute navigasi, sedangkan TAF memuat data manifes' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 19,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa risiko utama wind shear saat takeoff atau landing?',
    options: [
      { id: 'A', text: 'Terjadinya perubahan frekuensi gelombang radio kanal ATC secara otomatis' },
      { id: 'B', text: 'Perubahan arah dan kecepatan angin secara mendadak yang mengganggu kestabilan lintasan' },
      { id: 'C', text: 'Terjadinya penambahan berat total muatan pesawat secara drastis' },
      { id: 'D', text: 'Perubahan warna indikator lampu panduan pendaratan di sepanjang runway' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 20,
    section: 'BAGIAN 4',
    sectionTitle: 'Navigasi, ATC, dan Cuaca',
    question: 'Apa arti FL350 dalam penerbangan?',
    options: [
      { id: 'A', text: 'Menunjukkan estimasi jarak tempuh perjalanan sepanjang 350 mil laut' },
      { id: 'B', text: 'Menunjukkan kecepatan laju jelajah pesawat sebesar 350 knot' },
      { id: 'C', text: 'Menunjukkan ketinggian mutlak 3.500 kaki di atas permukaan tanah' },
      { id: 'D', text: 'Menunjukkan tingkat ketinggian Flight Level 350 atau sekitar 35.000 kaki tekanan standar' },
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
      { id: 'A', text: 'Mempertahankan tingkat tekanan udara kabin agar tetap nyaman bagi awak dan penumpang' },
      { id: 'B', text: 'Meningkatkan suplai pembakaran bahan bakar guna menambah daya dorong mesin' },
      { id: 'C', text: 'Mendinginkan suhu permukaan velg dan ban sesaat setelah pesawat mendarat' },
      { id: 'D', text: 'Mengatur sudut kemudi pembelokan roda depan ketika pesawat bergerak di darat' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 22,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa yang dimaksud dengan FOD dalam lingkungan penerbangan?',
    options: [
      { id: 'A', text: 'Fuel Output Device, yaitu katup pengatur aliran bahan bakar ke ruang bakar' },
      { id: 'B', text: 'Final Operations Departure, yaitu dokumen izin terbang terakhir dari petugas' },
      { id: 'C', text: 'Foreign Object Debris, yaitu material benda asing yang berpotensi membahayakan pesawat' },
      { id: 'D', text: 'Flight Operations Document, yaitu panduan manual operasional kru pesawat' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 23,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa fungsi utama autopilot?',
    options: [
      { id: 'A', text: 'Membantu meringankan tugas pilot dalam mengendalikan pesawat sesuai parameter terpilih' },
      { id: 'B', text: 'Mengambil alih seluruh tanggung jawab operasional navigasi penerbangan secara mutlak' },
      { id: 'C', text: 'Melakukan pengisian bahan bakar secara otomatis melalui sistem pipa darat' },
      { id: 'D', text: 'Memberikan proteksi penuh agar pesawat mustahil mengalami situasi aerodinamika stall' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 24,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Apa yang dimaksud dengan CRM (Crew Resource Management)?',
    options: [
      { id: 'A', text: 'Sistem komputasi digital untuk menghitung alokasi harga tiket penumpang' },
      { id: 'B', text: 'Optimalisasi pemanfaatan seluruh sumber daya dan komunikasi tim untuk keselamatan penerbangan' },
      { id: 'C', text: 'Prosedur standar teknis dalam melakukan penggantian komponen blok mesin pesawat' },
      { id: 'D', text: 'Metode aerodinamika untuk mempercepat akselerasi pesawat saat fase takeoff' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 25,
    section: 'BAGIAN 5',
    sectionTitle: 'Sistem Pesawat dan Keselamatan',
    question: 'Mengapa checklist digunakan oleh pilot?',
    options: [
      { id: 'A', text: 'Sebagai panduan kalkulasi otomatis untuk menentukan harga bahan bakar pesawat' },
      { id: 'B', text: 'Untuk menggantikan keharusan pilot memahami prinsip kerja sistem instrumen pesawat' },
      { id: 'C', text: 'Untuk memastikan setiap prosedur krusial dan keselamatan dilakukan secara sistematis' },
      { id: 'D', text: 'Untuk menjadi protokol pengganti apabila seluruh prosedur darurat mengalami kegagalan' },
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
      { id: 'A', text: 'Mengelola navigasi rute penerbangan, perencanaan jalur, dan kalkulasi performa secara terpadu' },
      { id: 'B', text: 'Mengatur sistem pelayanan distribusi makanan dan fasilitas hiburan kabin' },
      { id: 'C', text: 'Mengambil alih seluruh komunikasi suara dua arah antara kokpit dengan pihak ATC' },
      { id: 'D', text: 'Menyusun jadwal tugas operasional harian bagi seluruh personel awak kabin' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 27,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa arti Mach 0,80?',
    options: [
      { id: 'A', text: 'Kecepatan terbang pesawat konstan di angka 80 knot terhadap permukaan tanah' },
      { id: 'B', text: 'Kondisi operasional mesin pesawat yang bekerja pada kapasitas maksimal 80 persen' },
      { id: 'C', text: 'Kecepatan laju pesawat dipatok tetap pada angka 800 kilometer per jam' },
      { id: 'D', text: 'Kecepatan laju pesawat setara dengan 80 persen dari kecepatan rambat suara setempat' },
    ],
    correctAnswer: 'D',
  },
  {
    id: 28,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa tujuan utama sistem anti-ice pada pesawat?',
    options: [
      { id: 'A', text: 'Mereduksi total durasi waktu tunggu selama proses persiapan penumpang naik' },
      { id: 'B', text: 'Mencegah akumulasi pembentukan lapisan es pada area struktur permukaan yang dilindungi' },
      { id: 'C', text: 'Menyesuaikan batasan kapasitas maksimal jumlah penumpang di kabin' },
      { id: 'D', text: 'Mengatur stabilitas tekanan pada ban pendaratan ketika parkir di landasan' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 29,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Apa yang dimaksud dengan ETOPS dalam konteks operasional pesawat bermesin ganda?',
    options: [
      { id: 'A', text: 'Standar regulasi operasional penerbangan jarak jauh dengan batasan waktu dari bandara alternatif' },
      { id: 'B', text: 'Sistem pengaturan pencahayaan otomatis khusus untuk kenyamanan interior kabin' },
      { id: 'C', text: 'Prosedur khusus untuk mempercepat proses evakuasi dan boarding penumpang' },
      { id: 'D', text: 'Perangkat hiburan digital nirkabel jarak jauh yang terpasang di kursi penumpang' },
    ],
    correctAnswer: 'C',
  },
  {
    id: 30,
    section: 'BAGIAN 6',
    sectionTitle: 'Pengetahuan Lanjutan',
    question: 'Mengapa pilot perlu memeriksa NOTAM sebelum penerbangan?',
    options: [
      { id: 'A', text: 'Untuk mendapatkan informasi krusial terbaru mengenai status fasilitas, prosedur, atau hambatan operasional' },
      { id: 'B', text: 'Untuk mengecek daftar ketersediaan menu makanan khusus bagi penumpang' },
      { id: 'C', text: 'Untuk membandingkan daftar tarif harga tiket penerbangan komersial antarmaskapai' },
      { id: 'D', text: 'Untuk menentukan jenis seragam resmi yang harus dikenakan oleh kru kokpit' },
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
