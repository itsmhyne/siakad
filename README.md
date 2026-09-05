1. 🏠 Beranda (Dashboard Utama)
Menu pertama yang dilihat saat login. Isinya berbeda tergantung siapa yang masuk:

Admin: Statistik total siswa, jumlah guru, grafik kehadiran hari ini (dari alat RFID), dan pengumuman.

Guru: Jadwal mengajar hari ini dan daftar kelas.

Siswa: Ringkasan nilai, peringatan tunggakan SPP (jika ada), dan jadwal pelajaran hari ini.

2. 🗄️ Data Master (Khusus Admin)
Ini adalah "Jantung" SIAKAD. Menu ini harus dibuat pertama kali karena menu lain tidak bisa berjalan tanpa data di sini.

Profil Sekolah: Nama, alamat, logo, dan nama kepala sekolah.

Tahun Ajaran & Semester: Sangat krusial! (Misal: Ganjil 2026/2027). Semua data akademik harus terikat ke sini.

Data Guru & Staf: Biodata, NIP, dan penugasan.

Data Siswa: Biodata lengkap, NIS, NISN, dan pendaftaran UID Kartu RFID.

Data Mata Pelajaran: Daftar pelajaran (Matematika, Bahasa Inggris, dll).

Data Ruangan/Kelas: Daftar ruang fisik (Ruang 101, Lab Komputer).

3. 📚 Akademik & Jadwal
Bagian ini mengatur kegiatan operasional sekolah.

Manajemen Kelas (Rombel): Menu untuk memasukkan siswa-siswa ke dalam kelas tertentu (misal: Siswa A masuk kelas X-IPA 1).

Jadwal Pelajaran: Pembuatan jadwal yang menghubungkan Guru + Mata Pelajaran + Kelas + Jam + Ruangan.

Pindah Kelas / Kenaikan Kelas: Fitur untuk menaikkan siswa secara massal saat pergantian tahun ajaran.

4. 📟 Kehadiran & Absensi (Integrasi IoT)
Karena kamu menggunakan alat scanner kartu, menu ini akan menjadi fitur unggulan SIAKAD-mu.

Monitor Tap Real-time: Halaman untuk melihat siswa yang baru saja tap kartu di gerbang (sangat bagus dibuat real-time di Next.js).

Absensi Mata Pelajaran: Absensi manual oleh guru di dalam kelas (untuk mencocokkan apakah siswa yang tap di gerbang benar-benar masuk kelas).

Rekap Kehadiran: Laporan bulanan (Hadir, Sakit, Izin, Alpa) yang bisa di- export ke Excel atau PDF.

5. 📝 Penilaian & E-Rapor
Ini biasanya modul yang paling rumit karena menyesuaikan kurikulum pemerintah (seperti Kurikulum Merdeka).

Bobot Penilaian: Pengaturan persentase nilai (Tugas 30%, UTS 30%, UAS 40%).

Input Nilai: Menu bagi guru untuk memasukkan nilai per kelas.

Cetak Rapor: Halaman untuk menghasilkan dokumen PDF rapor resmi yang siap diprint atau diunduh oleh wali murid.

(Opsional) Menu Ekspansi di Masa Depan
Jika 5 modul utama di atas sudah selesai dan berjalan lancar, kamu bisa menambahkan menu tambahan ini untuk menaikkan "harga jual" atau utilitas SIAKAD-mu:

💰 Keuangan & SPP: Menu tagihan bulanan, pencatatan pembayaran (kasir sekolah), dan cetak kuitansi.

📢 Pengumuman / Mading Digital: Fitur untuk menyebarkan informasi libur atau acara sekolah ke dashboard siswa dan guru.

⚙️ Pengaturan Sistem: Manajemen hak akses pengguna (User Role Management), backup database, dan pengaturan API IoT (seperti manajemen perangkat RFID).