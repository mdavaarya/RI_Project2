# ACCEPTANCE CRITERIA

**Project:** SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan  
**Version:** 1.1  
**Status:** Draft untuk validasi implementasi  
**References:** PRD SIMKOPDES v1.1; UX-SPEC.md; INTERACTION-SPEC.md; DESIGN-SYSTEM.md; FEATURE-LIST-DATA-MODEL.md

## 1. Purpose

Dokumen ini mendefinisikan kriteria penerimaan untuk implementasi SIMKOPDES berdasarkan PRD v1.1. Kriteria FR-01 sampai FR-05 mengikuti penomoran PRD v1.1. Kriteria terkait dashboard/simpanan/profil dan area pengurus yang berasal dari Feature List diberi label **working assumption**.

Kriteria merupakan target pengujian, bukan bukti bahwa fitur telah lulus. Status hanya boleh `Pass` apabila pengujian dan evidence tersedia.

## 2. Acceptance Criteria Convention

### 2.1 Priority

| Priority | Description |
|---|---|
| Must Have | Wajib untuk alur inti sesuai prioritas PRD. |
| Should Have | Penting untuk kualitas; dapat ditunda dengan alasan dan catatan. |
| Could Have | Peningkatan opsional; tidak boleh memperluas scope tanpa persetujuan. |

### 2.2 Verification Method

- **Manual Test:** pengujian langsung.
- **Automated Test:** unit/component/E2E test.
- **Integration Test:** integrasi Supabase/Auth/database.
- **Visual Inspection:** pemeriksaan UI/responsivitas.
- **Security Test:** RLS, autentikasi, role, dan paparan data.
- **Accessibility Test:** keyboard, label, fokus, dan kontras.

### 2.3 Test Status

`Pass` = lulus dan ada evidence; `Fail` = hasil tidak sesuai; `Blocked` = tidak dapat diuji karena keputusan/dependensi belum tersedia; `Not Tested` = belum diuji.

## 3. Access and Recovery — FR-01

### AC-001 — Startup Loading State
**Priority:** Must Have  
**Verification:** Manual Test, Automated Test

Given pengguna membuka aplikasi, when konfigurasi/sesi/data awal sedang dimuat, then aplikasi menampilkan indikator loading dan tidak menampilkan data seolah-olah telah diperbarui.

### AC-002 — Recoverable Access Error
**Priority:** Must Have  
**Verification:** Manual Test, Automated Test

Given aplikasi mendeteksi error yang dapat ditangani, when error state ditampilkan, then sistem memberikan pesan nonteknis, langkah berikutnya yang relevan, dan retry jika aman. Stack trace, token, dan pesan internal tidak tampil pada UI.

### AC-003 — Safe Retry
**Priority:** Must Have  
**Verification:** Automated Test, Integration Test

Given operasi pemuatan gagal, when pengguna mencoba kembali, then retry tidak membuat akun/permohonan/data ganda dan hasil aktual ditampilkan.

### AC-004 — Honest Error Boundary
**Priority:** Should Have  
**Verification:** Manual Test

Given kegagalan terjadi sebelum UI dapat diinisialisasi, then dokumentasi/testing tidak boleh mengklaim bahwa pesan error di dalam aplikasi dapat mengatasi semua startup crash.

## 4. Login — FR-02

### AC-005 — Login Form Clarity
**Priority:** Must Have  
**Verification:** Manual Test, Visual Inspection

Given pengguna membuka halaman login, then field identitas dan password memiliki label, instruksi, dan tombol yang jelas serta sesuai metode auth yang benar-benar dikonfigurasi.

### AC-006 — Required Field Validation
**Priority:** Must Have  
**Verification:** Manual Test, Automated Test

Given salah satu field login wajib kosong, when pengguna submit, then request ditolak dan pesan validasi tampil dekat field.

### AC-007 — Login Feedback
**Priority:** Must Have  
**Verification:** Integration Test

Given kredensial dikirim, when Supabase/adapter server memberi hasil, then UI menampilkan sukses hanya setelah autentikasi dikonfirmasi dan menampilkan pesan aman saat gagal.

### AC-008 — No Account Enumeration
**Priority:** Must Have  
**Verification:** Security Test

Given autentikasi gagal, then pesan tidak boleh secara tidak perlu mengungkap apakah nomor anggota/email tertentu terdaftar.

