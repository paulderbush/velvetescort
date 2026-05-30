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

function submitApplication(e) {
  e.preventDefault();
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
