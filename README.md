# SIMKOPDES — Sistem Informasi Koperasi Desa

Aplikasi web modern untuk **SIMKOPDES (Sistem Informasi Koperasi Desa)** yang dibangun berdasarkan spesifikasi **PRD v1.1** dan **PRD v2.0**, berfokus pada penguatan pengalaman akses, kemudahan login, pendaftaran ringkas, transparansi simpanan anggota, kendali manajemen akun mandiri (perpindahan domisili dan pengajuan penghapusan akun), serta integrasi layanan bantuan Helpdesk & Chat internal.

---

## 📁 Struktur Direktori & Dokumentasi

Untuk menjaga kerapian proyek, seluruh berkas spesifikasi dan dokumentasi arsitektur dipisahkan ke dalam direktori [`docs/`](docs/):

```text
SIMKOPDES/
├── docs/                        # Dokumentasi spesifikasi, analisis, dan keputusan
│   ├── PRD_SIMKOPDES_v1.1.md    # Product Requirements Document
│   ├── FEATURE-LIST-DATA-MODEL.md # Fitur & Model Data
│   ├── UX-SPEC.md               # Spesifikasi Pengalaman Pengguna
│   ├── INTERACTION-SPEC.md      # Spesifikasi Interaksi
│   ├── DESIGN-SYSTEM.md         # Design System & Token Warna (#176B52)
│   ├── ACCEPTANCE-CRITERIA.md   # Kriteria Pengujian (AC-001 s/d AC-042)
│   ├── AGENTS.md                # Panduan AI Coding Agent & Rules
│   └── DECISIONS.md             # Catatan Keputusan Bisnis & Arsitektur
├── src/                         # Kode Sumber Aplikasi
│   ├── app/                     # App Router, Layout, & Error Boundary
│   ├── components/              # Komponen UI (Buttons, Cards, Inputs, Badges, Modals)
│   ├── hooks/                   # Custom React Hooks (useAuth, dll.)
│   ├── pages/                   # Halaman Anggota & Halaman Pengurus
│   ├── services/                # Supabase Client, Auth, Member, Helpdesk Services
│   ├── styles/                  # Tailwind CSS & Design System Styles
│   ├── supabase/migrations/     # Skema Database PostgreSQL & RLS Policies
│   └── types/                   # TypeScript Interfaces & Data Definitions
├── package.json
├── tailwind.config.js
├── vercel.json                  # Konfigurasi SPA rewrite rules untuk Vercel
└── README.md
```

---

## 🚀 Tech Stack

* **Frontend:** React 18 + Vite (TypeScript)
* **Styling & Design System:** Tailwind CSS + Design Tokens sesuai `DESIGN-SYSTEM.md` (Warna Primer: `#176B52`)
* **UI Primitives:** Radix UI (`@radix-ui/react-*`), Lucide React Icons
* **Routing & State:** React Router v6, Context API + Custom Hooks
* **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security / RLS, PostgREST API)
* **Testing:** Vitest + React Testing Library + jsdom

---

## ✨ Fitur Lengkap Aplikasi

### 1. Akses & Penanganan Kendala (FR-01 / UXR-01)
* **Loading State Jujur:** Indikator pemuatan sesi dan data tanpa memanipulasi tampilan.
* **Error Recovery & Error Boundary:** Pesan kesalahan non-teknis yang manusiawi jika koneksi terputus, dilengkapi tombol **Coba Lagi** (*safe retry*) tanpa mengekspos token atau stack trace.

### 2. Login Ringkas & Fleksibel (FR-02 / UXR-02)
* Dukungan identitas akun / email dengan validasi *inline*.
* Opsi visibilitas kata sandi (*show/hide password*).
* Alur pemulihan kata sandi via email (*Password Recovery*).
* Tombol pintas 1-klik untuk pengisian kredensial demo bagi pengujian lokal.
* Pengalihan otomatis (*auto-redirect*) ke dashboard yang sesuai peran akun.

### 3. Pendaftaran Anggota Baru & Pilihan Domisili (FR-03 / UXR-03)
* Pendaftaran ringkas: Nama Lengkap, NIK (16 digit), Pilihan Domisili Unit Koperasi Desa, Alamat Domisili, Nomor HP, Email, dan Kata Sandi.
* Pencegahan pengiriman formulir ganda.
* Status awal tercatat sebagai `Menunggu Verifikasi (Pending)`.

