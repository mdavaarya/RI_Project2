# DESIGN SYSTEM

**Project:** SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan  
**Version:** 1.1  
**Status:** Draft / provisional visual direction  
**Reference:** PRD SIMKOPDES v1.1; UX-SPEC.md

> **Catatan:** PRD dan WS5–WS8 tidak memberikan logo, warna resmi, font resmi, atau brand guideline SIMKOPDES. Token visual di dokumen ini adalah usulan sementara untuk implementasi awal, bukan klaim identitas visual resmi. Ganti melalui token terpusat jika pemilik proyek memberikan pedoman resmi.

## 1. Design Direction

### 1.1 Design Concept

**Trustworthy, Clear, and Approachable Cooperative Service.**

Karakteristik:

- Antarmuka bersih, profesional, dan tidak intimidatif.
- Hierarki informasi jelas, terutama status akses, keanggotaan, dan data simpanan.
- Bahasa Indonesia sederhana dan familiar.
- Komponen dapat digunakan ulang.
- Pengalaman responsif untuk ponsel dan desktop.
- Dashboard/daftar tidak menampilkan angka atau data dummy seolah-olah nyata.

### 1.2 Design Principles

- **Clarity:** pengguna memahami fungsi elemen dan status sistem.
- **Consistency:** tombol, field, badge, dan navigasi konsisten.
- **Simplicity:** hindari dekorasi dan langkah yang tidak diperlukan.
- **Trust:** status selalu sesuai hasil backend.
- **Accessibility:** kontras, label, fokus, dan ukuran kontrol memadai.
- **Privacy:** data pribadi ditampilkan seminimal mungkin.
- **Scalability:** gunakan design tokens dan reusable components.

## 2. Color System

### 2.1 Provisional Primary Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#176B52` | Tombol utama, link utama, navigasi aktif. |
| `primary-hover` | `#125640` | Hover tombol utama. |
| `primary-pressed` | `#0E4634` | Active/pressed state. |
| `primary-soft` | `#E8F4EF` | Highlight dan selected background. |
| `primary-foreground` | `#FFFFFF` | Teks pada primary. |

Warna hijau merupakan pilihan visual sementara untuk konteks layanan koperasi; bukan warna resmi SIMKOPDES.

### 2.2 Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| `background` | `#F8FAFC` | Latar halaman. |
| `surface` | `#FFFFFF` | Card, panel, dialog, form. |
| `surface-muted` | `#F1F5F9` | Area sekunder. |
| `border` | `#E2E8F0` | Border dan divider. |
| `text-primary` | `#17212B` | Heading dan teks utama. |
| `text-secondary` | `#526170` | Teks pendukung. |
| `text-muted` | `#718096` | Metadata dan placeholder. |
| `disabled` | `#CBD5E1` | Kontrol nonaktif. |

### 2.3 Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| `success` | `#15803D` | Operasi berhasil/status aktif. |
| `success-soft` | `#DCFCE7` | Latar status berhasil. |
| `warning` | `#A16207` | Peringatan/status menunggu. |
| `warning-soft` | `#FEF3C7` | Latar peringatan. |
| `danger` | `#B91C1C` | Error, nonaktif, tindakan destruktif. |
| `danger-soft` | `#FEE2E2` | Latar error. |
| `info` | `#0369A1` | Informasi netral. |
| `info-soft` | `#E0F2FE` | Latar informasi. |

Status `pending`, `aktif`, dan `nonaktif` harus ditampilkan dengan teks; warna hanya pendukung.

## 3. Typography System

### 3.1 Font Family

- Primary: `Inter` bila tersedia dan penggunaan font telah disetujui.
- Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

### 3.2 Typography Scale

| Token | Size | Weight | Usage |
|---|---:|---:|---|
| `display` | 32px | 700 | Angka ringkasan utama bila diperlukan. |
| `h1` | 28px | 700 | Judul halaman. |
| `h2` | 22px | 600 | Judul bagian. |
| `h3` | 18px | 600 | Judul card/subbagian. |
| `body-lg` | 16px | 400 | Isi utama/instruksi. |
| `body` | 14px | 400 | Teks default. |
| `body-sm` | 13px | 400 | Keterangan pendukung. |
| `caption` | 12px | 400 | Metadata. |

