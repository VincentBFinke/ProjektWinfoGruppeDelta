const express = require('express');
const router = express.Router();
const supabase = require('./datenbank');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../../.env' });

router.post('/', async (req, res) => {
  try {
    // Wir erwarten JSON vom Frontend
    const {
      vorname,
      nachname,
      email,
      telefon,
      fahrzeugmodell,
      fin,
      wunschkennzeichen,
      zulassungsart
    } = req.body;

    // Grundvalidierung
    if (!vorname || !nachname || !email || !fahrzeugmodell || !fin || !zulassungsart) {
      return res.status(400).json({ success: false, message: "Bitte füllen Sie alle Pflichtfelder aus." });
    }

    // 1. In DB speichern
    const { data, error } = await supabase.from('zulassungsanfragen').insert([{
      vorname,
      nachname,
      email,
      telefon,
      fahrzeugmodell,
      fin,
      wunschkennzeichen,
      zulassungsart
    }]);
    if (error) {
      console.error('[ZULASSUNG][DB] Fehler:', error);
      return res.status(500).json({ success: false, message: "Fehler beim Speichern in der Datenbank." });
    }

    // 2. E-Mail an Admin verschicken
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    let mailText = `
Neue Zulassungsanfrage von ${vorname} ${nachname}

Kontaktdaten:
- Name: ${vorname} ${nachname}
- E-Mail: ${email}
- Telefon: ${telefon ? telefon : '-'}

Fahrzeugdaten:
- Modell: ${fahrzeugmodell}
- FIN: ${fin}
- Wunschkennzeichen: ${wunschkennzeichen ? wunschkennzeichen : '-'}
- Zulassungsart: ${zulassungsart}
    `.trim();

    let mailHtml = `
      <h2>Neue Zulassungsanfrage</h2>
      <h3>Kontaktdaten</h3>
      <ul>
        <li><b>Name:</b> ${vorname} ${nachname}</li>
        <li><b>E-Mail:</b> ${email}</li>
        <li><b>Telefon:</b> ${telefon ? telefon : '-'}</li>
      </ul>
      <h3>Fahrzeugdaten</h3>
      <ul>
        <li><b>Modell:</b> ${fahrzeugmodell}</li>
        <li><b>FIN:</b> ${fin}</li>
        <li><b>Wunschkennzeichen:</b> ${wunschkennzeichen ? wunschkennzeichen : '-'}</li>
        <li><b>Zulassungsart:</b> ${zulassungsart}</li>
      </ul>
    `.trim();

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER, // Empfängermail (Admin)
      subject: "Neue Zulassungsanfrage",
      text: mailText,
      html: mailHtml
    });

    // Erfolgs-Response
    return res.status(200).json({
      success: true,
      message: "Zulassungsanfrage erfolgreich eingegangen!"
    });

  } catch (err) {
    console.error('[ZULASSUNG][SERVER] Fehler:', err);
    res.status(500).json({ success: false, message: "Serverfehler beim Verarbeiten der Anfrage." });
  }
});

module.exports = router;
