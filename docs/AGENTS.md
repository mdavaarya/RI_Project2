# AGENTS.md — AI Coding Agent Instructions

**Project:** SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan  
**Version:** 1.1  
**Purpose:** Instruksi lintas proyek untuk AI coding agent yang membangun aplikasi SIMKOPDES dari awal.

## 1. Project Context

Anda bertindak sebagai AI Software Engineer yang mengimplementasikan aplikasi web SIMKOPDES berdasarkan PRD v1.1 dan dokumen pendamping. Fokus utama adalah pengalaman akses, login, pendaftaran, fitur utama anggota versi minimal, panduan, dan area pengurus terbatas.

Aplikasi dibangun dari awal menggunakan stack kerja:

- React + Vite
- Tailwind CSS
- shadcn/ui
- Supabase Postgres + Auth + API

Jangan menganggap proyek ini sebagai sistem manajemen koperasi lengkap. Rincian dashboard anggota, riwayat simpanan, profil, dan area pengurus merupakan **working assumptions** pada Feature List & Data Model untuk mengisi detail FR-04/US-05. Jangan memperluasnya menjadi transaksi, pinjaman penuh, SHU, akuntansi, inventaris, atau pelaporan tanpa persetujuan.

## 2. Mandatory Documentation

Sebelum coding, baca seluruh dokumen berikut:

1. `PRD_SIMKOPDES.md` — kebutuhan, batas scope, FR, UXR, user story, prioritas, dan aturan bisnis.
2. `FEATURE-LIST-DATA-MODEL.md` — rincian fitur, working assumptions, data model, keputusan teknis.
3. `UX-SPEC.md` — persona, IA, sitemap, page specification, user flow, responsive UX.
4. `DESIGN-SYSTEM.md` — tokens, typography, colors, layout, components, accessibility.
5. `INTERACTION-SPEC.md` — state, validation, interaction, security, persistence.
6. `ACCEPTANCE-CRITERIA.md` — kriteria penerimaan dan metode verifikasi.

Jika PRD filename berbeda versinya, gunakan versi isi PRD yang dinyatakan pemilik proyek sebagai acuan. Dalam pekerjaan ini, acuan yang dinyatakan adalah **PRD v1.1**; jangan menyimpulkan versi dari nama file lama saja.

### 2.1 Hierarchy of Truth

Jika terjadi konflik:

1. PRD v1.1 dan bukti WS5–WS8 mengatur tujuan UX dan batas produk.
2. Keputusan eksplisit terbaru pemilik proyek mengatur stack/keputusan teknis yang belum bertentangan dengan PRD.
3. Feature List & Data Model memberi rincian kerja dan working assumptions.
4. UX-SPEC, Interaction-SPEC, Design-System, dan Acceptance Criteria merinci pengalaman, perilaku, visual, dan verifikasi.
5. Preferensi agent tidak boleh mengganti requirement.

Identifikasi konflik dan catat di `DECISIONS.md`; jangan memilih interpretasi secara diam-diam.

## 3. Requirement Traceability

Gunakan pemetaan FR v1.1 berikut dan jangan menggeser ID:

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Akses dan penanganan kegagalan akses | High |
| FR-02 | Login ringkas, jelas, aman | High |
| FR-03 | Pendaftaran anggota | Low — pertahankan kemudahan |
| FR-04 | Fitur utama anggota | Low — rincian implementasi merupakan working assumption |
| FR-05 | Panduan dan navigasi | Medium |

- Jangan menggunakan pemetaan FR dari dokumen versi/struktur lain.
- Tandai setiap fitur FR-04 sebagai working assumption.
- `pending/aktif/nonaktif`, role pengurus, approval, transaksi simpanan, dan pinjaman harus mengikuti keputusan yang dicatat.
- Jangan mengklaim working assumption sebagai temuan WS5–WS8.

## 4. Core Development Principles

### 4.1 Specification-Driven Development

- Implementasikan yang ditentukan dokumen.
- Jangan menambah modul/fungsi tanpa requirement atau persetujuan.
- Jangan menghilangkan kebutuhan yang sudah ditetapkan.
- Jangan menganggap asumsi sebagai hasil riset.

### 4.2 UX-First Implementation

- Utamakan kemudahan penggunaan.
- Minimalkan langkah pendaftaran.
- Beri feedback untuk setiap tindakan penting.
- Gunakan bahasa Indonesia yang sederhana.
- Jangan menampilkan pesan sukses sebelum backend mengonfirmasi.

### 4.3 Functional Completeness

- Setiap tombol memiliki fungsi nyata.
- Setiap form memiliki validasi.
- Data persisten disimpan ke backend.
- Loading, success, empty, dan error state ditangani.
- Jangan menggunakan mock data sebagai implementasi produksi.

### 4.4 Security and Privacy

- RLS wajib aktif pada tabel `public`.
- Anggota hanya dapat mengakses data miliknya.
- Role pengurus diberikan secara aman, bukan melalui pilihan form publik.
- Jangan pernah meletakkan Supabase service-role key/secret di frontend.
- Password ditangani Supabase Auth; jangan buat kolom password.
- Batasi akses NIK/alamat/no. HP dan hindari logging data sensitif.

