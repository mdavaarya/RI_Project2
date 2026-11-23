# INTERACTION SPECIFICATION

**Project:** SIMKOPDES — Usulan Peningkatan Pengalaman Akses dan Penggunaan  
**Version:** 1.1  
**Status:** Draft untuk implementasi awal  
**References:** PRD SIMKOPDES v1.1; UX-SPEC.md; DESIGN-SYSTEM.md; FEATURE-LIST-DATA-MODEL.md

## 1. Interaction Overview

### 1.1 Objective

Mendefinisikan perilaku interaksi untuk akses aplikasi, login, pendaftaran, fitur utama anggota, area pengurus, navigasi, dan panduan SIMKOPDES agar implementasi konsisten, dapat diprediksi, aman, serta mencerminkan hasil backend.

### 1.2 Interaction Principles

- **Immediate feedback:** setiap aksi penting memberi respons.
- **Predictability:** pola kontrol serupa memiliki perilaku serupa.
- **Error prevention:** validasi dan konfirmasi mencegah kesalahan.
- **User control:** pengguna dapat kembali/membatalkan sebelum perubahan disimpan.
- **State consistency:** perubahan profil/anggota/simpanan tercermin pada halaman terkait.
- **Persistence:** data penting disimpan di Supabase, bukan hanya state komponen.
- **Security and privacy:** hak akses dijaga melalui RLS dan pesan tidak membocorkan data sensitif.

## 2. Global Interaction Behavior

### 2.1 Navigation

| Action | Expected behavior |
|---|---|
| Buka Login | Menampilkan form login. |
| Buka Pendaftaran | Menampilkan form pendaftaran publik. |
| Buka Beranda Anggota | Membuka dashboard anggota jika sesi dan status mengizinkan. |
| Buka Riwayat Simpanan | Menampilkan data simpanan milik anggota yang login. |
| Buka Profil | Menampilkan profil akun/anggota sesuai izin. |
| Buka Dashboard Pengurus | Hanya dapat dibuka oleh role pengurus yang tervalidasi. |
| Buka Kelola Anggota | Hanya dapat dibuka oleh role yang memiliki kewenangan. |
| Buka Bantuan | Menampilkan panduan yang tersedia. |
| Kembali | Mengembalikan ke konteks sebelumnya tanpa membuat route buntu. |
| Logout | Mengakhiri sesi melalui Supabase Auth dan mengarahkan ke area publik. |

Aturan:

- Item aktif diberi indikator visual dan atribut aksesibilitas yang sesuai.
- Menu anggota dan pengurus tidak boleh saling terbuka hanya dengan mengganti URL.
- Jangan menampilkan tautan ke fitur yang belum aktif.
- Jangan menyimpan password, token, atau secret di URL maupun log.

### 2.2 Global Loading

- Tampilkan loading ketika memeriksa sesi, memuat data, atau mengirim form.
- Gunakan skeleton jika struktur kontennya sudah diketahui.
- Jangan menyatakan data terbaru sebelum request selesai.
- Nonaktifkan tombol submit selama request berjalan.
- Retry hanya untuk operasi yang aman diulang.

### 2.3 Global Error Handling

| Kondisi | Pesan contoh |
|---|---|
| Gagal memuat data | “Informasi belum dapat dimuat. Periksa koneksi, lalu coba lagi.” |
| Gagal login | “Login belum berhasil. Periksa informasi masuk Anda, lalu coba kembali.” |
| Gagal mendaftar | “Pendaftaran belum dapat dikirim. Periksa data dan koneksi, lalu coba kembali.” |
| Sesi berakhir | “Sesi Anda telah berakhir. Silakan masuk kembali.” |
| Tidak memiliki akses | “Anda tidak memiliki akses ke halaman ini.” |
| Simpanan kosong | “Belum ada riwayat simpanan untuk ditampilkan.” |
| Gagal memperbarui profil | “Perubahan profil belum berhasil disimpan.” |

Jangan menampilkan stack trace, query SQL, JWT, kredensial, atau pesan internal mentah. Detail teknis hanya dicatat secara aman di log.

## 3. Startup and Access Interaction (FR-01)

### 3.1 State Model

