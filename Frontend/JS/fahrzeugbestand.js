document.addEventListener('DOMContentLoaded', () => {
  loadFilters();
  loadFahrzeuge();

  document.getElementById('filter-button').addEventListener('click', loadFahrzeuge);

  [
    'filter-karosserie',
    'filter-hersteller',
    'filter-modell',
    'filter-kraftstoff',
    'filter-getriebe',
    'filter-kilometer',
    'filter-erstzulassung_ab'
  ].forEach(id => {
    document.getElementById(id)?.addEventListener('change', updateErgebnisButton);
  });

  // Herstellerwechsel: Modell-Optionen neu laden!
  document.getElementById('filter-hersteller').addEventListener('change', async function() {
    await fillModelle();
    updateErgebnisButton();
  });
});

// --- Filter dynamisch laden ---
async function loadFilters() {
  await Promise.all([
    fillFilter('karosserie', '/api/fahrzeuge/karosserie'),
    fillFilter('hersteller', '/api/fahrzeuge/hersteller'),
    fillModelle(),
    fillFilter('kraftstoff', '/api/fahrzeuge/kraftstoff'),
    fillFilter('getriebe', '/api/fahrzeuge/getriebe'),
    fillKilometer(),
    fillErstzulassung(),
  ]);
  updateErgebnisButton();
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

// Neue Funktion für Modell-Dropdown (abhängig vom Hersteller)
async function fillModelle() {
  const hersteller = document.getElementById('filter-hersteller').value;
  const select = document.getElementById('filter-modell');
  select.innerHTML = `<option value="">Beliebig</option>`;
  try {
    let url = 'http://localhost:3000/api/fahrzeuge/modell';
    if (hersteller) url += `?hersteller=${encodeURIComponent(hersteller)}`;
    const res = await fetch(url);
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

// --- Ergebnis-Button sofort aktualisieren ---
async function updateErgebnisButton() {
  const params = {};
  ['karosserie', 'hersteller', 'modell', 'kraftstoff', 'getriebe', 'kilometer', 'erstzulassung_ab'].forEach(f => {
    const v = document.getElementById(`filter-${f}`)?.value;
    if (v) params[f] = v;
  });
  const query = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch('http://localhost:3000/api/fahrzeuge' + query);
  const autos = await res.json();

  // Nur Button-Text setzen, keine Karten anzeigen!
  const btn = document.getElementById('filter-button');
  btn.innerText = `${autos.length} Ergebnisse anzeigen`;
}

// --- Fahrzeuge laden/filtern und anzeigen ---
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
  cont.innerHTML = data.map(auto => {
    // Relativer Bildpfad!
    let bildUrl = auto.bild_url || "";
    if (bildUrl.startsWith('/')) bildUrl = '..' + bildUrl;
    else if (!bildUrl.startsWith('.')) bildUrl = '../' + bildUrl;

    // Reservierungs-Logik
    let reserviertBisText = '';
    let reserviert = false;
    if (auto.reserviert_bis && new Date(auto.reserviert_bis) >= new Date()) {
      reserviert = true;
      const bisDatum = new Date(auto.reserviert_bis);
      reserviertBisText = `Reserviert bis: ${bisDatum.toLocaleDateString('de-DE')}`;
    }

    // Details-Button nur anklickbar, wenn nicht reserviert
    let detailsBtn = '';
    if (reserviert) {
      detailsBtn = `<button class="details-button disabled" disabled title="Fahrzeug ist reserviert und nicht verfügbar">${reserviertBisText}</button>`;
    } else {
      detailsBtn = `<a href="einzelangebot.html?id=${auto.id}" class="details-button">DETAILS</a>`;
    }

    // Reserviert-Badge
    let reserviertBadge = '';
    if (reserviert) {
      reserviertBadge = `<span class="reserviert-badge">Reserviert</span>`;
    }

    return `
      <div class="fahrzeug-card">
        ${reserviertBadge}
        <img src="${bildUrl}" alt="${auto.modell}" />
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
          ${detailsBtn}
        </div>
      </div>
    `;
  }).join('');
}
