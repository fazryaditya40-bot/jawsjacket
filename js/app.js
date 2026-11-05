import { BUSINESS } from './config.js?v=14';
import { CATEGORIES, PRODUCTS, filterProducts, findProduct } from './data.js?v=13';
import { itemKey, money, quote, removeItem, setQuantity, validQuantity } from './cart.js?v=13';
import { loadState, saveState } from './storage.js?v=11';
import { buildMessage, buildWhatsAppUrl, normalizePhone, validBusinessNumber, validateCheckout } from './checkout.js?v=16';

const $ = (id) => document.getElementById(id);
const loaded = loadState();
let state = loaded.state;
let category = 'all';
let toastTimer;
let reviewed = false;
const businessReady = validBusinessNumber(BUSINESS.whatsapp);
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function jacketIllustration(product, className = '') {
  const image = element('img', className);
  image.alt = `${product.name}, warna ${product.color.name}`;
  image.src = `assets/images/jackets/${encodeURIComponent(product.image)}`;
  return image;
}

function announce(message) {
  clearTimeout(toastTimer);
  const status = $('status-message');
  status.textContent = message;
  status.classList.add('visible');
  toastTimer = setTimeout(() => status.classList.remove('visible'), 4000);
}

function optionSelect(label, values, product, type) {
  const wrapper = element('label', 'option-field');
  wrapper.append(element('span', '', label));
  const select = element('select', 'option-select');
  select.setAttribute('aria-label', `${label} ${product.name}`);
  select.dataset.option = type;
  select.dataset.product = product.id;
  values.forEach((entry) => {
    const option = element('option', '', typeof entry === 'string' ? entry : entry.name);
    option.value = typeof entry === 'string' ? entry : entry.id;
    select.append(option);
  });
  wrapper.append(select);
  return wrapper;
}

function renderCatalog() {
  const products = filterProducts($('search').value, category);
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const card = element('article', 'product-card');
    const visual = element('div', 'product-image');
    visual.dataset.category = product.category;
    let image = jacketIllustration(product, 'product-art');
    visual.append(image, element('span', 'product-tag', product.tag));
    const body = element('div', 'product-body');
    const description = element('p', 'product-description', product.description);
    const specification = element('p', 'product-spec', product.specification);
    const color = element('p', 'product-color', `Warna: ${product.color.name}`);
    body.append(
      element('p', 'product-category', CATEGORIES.find((entry) => entry.id === product.category).name),
      element('h3', '', product.name),
      description,
      specification,
      color,
    );
    const options = element('div', 'product-options');
    options.append(optionSelect('Ukuran', product.sizes, product, 'size'));
    const bottom = element('div', 'product-bottom');
    const price = element('div', 'product-price');
    const priceValue = element('strong', '', money(product.price));
    price.append(priceValue, element('small', '', 'Harga satuan'));
    const add = element('button', 'add-button', '+ Tambah');
    add.type = 'button';
    add.dataset.add = product.id;
    add.setAttribute('aria-label', `Tambah ${product.name} ke keranjang`);
    bottom.append(price, add);
    body.append(options, bottom);
    card.append(visual, body);
    fragment.append(card);
  });
  $('product-grid').replaceChildren(fragment);
  $('result-count').textContent = `${products.length} dari ${PRODUCTS.length} jaket`;
  $('no-results').hidden = products.length !== 0;
}

function renderFilters() {
  CATEGORIES.forEach((entry) => {
    const button = element('button', 'filter-button', entry.name);
    button.type = 'button';
    button.dataset.category = entry.id;
    button.setAttribute('aria-pressed', String(entry.id === category));
    $('category-filters').append(button);
  });
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
  document.querySelectorAll('[aria-invalid]').forEach((node) => node.removeAttribute('aria-invalid'));
}

function invalidateReview() {
  reviewed = false;
  $('review-panel').hidden = true;
  $('whatsapp-button').disabled = true;
  clearErrors();
}

function persist() {
  if (!saveState(state)) $('storage-warning').hidden = false;
}

function updateCartTotal() {
  const estimate = quote(state.items);
  $('cart-count').textContent = estimate.units;
  $('cart-total').textContent = money(estimate.total);
  $('review-button').disabled = state.items.length === 0;
  document.querySelectorAll('[data-subtotal]').forEach((node) => {
    const line = estimate.lines.find((entry) => itemKey(entry) === node.dataset.subtotal);
    node.textContent = line ? money(line.subtotal) : '';
  });
}

