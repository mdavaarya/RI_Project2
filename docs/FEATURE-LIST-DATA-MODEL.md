# SIMKOPDES — Feature List & Data Model

**Dokumen:** Pendamping PRD SIMKOPDES v1.1 untuk pembangunan aplikasi dari awal  
**Versi dokumen pendamping:** 1.1  
**Tanggal:** 23 November 2026  
**Status:** Draft — memuat working assumptions dan keputusan yang masih terbuka  
**Referensi utama:** PRD SIMKOPDES v1.1; hasil WS5–WS8; keputusan teknis dari pemilik proyek

> **Catatan versi:** PRD yang menjadi acuan pekerjaan ini adalah **PRD v1.1**. Angka versi pada nama file sumber lama tidak digunakan untuk menentukan versi isi dokumen. Versi dokumen pendamping ini juga tidak mengubah versi PRD.

## 1. Tujuan dan aturan penggunaan

Dokumen ini menjembatani kebutuhan UX dalam PRD v1.1 dengan fitur konkret, rancangan data, dan keputusan teknis agar aplikasi SIMKOPDES dapat dibangun dari nol menggunakan AI coding agent.

PRD v1.1 mendefinisikan arah perbaikan UX. Karena nama dan rincian beberapa fitur bisnis utama tidak dijelaskan secara lengkap oleh bukti WS5–WS8, fitur pada FR-04 dan sebagian modul pengurus di dokumen ini merupakan **working assumption**. Asumsi tersebut membantu membuat prototipe/implementasi awal yang koheren, tetapi bukan hasil audit aplikasi asli atau temuan langsung responden.

Gunakan urutan otoritas berikut:

1. **PRD SIMKOPDES v1.1 dan hasil WS5–WS8** untuk tujuan, kebutuhan UX, prioritas, serta batas ruang lingkup.
2. **Keputusan eksplisit pemilik proyek** untuk stack dan keputusan teknis/bisnis yang telah ditetapkan.
3. **Dokumen pendamping ini** untuk rincian implementasi yang ditandai sebagai working assumption.
4. Preferensi agent tidak boleh mengubah requirement, memperluas modul bisnis, atau mengubah asumsi menjadi fakta.

## 2. Dasar penelitian dan batas bukti

### 2.1 Temuan WS5

| ID | Temuan dari lima ulasan publik | Implikasi UX |
|---|---|---|
| U1 | Aplikasi dilaporkan tetap tidak dapat dibuka setelah dicoba download, instal, dan instal ulang. | Prioritaskan informasi kondisi akses dan langkah pemulihan yang benar-benar tersedia. |
| U2 | Proses login dinilai merepotkan. Ulasan menyinggung sidik jari/wajah sebagai cara masuk yang lebih praktis. | Buat login jelas dan ringkas; opsi autentikasi tambahan hanya bila didukung sistem. |
| U3 | Pendaftaran anggota dinilai mudah dan tidak merepotkan. | Pertahankan kesederhanaan pendaftaran; jangan menambah langkah tanpa dasar. |
| U4 | Fitur utama koperasi dinilai mudah digunakan. | Pertahankan kemudahan fitur utama; jangan melakukan redesign bisnis yang tidak diperlukan. |
| U5 | Ulasan menyebut sebagian pengurus masih belajar memanfaatkan teknologi. | Gunakan bahasa sederhana dan sediakan panduan singkat. |

**Batas bukti:** lima ulasan publik bukan sampel representatif dan bukan hasil usability test. Ulasan berasal dari penulis berbeda, bukan satu perjalanan pengguna. Penyebab teknis kegagalan akses, detail backend, perangkat, jaringan, dan nama rinci fitur utama tidak dapat disimpulkan dari ulasan. Persona WS6 merupakan persona sintetis; journey WS7 merupakan sintesis; requirement WS8 merupakan usulan perbaikan.

### 2.2 Pemetaan requirement PRD v1.1

Pemetaan berikut mengikuti struktur FR pada PRD v1.1 dan Feature List yang diberikan sebagai pendampingnya. Jangan menggeser nomor FR.

