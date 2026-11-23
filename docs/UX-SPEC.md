# USER EXPERIENCE SPECIFICATION (UX-SPEC)

**Project:** SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan  
**Version:** 1.1  
**Status:** Draft untuk implementasi awal  
**References:** PRD SIMKOPDES v1.1; FEATURE-LIST-DATA-MODEL.md; hasil WS5–WS8

## 1. UX Overview

### 1.1 UX Objective

Membantu calon anggota, anggota, dan pengurus mengakses SIMKOPDES, memahami alur login/pendaftaran, menemukan fitur utama, serta memperoleh panduan yang jelas. Pengalaman harus sederhana dan konsisten untuk pengguna dengan pengalaman digital beragam.

Pengguna diharapkan dapat:

- Memahami status ketika aplikasi sedang memuat atau gagal diakses.
- Mengetahui tindakan yang dapat dilakukan ketika terjadi kegagalan akses.
- Login melalui metode yang benar-benar didukung sistem.
- Menyelesaikan pendaftaran dengan langkah yang jelas tanpa penambahan yang tidak perlu.
- Mengakses fitur utama anggota yang disediakan pada implementasi awal.
- Menemukan panduan penggunaan dengan mudah.
- Pengurus dapat memahami area pengelolaan anggota sesuai kewenangan yang disepakati.

### 1.2 Evidence Boundary

Dasar riset WS5 adalah lima ulasan publik App Store. U1–U5 berasal dari pengulas berbeda. Persona WS6 adalah persona sintetis, journey WS7 merupakan sintesis, dan requirement WS8 adalah usulan UX. Data tersebut bukan hasil wawancara atau usability test langsung. Fitur dashboard, simpanan, profil, dan area pengurus pada FR-04 adalah **working assumptions** dari Feature List & Data Model untuk membuat implementasi awal konkret; bukan rincian fitur yang dibuktikan oleh lima ulasan.

### 1.3 UX Design Principles

- **Clarity:** label, status, dan langkah berikutnya mudah dipahami.
- **Simplicity:** pertahankan kemudahan pendaftaran yang telah diapresiasi.
- **Consistency:** navigasi, istilah, dan komponen mengikuti pola yang sama.
- **Feedback:** tindakan penting memberikan respons sesuai hasil backend.
- **Error recovery:** error yang dapat ditangani disertai arahan yang realistis.
- **Security & privacy:** jangan membocorkan keberadaan akun atau data sensitif.
- **Accessibility:** warna bukan satu-satunya penanda; sediakan label, fokus, dan kontras yang memadai.
- **Scope discipline:** fitur FR-04 harus tetap minimal sesuai working assumption, bukan berkembang menjadi sistem koperasi lengkap.

## 2. User Context

### 2.1 Primary Persona — Pengguna SIMKOPDES dengan Literasi Digital Beragam

**Tipe:** persona sintetis dari WS6, bukan individu hasil wawancara.  
**Peran:** anggota atau pengurus koperasi.  
**Umur/perangkat:** tidak diketahui.  
**Tujuan:** membuka aplikasi, masuk, dan menggunakan fitur utama.  
**Pain points dari ulasan:** aplikasi dilaporkan tidak dapat dibuka meskipun dicoba instal ulang; login dinilai merepotkan; sebagian pengurus masih belajar menggunakan teknologi.  
**Needs:** akses yang andal, login jelas, istilah familiar, dan panduan singkat.

### 2.2 Secondary Persona — Calon Anggota

**Evidence:** U3 menilai pendaftaran anggota mudah dan tidak merepotkan.  
**Goal:** memahami informasi yang perlu disiapkan dan mengirim pendaftaran tanpa kebingungan.  
**UX direction:** pertahankan form sesederhana mungkin, jelaskan field wajib, dan tampilkan status sesuai respons backend. Data NIK/alamat/no. HP tetap harus mengikuti keputusan pemilik produk.

### 2.3 Secondary Persona — Pengurus

**Evidence:** U5 menyebut sebagian pengurus masih belajar menggunakan teknologi.  
**Goal:** memahami penggunaan aplikasi dan, pada working assumption area pengurus, menemukan daftar anggota/permohonan.  
**Need:** menu jelas, langkah kerja berurutan, panduan yang dapat dibuka kembali.  
**Boundary:** jangan menganggap semua pengurus pemula atau memberikan akses luas tanpa role/policy yang sah.

