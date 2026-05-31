// =================== PROFILE PAGE ===================
let _gallery = {photos: [], current: 0};
let _pricing = {type: 'incall', durationIdx: 0, extras: new Set(), model: null};
let _reviewRating = 0;

// =================== GALLERY ===================
function probeModelPhotos(folder, cb) {
  const found = []; let done = 0; const max = 20;
  for (let i = 1; i <= max; i++) {
    const img = new Image(); const idx = i;
    img.onload = () => { found.push({idx, src: img.src}); finish(); };
    img.onerror = finish;
    img.src = `/${folder}/${idx}.webp${window.BUILD_TS ? '?v=' + window.BUILD_TS : ''}`;
  }
  function finish() { if (++done === max) cb(found.sort((a, b) => a.idx - b.idx).map(x => x.src)); }
}

function _galleryMove() {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  const w = track.parentElement.offsetWidth;
  track.style.transform = `translateX(-${_gallery.current * w}px)`;
  document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === _gallery.current));
  const ctr = document.getElementById('gallery-counter');
  if (ctr) ctr.textContent = `${_gallery.current + 1} / ${_gallery.photos.length}`;
}

function galleryGo(dir) {
  const n = _gallery.photos.length; if (!n) return;
  _gallery.current = (_gallery.current + dir + n) % n;
  _galleryMove();
}

function galleryGoTo(idx) {
  _gallery.current = idx;
  _galleryMove();
}

function initGalleryTouch() {
  const el = document.querySelector('.detail-gallery');
  if (!el) return;
  let sx = 0, sy = 0;
  el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, {passive: true});
  el.addEventListener('touchend', e => {
    const dx = sx - e.changedTouches[0].clientX;
    const dy = sy - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) galleryGo(dx > 0 ? 1 : -1);
  }, {passive: true});
}

