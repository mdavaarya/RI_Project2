-- Seed Data for SIMKOPDES FAQ and Help Content (FR-05)
INSERT INTO public.help_contents (halaman_terkait, judul, konten, urutan_tampil)
VALUES
(
    'login',
    'Cara Masuk ke Akun SIMKOPDES',
    'Masukkan alamat email yang telah Anda daftarkan dan kata sandi Anda. Pastikan tidak ada kesalahan pengetikan huruf besar atau kecil. Jika Anda lupa kata sandi, gunakan tautan "Lupa Kata Sandi" untuk meminta tautan pemulihan.',
    1
),
(
    'pendaftaran',
    'Syarat dan Langkah Pendaftaran Anggota Baru',
    'Calon anggota diminta mengisi Nama Lengkap, NIK 16 digit, Alamat Domisili, Nomor HP, Email aktif, dan Kata Sandi. Setelah pengiriman, permohonan Anda akan tercatat dengan status Menunggu (Pending) untuk verifikasi pengurus.',
    2
),
(
    'dashboard_anggota',
    'Memahami Status Keanggotaan dan Saldo Simpanan',
    'Halaman beranda anggota menampilkan status keanggotaan Anda (Menunggu, Aktif, atau Nonaktif) serta ringkasan akumulasi saldo simpanan pokok, simpanan wajib, dan simpanan sukarela.',
    3
),
(
    'riwayat_simpanan',
    'Memeriksa Riwayat Transaksi Simpanan',
    'Pada menu Riwayat Simpanan, Anda dapat melihat daftar seluruh transaksi simpanan beserta jenis simpanan, nominal rupiah, tanggal transaksi, dan keterangan transaksi.',
    4
),
(
    'profil',
    'Pengelolaan Informasi Profil Anggota',
    'Halaman profil menampilkan informasi pribadi Anda. Nomor anggota dan status keanggotaan ditetapkan oleh koperasi dan tidak dapat diubah sendiri demi keamanan data.',
    5
),
(
    'kelola_anggota',
    'Panduan Pengurus: Kelola dan Verifikasi Anggota',
    'Pengurus koperasi dapat melihat daftar permohonan pendaftaran anggota, memeriksa kelengkapan data, serta memverifikasi status keanggotaan.',
    6
)
ON CONFLICT DO NOTHING;