| ID | Requirement | Keterkaitan UX | Prioritas | Catatan |
|---|---|---|---|---|
| FR-01 | Informasi kegagalan akses dan arahan pemulihan | UXR-01 | High | Error yang dapat ditangani; bukan klaim semua crash bisa dipulihkan dari UI. |
| FR-02 | Login ringkas, jelas, dan tetap aman | UXR-02 | High | Metode identitas harus sesuai dukungan backend. |
| FR-03 | Pendaftaran anggota yang mudah dipahami | UXR-03 | Low | Pertahankan kemudahan; jangan menambah kebijakan keanggotaan. |
| FR-04 | Fitur utama anggota | UXR-04 | Low | Rincian dashboard/simpanan/profil adalah working assumption pendamping PRD. |
| FR-05 | Panduan dan navigasi yang sederhana | UXR-05 | Medium | Panduan harus sesuai fitur yang benar-benar dibuat. |

## 3. Ruang lingkup aplikasi

Aplikasi web SIMKOPDES ini dibangun dari awal. Cakupan implementasi adalah perbaikan pengalaman akses, login, pendaftaran, fitur utama anggota versi minimal, serta panduan/navigasi. Aplikasi ini **bukan** sistem manajemen koperasi lengkap.

### 3.1 In scope

- Status loading, error akses yang dapat ditangani, retry yang aman, dan informasi bantuan.
- Login dengan identitas yang ditetapkan dan password, termasuk validasi, feedback, pengelolaan sesi, dan pemulihan password sesuai konfigurasi.
- Pendaftaran anggota dengan field minimal yang ditetapkan sebagai working assumption dan status yang mengikuti backend.
- FR-04 versi minimal: dashboard anggota, ringkasan saldo/status keanggotaan, riwayat simpanan, dan profil anggota.
- Riwayat pinjaman hanya sebagai opsi/placeholder jika disetujui; bukan modul pinjaman penuh.
- Area pengurus ringkas untuk mendukung kebutuhan pengelolaan anggota dan panduan, dengan aturan approval masih menunggu keputusan.
- Panduan/FAQ dan bantuan kontekstual.
- Responsivitas, aksesibilitas dasar, serta keamanan data.

### 3.2 Out of scope kecuali ada keputusan baru

- Perhitungan SHU terperinci.
- Pinjaman multi-tier, simulasi bunga, jadwal cicilan, pencairan, dan pembayaran pinjaman.
- Akuntansi, kas, inventaris, vendor, penjualan, payroll, dan pelaporan keuangan lengkap.
- Integrasi eksternal, sinkronisasi LMS, atau layanan pihak ketiga yang belum ditetapkan.
- Kebijakan baru tentang verifikasi identitas, persyaratan hukum, dan retensi data anggota.
- Panel Admin/Super Admin sampai kewenangan dan kebutuhan perannya disetujui.

## 4. Peran pengguna

| Role | Deskripsi | Akses konseptual |
|---|---|---|
| Calon Anggota | Pengguna publik yang belum terdaftar. | Melihat informasi publik dan mengirim pendaftaran. Tidak memiliki akses ke data anggota. |
| Anggota | Pengguna terdaftar dengan status keanggotaan. | Dashboard anggota, riwayat simpanan miliknya, profil miliknya, dan panduan. |
| Pengurus | Pengguna yang membantu pengelolaan data anggota. | Dashboard pengurus ringkas dan pengelolaan permohonan anggota sesuai kewenangan yang disepakati. |
| Admin/Super Admin | Role tingkat sistem. | **Opsional/blocked.** Jangan dibuat aktif atau diberikan akses luas sebelum definisi kewenangan, proses pemberian role, dan kebutuhan operasional disetujui. |

Pendaftaran publik tidak boleh memberi pengguna pilihan untuk menetapkan dirinya sebagai pengurus atau admin. Pemberian role istimewa harus melalui jalur server/administratif yang aman.

## 5. Feature List

### 5.1 FEAT-01 — Akses dan penanganan kegagalan (FR-01 / UXR-01)

**Prioritas:** High

| Fitur | Perilaku | Batasan |
|---|---|---|
| Loading state | Indikator saat aplikasi memuat konfigurasi, sesi, atau data awal. | Jangan menampilkan status siap sebelum proses penting selesai. |
| Error/offline state | Pesan nonteknis untuk kegagalan yang dapat dideteksi. | Jangan menyimpulkan akar penyebab jika tidak diketahui. |
| Retry action | Tombol “Coba lagi” untuk operasi yang aman diulang. | Cegah request ganda dan duplikasi. |
| Kanal bantuan | Tampilkan kontak/tautan resmi jika disediakan. | Jangan mengarang nomor WA/email. |

### 5.2 FEAT-02 — Login (FR-02 / UXR-02)

**Prioritas:** High

