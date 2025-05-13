// marken.js
const express = require('express');
const router = express.Router();
const db = require('./datenbank');

router.get('/marken', (req, res) => {
  db.query('SELECT * FROM marken', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Marken' });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
