import { money, quote, validCartItem, validQuantity } from './cart.js?v=13';
import { BUSINESS } from './config.js?v=14';

export function normalizePhone(value) {
  const source = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(source)) return '';
  const digits = source.replace(/[\s()+-]/g, '');
  if (!/^\d{8,15}$/.test(digits)) return '';
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return /^\d{8,15}$/.test(normalized) ? normalized : '';
}

export const validBusinessNumber = (value) => typeof value === 'string' && /^[1-9]\d{7,14}$/.test(value);

export function validateCheckout(items, contact) {
  if (!items.length) return { field: 'cart-heading', message: 'Tambahkan jaket sebelum melanjutkan pesanan.' };
  for (const item of items) {
    if (!validCartItem(item.productId, item.size) || !validQuantity(item.quantity)) {
      return { field: 'cart-heading', message: 'Periksa kembali model, ukuran, dan jumlah produk di keranjang.' };
    }
  }
  const name = contact.name.trim();
  if (name.length < 2 || name.length > 80 || /[\r\n]/.test(name)) {
    return { field: 'customer-name', message: 'Isi nama 2–80 karakter dalam satu baris.' };
  }
  if (!normalizePhone(contact.phone)) {
    return { field: 'customer-phone', message: 'Isi nomor WhatsApp Anda yang valid, 8–15 digit. Awalan 08 atau 62 diperbolehkan.' };
  }
  if (contact.address.trim().length > 240 || /[\r\n]/.test(contact.address)) {
    return { field: 'customer-address', message: 'Alamat maksimal 240 karakter dalam satu baris.' };
  }
  return null;
}

export function buildMessage(items, contact) {
  const estimate = quote(items);
  return [
    `Halo ${BUSINESS.name}, saya ingin memesan jaket.`,
    `Nama: ${contact.name.trim()}`,
    `WhatsApp pelanggan: ${normalizePhone(contact.phone)}`,
    `Alamat pengiriman: ${contact.address.trim() || 'Akan dikonfirmasi'}`,
    '',
    ...estimate.lines.map((line) => `• ${line.name} — warna ${line.color.name} (${line.specification}), ukuran ${line.size} × ${line.quantity} = ${money(line.subtotal)}`),
    '',
    `Total produk: ${money(estimate.total)}`,
    'Mohon konfirmasi ketersediaan model, ukuran, ongkos kirim, dan metode pembayaran. Pesanan belum diproses sebelum dikonfirmasi.',
  ].join('\n');
}

export function buildWhatsAppUrl(number, items, contact) {
  if (!validBusinessNumber(number)) throw new Error('Nomor WhatsApp toko belum tersedia.');
  const error = validateCheckout(items, contact);
  if (error) throw new Error(error.message);
  const params = new URLSearchParams({
    phone: number,
    text: buildMessage(items, contact),
  });
  return `https://api.whatsapp.com/send?${params}`;
}
