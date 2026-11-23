# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## SIMKOPDES — Penguatan Kendali Akun dan Integrasi Layanan Helpdesk

**Versi:** 2.0  
**Tanggal:** 23 November 2026  
**Status:** Draft — untuk audit aplikasi dan implementasi bertahap  
**Jenis Produk:** Peningkatan pengalaman pengguna aplikasi SIMKOPDES  
**Dasar Penyusunan:** WS1, WS2, WS3, WS5, WS6, WS7, dan WS8

---

## 1. Product Overview

### 1.1 Latar Belakang

SIMKOPDES merupakan aplikasi yang dianalisis dalam rangka mengidentifikasi permasalahan pengalaman pengguna dan menentukan peluang perbaikannya.

Berdasarkan hasil analisis awal pada WS1, ditemukan beberapa masalah pada pengalaman penggunaan aplikasi. Masalah tersebut mencakup keterbatasan kendali pengguna terhadap akun dan data keanggotaan, alur Helpdesk yang mengarahkan pengguna ke aplikasi eksternal, serta integrasi layanan yang belum memberikan pengalaman penggunaan secara konsisten.

Pada bagian pengaturan akun, pengguna tidak menemukan opsi untuk menghapus akun maupun mengajukan perpindahan koperasi atau domisili. Kondisi tersebut berpotensi menyulitkan anggota ketika mengalami perubahan tempat tinggal.

Pada menu bantuan, akses Helpdesk diarahkan ke WhatsApp. Berdasarkan pengamatan dalam WS1, proses tersebut dapat mengalami kendala ketika nomor tujuan belum tersimpan dan memicu peralihan ke SMS. Kondisi ini menyebabkan proses memperoleh bantuan tidak berlangsung secara langsung di dalam aplikasi.

WS2 kemudian merumuskan arah perbaikan melalui Design Challenge yang berfokus pada pemberian kendali manajemen akun secara fleksibel dan integrasi layanan esensial dalam satu ekosistem aplikasi.

Untuk implementasi PRD ini, ruang lingkup pengembangan dipusatkan pada tiga kebutuhan utama: pengelolaan akun dan keanggotaan, pengajuan penghapusan akun, serta Helpdesk internal. Integrasi LMS tidak menjadi bagian dari implementasi pada tahap ini.

Selain itu, terdapat kendala akses aplikasi setelah pembaruan berdasarkan pengalaman pengguna yang disampaikan saat penyusunan PRD. Kendala membuka aplikasi dan proses login perlu ditangani terlebih dahulu agar aplikasi dapat digunakan dan fitur lainnya dapat diuji.

**Batasan informasi:** saat penyusunan PRD ini, aplikasi belum dapat diperiksa kembali secara langsung karena kendala akses setelah pembaruan. Oleh karena itu, daftar halaman dan fungsi yang dijelaskan berdasarkan dokumentasi WS1–WS3 merupakan inventaris sementara. Detail fitur, proses backend, API, database, serta aturan operasional perlu diverifikasi melalui repository dan pemeriksaan aplikasi.

### 1.2 Product Vision

Mewujudkan pengalaman penggunaan SIMKOPDES yang memberikan kendali lebih besar kepada anggota dalam mengelola data keanggotaannya serta menyediakan layanan bantuan yang lebih terintegrasi, sehingga pengguna dapat mengakses layanan koperasi secara mandiri, jelas, dan efisien.

### 1.3 Target Pengguna

**Pengguna utama — Anggota Koperasi KDKMP**

Anggota koperasi yang menggunakan SIMKOPDES untuk mengakses layanan koperasi, memeriksa informasi keanggotaan, memperbarui data diri, dan memperoleh bantuan ketika mengalami kendala.

**Pengguna pendukung — Pengurus Koperasi**

Pengurus koperasi tingkat desa atau kelurahan yang memiliki peran dalam mengelola data keanggotaan, melakukan verifikasi, serta membantu menyelesaikan kebutuhan anggota.

**Stakeholder terkait**

- Manajer koperasi.
- Admin Dinas Koperasi Kabupaten/Kota.
- Kementerian Koperasi.
- Tim pengembang dan pengelola SIMKOPDES.

Pembagian hak akses dan kewenangan setiap pihak harus diverifikasi sebelum implementasi.

---

## 2. User Problem

Berdasarkan hasil identifikasi masalah pada WS1 serta perumusan masalah pada WS2, terdapat tiga permasalahan utama yang menjadi fokus pengembangan.

