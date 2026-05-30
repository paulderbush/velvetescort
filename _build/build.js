'use strict';
const fs = require('fs');
const path = require('path');

// Load CSS
const css = fs.readFileSync(path.join(__dirname, '../assets/style.css'), 'utf8');

// Load models
const { MODELS, SERVICES, NATIONALITIES, STATIONS } = require('../data/models.js');
const REAL_MODELS = MODELS.filter(m => m.real);
const SITE_URL = 'https://velvetescort.co.uk';

// =================== SHARED PARTS ===================

function head(title, desc, canonical, extra = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" href="/images/favicon.png?v=2">
<link rel="shortcut icon" type="image/png" href="/images/favicon.png?v=2">
<link rel="apple-touch-icon" href="/images/favicon.png?v=2">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${css}</style>
${extra}
</head>`;
}

function navHTML() {
  return `<!-- CART OVERLAY -->
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>

<!-- CART PANEL -->
<div class="cart-panel" id="cartPanel">
  <div class="cart-header">
    <h3 id="cartPanelTitle">Your Booking</h3>
    <button class="cart-close" onclick="closeCart()">✕</button>
  </div>
  <div id="cartContent">
    <div class="cart-empty">No companions selected yet.<br>Browse our models to get started.</div>
  </div>
</div>

<!-- NAV -->
<nav>
  <a class="nav-logo" href="/" style="cursor:pointer;text-decoration:none">VELVET</a>
  <div class="nav-search" id="navSearch">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <input type="text" placeholder="Search models…" id="navSearchInput" oninput="handleNavSearch(this.value)" onfocus="navSearchFocus()" onblur="navSearchBlur()">
    <div class="search-dropdown" id="searchDropdown"></div>
  </div>
  <button class="nav-search-cancel" id="navSearchCancel" onclick="cancelNavSearch()">Cancel</button>
  <div class="nav-cart glass" onclick="openCart()" style="cursor:pointer;padding:0.45rem 0.9rem;border-radius:var(--r);display:flex;align-items:center;gap:6px;font-size:13px;transition:all 0.25s;white-space:nowrap;color:var(--text);">
    Booking
    <div class="cart-badge" id="cartBadge">0</div>
  </div>
  <a class="nav-btn" href="/models/" style="text-decoration:none">Models</a>
  <div class="nav-badge"><span class="dot"></span>London's Premier Escort Agency</div>
</nav>`;
}

function footerHTML() {
  return `<!-- SHARED FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-left">
      <p>© 2026 Velvet London. All rights reserved. For adults 18+ only.</p>
    </div>
    <div class="footer-btns">
      <a href="https://wa.me/447450842231?text=Hello%20Velvet%20Agency%20%F0%9F%91%8B%F0%9F%8F%BC" class="btn-wa" target="_blank" style="font-size:13px;padding:0.5rem 1.1rem">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        WhatsApp
      </a>
      <a href="https://t.me/velvetescortlondon?text=Hello%20Velvet%20Agency%20%F0%9F%91%8B%F0%9F%8F%BC" class="btn-tg" target="_blank" style="font-size:13px;padding:0.5rem 1.1rem">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </a>
      <a href="/become-a-model/" class="btn-model-cta" style="font-size:13px;padding:0.5rem 1.1rem;text-decoration:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Become a Model
      </a>
    </div>
  </div>
</footer>`;
}

function ageModalHTML() {
  return `<!-- AGE VERIFICATION MODAL -->
<div id="ageModal" class="age-modal-overlay">
  <div class="age-modal-box">
    <h2 class="age-modal-title">This is an adult website</h2>
    <p class="age-modal-text">This website contains adult-oriented material and is intended strictly for individuals aged 18 years or over, in accordance with the laws of the United Kingdom.</p>
    <p class="age-modal-text">By clicking "Yes", you confirm that:</p>
    <ul class="age-modal-list">
      <li>You are 18 years of age or older;</li>
      <li>You are accessing this site voluntarily;</li>
      <li>You understand and accept the terms of use and privacy policy of this website</li>
    </ul>
    <p class="age-modal-text">If you are under 18 or do not wish to proceed, please click "No" to leave.</p>
    <div class="age-modal-btns">
      <button class="age-btn-no" onclick="exitSite()">No – Exit</button>
      <button class="age-btn-yes" onclick="enterSite()">Yes – I'm 18 or older</button>
    </div>
  </div>
</div>`;
}

function fakeModelOverlayHTML() {
  return '<div id="fakeModelOverlay"></div>';
}

function orbsHTML() {
  return `<div class="orb-container">
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="orb orb3"></div>
</div>`;
}

function modelsDataScript() {
  // Serialize MODELS for browser use (with reviews reset to empty)
  const data = MODELS.map(m => {
    const copy = Object.assign({}, m);
    copy.reviews = [];
    return copy;
  });
  return `<script>
const MODELS = ${JSON.stringify(data)};
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>`;
}

// =================== HOME PAGE ===================
function buildHome() {
  return head(
    'Velvet London — Elite Escort Agency',
    'Velvet London offers exclusive social companionship for private, business, and leisure occasions — always discreet, always refined.',
    SITE_URL + '/'
  ) + `
<body>
${orbsHTML()}
${navHTML()}
${ageModalHTML()}
${fakeModelOverlayHTML()}

<!-- HOME PAGE -->
<div style="position:relative;z-index:1">

  <!-- HERO -->
  <div class="hero" style="position:relative;z-index:1">
    <div class="hero-bg"></div>
    <div class="hero-content">
      <div class="hero-hours">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Available daily · 10:00 AM – 2:00 AM
      </div>
      <h1>Elite companions for <span>discerning</span> gentlemen</h1>
      <p class="hero-sub">Velvet London offers exclusive social companionship for private, business, and leisure occasions — always discreet, always refined.</p>
      <div class="hero-btns">
        <a href="https://wa.me/447450842231?text=Hello%20Velvet%20Agency%20%F0%9F%91%8B%F0%9F%8F%BC" class="btn-wa" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <a href="https://t.me/velvetescortlondon?text=Hello%20Velvet%20Agency%20%F0%9F%91%8B%F0%9F%8F%BC" class="btn-tg" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Telegram
        </a>
        <a href="/become-a-model/" class="btn-model-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Become a Model
        </a>
      </div>
    </div>
  </div>

  <!-- RECOMMENDED -->
  <div class="section">
    <div class="section-header">
      <div class="section-title">⭐ <span>Recommended</span> Girls</div>
      <a class="see-all" href="/models/">See all →</a>
    </div>
    <div class="models-row" id="recommendedRow"></div>
  </div>

  <!-- UNDER 25 -->
  <div class="section" style="padding-top:0">
    <div class="section-header">
      <div class="section-title">🌸 <span>Under 25</span></div>
      <a class="see-all" href="/models/">See all →</a>
    </div>
    <div class="models-row" id="under25Row"></div>
  </div>

  <!-- TOP RATED -->
  <div class="section" style="padding-top:0">
    <div class="section-header">
      <div class="section-title">🏆 <span>Top Rated</span></div>
      <a class="see-all" href="/models/">See all →</a>
    </div>
    <div class="models-row" id="topRatedRow"></div>
  </div>

  <!-- FAQ -->
  <div class="faq-section">
    <div class="section-title" style="margin-bottom:0.3rem">Frequently Asked <span>Questions</span></div>
    <p style="color:var(--text-soft);font-size:14px;margin-bottom:1.5rem">Everything you need to know before making a booking.</p>
    <div id="faqHome"></div>
    <div class="faq-see-all">
      <a class="see-all" href="/faq/">See all FAQs →</a>
    </div>
  </div>

  <!-- PARTNERS -->
  <div class="partners-section">
    <div class="partners-title">Our Partners</div>
    <div class="partners-row">
      <a class="partner-banner" href="https://www.eurogirlsescort.com" target="_blank" rel="noopener noreferrer">
        <img src="/images/EuroEscortGirls.png" alt="EuroGirlsEscort.com">
      </a>
    </div>
  </div>

</div>

${footerHTML()}
${modelsDataScript()}
<script src="/assets/main.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderHomeRows();
  loadAllReviews();
  renderFAQs([0,1,2], 'faqHome');
});
<\/script>
</body>
</html>`;
}

// =================== MODELS CATALOG PAGE ===================
function buildModels() {
  return head(
    'Our Companions — Velvet London',
    'Browse our exclusive roster of London companions. Filter by location, nationality, services and more.',
    SITE_URL + '/models/'
  ) + `