### AC-009 — Supabase Session and Logout
**Priority:** Must Have  
**Verification:** Integration Test, Security Test

Given login berhasil, when halaman reload, then sesi dikelola Supabase Auth. When logout, then sesi diakhiri dan route privat tidak dapat diakses.

### AC-010 — Username/Member Number Authentication Strategy
**Priority:** Must Have  
**Verification:** Security Test, Integration Test

Given field login menggunakan username/nomor anggota, then autentikasi harus memakai pemetaan server-side atau mekanisme resmi yang aman. Browser tidak boleh mencari email berdasarkan nomor anggota. Jika mekanisme belum ditetapkan, status kriteria `Blocked`, bukan Pass.

### AC-011 — Password Recovery
**Priority:** Should Have / Conditional  
**Verification:** Integration Test

Given email dan konfigurasi recovery tersedia, when pengguna meminta reset password, then Supabase menerima `resetPasswordForEmail()` dan UI menampilkan instruksi sesuai respons. Jika belum dikonfigurasi, link tidak boleh mengarah ke alur palsu.

## 5. Registration — FR-03

### AC-012 — Registration Form Simplicity
**Priority:** Must Have  
**Verification:** Manual Test, Visual Inspection

Given calon anggota membuka pendaftaran, then form mengikuti field yang telah disetujui dan tidak menambahkan langkah/persyaratan tanpa dasar.

### AC-013 — Registration Field Validation
**Priority:** Must Have  
**Verification:** Automated Test, Manual Test

Given field wajib kosong atau format tidak valid, when calon anggota submit, then sistem menolak request dan menampilkan error pada field terkait tanpa menghapus input lain.

### AC-014 — NIK Validation (if approved)
**Priority:** Should Have / Conditional  
**Verification:** Automated Test

Given NIK dikonfirmasi sebagai field yang dikumpulkan, then validasi menerima tepat 16 digit numerik dan menyimpan sebagai text. Jika pengumpulan NIK belum disetujui, field tidak boleh diwajibkan pada production.

### AC-015 — Registration Result from Backend
**Priority:** Must Have  
**Verification:** Integration Test

Given form dikirim, when backend mengonfirmasi hasil, then UI menampilkan status aktual. Pembuatan akun Auth tidak otomatis berarti status anggota aktif.

### AC-016 — Duplicate Registration Prevention
**Priority:** Must Have  
**Verification:** Automated Test, Integration Test

Given pengguna menekan tombol Daftar berkali-kali atau request mengalami retry, then hanya satu proses pendaftaran yang berhasil dibuat untuk satu submission.

### AC-017 — Approval Status Policy
**Priority:** Blocked until decision  
**Verification:** Integration Test

Given kebijakan approval belum diputuskan, then agent tidak boleh mengimplementasikan auto-activation atau approval pengurus sebagai kebijakan final. Setelah keputusan tersedia, uji seluruh transisi status `pending/aktif/nonaktif`.

## 6. Member Main Features — FR-04 (Working Assumption)

### AC-018 — Member Dashboard Loads Real Data
**Priority:** Must Have for implemented FR-04 scope  
**Verification:** Integration Test

Given anggota dengan sesi valid membuka dashboard, then status keanggotaan dan ringkasan simpanan berasal dari database untuk anggota tersebut, bukan nilai hardcoded.

### AC-019 — Savings Balance Consistency
**Priority:** Must Have for implemented FR-04 scope  
**Verification:** Automated Test, Integration Test

Given terdapat transaksi simpanan yang sah, when ringkasan saldo dihitung, then hasil sesuai definisi agregasi yang terdokumentasi dan konsisten dengan riwayat. Jika aturan penghitungan belum disepakati, tampilkan data yang aman tanpa mengarang saldo.

### AC-020 — Savings History Visibility
**Priority:** Must Have for implemented FR-04 scope  
**Verification:** Manual Test, Integration Test

Given anggota membuka riwayat simpanan, then daftar menampilkan jenis (pokok/wajib/sukarela), nominal, tanggal, dan keterangan yang tersedia.

### AC-021 — Member Data Isolation
**Priority:** Must Have  
**Verification:** Security Test

