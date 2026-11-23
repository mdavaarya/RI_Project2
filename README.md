# SIMKOPDES — Sistem Informasi Koperasi Desa

Aplikasi web modern untuk **SIMKOPDES (Sistem Informasi Koperasi Desa)** yang dibangun berdasarkan spesifikasi **PRD v1.1**, berfokus pada penguatan pengalaman akses, kemudahan login, pendaftaran ringkas, transparansi simpanan anggota, panduan terpadu, dan pengelolaan keanggotaan oleh pengurus.

---

## 🚀 Tech Stack

* **Frontend:** React 18 + Vite (TypeScript)
* **Styling & Design System:** Tailwind CSS + Design Tokens sesuai `DESIGN-SYSTEM.md` (Warna Primer: `#176B52`)
* **UI Primitives:** Radix UI (`@radix-ui/react-*`), Lucide React Icons
* **Routing & State:** React Router v6, Context API + Custom Hooks
* **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security / RLS, PostgREST API)
* **Testing:** Vitest + React Testing Library + jsdom

---

## ✨ Fitur Utama

### 1. Akses & Penanganan Kendala (FR-01 / UXR-01)
* **Loading State Jujur:** Indikator pemuatan sesi dan data tanpa memanipulasi tampilan.
* **Error Recovery & Error Boundary:** Pesan kesalahan non-teknis yang manusiawi jika koneksi terputus, dilengkapi tombol **Coba Lagi** (*safe retry*) tanpa mengekspos token atau stack trace.

### 2. Login Ringkas & Aman (FR-02 / UXR-02)
* Dukungan identitas akun / email dengan validasi *inline*.
* Opsi visibilitas kata sandi (*show/hide password*).
* Alur pemulihan kata sandi via email (*Password Recovery*).
* Proteksi terhadap *account enumeration* dan keamanan sesi otomatis.

### 3. Pendaftaran Anggota Baru (FR-03 / UXR-03)
* Menjaga kemudahan proses pendaftaran calon anggota koperasi.
* Isian formulir: Nama Lengkap, NIK (validasi 16 digit angka), Alamat Domisili, Nomor HP/WhatsApp, Email, dan Kata Sandi.
* Pencegahan pengiriman ganda (*duplicate submission prevention*).
* Status awal pendaftaran tercatat sebagai `Menunggu Verifikasi (Pending)` sesuai keputusan tata kelola koperasi.

### 4. Fitur Utama Anggota (FR-04 / UXR-04 — Working Assumption)
* **Beranda Anggota:** Menampilkan status keanggotaan dan ringkasan saldo simpanan (Pokok, Wajib, Sukarela) yang dihitung dari transaksi database riil (tanpa angka dummy).
* **Riwayat Simpanan:** Daftar transaksi lengkap dengan tanggal, jenis simpanan, nominal rupiah lokal, dan keterangan (*read-only* bagi anggota).
* **Profil Saya:** Menampilkan data akun terlindungi. NIK disamarkan (*masked*), nomor anggota dan status keanggotaan dilindungi dari pengubahan sepihak.

### 5. Area Pengurus Koperasi (Working Assumption US-05)
* **Rute Terproteksi:** Hanya pengguna dengan peran `pengurus` yang dapat membuka area ini.
* **Ringkasan Operasional:** Statistik jumlah anggota riil per status (`pending`, `aktif`, `nonaktif`).
* **Kelola Anggota:** Peninjauan permohonan anggota baru dan aksi verifikasi/aktivasi atau nonaktivasi anggota.

### 6. Panduan & Navigasi Terpadu (FR-05 / UXR-05)
* Pusat Bantuan interaktif dengan FAQ terperinci sesuai fitur yang tersedia di aplikasi.
* Bantuan Kontekstual (*tooltips / hint dialog*) pada setiap bagian penting tanpa mengganggu formulir.
* Penjelasan jujur mengenai modul pinjaman yang dinonaktifkan (*honest placeholder*) untuk menjaga kepatuhan ruang lingkup produk.

---

## 🔑 Kredensial Pengujian Demo (Mode Lokal / Offline)

Untuk memudahkan pengujian fungsional tanpa konfigurasi cloud, aplikasi dilengkapi akun demo otomatis di halaman login:

| Peran | Identitas Akun | Kata Sandi | Halaman Utama |
|---|---|---|---|
| **Admin / Pengurus** | `admin` *(atau `admin@simkopdes.id`)* | `password123` *(atau `admin123`)* | `/pengurus/dashboard` |
| **Anggota Koperasi** | `anggota` *(atau `anggota@simkopdes.id`)* | `password123` | `/dashboard` |

