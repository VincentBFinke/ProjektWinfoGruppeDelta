// finanzierung.js (Backend Router für Angebote)
const express = require('express');
const router = express.Router();

// POST /api/finanzierung
router.post('/', (req, res) => {
  const { modus, kaufpreis, anzahlung, laufzeit } = req.body;
  // Immer als Number sicherstellen!
  const kaufpreisNum = parseFloat(kaufpreis);
  const anzahlungNum = parseFloat(anzahlung) || 0;
  const laufzeitNum = parseInt(laufzeit);

  if (isNaN(kaufpreisNum) || isNaN(laufzeitNum) || laufzeitNum <= 0 || kaufpreisNum <= 0) {
    return res.status(400).json({ success: false, message: "Bitte geben Sie gültige Werte ein." });
  }

  let angebot = {};
  if (modus === 'finanzierung') {
    // Finanzierungsrechner: Annuitätenformel mit festem Sollzinssatz 6%
    const zinssatz = 6.00;
    const i = zinssatz / 100 / 12; // Monatszins
    const K = kaufpreisNum - anzahlungNum;
    if (K <= 0) {
      return res.status(400).json({ success: false, message: "Anzahlung darf nicht größer als Kaufpreis sein." });
    }
    const n = laufzeitNum;
    const rate = K * i / (1 - Math.pow(1 + i, -n));
    const gesamtkosten = (rate * n + anzahlungNum);

    angebot = {
      typ: 'finanzierung',
      rate: rate.toFixed(2),
      gesamtkosten: gesamtkosten.toFixed(2),
      laufzeit: n,
      zinssatz: zinssatz.toFixed(2),
      anzahlung: anzahlungNum.toFixed(2),
      kaufpreis: kaufpreisNum.toFixed(2)
    };
  } else if (modus === 'leasing') {
    // Leasing: Leasingrate = Kaufpreis x Leasingfaktor (1% fest)
    const leasingfaktor = 0.01;
    const rate = kaufpreisNum * leasingfaktor;
    angebot = {
      typ: 'leasing',
      rate: rate.toFixed(2),
      leasingfaktor: (leasingfaktor * 100).toFixed(2),
      laufzeit: laufzeitNum,
      kaufpreis: kaufpreisNum.toFixed(2)
    };
  } else {
    return res.status(400).json({ success: false, message: "Modus nicht erkannt." });
  }

  return res.json({ success: true, angebot });
});

module.exports = router;
