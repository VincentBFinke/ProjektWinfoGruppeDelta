const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Router laden
const fahrzeugeRouter = require('./fahrzeuge');
const authRouter = require('./auth');
const reservierungRouter = require('./reservierung');
const kaufRouter = require('./kauf');
const ankaufRouter = require('./ankauf');
const zulassungRouter = require('./zulassung');
const finanzierungRouter = require('./finanzierung'); // <- NEU

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API-Router
app.use('/api/fahrzeuge', fahrzeugeRouter);
app.use('/api/auth', authRouter);
app.use('/api/reservierung', reservierungRouter);
app.use('/api/kauf', kaufRouter);
app.use('/api/ankauf', ankaufRouter);
app.use('/api/zulassung', zulassungRouter);
app.use('/api/finanzierung', finanzierungRouter); // <- NEU

// Statische Pfade für Bilder & Uploads
app.use('/images', express.static(path.join(__dirname, '../../../Frontend/images')));
app.use('/uploads/ankauf', express.static(path.join(__dirname, '../uploads/ankauf')));

app.use(express.static(path.join(__dirname, '../../Frontend')));

// Fallback für 404
app.use((req, res) => {
  res.status(404).send('Seite nicht gefunden');
});

app.listen(3000, () => {
  console.log('🚀 Server läuft auf http://localhost:3000');
});