| State | Expected behavior |
|---|---|
| Initial | Render shell minimal. |
| Loading | Tampilkan loading sesi/konfigurasi/data awal. |
| Ready / unauthenticated | Arahkan ke Login atau area publik. |
| Ready / authenticated | Verifikasi role dan status lalu arahkan ke halaman yang sah. |
| Recoverable error | Tampilkan pesan nonteknis dan aksi yang relevan. |
| Unrecoverable startup failure | Jangan mengklaim dapat dipulihkan dari UI; perlu diagnosis teknis. |

### 3.2 Retry Rules

- Retry digunakan untuk pemuatan data atau request idempotent.
- Jangan mengulang submit pendaftaran tanpa memeriksa hasil request sebelumnya bila statusnya tidak diketahui.
- Retry tidak boleh membuat akun/permohonan ganda.
- Tampilkan feedback sesudah retry.

## 4. Login Interaction (FR-02)

### 4.1 Trigger and Flow

1. Pengguna membuka halaman Login.
2. Sistem menampilkan identitas login yang sesuai metode backend yang telah dipilih.
3. Pengguna mengisi Username/Nomor Anggota (sesuai konfigurasi) dan Password.
4. Sistem memvalidasi field kosong dan format yang dapat diperiksa di client.
5. Pengguna menekan Masuk; tombol berubah ke state loading.
6. Sistem mengirim autentikasi melalui Supabase Auth atau adapter server yang disetujui.
7. Jika berhasil, sistem memuat sesi, role, dan status anggota sebelum menentukan route.
8. Jika gagal, sistem menampilkan pesan aman dan mempertahankan identitas login (bukan password).

### 4.2 Field Behavior

| Field | Interaction | Validation |
|---|---|---|
| Username/Nomor Anggota | Text input | Wajib; format mengikuti kebijakan nomor/username. |
| Password | Password input | Wajib; tidak boleh dicatat di log. |
| Show/hide password | Toggle | Hanya mengubah visibilitas, bukan isi field. |
| Masuk | Submit button | Loading dan disabled selama request. |
| Lupa password | Link/action | Menggunakan email terdaftar jika pemulihan email dikonfigurasi. |

### 4.3 Supabase Identity Constraint

Supabase Auth tidak menerima arbitrary username/nomor anggota sebagai credential native. Bila UI wajib menggunakan nomor anggota, implementasi memerlukan pemetaan server-side yang aman ke identitas Auth atau mekanisme auth khusus yang disetujui.

- Jangan melakukan query dari browser untuk mencari email berdasarkan nomor anggota.
- Jangan mengirim password ke fungsi yang tidak tepercaya.
- Jangan membedakan pesan “nomor tidak ditemukan” dan “password salah” jika dapat memfasilitasi enumerasi akun.
- Jika strategi identitas belum diputuskan, tandai integrasi login nomor anggota sebagai **Blocked**; jangan membuat login palsu.

### 4.4 Password Recovery

- Tampilkan aksi Lupa Password hanya jika email terhubung dengan akun dan konfigurasi email Supabase aktif.
- `supabase.auth.resetPasswordForEmail(email, options)` mengirim alur pemulihan; UI hanya menyatakan instruksi dikirim jika request diterima.
- Jangan mengirim email reset berdasarkan tebakan nomor anggota dari client.
- Pesan UI tetap generik untuk menjaga privasi akun.

## 5. Registration Interaction (FR-03)

### 5.1 Form Fields — Working Assumption

| Field | Type | Required in working form | Rule |
|---|---|---:|---|
| Nama | Text | Ya | Trim; tidak boleh kosong. |
| NIK | Text | Ya | 16 digit numerik; simpan sebagai text agar leading zero aman. |
| Alamat | Textarea | Ya | Tidak boleh kosong; batas karakter ditetapkan implementasi. |
| Nomor HP | Tel | Ya | Normalisasi format sebelum disimpan. |
| Email | Email | Ya | Format valid; dipakai untuk Auth/recovery jika dikonfigurasi. |
| Password | Password | Ya | Ikuti kebijakan Supabase Auth; tidak disimpan manual. |

Field di atas berasal dari working assumption Feature List & Data Model. Sebelum production, pemilik produk harus mengonfirmasi field pribadi yang benar-benar diperlukan, dasar pengumpulan, siapa yang dapat melihat, dan kebijakan retensi.