function renderCart(focusTarget) {
  const fragment = document.createDocumentFragment();
  state.items.forEach((item) => {
    const product = findProduct(item.productId);
    const key = itemKey(item);
    const row = element('div', 'cart-item');
    const head = element('div', 'cart-item-head');
    const thumb = jacketIllustration(product, 'cart-thumb');
    thumb.setAttribute('aria-hidden', 'true');
    const details = element('div');
    details.append(element('h3', '', product.name), element('p', 'item-rate', `Warna ${product.color.name} · Ukuran ${item.size}`));
    head.append(thumb, details);
    const controls = element('div', 'cart-item-controls');
    const quantity = element('div', 'quantity-control');
    for (const [action, text, label] of [['minus', '−', 'Kurangi'], ['plus', '+', 'Tambah']]) {
      const button = element('button', '', text);
      button.type = 'button';
      button.dataset.action = action;
      button.dataset.key = key;
      button.setAttribute('aria-label', `${label} jumlah ${product.name}, ukuran ${item.size}`);
      button.disabled = action === 'minus' ? item.quantity <= 1 : item.quantity >= 99;
      quantity.append(button);
    }
    const input = element('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.min = '1';
    input.max = '99';
    input.step = '1';
    input.value = item.quantity;
    input.dataset.quantity = key;
    input.setAttribute('aria-label', `Jumlah ${product.name}, ukuran ${item.size}`);
    quantity.insertBefore(input, quantity.lastChild);
    const remove = element('button', 'remove-button', 'Hapus');
    remove.type = 'button';
    remove.dataset.action = 'remove';
    remove.dataset.key = key;
    remove.setAttribute('aria-label', `Hapus ${product.name}, ukuran ${item.size} dari keranjang`);
    controls.append(quantity, remove);
    const error = element('p', 'field-error');
    error.id = `quantity-error-${fragment.childElementCount}`;
    input.setAttribute('aria-describedby', error.id);
    const subtotal = element('p', 'line-subtotal');
    subtotal.dataset.subtotal = key;
    row.append(head, controls, error, subtotal);
    fragment.append(row);
  });
  $('cart-items').replaceChildren(fragment);
  $('cart-empty').hidden = state.items.length > 0;
  updateCartTotal();
  if (focusTarget) {
    const target = focusTarget.action
      ? [...$('cart-items').querySelectorAll('[data-action]')].find((node) => node.dataset.action === focusTarget.action && node.dataset.key === focusTarget.key)
      : [...$('cart-items').querySelectorAll('[data-quantity]')].find((node) => node.dataset.quantity === focusTarget.key);
    if (target && !target.disabled) target.focus({ preventScroll: true });
    else $('cart-heading').focus({ preventScroll: true });
  }
}

function changeQuantity(item, quantity, focusTarget) {
  try {
    state.items = setQuantity(state.items, item.productId, item.size, quantity);
    invalidateReview();
    persist();
    renderCart(focusTarget);
    return true;
  } catch (error) {
    announce(error.message);
    return false;
  }
}

function contact() {
  return {
    name: $('customer-name').value,
    phone: $('customer-phone').value,
    address: $('customer-address').value,
  };
}

function showError(error) {
  clearErrors();
  if (error.field === 'cart-heading') {
    $('form-error').textContent = error.message;
    $('cart-heading').focus();
    return;
  }
  const input = $(error.field);
  const errorNode = $(`${error.field}-error`);
  errorNode.textContent = error.message;
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

function renderReview() {
  const estimate = quote(state.items);
  const data = contact();
  const description = document.createDocumentFragment();
  [['Nama', data.name.trim()], ['WhatsApp Anda', normalizePhone(data.phone)], ['Alamat', data.address.trim() || 'Akan dikonfirmasi']].forEach(([label, value]) => {
    description.append(element('dt', '', label), element('dd', '', value));
  });
  $('review-contact').replaceChildren(description);
  $('review-lines').replaceChildren(...estimate.lines.map((line) => element('li', '', `${line.name} — warna ${line.color.name}, ukuran ${line.size} × ${line.quantity} = ${money(line.subtotal)}`)));
  $('review-total').textContent = `Total produk: ${money(estimate.total)}`;
  reviewed = true;
  $('review-panel').hidden = false;
  $('whatsapp-button').disabled = !businessReady;
  $('review-heading').focus();
}

renderFilters();
renderCatalog();
renderCart();
$('storage-warning').hidden = !loaded.failed;
$('year').textContent = new Date().getFullYear();
$('unavailable-note').hidden = businessReady;

const contactLines = [];
if (BUSINESS.address) {
  $('footer-address').textContent = BUSINESS.address;
  contactLines.push(`Alamat: ${BUSINESS.address}`);
}
if (BUSINESS.openingHours) contactLines.push(`Jam buka: ${BUSINESS.openingHours}`);
if (businessReady) contactLines.push(`WhatsApp toko: +${BUSINESS.whatsapp}`);
if (contactLines.length) $('business-contact').textContent = contactLines.join(' · ');

$('search').addEventListener('input', renderCatalog);
$('category-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;
  category = button.dataset.category;
  $('category-filters').querySelectorAll('button').forEach((node) => node.setAttribute('aria-pressed', String(node === button)));
  renderCatalog();
});
$('reset-filters').addEventListener('click', () => {
  $('search').value = '';
  category = 'all';
  $('category-filters').querySelectorAll('button').forEach((node) => node.setAttribute('aria-pressed', String(node.dataset.category === category)));
  renderCatalog();
  $('search').focus();
});
$('product-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const card = button.closest('.product-card');
  const product = findProduct(button.dataset.add);
  const size = card.querySelector('[data-option="size"]').value;
  const current = state.items.find((item) => item.productId === product.id && item.size === size)?.quantity || 0;
  if (changeQuantity({ productId: product.id, size }, current + 1)) announce(`${product.name}, ukuran ${size} ditambahkan ke keranjang.`);
});
$('cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const item = state.items.find((entry) => itemKey(entry) === button.dataset.key);
  if (!item) return;
  if (button.dataset.action === 'remove') {
    state.items = removeItem(state.items, button.dataset.key);
    invalidateReview();
    persist();
    renderCart();
    ($('cart-items').querySelector('button') || $('cart-heading')).focus({ preventScroll: true });
    announce(`${findProduct(item.productId).name} dihapus dari keranjang.`);
    return;
  }
  changeQuantity(item, item.quantity + (button.dataset.action === 'plus' ? 1 : -1), { key: button.dataset.key, action: button.dataset.action });
});
for (const id of ['customer-name', 'customer-phone', 'customer-address']) $(id).addEventListener('input', invalidateReview);
$('order-form').addEventListener('submit', (event) => {
  event.preventDefault();
  for (const input of $('cart-items').querySelectorAll('[data-quantity]')) {
    if (!validQuantity(input.valueAsNumber)) {
      input.setAttribute('aria-invalid', 'true');
      input.closest('.cart-item').querySelector('.field-error').textContent = 'Masukkan jumlah bulat 1–99.';
      input.focus();
      return;
    }
    const item = state.items.find((entry) => itemKey(entry) === input.dataset.quantity);
    state.items = setQuantity(state.items, item.productId, item.size, input.valueAsNumber);
  }
  persist();
  renderCart();
  const error = validateCheckout(state.items, contact());
  if (error) { showError(error); return; }
  clearErrors();
  renderReview();
});
$('edit-request').addEventListener('click', () => {
  invalidateReview();
  $('customer-name').focus();
});
$('whatsapp-button').addEventListener('click', () => {
  if (!reviewed || !businessReady) return;
  const error = validateCheckout(state.items, contact());
  if (error) { invalidateReview(); showError(error); return; }
  const whatsappWindow = window.open(buildWhatsAppUrl(BUSINESS.whatsapp, state.items, contact()), '_blank');
  if (whatsappWindow) whatsappWindow.opener = null;
  else announce('Pop-up diblokir. Izinkan pop-up untuk membuka WhatsApp toko.');
});
$('copy-order').addEventListener('click', async () => {
  if (!reviewed) return;
  try {
    await navigator.clipboard.writeText(buildMessage(state.items, contact()));
    announce('Rincian pesanan disalin. Tempelkan ke chat WhatsApp toko.');
  } catch {
    announce('Tidak dapat menyalin otomatis. Salin rincian pesanan dari ringkasan.');
  }
});
$('cart-items').addEventListener('change', (event) => {
  const input = event.target;
  if (!input.matches('[data-quantity]')) return;
  const item = state.items.find((entry) => itemKey(entry) === input.dataset.quantity);
  if (!item) return;
  if (!changeQuantity(item, input.valueAsNumber, { key: input.dataset.quantity })) {
    input.setAttribute('aria-invalid', 'true');
    input.closest('.cart-item').querySelector('.field-error').textContent = 'Sebelumnya tetap dipakai. Masukkan jumlah bulat 1–99.';
    input.focus();
  }
});
