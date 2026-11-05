# Catatan Verifikasi — JAWS JACKET

Status: katalog menggunakan satu warna tetap per model tanpa pemilih warna.

## Kriteria pemeriksaan
- Katalog menampilkan tepat 20 model sesuai urutan, masing-masing dengan satu warna tetap dan lima ukuran S–XXL.
- Deskripsi, spesifikasi visual, dan warna pada setiap kartu sesuai dengan foto produk yang dipetakan.
- Tidak ada pemilih warna; ilustrasi menunjukkan warna tetap yang juga dicantumkan dalam rincian dan checkout.
- Pencarian model, filter, hasil kosong, dan reset tetap berfungsi.
- Keranjang menggabungkan kombinasi model/ukuran yang sama dan memisahkan ukuran berbeda.
- Checkout memvalidasi biodata, menampilkan ringkasan, lalu membuka draf ke nomor WhatsApp toko.
- Nomor WhatsApp toko terpisah dari nomor yang dimasukkan pelanggan; biodata pelanggan tidak disimpan di localStorage.
- Skema penyimpanan v6 memulihkan item valid, memigrasikan keranjang v5 dengan mempertahankan jumlah, dan menolak data rusak atau pilihan yang tidak dikenal.
- Semua 20 foto katalog memiliki pemetaan model yang benar dan dapat dimuat.
- Tidak ada overflow horizontal pada viewport 320, 360, 768, dan 1280 px.
- Tema hitam dominan dengan aksen merah gelap dan emas serta identitas JAWS JACKET tetap tampil.

## Batas rilis
- Produk, harga dasar, ukuran, dan foto merupakan contoh/demo; foto harus diverifikasi terhadap produk aktual.
- Nomor WhatsApp toko disimpan pada konfigurasi bisnis. Alamat dan jam buka belum dikonfigurasi.
- Stok, ongkos kirim, metode pembayaran, dan kebijakan retur belum disediakan. Tidak ada backend atau pembayaran online.
- Audit aksesibilitas formal, pengujian screen reader/perangkat fisik, dan pengujian hosting produksi belum dilakukan.

Tes unit melalui `npm test` belum dapat dijalankan karena Node.js/npm tidak tersedia pada PATH lingkungan ini. Data pemilik toko tetap perlu diverifikasi sebelum rilis.