<body>
${orbsHTML()}
${navHTML()}
${ageModalHTML()}
${fakeModelOverlayHTML()}

<div style="position:relative;z-index:1">
  <div class="models-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back
    </a>
    <div class="models-page-header">
      <h1>Our <span style="background:linear-gradient(135deg,#C49FEE,#8B3FCA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Companions</span></h1>
      <p style="color:var(--text-soft)">Browse and filter our exclusive roster of London companions</p>
    </div>
    <div class="models-layout">
      <!-- MOBILE FILTER TOGGLE -->
      <button class="mobile-filter-toggle" id="filterToggle" onclick="toggleMobileFilters()">
        <span style="display:flex;align-items:center;gap:8px"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>Choose Filters</span>
        <svg id="filterToggleChevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <!-- SIDEBAR -->
      <div class="filters-sidebar" id="filtersSidebar">
        <div style="font-size:1rem;font-weight:700;margin-bottom:1.2rem">Filters</div>

        <!-- Category -->
        <div class="filter-group">
          <div class="filter-title">Category</div>
          <div class="filter-chips" id="catChips">
            <button class="filter-chip active" data-cat="all" onclick="setCat(this,'all')">All</button>
            <button class="filter-chip" data-cat="recommended" onclick="setCat(this,'recommended')">Recommended</button>
            <button class="filter-chip" data-cat="under25" onclick="setCat(this,'under25')">Under 25</button>
            <button class="filter-chip" data-cat="toprated" onclick="setCat(this,'toprated')">Top Rated</button>
            <button class="filter-chip" data-cat="new" onclick="setCat(this,'new')">New Models</button>
          </div>
        </div>

        <!-- Location -->
        <div class="filter-group">
          <div class="filter-title">Location (London Underground)</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search station…" oninput="filterStations(this.value)" id="stationSearch">
          </div>
          <div class="filter-list" id="stationList"></div>
        </div>

        <!-- Nationality -->
        <div class="filter-group">
          <div class="filter-title">Nationality</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search nationality…" oninput="filterNat(this.value)" id="natSearch">
          </div>
          <div class="filter-list" id="natList"></div>
        </div>

        <!-- Age -->
        <div class="filter-group">
          <div class="filter-title">Age</div>
          <div class="range-wrap" id="ageWrap">
            <div class="range-row"><span>18</span><span class="range-vals" id="ageVals">18 – 60</span><span>60</span></div>
            <div class="range-track" id="ageTrack">
              <div class="range-fill" id="ageFill"></div>
              <input type="range" min="18" max="60" value="18" id="ageMin" oninput="updateRange('age')">
              <input type="range" min="18" max="60" value="60" id="ageMax" oninput="updateRange('age')">
            </div>
          </div>
        </div>

        <!-- Weight -->
        <div class="filter-group">
          <div class="filter-title">Weight (kg)</div>
          <div class="range-wrap" id="weightWrap">
            <div class="range-row"><span>40</span><span class="range-vals" id="weightVals">40 – 100</span><span>100</span></div>
            <div class="range-track" id="weightTrack">
              <div class="range-fill" id="weightFill"></div>
              <input type="range" min="40" max="100" value="40" id="weightMin" oninput="updateRange('weight')">
              <input type="range" min="40" max="100" value="100" id="weightMax" oninput="updateRange('weight')">
            </div>
          </div>
        </div>

        <!-- Height -->
        <div class="filter-group">
          <div class="filter-title">Height (cm)</div>
          <div class="range-wrap" id="heightWrap">
            <div class="range-row"><span>150</span><span class="range-vals" id="heightVals">150 – 185</span><span>185</span></div>
            <div class="range-track" id="heightTrack">
              <div class="range-fill" id="heightFill"></div>
              <input type="range" min="150" max="185" value="150" id="heightMin" oninput="updateRange('height')">
              <input type="range" min="150" max="185" value="185" id="heightMax" oninput="updateRange('height')">
            </div>
          </div>
        </div>

        <!-- Services -->
        <div class="filter-group">
          <div class="filter-title">Services</div>
          <div class="filter-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search service…" oninput="filterSvc(this.value)" id="svcSearch">
          </div>
          <div class="services-wrap filter-list" id="svcList"></div>
        </div>

        <button class="clear-filters" onclick="clearFilters()">✕ Clear all filters</button>
      </div>

      <!-- GRID -->
      <div>
        <div class="filters-top-bar">
          <div class="results-count" id="resultsCount">Showing all models</div>
          <select class="sort-select" onchange="sortModels(this.value)">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="age-asc">Age: Youngest first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
        <div class="models-grid-main" id="modelsGrid"></div>
      </div>
    </div>
  </div>