- Form login memakai label identitas yang jelas, misalnya “Username/Nomor Anggota” sesuai keputusan metode autentikasi.
- Password menggunakan input bertipe password dan opsi tampil/sembunyikan.
- Validasi field kosong dan format ditampilkan dekat field.
- Pesan gagal jelas dan dapat ditindaklanjuti, tetapi tidak membocorkan keberadaan akun.
- Session dikelola Supabase Auth; password tidak disimpan di tabel aplikasi.
- Lupa password menggunakan `supabase.auth.resetPasswordForEmail()` apabila email terhubung ke akun dan konfigurasi email/reset Supabase sudah aktif.
- **Catatan teknis:** Supabase Auth tidak menyediakan autentikasi username/nomor anggota secara langsung sebagai kredensial arbitrer. Pemetaan nomor anggota ke identitas auth memerlukan mekanisme server-side yang aman. Jangan melakukan lookup email berdasarkan nomor anggota dari browser.

### 5.3 FEAT-03 — Pendaftaran anggota (FR-03 / UXR-03)

**Prioritas:** Low — pertahankan kemudahan.

| Field kerja | Tipe | Status awal | Validasi kerja |
|---|---|---|---|
| Nama | Text | Working assumption: wajib | Tidak boleh kosong. |
| NIK | Text | Working assumption: wajib | 16 digit numerik; konfirmasi kebutuhan dan dasar pengumpulan sebelum produksi. |
| Alamat | Text/textarea | Working assumption: wajib | Validasi panjang yang wajar; konfirmasi kebutuhan. |
| Nomor HP | Tel | Working assumption: wajib | Format nomor yang diterima sistem. |
| Email | Email | Working assumption: wajib | Format email valid; digunakan untuk auth/pemulihan bila dikonfigurasi. |
| Password | Password | Wajib untuk sign-up email/password | Diproses Supabase Auth; tidak disimpan manual. |

Daftar di atas mengikuti working assumption Feature List & Data Model, bukan hasil pengukuran atau kebijakan resmi koperasi. NIK dan alamat adalah data pribadi; kebutuhan, dasar pengumpulan, akses, serta retensinya perlu disetujui sebelum dipakai pada produksi.

Sistem menampilkan konfirmasi pendaftaran berdasarkan respons backend. Apakah status langsung aktif atau menunggu approval pengurus masih merupakan keputusan terbuka.

### 5.4 FEAT-04 — Fitur utama anggota (FR-04 / UXR-04)

**Prioritas:** Low — working assumption untuk mengisi gap detail FR-04.

| Fitur | Deskripsi | Status/batasan |
|---|---|---|
| Dashboard anggota | Ringkasan saldo simpanan dan status keanggotaan. | Working assumption; nilai harus berasal dari data tersimpan, bukan angka dummy yang dianggap nyata. |
| Riwayat simpanan | Daftar simpanan pokok, wajib, dan sukarela beserta nominal dan tanggal. | Working assumption; tampilkan data milik anggota yang login. Belum mengasumsikan anggota dapat membuat transaksi. |
| Profil anggota | Melihat data profil/keanggotaan dasar. | Working assumption; edit hanya field yang diizinkan. |
| Riwayat pinjaman | Status pengajuan/cicilan pinjaman. | Opsional/placeholder; jangan membangun workflow pinjaman penuh tanpa keputusan tambahan. |

Data simpanan yang belum tersedia ditampilkan sebagai empty state. Jangan menciptakan saldo atau transaksi contoh tanpa label demo yang jelas.

### 5.5 FEAT-05 — Panduan dan navigasi (FR-05 / UXR-05)

**Prioritas:** Medium

- Label menu menggunakan istilah umum dan mudah dipahami.
- Ikon navigasi selalu disertai label teks.
- Tooltip/contextual hint tersedia pada bagian yang berpotensi membingungkan.
- Halaman bantuan/FAQ berisi panduan singkat dan dapat diakses ulang.
- Empty state menjelaskan mengapa data belum muncul dan tindakan berikutnya.
- Panduan pengurus menjelaskan langkah penggunaan fitur yang memang tersedia.

### 5.6 Modul Pengurus — pendukung US-05 (working assumption)

