const express = require('express');
const router = express.Router();
const db = require('./datenbank');
require('dotenv').config();

// POST /api/kauf → Fahrzeugkauf anlegen
router.post('/', async (req, res) => {
  try {
    const { fahrzeug_id, benutzer_id, name, email, preis } = req.body;

    // 1. Kaufvertrag anlegen
    const insertRes = await db.query(
      `INSERT INTO kaufvertraege (fahrzeug_id, benutzer_id, name, email, preis)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fahrzeug_id, benutzer_id, name, email, preis]
    );

    // 2. Fahrzeug als verkauft markieren (optional)
    await db.query(
      `UPDATE fahrzeuge SET verkauft = TRUE WHERE id = $1`,
      [fahrzeug_id]
    );

    res.json({ success: true, message: "Kauf erfolgreich!", kaufvertrag: insertRes.rows[0] });
  } catch (error) {
    console.error("Fehler beim Fahrzeugkauf:", error);
    res.status(500).json({ success: false, message: "Serverfehler beim Kauf." });
  }
});

module.exports = router;