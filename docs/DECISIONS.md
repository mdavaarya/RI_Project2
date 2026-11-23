# DECISIONS.md — Catatan Keputusan dan Working Assumptions SIMKOPDES

Dokumen ini mencatat keputusan arsitektural, teknis, dan bisnis serta status *working assumptions* sesuai panduan dalam `AGENTS.md` dan `FEATURE-LIST-DATA-MODEL.md`.

---

## 1. Status Keputusan Terbuka (Open Decisions)

| ID | Topik | Status | Keputusan & Catatan Implementasi |
|---|---|---|---|
| **DEC-01** | Strategi Autentikasi Username/Nomor Anggota | **Handled for Email Auth / Blocked for Arbitrary Member No Lookup** | Supabase Auth secara *native* mendukung kredensial Email + Password. Untuk mencegah pencarian email dari browser (yang melanggar privasi dan enumerasi akun), input login mengutamakan format Email. Form login mendukung identitas email/akun yang terdaftar. Fitur lookup nomor anggota ke email dari client tidak diaktifkan demi keamanan. |
| **DEC-02** | Status Pendaftaran (Otomatis Aktif vs Pending Approval) | **Working Assumption: Default Pending with Admin/Pengurus Review** | Sesuai Data Model, pendaftaran baru mencatat data anggota dengan status `pending`. Selama status `pending`, anggota dapat melihat informasi status keanggotaannya dan panduan, namun transaksi/kewenangan aktif menunggu persetujuan. Logika transisi status diuji secara aman. |
| **DEC-03** | Field Pendaftaran Final & Privasi Data Pribadi | **Working Assumption Field Collection** | Field yang digunakan: Nama Lengkap, NIK (16 digit numerik), Alamat Domisili, Nomor HP/WhatsApp, Email, dan Password. NIK disimpan sebagai teks untuk menjaga *leading zeros* dan di-mask pada tampilan umum/daftar pengurus demi kepatuhan privasi data. |
| **DEC-04** | Kewenangan Pencatatan & Koreksi Simpanan | **Read-Only for Member** | Anggota hanya memiliki hak baca (*read-only*) atas riwayat simpanannya sendiri. Pencatatan transaksi simpanan tidak dibuka untuk anggota; antarmuka write simpanan dibatasi atau menunggu SOP resmi koperasi. |
| **DEC-05** | Modul Pinjaman | **Placeholder / Disabled** | Sesuai PRD v1.1 dan batasan scope, modul pinjaman penuh (bunga, cicilan, tenor, pencairan) **tidak** diimplementasikan. Menu/halaman pinjaman ditandai sebagai placeholder nonaktif tanpa memalsukan data dummy. |
| **DEC-06** | Role Admin / Super Admin | **Blocked** | Role sistem utama yang diaktifkan adalah `anggota` dan `pengurus`. Role `admin` tidak diberikan akses tanpa spesifikasi kewenangan resmi. |
| **DEC-07** | Mekanisme Pemberian Role Pengurus | **Secure Server/DB Role Assignment** | Form pendaftaran publik **tidak** mengizinkan pemilihan role `pengurus`. Role `pengurus` hanya dapat diberikan langsung pada tabel `profiles` melalui database/kredensial berwenang. |

---

## 2. Working Assumptions FR-04

1. **Dashboard Anggota**: Menampilkan ringkasan saldo simpanan (pokok, wajib, sukarela) yang dihitung langsung dari tabel `savings` di Supabase. Jika tidak ada transaksi, menampilkan *empty state* yang jujur tanpa angka dummy.
2. **Riwayat Simpanan**: Menampilkan riwayat transaksi riil milik anggota yang sedang login terurut dari yang terbaru (*descending*).
3. **Profil Anggota**: Menampilkan informasi akun dan keanggotaan dasar, dengan proteksi field seperti nomor anggota dan status agar tidak dapat diedit sembarangan oleh pengguna.
4. **Dashboard Pengurus**: Menampilkan metrik operasional riil (jumlah anggota per status `pending`, `aktif`, `nonaktif`) berdasarkan data dari tabel `members`.

---

## 3. Tech Stack & Architecture

- **Frontend**: React 18 / 19 + Vite (TypeScript)
- **Styling**: Tailwind CSS + Design Tokens sesuai `DESIGN-SYSTEM.md`
- **UI Components**: shadcn/ui and Radix UI primitives, Lucide React Icons
- **State & Data Access**: Supabase Client SDK (`@supabase/supabase-js`), React Router v6/v7
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) on all public tables
- **Testing**: Vitest + React Testing Library for automated verification of Acceptance Criteria