Line-height: heading 1.2–1.4; body 1.5; caption 1.4. Hindari teks form terlalu kecil.

## 4. Spacing System

Gunakan kelipatan 4px.

| Token | Value | Usage |
|---|---:|---|
| `space-1` | 4px | Gap inline kecil. |
| `space-2` | 8px | Gap kompak. |
| `space-3` | 12px | Spacing komponen. |
| `space-4` | 16px | Padding standar. |
| `space-5` | 20px | Spacing bagian. |
| `space-6` | 24px | Padding card. |
| `space-8` | 32px | Jarak bagian besar. |
| `space-10` | 40px | Pemisah area halaman. |
| `space-12` | 48px | Jarak layout utama. |

## 5. Layout System

### 5.1 Application Shell

- **Desktop (≥1024px):** sidebar sekitar 240px; topbar/konten utama fleksibel; page padding 24–32px.
- **Tablet (640–1023px):** sidebar dapat diciutkan; page padding sekitar 24px.
- **Mobile (<640px):** satu kolom; navigasi drawer atau pola mobile yang jelas; page padding sekitar 16px.
- **Wide desktop (≥1440px):** lebar konten utama dibatasi sekitar 1440px agar tabel dan teks tidak melebar berlebihan.

### 5.2 Responsive Breakpoints

| Breakpoint | Width | Layout |
|---|---:|---|
| Mobile | <640px | Satu kolom, navigasi mobile. |
| Tablet | 640–1023px | Layout adaptif, sidebar collapsible. |
| Desktop | ≥1024px | Sidebar dan area konten. |
| Wide desktop | ≥1440px | Maksimum lebar konten. |

## 6. Component Design Specifications

### 6.1 Buttons

Types: Primary, Secondary, Outline, Ghost, Danger, Icon Button.

- Standard height: 40px.
- Horizontal padding: 16px.
- Radius: 8px.
- Font size: 14px; weight 600.
- Transition: sekitar 150ms.
- Sizes: Small 32px, Medium 40px, Large 48px.
- Loading state harus terlihat; submit ganda dinonaktifkan.

### 6.2 Input Fields

Types: Text, Password, Email, Tel, Textarea, Select, Search.

- Standard height: 40–44px.
- Border: 1px solid `border`.
- Radius: 8px.
- Padding: 12px.
- Label selalu tampak.
- State: default, focus, invalid, disabled, read-only.
- Password mendukung show/hide dengan accessible label.

### 6.3 Cards

- Background: `surface`.
- Border: 1px solid `border`.
- Radius: 12px.
- Padding: 20px.
- Shadow subtle, tidak berlebihan.
- Use: ringkasan dashboard anggota/pengurus, panel panduan, detail informasi.
- Jangan membuat kartu untuk modul yang belum disetujui.

### 6.4 Status Badge

Variants konseptual:

| Status | Foreground | Background | Label |
|---|---|---|---|
| `pending` | `#A16207` | `#FEF3C7` | Menunggu |
| `aktif` | `#15803D` | `#DCFCE7` | Aktif |
| `nonaktif` | `#B91C1C` | `#FEE2E2` | Nonaktif |

Status harus memiliki teks; warna bukan satu-satunya pembeda.

### 6.5 Navigation

- Desktop: sidebar dengan ikon dan label.
- Mobile: drawer atau mobile navigation dengan label yang terlihat.
- Menu anggota dan pengurus menyesuaikan role.
- Item aktif menggunakan `primary-soft` dan indikator teks/ikon.
- Jangan render menu yang belum memiliki route/fungsi.

### 6.6 Modal / Dialog

- Background putih; radius 12px; max width sekitar 480px; padding 24px.
- Overlay gelap transparan.
- Digunakan untuk konfirmasi perubahan status/hapus jika fitur tersebut ada.
- Aksi destruktif memiliki label eksplisit dan tombol Batal.
- Di mobile, dialog dapat menjadi bottom sheet/full-screen sesuai panjang konten.

