document.addEventListener('DOMContentLoaded', () => {
  loadFilters();
  loadFahrzeuge();
  document.getElementById('filter-button').addEventListener('click', loadFahrzeuge);
});

// --- Filter dynamisch laden ---
async function loadFilters() {
  await Promise.all([
    fillFilter('karosserie', '/api/fahrzeuge/karosserie'),
    fillFilter('hersteller', '/api/fahrzeuge/hersteller'),
    fillFilter('modell', '/api/fahrzeuge/modell'),
    fillFilter('kraftstoff', '/api/fahrzeuge/kraftstoff'),
    fillFilter('getriebe', '/api/fahrzeuge/getriebe'),
    fillKilometer(),
    fillErstzulassung(),
  ]);
}

async function fillFilter(field, endpoint) {
  const select = document.getElementById(`filter-${field}`);
  select.innerHTML = `<option value="">Beliebig</option>`;
  try {
    const res = await fetch(`http://localhost:3000${endpoint}`);
    const werte = await res.json();
    werte.forEach(val => {
      select.innerHTML += `<option value="${val}">${val}</option>`;
    });
  } catch (e) {
    select.innerHTML += `<option disabled>Fehler</option>`;
  }
}

async function fillKilometer() {
  const kmWerte = [5000,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000];
  const select = document.getElementById('filter-kilometer');
  select.innerHTML = `<option value="">Beliebig</option>`;
  kmWerte.forEach(val => {
    select.innerHTML += `<option value="${val}">${val.toLocaleString('de-DE')} km</option>`;
  });
}

async function fillErstzulassung() {
  const select = document.getElementById('filter-erstzulassung_ab');
  select.innerHTML = `<option value="">Beliebig</option>`;
  try {
    const res = await fetch('http://localhost:3000/api/fahrzeuge/erstzulassung-bereich');
    const { minjahr, maxjahr } = await res.json();
    for (let y = minjahr; y <= maxjahr; y++) {
      select.innerHTML += `<option value="${y}">${y}</option>`;
    }
  } catch (e) {
    select.innerHTML += `<option disabled>Fehler</option>`;
  }
}

// --- Fahrzeuge laden/filtern ---
async function loadFahrzeuge() {
  const params = {};
  ['karosserie', 'hersteller', 'modell', 'kraftstoff', 'getriebe', 'kilometer', 'erstzulassung_ab'].forEach(f => {
    const v = document.getElementById(`filter-${f}`)?.value;
    if (v) params[f] = v;
  });
  const query = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch('http://localhost:3000/api/fahrzeuge' + query);
  const autos = await res.json();

  // Button-Text aktualisieren!
  const btn = document.getElementById('filter-button');
  btn.innerText = `${autos.length} Ergebnisse anzeigen`;

  showFahrzeugCards(autos);
}

function showFahrzeugCards(data) {
  const cont = document.getElementById('fahrzeug-container');
  if (!data || !data.length) {
    cont.innerHTML = "<p style='text-align:center;'>Keine Fahrzeuge gefunden.</p>";
    return;
  }
  cont.innerHTML = data.map(auto => `
    <div class="fahrzeug-card">
      <img src="http://localhost:3000${auto.bild_url}" alt="${auto.modell}" />
      <div class="fahrzeug-info">
        <h3>${auto.hersteller} ${auto.modell}</h3>
        <div class="info-grid">
          <span><strong>Kraftstoff:</strong> ${auto.kraftstoff}</span>
          <span><strong>Erstzulassung:</strong> ${new Date(auto.erstzulassung).getFullYear()}</span>
          <span><strong>Kilometer:</strong> ${Number(auto.kilometerstand).toLocaleString('de-DE')} km</span>
          <span><strong>Getriebe:</strong> ${auto.getriebe}</span>
          <span><strong>Leistung:</strong> ${auto.leistung} PS</span>
          <span><strong>Karosserie:</strong> ${auto.karosserie}</span>
        </div>
        <div class="fahrzeug-preis">${Number(auto.preis).toLocaleString('de-DE')} €</div>
        <a href="#" class="details-button">DETAILS</a>
      </div>
    </div>
  `).join('');
}
