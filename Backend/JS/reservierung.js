// reservierung.js – für Supabase JS Client
const express = require('express');
const router = express.Router();
const db = require('./datenbank');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Reservierung anlegen
router.post('/', async (req, res) => {
  try {
    const { fahrzeug_id, name, email, wunschtermin, uhrzeit } = req.body;
    if (!fahrzeug_id || !name || !email || !wunschtermin || !uhrzeit) {
      return res.status(400).json({ success: false, message: 'Fehlende Reservierungsdaten.' });
    }

    // 1. "reserviert_bis" setzen (3 Tage nach Wunsch)
    const reserviertBis = new Date(wunschtermin);
    reserviertBis.setDate(reserviertBis.getDate() + 3);

    // 2. Reservierung speichern (inkl. reserviert_bis)
    const { data: reservierung, error: insertError } = await db
      .from('reservierungen')
      .insert([{
        fahrzeug_id,
        name,
        email,
        wunschtermin,
        uhrzeit,
        reserviert_bis: reserviertBis.toISOString().slice(0, 10)
      }])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('❌ Fehler beim Einfügen der Reservierung:', insertError);
      return res.status(500).json({ success: false, message: 'Fehler beim Anlegen der Reservierung.' });
    }

    // 3. Fahrzeug als reserviert markieren und Status setzen
    const { error: updateError } = await db
      .from('fahrzeuge')
      .update({ reserviert_bis: reserviertBis.toISOString().slice(0, 10), status: 'reserviert' })
      .eq('id', fahrzeug_id);

    if (updateError) {
      console.error('❌ Fehler beim Aktualisieren des Fahrzeugs:', updateError);
    }

    // 4. Fahrzeugdaten für Mail
    const { data: fahrzeug } = await db
      .from('fahrzeuge')
      .select('hersteller, modell')
      .eq('id', fahrzeug_id)
      .maybeSingle();

    // 5. Mail versenden
    function formatDateISO(dateString) {
      if (!dateString) return "";
      const d = new Date(dateString);
      return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    const wunschtermin_formatiert = formatDateISO(wunschtermin);
    const reserviertBis_formatiert = formatDateISO(reserviertBis);

    await transporter.sendMail({
      from: `"CARPRO Autovermietung" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Ihre Reservierungsbestätigung – CARPRO",
      html: `
        <h2>Reservierungsbestätigung</h2>
        <p>Guten Tag ${name},</p>
        <p>
          Ihre Reservierung für das Fahrzeug <b>${fahrzeug?.hersteller || ''} ${fahrzeug?.modell || ''}</b> ist erfolgreich bei uns eingegangen.
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
        <hr style="margin: 32px 0 16px 0; border:none; border-top:1px solid #ccc;">
        <div style="font-size:0.98rem; color:#333;">
          <b>CARPRO Autovermietung</b><br>
          Carpro Straße 7<br>
          46397 Bocholt
        </div>
      `
    });    

    res.json({ success: true, message: "Reservierung und Mail erfolgreich!", reserviert_bis: reserviertBis });
  } catch (error) {
    console.error("Fehler bei Reservierung:", error);
    res.status(500).json({ success: false, message: "Serverfehler: Reservierung konnte nicht durchgeführt werden." });
  }
});

// Reservierungen eines Users inkl. Status + Fahrzeugdaten
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'E-Mail fehlt.' });
  }
  try {
    const { data, error } = await db
      .from('reservierungen')
      .select(`
        id,
        fahrzeug_id,
        name,
        email,
        wunschtermin,
        uhrzeit,
        reserviert_bis,
        fahrzeuge (
          hersteller,
          modell,
          status
        )
      `)
      .eq('email', email)
      .order('wunschtermin', { ascending: false });

    if (error) {
      console.error('❌ Fehler beim Laden der Reservierungen:', error);
      return res.status(500).json({ success: false, message: 'Fehler beim Laden der Reservierungen.' });
    }

    res.json({ success: true, reservierungen: data });
  } catch (err) {
    console.error("Fehler bei GET /reservierung:", err);
    res.status(500).json({ success: false, message: "Serverfehler beim Abruf der Reservierungen." });
  }
});

// --- Reservierung stornieren und Fahrzeug-Status wieder auf "frei" setzen ---
router.delete('/:id', async (req, res) => {
  const reservierungsId = req.params.id;
  const fahrzeugId = req.query.fahrzeug_id;
  if (!reservierungsId || !fahrzeugId) {
    return res.status(400).json({ success: false, message: 'ID fehlt.' });
  }
  try {
    // Reservierung löschen
    const { error: delError } = await db
      .from('reservierungen')
      .delete()
      .eq('id', reservierungsId);

    if (delError) {
      console.error('❌ Fehler beim Löschen:', delError);
      return res.status(500).json({ success: false, message: 'Fehler beim Löschen.' });
    }

    // Fahrzeug-Status prüfen: Hat das Fahrzeug noch weitere gültige Reservierungen?
    const { data: nochReservierungen, error: checkError } = await db
      .from('reservierungen')
      .select('id')
      .eq('fahrzeug_id', fahrzeugId);

    // Wenn keine Reservierungen mehr → Status auf "frei" und reserviert_bis auf NULL
    if (!checkError && nochReservierungen.length === 0) {
      await db
        .from('fahrzeuge')
        .update({ reserviert_bis: null, status: 'frei' })
        .eq('id', fahrzeugId);
    }

    res.json({ success: true, message: "Reservierung storniert." });
  } catch (error) {
    console.error('Fehler beim Stornieren:', error);
    res.status(500).json({ success: false, message: "Serverfehler beim Stornieren." });
  }
});

module.exports = router;
