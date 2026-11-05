# Product Requirement Document — JAWS JACKET

Status: MVP toko statis berjalan lokal. Merek, produk, harga, stok, kontak, dan kebijakan yang tampil adalah data demonstrasi dan harus diverifikasi pemilik toko sebelum peluncuran.

## Visi
Memudahkan pelanggan menjelajahi 20 model jaket, memilih ukuran, mengisi biodata pesanan, lalu membuka draf checkout melalui WhatsApp toko.

## Cakupan MVP
- Halaman beranda, katalog jaket, cara belanja, FAQ, informasi toko, dan footer.
- Katalog berisi 20 model sesuai urutan: Bomber, Denim, Hoodie, Varsity, Parka, Windbreaker, Jaket Kulit, Biker, Coach, Harrington, Puffer, Fleece, Blazer, Trench Coat, Track Jacket, Cardigan, Raincoat, Flannel, Safari, dan Sherpa.
- Setiap model memiliki satu warna tetap dan pilihan ukuran S, M, L, XL, dan XXL.
- Pencarian model dan filter berdasarkan model jaket.
- Keranjang yang membedakan model dan ukuran; jumlah 1–99; subtotal; serta total produk.
- Satu harga dasar dan warna tetap per model.
- Form biodata pelanggan dan ringkasan pesanan sebelum membuka draf WhatsApp tujuan toko.
- Penyimpanan keranjang pada localStorage, desain responsif, dan interaksi keyboard.

## Di luar MVP
Akun, panel admin, stok real-time, kalkulasi ongkir otomatis, pembayaran online, pemrosesan pesanan server, dan penyimpanan transaksi. Harga dan stok harus diperbarui pada berkas sumber serta dikonfirmasi toko.

## Aturan bisnis
- Mata uang rupiah; harga satuan adalah bilangan bulat positif dan tidak berulang per hari.
- Item keranjang ditentukan oleh kombinasi model dan ukuran.
- Produk identik dengan model dan ukuran sama digabung; ukuran berbeda menjadi baris terpisah.
- Total produk = harga katalog × jumlah. Ongkos kirim dan biaya lain tidak dihitung.
- Batas jumlah teknis 1–99 bukan indikator stok.
- Nomor WhatsApp toko adalah tujuan draf; nomor WhatsApp pelanggan diisi secara terpisah oleh pelanggan.
- Nama, nomor pelanggan, dan alamat hanya digunakan untuk membuat draf WhatsApp, tidak disimpan ke localStorage.
- Membuka draf bukan konfirmasi atau bukti pesanan diterima; pengguna harus mengirimkannya sendiri.
- Jangan menampilkan klaim stok tersedia, testimoni, alamat, atau kebijakan yang belum dikonfirmasi.

## Alur utama
Beranda → cari/filter → pilih model dan ukuran → tambah ke keranjang → atur jumlah → isi biodata → periksa ringkasan → buka dan kirim draf WhatsApp → toko mengonfirmasi stok, ongkir, dan pembayaran manual.

## Kriteria penerimaan
- Pencarian dan filter bekerja bersama; hasil kosong dapat di-reset.
- Tampil tepat 20 model sesuai urutan yang ditentukan, masing-masing dengan warna tetap dan lima ukuran.
- Ukuran berbeda menjadi baris keranjang terpisah; model dan ukuran sama digabung.
- Tidak ada pemilih warna; warna yang ditampilkan mengikuti warna tetap pada katalog dan ilustrasi.
- Keranjang kosong dan model/ukuran atau jumlah tidak valid ditolak dengan pesan jelas.
- Total dapat dihitung ulang hanya dari data katalog dan kuantitas.
- Draf berisi nama pelanggan, nomor pelanggan, alamat bila diisi, model, ukuran, jumlah, dan total.
- Nomor tujuan draf adalah nomor toko yang dikonfigurasi, tidak diambil dari biodata pelanggan.
- Form checkout tidak mengisi biodata otomatis dan data pelanggan tidak masuk ke localStorage.
- Reload memulihkan item keranjang valid; data skema sebelumnya mempertahankan model, ukuran, dan jumlah sambil mengabaikan pilihan warna lama.
- Data rusak atau localStorage yang ditolak tidak merusak katalog.
- Nama dan kontak tidak masuk ke localStorage.
- Tidak ada gulir horizontal pada lebar 320 px; kontrol dapat dioperasikan dengan keyboard.

## Dependensi dan risiko
Harga dan detail produk adalah contoh, foto harus dicocokkan dengan produk aktual, dan katalog tidak tersambung ke stok. Toko harus mengatur nomor usaha, memastikan kebijakan ukuran/retur dan pembayaran, lalu menguji rilis.
