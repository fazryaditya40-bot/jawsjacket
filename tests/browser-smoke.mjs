import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const tabs = await (await fetch('http://127.0.0.1:9222/json')).json();
const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
let counter = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id) {
    const callback = pending.get(message.id);
    if (!callback) return;
    pending.delete(message.id);
    message.error ? callback.reject(message.error) : callback.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) errors.push(message.params.response.url);
});
function send(method, params = {}) {
  const id = ++counter;
  return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const pause = () => new Promise((resolve) => setTimeout(resolve, 200));
const input = (id, value) => evaluate(`(() => { const node = document.getElementById(${JSON.stringify(id)}); node.value = ${JSON.stringify(value)}; node.dispatchEvent(new Event('input', {bubbles:true})); })()`);
const click = (selector) => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
await send('Runtime.enable');
await send('Network.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:5500' });
for (let i = 0; i < 50; i++) {
  if (await evaluate('document.querySelectorAll(".product-card").length === 20')) break;
  await pause();
}
assert.equal(await evaluate('document.querySelectorAll(".product-card").length'), 20);
await evaluate('localStorage.clear()');
await send('Page.reload');
await pause();
assert.equal(await evaluate('document.querySelectorAll(".product-card").length'), 20);
assert.equal(await evaluate('document.querySelectorAll(".option-select option").length'), 20 * 5);
assert.equal(await evaluate('document.querySelectorAll("[data-option=color]").length'), 0);
assert.equal(await evaluate('document.querySelectorAll(".product-color").length'), 20);
await input('search', 'hoodie');
await click('[data-category="hoodie"]');
assert.equal(await evaluate('document.querySelectorAll(".product-card").length'), 1);
await input('search', 'no matching jacket');
assert.equal(await evaluate('document.querySelectorAll(".product-card").length'), 0);
await click('#reset-filters');
await evaluate(`(() => { const card=document.querySelector('[data-add="cardigan"]').closest('.product-card'); card.querySelector('[data-option="size"]').value='M'; document.querySelector('[data-add="cardigan"]').click(); document.querySelector('[data-add="cardigan"]').click(); const hoodie=document.querySelector('[data-add="hoodie"]').closest('.product-card'); hoodie.querySelector('[data-option="size"]').value='L'; document.querySelector('[data-add="hoodie"]').click(); })()`);
assert.equal(await evaluate('document.querySelectorAll(".cart-item").length'), 2);
assert.equal(await evaluate('document.getElementById("cart-count").textContent'), '3');
assert.ok((await evaluate('document.getElementById("cart-total").textContent')).includes('1.087.000'));
assert.ok((await evaluate('document.querySelector(".cart-item .item-rate").textContent')).includes('Warna Navy'));
assert.equal(await evaluate('document.getElementById("review-button").disabled'), false);
await click('#review-button');
assert.equal(await evaluate('document.activeElement.id'), 'customer-name');
await input('customer-name', 'Rani');
await input('customer-phone', '081234567890');
await input('customer-address', 'Bandung');
await click('#review-button');
assert.equal(await evaluate('document.getElementById("review-panel").hidden'), false);
assert.equal(await evaluate('document.getElementById("whatsapp-button").disabled'), false);
assert.equal(await evaluate('document.querySelector("#review-contact dd:nth-of-type(2)").textContent'), '6281234567890');
assert.equal(await evaluate(`localStorage.getItem('jaws-jacket:cart:v6').includes('081234567890')`), false);
assert.equal(await evaluate(`localStorage.getItem('jaws-jacket:cart:v6').includes('Rani')`), false);
assert.equal(await evaluate(`document.querySelector('#customer-phone').value`), '081234567890');
const whatsappUrl = await evaluate(`(() => { let opened; window.open = (url, target) => { opened = {url, target}; return {opener: window}; }; document.querySelector('#whatsapp-button').click(); return opened; })()`);
assert.equal(new URL(whatsappUrl.url).hostname, 'api.whatsapp.com');
assert.equal(new URL(whatsappUrl.url).searchParams.get('phone'), '62895340665371');
assert.ok(new URL(whatsappUrl.url).searchParams.get('text').includes('ukuran M'));
assert.equal(whatsappUrl.target, '_blank');
await click('[data-action="plus"]');
assert.equal(await evaluate('document.getElementById("review-panel").hidden'), true);
assert.ok((await evaluate('document.getElementById("cart-total").textContent')).includes('1.416.000'));
await evaluate(`(() => { const node = document.querySelector('[data-quantity]'); node.value = '0'; node.dispatchEvent(new Event('input',{bubbles:true})); node.dispatchEvent(new Event('change',{bubbles:true})); })()`);
assert.equal(await evaluate('document.querySelector("[data-quantity]").getAttribute("aria-invalid")'), 'true');
await evaluate(`(() => { const node = document.querySelector('[data-quantity]'); node.value = '2'; node.dispatchEvent(new Event('input',{bubbles:true})); node.dispatchEvent(new Event('change',{bubbles:true})); })()`);
await send('Page.reload');
await pause();
assert.equal(await evaluate('document.getElementById("cart-count").textContent'), '3');
assert.equal(await evaluate('document.getElementById("customer-name").value'), '');
for (const width of [320, 360, 768, 1280]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
  assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), `Horizontal overflow at ${width}`);
}
await evaluate(`localStorage.setItem('jaws-jacket:cart:v6', '{bad')`);
await send('Page.reload');
await pause();
assert.equal(await evaluate('document.getElementById("cart-count").textContent'), '0');
assert.equal(await evaluate('document.querySelectorAll(".product-card").length'), 20);
await evaluate('document.activeElement.blur()');
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
assert.equal(await evaluate('document.activeElement.className'), 'skip-link');
assert.deepEqual(errors, []);
console.log('PASS: 20 jacket models/fixed colors/no color selector, filters, size cart, totals, buyer checkout validation, WhatsApp review, private contact data, persistence, corrupt storage, responsive widths and keyboard skip link.');
socket.close();
