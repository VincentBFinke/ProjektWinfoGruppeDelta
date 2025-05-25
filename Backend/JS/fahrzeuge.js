// fahrzeuge.js
const express = require('express');
const router = express.Router();
const db = require('./datenbank');

// GET /api/fahrzeuge?marke=BMW
router.get('/fahrzeuge', (req, res) => {
  const marke = req.query.marke;

  if (!marke) {
    return res.status(400).json({ error: 'Marke muss angegeben werden' });
  }

  db.query(
    'SELECT * FROM fahrzeuge WHERE hersteller = ?',
    [marke],
    (err, results) => {
      if (err) {
        console.error('Fehler beim Abrufen der Fahrzeuge:', err);
        return res.status(500).json({ error: 'Serverfehler beim Abrufen der Fahrzeuge' });
      }
      res.json(results);
    }
  );
});

module.exports = router;
