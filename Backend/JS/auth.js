const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require('./datenbank'); // Im selben Ordner

// REGISTRIERUNG
router.post("/registrieren", async (req, res) => {
  console.log("Registrierungs-Request erhalten:", req.body); // <-- Debug-Ausgabe!

  const { kundentyp, name, firma, ustid, ansprechpartner, email, passwort } = req.body;

  try {
    // Prüfen, ob E-Mail schon existiert
    const check = await db.query("SELECT id FROM benutzer WHERE email = $1", [email]);
    if (check.rowCount > 0) {
      return res.status(400).json({ error: "E-Mail ist bereits vergeben." });
    }

    const hash = await bcrypt.hash(passwort, 12);

    await db.query(
      `INSERT INTO benutzer (kundentyp, name, firma, ustid, ansprechpartner, email, passwort)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        kundentyp || "privat",
        name || null,
        firma || null,
        ustid || null,
        ansprechpartner || null,
        email,
        hash
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Fehler bei Registrierung:", err); // Optional: Noch eine Fehlerausgabe
    res.status(500).json({ error: "Serverfehler: " + err.message });
  }
});

// LOGIN
router.post("/anmelden", async (req, res) => {
  const { email, passwort } = req.body;

  try {
    const result = await db.query("SELECT * FROM benutzer WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      return res.status(400).json({ error: "E-Mail oder Passwort falsch!" });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(passwort, user.passwort);
    if (!match) {
      return res.status(400).json({ error: "E-Mail oder Passwort falsch!" });
    }
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        kundentyp: user.kundentyp,
        name: user.name,
        firma: user.firma
      }
    });
  } catch (err) {
    console.error("Fehler bei Anmeldung:", err);
    res.status(500).json({ error: "Serverfehler: " + err.message });
  }
});

module.exports = router;