</div>

${footerHTML()}
${modelsDataScript()}
<script src="/assets/main.js"><\/script>
<script src="/assets/catalog.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  initModelsPage();
  loadAllReviews();
});
<\/script>
</body>
</html>`;
}

// =================== MODEL PROFILE PAGE ===================
function buildModelProfile(m) {
  const initRate = m.incallRates[0];
  const minPrice = Math.min(...m.incallRates.map(r => r.price));
  const desc = `${m.name} — ${m.nationality} escort in London. Available for incall from £${minPrice}. Book now at Velvet London.`;

  return head(
    `${m.name} — Elite London Escort | Velvet London`,
    desc,
    `${SITE_URL}/models/${m.slug}/`,
    `<meta property="og:image" content="${SITE_URL}/${m.folder}/1.webp">`
  ) + `
<body>
${orbsHTML()}
${navHTML()}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="model-detail-page" id="modelDetailContent">
    <div style="text-align:center;padding:4rem;color:var(--text-muted)">Loading profile…</div>
  </div>
</div>

${footerHTML()}
<script>
const MODEL_DATA = ${JSON.stringify(Object.assign({}, m, {reviews: []}))};
const MODELS = [MODEL_DATA];
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>
<script src="/assets/main.js"><\/script>
<script src="/assets/profile.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  openRealModel(MODEL_DATA);
});
<\/script>
</body>
</html>`;
}

// =================== FAQ PAGE ===================
function buildFaq() {
  return head(
    'FAQ — Velvet London',
    'Frequently asked questions about our services, companions, and bookings at Velvet London.',
    SITE_URL + '/faq/'
  ) + `