## 5. Development Workflow

### Phase 1 — Analyze

1. Baca semua dokumen.
2. Petakan FR-01 sampai FR-05 ke halaman, komponen, dan data.
3. Pisahkan requirement terkonfirmasi dan working assumptions.
4. Identifikasi blocker: strategi login username/nomor anggota, approval pendaftaran, transaksi simpanan, pinjaman, admin, dan pemberian role pengurus.
5. Buat rencana implementasi dan daftar keputusan.

**Output:** ringkasan pemahaman, feature map, dependency map, daftar blocker, rencana implementasi. Jangan menutupi keputusan bisnis yang belum ada.

### Phase 2 — Project Setup

1. Periksa apakah repository sudah berisi struktur proyek.
2. Jika kosong, inisialisasi React + Vite.
3. Konfigurasi Tailwind dan shadcn/ui.
4. Buat Supabase client dengan environment variables.
5. Siapkan schema/migration dan RLS melalui SQL migrations.
6. Siapkan routing, layout, halaman, service, hooks, types, dan tests.

Jangan mengubah stack yang telah ditetapkan tanpa alasan dan persetujuan.

### Phase 3 — UX and Design Implementation

Urutan awal:

1. App shell, navigation, loading/error state.
2. Login dan pendaftaran.
3. Dashboard anggota.
4. Riwayat simpanan dan profil anggota.
5. Dashboard pengurus dan kelola anggota setelah role/policy diputuskan.
6. Panduan/FAQ.

Gunakan `UX-SPEC.md` dan `DESIGN-SYSTEM.md`. Dashboard anggota menampilkan saldo/status kerja FR-04; jangan menambah dashboard finansial atau modul bisnis lain.

### Phase 4 — Functional Implementation

- Supabase Auth dan session handling.
- Form registration, profile creation, dan membership record.
- Dashboard anggota dari data persisten.
- Read-only savings history untuk anggota, kecuali permission pencatatan transaksi telah disetujui.
- Pengelolaan anggota oleh pengurus sesuai RLS/policy.
- Panduan/FAQ.
- Semua perubahan harus memperbarui halaman terkait.

Jangan mengaktifkan approval otomatis/manual sebelum DEC approval ditetapkan.

### Phase 5 — Validation

- Jalankan aplikasi dan uji seluruh halaman.
- Uji login berhasil/gagal, pendaftaran valid/invalid, reset password bila aktif, role access, data persistence, dan RLS.
- Uji anggota A tidak dapat membaca data anggota B.
- Uji pengurus hanya dapat melakukan tindakan yang diizinkan.
- Uji mobile, tablet, desktop, dan empty/error state.
- Cocokkan hasil dengan `ACCEPTANCE-CRITERIA.md`.
- Jangan menandai Pass tanpa bukti.

## 6. Feature Implementation Rules

### 6.1 Access and Error Handling (FR-01)

- Tampilkan loading selama inisialisasi.
- Tangani error yang dapat dideteksi dengan pesan nonteknis.
- Retry hanya untuk operasi yang aman diulang.
- Jangan mengklaim semua startup crash dapat diatasi dari UI.
- Jangan membuat kanal bantuan palsu.

### 6.2 Authentication (FR-02)

- Integrasikan Supabase Auth.
- Validasi field dan tampilkan pesan aman.
- Strategi Username/Nomor Anggota harus dipastikan. Supabase Auth tidak menyediakan username arbitrary secara native; jangan query email mapping dari browser.
- Pemulihan password via `resetPasswordForEmail()` hanya bila email/recovery dikonfigurasi.
- Jangan menyimpan password atau token secara manual.

### 6.3 Registration (FR-03)

- Pertahankan form sederhana.
- Field dari Feature List adalah working assumption dan harus dikonfirmasi sebelum production, terutama NIK/alamat/no. HP.
- Cegah submit ganda.
- Jangan menyimpulkan approval atau status aktif tanpa business rule/backend.

### 6.4 Member Features (FR-04)

- Dashboard, ringkasan simpanan, riwayat simpanan, dan profil adalah working assumptions implementasi awal.
- Semua angka dan transaksi berasal dari data database.
- Jangan hardcode saldo.
- Riwayat anggota hanya untuk pemilik data.
- Jangan menambahkan input/koreksi transaksi untuk anggota tanpa keputusan.
- Loan history boleh tetap nonaktif/placeholder; jangan implementasikan pinjaman penuh.

### 6.5 Manager Area

- Role `pengurus` harus diberikan lewat mekanisme aman.
- Dashboard/kelola anggota merupakan working assumption pendukung US-05.
- Aksi approve/reject blocked sampai kebijakan dikonfirmasi.
- Admin/Super Admin optional/blocked.

### 6.6 Guidance and Navigation (FR-05)