### 2.1 Keterbatasan Kendali Akun dan Data Keanggotaan

Pada bagian pengaturan akun dan edit profil, ditemukan bahwa aplikasi belum menyediakan opsi untuk menghapus akun maupun mengajukan perpindahan koperasi atau domisili.

Kondisi ini berpotensi menyulitkan anggota ketika berpindah tempat tinggal karena data keanggotaan tidak dapat disesuaikan secara fleksibel melalui aplikasi.

### 2.2 Alur Helpdesk yang Terputus

Pada menu Bantuan, fitur Kontak Helpdesk mengarahkan pengguna ke WhatsApp sebagai aplikasi eksternal. Berdasarkan temuan WS1, proses tersebut dapat mengalami kendala ketika nomor tujuan belum tersimpan dan memicu proses peralihan ke SMS.

Pengguna yang membutuhkan bantuan akhirnya harus meninggalkan aplikasi dan menghadapi langkah tambahan untuk menghubungi pihak terkait.

### 2.3 Kendala Akses Aplikasi dan Login

Berdasarkan ulasan publik yang dianalisis pada WS5, terdapat laporan aplikasi tidak dapat dibuka meskipun telah dicoba instal ulang. Ulasan lainnya menyebutkan bahwa proses login terasa merepotkan.

Selain itu, berdasarkan pengalaman pengguna yang disampaikan ketika penyusunan PRD, pembaruan aplikasi juga diikuti kendala membuka aplikasi dan masuk ke akun.

Masalah akses dan login menjadi hambatan awal yang harus ditangani sebelum pengguna dapat memanfaatkan fitur pengelolaan akun dan Helpdesk.

### Problem Statement

Anggota koperasi KDKMP membutuhkan kendali yang lebih fleksibel terhadap data dan akun keanggotaannya serta layanan bantuan yang terintegrasi di dalam SIMKOPDES karena keterbatasan pengelolaan data dan perpindahan ke aplikasi eksternal dapat menghambat pengguna dalam memperoleh layanan koperasi secara mandiri.

### Sumber Temuan

| Sumber | Temuan | Kontribusi terhadap PRD |
|---|---|---|
| WS1 | Tidak tersedia opsi penghapusan akun dan perpindahan koperasi/domisiI pada bagian pengaturan akun. | Kebutuhan pengelolaan akun dan keanggotaan. |
| WS1 | Kontak Helpdesk mengarahkan pengguna ke WhatsApp dan dapat memicu kendala peralihan ke SMS. | Kebutuhan Helpdesk internal. |
| WS1 | Dashboard memiliki toggle Lite Mode dan ditemukan masalah kepadatan tampilan. | Catatan evaluasi antarmuka, bukan fitur utama PRD. |
| WS2 | Design Challenge menekankan kendali akun dan integrasi layanan dalam satu ekosistem. | Arah utama pengembangan. |
| WS3 | Asumsi pengguna mengharapkan perpindahan domisili, pengelolaan akun, dan bantuan yang lebih terintegrasi. | Dasar awal perumusan kebutuhan. |
| WS5 | Ulasan publik melaporkan kendala akses dan login serta pengalaman positif pada pendaftaran. | Kebutuhan pendukung stabilitas akses dan autentikasi. |
| WS6–WS8 | Menunjukkan kebutuhan akses, login, panduan, dan pemeliharaan pengalaman positif. | Pertimbangan usability dan kebutuhan pendukung. |

---

## 3. User Persona

**Persona utama:** Anggota Koperasi KDKMP

### Karakteristik

- Merupakan anggota koperasi di tingkat desa atau kelurahan.
- Menggunakan SIMKOPDES untuk kebutuhan administrasi dan layanan koperasi.
- Membutuhkan akses terhadap informasi dan data keanggotaan.
- Dapat mengalami perubahan domisili yang memengaruhi keanggotaan koperasi.
- Membutuhkan akses bantuan ketika mengalami kendala.

### Goals

- Mengelola data keanggotaan secara lebih mandiri.
- Mengajukan perubahan domisili atau perpindahan koperasi tanpa kehilangan akses ke akun.
- Memiliki kendali terhadap permintaan penghapusan akun.
- Memperoleh bantuan tanpa harus melalui peralihan aplikasi yang menyulitkan.
- Mengakses aplikasi dengan lancar.

### Pain Points

- Tidak tersedianya opsi perpindahan koperasi atau domisili pada pengaturan akun.
- Tidak tersedianya opsi penghapusan akun.
- Proses memperoleh bantuan diarahkan ke aplikasi eksternal.
- Kendala akses aplikasi dan proses login.