<body>
${orbsHTML()}
${navHTML()}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="faq-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <h1>FAQ — <span style="background:linear-gradient(135deg,#C49FEE,#8B3FCA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">All Questions</span></h1>
    <p class="sub">Frequently asked questions about our services, companions, and bookings.</p>
    <div id="faqAll"></div>
  </div>
</div>

${footerHTML()}
<script>
const MODELS = [];
const SERVICES = [];
const NATIONALITIES = [];
const STATIONS = [];
<\/script>
<script src="/assets/main.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  const allIds = Array.from({length: 17}, (_, i) => i);
  renderFAQs(allIds, 'faqAll');
});
<\/script>
</body>
</html>`;
}

// =================== BECOME A MODEL PAGE ===================
function buildBecome() {
  return head(
    'Become a Model — Velvet London',
    'Apply to join Velvet London as an escort companion. Submit your application and our team will review within 24–48 hours.',
    SITE_URL + '/become-a-model/'
  ) + `
<body>
${orbsHTML()}
${navHTML()}
${ageModalHTML()}

<div style="position:relative;z-index:1">
  <div class="become-page">
    <a class="back-btn" href="/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Back to Home
    </a>
    <div class="become-header">
      <h1>Become a <span style="background:linear-gradient(135deg,#C49FEE,#8B3FCA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Model</span></h1>
      <p>Fill in the application below. Our team will review your profile within 24–48 hours.</p>
    </div>
    <div id="becomeFormWrap">
    <form id="becomeForm" onsubmit="submitApplication(event)">

      <!-- PERSONAL INFO -->
      <div class="form-section">
        <div class="form-section-title">Personal Information</div>
        <div class="form-grid-2">
          <div class="form-field"><label>Real Name *</label><input class="form-input" type="text" name="realName" placeholder="Legal name" required></div>
          <div class="form-field"><label>Working Name *</label><input class="form-input" type="text" name="workingName" placeholder="Model name" required></div>
          <div class="form-field"><label>Phone Number *</label><input class="form-input" type="tel" name="phone" placeholder="+44 7700 000000" required></div>
          <div class="form-field"><label>Telegram Username</label><input class="form-input" type="text" name="telegram" placeholder="@username"></div>
          <div class="form-field"><label>Age *</label><input class="form-input" type="number" name="age" placeholder="18" min="18" max="60" required></div>
          <div class="form-field"><label>Nationality *</label><input class="form-input" type="text" name="nationality" placeholder="e.g. Russian" required></div>
        </div>
      </div>

      <!-- PHYSICAL -->
      <div class="form-section">
        <div class="form-section-title">Physical Details</div>
        <div class="form-grid-3">
          <div class="form-field"><label>Height (cm) *</label><input class="form-input" type="number" name="height" placeholder="168" min="150" max="185" required></div>
          <div class="form-field"><label>Weight (kg) *</label><input class="form-input" type="number" name="weight" placeholder="55" min="40" max="100" required></div>
          <div class="form-field"><label>Dress Size (UK)</label><input class="form-input" type="text" name="dress" placeholder="8, 10, 12…"></div>
          <div class="form-field"><label>Feet Size (UK)</label><input class="form-input" type="text" name="feet" placeholder="4, 5, 6…"></div>
          <div class="form-field"><label>Breast Size</label><input class="form-input" type="text" name="breast" placeholder="32B, 34C…"></div>
        </div>
        <div class="form-grid-2" style="margin-top:1rem">
          <div class="form-field"><label>Breast Type</label><div class="btn-group" id="breastType"><button type="button" class="btn-option" onclick="selectOpt('breastType',this)">Natural</button><button type="button" class="btn-option" onclick="selectOpt('breastType',this)">Silicone</button></div></div>
          <div class="form-field"><label>Do You Smoke?</label><div class="btn-group" id="smoke"><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">No</button><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">Sometimes</button><button type="button" class="btn-option" onclick="selectOpt('smoke',this)">Yes</button></div></div>
          <div class="form-field"><label>Eyes Colour</label><div class="btn-group" id="eyes"><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Brown</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Blue</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Green</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Grey</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Hazel</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Amber</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Black</button><button type="button" class="btn-option" onclick="selectOpt('eyes',this)">Mixed</button></div></div>
          <div class="form-field"><label>Hair Colour</label><div class="btn-group" id="hair"><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Light Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Dark Blonde</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Brown</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Dark Brown</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Black</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Red</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Auburn</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">Platinum</button><button type="button" class="btn-option" onclick="selectOpt('hair',this)">White/Grey</button></div></div>
          <div class="form-field"><label>Tattoo</label><div class="btn-group" id="tattoo"><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">None</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Small</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Medium</button><button type="button" class="btn-option" onclick="selectOpt('tattoo',this)">Large</button></div></div>
          <div class="form-field"><label>Piercing</label><div class="btn-group" id="piercing"><button type="button" class="btn-option" onclick="toggleOpt(this)">None</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Ears</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Nose</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Eyebrow</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Lip</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Tongue</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Belly Button</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Nipples</button><button type="button" class="btn-option" onclick="toggleOpt(this)">Intimate</button></div></div>
        </div>
      </div>

      <!-- LANGUAGES -->
      <div class="form-section">
        <div class="form-section-title">Languages</div>
        <div id="langRows"></div>
        <button type="button" class="add-lang-btn" onclick="addLangRow()">+ Add another language</button>
      </div>

      <!-- PREFERENCES -->
      <div class="form-section">
        <div class="form-section-title">Preferences &amp; Orientation</div>
        <div class="form-grid-2">
          <div class="form-field"><label>Orientation</label><div class="btn-group" id="orientation"><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Straight</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Bisexual</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Lesbian</button><button type="button" class="btn-option" onclick="selectOpt('orientation',this)">Gay</button></div></div>
          <div class="form-field"><label>Work With Couples?</label><div class="btn-group" id="couples"><button type="button" class="btn-option" onclick="selectOpt('couples',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('couples',this)">No</button></div></div>
          <div class="form-field"><label>Work With Women?</label><div class="btn-group" id="women"><button type="button" class="btn-option" onclick="selectOpt('women',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('women',this)">No</button></div></div>
          <div class="form-field"><label>Work With Black Clients?</label><div class="btn-group" id="blackClients"><button type="button" class="btn-option" onclick="selectOpt('blackClients',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('blackClients',this)">No</button></div></div>
          <div class="form-field"><label>Work With Disabled Clients?</label><div class="btn-group" id="disabledClients"><button type="button" class="btn-option" onclick="selectOpt('disabledClients',this)">Yes</button><button type="button" class="btn-option" onclick="selectOpt('disabledClients',this)">No</button></div></div>
        </div>
      </div>

      <!-- RATES -->
      <div class="form-section">
        <div class="form-section-title">Rates</div>
        <div class="rates-section">
          <label class="rates-toggle-header"><input type="checkbox" id="incallToggle" onchange="toggleRates('incall',this.checked)"><span>Incall</span></label>
          <div class="rates-fields" id="incallFields">
            <div class="form-field"><label>30 min</label><input class="form-input" type="text" name="incall30" placeholder="£"></div>
            <div class="form-field"><label>45 min</label><input class="form-input" type="text" name="incall45" placeholder="£"></div>
            <div class="form-field"><label>1 hour</label><input class="form-input" type="text" name="incall1h" placeholder="£"></div>
            <div class="form-field"><label>Extra hour</label><input class="form-input" type="text" name="incallExtra" placeholder="£"></div>
            <div class="form-field"><label>Overnight</label><input class="form-input" type="text" name="incallOver" placeholder="£"></div>
          </div>
        </div>
        <div class="rates-section" style="margin-top:1.25rem">
          <label class="rates-toggle-header"><input type="checkbox" id="outcallToggle" onchange="toggleRates('outcall',this.checked)"><span>Outcall</span></label>
          <div class="rates-fields" id="outcallFields">
            <div class="form-field"><label>30 min</label><input class="form-input" type="text" name="outcall30" placeholder="£"></div>
            <div class="form-field"><label>45 min</label><input class="form-input" type="text" name="outcall45" placeholder="£"></div>
            <div class="form-field"><label>1 hour</label><input class="form-input" type="text" name="outcall1h" placeholder="£"></div>
            <div class="form-field"><label>Extra hour</label><input class="form-input" type="text" name="outcallExtra" placeholder="£"></div>
            <div class="form-field"><label>Overnight</label><input class="form-input" type="text" name="outcallOver" placeholder="£"></div>
          </div>
        </div>
      </div>

      <!-- ADDRESS -->
      <div class="form-section">
        <div class="form-section-title">Address (Incall Location)</div>
        <div class="form-grid-2">
          <div class="form-field" style="grid-column:1/-1"><label>Street</label><input class="form-input" type="text" name="street" placeholder="123 Baker Street"></div>
          <div class="form-field"><label>Building Name</label><input class="form-input" type="text" name="building" placeholder="Building / Complex name"></div>
          <div class="form-field"><label>Apartment Number</label><input class="form-input" type="text" name="apt" placeholder="Flat 4A"></div>
          <div class="form-field"><label>Postcode</label><input class="form-input" type="text" name="postcode" placeholder="W1A 1AA"></div>
          <div class="form-field"><label>Nearest Tube Station</label><select class="form-select" name="tube" id="tubeSelect"><option value="">Select station…</option></select></div>
        </div>
      </div>

      <!-- SERVICES -->
      <div class="form-section">
        <div class="form-section-title">Services Offered</div>
        <div class="services-chk-grid" id="servicesCheckList"></div>
      </div>

      <!-- PHOTOS -->
      <div class="form-section">
        <div class="form-section-title">Photos</div>
        <p style="font-size:13px;color:var(--text-soft);margin-bottom:1rem">Upload clear, recent photos. Minimum 3, maximum 20. JPG or PNG.</p>
        <div class="photo-upload-area" onclick="document.getElementById('photoInput').click()">
          <input type="file" id="photoInput" multiple accept="image/*" onchange="handlePhotos(this)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(176,127,222,0.5)" stroke-width="1.5" style="margin-bottom:0.75rem"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p style="color:var(--text-soft);font-size:14px;margin:0">Click to select photos</p>
          <p style="color:var(--text-muted);font-size:12px;margin:4px 0 0">JPG, PNG · multiple files allowed</p>
        </div>
        <div class="photo-list" id="photoList"></div>
        <p style="font-size:12px;color:var(--text-muted);margin-top:0.75rem">Photos are stored securely. Upload endpoint (Telegram / email) will be configured separately.</p>
      </div>

      <button type="submit" class="submit-app-btn">Submit Application →</button>
    </form>
    </div>
  </div>