## 3. User Goals and Expected Experience

| User goal | Expected experience |
|---|---|
| Membuka aplikasi | Loading dan error state dapat dipahami; tindakan pemulihan jelas bila tersedia. |
| Login | Field, instruksi, validasi, dan pesan kesalahan jelas serta aman. |
| Mendaftar | Proses ringkas; status pengajuan sesuai respons backend. |
| Mengetahui kondisi keanggotaan | Status anggota mudah ditemukan pada dashboard/profil (working assumption FR-04). |
| Melihat simpanan | Ringkasan dan riwayat simpanan dapat dibaca tanpa mencari menu yang membingungkan (working assumption FR-04). |
| Menggunakan panduan | Panduan sederhana, kontekstual, dan dapat dibuka kembali. |
| Mengelola anggota | Pengurus menemukan daftar/permohonan anggota sesuai kewenangan yang disetujui (working assumption). |

## 4. Main User Scenarios

### 4.1 Scenario A — Membuka Aplikasi

1. Pengguna membuka SIMKOPDES.
2. Aplikasi menginisialisasi konfigurasi, koneksi, dan sesi.
3. Jika siap, pengguna diarahkan ke halaman login atau area sesuai sesi.
4. Jika terjadi error yang dapat ditangani, aplikasi menampilkan pesan nonteknis dan tindakan yang relevan.
5. Kegagalan sebelum UI dapat berjalan mungkin memerlukan diagnosis teknis; UI tidak boleh menjanjikan semua crash dapat dipulihkan.

### 4.2 Scenario B — Login

1. Pengguna membuka halaman login.
2. Sistem menampilkan field identitas dan password sesuai metode autentikasi yang disepakati.
3. Pengguna mengisi kredensial dan mengirim form.
4. Sistem memvalidasi input lalu meneruskan autentikasi ke Supabase/adapter server yang aman.
5. Jika gagal, pesan yang aman ditampilkan tanpa membocorkan apakah akun tertentu terdaftar.
6. Jika berhasil, pengguna diarahkan sesuai role dan status keanggotaannya.

**Catatan teknis:** label Username/Nomor Anggota pada rancangan login harus didukung pemetaan server-side yang aman. Supabase Auth tidak menyediakan login nomor anggota arbitrary secara native. Jangan menggantinya diam-diam dengan email atau melakukan lookup kredensial dari browser.

### 4.3 Scenario C — Pendaftaran Anggota

1. Calon anggota membuka halaman pendaftaran.
2. Sistem menjelaskan data yang diperlukan.
3. Pengguna mengisi field yang telah disetujui.
4. Sistem memvalidasi isian dan mengirim pendaftaran ke backend.
5. UI menampilkan status berdasarkan respons backend.
6. Status akhir (langsung aktif atau menunggu approval) mengikuti DEC-02 dan belum boleh diasumsikan.

### 4.4 Scenario D — Anggota Melihat Informasi Utama (Working Assumption FR-04)

1. Anggota yang telah memenuhi status akses membuka dashboard anggota.
2. Sistem menampilkan ringkasan status keanggotaan dan saldo simpanan dari data tersimpan.
3. Anggota membuka riwayat simpanan untuk melihat jenis, nominal, tanggal, dan keterangan.
4. Anggota membuka profil untuk melihat data dasar yang diizinkan.
5. Jika tidak ada transaksi, sistem menampilkan empty state, bukan saldo/transaksi palsu.

### 4.5 Scenario E — Pengurus Mengelola Anggota (Working Assumption)

1. Pengurus yang telah diberi role secara sah membuka dashboard pengurus.
2. Sistem menampilkan ringkasan jumlah anggota dan aktivitas terbaru yang tersedia.
3. Pengurus membuka daftar anggota/permohonan.
4. Aksi approve/reject hanya tersedia apabila kebijakan approval dan kewenangan telah disetujui.
5. Setiap perubahan status disimpan ke backend dan ditampilkan sesuai responsnya.

### 4.6 Scenario F — Mencari Panduan

