1. Identitas
Nama Lengkap: Lionel liauw
Kelas: XII RPL

Nomor Absen: 9

Mata Pelajaran: PPLG

2. Tema Proyek
Tema: Game Store

Judul Aplikasi: Game store 

3. Tujuan Proyek
Aplikasi ini dibangun untuk mengatasi kendala pencatatan penjualan manual yang rentan kesalahan hitung dan selisih stok. Tujuan utamanya adalah mengotomatisasi pencatatan transaksi kasir secara real-time, mengelola data stok barang/menu secara terpusat, memvalidasi input data pengguna, serta menyajikan rekapitulasi laporan penjualan yang akurat.

4. Fitur Aplikasi


Manajemen Data (CRUD): Tambah, lihat detail, perbarui, dan hapus data master (produk/menu dan kategori).

Pencarian & Filter Data: Pencarian cepat data barang berdasarkan nama produk dan filter berdasarkan kategori.

Transaksi Utama (Lintas Tabel): Form transaksi kasir/pemesanan yang otomatis menghubungkan data pelanggan, tabel transaksi, dan rincian item, serta otomatis memotong stok barang.

Validasi Form & Notifikasi: Validasi input wajib terisi, validasi format angka/harga, serta notifikasi visual alert sukses/gagal.

Laporan & Ringkasan: Rekapitulasi total pendapatan, riwayat transaksi, dan pemantauan stok barang menipis.

5. Teknologi yang Digunakan
Bahasa Pemrograman: JavaScript

Database: MySQL 

Antarmuka (Frontend): HTML5, CSS3, Bootstrap 5 (Responsive Layout)

Web Server & Environment: Apache (XAMPP / Laragon)

Version Control: Git & GitHub

6. Struktur Database
Database terdiri dari minimal 3 tabel relasional:

kategori: Menyimpan kategori barang (id_kategori [PK], nama_kategori).

produk: Menyimpan master data barang (id_produk [PK], id_kategori [FK], nama_produk, harga, stok).

transaksi: Menyimpan nota induk transaksi (id_transaksi [PK], kode_invoice, tanggal, total_harga, bayar, kembalian).

detail_transaksi: Menyimpan item rincian transaksi (id_detail [PK], id_transaksi [FK], id_produk [FK], jumlah, subtotal).
1. Pastikan Node.js dan XAMPP (MySQL) sudah terpasang di komputer.
2. Buka XAMPP Control Panel lalu aktifkan modul Apache dan MySQL.
3. Buka browser ke http://localhost/phpmyadmin, buat database baru, lalu import file .sql yang sudah disediakan.
4. Buka terminal (CMD / Git Bash) di dalam folder utama proyek ini.
5. Jalankan perintah instalasi dependensi:
   npm install
6. Jalankan aplikasi dengan perintah:
   npm start
   (atau: node pplg/app.js)
7. Buka browser dan akses aplikasi melalui URL:
   http://localhost:3000

8. Kendala dan Solusi Perbaikan
Kendala 1: Terjadi galat saat memproses transaksi karena data pada tabel rincian (detail_transaksi) gagal disimpan akibat foreign key tidak menemukan ID induk transaksi yang baru dibuat.

Perbaikan: Menggunakan fungsi mysqli_insert_id() (atau lastInsertId()) segera setelah eksekusi simpan ke tabel induk transaksi, lalu ID tersebut dioper ke query perulangan item rincian.

Kendala 2: Stok barang tidak berkurang otomatis setelah nota transaksi berhasil dicetak.

Perbaikan: Menambahkan query UPDATE produk SET stok = stok - ? WHERE id_produk = ? di dalam alur logika loop pemrosesan transaksi.

9.Penggunaan AI dan Referensi Eksternal
Bagian yang Dibantu: AI dan referensi dokumentasi web digunakan dalam pembuatan template dasar CSS/Bootstrap, optimasi query relasi lintas tabel (INNER JOIN), serta pembuatan skema struktur tabel database (ERD).

Verifikasi dan Pengujian: Seluruh kode hasil bantuan disesuaikan secara manual dengan struktur variabel proyek, diuji koneksinya pada phpMyAdmin, dan diverifikasi melalui skenario uji langsung pada browser untuk memastikan tidak ada pesan error (zero error).