</div>

${footerHTML()}
<script>
const MODELS = [];
const SERVICES = ${JSON.stringify(SERVICES)};
const NATIONALITIES = ${JSON.stringify(NATIONALITIES)};
const STATIONS = ${JSON.stringify(STATIONS)};
<\/script>
<script src="/assets/main.js"><\/script>
<script src="/assets/become.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  initBecomePage();
});
<\/script>
</body>
</html>`;
}

// =================== SITEMAP ===================
function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    {url: '/', priority: '1.0'},
    {url: '/models/', priority: '0.9'},
    {url: '/faq/', priority: '0.7'},
    {url: '/become-a-model/', priority: '0.6'},
    ...REAL_MODELS.map(m => ({url: `/models/${m.slug}/`, priority: '0.8'})),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// =================== WRITE OUTPUT ===================
function write(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Generated:', filePath);
}

const OUT = path.join(__dirname, '..');

write(path.join(OUT, 'index.html'), buildHome());
write(path.join(OUT, 'models/index.html'), buildModels());
REAL_MODELS.forEach(m => {
  write(path.join(OUT, `models/${m.slug}/index.html`), buildModelProfile(m));
});
write(path.join(OUT, 'faq/index.html'), buildFaq());
write(path.join(OUT, 'become-a-model/index.html'), buildBecome());
write(path.join(OUT, 'sitemap.xml'), buildSitemap());

console.log('\nBuild complete!');
