import { findProduct, SIZES } from './data.js?v=13';

export const money = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(value);

export const validQuantity = (value) => Number.isInteger(value) && value >= 1 && value <= 99;
export const validCartItem = (productId, size) => Boolean(findProduct(productId) && SIZES.includes(size));
export const itemKey = ({ productId, size }) => `${productId}:${size}`;

export function setQuantity(items, productId, size, quantity) {
  if (!validCartItem(productId, size) || !validQuantity(quantity)) {
    throw new RangeError('Pilih model dan ukuran yang tersedia, dengan jumlah 1–99.');
  }
  const key = itemKey({ productId, size });
  const exists = items.some((item) => itemKey(item) === key);
  return exists
    ? items.map((item) => itemKey(item) === key ? { productId, size, quantity } : item)
    : [...items, { productId, size, quantity }];
}

export const removeItem = (items, key) => items.filter((item) => itemKey(item) !== key);

export function quote(items) {
  const lines = items.flatMap((item) => {
    const product = findProduct(item.productId);
    return validCartItem(item.productId, item.size) && validQuantity(item.quantity)
      ? [{
        ...product,
        size: item.size,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      }]
      : [];
  });
  return {
    lines,
    units: lines.reduce((sum, line) => sum + line.quantity, 0),
    total: lines.reduce((sum, line) => sum + line.subtotal, 0),
  };
}