### 4. Fitur Utama Anggota & Manajemen Akun Mandiri (FR-04)
* **Beranda Anggota:** Menampilkan status keanggotaan, unit domisili koperasi, ringkasan saldo simpanan riil (Pokok, Wajib, Sukarela), serta **Riwayat Pengaduan Terkini**.
* **Riwayat Simpanan:** Daftar transaksi lengkap dengan tanggal, jenis simpanan, nominal rupiah, dan keterangan (*read-only* bagi anggota).
* **Profil Saya & Pengaturan Akun:** 
  - Nama lengkap, nomor HP/WhatsApp, dan **Alamat Domisili Terdaftar** dapat diubah dan disimpan secara mandiri oleh anggota.
  - NIK disamarkan (*masked*), nomor anggota dan status keanggotaan terproteksi secara resmi.
  - **Pengajuan Pindah Domisili Koperasi Desa:** Anggota dapat mengajukan perpindahan unit koperasi ke desa lain beserta alasannya untuk diverifikasi oleh pengurus.
  - **Pengajuan Penghapusan Akun:** Opsi penutupan akun dengan penjelasan konsekuensi hak simpanan dan persetujuan pengurus.

### 5. Helpdesk Internal & Ruang Obrolan Interaktif (FR-05)
* **Ruang Chat Terpadu (`/bantuan/chat`):** Mengatasi alur terputus (tidak wajib beralih ke WhatsApp/SMS).
* Anggota dapat membuat tiket pengaduan (Kategori: Akun, Simpanan, Domisili, Layanan, dll.).
* Fitur respon konfirmasi instan otomatis (*bot acknowledge*) dan balasan percakapan langsung dari pengurus koperasi.
* Tombol kontak WhatsApp tetap tersedia sebagai alternatif komunikasi sekunder.

### 6. Area Pengurus Koperasi (US-05)
* **Ringkasan Pengurus (`/pengurus/dashboard`):** Statistik operasional jumlah anggota per status (`pending`, `aktif`, `nonaktif`).
* **Kelola Anggota (`/pengurus/anggota`):** Verifikasi dan aktivasi pendaftaran anggota baru.
* **Permohonan Layanan (`/pengurus/permohonan`):** Tinjauan dan persetujuan permohonan perpindahan domisili serta pengajuan penghapusan akun anggota.
* **Helpdesk & Chat (`/pengurus/helpdesk`):** Manajemen seluruh tiket kendala anggota dan fasilitas membalas percakapan chat serta menandai status penyelesaian tiket.

---

## 🔑 Kredensial Pengujian Demo (Mode Lokal / Offline)

Untuk memudahkan pengujian fungsional tanpa konfigurasi cloud, aplikasi dilengkapi akun demo otomatis di halaman login:

| Peran | Identitas Akun | Kata Sandi | Halaman Utama |
|---|---|---|---|
| **Admin / Pengurus** | `admin` *(atau `admin@simkopdes.id`)* | `password123` *(atau `admin123`)* | `/pengurus/dashboard` |
| **Anggota Koperasi** | `anggota` *(atau `anggota@simkopdes.id`)* | `password123` | `/dashboard` |

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

## 🗄️ Database & Migrasi SQL Supabase

Untuk memudahkan instalasi di database Supabase Cloud, telah disediakan skrip **All-in-One**:

* 👉 **`src/supabase/migrations/all_in_one_setup.sql` (Disarankan):**  
  Cukup salin seluruh isi berkas ini, buka **Supabase Dashboard > SQL Editor > New query**, tempel, dan klik **Run**. Seluruh tabel, relasi, trigger, RLS policies, data FAQ, serta modul perpindahan domisili, hapus akun, dan helpdesk chat akan otomatis dibuat dalam 1 kali eksekusi!

Atau jika ingin menjalankan berkas per tahap:
* `001_initial_schema.sql` — Tabel dasar (`profiles`, `members`, `savings`, `loans`, `help_contents`).
* `002_rls_policies.sql` — Kebijakan keamanan Row Level Security (RLS) dasar.
* `003_seed_help_contents.sql` — Data panduan & FAQ resmi.
* `004_v1_1_features.sql` — Tabel & RLS permohonan domisili, hapus akun, dan helpdesk chat.

---

## 🌐 Panduan Deploy ke Vercel

Proyek ini telah dikonfigurasi penuh dan **100% siap di-deploy ke Vercel**:

1. **Impor Repositori ke Vercel:**
   * Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   * Klik **"Add New..."** > **"Project"**.
   * Pilih repositori **`mdavaarya/RI_Project2`** lalu klik **"Import"**.

2. **Konfigurasi Project Settings di Vercel:**
   * **Framework Preset:** `Vite` (terdeteksi otomatis).
   * **Root Directory:** `./` (default).
   * **Build Command:** `npm run build` (atau `vite build`).
   * **Output Directory:** `dist` (default).

3. **Environment Variables (Opsional):**
   * Jika menggunakan instance Supabase Cloud Anda sendiri, tambahkan variabel di menu **Environment Variables**:
     - `VITE_SUPABASE_URL`: URL project Supabase Anda
     - `VITE_SUPABASE_ANON_KEY`: Anon/public key Supabase Anda
   * *Catatan:* Jika tidak menambahkan environment variables, aplikasi tetap dapat dijalankan secara instan di Vercel dalam mode demo bawaan dengan kredensial pengujian yang berfungsi penuh!

