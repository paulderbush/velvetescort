// =================== SUPABASE / TELEGRAM ===================
const SUPABASE_URL = 'https://rfmixjljtwzhedsjsjni.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r7LdYArejggySFV2So1rmg_72NU_XK5';
const TG_BOT = 'https://api.telegram.org/bot8881061797:AAEDLHP9Uvs4Qw3Gezdzq3_T-_yFIo1fu0A/sendMessage';
const TG_CHAT = '-5098693486';

// =================== CART ===================
let cart = JSON.parse(localStorage.getItem('velvet_cart') || '[]');
let _bookingDraft = null;
let _contactMethod = 'whatsapp';

function _saveCart() {
  localStorage.setItem('velvet_cart', JSON.stringify(cart));
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
}
function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
}

function addToCart(id) {
  const m = MODELS.find(x => x.id === id);
  if (!m || m.real) return;
  if (!cart.find(x => x.id === id)) {
    cart.push({...m, duration: 1});
  }
  _saveCart();
  renderCart();
  openCart();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  _saveCart();
  renderCart();
}
function setDuration(id, dur) {
  const m = cart.find(x => x.id === id);
  if (m) { m.duration = +dur; _saveCart(); renderCart(); }
}

function renderCart() {
  const badge = document.getElementById('cartBadge');
  const content = document.getElementById('cartContent');
  if (!badge || !content) return;
  if (_bookingDraft) {
    badge.textContent = '1';
    const d = _bookingDraft;
    content.innerHTML = `
      <div class="booking-summary">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:0.85rem">
          <div style="width:44px;height:54px;border-radius:8px;background:url('/${d.modelFolder}/1.webp') top center/cover no-repeat;flex-shrink:0;border:1px solid var(--glass-border)"></div>
          <div>
            <div style="font-weight:600;font-size:15px">${d.modelName}</div>
            <div style="font-size:12px;color:var(--text-soft)">${d.durationLabel} · ${d.type === 'incall' ? 'Incall' : 'Outcall'}</div>
          </div>
          <button onclick="_bookingDraft=null;renderCart()" style="margin-left:auto;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem;padding:4px">✕</button>
        </div>
        ${d.extras.length ? `<div style="margin-bottom:0.65rem;border-top:1px solid var(--glass-border);padding-top:0.65rem">${d.extras.map(e => `<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-soft);padding:2px 0"><span>${e.name}</span><span>+£${e.price}</span></div>`).join('')}</div>` : ''}
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:1rem;padding-top:0.5rem;border-top:1px solid var(--glass-border)"><span>Total</span><span>£${d.total}</span></div>
      </div>
      <div class="booking-form">
        <div class="bf-label">Your name</div>
        <input class="bf-input" type="text" id="bf-name" placeholder="e.g. James" autocomplete="name">
        <div class="bf-label">Contact via</div>
        <div class="bf-methods">
          <button class="bf-method active" data-m="whatsapp" onclick="setContactMethod('whatsapp')">WhatsApp</button>
          <button class="bf-method" data-m="telegram" onclick="setContactMethod('telegram')">Telegram</button>
          <button class="bf-method" data-m="email" onclick="setContactMethod('email')">Email</button>
        </div>
        <input class="bf-input" type="tel" id="bf-contact" placeholder="+44 7000 000000" autocomplete="tel">
        <div class="bf-label">Date</div>
        <input class="bf-input" type="date" id="bf-date">
        <div class="bf-label">Time (24h format, e.g. 14:30)</div>
        <input class="bf-input" type="text" id="bf-time" placeholder="14:30" inputmode="numeric" maxlength="5" oninput="formatTimeInput(this)">
        <button class="booking-submit-btn" onclick="submitBooking()">Make a Booking</button>
      </div>`;
    return;
  }
  badge.textContent = cart.length;
  if (cart.length === 0) {
    content.innerHTML = '<div class="cart-empty">No companions selected yet.<br>Browse our models to get started.</div>';
    return;
  }
  const sub = cart.reduce((s, x) => s + x.rateHour * x.duration, 0);
  content.innerHTML = cart.map(m => `
    <div class="cart-item">
      <div class="cart-item-avatar" style="background:linear-gradient(135deg,${m.color[0]},${m.color[1]})">${m.initials}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${m.name}</div>
        <div class="cart-item-detail">£${m.rateHour}/hr · ${m.nationality}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:4px">
          <span style="font-size:12px;color:var(--text-muted)">Hours:</span>
          <select style="background:rgba(123,47,190,0.15);border:1px solid var(--glass-border);border-radius:8px;color:var(--text);font-size:12px;padding:2px 6px;font-family:Outfit,sans-serif" onchange="setDuration(${m.id},this.value)">
            ${[1, 2, 3, 4, 6, 8].map(h => `<option value="${h}" ${m.duration == h ? 'selected' : ''}>${h}h — £${m.rateHour * h}</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${m.id})">✕</button>
    </div>
  `).join('') + `
  <div style="margin-top:auto;padding-top:1rem;border-top:1px solid var(--glass-border)">
    <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:0.5rem"><span>Total</span><span style="font-weight:700">£${sub}</span></div>
    <button class="cart-checkout" onclick="alert('Thank you! Our team will contact you within 1 hour to confirm your booking.')">Confirm Booking</button>
  </div>`;
}

function makeBooking() {
  const m = _pricing.model; if (!m) return;
  const rates = _pricing.type === 'incall' ? m.incallRates : m.outcallRates;
  const rate = rates[_pricing.durationIdx] || rates[0];
  const extrasArr = [];
  _pricing.extras.forEach(i => extrasArr.push(m.extraSvcs[i]));
  const extrasTotal = extrasArr.reduce((s, e) => s + e.price, 0);
  _bookingDraft = {modelId: m.id, modelName: m.name, modelFolder: m.folder, type: _pricing.type, durationLabel: rate.label, basePrice: rate.price, extras: extrasArr, extrasTotal, total: rate.price + extrasTotal};
  _contactMethod = 'email';
  renderCart();
  openCart();
}

function setContactMethod(method) {
  _contactMethod = method;
  document.querySelectorAll('.bf-method').forEach(b => b.classList.toggle('active', b.dataset.m === method));
  const inp = document.getElementById('bf-contact'); if (!inp) return;
  if (method === 'email') { inp.type = 'email'; inp.placeholder = 'your@email.com'; }
  else if (method === 'whatsapp') { inp.type = 'tel'; inp.placeholder = '+44 7000 000000'; }
  else { inp.type = 'text'; inp.placeholder = '@username'; }
  inp.value = '';
}

function formatTimeInput(el) {
  let v = el.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
  el.value = v;
}

async function submitBooking() {
  const nameEl = document.getElementById('bf-name');
  const contactEl = document.getElementById('bf-contact');
  const dateEl = document.getElementById('bf-date');
  const timeEl = document.getElementById('bf-time');
  const name = nameEl ? nameEl.value.trim() : '';
  const contact = contactEl ? contactEl.value.trim() : '';
  const date = dateEl ? dateEl.value : '';
  const time = timeEl ? timeEl.value : '';
  if (!name) { alert('Please enter your name.'); return; }
  if (!contact) { alert('Please enter your contact details.'); return; }
  if (!date) { alert('Please select a date.'); return; }
  if (!time || !/^\d{2}:\d{2}$/.test(time) || +time.slice(0, 2) > 23 || +time.slice(3) > 59) { alert('Please enter a valid time in 24h format (e.g. 14:30).'); return; }
  const d = _bookingDraft;
  const contactLabel = _contactMethod === 'email' ? 'Email' : _contactMethod === 'whatsapp' ? 'WhatsApp' : 'Telegram';
  const extrasText = d.extras.length ? d.extras.map(e => `  • ${e.name} +£${e.price}`).join('\n') : '  None';
  const msg = `🔖 <b>New Booking Request</b>\n\n<b>Model:</b> ${d.modelName}\n<b>Client:</b> ${name}\n<b>${contactLabel}:</b> ${contact}\n\n<b>Session:</b> ${d.durationLabel} · ${d.type === 'incall' ? 'Incall' : 'Outcall'}\n<b>Base:</b> £${d.basePrice}\n\n<b>Extras:</b>\n${extrasText}\n\n<b>Total: £${d.total}</b>\n\n<b>Date:</b> ${date}\n<b>Time:</b> ${time}`;
  const btn = document.querySelector('.booking-submit-btn');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  try {
    const params = new URLSearchParams({chat_id: TG_CHAT, text: msg, parse_mode: 'HTML'});
    const res = await fetch(TG_BOT, {method: 'POST', body: params});
    const json = await res.json();
    if (json.ok) {
      _bookingDraft = null;
      document.getElementById('cartContent').innerHTML = `<div style="text-align:center;padding:3rem 1rem"><div style="font-size:3rem;margin-bottom:1rem">✓</div><div style="font-size:1.1rem;font-weight:600;margin-bottom:0.5rem">Booking Sent!</div><div style="font-size:13px;color:var(--text-soft)">Our team will contact you shortly to confirm your appointment with ${d.modelName}.</div><button onclick="closeCart();renderCart()" style="margin-top:2rem;background:var(--purple);border:none;color:#fff;padding:0.75rem 2rem;border-radius:var(--r);font-size:14px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif">Close</button></div>`;
      document.getElementById('cartBadge').textContent = '0';
    } else { throw new Error(json.description || 'Telegram API error'); }
  } catch(e) {
    if (btn) { btn.textContent = 'Make a Booking'; btn.disabled = false; }
    const waText = encodeURIComponent(`Booking: ${d.modelName} · ${d.durationLabel} · ${d.type === 'incall' ? 'Incall' : 'Outcall'} · £${d.total}\nName: ${name}\nDate: ${date} ${time}`);
    document.getElementById('cartContent').innerHTML += `<div style="margin-top:1rem;padding:1rem;background:rgba(255,80,80,0.08);border:1px solid rgba(255,80,80,0.2);border-radius:var(--r-xs);font-size:13px;color:var(--text-soft)">Couldn't send automatically${e.message && e.message !== 'Failed to fetch' ? ' (' + e.message + ')' : ''}. <a href="https://wa.me/447450842231?text=${waText}" target="_blank" style="color:var(--purple3);text-decoration:none;font-weight:600">Send via WhatsApp →</a></div>`;
  }
}