| Fitur | Deskripsi | Batasan |
|---|---|---|
| Dashboard pengurus | Ringkasan jumlah anggota dan aktivitas terbaru. | Working assumption; jangan menambahkan metrik finansial yang tidak ditetapkan. |
| Kelola anggota | Melihat daftar anggota/permohonan dan detailnya. | Akses dibatasi RLS/policy pengurus. |
| Persetujuan pendaftaran | Pengurus dapat menyetujui/menolak permohonan jika alur approval diputuskan. | **Blocked** sampai aturan approval, hak keputusan, dan status final dikonfirmasi. |
| Panduan pengurus | Instruksi penggunaan dalam langkah singkat. | Konten harus sesuai fitur aktual. |

## 6. Data Model — skema awal

Nama tabel di bawah menggunakan `snake_case` untuk PostgreSQL. Struktur ini merupakan skema kerja dan perlu direview sebelum migrasi produksi.

### 6.1 `profiles`

Relasi satu-ke-satu dengan `auth.users`, dibuat setelah sign-up melalui trigger/function yang aman atau proses server.

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK sekaligus FK ke `auth.users.id`. |
| `role` | enum/text | `anggota`, `pengurus`; `admin` optional/blocked. Default tidak boleh memberi privilege. |
| `nama` | text | Nama tampilan. |
| `no_hp` | text nullable | Hanya jika diperlukan dan dikonfirmasi. |
| `created_at` | timestamptz | Waktu pembuatan dari server. |
| `updated_at` | timestamptz | Waktu perubahan. |

### 6.2 `members` (padanan entitas Anggota)

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK. |
| `profile_id` | uuid | FK ke `profiles.id`, unique untuk relasi 1:1. |
| `nomor_anggota` | text | Unique; format/penomoran menunggu aturan koperasi. |
| `nik` | text | Data pribadi; akses harus dibatasi. |
| `alamat` | text | Data pribadi; akses harus dibatasi. |
| `status` | enum/text | `pending`, `aktif`, `nonaktif`. Arti transisi menunggu aturan approval. |
| `tanggal_daftar` | date/timestamptz | Diisi berdasarkan proses pendaftaran. |

### 6.3 `savings` (padanan entitas Simpanan)

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK. |
| `member_id` | uuid | FK ke `members.id`. |
| `jenis` | enum/text | `pokok`, `wajib`, `sukarela`. |
| `nominal` | numeric(14,2) | Nilai positif; aturan mata uang/decimal harus konsisten. |
| `tanggal_transaksi` | timestamptz/date | Waktu transaksi. |
| `keterangan` | text nullable | Deskripsi singkat, tanpa data sensitif berlebihan. |

Draf ini mencakup pencatatan/penyimpanan data simpanan dan pembacaan riwayat. Siapa yang membuat/mengubah transaksi, koreksi, dan audit transaksi belum ditetapkan; jangan membuat antarmuka input transaksi tanpa keputusan.

### 6.4 `loans` (opsional/placeholder)

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK jika modul disetujui. |
| `member_id` | uuid | FK ke `members.id`. |
| `jumlah_pengajuan` | numeric(14,2) | Nilai pengajuan. |
| `status` | enum/text | Draft awal: `diajukan`, `disetujui`, `ditolak`, `lunas`; perlu validasi proses bisnis. |
| `tanggal_pengajuan` | timestamptz/date | Tanggal pengajuan. |

**Jangan implementasikan** tabel/fitur cicilan, bunga, pencairan, pembayaran, atau approval pinjaman pada versi awal tanpa scope dan aturan bisnis yang disepakati.

### 6.5 `help_contents`

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK. |
| `halaman_terkait` | text | Misalnya `login`, `pendaftaran`, `dashboard_anggota`, `kelola_anggota`. |
| `judul` | text | Judul panduan. |
| `konten` | text | Isi panduan berbahasa sederhana. |
| `urutan_tampil` | int | Urutan tampilan. |

Untuk versi awal, konten statis dalam source code juga dapat digunakan. Tabel ini dipakai jika pengelolaan konten melalui database memang diperlukan.

### 6.6 `audit_logs` (opsional)

| Kolom | Tipe konseptual | Aturan |
|---|---|---|
| `id` | uuid | PK. |
| `user_id` | uuid nullable | FK ke `auth.users.id` bila tersedia. |
| `aksi` | text | Nama aksi. |
| `timestamp` | timestamptz | Waktu server. |
| `detail` | jsonb/text nullable | Metadata minimum; jangan menyimpan password, token, NIK utuh, atau data sensitif mentah. |

### 6.7 Relasi konseptual

```text
auth.users 1 ─── 1 profiles
profiles   1 ─── 1 members       (untuk role anggota)
members    1 ─── N savings
members    1 ─── N loans         (opsional)
auth.users 1 ─── N audit_logs    (opsional)
help_contents berdiri sendiri
```