1. Pengguna membuka menu Bantuan atau ikon bantuan kontekstual.
2. Sistem menampilkan panduan yang sesuai dengan halaman/fitur aktual.
3. Pengguna membaca langkah singkat.
4. Pengguna kembali ke halaman sebelumnya tanpa kehilangan konteks.

## 5. Information Architecture (IA)

### 5.1 Sitemap Konseptual

```text
SIMKOPDES
├── Area Publik
│   ├── Status Akses / Loading / Error
│   ├── Login
│   │   └── Lupa Password (jika email recovery aktif)
│   └── Pendaftaran Anggota
│
├── Area Anggota
│   ├── Dashboard Anggota (WA: ringkasan simpanan & status)
│   ├── Riwayat Simpanan (WA)
│   ├── Profil Anggota (WA)
│   └── Bantuan / Panduan
│
└── Area Pengurus (WA; akses berdasarkan role)
    ├── Dashboard Pengurus
    ├── Kelola Anggota
    │   └── Persetujuan Pendaftaran (blocked sampai kebijakan disetujui)
    └── Panduan Pengurus
```

`WA` berarti working assumption. Menu Pinjaman tidak masuk navigasi aktif pada rilis awal kecuali diputuskan; apabila ditampilkan sebagai placeholder, jelaskan bahwa fungsi belum tersedia dan jangan mengarang data.

### 5.2 Primary Navigation

- Area publik: Login dan Pendaftaran.
- Area anggota: Beranda, Riwayat Simpanan, Profil, Bantuan.
- Area pengurus: Dashboard Pengurus, Kelola Anggota, Bantuan.
- Item navigasi hanya ditampilkan untuk role yang berhak.
- Admin/Super Admin tidak menjadi role aktif sebelum disetujui.

## 6. Page Specification

### PAGE-01 — Startup & Access State

**Purpose:** menunjukkan aplikasi sedang memuat, siap, atau mengalami kegagalan yang dapat ditangani.  
**Components:** identitas aplikasi jika aset resmi tersedia, loading indicator, pesan error, retry, kanal bantuan resmi jika telah dikonfirmasi.  
**Actions:** menunggu, mencoba kembali, membuka bantuan.  
**Expected outcome:** pengguna memahami status akses tanpa klaim teknis palsu.

### PAGE-02 — Login

**Purpose:** masuk secara ringkas dan aman.  
**Components:** field identitas (Username/Nomor Anggota sesuai metode yang diputuskan), password, show/hide password, validasi, pesan error, tombol Masuk, Lupa Password jika konfigurasi mendukung.  
**Actions:** mengisi, menampilkan/menyembunyikan password, submit, memulai pemulihan.  
**Expected outcome:** pengguna memahami informasi yang diperlukan dan hasil autentikasi.

### PAGE-03 — Pendaftaran Anggota

**Purpose:** mempertahankan pendaftaran yang sederhana.  
**Components:** Nama, NIK, Alamat, No. HP, Email, Password sesuai working assumption dan persetujuan field; label wajib; petunjuk format; feedback validasi; status pengiriman.  
**Actions:** mengisi, meninjau, mengirim, memperbaiki error.  
**Expected outcome:** pengajuan tercatat sesuai backend.  
**Constraint:** aturan approval/aktivasi belum diputuskan; field pribadi perlu persetujuan sebelum produksi.

### PAGE-04 — Dashboard Anggota (Working Assumption FR-04)

**Purpose:** memberi gambaran informasi dasar keanggotaan.  
**Components:** status keanggotaan; ringkasan saldo simpanan dari data tersimpan; ringkasan jenis simpanan atau transaksi terbaru bila datanya tersedia; navigasi ke riwayat dan profil.  
**Actions:** membuka riwayat simpanan, profil, bantuan.  
**Expected outcome:** anggota dapat melihat ringkasan dasar tanpa harus membuka beberapa halaman.  
**Constraint:** jangan menampilkan saldo contoh sebagai saldo nyata; definisi saldo harus konsisten dengan sumber transaksi.

### PAGE-05 — Riwayat Simpanan (Working Assumption FR-04)

**Purpose:** menampilkan transaksi simpanan anggota.  
**Components:** jenis simpanan (pokok/wajib/sukarela), nominal, tanggal transaksi, keterangan, filter sederhana hanya bila dibutuhkan.  
**Actions:** melihat daftar dan detail transaksi bila memang tersedia.  
**Expected outcome:** anggota hanya melihat riwayat miliknya.  
**Constraint:** fitur input/koreksi transaksi oleh anggota tidak diasumsikan.

