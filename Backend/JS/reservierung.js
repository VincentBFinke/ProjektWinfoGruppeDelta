const express = require('express');
const router = express.Router();
const db = require('./datenbank');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Transporter für Gmail, Zugangsdaten aus .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// POST /api/reservierung → Reservierung anlegen
router.post('/', async (req, res) => {
  try {
    const { fahrzeug_id, name, email, wunschtermin, uhrzeit } = req.body;

    // 1. Reservierung speichern
    const insertRes = await db.query(
      `INSERT INTO reservierungen (fahrzeug_id, name, email, wunschtermin, uhrzeit)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [fahrzeug_id, name, email, wunschtermin, uhrzeit]
    );

    // 2. Fahrzeug reservieren (reserviert_bis setzen)
    // Berechne das Enddatum der Reservierung (3 Tage ab Wunschtermin)
    const reserviertBis = new Date(wunschtermin);
    reserviertBis.setDate(reserviertBis.getDate() + 3);

    await db.query(
      `UPDATE fahrzeuge SET reserviert_bis = $1 WHERE id = $2`,
      [reserviertBis.toISOString().slice(0, 10), fahrzeug_id]
    );

    // 3. Fahrzeugdaten holen für Mail
    const { rows: fahrzeugRows } = await db.query(
      `SELECT hersteller, modell FROM fahrzeuge WHERE id = $1`,
      [fahrzeug_id]
    );
    const fahrzeug = fahrzeugRows[0];

    // 4. Datum für Mail hübsch formatieren (z.B. 18.06.2025)
    function formatDateISO(dateString) {
      if (!dateString) return "";
      const d = new Date(dateString);
      return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    const wunschtermin_formatiert = formatDateISO(wunschtermin);
    const reserviertBis_formatiert = formatDateISO(reserviertBis);

    // 5. E-Mail versenden (Anrede: Guten Tag Name)
    await transporter.sendMail({
      from: '"CARPRO Autovermietung" <' + process.env.MAIL_USER + '>',
      to: email,
      subject: "Ihre Reservierungsbestätigung – CARPRO",
      html: `
        <h2>Reservierungsbestätigung</h2>
        <p>Guten Tag ${name},</p>
        <p>
          Ihre Reservierung für das Fahrzeug <b>${fahrzeug.hersteller} ${fahrzeug.modell}</b> ist erfolgreich bei uns eingegangen.
        </p>
        <ul>
          <li><b>Wunschtermin:</b> ${wunschtermin_formatiert} um ${uhrzeit} Uhr</li>
          <li><b>Name:</b> ${name}</li>
          <li><b>E-Mail:</b> ${email}</li>
          <li><b>Reservierung gültig bis:</b> ${reserviertBis_formatiert}</li>
        </ul>
        <p>
          Wir freuen uns darauf, Sie zu Ihrer Probefahrt und Fahrzeugbesichtigung begrüßen zu dürfen!<br>
          Bitte bringen Sie zu Ihrem Termin einen <b>gültigen Personalausweis</b> und Ihren <b>Führerschein</b> mit.
        </p>
        <p>
          Bei Fragen oder Terminänderungen kontaktieren Sie uns gern per E-Mail.<br>
          <br>
          Mit freundlichen Grüßen<br>
          Ihr CARPRO Team
        </p>
      `
    });

    res.json({ success: true, message: "Reservierung und Mail erfolgreich!", reserviert_bis: reserviertBis });
  } catch (error) {
    console.error("Fehler bei Reservierung:", error);
    res.status(500).json({ success: false, message: "Serverfehler: Reservierung konnte nicht durchgeführt werden." });
  }
});

module.exports = router;
