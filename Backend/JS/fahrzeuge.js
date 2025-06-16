const express = require('express');
const router = express.Router();
const db = require('./datenbank'); // <-- alles im selben Ordner!

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

// Modell – jetzt abhängig vom Hersteller!
router.get('/modell', (req, res) => {
  const hersteller = req.query.hersteller;
  let sql = 'SELECT DISTINCT modell FROM fahrzeuge';
  let params = [];
  if (hersteller) {
    sql += ' WHERE hersteller = $1';
    params.push(hersteller);
  }
  sql += ' ORDER BY modell';

  db.query(sql, params, (err, results) => {
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

// === FAHRZEUG-BILDER für Einzelangebot ===
router.get('/:id/bilder', (req, res) => {
  const id = req.params.id;
  db.query(
    'SELECT bild_url FROM fahrzeug_bilder WHERE fahrzeug_id = $1 ORDER BY reihenfolge',
    [id],
    (err, results) => {
      if (err) return res.status(500).json([]);
      res.json(results.rows.map(row => row.bild_url));
    }
  );
});

// === Fahrzeuge filtern/anzeigen ===
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM fahrzeuge WHERE 1=1';
  const params = [];

  // ID hat Vorrang und gibt gezielt EIN Fahrzeug zurück!
  if (req.query.id) {
    sql += ` AND id = $${params.length + 1}`;
    params.push(Number(req.query.id));
  } else {
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
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Fehler beim Abrufen:', err);
      return res.status(500).json([]);
    }
    // Shuffle nur wenn es KEINE ID-Abfrage ist!
    if (!req.query.id && results.rows.length > 1) {
      results.rows = results.rows.sort(() => Math.random() - 0.5);
    }
    res.json(results.rows);
  });
});

module.exports = router;
