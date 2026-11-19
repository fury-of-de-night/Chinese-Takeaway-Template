'use strict';

const $ = (selector) => document.querySelector(selector);
const key = 'mn-takeaway-demo-v1';
const sample = [
  { id: 'rice', name: 'Chicken Fried Rice', category: 'Fried Rice', description: 'Wok-fried rice with chicken, vegetables and scallions.', image: './assets/rice.webp', full: 180000, half: 110000 },
  { id: 'noodles', name: 'Chicken Chow Mein', category: 'Noodles', description: 'Stir-fried noodles tossed with chicken and vegetables.', image: './assets/noodles.webp', full: 190000, half: 115000 },
  { id: 'wings', name: 'Glazed Chicken Wings', category: 'Sides', description: 'Crispy wings tossed in a sticky, savoury glaze.', image: './assets/wings.webp', full: 160000, half: null },
];
const initial = () => ({ menu: sample, cart: [], orders: [] });
const read = () => JSON.parse(localStorage.getItem(key)) ?? initial();
let data = initial();
let storageReady = true;
try {
  data = read();
} catch {
  storageReady = false;
}
const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const money = (minor) => 'GYD ' + new Intl.NumberFormat('en-GY', { maximumFractionDigits: 2 }).format(minor / 100);
const quote = 'The transport provider will call you and quote the delivery price. Delivery is paid separately and is not included in the food total.';
const dialog = $('#dialog');
const panel = $('#panel');
let view = '';
let activeToken = '';
let category = 'All dishes';
let timer;

function notice(message) {
  $('#notice').textContent = dialog.open ? '' : message;
  $('#dialog-notice').textContent = dialog.open ? message : '';
  clearTimeout(timer);
  if (message) timer = setTimeout(() => notice(''), 4200);
}

function save(change) {
  try {
    const next = structuredClone(read());
    change(next);
    localStorage.setItem(key, JSON.stringify(next));
    data = next;
    renderMenu();
    return true;
  } catch (error) {
    notice(error.name === 'QuotaExceededError' ? 'Browser storage is full. Remove a photo or reset the demo.' : error instanceof DemoError ? error.message : 'Changes could not be saved in this browser.');
    return false;
  }
}

class DemoError extends Error {}

function action(label, handler, className = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.className = className;
  button.addEventListener('click', handler);
  return button;
}