// =================== REVIEWS ===================
function computeRating(reviews) {
  if (!reviews || !reviews.length) return null;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
}

async function loadReviewsFromSupabase(modelId) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reviews?model_id=eq.${modelId}&approved=eq.true&order=created_at.desc`, {
      headers: {'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`}
    });
    if (!r.ok) return [];
    return await r.json();
  } catch(e) { return []; }
}

async function loadAllReviews() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reviews?approved=eq.true&order=created_at.desc`, {
      headers: {'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`}
    });
    if (!r.ok) return;
    const all = await r.json();
    const byModel = {};
    all.forEach(rv => { (byModel[rv.model_id] = byModel[rv.model_id] || []).push(rv); });
    MODELS.forEach(m => { if (byModel[m.id]) m.reviews = byModel[m.id]; });
    // refresh grids if present
    if (typeof renderHomeRows === 'function') renderHomeRows();
    if (typeof applyFilters === 'function') applyFilters();
  } catch(e) {}
}

async function saveReviewToSupabase(review) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: 'POST',
      headers: {'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'},
      body: JSON.stringify(review)
    });
  } catch(e) {}
}

// =================== MODEL CARD ===================
function modelCardHTML(m, clickable = true) {
  const catBadges = [];
  if (m.cats.includes('new')) catBadges.push('<span class="badge badge-new">New</span>');
  if (m.cats.includes('toprated')) catBadges.push('<span class="badge badge-top">Top Rated</span>');
  if (m.cats.includes('recommended')) catBadges.push('<span class="badge badge-vip">⭐ VIP</span>');
  const topSvcs = m.svcs.slice(0, 3).map(s => `<span class="tag-chip">${s}</span>`).join('');
  const ratingBadge = (() => { const r = computeRating(m.reviews); return r ? `<div class="card-rating-badge">★ ${r}</div>` : ''; })();

  // For real models wrap in link, for fake use onclick
  const cardStart = m.real
    ? `<a class="model-card" href="/models/${m.slug}/" style="text-decoration:none;display:block">`
    : `<div class="model-card" onclick="${clickable ? `openFakeModel(${m.id})` : ''}">`;
  const cardEnd = m.real ? '</a>' : '</div>';

  return `
  ${cardStart}
    <div class="model-card-img" style="${m.real ? `background:url('/${m.folder}/1.webp${window.BUILD_TS ? '?v='+window.BUILD_TS : ''}') top center/cover no-repeat` : `background:linear-gradient(160deg,${m.color[0]} 0%,${m.color[1]} 100%)`}">
      ${!m.real ? `<div class="model-photo-placeholder">
        <svg class="model-silhouette-svg" width="60" height="100" viewBox="0 0 60 100" fill="none">
          <ellipse cx="30" cy="14" rx="13" ry="13" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
          <path d="M8 100 Q8 58 30 52 Q52 58 52 100" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/>
        </svg>
        <div style="font-size:2rem;font-weight:700;color:rgba(255,255,255,0.15)">${m.initials}</div>
      </div>` : ''}
      <div class="model-card-badges">${catBadges.join('')}</div>
      ${ratingBadge}
      <div class="model-card-overlay">
        <div class="model-card-name">${m.name}</div>
        <div class="model-card-meta">${m.age} yrs · ${m.height}cm · ${m.nationality}</div>
        <div class="model-card-tags">${topSvcs}</div>
      </div>
    </div>
    <div class="model-card-footer">
      <div class="model-rate">${m.real ? `<span>from </span>£${Math.min(...m.incallRates.map(r => r.price))}` : `£${m.rateHour}<span>/hr</span>`}</div>
      <button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${m.id})">+ Book</button>
    </div>
  ${cardEnd}`;
}