4. **Konfigurasi Perutean SPA (`vercel.json`):**
   * Berkas `vercel.json` sudah disediakan dengan aturan rewrite `/(.*) -> /index.html` sehingga navigasi halaman React Router (`/login`, `/dashboard`, `/pengurus/dashboard`, dll.) tidak akan mengalami error 404 saat direfresh.

5. **Klik "Deploy"** dan aplikasi Anda akan aktif dalam hitungan detik!

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

### [v1.1.0] - 2026-11-23
* Perapian struktur direktori proyek: seluruh dokumen spesifikasi dan analisis (`PRD_SIMKOPDES_v1.1.md`, `UX-SPEC.md`, `INTERACTION-SPEC.md`, `DESIGN-SYSTEM.md`, `FEATURE-LIST-DATA-MODEL.md`, `ACCEPTANCE-CRITERIA.md`, `AGENTS.md`, `DECISIONS.md`) dipindahkan ke direktori khusus [`docs/`](docs/) agar repositori lebih tertata rapi.
* Implementasi fitur pemilihan domisili unit koperasi desa pada formulir pendaftaran anggota (`RegisterPage`).
* Implementasi fitur pengajuan perpindahan domisili koperasi desa pada halaman profil anggota (`ProfilePage`) beserta riwayat status pengajuan.
* Implementasi fitur pengajuan penghapusan akun keanggotaan pada halaman profil (`ProfilePage`) dengan dialog penjelasan konsekuensi hak simpanan dan konfirmasi persetujuan pengurus.
* Implementasi modul layanan Helpdesk & Chat internal (`/bantuan/chat`) dengan fitur percakapan langsung dengan pengurus, konfirmasi bot otomatis, dan pemantauan tiket tanpa perlu keluar ke aplikasi eksternal.
* Penambahan tautan kontak WhatsApp sebagai opsi komunikasi sekunder pelengkap chat internal.
* Penambahan kartu ringkasan riwayat pengaduan dan tautan cepat chat bantuan pada Beranda Anggota (`MemberDashboardPage`).
* Implementasi halaman peninjauan permohonan anggota untuk pengurus (`/pengurus/permohonan`) untuk menyetujui/menolak perpindahan domisili dan penutupan akun.
* Implementasi halaman manajemen Helpdesk & Chat Pengurus (`/pengurus/helpdesk`) untuk membaca dan membalas keluhan anggota secara langsung serta memperbarui status tiket.
* Pembaruan menu bilah samping (*Sidebar*) dan rute aplikasi (*App Routes*) untuk mendukung navigasi modul baru.

### [v1.1.1] - 2026-11-24
* Penambahan berkas konfigurasi `vercel.json` dengan aturan rewrite URL untuk Single Page Application (SPA), memastikan tidak ada kendala *page not found* (404) ketika pengguna merefresh rute atau membuka tautan langsung di Vercel.
* Penambahan panduan langkah-demi-langkah penerapan (*deployment*) ke platform Vercel pada `README.md`.
* Verifikasi kesiapan build produksi untuk hosting cloud.

### [v1.1.2] - 2026-11-24
* Penambahan skrip migrasi database komprehensif `src/supabase/migrations/all_in_one_setup.sql` agar pengguna dapat melakukan inisialisasi basis data Supabase (tabel, relasi, RLS, trigger, seed data) hanya dengan satu kali klik di Supabase SQL Editor.
* Penambahan berkas migrasi `004_v1_1_features.sql` untuk modul perpindahan domisili, pengajuan hapus akun, dan helpdesk chat.

### [v1.1.3] - 2026-11-24
* Pembaruan formulir profil keanggotaan (`ProfilePage.tsx`): field **Alamat Domisili Terdaftar** kini dapat diubah secara langsung oleh anggota melalui mode Ubah Profil.
* Pembaruan `memberService.ts`: penambahan kapabilitas pembaruan field `alamat` pada tabel `members` yang terintegrasi secara sinkron pada Supabase Cloud maupun penyimpanan fallback lokal.
* Pembaruan kebijakan Row Level Security (RLS) PostgreSQL pada berkas `002_rls_policies.sql` dan `all_in_one_setup.sql` agar anggota memiliki hak izin memperbarui alamat tempat tinggal mereka secara aman.
* Optimalisasi autentikasi pada `authService.ts`: penambahan fallback instan untuk kredensial pengujian (`admin` & `anggota`) sehingga akun demo dapat langsung login tanpa terhambat respons 401 saat remote Supabase terhubung.

---
*(Catatan: Setiap perubahan, perbaikan, atau penambahan fitur di masa mendatang akan dicatat pada bagian changelog ini).*
