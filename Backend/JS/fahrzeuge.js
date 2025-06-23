const express = require('express');
const router = express.Router();
const db = require('./datenbank'); // Supabase-Client

function handleError(res, error) {
  console.error('❌ Supabase-Fehler:', error);
  return res.status(500).json(['Fehler']);
}

// === Filter-Endpunkte ===

router.get('/karosserie', async (req, res) => {
  const { data, error } = await db.from('fahrzeuge').select('karosserie');
  if (error) return handleError(res, error);
  const unique = [...new Set(data.map(row => row.karosserie))];
  res.json(unique);
});

router.get('/hersteller', async (req, res) => {
  const { data, error } = await db.from('fahrzeuge').select('hersteller');
  if (error) return handleError(res, error);
  const unique = [...new Set(data.map(row => row.hersteller))];
  res.json(unique);
});

router.get('/modell', async (req, res) => {
  const hersteller = req.query.hersteller;
  let query = db.from('fahrzeuge').select('modell');
  if (hersteller) query = query.eq('hersteller', hersteller);
  const { data, error } = await query.order('modell', { ascending: true });
  if (error) return handleError(res, error);
  const unique = [...new Set(data.map(row => row.modell))];
  res.json(unique);
});

router.get('/kraftstoff', async (req, res) => {
  const { data, error } = await db.from('fahrzeuge').select('kraftstoff');
  if (error) return handleError(res, error);
  const unique = [...new Set(data.map(row => row.kraftstoff))];
  res.json(unique);
});

router.get('/getriebe', async (req, res) => {
  const { data, error } = await db.from('fahrzeuge').select('getriebe');
  if (error) return handleError(res, error);
  const unique = [...new Set(data.map(row => row.getriebe))];
  res.json(unique);
});

router.get('/erstzulassung-bereich', async (req, res) => {
  const { data, error } = await db.from('fahrzeuge').select('erstzulassung');
  if (error) return res.status(500).json({ minjahr: 2000, maxjahr: 2025 });

  const jahre = data.map(d => new Date(d.erstzulassung).getFullYear());
  res.json({
    minjahr: Math.min(...jahre),
    maxjahr: Math.max(...jahre),
  });
});

// === Fahrzeugbilder (für Einzelangebot) ===

router.get('/:id/bilder', async (req, res) => {
  const { data, error } = await db
    .from('fahrzeug_bilder')
    .select('bild_url')
    .eq('fahrzeug_id', req.params.id)
    .order('reihenfolge');

  if (error) return handleError(res, error);
  res.json(data.map(row => row.bild_url));
});

// === Fahrzeuge anzeigen/filtern ===

router.get('/', async (req, res) => {
  let query = db.from('fahrzeuge').select('*');

  // Fehlerabfang für ungültige ID
  if (req.query.id) {
    if (isNaN(Number(req.query.id))) {
      return res.status(400).json([]);
    }
    query = query.eq('id', req.query.id);
  } else {
    if (req.query.karosserie) query = query.eq('karosserie', req.query.karosserie);
    if (req.query.hersteller) query = query.eq('hersteller', req.query.hersteller);
    if (req.query.modell) query = query.eq('modell', req.query.modell);
    if (req.query.kraftstoff) query = query.eq('kraftstoff', req.query.kraftstoff);
    if (req.query.getriebe) query = query.eq('getriebe', req.query.getriebe);
    if (req.query.kilometer) query = query.lte('kilometerstand', req.query.kilometer);
    if (req.query.erstzulassung_ab) {
      const year = parseInt(req.query.erstzulassung_ab);
      query = query.gte('erstzulassung', `${year}-01-01`);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fehler beim Abrufen:', error);
    return res.status(500).json([]);
  }

  // === Status-Handling (verkauft/reserviert/frei) ===
  const now = new Date();
  const datenMitStatus = data.map(auto => {
    let status = 'frei';
    if (auto.verkauft || auto.status === 'verkauft') {
      status = 'verkauft';
    } else if (auto.reserviert_bis && new Date(auto.reserviert_bis) >= now) {
      status = 'reserviert';
    }
    return { ...auto, status };
  });

  // Optional: Shuffle für Fahrzeugliste
  if (!req.query.id && datenMitStatus.length > 1) {
    datenMitStatus.sort(() => Math.random() - 0.5);
  }

  res.json(datenMitStatus);
});

module.exports = router;
