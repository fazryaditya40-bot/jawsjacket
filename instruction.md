# Panduan Pengembangan — JAWS JACKET

## Jalankan
```bash
python3 -m http.server 5500 --bind 127.0.0.1
```
Buka `http://localhost:5500`; server HTTP diperlukan untuk ES modules.

## Data toko sebelum rilis
1. Identitas toko saat ini JAWS JACKET; sesuaikan bila pemilik menetapkan identitas lain di `index.html` dan `js/config.js`.
2. Atur `BUSINESS.whatsapp` sebagai nomor tujuan toko dalam format internasional digit saja; jangan masukkan nomor pelanggan di konfigurasi.
3. Isi alamat dan jam buka yang telah diverifikasi.
4. Perbarui `js/data.js` dengan 20 model sesuai urutan katalog, satu warna tetap per model, ukuran, satu harga dasar, deskripsi, spesifikasi, dan stok yang benar. Situs demo tidak mengelola stok aktual.
5. Pastikan foto produk di `assets/images/jackets/` cocok dengan model terkait, berizin untuk digunakan, dan memiliki alt text yang akurat.
6. Konfirmasikan syarat ukuran/retur, pengiriman, ongkir, dan pembayaran; perbarui FAQ serta informasi toko.

## Aturan implementasi
- Harga disimpan sebagai integer rupiah pada katalog dan dihitung dari jumlah.
- Identitas item keranjang adalah ID model + ukuran; harga dan warna katalog tidak disimpan pada item keranjang.
- localStorage hanya boleh berisi ID model, ukuran, jumlah, dan versi skema.
- Biodata pelanggan di formulir hanya dipakai untuk draf WhatsApp, tidak disimpan; nomor tujuan harus berasal dari konfigurasi toko, bukan input pelanggan.
- Render data dinamis melalui DOM API/textContent; jangan interpolasi input ke `innerHTML`.
- Tautan WhatsApp hanya draf. Pengguna mengirim pesan sendiri, dan toko mengonfirmasi pesanan secara manual.

## Pemeriksaan
```bash
npm test
python3 scripts/package_site.py
```
Sebelum rilis periksa pencarian/filter, warna tetap, pilihan ukuran, perubahan jumlah, total, validasi checkout, pengiriman draf ke nomor toko yang tepat, pemulihan keranjang setelah reload, ukuran 320/360/768/1280 px, keyboard, aset, dan error console. Pastikan biodata tidak masuk ke localStorage.

## Paket statis
`python3 scripts/package_site.py` membuat `artifacts/jaws-jacket-shop.zip` yang hanya memuat HTML, CSS, JavaScript, logo, dan ilustrasi runtime. Tinjau paket lokal sebelum mengunggah ke hosting statis HTTPS.
