import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { CATEGORIES, PRODUCTS, SIZES, filterProducts } from '../js/data.js';
import { itemKey, quote, setQuantity, validQuantity } from '../js/cart.js';
import { emptyState, loadState, sanitizeState, saveState, STORAGE_KEY, LEGACY_STORAGE_KEY } from '../js/storage.js';
import { BUSINESS } from '../js/config.js';
import { buildMessage, buildWhatsAppUrl, normalizePhone, validBusinessNumber, validateCheckout } from '../js/checkout.js';

const items = () => [
  { productId: 'cardigan', size: 'M', quantity: 2 },
  { productId: 'hoodie', size: 'L', quantity: 1 },
];

test('20 jacket model descriptions and colors match their mapped product photos', () => {
  const expected = [
    'Bomber', 'Denim', 'Hoodie', 'Varsity', 'Parka', 'Windbreaker', 'Jaket Kulit', 'Biker',
    'Coach', 'Harrington', 'Puffer', 'Fleece', 'Blazer', 'Trench Coat', 'Track Jacket',
    'Cardigan', 'Raincoat', 'Flannel', 'Safari', 'Sherpa',
  ];
  assert.deepEqual(PRODUCTS.map((product) => product.name), expected);
  assert.equal(PRODUCTS.length, 20);
  assert.equal(CATEGORIES.length, 21);
  assert.deepEqual(PRODUCTS.map((product) => product.category), CATEGORIES.slice(1).map((entry) => entry.id));
  for (const product of PRODUCTS) {
    assert.deepEqual(product.sizes, SIZES);
    assert.ok(product.color.name && product.color.hex.startsWith('#'));
    assert.ok(product.image && /^[\w .-]+\.(?:avif|jfif|jpe?g|webp)$/.test(product.image));
    await assert.doesNotReject(access(new URL(`../assets/images/jackets/${product.image}`, import.meta.url)));
    assert.equal('colors' in product, false);
    assert.equal('defaultColorId' in product, false);
    assert.ok(product.description && product.specification && product.price > 0);
    assert.equal('variants' in product, false);
  }
  assert.equal(filterProducts('double zipper', 'hoodie').length, 0);
  assert.equal(filterProducts('panel jahitan melengkung', 'hoodie').length, 1);
  assert.equal(PRODUCTS.find((product) => product.id === 'cardigan').color.name, 'Navy');
  assert.equal(PRODUCTS.find((product) => product.id === 'bomber-jacket').color.name, 'Black');
  assert.equal(PRODUCTS.find((product) => product.id === 'varsity-jacket').color.name, 'Sage');
  assert.equal(PRODUCTS.find((product) => product.id === 'coach-jacket').color.name, 'Burgundy');
  assert.equal(filterProducts('cardigan', 'cardigan').length, 1);
  assert.equal(filterProducts('sand', 'all').length, 0);
  assert.equal(filterProducts('', 'all').length, 20);
});

test('store WhatsApp destination is separate from buyer contact details', () => {
  assert.equal(BUSINESS.whatsapp, '62895340665371');
  assert.equal(validBusinessNumber(BUSINESS.whatsapp), true);
});

test('cart groups matching model and size; other sizes stay separate', () => {
  let cart = setQuantity([], 'cardigan', 'M', 1);
  cart = setQuantity(cart, 'cardigan', 'M', 2);
  cart = setQuantity(cart, 'hoodie', 'M', 1);
  cart = setQuantity(cart, 'cardigan', 'L', 1);
  assert.equal(cart.length, 3);
  assert.equal(itemKey(cart[0]), 'cardigan:M');
  assert.equal(quote(items()).total, 1087000);
  assert.equal(quote(items()).units, 3);
  assert.deepEqual(quote(items()).lines.map((line) => line.color.name), ['Navy', 'Black']);
  for (const value of [0, -1, 1.5, 100, NaN, '2']) {
    assert.throws(() => setQuantity(cart, 'cardigan', 'M', value), RangeError);
  }
  assert.throws(() => setQuantity(cart, 'unknown', 'M', 1), RangeError);
  assert.throws(() => setQuantity(cart, 'cardigan', 'XS', 1), RangeError);
  assert.equal(validQuantity(99), true);
});