### 6.7 Toast / Alert

Types: Success, Error, Warning, Information.

- Desktop: posisi konsisten, misalnya top-right.
- Mobile: posisi tidak menutup kontrol utama.
- Durasi 3–5 detik untuk notifikasi nonkritis.
- Error penting harus tetap dapat dibaca atau dibuka kembali.
- Jangan gunakan toast sebagai satu-satunya cara menampilkan error form.

### 6.8 Tables and Lists

- Header kolom jelas, alignment konsisten.
- Status dan nominal mudah dibaca.
- Pada mobile, daftar anggota/riwayat dapat berubah menjadi card list.
- Data kosong menampilkan empty state.
- Data sensitif seperti NIK harus disamarkan atau tidak ditampilkan jika tidak dibutuhkan.

## 7. Domain Components

### 7.1 Member Summary

- Menampilkan status keanggotaan dan ringkasan simpanan sebagai working assumption FR-04.
- Saldo harus berasal dari data sebenarnya dan memakai format mata uang konsisten.
- Jangan menampilkan nilai dummy sebagai nilai produksi.

### 7.2 Savings History Item

- Menampilkan jenis simpanan, tanggal, nominal, dan keterangan.
- Gunakan format tanggal lokal Indonesia.
- Jenis simpanan tetap ditulis sebagai teks, bukan hanya warna/icon.

### 7.3 Member Management List

- Kolom minimum: nama, nomor anggota bila sudah diberikan, status.
- Detail pribadi tidak ditampilkan pada daftar umum.
- Aksi pengurus mengikuti authorization backend.

## 8. Iconography

Gunakan satu keluarga ikon yang konsisten, misalnya Lucide.

| Area/action | Icon suggestion |
|---|---|
| Beranda | `LayoutDashboard` |
| Anggota | `Users` |
| Simpanan | `Wallet` atau `PiggyBank` |
| Profil | `UserRound` |
| Bantuan | `CircleHelp` |
| Login | `LogIn` |
| Logout | `LogOut` |
| Tambah | `Plus` |
| Edit | `Pencil` |
| Status berhasil | `CircleCheck` |
| Error | `CircleAlert` |

Ukuran standar 20px, kecil 16px, besar 24px. Ikon tindakan harus memiliki accessible label. Jangan gunakan ikon saja untuk menu utama.

## 9. Design Tokens

Simpan token pada satu sumber (CSS variables/theme config) dan jangan menulis nilai warna/spacing acak pada komponen.

```json
{
  "color": {
    "primary": "#176B52",
    "background": "#F8FAFC",
    "surface": "#FFFFFF",
    "textPrimary": "#17212B",
    "textSecondary": "#526170",
    "success": "#15803D",
    "warning": "#A16207",
    "danger": "#B91C1C"
  },
  "radius": {
    "sm": "6px",
    "md": "8px",
    "lg": "12px",
    "full": "999px"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

## 10. Accessibility Guidelines

- Pastikan kontras teks/latar memadai.
- Jangan membedakan status hanya dengan warna.
- Semua field memiliki label dan instruksi yang dapat diakses.
- Fokus keyboard harus terlihat.
- Icon-only button memiliki accessible name.
- Dialog mengelola fokus dan dapat ditutup dengan keyboard sesuai pola aksesibilitas.
- Ukuran target sentuh mobile memadai.
- Jangan menampilkan NIK atau data pribadi secara penuh tanpa kebutuhan.

## 11. Design Consistency Rules

- Reuse komponen sebelum membuat variasi baru.
- Jangan menambah warna utama tanpa persetujuan.
- Gunakan token untuk warna, spacing, radius, dan typography.
- Semua status menggunakan komponen badge yang konsisten.
- Halaman anggota dan pengurus memakai pola navigasi yang konsisten, tetapi item menu tetap berdasarkan role.
- Visualisasi saldo/riwayat tidak boleh memberi kesan data nyata bila data masih demo.
- Token warna hijau bersifat provisional, bukan identitas visual resmi.

**Akhir dokumen — DESIGN-SYSTEM SIMKOPDES v1.1.**