### PAGE-06 — Profil Anggota (Working Assumption FR-04)

**Purpose:** menampilkan informasi dasar akun/keanggotaan.  
**Components:** nama, nomor anggota, nomor HP, email/status jika tersedia, serta data yang diizinkan.  
**Actions:** melihat profil; edit hanya field yang ditetapkan.  
**Expected outcome:** anggota memahami data yang tersimpan.  
**Constraint:** NIK dan alamat tidak perlu ditampilkan penuh jika tidak dibutuhkan; data pribadi harus dilindungi.

### PAGE-07 — Dashboard Pengurus (Working Assumption)

**Purpose:** membantu pengurus memahami ringkasan anggota.  
**Components:** jumlah anggota berdasarkan status; aktivitas terbaru yang tersedia; tautan Kelola Anggota dan Panduan Pengurus.  
**Actions:** membuka daftar anggota/permohonan, panduan.  
**Expected outcome:** pengurus menemukan fungsi yang dibutuhkan dengan langkah sederhana.  
**Constraint:** jangan menambah ringkasan keuangan atau metrik bisnis yang belum ditentukan.

### PAGE-08 — Kelola Anggota (Working Assumption; approval conditional)

**Purpose:** menyediakan akses pengurus untuk melihat data/permohonan anggota.  
**Components:** daftar anggota, nomor anggota, nama, status; detail secukupnya; aksi status hanya bila kebijakan disetujui.  
**Actions:** mencari/membuka data anggota; approve/reject jika diaktifkan.  
**Expected outcome:** pengurus memahami status data dan tindak lanjut yang sah.  
**Constraint:** akses dan aksi harus dikontrol RLS/server; jangan mengaktifkan approval sebelum DEC-02 selesai.

### PAGE-09 — Panduan & FAQ (FR-05)

**Purpose:** membantu pengguna mempelajari aplikasi.  
**Components:** kategori Login, Pendaftaran, Dashboard Anggota, Simpanan, Profil, Pengelolaan Anggota, sesuai fitur yang aktif; judul dan instruksi singkat.  
**Actions:** memilih topik, membaca langkah, kembali.  
**Expected outcome:** pengguna dapat belajar mandiri dan membuka ulang panduan.

### PAGE-10 — Bantuan Kontekstual (FR-05)

**Purpose:** menjelaskan istilah/aksi pada area tertentu.  
**Components:** ikon/tautan dengan accessible label, penjelasan pendek, link ke FAQ terkait.  
**Actions:** membuka/menutup bantuan dan menuju panduan.  
**Expected outcome:** pengguna memahami konteks tanpa meninggalkan alur.

## 7. User Flow

### 7.1 Flow — Login

```text
Buka aplikasi → Loading → Login
                     └─ Error terdeteksi → Pesan + Retry/Bantuan
Login → Isi identitas dan password → Validasi
     → Tidak valid: tampilkan error dekat field
     → Valid: kirim ke Supabase/adapter server
          → Gagal: pesan aman, input non-sensitif dipertahankan
          → Berhasil: periksa role/status → halaman sesuai hak akses
```

### 7.2 Flow — Pendaftaran Anggota

```text
Area Publik → Pendaftaran → Isi field yang disetujui → Validasi
       → Tidak valid: koreksi field
       → Valid: kirim ke backend
            → Gagal: pertahankan input + pesan gagal
            → Berhasil: tampilkan status sesuai respons backend
```

### 7.3 Flow — Anggota Melihat Riwayat Simpanan

```text
Login → Verifikasi sesi dan status anggota → Dashboard Anggota
      → Riwayat Simpanan → Tampilkan transaksi milik anggota
      → Pilih transaksi (jika detail tersedia)
```

### 7.4 Flow — Pengurus Mengelola Pendaftaran

```text
Login pengurus → Dashboard Pengurus → Kelola Anggota
               → Buka detail permohonan
               → Approve/Reject hanya jika kebijakan diaktifkan
               → Backend menyimpan status → UI menampilkan hasil
```

### 7.5 Flow — Membuka Panduan