// =================== PRICING ===================
function selectPriceType(type) {
  _pricing.type = type; _pricing.durationIdx = 0; _pricing.extras = new Set();
  document.querySelectorAll('.price-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  const rates = type === 'incall' ? _pricing.model.incallRates : _pricing.model.outcallRates;
  const dur = document.getElementById('duration-btns');
  if (dur) dur.innerHTML = rates.map((r, i) => `<button class="duration-btn${i === 0 ? ' active' : ''}" onclick="selectDuration(${i})">${r.label}</button>`).join('');
  document.querySelectorAll('.extra-svc-chk').forEach(c => c.classList.remove('on'));
  refreshPriceDisplay();
}

function selectDuration(idx) {
  _pricing.durationIdx = idx;
  document.querySelectorAll('.duration-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
  refreshPriceDisplay();
}

function toggleExtraSvc(idx) {
  if (_pricing.extras.has(idx)) _pricing.extras.delete(idx);
  else _pricing.extras.add(idx);
  const rows = document.querySelectorAll('.extra-svc-row');
  if (rows[idx]) rows[idx].querySelector('.extra-svc-chk').classList.toggle('on', _pricing.extras.has(idx));
  refreshPriceDisplay();
}

function refreshPriceDisplay() {
  const m = _pricing.model; if (!m) return;
  const rates = _pricing.type === 'incall' ? m.incallRates : m.outcallRates;
  const rate = rates[_pricing.durationIdx] || rates[0];
  let extras = 0; _pricing.extras.forEach(i => extras += m.extraSvcs[i].price);
  const total = rate.price + extras;
  const pEl = document.getElementById('price-main');
  const sEl = document.getElementById('price-sub');
  const tEl = document.getElementById('price-total-val');
  if (pEl) pEl.textContent = `£${total}`;
  if (sEl) sEl.textContent = `${rate.label} · ${_pricing.type === 'incall' ? 'Incall' : 'Outcall'}${extras ? ` + £${extras} extras` : ''}`;
  if (tEl) tEl.textContent = `£${total}`;
}

// =================== REVIEWS ===================
function renderReviewsList(reviews) {
  const rating = computeRating(reviews);
  if (!reviews.length) return `<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:1rem 0">No reviews yet — be the first to leave one.</div>`;
  return `
    <div class="section-label" style="margin-bottom:0.5rem">Reviews (${reviews.length})${rating ? ` · ★ ${rating} avg` : ''}</div>
    ${reviews.map(r => `
    <div style="padding:0.75rem 0">
      <div class="review-header">
        <span class="review-name">${r.name}</span>
        <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <div class="review-meta" style="margin-bottom:0.5rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(176,127,222,0.15)">${r.duration} · ${r.type === 'incall' ? 'Incall' : 'Outcall'} · ${r.date}</div>
      <div class="review-text">${r.text}</div>
    </div>`).join('')}`;
}

function reviewDurationOptions(m, type) {
  const rates = type === 'outcall' ? m.outcallRates : m.incallRates;
  return rates.map(r => `<option value="${r.label}">${r.label}</option>`).join('');
}

function setReviewStar(n) {
  _reviewRating = n;
  document.querySelectorAll('.star-picker button').forEach((b, i) => b.classList.toggle('active', i < n));
}

function selectReviewType(el, t) {
  document.querySelectorAll('.rv-type-btn').forEach(b => b.classList.toggle('active', b === el));
  const sel = document.getElementById('rv-duration');
  if (sel && _pricing.model) sel.innerHTML = reviewDurationOptions(_pricing.model, t);
}

async function submitReview(modelId) {
  const m = MODELS.find(x => x.id === modelId); if (!m) return;
  const nameEl = document.getElementById('rv-name');
  const durEl = document.getElementById('rv-duration');
  const typeEl = document.querySelector('.rv-type-btn.active');
  const textEl = document.getElementById('rv-text');
  const name = nameEl ? nameEl.value.trim() : '';
  const dur = durEl ? durEl.value : '';
  const type = typeEl ? typeEl.dataset.t : 'incall';
  const text = textEl ? textEl.value.trim() : '';
  if (!name) { alert('Please enter your name.'); return; }
  if (!_reviewRating) { alert('Please select a star rating.'); return; }
  if (!text) { alert('Please write a short review.'); return; }
  const btn = document.getElementById('rv-submit');
  if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
  const today = new Date().toISOString().slice(0, 10);
  const review = {model_id: modelId, name, duration: dur, type, rating: _reviewRating, text, date: today, approved: true};
  const tgMsg = `⭐ <b>New Review</b>\n\n<b>Model:</b> ${m.name}\n<b>From:</b> ${name}\n<b>Duration:</b> ${dur} · ${type === 'incall' ? 'Incall' : 'Outcall'}\n<b>Rating:</b> ${'★'.repeat(_reviewRating)}${'☆'.repeat(5 - _reviewRating)} (${_reviewRating}/5)\n\n${text}`;
  try {
    // Critical: save to database. This is the source of truth.
    await saveReviewToSupabase(review);
    // Best-effort: notify Telegram. Must not block or fail the submission.
    fetch(TG_BOT, {
      method: 'POST', body: new URLSearchParams({chat_id: TG_CHAT_REVIEWS, text: tgMsg, parse_mode: 'HTML'})
    }).catch(() => {});
    m.reviews = (m.reviews || []).concat(review);
    const listEl = document.getElementById('reviews-list');
    if (listEl) listEl.innerHTML = renderReviewsList(m.reviews);
    const ratingEl = document.getElementById('model-rating-display');
    const r = computeRating(m.reviews);
    if (ratingEl) ratingEl.innerHTML = r ? `<span style="color:#FFD700;font-size:14px">★ ${r}</span>` : '';
    _reviewRating = 0;
    const form = document.getElementById('rv-form');
    if (form) form.innerHTML = `<div style="text-align:center;padding:1.5rem 0">
      <div style="font-size:2rem;margin-bottom:0.5rem">✓</div>
      <div style="font-weight:600;margin-bottom:0.35rem">Thank you!</div>
      <div style="font-size:13px;color:var(--text-soft)">Your review has been published.</div>
    </div>`;
  } catch(e) {
    if (btn) { btn.textContent = 'Submit Review'; btn.disabled = false; }
    alert('Something went wrong. Please try again.');
  }
}

// =================== MODEL DETAIL BUILDER ===================
function buildRealModelHTML(m) {
  const initRate = m.incallRates[0];
  const stats = [
    ['Age', m.age], ['Height', `${m.height}cm`], ['Weight', `${m.weight}kg`], ['Clothing', m.clothingSize],
    ['Breast', m.breastSize], ['Type', m.breastType], ['Eyes', m.eyeColor], ['Hair', m.hairColor],
  ];
  const reviews = m.reviews || [];
  const rating = computeRating(reviews);
  const mapQ = encodeURIComponent(m.station + ' Underground Station London');
  const durOptions = reviewDurationOptions(m, 'incall');
  return `
    <a class="back-btn" href="/models/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Models
    </a>
    <div class="real-detail-layout">
      <div class="detail-left">
        <div class="detail-gallery">
          <div class="gallery-track" id="gallery-track">
            <img class="gallery-slide" src="/${m.folder}/1.webp" alt="${m.name}">
          </div>
          <button class="gallery-arrow prev" onclick="galleryGo(-1)">&#8249;</button>
          <button class="gallery-arrow next" onclick="galleryGo(1)">&#8250;</button>
          <div class="gallery-dots" id="gallery-dots"><span class="gallery-dot active"></span></div>
          <div class="gallery-counter" id="gallery-counter">1 / 1</div>
        </div>
        <div class="model-bio">
          ${m.description.map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
      <div class="model-detail-info">
        <div>
          <div class="model-detail-name">${m.name}</div>
          <div style="color:var(--text-soft);font-size:14px;margin-top:4px">${m.nationality} · ${m.station}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
            <span id="model-rating-display">${rating ? `<span style="color:#FFD700;font-size:14px">★ ${rating}</span>` : ''}</span>
            ${m.cats.includes('toprated') ? '<span class="badge badge-top">Top Rated</span>' : ''}
            ${m.cats.includes('new') ? '<span class="badge badge-new">New</span>' : ''}
          </div>
        </div>
        <div class="stat-grid-ext">
          ${stats.map(([l, v]) => `<div class="stat-box"><div class="stat-label">${l}</div><div class="stat-val" style="font-size:0.82rem">${v}</div></div>`).join('')}
        </div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px">
          <span style="color:var(--text-muted);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Languages:</span>
          ${m.languages.split(' · ').map(l => `<span class="service-chip">${l}</span>`).join('')}
        </div>
        <div style="display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px">
          <span style="color:var(--text-muted);font-size:11px;text-transform:uppercase;letter-spacing:0.08em">Orientation:</span>
          <span class="service-chip">${m.orientation}</span>
        </div>
        <div class="price-calc">
          <div class="price-calc-title">Book a Session</div>
          <div class="price-type-row">
            <button class="price-type-btn active" data-type="incall" onclick="selectPriceType('incall')">Incall</button>
            <button class="price-type-btn" data-type="outcall" onclick="selectPriceType('outcall')">Outcall <span style="font-size:10px;opacity:0.6">min 1hr</span></button>
          </div>
          <div class="duration-row" id="duration-btns">
            ${m.incallRates.map((r, i) => `<button class="duration-btn${i === 0 ? ' active' : ''}" onclick="selectDuration(${i})">${r.label}</button>`).join('')}
          </div>
          <div class="price-display-row">
            <div id="price-main" class="price-main">£${initRate.price}</div>
          </div>
          <div id="price-sub" class="price-sub">${initRate.label} · Incall</div>
          <div class="price-total-bar">
            <span class="price-total-label">Total</span>
            <span class="price-total-val" id="price-total-val">£${initRate.price}</span>
          </div>
        </div>
        <button class="make-booking-btn" onclick="makeBooking()">Make a Booking</button>
        <div class="model-detail-services">
          <div class="services-title">Services Offered</div>
          <div class="services-chips">${m.svcs.map(s => `<span class="service-chip">${s}</span>`).join('')}</div>
        </div>
        <div class="model-detail-services">
          <div class="services-title">Extra Services</div>
          <div class="extra-svc-list">
            ${m.extraSvcs.map((s, i) => `
            <div class="extra-svc-row" onclick="toggleExtraSvc(${i})">
              <div class="extra-svc-left">
                <div class="extra-svc-chk">✓</div>
                <span class="extra-svc-name">${s.name}</span>
              </div>
              <span class="extra-svc-price">+£${s.price}</span>
            </div>`).join('')}
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);text-align:center">${m.nationality} · ${m.orientation} · Available daily 10:00 AM – 2:00 AM</div>
      </div>
      <div class="model-map-block">
        <iframe src="https://maps.google.com/maps?q=${mapQ}&z=15&output=embed" loading="lazy"></iframe>
      </div>
      <div class="reviews-section">
      <div class="review-card" id="reviews-list">
        <div style="color:var(--text-muted);font-size:13px;text-align:center;padding:0.5rem 0">Loading reviews…</div>
      </div>
      <div class="review-form" id="rv-form">
        <div class="review-form-title">Leave a Review</div>
        <div class="bf-label">Your name</div>
        <input class="bf-input" type="text" id="rv-name" placeholder="e.g. James">
        <div class="bf-label">Duration</div>
        <select class="bf-input" id="rv-duration">${durOptions}</select>
        <div class="bf-label">Type</div>
        <div style="display:flex;gap:6px;margin-bottom:0.25rem">
          <button class="bf-method rv-type-btn active" data-t="incall" onclick="selectReviewType(this,'incall')">Incall</button>
          <button class="bf-method rv-type-btn" data-t="outcall" onclick="selectReviewType(this,'outcall')">Outcall</button>
        </div>
        <div class="bf-label">Your rating</div>
        <div class="star-picker">
          ${[1, 2, 3, 4, 5].map(n => `<button onclick="setReviewStar(${n})">★</button>`).join('')}
        </div>
        <div class="bf-label">Your review</div>
        <textarea class="bf-input" id="rv-text" rows="4" placeholder="Share your experience…" style="resize:vertical;font-family:Outfit,sans-serif"></textarea>
        <button class="review-submit-btn" id="rv-submit" onclick="submitReview(${m.id})">Submit Review</button>
        <div style="font-size:11px;color:var(--text-muted);margin-top:0.5rem;text-align:center">Your review is published instantly. Inappropriate reviews may be removed.</div>
      </div>
    </div>
    </div>`;
}

function openRealModel(m) {
  _pricing = {type: 'incall', durationIdx: 0, extras: new Set(), model: m};
  _gallery = {photos: [], current: 0};
  m.reviews = m.reviews || [];
  const container = document.getElementById('modelDetailContent');
  if (container) container.innerHTML = buildRealModelHTML(m);
  initGalleryTouch();
  loadReviewsFromSupabase(m.id).then(reviews => {
    m.reviews = reviews;
    const listEl = document.getElementById('reviews-list');
    if (listEl) listEl.innerHTML = renderReviewsList(reviews);
    const ratingEl = document.getElementById('model-rating-display');
    const r = computeRating(reviews);
    if (ratingEl) ratingEl.innerHTML = r ? `<span style="color:#FFD700;font-size:14px">★ ${r}</span>` : '';
  });
  probeModelPhotos(m.folder, photos => {
    _gallery.photos = photos;
    const track = document.getElementById('gallery-track');
    if (!track) return;
    track.innerHTML = photos.map(src => `<img class="gallery-slide" src="${src}" alt="${m.name}">`).join('');
    const dotsEl = document.getElementById('gallery-dots');
    if (dotsEl) dotsEl.innerHTML = photos.map((_, i) => `<span class="gallery-dot${i === 0 ? ' active' : ''}" onclick="galleryGoTo(${i})"></span>`).join('');
    const ctr = document.getElementById('gallery-counter');
    if (ctr) ctr.textContent = `1 / ${photos.length}`;
    if (photos.length <= 1) document.querySelectorAll('.gallery-arrow').forEach(a => a.style.display = 'none');
  });
}
