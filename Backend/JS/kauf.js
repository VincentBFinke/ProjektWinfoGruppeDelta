const express = require('express');
const db = require('./datenbank'); // Supabase-Client
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const router = express.Router();

// Hilfsfunktion für Vertragsnummer
function genVertragsnummer() {
  return 'KV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ========== 1. Kaufvertrag anlegen ==========
router.post('/', async (req, res) => {
  const { fahrzeug_id, benutzer_id, name, email, adresse, telefon } = req.body;
  if (!fahrzeug_id || !benutzer_id || !name || !email || !adresse || !telefon) {
    return res.status(400).json({ success: false, message: 'Fehlende Angaben im Kaufformular.' });
  }

  try {
    // 1.1 Fahrzeug prüfen
    const { data: fahrzeug, error: fahrzeugError } = await db
      .from('fahrzeuge')
      .select('*')
      .eq('id', fahrzeug_id)
      .maybeSingle();

    if (fahrzeugError || !fahrzeug) {
      return res.status(404).json({ success: false, message: 'Fahrzeug nicht gefunden.' });
    }
    if (fahrzeug.verkauft || fahrzeug.status === 'verkauft') {
      return res.status(409).json({ success: false, message: 'Fahrzeug bereits verkauft.' });
    }

    // 1.2 Bilder laden (max. 3, nach Reihenfolge)
    let bilderArr = [];
    const { data: bilderData, error: bilderError } = await db
      .from('fahrzeug_bilder')
      .select('bild_url')
      .eq('fahrzeug_id', fahrzeug_id)
      .order('reihenfolge', { ascending: true })
      .limit(3);

    if (!bilderError && Array.isArray(bilderData)) {
      bilderArr = bilderData.map(b => b.bild_url);
    }
    if (!bilderArr) bilderArr = [];

    // 1.3 Vertrag speichern
    const vertragsnummer = genVertragsnummer();
    const preis = fahrzeug.preis || 0;
    const vertragsdatum = new Date().toISOString();

    const fahrzeugdaten = {
      hersteller: fahrzeug.hersteller,
      modell: fahrzeug.modell,
      erstzulassung: fahrzeug.erstzulassung,
      kraftstoff: fahrzeug.kraftstoff,
      leistung: fahrzeug.leistung,
      karosserie: fahrzeug.karosserie,
      getriebe: fahrzeug.getriebe,
      kilometerstand: fahrzeug.kilometerstand,
      beschreibung: fahrzeug.beschreibung,
    };

    const { data: insertResult, error: insertError } = await db
      .from('kaufvertraege')
      .insert([{
        fahrzeug_id,
        benutzer_id,
        name,
        email,
        adresse,
        telefon,
        vertragsnummer,
        vertragsdatum,
        preis,
        fahrzeugdaten,
        bilder: bilderArr,
        status: 'offen'
      }])
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('❌ Fehler beim Kaufvertrag:', insertError);
      return res.status(500).json({ success: false, message: 'Fehler beim Anlegen des Kaufvertrags.' });
    }

    // 1.4 Fahrzeug als verkauft markieren (und reserviert_bis zurücksetzen, Status setzen)
    const { error: updateError } = await db
      .from('fahrzeuge')
      .update({ verkauft: true, status: 'verkauft', reserviert_bis: null })
      .eq('id', fahrzeug_id);

    if (updateError) {
      console.error('❌ Fehler beim Aktualisieren des Fahrzeugs:', updateError);
    }

    // 1.5 Alle Reservierungen zu diesem Fahrzeug löschen
    const { error: delResError } = await db
      .from('reservierungen')
      .delete()
      .eq('fahrzeug_id', fahrzeug_id);

    if (delResError) {
      console.error('❌ Fehler beim Löschen der Reservierungen:', delResError);
    }

    res.json({ success: true, vertrag: insertResult });
  } catch (err) {
    console.error('❌ Fehler beim Kauf:', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler beim Kauf.' });
  }
});

// ========== 2. Alle Kaufverträge für ein Benutzer-Profil ==========
router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: 'E-Mail ist erforderlich.' });
  }
  try {
    const { data, error } = await db
      .from('kaufvertraege')
      .select('*, fahrzeuge!inner(hersteller, modell, preis, bild_url, technische_daten, ausstattung)')
      .eq('email', email)
      .order('vertragsdatum', { ascending: false });

    if (error) {
      console.error('❌ Fehler beim Abrufen:', error);
      return res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Kaufverträge.' });
    }
    res.json({ success: true, vertraege: data });
  } catch (err) {
    console.error('❌ Fehler beim Abrufen:', err);
    res.status(500).json({ success: false, message: 'Fehler beim Abrufen der Kaufverträge.' });
  }
});

// ========== 3. PDF-Download für Kaufvertrag (mit Puppeteer & HTML-Template) ==========
router.get('/pdf/:id', async (req, res) => {
  const vertragId = req.params.id;
  const { data: vertrag, error } = await db
    .from('kaufvertraege')
    .select('*, fahrzeuge!inner(hersteller, modell, preis, bild_url, technische_daten, ausstattung)')
    .eq('id', vertragId)
    .maybeSingle();

  if (error || !vertrag) {
    return res.status(404).send('Kaufvertrag nicht gefunden.');
  }

  // Template laden und Variablen ersetzen
  const templatePath = path.join(__dirname, 'templates', 'kaufvertrag.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  html = html.replace('{{vertragsnummer}}', escapeHtml(vertrag.vertragsnummer));
  html = html.replace('{{name}}', escapeHtml(vertrag.name));
  html = html.replace('{{adresse}}', escapeHtml(vertrag.adresse));
  html = html.replace('{{email}}', escapeHtml(vertrag.email));
  html = html.replace('{{telefon}}', escapeHtml(vertrag.telefon));
  html = html.replace('{{hersteller}}', escapeHtml(vertrag.fahrzeuge.hersteller));
  html = html.replace('{{modell}}', escapeHtml(vertrag.fahrzeuge.modell));
  html = html.replace('{{preis}}', Number(vertrag.preis).toLocaleString('de-DE'));
  html = html.replace('{{vertragsdatum}}', new Date(vertrag.vertragsdatum).toLocaleDateString('de-DE'));

  // Fahrzeugbilder-Bereich komplett aus dem PDF entfernen (inklusive Überschrift)
  html = html.replace(/<div class="section">\s*<h3>Fahrzeugbilder<\/h3>[\s\S]*?<div class="pdf-bilder">[\s\S]*?{{bilder}}\s*<\/div>\s*<\/div>/, '');

  // Technische Daten
  let technischeDatenHtml = '';
  if (vertrag.fahrzeuge.technische_daten) {
    let daten;
    try { daten = JSON.parse(vertrag.fahrzeuge.technische_daten); } catch { daten = {}; }
    technischeDatenHtml = Object.entries(daten).map(([k,v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  }
  html = html.replace('{{technische_daten}}', technischeDatenHtml);

  // Ausstattung
  let ausstattungHtml = '';
  if (vertrag.fahrzeuge.ausstattung) {
    ausstattungHtml = vertrag.fahrzeuge.ausstattung.split('\n').filter(x=>x.trim()).map(x=>`<li>${x.replace(/^[-•]\s*/, '')}</li>`).join('');
  }
  html = html.replace('{{ausstattung}}', ausstattungHtml);

  // Puppeteer: HTML zu PDF
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Kaufvertrag-${vertrag.vertragsnummer || vertrag.id}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = router;