### Needs

- Fasilitas pengajuan perubahan data keanggotaan.
- Mekanisme pengajuan penghapusan akun yang jelas.
- Helpdesk internal yang dapat menghubungkan anggota dengan pihak pengelola.
- Informasi status pengajuan dan laporan.
- Akses aplikasi dan proses login yang dapat diandalkan.

### Persona Pendukung: Pengurus Koperasi

**Karakteristik**

Pengurus koperasi tingkat desa atau kelurahan yang bertugas mendukung pengelolaan data dan layanan anggota.

**Goals**

- Mengelola data keanggotaan secara akurat.
- Memproses permintaan perubahan data anggota.
- Menangani permintaan penghapusan akun sesuai kewenangan.
- Menerima dan menindaklanjuti laporan anggota.

**Needs**

- Informasi pengajuan anggota yang terstruktur.
- Mekanisme verifikasi dan tindak lanjut.
- Daftar laporan Helpdesk yang dapat dikelola.
- Informasi status pekerjaan yang jelas.

**Catatan:** Persona merupakan sintesis dari hasil identifikasi pengguna WS3 dan persona sintetis WS6. Informasi umur, nama individu, serta kemampuan digital spesifik tidak ditambahkan karena tidak tersedia sebagai fakta yang terverifikasi.

---

## 4. Product Goals

Produk memiliki tujuan sebagai berikut:

1. Memberikan kendali lebih fleksibel kepada anggota dalam mengelola data dan status keanggotaannya.
2. Menyediakan mekanisme pengajuan perpindahan domisili atau koperasi.
3. Menyediakan mekanisme pengajuan penghapusan akun yang transparan.
4. Menyediakan layanan Helpdesk internal untuk memudahkan anggota menyampaikan kendala.
5. Mempermudah pengurus dalam menerima dan menindaklanjuti permintaan anggota.
6. Memastikan aplikasi dapat diakses dan proses login dapat berjalan sebelum pengguna menggunakan layanan utama.
7. Mempertahankan kemudahan registrasi anggota dan fungsi aplikasi yang sudah berjalan.

### Success Metrics

| Indikator | Metode Pengukuran | Target Awal |
|---|---|---|
| Keberhasilan membuka aplikasi | Pengujian fungsional pada aplikasi | Baseline ditetapkan setelah perbaikan akses |
| Keberhasilan login | Pengujian skenario login berhasil dan gagal | Pengguna dapat menyelesaikan proses login |
| Pengajuan perubahan domisili | Pengujian penyelesaian alur pengajuan | Pengguna dapat mengirim permintaan tanpa kesalahan |
| Pengajuan penghapusan akun | Pengujian alur pengajuan dan konfirmasi | Pengguna dapat memahami dan mengirim permintaan |
| Penggunaan Helpdesk | Pengujian pengiriman laporan | Laporan dapat diterima oleh sistem |
| Tindak lanjut laporan | Pengujian pembaruan status laporan | Pengguna dapat mengetahui status laporan |
| Kemudahan penggunaan | Usability testing | Pengguna uji dapat menyelesaikan tugas yang diberikan |

Target numerik akan ditentukan setelah baseline dan pengujian awal tersedia. Indikator di atas merupakan usulan pengukuran, bukan hasil implementasi.

---

## 5. Functional Requirements

Functional Requirements dibagi menjadi kebutuhan prasyarat akses dan kebutuhan fitur utama.

### FR-01: Stabilitas Akses Aplikasi

Sistem harus dapat dijalankan oleh pengguna pada platform yang saat ini didukung.

Ketentuan:

- Aplikasi dapat dibuka setelah instalasi atau pembaruan.
- Kegagalan saat membuka aplikasi harus ditangani secara terkendali.
- Sistem tidak boleh menampilkan pesan teknis mentah sebagai satu-satunya informasi kepada pengguna.
- Penyebab masalah akses harus ditelusuri berdasarkan hasil audit teknis.
- Perbaikan tidak boleh menghilangkan fungsi yang telah tersedia.

### FR-02: Login dan Autentikasi

Sistem harus menyediakan proses login yang jelas dan aman.

Ketentuan:

- Label input dan instruksi login harus mudah dipahami.
- Validasi login harus memberikan informasi yang relevan.
- Pesan kesalahan harus menjelaskan tindakan yang dapat dilakukan pengguna.
- Mekanisme autentikasi yang sudah tersedia harus dipertahankan kecuali terdapat alasan teknis dan persetujuan perubahan.
- Autentikasi biometrik tidak menjadi kewajiban implementasi. Opsi ini hanya boleh dipertimbangkan jika didukung sistem, perangkat, dan mekanisme keamanan yang tersedia.

### FR-03: Pengajuan Perubahan Domisili atau Perpindahan Koperasi

Sistem harus menyediakan mekanisme bagi anggota untuk mengajukan perubahan domisili atau perpindahan koperasi.

Ketentuan:

- Anggota dapat mengakses fungsi pengajuan dari bagian pengelolaan akun atau keanggotaan.
- Sistem menyediakan formulir untuk memasukkan informasi perubahan yang diperlukan.
- Sistem memberikan konfirmasi setelah pengajuan berhasil dikirim.
- Sistem mencatat status permohonan.
- Permohonan dapat ditinjau oleh pihak pengelola yang memiliki kewenangan.
- Pengguna dapat mengetahui perkembangan permohonannya.
- Proses pemindahan data tidak boleh menghilangkan identitas dan riwayat keanggotaan tanpa aturan yang telah dikonfirmasi.
- Persyaratan dokumen, verifikasi, dan persetujuan harus mengikuti kebijakan koperasi yang berlaku.

### FR-04: Pengajuan Penghapusan Akun

Sistem harus menyediakan mekanisme bagi pengguna untuk mengajukan penghapusan akun.

Ketentuan:

- Pengguna dapat menemukan opsi pengajuan penghapusan akun pada bagian pengaturan akun.
- Sistem menampilkan penjelasan mengenai konsekuensi penghapusan akun.
- Sistem meminta konfirmasi sebelum permintaan dikirim.
- Sistem memberikan informasi bahwa permintaan telah diterima.
- Permintaan dapat ditinjau atau diproses sesuai kewenangan pengelola.
- Sistem menyediakan informasi status permintaan.
- Penghapusan atau penonaktifan akun harus mengikuti kebijakan pengelolaan data dan kewajiban penyimpanan yang telah dikonfirmasi.

**Catatan:** PRD ini mensyaratkan tersedianya mekanisme pengajuan penghapusan akun. Penghapusan permanen data tidak boleh dilakukan sebelum kebijakan retensi dan kewenangan penghapusan diverifikasi.

### FR-05: Helpdesk Internal

Sistem harus menyediakan sarana bantuan yang dapat digunakan anggota untuk menyampaikan kendala tanpa harus bergantung pada peralihan ke WhatsApp atau SMS sebagai alur utama.

Ketentuan:

- Pengguna dapat mengakses menu Helpdesk dari dalam aplikasi.
- Sistem menyediakan formulir laporan kendala.
- Formulir dapat memuat kategori masalah, deskripsi, dan informasi pendukung yang diperlukan.
- Sistem memberikan konfirmasi setelah laporan berhasil dikirim.
- Laporan diarahkan kepada pengelola atau admin yang relevan berdasarkan data dan kewenangan yang tersedia.
- Laporan tidak boleh dikirim ke pihak yang tidak memiliki kewenangan mengaksesnya.

**Batas implementasi awal:** mekanisme formulir laporan atau ticketing menjadi pilihan awal. Live chat real-time hanya diterapkan apabila dukungan backend dan operasionalnya telah diverifikasi.

### FR-06: Pemantauan Status Helpdesk

Sistem harus memungkinkan pengguna mengetahui perkembangan laporan yang telah dikirim.

Ketentuan:

- Setiap laporan memiliki identitas atau nomor referensi.
- Sistem mencatat status laporan.
- Pengguna dapat melihat status laporan miliknya.
- Pengurus atau admin dapat memperbarui status sesuai kewenangan.
- Perubahan status harus tercermin pada informasi yang dilihat pengguna.

Status awal yang diusulkan:

1. Dikirim.
2. Sedang Ditinjau.
3. Sedang Ditangani.
4. Selesai.
5. Ditolak atau Tidak Dapat Diproses, disertai alasan.

Status tersebut merupakan usulan awal dan perlu disesuaikan dengan alur operasional pengelola.

### FR-07: Mempertahankan Registrasi Anggota

Sistem harus mempertahankan proses registrasi anggota yang telah dinilai mudah berdasarkan ulasan WS5.

Ketentuan:

- Fungsi registrasi yang sudah tersedia tidak boleh dihilangkan akibat perubahan.
- Label dan instruksi tetap mudah dipahami.
- Validasi harus berjalan sesuai implementasi saat ini.
- Perubahan pada registrasi harus diuji agar tidak menyebabkan regresi.

### FR-08: Navigasi dan Panduan Pengguna

Sistem perlu menyediakan navigasi dan instruksi yang mudah dipahami.

Ketentuan:

- Menu pengelolaan akun dan Helpdesk harus mudah ditemukan.
- Istilah yang digunakan harus familiar bagi anggota.
- Instruksi harus disampaikan secara ringkas.
- Panduan kontekstual dapat disediakan pada bagian yang membutuhkan penjelasan.
- Perubahan tampilan tidak boleh menghilangkan fungsi yang sudah tersedia.

---

## 6. Non-Functional Requirements

### NFR-01: Usability

- Proses pengajuan perubahan data dan penghapusan akun harus mudah dipahami.
- Formulir laporan Helpdesk harus sederhana.
- Informasi status pengajuan harus mudah ditemukan.
- Instruksi dan pesan kesalahan menggunakan bahasa yang jelas.

### NFR-02: Reliability

- Data pengajuan dan laporan harus tersimpan secara konsisten.
- Sistem harus menangani kegagalan pengiriman data.
- Pengguna tidak boleh mendapatkan konfirmasi berhasil apabila permintaan sebenarnya gagal disimpan.
- Perubahan tidak boleh merusak fungsi yang sudah berjalan.

### NFR-03: Security

- Pengguna hanya dapat melihat dan mengelola permintaan miliknya sendiri.
- Pengurus hanya dapat mengakses permintaan sesuai kewenangannya.
- Informasi pribadi anggota harus dilindungi.
- Mekanisme penghapusan akun harus mengikuti kebijakan pengelolaan data.
- Akses ke laporan Helpdesk harus dibatasi sesuai peran.

### NFR-04: Compatibility

- Perubahan harus mempertahankan kompatibilitas dengan platform yang saat ini didukung aplikasi.
- Tampilan harus tetap dapat digunakan pada ukuran layar yang didukung.
- Detail kompatibilitas harus diperiksa melalui konfigurasi dan dokumentasi repository.

### NFR-05: Maintainability

- Implementasi mengikuti struktur dan pola kode repository yang tersedia.
- Perubahan tidak boleh mengganti framework atau arsitektur tanpa alasan dan persetujuan.
- Fungsi baru perlu memiliki pengujian yang relevan.
- Dokumentasi perubahan harus dipelihara pada repository.

---

## 7. Business Rules

Aturan berikut merupakan usulan awal dan harus dikonfirmasi dengan pihak pengelola sebelum diterapkan.

1. Perubahan domisili atau perpindahan koperasi harus melalui mekanisme verifikasi sesuai kebijakan keanggotaan.
2. Pengajuan perpindahan tidak boleh langsung mengubah status keanggotaan sebelum proses yang diwajibkan selesai.
3. Identitas anggota dan riwayat keanggotaan harus dipertahankan sesuai kebijakan pengelolaan data.
4. Penghapusan akun memerlukan konfirmasi pengguna dan mengikuti aturan retensi data yang berlaku.
5. Permintaan penghapusan akun tidak boleh otomatis menghapus data yang masih wajib disimpan berdasarkan ketentuan yang berlaku.
6. Laporan Helpdesk hanya dapat diakses oleh pemilik laporan dan pengelola yang memiliki kewenangan.
7. Setiap laporan Helpdesk harus memiliki status yang dapat ditelusuri.
8. Perubahan status laporan hanya dapat dilakukan oleh pengelola yang berwenang.
9. Pengguna harus memperoleh konfirmasi ketika pengajuan atau laporan berhasil diterima sistem.
10. Registrasi anggota dan fungsi aplikasi yang sudah tersedia harus tetap berjalan setelah implementasi.

---

## 8. User Stories

**US-01: Mengajukan Perubahan Domisili**

Sebagai anggota koperasi, saya ingin mengajukan perubahan domisili atau perpindahan koperasi melalui aplikasi agar data keanggotaan saya dapat disesuaikan tanpa harus membuat akun baru.

**US-02: Memproses Perubahan Keanggotaan**

Sebagai pengurus koperasi, saya ingin meninjau permohonan perpindahan anggota agar perubahan data dapat diproses sesuai kewenangan dan kebijakan koperasi.

**US-03: Mengajukan Penghapusan Akun**

