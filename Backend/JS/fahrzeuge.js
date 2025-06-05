const express = require('express');
const router = express.Router();
const db = require('./datenbank');

// === Filter-Endpunkte ===

// Karosserie
router.get('/karosserie', (req, res) => {
  db.query('SELECT DISTINCT karosserie FROM fahrzeuge', [], (err, results) => {
    if (err) return res.status(500).json(['Fehler']);
    res.json(results.rows.map(row => row.karosserie));
  });
});

// Hersteller
router.get('/hersteller', (req, res) => {
  db.query('SELECT DISTINCT hersteller FROM fahrzeuge', [], (err, results) => {
    if (err) return res.status(500).json(['Fehler']);
    res.json(results.rows.map(row => row.hersteller));
  });
});

// Modell
router.get('/modell', (req, res) => {
  db.query('SELECT DISTINCT modell FROM fahrzeuge', [], (err, results) => {
    if (err) return res.status(500).json(['Fehler']);
    res.json(results.rows.map(row => row.modell));
  });
});

// Kraftstoff
router.get('/kraftstoff', (req, res) => {
  db.query('SELECT DISTINCT kraftstoff FROM fahrzeuge', [], (err, results) => {
    if (err) return res.status(500).json(['Fehler']);
    res.json(results.rows.map(row => row.kraftstoff));
  });
});

// Getriebe
router.get('/getriebe', (req, res) => {
  db.query('SELECT DISTINCT getriebe FROM fahrzeuge', [], (err, results) => {
    if (err) return res.status(500).json(['Fehler']);
    res.json(results.rows.map(row => row.getriebe));
  });
});

// Erstzulassung Bereich (Dropdown)
router.get('/erstzulassung-bereich', (req, res) => {
  db.query(
    'SELECT MIN(EXTRACT(YEAR FROM erstzulassung)) as minjahr, MAX(EXTRACT(YEAR FROM erstzulassung)) as maxjahr FROM fahrzeuge',
    [],
    (err, results) => {
      if (err) return res.status(500).json({ minjahr: 2000, maxjahr: 2025 });
      res.json({
        minjahr: Number(results.rows[0].minjahr),
        maxjahr: Number(results.rows[0].maxjahr),
      });
    }
  );
});

// === Fahrzeuge filtern/anzeigen ===
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM fahrzeuge WHERE 1=1';
  const params = [];

  if (req.query.karosserie) {
    sql += ` AND karosserie = $${params.length + 1}`;
    params.push(req.query.karosserie);
  }
  if (req.query.hersteller) {
    sql += ` AND hersteller = $${params.length + 1}`;
    params.push(req.query.hersteller);
  }
  if (req.query.modell) {
    sql += ` AND modell = $${params.length + 1}`;
    params.push(req.query.modell);
  }
  if (req.query.kraftstoff) {
    sql += ` AND kraftstoff = $${params.length + 1}`;
    params.push(req.query.kraftstoff);
  }
  if (req.query.getriebe) {
    sql += ` AND getriebe = $${params.length + 1}`;
    params.push(req.query.getriebe);
  }
  if (req.query.kilometer) {
    sql += ` AND kilometerstand <= $${params.length + 1}`;
    params.push(req.query.kilometer);
  }
  if (req.query.erstzulassung_ab) {
    sql += ` AND EXTRACT(YEAR FROM erstzulassung) >= $${params.length + 1}`;
    params.push(req.query.erstzulassung_ab);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen:', err);
      return res.status(500).json([]);
    }
    // Shuffle damit die Reihenfolge nicht nach Marke gruppiert ist
    results.rows = results.rows.sort(() => Math.random() - 0.5);
    res.json(results.rows);
  });
});

module.exports = router;