Given anggota A dan anggota B memiliki data, when A mengakses riwayat/profil, then A tidak dapat membaca data B meski mengubah URL, ID, atau request.

### AC-022 — Member Profile
**Priority:** Must Have for implemented FR-04 scope  
**Verification:** Manual Test, Integration Test

Given anggota membuka profil, then sistem menampilkan data miliknya yang diizinkan. Field yang tidak boleh diubah (misalnya nomor anggota/status) tidak dapat diubah dari UI anggota.

### AC-023 — No Fake Financial Data
**Priority:** Must Have  
**Verification:** Visual Inspection, Integration Test

Given data simpanan belum tersedia, then sistem menampilkan empty state dan tidak menampilkan saldo/transaksi dummy seolah-olah nyata.

### AC-024 — Loan Module Scope Control
**Priority:** Must Have  
**Verification:** Visual Inspection, Functional Test

Given modul pinjaman belum disetujui, then modul tidak muncul sebagai fungsi aktif atau hanya ditampilkan sebagai placeholder yang jelas. Tidak ada workflow bunga/cicilan/pencairan/pembayaran yang dibuat tanpa scope baru.

## 7. Manager Area — Working Assumption / US-05

### AC-025 — Manager Route Authorization
**Priority:** Must Have if manager area enabled  
**Verification:** Security Test

Given pengguna bukan pengurus membuka route dashboard pengurus, then sistem menolak akses di server/database policy, bukan hanya menyembunyikan menu.

### AC-026 — Manager Dashboard Data
**Priority:** Should Have  
**Verification:** Integration Test

Given pengurus yang sah membuka dashboard, then jumlah anggota dan aktivitas terbaru diambil dari data aktual. Tidak ada angka dummy tanpa label demo.

### AC-027 — Member List Privacy
**Priority:** Must Have if manager area enabled  
**Verification:** Security Test, Visual Inspection

Given pengurus membuka daftar anggota, then hanya data yang diperlukan untuk tugasnya ditampilkan; NIK/alamat/no. HP tidak dipaparkan berlebihan.

### AC-028 — Registration Approval Conditional
**Priority:** Blocked until decision  
**Verification:** Integration Test, Security Test

Given approval pendaftaran belum diputuskan, then aksi approve/reject tidak boleh diaktifkan. Setelah keputusan disetujui, hanya role berwenang yang dapat mengubah status dan perubahan tercatat.

### AC-029 — Role Assignment Protection
**Priority:** Must Have  
**Verification:** Security Test

Given calon anggota mendaftar, then pengguna tidak dapat menetapkan role pengurus/admin melalui payload atau form client. Role istimewa diberikan melalui mekanisme server yang berwenang.

## 8. Guidance and Navigation — FR-05

### AC-030 — Clear Navigation Labels
**Priority:** Must Have  
**Verification:** Manual Test, Visual Inspection

Given pengguna melihat navigasi, then item menggunakan label familiar dan ikon tidak menjadi satu-satunya penanda.

### AC-031 — Role-Aware Navigation
**Priority:** Must Have  
**Verification:** Manual Test, Security Test

Given anggota/pengurus login, then menu disesuaikan dengan role dan akses route tetap diverifikasi backend/RLS.

### AC-032 — Help Content Availability
**Priority:** Should Have  
**Verification:** Manual Test

Given pengguna membuka Bantuan, then konten yang tersedia sesuai fitur aktual dan dapat dibuka kembali. Link tidak boleh menuju halaman kosong.

### AC-033 — Contextual Help
**Priority:** Should Have  
**Verification:** Manual Test, Accessibility Test

Given pengguna membuka bantuan kontekstual, then teks singkat menjelaskan istilah/aksi dan dapat ditutup tanpa kehilangan input.

## 9. UX and Design Acceptance Criteria

### AC-034 — Feedback for Important Actions
**Priority:** Must Have  
**Verification:** Manual Test

Given pengguna melakukan aksi penting, when berhasil/gagal, then UI menampilkan feedback yang sesuai hasil backend.

### AC-035 — Empty and Loading States
**Priority:** Must Have  
**Verification:** Manual Test, Visual Inspection

Given data sedang dimuat atau kosong, then sistem menampilkan loading/empty state yang informatif dan tidak menyamarkan kondisi data.

### AC-036 — Responsive Layout
**Priority:** Must Have  
**Verification:** Visual Inspection, Manual Test

