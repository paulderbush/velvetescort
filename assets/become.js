// =================== BECOME A MODEL PAGE ===================
const LANGUAGES_LIST = ['English','Albanian','Armenian','Azerbaijani','Belarusian','Bosnian','Bulgarian','Croatian','Czech','Danish','Dutch','Estonian','Finnish','French','Georgian','German','Greek','Hungarian','Italian','Kazakh','Kyrgyz','Latvian','Lithuanian','Macedonian','Moldovan','Norwegian','Polish','Portuguese','Romanian','Russian','Serbian','Slovak','Slovenian','Spanish','Swedish','Tajik','Turkmen','Ukrainian','Uzbek'];

function selectOpt(groupId, btn) {
  document.querySelectorAll('#' + groupId + ' .btn-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function toggleOpt(btn) { btn.classList.toggle('active'); }

function addLangRow(lang = '', level = '') {
  const container = document.getElementById('langRows');
  const row = document.createElement('div');
  row.className = 'lang-row';
  row.innerHTML = `
    <select class="form-select" name="lang[]">
      <option value="">Select language…</option>
      ${LANGUAGES_LIST.map(l => `<option value="${l}"${l === lang ? ' selected' : ''}>${l}</option>`).join('')}
    </select>
    <div class="btn-group">
      ${['Basic', 'Intermediate', 'Fluent'].map(lv => `<button type="button" class="btn-option${lv === level ? ' active' : ''}" onclick="selectLangLevel(this)">${lv}</button>`).join('')}
    </div>
    <button type="button" class="remove-lang-btn" onclick="this.closest('.lang-row').remove()">✕</button>`;
  container.appendChild(row);
}

function selectLangLevel(btn) {
  btn.closest('.btn-group').querySelectorAll('.btn-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function toggleRates(type, checked) {
  document.getElementById(type + 'Fields').classList.toggle('active', checked);
}

function handlePhotos(input) {
  const list = document.getElementById('photoList');
  list.innerHTML = '';
  Array.from(input.files).forEach(f => {
    const chip = document.createElement('div');
    chip.className = 'photo-chip';
    chip.textContent = f.name.length > 22 ? f.name.slice(0, 20) + '…' : f.name;
    list.appendChild(chip);
  });
}

function _getOpt(id) {
  const el = document.querySelector('#' + id + ' .btn-option.active');
  return el ? el.textContent.trim() : '—';
}
function _getMultiOpt(id) {
  const els = document.querySelectorAll('#' + id + ' .btn-option.active');
  return els.length ? Array.from(els).map(e => e.textContent.trim()).join(', ') : '—';
}

async function submitApplication(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-app-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  const d = new FormData(e.target);
  const v = k => (d.get(k) || '').trim() || '—';

  // Languages
  const langRows = document.querySelectorAll('#langRows .lang-row');
  const langs = Array.from(langRows).map(r => {
    const sel = r.querySelector('select');
    const lvl = r.querySelector('.btn-option.active');
    return sel && sel.value ? sel.value + (lvl ? ' (' + lvl.textContent + ')' : '') : null;
  }).filter(Boolean).join(', ') || '—';

  // Services
  const svcs = Array.from(document.querySelectorAll('#servicesCheckList input[type=checkbox]:checked'))
    .map(c => c.value).join(', ') || '—';

  const msg = `
🌸 <b>New Model Application</b>

👤 <b>PERSONAL</b>
Real Name: ${v('realName')}
Working Name: ${v('workingName')}
Phone: ${v('phone')}
Telegram: ${v('telegram')}
Age: ${v('age')}
Nationality: ${v('nationality')}

📐 <b>PHYSICAL</b>
Height: ${v('height')} cm  |  Weight: ${v('weight')} kg
Dress Size: ${v('dress')}  |  Feet: ${v('feet')}  |  Breast: ${v('breast')}
Breast Type: ${_getOpt('breastType')}
Eyes: ${_getOpt('eyes')}  |  Hair: ${_getOpt('hair')}
Tattoo: ${_getOpt('tattoo')}  |  Piercing: ${_getMultiOpt('piercing')}
Smoke: ${_getOpt('smoke')}

💼 <b>WORK PREFERENCES</b>
Orientation: ${_getOpt('orientation')}
Couples: ${_getOpt('couples')}  |  Women: ${_getOpt('women')}
Black Clients: ${_getOpt('blackClients')}  |  Disabled: ${_getOpt('disabledClients')}

🗣 Languages: ${langs}

💰 <b>RATES</b>
Incall — 30m: ${v('incall30')}  45m: ${v('incall45')}  1h: ${v('incall1h')}  +1h: ${v('incallExtra')}  Night: ${v('incallOver')}
Outcall — 30m: ${v('outcall30')}  45m: ${v('outcall45')}  1h: ${v('outcall1h')}  +1h: ${v('outcallExtra')}  Night: ${v('outcallOver')}

📍 <b>ADDRESS (Incall)</b>
${v('street')}, ${v('building')}, ${v('apt')}, ${v('postcode')}
Tube: ${v('tube')}

🛎 <b>SERVICES</b>
${svcs}
`.trim();

  try {
    // 1. Send text to VELVET MODELS
    await fetch(TG_BOT, {
      method: 'POST',
      body: new URLSearchParams({chat_id: TG_CHAT_MODELS, text: msg, parse_mode: 'HTML'})
    });

    // 2. Send photos if any
    const photoInput = document.getElementById('photoInput');
    const files = photoInput ? Array.from(photoInput.files) : [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 10) {
        const batch = files.slice(i, i + 10);
        const fd = new FormData();
        fd.append('chat_id', TG_CHAT_MODELS);
        if (batch.length === 1) {
          fd.append('photo', batch[0]);
          fd.append('caption', i === 0 ? `📸 Photos — ${v('workingName')}` : '');
          await fetch(TG_BOT_BASE + '/sendPhoto', {method: 'POST', body: fd});
        } else {
          const media = batch.map((file, idx) => {
            fd.append('file' + idx, file, file.name);
            return {type: 'photo', media: 'attach://file' + idx, ...(idx === 0 && i === 0 ? {caption: `📸 Photos — ${v('workingName')}`} : {})};
          });
          fd.append('media', JSON.stringify(media));
          await fetch(TG_BOT_BASE + '/sendMediaGroup', {method: 'POST', body: fd});
        }
      }
    }
  } catch (err) {
    console.error('Application send error:', err);
  }

  document.getElementById('becomeFormWrap').innerHTML = `
    <div class="form-success">
      <span class="check-icon">✓</span>
      <h2>Application Submitted!</h2>
      <p>Thank you for your interest in joining Velvet London.<br>Our team will review your application and contact you within 24–48 hours.</p>
      <a class="nav-btn" href="/" style="display:inline-block;text-decoration:none;margin-top:1rem">Back to Home</a>
    </div>`;
  window.scrollTo(0, 0);
}

function toggleSvcExtra(btn) {
  btn.classList.toggle('active');
  const price = btn.nextElementSibling;
  price.classList.toggle('show');
  if (price.classList.contains('show')) price.focus();
  else price.value = '';
}

function initBecomePage() {
  const tubeSelect = document.getElementById('tubeSelect');
  if (tubeSelect && tubeSelect.options.length <= 1) {
    STATIONS.forEach(s => { const o = document.createElement('option'); o.value = s; o.textContent = s; tubeSelect.appendChild(o); });
  }
  const svcGrid = document.getElementById('servicesCheckList');
  if (svcGrid && !svcGrid.children.length) {
    SERVICES.forEach(s => {
      const div = document.createElement('div');
      div.className = 'svc-check';
      div.innerHTML = `<label><input type="checkbox" name="services[]" value="${s}"> ${s}</label><button type="button" class="svc-extra-btn" onclick="toggleSvcExtra(this)">extra</button><input type="number" class="svc-extra-price" name="extra_price[${s}]" placeholder="£" min="0">`;
      svcGrid.appendChild(div);
    });
  }
  if (!document.getElementById('langRows').children.length) addLangRow();
}