// =================== FAKE MODEL OVERLAY ===================
function openFakeModel(id) {
  const m = MODELS.find(x => x.id === id);
  if (!m) return;
  const overlay = document.getElementById('fakeModelOverlay');
  if (!overlay) return;
  overlay.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center" onclick="this.remove()">
      <div style="background:#1a0d2e;border:1px solid rgba(123,47,190,0.4);border-radius:16px;padding:2rem;max-width:380px;text-align:center" onclick="event.stopPropagation()">
        <div style="font-size:3rem;margin-bottom:1rem;background:linear-gradient(135deg,${m.color[0]},${m.color[1]});border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2rem;font-weight:700;color:rgba(255,255,255,0.3)">${m.initials}</div>
        <div style="font-size:1.3rem;font-weight:700;margin-bottom:0.5rem">${m.name}</div>
        <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:1.5rem">${m.age} yrs · ${m.nationality}</div>
        <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:1.5rem">This companion's full profile is available by enquiry. Contact us to learn more.</div>
        <button onclick="this.closest('[style*=fixed]').remove()" style="background:linear-gradient(135deg,#7B2FBE,#4a1880);border:none;color:#fff;padding:0.75rem 2rem;border-radius:40px;font-size:14px;font-weight:600;cursor:pointer;font-family:Outfit,sans-serif">Close</button>
      </div>
    </div>`;
}

// =================== HOME SECTIONS ===================
function renderHomeRows() {
  const rec = MODELS.filter(m => m.cats.includes('recommended')).slice(0, 4);
  const u25 = MODELS.filter(m => m.cats.includes('under25')).slice(0, 4);
  const top = MODELS.filter(m => m.cats.includes('toprated')).slice(0, 4);
  const recEl = document.getElementById('recommendedRow');
  const u25El = document.getElementById('under25Row');
  const topEl = document.getElementById('topRatedRow');
  if (recEl) recEl.innerHTML = rec.map(m => modelCardHTML(m)).join('');
  if (u25El) u25El.innerHTML = u25.map(m => modelCardHTML(m)).join('');
  if (topEl) topEl.innerHTML = top.map(m => modelCardHTML(m)).join('');
}

// =================== FAQ ===================
const FAQS = [
  {q: "What is the difference between incall and outcall?", a: "Incall is when you visit the companion at her location — typically her own apartment, a hotel room, or another arranged venue. Outcall is when she travels to meet you at a location of your choosing, whether that's your home, hotel, or elsewhere.\n\nBoth arrangements have their own appeal. Incalls offer a prepared, comfortable setting chosen by the companion, while outcalls give you the convenience and privacy of your own space."},
  {q: "Do you use real, verified photos of the companions?", a: "Yes, always. Every companion on Velvet London is verified before joining our roster. We review their photos personally to ensure what you see in the gallery is an accurate representation of who will arrive.\n\nPhotos are refreshed regularly so you always have a current, honest look at each companion."},
  {q: "Can I book a companion in advance?", a: "Absolutely. Advance bookings are welcome, though we recommend booking no more than one week ahead to ensure accurate availability. Some of our companions visit London for limited periods, so earlier enquiries are always a good idea.\n\nIf you need help planning a booking, our team is happy to assist — just reach out via WhatsApp or Telegram."},
  {q: "Can I book someone for right now?", a: "Yes, in many cases you can. If a companion is available at the time of your request, we can arrange a same-day appointment.\n\nWe work with a real-time availability system — simply tell us who you're interested in and your preferred time, and we'll confirm whether she's free. If not, we can suggest alternatives who are available immediately."},
  {q: "How do I make a booking?", a: "Online: Browse our models page, add companions to your enquiry basket, and submit your request through the site.\n\nTelegram: Message us directly and describe your preferences. We'll suggest companions that fit and handle everything from there — our Telegram contact keeps you updated at every step."},
  {q: "How can I pay for a booking?", a: "Cash: Paid directly to the companion upon arrival. We accept any major currency.\n\nBank Transfer: We support instant peer-to-peer transfers via platforms such as Revolut, making it quick and seamless.\n\nCrypto: We also accept cryptocurrency — USDT, Bitcoin, and Ethereum — sent directly to the companion's wallet."},
  {q: "Can I make a special request?", a: "Of course. Simply let us know what you have in mind when you get in touch, and we'll pass your request to the companion before the appointment. Our team is here to make sure your experience is exactly what you're hoping for."},
  {q: "Can I book a companion for me and my partner?", a: "Yes. We have companions who are happy to spend time with couples. Whether you're looking for a bisexual companion to join you both or simply someone comfortable with the arrangement, we can find the right match.\n\nGet in touch and let us know your preferences — our team will take care of the rest."},
  {q: "Do you have well-known or high-profile companions?", a: "Yes. Our roster includes companions with backgrounds in modelling, entertainment, and public life — including catwalk and commercial models, TV personalities, Instagram influencers, and other notable figures.\n\nIf you're looking for someone with a particular profile or background, let us know and we'll do our best to accommodate."},
  {q: "Can I pay in a currency other than GBP?", a: "Yes. All our rates are listed in British pounds, but we're happy to accept payment in any currency. The equivalent amount is calculated using the live bank exchange rate at the time of your appointment."},
  {q: "Can I book a companion to come to my hotel?", a: "Absolutely. Outcall bookings to hotels across London are a standard part of what we offer. Simply provide the hotel name, your room number, and the name on the reservation when you book.\n\nAll information shared with us is handled with complete discretion — only the people directly involved in the arrangement will have access to your details."},
  {q: "Can companions meet me at the airport?", a: "Yes. Our companions can meet you at any London airport and spend time with you from the moment you arrive — whether that's accompanying you across the city, joining you at meetings, or simply making your visit more enjoyable.\n\nJust let us know your arrival details and we'll arrange everything in advance."},
  {q: "What happens if I pay online and then need to cancel?", a: "If you've paid a deposit online, that payment serves as confirmation of your booking and is non-refundable. Once an appointment begins, cancellation is no longer possible.\n\nIf something unexpected comes up, please contact us as early as possible and we'll do our best to find a fair solution."},
  {q: "What exactly am I paying for?", a: "You are paying for the companion's time. Our role is to connect you with the right person — what you choose to do during that time is entirely between you and her, and remains completely private.\n\nWe do not involve ourselves in what happens during appointments. Everything is confidential."},
  {q: "Where are the companions based?", a: "The majority of our companions are based in Central London and can typically be ready within 30 minutes. You can meet them at their location or yours — whichever suits you best."},
  {q: "Can I travel with a companion outside London?", a: "Yes, this is something we can arrange. Our companions are available for both short trips and longer journeys to other UK cities or internationally.\n\nPlease note that not every companion holds a visa for international travel, so it's important to discuss your plans with us in advance. Additional arrangements such as transport and accommodation may apply."},
  {q: "How does your Telegram bot work?", a: "Our Telegram contact makes the booking process as smooth as possible. Simply message us, tell us your preferences, and we'll handle everything — from suggesting available companions to confirming your appointment and keeping you updated in real time."},
];

function renderFAQs(ids, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const items = ids.map(i => FAQS[i]);
  el.innerHTML = items.map((f, idx) => `
    <div class="faq-item" id="faq-${containerId}-${idx}">
      <div class="faq-q" onclick="toggleFAQ('faq-${containerId}-${idx}')">
        <span>${f.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="faq-a"><div class="faq-a-inner">${f.a.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}</div></div>
    </div>`).join('');
}

function toggleFAQ(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  el.classList.toggle('open', !isOpen);
  const a = el.querySelector('.faq-a');
  a.style.maxHeight = isOpen ? '0' : a.scrollHeight + 'px';
}

// =================== NAV SEARCH ===================
function handleNavSearch(q) {
  const dd = document.getElementById('searchDropdown');
  if (!q.trim()) { dd.innerHTML = ''; dd.classList.remove('show'); return; }
  const res = MODELS.filter(m => m.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  if (!res.length) { dd.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">No results found</div>'; dd.classList.add('show'); return; }
  dd.innerHTML = res.map(m => `
    <div class="search-result-item" onclick="${m.real ? `window.location='/models/${m.slug}/'` : `openFakeModel(${m.id})`}">
      <div class="avatar" style="${m.real ? `background:url('/${m.folder}/1.webp${window.BUILD_TS ? '?v='+window.BUILD_TS : ''}') top center/cover no-repeat` : `background:linear-gradient(135deg,${m.color[0]},${m.color[1]})`}">${m.real ? '' : m.initials}</div>
      <div>
        <div style="font-weight:500;font-size:13px">${m.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">${m.nationality} · ${m.real ? `from £${Math.min(...m.incallRates.map(r => r.price))}` : `£${m.rateHour}/hr`}${(() => { const r = computeRating(m.reviews); return r ? ` · ★ ${r}` : ''; })()}</div>
      </div>
    </div>`).join('');
  dd.classList.add('show');
}

function showSearchDrop() { if (document.getElementById('navSearchInput').value) document.getElementById('searchDropdown').classList.add('show'); }
function hideSearchDrop() { document.getElementById('searchDropdown').classList.remove('show'); }
function navSearchFocus() {
  showSearchDrop();
  document.querySelector('nav').classList.add('search-mode');
}
function navSearchBlur() {
  setTimeout(() => {
    hideSearchDrop();
    document.querySelector('nav').classList.remove('search-mode');
  }, 250);
}
function cancelNavSearch() {
  document.getElementById('navSearchInput').value = '';
  document.getElementById('navSearchInput').blur();
  hideSearchDrop();
  document.querySelector('nav').classList.remove('search-mode');
}
function toggleMobileFilters() {
  const sidebar = document.getElementById('filtersSidebar');
  const btn = document.getElementById('filterToggle');
  const chev = document.getElementById('filterToggleChevron');
  const open = sidebar.classList.toggle('open');
  btn.classList.toggle('active', open);
  chev.style.transform = open ? 'rotate(180deg)' : '';
}

// =================== AGE VERIFICATION ===================
function enterSite() {
  localStorage.setItem('ageVerified', '1');
  const modal = document.getElementById('ageModal');
  if (modal) modal.classList.add('hidden');
}
function exitSite() {
  window.location.href = 'https://www.google.com';
}

// Init age check on load
(function() {
  if (localStorage.getItem('ageVerified')) {
    const modal = document.getElementById('ageModal');
    if (modal) modal.classList.add('hidden');
  }
})();

// Init cart badge on load
(function() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = cart.length;
})();