Given aplikasi dibuka melalui mobile, tablet, desktop, then layout menyesuaikan ukuran, tidak memiliki horizontal overflow yang mengganggu, dan semua fungsi utama tetap dapat digunakan.

### AC-037 — Design Token Consistency
**Priority:** Should Have  
**Verification:** Visual Inspection

Given halaman aplikasi ditampilkan, then warna, typography, spacing, radius, dan komponen mengikuti `DESIGN-SYSTEM.md`. Warna provisional tidak boleh disebut warna resmi.

### AC-038 — Accessibility Basics
**Priority:** Should Have  
**Verification:** Accessibility Test

Given pengguna mengoperasikan aplikasi dengan keyboard/screen reader, then field memiliki label, fokus terlihat, aksi ikon memiliki nama aksesibel, dan status tidak hanya dibedakan dengan warna.

## 10. Non-Functional and Security Criteria

### AC-039 — Data Persistence
**Priority:** Must Have  
**Verification:** Integration Test

Given data profil/anggota/simpanan berhasil disimpan, when aplikasi reload atau pengguna login kembali, then data tetap tersedia sesuai hak akses.

### AC-040 — RLS on Public Tables
**Priority:** Must Have  
**Verification:** Security Test

Given semua tabel `public` digunakan, then RLS aktif dan diuji untuk anggota, pengurus, dan akses anonim.

### AC-041 — Secrets and Sensitive Data
**Priority:** Must Have  
**Verification:** Security Test

Given aplikasi dibangun dan dijalankan, then service-role key/secret tidak berada di frontend, password tidak disimpan manual, dan log tidak berisi token/password/NIK utuh.

### AC-042 — Error Recovery Preserves Safe Input
**Priority:** Must Have  
**Verification:** Manual Test, Integration Test

Given login/pendaftaran gagal karena jaringan/server, then UI mempertahankan input non-sensitif selama sesi aktif, menampilkan pesan, dan mencegah duplikasi pada retry.

## 11. Open Decision Criteria

| ID | Decision | Test status until resolved |
|---|---|---|
| DEC-01 | Metode login username/nomor anggota dan mapping ke Supabase Auth | Blocked |
| DEC-02 | Pendaftaran otomatis aktif atau pending approval | Blocked |
| DEC-03 | Field pendaftaran final dan kebijakan data pribadi | Blocked for production |
| DEC-04 | Kewenangan pencatatan/koreksi transaksi simpanan | Blocked for write UI |
| DEC-05 | Pinjaman masuk rilis awal atau tidak | Blocked for loan workflow |
| DEC-06 | Role admin/super admin dibutuhkan atau tidak | Blocked |
| DEC-07 | Mekanisme pemberian role pengurus | Blocked for production manager access |

## 12. Release Acceptance

Versi awal dapat dinyatakan siap hanya apabila:

- Seluruh Must Have yang relevan terhadap fitur yang disetujui telah lulus dan memiliki evidence.
- Login dan pendaftaran menggunakan backend nyata; tidak ada status sukses palsu.
- Strategi autentikasi dan akses role tidak memiliki celah kritis.
- RLS telah diuji dengan akun berbeda.
- Data anggota dan simpanan terisolasi sesuai hak akses.
- Tidak ada data transaksi/saldo dummy yang ditampilkan sebagai data nyata.
- Dashboard, riwayat, profil, navigasi, dan panduan sesuai scope yang telah disepakati.
- Keputusan bisnis yang memengaruhi keamanan/akses tidak disembunyikan; item yang belum diputuskan diberi status Blocked dan dikeluarkan dari rilis aktif.
- Tidak ada bug kritis yang menghalangi alur inti.

## 13. Test Execution Report

| Criteria ID | Test Status | Test Evidence | Bug Reference | Notes |
|---|---|---|---|---|
| AC-001 | Not Tested |  |  |  |
| AC-002 | Not Tested |  |  |  |
| AC-003 | Not Tested |  |  |  |

Salin baris sesuai seluruh ID AC-001 sampai AC-042 ketika pengujian dijalankan. Jangan mengubah status menjadi Pass tanpa evidence yang dapat diperiksa.

**Akhir dokumen — ACCEPTANCE-CRITERIA SIMKOPDES v1.1.**
