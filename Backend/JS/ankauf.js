const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const supabase = require('./datenbank');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../../.env' });

// Upload-Verzeichnis anlegen (falls nicht vorhanden)
const ankaufUploadDir = path.join(__dirname, '../uploads/ankauf');
if (!fs.existsSync(ankaufUploadDir)) {
  fs.mkdirSync(ankaufUploadDir, { recursive: true });
  console.log(`[INIT] Upload-Verzeichnis erstellt: ${ankaufUploadDir}`);
} else {
  console.log(`[INIT] Upload-Verzeichnis vorhanden: ${ankaufUploadDir}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ankaufUploadDir);
  },
  filename: function (req, file, cb) {
    const fname = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, fname);
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.array('fahrzeugbilder', 10), async (req, res) => {
  try {
    const {
      marke, modell, baujahr, kilometerstand, kraftstoff, getriebe,
      beschreibung, vorname, nachname, email, telefon
    } = req.body;

    // Hochgeladene Bilder
    const bilder = req.files ? req.files.map(f =>
      '/uploads/ankauf/' + f.filename
    ) : [];

    // 1. In Datenbank speichern
    const { data, error } = await supabase.from('ankauf').insert([{
      marke,
      modell,
      baujahr: parseInt(baujahr),
      kilometerstand: parseInt(kilometerstand),
      kraftstoff,
      getriebe,
      beschreibung,
      vorname,
      nachname,
      email,
      telefon,
      bilder // Bild-Pfade als Array
    }]);
    if (error) {
      return res.status(500).json({ success: false, message: "Fehler beim Speichern in der Datenbank" });
    }

    // Email an Admin (MIT MEHREREN ANHÄNGEN!)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    let mailHtml = `
      <h2>Neue Ankauf-Anfrage</h2>
      <h3>Fahrzeugdaten</h3>
      <ul>
        <li><b>Marke:</b> ${marke}</li>
        <li><b>Modell:</b> ${modell}</li>
        <li><b>Baujahr:</b> ${baujahr}</li>
        <li><b>Kilometerstand:</b> ${kilometerstand}</li>
        <li><b>Kraftstoff:</b> ${kraftstoff}</li>
        <li><b>Getriebe:</b> ${getriebe}</li>
        <li><b>Beschreibung:</b> ${beschreibung}</li>
      </ul>
      <h3>Kontaktdaten</h3>
      <ul>
        <li><b>Vorname:</b> ${vorname}</li>
        <li><b>Nachname:</b> ${nachname}</li>
        <li><b>E-Mail:</b> ${email}</li>
        <li><b>Telefon:</b> ${telefon || '-'}</li>
      </ul>
      <h3>Bilder im Anhang.</h3>
    `;

    // Email-Versand MIT MEHREREN ANHÄNGEN
    const attachments = (req.files || []).map(f => ({
      filename: f.originalname,
      path: f.path,
      cid: f.filename // falls du im html darauf referenzieren willst
    }));

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: "Neue Ankauf-Anfrage",
      html: mailHtml,
      attachments: attachments,
    });

    res.status(200).json({
      success: true,
      message: "Anfrage eingegangen, gespeichert und Mail versendet!",
      bilder
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Serverfehler beim Ankauf." });
  }
});

module.exports = router;