Sebagai anggota koperasi, saya ingin mengajukan penghapusan akun melalui pengaturan aplikasi agar saya memiliki kendali terhadap penggunaan akun dan data pribadi saya.

**US-04: Mengirimkan Laporan Helpdesk**

Sebagai anggota koperasi, saya ingin menyampaikan kendala melalui Helpdesk internal agar dapat memperoleh bantuan tanpa harus berpindah ke aplikasi eksternal.

**US-05: Memantau Laporan Helpdesk**

Sebagai anggota koperasi, saya ingin melihat status laporan yang telah dikirim agar mengetahui perkembangan penanganan kendala saya.

**US-06: Menangani Laporan Anggota**

Sebagai pengurus koperasi, saya ingin menerima dan mengelola laporan anggota agar kendala dapat ditindaklanjuti secara terpusat.

**US-07: Mengakses Aplikasi dan Login**

Sebagai pengguna SIMKOPDES, saya ingin membuka aplikasi dan masuk melalui proses yang jelas agar dapat menggunakan layanan koperasi tanpa hambatan akses.

**US-08: Mendaftar sebagai Anggota**

Sebagai calon anggota koperasi, saya ingin menyelesaikan proses pendaftaran melalui alur yang mudah dipahami agar dapat menjadi anggota tanpa kebingungan.

---

## 9. Scope

### In Scope

**Prioritas P0 — Prasyarat akses**

- Pemeriksaan dan perbaikan kendala membuka aplikasi setelah pembaruan.
- Pemeriksaan dan perbaikan proses login.
- Pengujian akses pada platform yang didukung.

**Prioritas P1 — Fitur utama**

- Pengajuan perubahan domisili atau perpindahan koperasi.
- Pengajuan penghapusan akun.
- Helpdesk internal berbasis formulir atau ticketing.
- Pemantauan status laporan Helpdesk.
- Pengelolaan permintaan anggota oleh pengurus sesuai kewenangan.

**Prioritas P2 — Pengalaman pendukung**

- Mempertahankan fungsi registrasi anggota.
- Memperjelas navigasi dan label menu.
- Menyediakan panduan sederhana untuk kebutuhan pengguna.
- Mempertahankan fitur aplikasi yang sudah berjalan dan tidak terdampak oleh perubahan.

### Out of Scope

- Integrasi Corporate University atau LMS ke dalam aplikasi.
- Pengembangan fitur SSO untuk LMS.
- Pembuatan dashboard penyimpanan uang atau dashboard saldo baru.
- Pengembangan modul transaksi keuangan atau simpan pinjam baru.
- Penggantian total backend, database, framework, dan arsitektur aplikasi.
- Pengembangan live chat real-time apabila backend dan kebutuhan operasionalnya belum tersedia.
- Penambahan modul bisnis koperasi lain yang tidak menjadi bagian Design Challenge.
- Penghapusan data anggota secara permanen tanpa kebijakan dan persetujuan yang jelas.

**Catatan:** Dashboard pengurus yang telah tercatat dalam WS1 merupakan bagian dari inventaris pengamatan aplikasi, bukan persetujuan untuk membangun dashboard keuangan baru.

---

## 10. Assumptions & Dependencies

### Assumptions

1. Anggota koperasi membutuhkan mekanisme untuk mengajukan perubahan domisili atau perpindahan koperasi tanpa harus kehilangan akses ke akun.
2. Anggota membutuhkan pilihan untuk mengajukan penghapusan akun secara transparan.
3. Pengguna mengharapkan menu Kontak Helpdesk dapat digunakan untuk menyampaikan laporan secara langsung melalui aplikasi.
4. Pengurus koperasi memiliki peran dalam memproses permintaan perubahan data dan menangani laporan anggota sesuai kewenangannya.
5. Fitur registrasi dan fungsi utama yang telah tersedia perlu dipertahankan.
6. Detail mekanisme pengajuan, proses verifikasi, dan kebijakan penghapusan akun masih perlu divalidasi.

Asumsi tersebut berasal dari WS3 dan tidak boleh dianggap sebagai fakta operasional sebelum dikonfirmasi.

### Dependencies

- Repository dan dokumentasi aplikasi SIMKOPDES.
- Sistem autentikasi yang saat ini digunakan.
- Backend dan database yang menyimpan data akun serta keanggotaan.
- Data pengurus/admin koperasi dan mekanisme pemetaan anggota ke pengelola terkait.
- Kebijakan perubahan domisili atau perpindahan koperasi.
- Kebijakan penghapusan akun dan retensi data.
- Backend atau layanan yang mendukung penyimpanan dan pengelolaan laporan Helpdesk.
- Lingkungan pengujian dan perangkat yang didukung aplikasi.