```text
Halaman aktif → Bantuan/ikon kontekstual → Topik terkait
              → Baca langkah → Kembali ke halaman sebelumnya
```

## 8. User Interaction Requirements

- Semua input memiliki label yang selalu terlihat; placeholder bukan pengganti label.
- Field wajib diberi penanda dan aturan format dijelaskan sebelum submit.
- Error validasi ditampilkan dekat field; error server dibedakan dari error input.
- Isian non-sensitif dipertahankan jika request gagal selama sesi masih aktif.
- Tombol submit menampilkan loading dan mencegah submit ganda.
- Tampilkan status anggota/pengajuan sesuai hasil backend.
- Menu dan halaman anggota/pengurus dibatasi berdasarkan role dan status.
- Data simpanan yang kosong menampilkan empty state; jangan menggunakan nilai dummy.
- Panduan memakai bahasa sederhana, langkah pendek, dan contoh sesuai fitur aktif.

## 9. Responsive Experience

| Device | Experience |
|---|---|
| Mobile (<640px) | Satu kolom; navigasi drawer/bottom navigation sesuai kebutuhan; tabel riwayat berubah menjadi kartu; form satu kolom; tombol mudah dijangkau. |
| Tablet (640–1023px) | Layout adaptif; sidebar dapat diciutkan; data tabel tetap terbaca atau berubah menjadi daftar. |
| Desktop (≥1024px) | Sidebar dan konten utama; tabel dapat digunakan untuk daftar anggota/riwayat. |
| Wide desktop (≥1440px) | Maksimalkan ruang secara wajar dan batasi lebar konten baca agar tidak terlalu melebar. |

## 10. Empty, Loading, and Error States

| Page/state | Message/action |
|---|---|
| Dashboard anggota tanpa simpanan | “Belum ada riwayat simpanan yang tersedia.” Jangan isi saldo palsu. |
| Riwayat simpanan kosong | “Belum ada transaksi simpanan untuk ditampilkan.” |
| Profil belum lengkap | Jelaskan data yang belum tersedia; jangan mengisi dengan data contoh. |
| Daftar anggota kosong | “Belum ada data anggota yang dapat ditampilkan.” |
| Belum ada pendaftaran menunggu | “Tidak ada pendaftaran yang menunggu tindak lanjut.” |
| Panduan belum tersedia | “Panduan untuk bagian ini belum tersedia.” Jangan membuat tautan mati. |
| Data gagal dimuat | “Informasi belum dapat dimuat. Periksa koneksi, lalu coba lagi.” |
| Login/pendaftaran gagal | Pesan yang jelas tanpa membocorkan data akun; pertahankan input aman. |

## 11. Accessibility and Content Guidelines

- Kontras teks/latar memadai; status tidak mengandalkan warna saja.
- Field memiliki label programatik dan error yang dapat dikenali pembaca layar.
- Tombol icon-only memiliki accessible name.
- Fokus keyboard terlihat dan urutan tab logis.
- Gunakan bahasa Indonesia sederhana; hindari jargon database/backend.
- Hindari istilah “anggota aktif” sebelum status tersebut diberikan backend.
- Jangan memperlihatkan NIK penuh atau data sensitif jika tidak diperlukan.

## 12. UX Deliverables

UX-SPEC menjadi acuan sitemap, wireframe, prototype, UI design, responsive design, dan interaction specification. Rincian FR-04 diberi label working assumption; perubahan harus tercatat dalam keputusan proyek.

## 13. UX Design Constraints

- Pertahankan kemudahan pendaftaran dan fitur utama yang telah diapresiasi.
- Jangan menambah modul bisnis koperasi di luar daftar FR-04 yang disepakati.
- Jangan membuat workflow pinjaman penuh dari placeholder.
- Jangan mengaktifkan approval pendaftaran sebelum kebijakannya ditetapkan.
- Jangan membuat role Admin/Super Admin atau memberi hak istimewa dari sisi client.
- Jangan mengklaim penyebab teknis kegagalan akses diketahui.
- Jangan mengklaim autentikasi berhasil sebelum Supabase/backend mengonfirmasi.
- Semua working assumption harus dapat diidentifikasi oleh agent dan pemilik produk.

**Akhir dokumen — UX-SPEC SIMKOPDES v1.1.**
