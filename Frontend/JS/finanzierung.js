document.addEventListener('DOMContentLoaded', () => {
  let modus = 'finanzierung';

  const finSwitch = document.getElementById('finSwitch');
  const leasingSwitch = document.getElementById('leasingSwitch');
  const form = document.getElementById('finanzierung-form');
  const angebotResult = document.getElementById('angebot-result');
  const zinsfaktorInput = document.getElementById('zinsfaktor');
  const zinsfaktorLabel = document.getElementById('zinsfaktor-label');

  finSwitch.onclick = () => {
    modus = 'finanzierung';
    finSwitch.classList.add('active');
    leasingSwitch.classList.remove('active');
    zinsfaktorInput.value = '6.00';
    zinsfaktorInput.setAttribute('readonly', true);
    zinsfaktorLabel.textContent = "Sollzinssatz p.a. (%)";
    angebotResult.style.display = 'none';
  };
  leasingSwitch.onclick = () => {
    modus = 'leasing';
    leasingSwitch.classList.add('active');
    finSwitch.classList.remove('active');
    zinsfaktorInput.value = '1.00';
    zinsfaktorInput.setAttribute('readonly', true);
    zinsfaktorLabel.textContent = "Leasingfaktor (%)";
    angebotResult.style.display = 'none';
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const kaufpreis = parseFloat(form.kaufpreis.value);
    const anzahlung = parseFloat(form.anzahlung.value) || 0;
    const laufzeit = parseInt(form.laufzeit.value);
    let faktor = parseFloat(zinsfaktorInput.value);

    if (modus === 'finanzierung') {
      // Annuitätenformel
      const K = kaufpreis - anzahlung;
      const i = 0.06 / 12; // 6% p.a. fest
      const n = laufzeit;
      if (K < 0) {
        angebotResult.innerHTML = 'Die Anzahlung darf nicht größer als der Kaufpreis sein!';
        angebotResult.style.display = 'block';
        return;
      }
      const rate = (K * i) / (1 - Math.pow(1 + i, -n));
      const gesamtkosten = (rate * n + anzahlung);
      angebotResult.innerHTML = `
        <b>Finanzierungsangebot:</b><br>
        Monatliche Rate: <span style="color:#c82333;font-size:1.2rem;font-weight:700;">${rate.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})} €</span><br>
        Gesamtkosten inkl. Anzahlung: ${gesamtkosten.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})} €<br>
        Sollzinssatz: 6,00 % p.a.<br>
        Laufzeit: ${n} Monate<br>
        Anzahlung: ${anzahlung.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})} €
      `;
      angebotResult.style.display = 'block';
    } else if (modus === 'leasing') {
      // Leasingrate = Listenpreis * Leasingfaktor (1% fest)
      const leasingfaktor = 0.01;
      const leasingrate = kaufpreis * leasingfaktor;
      angebotResult.innerHTML = `
        <b>Leasingangebot:</b><br>
        Monatliche Leasingrate: <span style="color:#c82333;font-size:1.2rem;font-weight:700;">${leasingrate.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})} €</span><br>
        Laufzeit: ${laufzeit} Monate<br>
        Leasingfaktor: 1,00 %<br>
        Listenpreis: ${kaufpreis.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})} €
      `;
      angebotResult.style.display = 'block';
    }
  };
});