function open(title, html, nextView) {
  view = nextView;
  $('#dialog-title').textContent = title;
  panel.innerHTML = html;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function photo(dish) {
  return dish.image ? '<img class="food-photo" src="' + esc(dish.image) + '" alt="Illustrative photo of ' + esc(dish.name) + '">' : '<div class="food-photo" aria-hidden="true"></div>';
}

function handleImages() {
  document.querySelectorAll('img').forEach((img) => {
    const fallback = () => {
      const placeholder = document.createElement('div');
      placeholder.className = img.className;
      placeholder.setAttribute('aria-hidden', 'true');
      img.replaceWith(placeholder);
    };
    img.addEventListener('error', fallback, { once: true });
    if (img.complete && !img.naturalWidth) fallback();
  });
}

function available(dish) {
  return !dish.unavailable && !dish.provisional && [dish.full, dish.half].some((price) => Number.isSafeInteger(price) && price > 0);
}

function renderMenu() {
  $('#count').textContent = data.cart.reduce((total, line) => total + line.quantity, 0);
  const categories = ['All dishes', ...new Set(data.menu.map((dish) => dish.category).filter((name) => name !== 'All dishes'))];
  if (!categories.includes(category)) category = categories[0];
  $('#categories').replaceChildren(...categories.map((name) => {
    const button = action(name, () => {
      category = name;
      renderMenu();
      $('#categories [aria-pressed="true"]').focus();
    }, name === category ? 'primary' : '');
    button.setAttribute('aria-pressed', name === category);
    return button;
  }));
  const query = $('#search').value.trim().toLowerCase();
  const dishes = data.menu.filter((dish) => (category === categories[0] || dish.category === category) && [dish.name, dish.description, dish.category].join(' ').toLowerCase().includes(query));
  $('#dishes').innerHTML = dishes.map((dish, index) => {
    const prices = [dish.full, dish.half].filter((price) => Number.isSafeInteger(price) && price > 0);
    const price = dish.unavailable ? 'Unavailable' : !available(dish) ? 'Price to confirm' : (prices.length > 1 ? 'From ' : '') + money(Math.min(...prices));
    return '<article class="card">' + photo(dish) + '<div class="card-content"><p class="eyebrow">' + esc(dish.category) + '</p><h3>' + esc(dish.name) + '</h3><p class="muted">' + esc(dish.description) + '</p><div class="card-foot"><span class="price">' + price + '</span><button class="primary" data-dish="' + index + '"' + (available(dish) ? '' : ' disabled') + '>Choose portion <span aria-hidden="true">+</span></button></div></div></article>';
  }).join('') || '<p>No dishes match your search.</p>';
  document.querySelectorAll('[data-dish]').forEach((button) => button.onclick = () => portion(dishes[Number(button.dataset.dish)]));
  handleImages();
}

function portion(dish) {
  open(dish.name, '<p>' + esc(dish.description) + '</p><div class="row" id="portions"></div>', 'portion');
  for (const [size, label] of [['full', 'Full box'], ['half', 'Half box']]) {
    if (!dish[size]) continue;
    $('#portions').append(action(label + ' · ' + money(dish[size]), () => {
      const added = save((next) => {
        const current = next.menu.find((item) => item.id === dish.id);
        if (!current || !available(current) || current[size] !== dish[size]) throw new DemoError('The menu changed. Reopen the dish to review its price.');
        const line = next.cart.find((item) => item.id === dish.id && item.size === size);
        if (line && line.quantity >= 20) throw new DemoError('Limit of 20 per portion.');
        if (line) line.quantity++;
        else next.cart.push({ id: dish.id, size, quantity: 1, addedPrice: dish[size] });
      });
      if (added) {
        dialog.close();
        notice(label + ' of ' + dish.name + ' added to cart.');
      }
    }, 'primary'));
  }
}

const total = (lines) => lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
const portionName = (size) => size === 'full' ? 'Full box' : 'Half box';
function currentLines(state) {
  return state.cart.map((line) => {
    const dish = state.menu.find((item) => item.id === line.id);
    const price = dish && available(dish) ? dish[line.size] : null;
    return { ...line, name: dish?.name ?? 'Removed dish', price: price > 0 ? price : null };
  });
}

function cart() {
  const lines = currentLines(data);
  const priceChanged = lines.some((line) => line.price && line.addedPrice && line.price !== line.addedPrice);
  open('Your cart', '<div class="fields" id="cart-lines"></div>' + (lines.length ? (priceChanged ? '<p>Menu prices changed. Review the updated prices below before checkout.</p>' : '') + '<p class="price">Food total · ' + money(total(lines)) + '</p><p class="muted">' + quote + '</p><div class="row" id="cart-actions"></div>' : '<p>Your cart is empty.</p><a class="button primary" href="#menu" id="back-menu">Browse menu</a>'), 'cart');
  if (!lines.length) {
    $('#back-menu').onclick = () => dialog.close();
    return;
  }
  lines.forEach((line) => {
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = '<strong>' + esc(line.name) + '</strong><span>' + portionName(line.size) + ' · ' + (line.price ? money(line.price) + ' each' : 'Currently unavailable') + '</span>';
    const controls = document.createElement('div');
    controls.className = 'row';
    for (const [label, change, description] of [['−', -1, 'Decrease quantity'], ['+', 1, 'Increase quantity'], ['Remove', 0, 'Remove']]) {
      if (change === 1) {
        const count = document.createElement('span');
        count.textContent = line.quantity;
        controls.append(count);
      }
      const button = action(label, () => {
        if (save((next) => {
          const item = next.cart.find((value) => value.id === line.id && value.size === line.size);
          if (!item) return;
          if (!change || item.quantity + change < 1) next.cart = next.cart.filter((value) => value !== item);
          else item.quantity = Math.min(20, item.quantity + change);
        })) cart();
      }, change ? '' : 'danger');
      button.setAttribute('aria-label', description + ' for ' + line.name + ', ' + portionName(line.size));
      button.disabled = change === 1 && (line.quantity >= 20 || !line.price);
      controls.append(button);
    }
    entry.append(controls);
    $('#cart-lines').append(entry);
  });
  const proceed = action('Checkout', checkout, 'primary');
  proceed.disabled = lines.some((line) => !line.price);
  $('#cart-actions').append(proceed, action('Clear cart', () => confirmAction('Clear cart?', 'Remove all items from this cart?', 'Clear cart', cart, () => {
    if (save((next) => { next.cart = []; })) cart();
  }), 'danger'));
}

function receipt(lines) {
  return '<ul>' + lines.map((line) => '<li>' + esc(line.name) + ' · ' + portionName(line.size) + ' × ' + line.quantity + ' · ' + money(line.price * line.quantity) + '</li>').join('') + '</ul><p class="price">Food total · ' + money(total(lines)) + '</p>';
}

function checkout() {
  const lines = currentLines(data);
  open('Demo checkout', '<p class="muted">Use sample contact details. This order is saved only in this browser.</p>' + receipt(lines) +
    '<form class="fields" id="checkout"><label>Customer name<input name="customer" required maxlength="80" autocomplete="name"></label><label>Phone<input name="phone" type="tel" required maxlength="24" autocomplete="tel"></label><label>Fulfilment<select name="method"><option>Pickup</option><option>Delivery</option></select></label><div class="fields" id="delivery" hidden><p>' + quote + '</p><label>Delivery address<input name="address" maxlength="160" autocomplete="street-address" disabled></label></div><label>Allergy alert<select name="allergy"><option>None specified</option><option>Shellfish</option><option>Peanuts or tree nuts</option><option>Other or multiple allergies</option></select></label><label>Allergy details<textarea name="allergyDetails" maxlength="250"></textarea></label><label>Kitchen notes<textarea name="notes" maxlength="250"></textarea></label><p class="muted">No payment is collected in this demo.</p><div class="row"><button class="primary">Place demo order</button><button type="button" id="back-cart">Back to cart</button></div></form>', 'checkout');
  const form = $('#checkout');
  const fields = form.elements;
  $('#back-cart').onclick = cart;
  fields.method.onchange = () => {
    const delivery = fields.method.value === 'Delivery';
    $('#delivery').hidden = !delivery;
    fields.address.disabled = !delivery;
    fields.address.required = delivery;
  };
  fields.phone.oninput = () => fields.phone.setCustomValidity('');
  form.onsubmit = (event) => {
    event.preventDefault();
    if (fields.phone.value.replace(/\D/g, '').length < 7) {
      fields.phone.setCustomValidity('Enter a phone number with at least seven digits.');
      fields.phone.reportValidity();
      return;
    }
    if (!fields.customer.value.trim() || (fields.address.required && !fields.address.value.trim())) {
      notice('Enter a customer name and delivery address where required.');
      return;
    }
    const token = crypto.randomUUID();
    const reference = 'MN-' + token.slice(0, 8).toUpperCase();
    const contact = Object.fromEntries(new FormData(form));
    const button = form.querySelector('button[type=submit], button:not([type])');
    button.disabled = true;
    button.textContent = 'Saving demo order…';
    if (save((next) => {
      const latest = currentLines(next);
      if (!latest.length || latest.some((line) => !line.price) || JSON.stringify(latest) !== JSON.stringify(lines)) throw new DemoError('Your cart changed. Go back to review the updated cart.');
      next.orders = [{ token, reference, status: 'Pending', created: Date.now(), contact, lines }, ...next.orders].slice(0, 50);
      next.cart = [];
    })) {
      tracking(token);
      copy(token, true);
    } else {
      button.disabled = false;
      button.textContent = 'Place demo order';
    }
  };
}

async function copy(token, quiet = false) {
  try {
    await navigator.clipboard.writeText(token);
    notice('Tracking token copied.');
  } catch {
    if (!quiet) notice('Clipboard unavailable. Select and copy the displayed token.');
  }
}

function confirmAction(title, message, label, back, confirm) {
  open(title, '<p>' + esc(message) + '</p><div class="row" id="confirm-actions"></div>', 'confirm');
  const keepLabel = label === 'Confirm cancel' ? 'Keep order' : 'Go back';
  $('#confirm-actions').append(action(keepLabel, back), action(label, confirm, 'danger'));
}

function cancel(order, back) {
  confirmAction('Cancel ' + order.reference + '?', 'Only pending demo orders can be cancelled.', 'Confirm cancel', back, () => {
    if (save((next) => {
      const current = next.orders.find((item) => item.token === order.token);
      if (!current || current.status !== 'Pending') throw new DemoError('This order is no longer pending.');
      current.status = 'Cancelled';
    })) notice('Demo order cancelled.');
    back();
  });
}

function tracking(token = '') {
  activeToken = token;
  const order = data.orders.find((item) => item.token === token);
  const status = order ? '<div class="entry"><h3>' + esc(order.reference) + ' · ' + order.status + '</h3><p>Demo order · ' + esc(order.contact.method) + '</p>' + receipt(order.lines) + (order.contact.method === 'Delivery' ? '<p>' + quote + '</p>' : '') + '<p class="token">' + esc(order.token) + '</p><div class="row" id="tracking-actions"></div></div>' : (token ? '<p>No demo order matches that token in this browser.</p>' : '');
  open('Track order', '<p class="muted">Track a demo order using its private token.</p><form class="fields" id="track-form"><label>Tracking token<input name="token" value="' + esc(token) + '" required></label><div class="row"><button class="primary">Find order</button><button type="button" id="history">History</button></div></form>' + status, 'tracking');
  $('#track-form').onsubmit = (event) => {
    event.preventDefault();
    tracking(event.currentTarget.elements.token.value.trim());
  };
  $('#history').onclick = historyView;
  if (order) {
    $('#tracking-actions').append(action('Copy token', () => copy(order.token)));
    if (order.status === 'Pending') $('#tracking-actions').append(action('Cancel order', () => cancel(order, () => tracking(token)), 'danger'));
    else if (order.status !== 'Cancelled') $('#tracking-actions').append('Online cancellation is closed. Contact the restaurant for live orders.');
  }
}

function historyView() {
  open('Order history', '<p class="muted">The last 50 demo orders are saved in this browser. Clearing site data removes them.</p><div id="history-list" class="fields"></div>', 'history');
  $('#history-list').append(action('Back to tracking', () => tracking()));
  if (!data.orders.length) $('#history-list').append('No demo orders yet.');
  data.orders.forEach((order) => {
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = '<strong>' + esc(order.reference) + ' · ' + order.status + '</strong><span>' + formatDate(order.created) + '</span><span class="token">' + esc(order.token) + '</span>';
    const controls = document.createElement('div');
    controls.className = 'row';
    controls.append(action('View order', () => tracking(order.token)), action('Copy token', () => copy(order.token)));
    if (order.status === 'Pending') controls.append(action('Cancel order', () => cancel(order, historyView), 'danger'));
    entry.append(controls);
    $('#history-list').append(entry);
  });
}

const formatDate = (date) => new Intl.DateTimeFormat('en-GY', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Guyana' }).format(date);
const statusNext = { Pending: 'Preparing', Preparing: 'Ready', Ready: 'Completed' };

function admin(showOrders = false) {
  open('Demo admin', '<p class="muted">Menu edits and sample orders stay in this browser.</p><div id="admin-actions" class="row"></div><div id="admin-list" class="fields"></div>', showOrders ? 'orders' : 'admin');
  $('#admin-actions').append(action('Edit menu', () => admin(), showOrders ? '' : 'primary'), action('Demo orders', () => admin(true), showOrders ? 'primary' : ''), action('Reset demo', () => confirmAction('Reset demo?', 'Restore sample dishes and clear this browser’s cart and demo orders.', 'Reset demo', () => admin(showOrders), () => {
    if (save((next) => Object.assign(next, initial()))) admin();
  }), 'danger'));
  const list = $('#admin-list');
  if (!showOrders) {
    list.append(action('Add dish', () => editor(), 'primary'));
    data.menu.forEach((dish) => {
      const row = document.createElement('div');
      row.className = 'entry row between';
      const name = document.createElement('strong');
      name.textContent = dish.name;
      row.append(name, action('Edit dish', () => editor(dish)));
      list.append(row);
    });
    return;
  }
  if (!data.orders.length) list.append('No demo orders yet.');
  data.orders.forEach((order) => {
    const entry = document.createElement('div');
    const contact = order.contact;
    entry.className = 'entry';
    entry.innerHTML = '<h3>' + esc(order.reference) + ' · ' + order.status + '</h3><p>' + formatDate(order.created) + ' · ' + esc(contact.method) + '</p><p>' + esc(contact.customer) + ' · ' + esc(contact.phone) + '</p>' +
      (contact.address ? '<p>Address · ' + esc(contact.address) + '</p>' : '') + '<p><strong>Allergy alert · ' + esc(contact.allergy) + '</strong> ' + esc(contact.allergyDetails) + '</p><p>Kitchen notes · ' + esc(contact.notes || 'None') + '</p>' + receipt(order.lines);
    const nextStatus = statusNext[order.status];
    if (nextStatus) entry.append(action('Mark ' + nextStatus.toLowerCase(), () => {
      if (save((next) => {
        const current = next.orders.find((item) => item.token === order.token);
        if (!current || current.status !== order.status) throw new DemoError('The order status changed. Reopen the order list.');
        current.status = nextStatus;
      })) admin(true);
    }));
    list.append(entry);
  });
}

function editor(dish) {
  open(dish ? 'Edit dish' : 'Add dish', '<form class="fields" id="editor"><label>Dish name<input name="dishName" required maxlength="80" value="' + esc(dish?.name) + '"></label><label>Category<input name="category" required maxlength="40" value="' + esc(dish?.category) + '"></label><label>Description<textarea name="description" maxlength="250">' + esc(dish?.description) + '</textarea></label>' +
    ['full', 'half'].map((size) => '<label>' + portionName(size) + ' price (GYD)<input name="' + size + '" type="number" min="0.01" max="9999999" step="0.01" value="' + (dish?.[size] ? dish[size] / 100 : '') + '"></label>').join('') +
    '<label class="check"><input name="provisional" type="checkbox"' + (dish?.provisional ? ' checked' : '') + '> Prices need confirmation</label><label class="check"><input name="unavailable" type="checkbox"' + (dish?.unavailable ? ' checked' : '') + '> Mark as unavailable</label><label>Photo URL (HTTPS)<input name="imageUrl" type="url" value="' + (dish?.image?.startsWith('https:') ? esc(dish.image) : '') + '"></label><label>Upload image (JPEG, PNG or WebP, up to 750 KB)<input name="upload" type="file" accept="image/jpeg,image/png,image/webp"></label><div id="image-preview"></div><div class="row"><button type="button" id="remove-image">Remove photo</button><button class="primary" id="save-dish">Save dish</button><button type="button" id="back-admin">Back to menu editor</button></div></form>', 'editor');
  const form = $('#editor');
  const fields = form.elements;
  let image = dish?.image ?? '';
  let uploadVersion = 0;
  const preview = () => {
    $('#image-preview').innerHTML = image ? '<img class="preview" src="' + esc(image) + '" alt="Dish photo preview">' : '<p class="muted">No photo selected.</p>';
    handleImages();
  };
  const applyImageUrl = () => {
    const value = fields.imageUrl.value.trim();
    fields.imageUrl.setCustomValidity(value && !value.startsWith('https://') ? 'Use an HTTPS image URL.' : '');
    if (fields.imageUrl.validity.valid) {
      image = value;
      preview();
    }
  };
  fields.imageUrl.onchange = applyImageUrl;
  fields.imageUrl.oninput = () => fields.imageUrl.setCustomValidity('');
  fields.upload.onchange = () => {
    const version = ++uploadVersion;
    const file = fields.upload.files[0];
    $('#save-dish').disabled = false;
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 750000) {
      fields.upload.value = '';
      notice('Choose a JPEG, PNG or WebP file no larger than 750 KB.');
      return;
    }
    const reader = new FileReader();
    $('#save-dish').disabled = true;
    reader.onload = () => {
      if (version !== uploadVersion || view !== 'editor' || !form.isConnected) return;
      image = reader.result;
      fields.imageUrl.value = '';
      preview();
      $('#save-dish').disabled = false;
    };
    reader.onerror = () => {
      if (version !== uploadVersion || !form.isConnected) return;
      notice('The photo could not be read.');
      $('#save-dish').disabled = false;
    };
    reader.readAsDataURL(file);
  };
  $('#remove-image').onclick = () => {
    uploadVersion++;
    image = '';
    fields.imageUrl.value = '';
    fields.imageUrl.setCustomValidity('');
    fields.upload.value = '';
    $('#save-dish').disabled = false;
    preview();
  };
  $('#back-admin').onclick = () => admin();
  if (dish) form.append(action('Remove dish', () => confirmAction('Remove dish?', 'Remove ' + dish.name + ' from the demo menu?', 'Remove dish', () => editor(dish), () => {
    if (save((next) => { next.menu = next.menu.filter((item) => item.id !== dish.id); })) admin();
  }), 'danger'));
  form.onsubmit = (event) => {
    event.preventDefault();
    if ($('#save-dish').disabled) return;
    const name = fields.dishName.value.trim();
    const dishCategory = fields.category.value.trim();
    if (!name || !dishCategory) {
      notice('Enter a dish name and category.');
      return;
    }
    if (fields.imageUrl.value.trim()) {
      applyImageUrl();
      if (!fields.imageUrl.reportValidity()) return;
    }
    const edited = { id: dish?.id ?? crypto.randomUUID(), name, category: dishCategory, description: fields.description.value.trim(), image,
      full: fields.full.value ? Math.round(Number(fields.full.value) * 100) : null,
      half: fields.half.value ? Math.round(Number(fields.half.value) * 100) : null,
      unavailable: fields.unavailable.checked, provisional: fields.provisional.checked };
    if (save((next) => {
      const index = next.menu.findIndex((item) => item.id === edited.id);
      if (index >= 0) next.menu[index] = edited;
      else next.menu.push(edited);
    })) {
      admin();
      notice('Dish saved to the demo menu.');
    }
  };
  preview();
  fields.dishName.scrollIntoView({ block: 'nearest' });
  fields.dishName.focus({ preventScroll: true });
}

const languages = [['en', 'Translation'], ['es', 'Traducción'], ['zh-Hans', '翻译'], ['pt', 'Tradução'], ['nl', 'Vertaling'], ['fr', 'Traduction']];
let languageIndex = 0;
setInterval(() => {
  languageIndex = (languageIndex + 1) % languages.length;
  const [lang, label] = languages[languageIndex];
  const language = $('#language').cloneNode(false);
  language.lang = lang;
  language.textContent = label;
  $('#language').replaceWith(language);
}, 5000);

$('#translation').onclick = () => notice('Translations coming soon.');
$('#search').oninput = renderMenu;
$('#cart').onclick = cart;
$('#track').onclick = () => tracking();
$('#admin').onclick = () => admin();
$('#close').onclick = () => dialog.close();
window.addEventListener('storage', (event) => {
  if (event.key && event.key !== key) return;
  try {
    data = read();
    renderMenu();
    if (!dialog.open) return;
    if (view === 'cart') cart();
    if (view === 'tracking') tracking(activeToken);
    if (view === 'history') historyView();
    if (view === 'orders') admin(true);
  } catch {
    notice('Browser demo data could not be refreshed.');
  }
});
renderMenu();
if (!storageReady) notice('Existing demo data could not be loaded.');