## 7. Keamanan dan Row Level Security

- Aktifkan RLS pada seluruh tabel di schema `public`.
- Anggota hanya dapat membaca profil, data anggota, dan riwayat simpanannya sendiri.
- Pengurus hanya dapat membaca/mengelola data sesuai kewenangan yang disepakati; jangan otomatis memberi akses ke semua data sensitif.
- Pemberian role pengurus/admin tidak boleh dilakukan dari input publik atau client-side.
- `service_role` key dan secret tidak boleh masuk ke bundle frontend.
- Password ditangani Supabase Auth; jangan membuat kolom password.
- Batasi akses NIK/alamat/no. HP berdasarkan kebutuhan minimum.
- Jangan masukkan token, session, password, atau data pribadi utuh ke log.
- Uji RLS menggunakan minimal dua akun anggota berbeda dan satu akun pengurus uji.

## 8. Keputusan teknis

| Area | Keputusan | Status |
|---|---|---|
| Frontend | React + Vite | Ditetapkan. |
| Styling | Tailwind CSS | Ditetapkan. |
| UI component | shadcn/ui | Ditetapkan. |
| Backend/database/API | Supabase Postgres + Auth + API | Ditetapkan. |
| Session/auth | Supabase Auth (`supabase-js`) | Ditetapkan; metode identitas masih perlu dipastikan. |
| Login username/nomor anggota | Field UI direncanakan; pemetaan aman ke identitas Supabase belum ditetapkan. | Open / blocked sebelum auth integration final. |
| Reset password | `resetPasswordForEmail()` | Bersyarat pada email dan konfigurasi Supabase. |
| Approval pendaftaran | Otomatis aktif atau menunggu pengurus. | Open — keputusan bisnis. |
| Modul pinjaman | Full, placeholder, atau di-skip. | Open — jangan membangun workflow penuh. |
| Admin/Super Admin | Perlu atau tidak. | Optional/blocked. |
| Pencatatan transaksi simpanan | Siapa yang dapat membuat/mengubah data. | Open — riwayat baca dapat dibuat, input transaksi menunggu aturan. |

## 9. Urutan implementasi yang disarankan

1. Inisialisasi React + Vite, TypeScript (direkomendasikan), Tailwind, shadcn/ui, dan Supabase client melalui environment variables.
2. Buat application shell, loading/error state, dan navigasi utama.
3. Implementasikan Supabase Auth dan profil; selesaikan keputusan metode identitas sebelum mengklaim login nomor anggota bekerja.
4. Implementasikan pendaftaran minimal sesuai field yang disetujui dan tampilkan status dari backend.
5. Implementasikan dashboard anggota, profil, dan riwayat simpanan sebagai working assumption FR-04 dengan data persisten dan RLS.
6. Implementasikan area pengurus dan alur approval setelah keputusan status/otorisasi disetujui.
7. Implementasikan panduan/FAQ FR-05.
8. Uji alur sukses, gagal, role isolation, RLS, responsivitas, dan empty state.

## 10. Keputusan terbuka yang wajib dicatat

| ID | Keputusan | Mengapa penting | Status |
|---|---|---|---|
| DEC-01 | Login memakai email, nomor HP, atau nomor anggota? | Supabase Auth tidak menerima nomor anggota arbitrary sebagai identitas native. | Open |
| DEC-02 | Pendaftaran otomatis aktif atau pending approval? | Menentukan status anggota dan hak akses setelah sign-up. | Open |
| DEC-03 | Field pendaftaran mana yang benar-benar wajib? | NIK/alamat/no. HP merupakan data pribadi. | Open — working fields tersedia di §5.3 |
| DEC-04 | Siapa yang dapat membuat/mengoreksi transaksi simpanan? | Menentukan UI, audit, dan RLS. | Open |
| DEC-05 | Apakah riwayat pinjaman masuk rilis awal? | Fitur pinjaman belum didukung aturan bisnis terperinci. | Open |
| DEC-06 | Apakah role admin/super admin dibutuhkan? | Dampak keamanan dan kewenangan sistem. | Open |
| DEC-07 | Bagaimana pengurus ditetapkan dan diberi akses? | Mencegah privilege escalation. | Open |
| DEC-08 | Apakah HelpContent disimpan di database atau statis? | Menentukan kebutuhan CMS/pengelolaan konten. | Open |

**Akhir dokumen — Feature List & Data Model SIMKOPDES.**
