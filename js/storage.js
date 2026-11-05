import { validCartItem, validQuantity } from './cart.js?v=13';

export const STORAGE_KEY = 'jaws-jacket:cart:v6';
export const LEGACY_STORAGE_KEY = 'jaws-jacket:cart:v5';
export const emptyState = () => ({ schemaVersion: 6, items: [] });

export function sanitizeState(value) {
  const state = emptyState();
  if (!value || value.schemaVersion !== 6 || !Array.isArray(value.items)) return state;
  const seen = new Set();
  for (const item of value.items) {
    const key = item && `${item.productId}:${item.size}`;
    if (!item || !validCartItem(item.productId, item.size) || !validQuantity(item.quantity) || seen.has(key)) continue;
    seen.add(key);
    state.items.push({ productId: item.productId, size: item.size, quantity: item.quantity });
  }
  return state;
}

export function loadState(getStorage = () => globalThis.localStorage) {
  try {
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) return { state: sanitizeState(JSON.parse(raw)), failed: false };
    const legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return { state: emptyState(), failed: false };
    const legacy = JSON.parse(legacyRaw);
    if (legacy?.schemaVersion !== 5 || !Array.isArray(legacy.items)) {
      return { state: emptyState(), failed: false };
    }
    const mergedItems = new Map();
    for (const item of legacy.items) {
      if (!item || !validCartItem(item.productId, item.size) || !validQuantity(item.quantity)) continue;
      const key = `${item.productId}:${item.size}`;
      const quantity = Math.min(99, (mergedItems.get(key)?.quantity || 0) + item.quantity);
      mergedItems.set(key, { productId: item.productId, size: item.size, quantity });
    }
    const state = sanitizeState({ schemaVersion: 6, items: [...mergedItems.values()] });
    const saved = saveState(state, () => storage);
    if (saved) storage.removeItem?.(LEGACY_STORAGE_KEY);
    return { state, failed: !saved };
  } catch {
    return { state: emptyState(), failed: true };
  }
}

export function saveState(state, getStorage = () => globalThis.localStorage) {
  try {
    const safe = {
      schemaVersion: 6,
      items: state.items.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
    };
    getStorage().setItem(STORAGE_KEY, JSON.stringify(safe));
    return true;
  } catch {
    return false;
  }
}