test('storage only persists product, size and quantity; corrupt storage recovers', () => {
  assert.equal(STORAGE_KEY, 'jaws-jacket:cart:v6');
  const values = new Map();
  const storage = {
    setItem: (key, value) => values.set(key, value),
    getItem: (key) => values.get(key),
    removeItem: (key) => values.delete(key),
  };
  assert.ok(saveState({ ...emptyState(), items: items(), name: 'Private', phone: '081234567890' }, () => storage));
  assert.equal(values.get(STORAGE_KEY).includes('Private'), false);
  assert.equal(values.get(STORAGE_KEY).includes('081234567890'), false);
  assert.deepEqual(loadState(() => storage).state.items, items());
  assert.equal(loadState(() => ({ getItem: () => '{bad' })).failed, true);
  assert.equal(loadState(() => { throw Error('denied'); }).failed, true);
  assert.equal(saveState({ items: items() }, () => { throw Error('quota'); }), false);
  assert.deepEqual(sanitizeState({ schemaVersion: 5, items: items() }), emptyState());
});

test('legacy color selections migrate to fixed model colors without losing cart quantities', () => {
  const values = new Map([[LEGACY_STORAGE_KEY, JSON.stringify({
    schemaVersion: 5,
    items: [
      { productId: 'cardigan', colorId: 'cream', size: 'M', quantity: 2 },
      { productId: 'cardigan', colorId: 'sand', size: 'M', quantity: 3 },
      { productId: 'hoodie', colorId: 'charcoal', size: 'L', quantity: 1 },
    ],
  })]]);
  const storage = {
    setItem: (key, value) => values.set(key, value),
    getItem: (key) => values.get(key),
    removeItem: (key) => values.delete(key),
  };
  const loaded = loadState(() => storage);
  assert.equal(loaded.failed, false);
  assert.deepEqual(loaded.state.items, [
    { productId: 'cardigan', size: 'M', quantity: 5 },
    { productId: 'hoodie', size: 'L', quantity: 1 },
  ]);
  assert.equal(JSON.parse(values.get(STORAGE_KEY)).schemaVersion, 6);
  assert.equal(values.has(LEGACY_STORAGE_KEY), false);
});

test('storage rejects unknown IDs, sizes, quantities, duplicates and injected fields', () => {
  const initial = items();
  const sanitized = sanitizeState({
    schemaVersion: 6,
    items: [...initial, initial[0],
      { productId: 'unknown', size: 'M', quantity: 2 },
      { productId: 'cardigan', size: 'XS', quantity: 2 },
      { productId: 'cardigan', size: 'M', quantity: 100 },
      { ...initial[0], price: 1, colorId: 'legacy' }],
    phone: '081234567890',
  });
  assert.deepEqual(sanitized.items, initial);
  assert.equal('phone' in sanitized, false);
  assert.equal('price' in sanitized.items[0], false);
  assert.equal('colorId' in sanitized.items[0], false);
});

test('checkout validates buyer biodata independently from store WhatsApp destination', () => {
  const buyer = { name: 'Rani', phone: '081234567890', address: 'Bandung' };
  assert.equal(normalizePhone(buyer.phone), '6281234567890');
  assert.equal(validateCheckout(items(), buyer), null);
  assert.equal(validateCheckout(items(), { ...buyer, phone: '' }).field, 'customer-phone');
  assert.equal(validateCheckout([], buyer).field, 'cart-heading');
  assert.equal(validateCheckout(items(), { ...buyer, name: 'A' }).field, 'customer-name');
  assert.equal(validateCheckout(items(), { ...buyer, address: 'x'.repeat(241) }).field, 'customer-address');
  const message = buildMessage(items(), buyer);
  assert.ok(message.includes('WhatsApp pelanggan: 6281234567890'));
  assert.ok(message.includes('Cardigan — warna Navy (Rajut · kerah V · kancing depan), ukuran M × 2'));
  assert.ok(message.includes('Hoodie — warna Black'));
  const url = new URL(buildWhatsAppUrl(BUSINESS.whatsapp, items(), buyer));
  assert.equal(url.hostname, 'api.whatsapp.com');
  assert.equal(url.pathname, '/send');
  assert.equal(url.searchParams.get('phone'), BUSINESS.whatsapp);
  assert.equal(url.searchParams.get('text'), message);
});