---

## 11. Expected Deliverables

Implementasi PRD diharapkan menghasilkan:

1. Hasil audit repository dan inventaris fungsi aplikasi yang sudah tersedia.
2. Perbaikan kendala membuka aplikasi dan proses login.
3. Fasilitas pengajuan perubahan domisili atau perpindahan koperasi.
4. Mekanisme peninjauan permohonan oleh pengurus atau admin yang berwenang.
5. Fasilitas pengajuan penghapusan akun.
6. Mekanisme pemrosesan permintaan penghapusan sesuai kebijakan.
7. Formulir Helpdesk internal untuk mengirimkan laporan.
8. Halaman atau bagian untuk melihat status laporan Helpdesk.
9. Fungsi pengelolaan laporan bagi pengurus/admin sesuai kewenangan.
10. Registrasi anggota dan fungsi existing yang terdampak tetap berjalan.
11. Pengujian fungsional dan pengujian pengalaman pengguna untuk alur yang diubah.
12. Dokumentasi implementasi dan riwayat perubahan di repository/GitHub.

Bentuk halaman, posisi menu, dan komponen antarmuka mengikuti struktur aplikasi yang sudah ada. PRD ini tidak menetapkan pembangunan dashboard atau modul baru di luar kebutuhan tersebut.

---

## 12. Product Acceptance Criteria

Implementasi dapat dinyatakan memenuhi kebutuhan apabila:

1. Aplikasi dapat dibuka pada lingkungan dan perangkat yang didukung.
2. Pengguna dapat menjalankan proses login dengan mekanisme autentikasi yang tersedia.
3. Pengguna dapat mengajukan perubahan domisili atau perpindahan koperasi.
4. Permintaan perubahan keanggotaan dapat diterima dan ditinjau oleh pihak yang berwenang.
5. Pengguna dapat mengajukan penghapusan akun melalui aplikasi.
6. Sistem memberikan informasi dan konfirmasi yang jelas terkait proses penghapusan akun.
7. Mekanisme penghapusan mengikuti kebijakan pengelolaan dan retensi data yang telah dikonfirmasi.
8. Pengguna dapat menyampaikan laporan melalui Helpdesk internal.
9. Laporan yang dikirim dapat diterima dan ditangani oleh pengelola yang berwenang.
10. Pengguna dapat melihat status laporan yang telah dikirim.
11. Pengurus dapat memperbarui status laporan sesuai kewenangan.
12. Registrasi anggota yang sudah tersedia tetap berjalan.
13. Fitur existing yang tidak termasuk perubahan tetap berfungsi.
14. Tidak terdapat regresi kritis pada akses, login, registrasi, dan fungsi aplikasi yang terdampak.
15. Hasil pengujian, file yang diubah, dan keterbatasan implementasi dicatat pada repository/GitHub.

---

# Lampiran A. Pemetaan Kebutuhan ke Sumber Worksheet

| Kebutuhan PRD | Sumber | Hubungan |
|---|---|---|
| Perubahan domisili/perpindahan koperasi | WS1, WS2, WS3 | Masalah kendali akun dan asumsi perpindahan data keanggotaan. |
| Pengajuan penghapusan akun | WS1, WS2 | Tidak tersedianya opsi penghapusan akun dan kebutuhan kendali data pengguna. |
| Helpdesk internal | WS1, WS2, WS3 | Alur bantuan yang terputus dan asumsi kebutuhan bantuan langsung di dalam aplikasi. |
| Stabilitas akses aplikasi | WS5, WS6, WS7, WS8, serta laporan pengguna saat penyusunan PRD | Kendala membuka aplikasi menjadi hambatan sebelum menggunakan layanan. |
| Kejelasan login | WS5, WS6, WS7, WS8 | Login dinilai merepotkan oleh salah satu pengulas. |
| Registrasi anggota | WS5 dan WS8 | Pendaftaran dinilai mudah sehingga perlu dipertahankan. |
| Panduan dan navigasi | WS5, WS6, WS7, WS8 | Kebutuhan mendukung pengguna dengan pengalaman digital yang beragam. |

# Lampiran B. Inventaris Sementara Fitur Aplikasi

Inventaris berikut hanya mencakup fungsi atau halaman yang tercatat dalam pengamatan WS1–WS3. Daftar ini bukan inventaris lengkap aplikasi.

