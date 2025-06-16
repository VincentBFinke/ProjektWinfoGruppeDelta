const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const fahrzeugeRouter = require('./fahrzeuge');
const authRouter = require('./auth');
const reservierungRouter = require('./reservierung');
const kaufRouter = require('./kauf');  // NEU: Kauf-Router einbinden

app.use(cors());
app.use(express.json());

app.use('/api/fahrzeuge', fahrzeugeRouter);
app.use('/api/auth', authRouter);
app.use('/api/reservierung', reservierungRouter);
app.use('/api/kauf', kaufRouter); // NEU: Kauf-Router einbinden

// Statische Pfade für Bilder
app.use('/images', express.static(path.join(__dirname, '../../../Frontend/images')));
app.use('/images/fahrzeuge', express.static(path.join(__dirname, '../../../Frontend/images/fahrzeuge')));

app.listen(3000, () => {
  console.log('🚀 Server läuft auf http://localhost:3000');
});
