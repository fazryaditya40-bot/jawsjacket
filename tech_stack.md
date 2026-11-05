# Teknologi — JAWS JACKET

| Lapisan | Teknologi |
|---|---|
| Markup | HTML5 semantik |
| Gaya | CSS3, Grid/Flexbox, media queries |
| Browser logic | JavaScript ES modules tanpa framework |
| Katalog | Data lokal terstruktur pada `js/data.js` |
| Keranjang | localStorage dengan validasi dan sanitasi |
| Pemesanan | Validasi biodata dan draf tautan WhatsApp, tanpa SDK |
| Hosting | Hosting berkas statis HTTPS |
| Server lokal | Python `http.server` |
| Tes | Node.js built-in test runner |

Tidak ada backend, API, database, pembayaran, atau dependensi runtime. Stok dan ongkos kirim harus dikonfirmasi manual oleh toko. Data lokal bukan sumber transaksi yang otoritatif.

## Kompatibilitas dan keamanan
Target browser modern. Konten dinamis dirender melalui DOM API/textContent; validasi input dilakukan sebelum membuat draf. Jangan memasukkan biodata pelanggan ke localStorage/log atau menyimpan rahasia di frontend. Nomor WhatsApp toko yang digunakan sebagai tujuan draf merupakan konfigurasi publik.

## Menjalankan dan menguji
```bash
python3 -m http.server 5500 --bind 127.0.0.1
npm test
```
Website memakai ES modules dan perlu dijalankan melalui HTTP, bukan `file://`.