*Tersedia tombol pintas 1-klik di bawah formulir login untuk mengisi kredensial ini secara instan.*

---

## 🛠️ Instalasi & Menjalankan Aplikasi

### 1. Klon Repositori
```bash
git clone https://github.com/mdavaarya/RI_Project2.git
cd RI_Project2
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (Opsional untuk Supabase Cloud)
Salin berkas `.env.example` menjadi `.env`:
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```
*Jika tidak diisi, aplikasi otomatis berjalan dalam mode fallback offline dengan persistensi lokal dan akun demo lengkap.*

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

### 5. Kompilasi & Build Produksi
```bash
npm run build
```

---

## 🗄️ Database & Migrasi SQL

Skema database PostgreSQL dan aturan Row Level Security (RLS) tersedia di:
* `src/supabase/migrations/001_initial_schema.sql` — Tabel `profiles`, `members`, `savings`, `loans`, `help_contents`, `audit_logs`.
* `src/supabase/migrations/002_rls_policies.sql` — Isolasi akses anggota dan wewenang pengurus.
* `src/supabase/migrations/003_seed_help_contents.sql` — Data benih panduan & FAQ resmi.

---

## 📝 Catatan Keputusan & Batasan Lingkup

Seluruh keputusan bisnis dan batasan *working assumptions* didokumentasikan pada berkas [DECISIONS.md](DECISIONS.md):
* **DEC-01:** Strategi login mengutamakan email/identitas akun untuk mencegah enumerasi akun dari sisi peramban.
* **DEC-02:** Pendaftaran baru menghasilkan status awal `pending` untuk verifikasi pengurus.
* **DEC-04:** Riwayat simpanan bersifat *read-only* bagi anggota.
* **DEC-05:** Modul pinjaman penuh (bunga, cicilan, tenor, pencairan) berada di luar lingkup rilis v1.1 dan ditampilkan sebagai informasi (*placeholder* jujur).
* **DEC-07:** Peran `pengurus` ditetapkan langsung di tingkat basis data dan tidak dapat dipilih melalui formulir publik.

---

## 📜 CHANGELOG

Semua perubahan dan evolusi sistem dicatat secara berurutan di bawah ini:

### [v1.0.0] - 2026-11-23
* Inisialisasi proyek SIMKOPDES dari awal menggunakan React 18, Vite, TypeScript, dan Tailwind CSS.
* Implementasi Design System lengkap sesuai `DESIGN-SYSTEM.md` dengan warna primer `#176B52` dan token aksesibilitas.
* Implementasi integrasi Supabase (skema migrasi tabel, RLS policies, seed data panduan, dan service layer).
* Implementasi alur penanganan akses & pemulihan kegagalan (FR-01, LoadingState, ErrorState, ErrorBoundary).
* Implementasi login terproteksi, pengelolaan sesi, dan lupa kata sandi via email (FR-02).
* Implementasi formulir pendaftaran anggota dengan validasi NIK 16 digit dan pencegahan submit ganda (FR-03).
* Implementasi fitur utama anggota: Beranda Anggota, ringkasan saldo simpanan riil, riwayat simpanan, dan profil terlindungi (FR-04).
* Implementasi area pengurus koperasi: Ringkasan Pengurus, statistik operasional, dan pengelolaan/verifikasi status anggota (US-05).
* Implementasi Pusat Bantuan & FAQ interaktif serta bantuan kontekstual (FR-05).
* Implementasi batasan scope jujur untuk modul pinjaman (`LoanPlaceholderPage`).
* Validasi seluruh Acceptance Criteria (AC-001 hingga AC-042).

### [v1.0.1] - 2026-11-23
* Penyesuaian fleksibilitas identitas masuk akun admin/pengurus: mendukung alias `admin`, `admin@simkopdes.id`, `pengurus`, dan `pengurus@simkopdes.id`.
* Penambahan variasi kata sandi demo pengujian (`password123`, `admin123`, `admin`) agar penguji tidak terkunci saat pengujian lokal.
* Penambahan tombol pintas 1-klik pengisian kredensial demo pada formulir login untuk kemudahan verifikasi mandiri pengguna.
* Penambahan logika pengalihan otomatis (*auto-redirect*) setelah login: pengguna dengan peran pengurus langsung diarahkan ke `/pengurus/dashboard`.
* Perubahan tipe input identitas login menjadi teks agar peramban tidak memblokir input username tanpa format domain email.

---
*(Catatan: Setiap perubahan, perbaikan, atau penambahan fitur di masa mendatang akan dicatat pada bagian changelog ini).*