### 5.2 Registration Flow

1. Calon anggota membuka Pendaftaran.
2. Sistem menampilkan field dan petunjuk.
3. Pengguna mengisi dan meninjau data.
4. Sistem melakukan validasi client untuk format dasar.
5. Pengguna menekan Daftar.
6. Tombol disabled selama request; sistem mencegah submit ganda.
7. Supabase Auth membuat akun sesuai konfigurasi. Data profil/anggota dibuat melalui proses aman yang konsisten.
8. UI menampilkan status yang benar berdasarkan respons backend.

### 5.3 Registration Status

Status `pending`, `aktif`, dan `nonaktif` tersedia dalam model anggota kerja, tetapi arti alur transisi belum final.

- Jangan auto-activate atau menunggu approval secara sepihak.
- Sampai DEC-02 diputuskan, tandai approval workflow sebagai **Blocked**.
- Jangan memberi akses halaman anggota hanya karena akun Auth berhasil dibuat; periksa status anggota.
- Jangan menyebut pendaftaran disetujui jika backend hanya mengonfirmasi akun dibuat.

### 5.4 Form States

| State | Behavior |
|---|---|
| Default | Form kosong dan label terlihat. |
| Focus | Fokus jelas. |
| Invalid | Pesan error dekat field; data lain dipertahankan. |
| Submitting | Tombol loading/disabled. |
| Success | Konfirmasi berdasarkan hasil backend; bersihkan form sesuai hasil. |
| Error | Tampilkan pesan; pertahankan input non-sensitif. |

## 6. Member Main Features Interaction (FR-04 — Working Assumption)

### 6.1 Member Dashboard

- Sistem memuat profil/status dan ringkasan simpanan dari database.
- Saldo tidak boleh dihitung dari data contoh atau nilai hardcoded.
- Rumus agregasi saldo harus konsisten dengan definisi transaksi simpanan yang disepakati.
- Jika data belum tersedia, tampilkan empty state.
- Klik kartu/tautan riwayat membuka halaman Riwayat Simpanan.

### 6.2 Savings History

- Hanya transaksi milik anggota yang sedang login yang ditampilkan.
- Tampilkan jenis `pokok`, `wajib`, `sukarela`, nominal, tanggal, dan keterangan bila tersedia.
- Urutan default terbaru lebih dahulu.
- Jangan menyediakan tambah/edit/hapus transaksi kepada anggota kecuali kewenangan tersebut diputuskan.
- Jika tidak ada data, tampilkan pesan kosong yang informatif.

### 6.3 Member Profile

- Data profil dimuat dari `profiles` dan `members`.
- Field sensitif tidak ditampilkan penuh kecuali diperlukan.
- Edit hanya field yang diizinkan. Nomor anggota/status tidak boleh diubah bebas oleh anggota.
- Perubahan disimpan ke backend dan feedback mengikuti respons aktual.

### 6.4 Loan History (Optional)

- Tidak tampil sebagai menu aktif kecuali keputusan pinjaman disetujui.
- Placeholder tidak boleh memalsukan status pinjaman atau cicilan.
- Jangan membuat workflow pengajuan, bunga, approval, pencairan, atau pembayaran.

## 7. Manager Interaction (Working Assumption)

### 7.1 Manager Dashboard

- Hanya role `pengurus` tervalidasi yang dapat membuka dashboard.
- Ringkasan jumlah anggota/status dihitung dari database.
- Aktivitas terbaru hanya ditampilkan bila data aktivitas memang tersedia.
- Jangan menambahkan metrik finansial tanpa requirement.

### 7.2 Manage Members

- Daftar anggota dibatasi berdasarkan kewenangan pengurus.
- Detail hanya menampilkan data yang diperlukan untuk tugas pengurus.
- NIK/alamat/no. HP dibatasi dan tidak ditampilkan berlebihan.
- Aksi approve/reject hanya tersedia setelah kebijakan dan role policy ditetapkan.
- Setelah perubahan, sistem menyimpan status dan memperbarui daftar berdasarkan respons backend.

### 7.3 Role Assignment

- Pengguna publik tidak dapat memilih role `pengurus` atau `admin`.
- Role pengurus diberikan melalui proses server/owner yang aman.
- Role `admin` optional/blocked sampai keputusan terpisah.