| Area aplikasi | Kondisi yang tercatat | Tindakan dalam PRD |
|---|---|---|
| Dashboard pengurus | Terdapat dashboard dan toggle Lite Mode; tampilan dinilai memiliki masalah kepadatan. | Audit dan pertahankan fungsi yang tersedia. Tidak membangun dashboard keuangan baru. |
| Pengaturan akun dan edit profil | Tidak ditemukan opsi penghapusan akun dan perpindahan koperasi/domisiI dalam pengamatan WS1. | Menjadi fokus pengembangan pengelolaan akun. |
| Menu Bantuan / Kontak Helpdesk | Mengarahkan pengguna ke WhatsApp dan dapat memicu peralihan ke SMS. | Menjadi dasar pengembangan Helpdesk internal. |
| Corporate University / LMS | Mengarahkan pengguna ke browser eksternal dan memerlukan login ulang; terdapat masalah informasi ketersediaan kelas. | Tidak termasuk scope implementasi saat ini. |
| Registrasi anggota | Dinilai mudah berdasarkan ulasan publik. WS1 juga mencatat proses pendaftaran melibatkan verifikasi e-KTP dan wajah oleh admin. | Pertahankan fungsi dan validasi yang tersedia. Detail alur harus diverifikasi. |

**Penting:** jangan menambahkan fitur lain hanya karena diasumsikan lazim pada aplikasi koperasi. Semua fitur yang belum tercatat harus ditemukan melalui audit aplikasi atau repository terlebih dahulu.

# Lampiran C. Instruksi Implementasi untuk Coding Agent

1. Lakukan audit repository sebelum melakukan perubahan kode. Identifikasi framework, bahasa pemrograman, struktur folder, routing, autentikasi, API, database, dan cara menjalankan aplikasi.
2. Periksa masalah aplikasi setelah pembaruan. Bedakan kegagalan aplikasi saat dibuka dengan kegagalan saat proses login.
3. Buat inventaris halaman dan fitur existing berdasarkan kode dan aplikasi yang tersedia.
4. Cocokkan inventaris hasil audit dengan Lampiran B. Laporkan bagian yang masih tersedia, berubah, atau tidak ditemukan.
5. Jangan membuat dashboard penyimpanan uang, dashboard saldo, modul keuangan, atau fitur lain yang tidak ditentukan dalam scope PRD.
6. Prioritaskan pemulihan akses dan login sebelum menguji alur fitur utama.
7. Implementasikan tiga kebutuhan utama: perubahan domisili/perpindahan koperasi, pengajuan penghapusan akun, dan Helpdesk internal.
8. Periksa kebutuhan admin/pengurus sebelum menentukan alur persetujuan atau pengelolaan permintaan.
9. Verifikasi aturan bisnis dan kebijakan penghapusan data. Jangan melakukan penghapusan permanen tanpa dasar kebijakan.
10. Gunakan formulir/ticketing sebagai pendekatan awal Helpdesk. Jangan mengklaim terdapat live chat real-time apabila belum didukung sistem.
11. Jangan memasukkan integrasi LMS sebagai bagian implementasi PRD ini.
12. Pertahankan framework, backend, database, dan pola arsitektur existing kecuali terdapat alasan teknis yang jelas dan persetujuan perubahan.
13. Tambahkan pengujian pada alur berhasil, gagal, validasi input, hak akses, dan status permintaan.
14. Catat pekerjaan yang terhambat oleh dependensi backend atau kebijakan yang belum dikonfirmasi.
15. Dokumentasikan perubahan melalui commit, Pull Request, atau changelog GitHub. Sertakan file yang diubah, alasan perubahan, hasil pengujian, dan pekerjaan yang belum selesai.

---

# Riwayat Perubahan PRD

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 23 November 2026 | Draft awal berdasarkan WS6–WS8 dengan fokus akses dan login. |
| 1.1 | 23 November 2026 | Penyesuaian struktur berdasarkan contoh PRD. |
| 2.0 | 23 November 2026 | Perubahan arah produk agar berfokus pada Design Challenge WS2: kendali akun/keanggotaan dan Helpdesk internal. Integrasi LMS dikeluarkan dari scope. Stabilitas akses dan login ditetapkan sebagai prasyarat implementasi. Ditambahkan inventaris fitur sementara berdasarkan WS1–WS3 dan instruksi audit repository untuk mencegah penambahan fitur yang tidak terverifikasi. |

**End of PRD SIMKOPDES v2.0**