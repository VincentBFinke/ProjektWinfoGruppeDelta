const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

console.log('MAIL_USER:', process.env.MAIL_USER);
console.log('MAIL_PASS:', process.env.MAIL_PASS ? '****' : 'NICHT gesetzt!');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

router.post('/', async (req, res) => {
  const { vorname, nachname, email, telefon, nachricht } = req.body;

  if (!vorname || !nachname || !email || !nachricht) {
    return res.status(400).json({ success: false, message: "Bitte alle Pflichtfelder ausfüllen!" });
  }

  const mailOptions = {
    from: `"Kontaktformular CARPRO" <${email}>`,
    to: process.env.MAIL_USER,
    subject: `Neue Kontaktanfrage von ${vorname} ${nachname}`,
    html: `
      <b>Von:</b> ${vorname} ${nachname}<br>
      <b>E-Mail:</b> ${email}<br>
      <b>Telefon:</b> ${telefon || "-"}<br><br>
      <b>Nachricht:</b><br>${nachricht.replace(/\n/g, "<br>")}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Nachricht erfolgreich gesendet." });
  } catch (err) {
    console.error("E-Mail Fehler:", err);
    res.status(500).json({ success: false, message: "Fehler beim Senden der Nachricht." });
  }
});

module.exports = router;
