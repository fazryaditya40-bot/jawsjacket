# JAWS JACKET — Toko Jaket Outdoor

Website katalog jaket outdoor menggunakan HTML, CSS, dan JavaScript murni. Tidak memakai proses build atau dependensi runtime.

## Menjalankan lokal

```bash
python3 -m http.server 5500 --bind 127.0.0.1
```

Buka http://localhost:5500. Gunakan server HTTP karena aplikasi memakai ES modules.

## Fitur

- 20 model sesuai katalog; setiap model memiliki satu warna tetap dan ukuran S–XXL.
- Pencarian model, filter model, keranjang berdasarkan model/ukuran, kontrol jumlah, subtotal, dan total produk.
- Checkout melalui draf WhatsApp tujuan toko; pengunjung mengisi nama, nomor WhatsApp, dan alamat opsional.
- Data keranjang tersimpan di localStorage; biodata pelanggan tidak disimpan di browser.
- Deskripsi, spesifikasi visual, dan warna katalog dicocokkan dengan masing-masing dari 20 foto di `assets/images/jackets/`.
- Informasi FAQ, kontak, tampilan responsif, dan dukungan keyboard.

Harga, warna tetap, ukuran, deskripsi, dan foto merupakan contoh. Harga model menggunakan harga dasar katalog tunggal. Checkout membuka draf WhatsApp untuk diperiksa dan dikirim sendiri oleh pelanggan; situs tidak memproses pembayaran atau terhubung ke stok.

## Konfigurasi toko

Edit `js/config.js` untuk nama, nomor WhatsApp tujuan pesanan dalam format internasional digit saja, alamat, dan jam buka. Nomor pelanggan diisi terpisah pada formulir checkout dan tidak disimpan. Tombol WhatsApp membuka tab baru; tombol salin rincian tersedia bila WhatsApp gagal dibuka. Perbarui data katalog di `js/data.js` dan merek di `index.html` sebelum peluncuran.

## Pengujian dan paket

```bash
npm test
python3 scripts/package_site.py
```

Paket publik dibuat di `artifacts/jaws-jacket-shop.zip`. Dokumentasi dan tes tidak disertakan.

Panduan: [instruction.md](instruction.md), kebutuhan: [prd.md](prd.md), teknologi: [tech_stack.md](tech_stack.md), arsitektur: [arsitektur.md](arsitektur.md), desain: [ui.ux.md](ui.ux.md), verifikasi: [verification.md](verification.md).