## 8. Guidance and Navigation Interaction (FR-05)

- Menu bantuan membuka FAQ/panduan yang relevan.
- Tooltip/context hint dapat dibuka dan ditutup tanpa kehilangan input form.
- Panduan menggunakan langkah berurutan dan bahasa sehari-hari.
- Panduan tidak boleh menjelaskan fitur yang belum tersedia.
- Jika konten tidak ada, tampilkan empty state; jangan tautkan ke halaman kosong.

## 9. Data Consistency and Persistence

Perubahan berikut harus tercermin setelah backend mengonfirmasi:

- Pendaftaran: status pengajuan dan profil/anggota.
- Profil: data profil yang diizinkan.
- Simpanan: ringkasan dashboard dan riwayat.
- Pengelolaan anggota: daftar, status, dan ringkasan pengurus.
- Session: route dan menu berdasarkan status autentikasi/role.

Gunakan state/query cache sebagai cerminan data, bukan penyimpanan utama. Data harus tetap tersedia setelah reload dan login kembali. Terapkan invalidation/refetch secara konsisten setelah mutasi.

## 10. Security Interaction Rules

- Aktifkan dan uji RLS untuk semua tabel `public`.
- Pastikan anggota A tidak dapat membaca data anggota B meskipun mengubah URL/ID request.
- Pastikan role pengurus tidak dapat ditetapkan dari browser.
- Service-role key hanya boleh digunakan pada lingkungan server yang aman, tidak di frontend.
- Password ditangani Supabase Auth.
- Jangan simpan token, password, atau NIK utuh di log.
- Validasi di server/database tetap diperlukan; validasi client bukan boundary keamanan.

## 11. Empty and Error State Interaction

| Page | Condition | Message/action |
|---|---|---|
| Dashboard anggota | Belum ada simpanan | Empty state; tautkan ke riwayat bila tepat. |
| Riwayat simpanan | Tidak ada transaksi | “Belum ada transaksi simpanan untuk ditampilkan.” |
| Profil | Data optional tidak tersedia | Tampilkan “Belum diisi” bila aman; jangan isi dummy. |
| Dashboard pengurus | Tidak ada aktivitas | “Belum ada aktivitas terbaru.” |
| Kelola anggota | Tidak ada anggota/permohonan | Tampilkan pesan sesuai status data. |
| Panduan | Konten tidak tersedia | “Panduan untuk bagian ini belum tersedia.” |
| Mutasi gagal | Backend menolak/timeout | Data lama tetap ditampilkan; tampilkan error yang dapat dipahami. |

## 12. Responsive Interaction

- Mobile: form satu kolom; aksi utama mudah dijangkau; tabel menjadi kartu/list bila perlu.
- Tablet: navigasi dapat diciutkan; tabel dapat digeser hanya jika tidak ada alternatif yang lebih baik.
- Desktop: sidebar dan tabel daftar anggota/riwayat dapat digunakan.
- Hindari horizontal overflow, kontrol terlalu kecil, dan dialog yang terpotong.

## 13. Interaction Completion Rules

Interaksi dinyatakan selesai apabila:

1. Aksi diproses oleh UI dan backend bila memerlukan penyimpanan.
2. Hasil aktual ditampilkan kepada pengguna.
3. Data terkait diperbarui secara konsisten.
4. Tidak ada submit ganda atau duplikasi.
5. Error dapat dipahami dan ditangani.
6. Hak akses tetap terjaga.

## 14. Open Decisions

| ID | Keputusan | Dampak |
|---|---|---|
| INT-01 | Identitas login: email/HP/nomor anggota dan strategi mapping | Auth, form login, recovery. |
| INT-02 | Status pendaftaran: otomatis aktif atau pending approval | Gate akses anggota dan menu pengurus. |
| INT-03 | Field pendaftaran final | Validasi, privasi, skema data. |
| INT-04 | Kewenangan membuat/mengoreksi transaksi simpanan | RLS dan UI. |
| INT-05 | Pinjaman masuk rilis awal atau tidak | Navigasi dan skema opsional. |
| INT-06 | Pemberian role pengurus/admin | Keamanan dan administrasi akun. |

**Akhir dokumen — INTERACTION-SPEC SIMKOPDES v1.1.**
