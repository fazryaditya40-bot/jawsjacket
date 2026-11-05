# Arsitektur — JAWS JACKET

## Bentuk sistem
Frontend statis satu halaman. HTML/CSS/JavaScript dan aset lokal disajikan dari hosting statis. Katalog, warna tetap, serta harga bersumber dari `js/data.js`; localStorage hanya menyimpan model, ukuran, dan jumlah. Checkout memvalidasi biodata di memori dan membuka draf WhatsApp ke nomor toko.

## Modul aplikasi
```text
index.html
css/styles.css
js/
  config.js       Identitas, nomor tujuan WhatsApp, dan informasi toko
  data.js         20 model jaket, pemetaan nama file foto, warna dan satu harga tetap, kategori, dan ukuran
  app.js          Render, interaksi, dan state halaman
  cart.js         Perhitungan harga dan manipulasi keranjang
  storage.js      Sanitasi serta penyimpanan keranjang
  checkout.js     Validasi biodata dan pembentukan draf WhatsApp
assets/images/    Logo merek dan foto produk di jackets/ yang dipetakan ke model katalog
```

## Model keranjang
```json
{
  "schemaVersion": 6,
  "items": [
    { "productId": "cardigan", "size": "M", "quantity": 2 }
  ]
}
```
Harga dan warna tidak disimpan; total dihitung ulang dari model di katalog. Data kontak tidak disimpan. Kunci browser `jaws-jacket:cart:v6`; keranjang v5 dimigrasikan tanpa pilihan warna lama.

## Alur perubahan keranjang
Validasi model, ukuran, dan jumlah → ubah state → hitung harga dari katalog terkini → render ulang → simpan whitelist ke localStorage. Jika storage gagal, pertahankan state halaman dan umumkan kegagalan.

## Alur checkout
Validasi item dan biodata pelanggan → tampilkan ringkasan → bentuk pesan berisi detail pesanan dan nomor pelanggan → buka `api.whatsapp.com/send` pada tab baru ke nomor tujuan toko setelah klik pengguna. Biodata hanya berada di memori halaman dan URL draf; tidak disimpan di localStorage. Tombol salin menyediakan cadangan jika WhatsApp tidak dapat dibuka. Tidak ada pembayaran, pencatatan transaksi, atau klaim pesanan terkonfirmasi.

## Batas kepercayaan
Frontend/localStorage tidak membuktikan stok atau pembayaran. Nomor tujuan toko di `config.js` berbeda dengan nomor pelanggan dalam formulir. Pengguna memeriksa dan mengirim sendiri draf pesan.