- Menu memakai label jelas dan ikon yang didampingi teks.
- Panduan sesuai fitur aktual.
- Jangan membuat route atau link mati.

## 7. Component and Code Architecture

Gunakan component-based architecture dan pisahkan business logic dari UI.

Struktur konseptual:

```text
src/
├── app/                 # routing, providers, app shell
├── components/
│   ├── ui/              # shadcn/ui and shared primitives
│   ├── layout/
│   ├── navigation/
│   ├── access/
│   ├── auth/
│   ├── members/
│   ├── savings/
│   ├── manager/
│   └── help/
├── pages/
├── services/            # Supabase/data access layer
├── hooks/
├── utils/
├── types/
├── styles/
├── supabase/
│   └── migrations/
└── tests/
```

Struktur aktual dapat menyesuaikan kebutuhan, tetapi hindari satu file untuk seluruh aplikasi. Pisahkan service Supabase dari presentational component. Gunakan nama file/fungsi deskriptif dan hindari duplikasi.

## 8. Data and Database Rules

- `auth.users` disediakan Supabase Auth.
- `profiles` relasi 1:1 dengan `auth.users`.
- `members` menyimpan data anggota dan status.
- `savings` menyimpan transaksi simpanan sesuai model kerja.
- `loans` optional; jangan dibuat/diaktifkan tanpa keputusan.
- `help_contents` dapat diganti konten statis untuk implementasi awal jika lebih sederhana.
- `audit_logs` optional; log tidak boleh berisi secret/data pribadi mentah.
- Semua tabel `public` memiliki RLS policy yang diuji.
- Schema dan perubahan disimpan sebagai migration.

## 9. Testing Requirements

Minimal uji:

**Functional:** startup, retry, login, logout, registration, dashboard anggota, riwayat simpanan, profil, panduan, daftar anggota/pengurus jika aktif.

**Validation:** field wajib, NIK 16 digit jika digunakan, email invalid, password invalid sesuai policy, duplicate submit, form recovery.

**Authorization/security:** anggota A vs B, anggota vs pengurus, akses route langsung, role assignment, RLS, secret exposure.

**Persistence:** reload, login kembali, perubahan profil, data anggota, dan transaksi simpanan.

**Responsive/accessibility:** mobile, tablet, desktop, keyboard, visible focus, labels, contrast, table-to-card behavior.

Status pengujian: `Pass`, `Fail`, `Blocked`, `Not Tested`.

## 10. Visual Validation

Bandingkan implementasi dengan `UX-SPEC.md` dan `DESIGN-SYSTEM.md`: struktur halaman, prioritas informasi, typography, colors, spacing, komponen, status, responsive behavior, dan feedback. Jangan menyatakan desain sesuai hanya dari CSS; periksa tampilan aktual/screenshot jika alat tersedia.

## 11. Scope Control

Scope kerja:

- Akses dan error recovery.
- Login dan pengelolaan sesi.
- Pendaftaran anggota.
- Dashboard anggota, status keanggotaan, riwayat simpanan, profil (working assumption FR-04).
- Dashboard pengurus dan kelola anggota (working assumption; approval conditional).
- Panduan/navigasi.
- Keamanan, responsivitas, dan pengujian.

Di luar scope tanpa keputusan baru:

- Pinjaman penuh, bunga, cicilan, pencairan, pembayaran.
- SHU, akuntansi, kas, inventaris, vendor, penjualan, laporan keuangan.
- Integrasi eksternal atau role admin tingkat atas.

## 12. Decision and Assumption Management

Jika menemukan requirement belum jelas:

1. Identifikasi bagian yang tidak jelas.
2. Jelaskan dampak implementasinya.
3. Catat opsi dan rekomendasi.
4. Minta keputusan pemilik proyek untuk perubahan kebutuhan/bisnis.
5. Catat hasil dalam `DECISIONS.md`.

Prioritas blocker:

- Strategi autentikasi nomor anggota/username.
- Status approval pendaftaran.
- Field final dan kebijakan data pribadi.
- Kewenangan pencatatan/koreksi simpanan.
- Status modul pinjaman.
- Penetapan role pengurus dan apakah Admin diperlukan.

## 13. Completion Report

Setiap tahap implementasi harus menghasilkan laporan:

- **Implementation Summary:** fitur/komponen yang dibuat dan file yang berubah.
- **Acceptance Status:** ID kriteria Pass/Fail/Blocked/Not Tested.
- **Evidence:** screenshot, log, test output, atau langkah reproduksi.
- **Known Issues:** bug dan batasan.
- **Open Decisions:** keputusan yang belum diambil.
- **Next Steps:** pekerjaan lanjutan yang diperlukan.

Jangan menyatakan aplikasi selesai jika kriteria Must Have belum terpenuhi atau blocker keamanan masih terbuka.

## 14. Final Instruction

Prioritaskan kebenaran fungsi, kesesuaian PRD v1.1, keamanan data, konsistensi UX, dan bukti pengujian.

**Build what is specified, label assumptions honestly, validate what is built, and report what is not yet complete.**
