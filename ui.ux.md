# Panduan UI/UX — JAWS JACKET

## Arah desain
Tampilan tegas dan premium untuk toko jaket outdoor. Identitas merek menggunakan hitam sebagai warna dominan, merah gelap untuk aksi utama, serta emas sebagai aksen. Seluruh antarmuka berbahasa Indonesia; nama toko adalah JAWS JACKET.

## Struktur halaman
Header dan keranjang → hero → katalog → keranjang → cara belanja → FAQ → kontak dan footer. Desktop memakai kolom katalog dan keranjang; layar kecil menumpuknya secara vertikal.

## Perjalanan pengguna
| Tahap | Respons antarmuka |
|---|---|
| Menemukan produk | Pencarian, filter 20 model jaket, ilustrasi, harga |
| Memilih produk | Lihat warna tetap model dan pilih ukuran S–XXL |
| Menyusun belanja | Keranjang, jumlah, hapus barang, subtotal dan total |
| Memeriksa | Isi biodata dan tinjau ringkasan pesanan |
| Konfirmasi | Buka draf WhatsApp tujuan toko dan kirim secara manual |

## Komponen dan keadaan
- Navigasi anchor, skip link, focus-visible, dan indikator jumlah barang.
- Katalog menampilkan 20 model sesuai urutan permintaan: Bomber, Denim, Hoodie, Varsity, Parka, Windbreaker, Jaket Kulit, Biker, Coach, Harrington, Puffer, Fleece, Blazer, Trench Coat, Track Jacket, Cardigan, Raincoat, Flannel, Safari, dan Sherpa.
- Setiap model memiliki satu harga dasar, warna tetap, deskripsi, dan spesifikasi.
- Setiap model memakai foto produk yang sesuai; deskripsi, spesifikasi visual, dan warna tetap mengikuti detail yang tampak pada foto. Tidak ada pemilih warna.
- Pemilih ukuran S, M, L, XL, dan XXL tersedia pada tiap model.
- Kartu produk menampilkan kategori, nama model, deskripsi, spesifikasi, warna tetap, harga satuan, pemilih ukuran, dan tombol tambah.
- Search/filter memiliki jumlah hasil dan reset ketika tidak ada hasil.
- Keranjang menampilkan nama model, warna tetap, ukuran, serta jumlah 1–99; kontrol tambah/kurang, hapus, subtotal, dan total. Kombinasi model/ukuran yang berbeda menjadi baris berbeda.
- Form kontak membutuhkan nama (2–80 karakter) dan nomor WhatsApp pelanggan yang dinormalisasi. Alamat pengiriman opsional dan maksimum 240 karakter.
- Nomor WhatsApp tujuan toko terpisah dari nomor yang diisi pelanggan.
- Perubahan keranjang/kontak membatalkan pemeriksaan ringkasan.
- Biodata hanya dimasukkan ke draf setelah pelanggan meninjau checkout; biodata tidak disimpan di browser.
- Informasikan bahwa total belum termasuk ongkir dan stok serta pembayaran menunggu konfirmasi.

## Aksesibilitas
- `lang="id"`, landmark semantik, satu `h1`, heading berurutan, label untuk setiap input.
- Error terkait ke field dan fokus diarahkan ke kesalahan pertama.
- Tombol dan select native, dapat digunakan dengan keyboard; perubahan keranjang diumumkan melalui status.
- Target sentuh minimal 44 px, kontras dan fokus terlihat, alt/label ilustrasi tersedia.
- Periksa reflow 320 CSS px, zoom 200%, reduced motion, serta screen reader sebelum klaim kepatuhan.

## Arah visual
- **Hitam dominan:** latar halaman `#080808`, header dan panel hitam/arang, permukaan kartu `#171719`.
- **Merah gelap:** aksi utama `#86131C`; hover lebih gelap `#5F0B12`.
- **Emas:** aksen merek, fokus, label, dan harga `#D9B45B`.
- **Teks:** putih gading `#F5F0E5` dan sekunder `#C2B9A8` untuk keterbacaan di permukaan gelap.
- Logo JAWS JACKET tampil di hero dengan dasar hitam. Foto produk katalog tampil pada kartu produk; tiap model mempertahankan satu warna tetap.
- Font sistem, fokus keyboard emas, serta keadaan error tetap jelas. Hindari teks emas kecil pada latar terang.
