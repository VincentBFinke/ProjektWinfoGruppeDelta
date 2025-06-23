const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require('./datenbank'); // Supabase-Client!

// REGISTRIERUNG
router.post("/registrieren", async (req, res) => {
  const { kundentyp, name, firma, ustid, ansprechpartner, email, passwort } = req.body;

  try {
    // Prüfen, ob E-Mail schon existiert
    const { data: existing, error: checkError } = await db
      .from('benutzer')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: "E-Mail ist bereits vergeben." });
    }

    const hash = await bcrypt.hash(passwort, 12);

    const { error: insertError } = await db
      .from('benutzer')
      .insert([{
        kundentyp: kundentyp || "privat",
        name: name || null,
        firma: firma || null,
        ustid: ustid || null,
        ansprechpartner: ansprechpartner || null,
        email,
        passwort: hash
      }]);

    if (insertError) throw insertError;

    res.json({ success: true });
  } catch (err) {
    console.error("Fehler bei Registrierung:", err);
    res.status(500).json({ error: "Serverfehler: " + (err.message || err)});
  }
});

// LOGIN
router.post("/anmelden", async (req, res) => {
  const { email, passwort } = req.body;

  try {
    const { data: user, error: getUserError } = await db
      .from('benutzer')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(400).json({ error: "E-Mail oder Passwort falsch!" });
    }
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
    res.status(500).json({ error: "Serverfehler: " + (err.message || err)});
  }
});

// NEU: Hole Benutzer anhand E-Mail
router.get('/byemail', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ success: false });
  const { data, error } = await db.from('benutzer').select('*').eq('email', email).maybeSingle();
  if (error || !data) return res.json({ success: false });
  res.json({ success: true, user: data });
});

module.exports = router;
