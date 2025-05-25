// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Routen einbinden
const markenRouter = require('./marken');
const fahrzeugeRouter = require('./fahrzeuge');

app.use(cors());
app.use(express.json()); // für POST-Requests

// Routen verwenden
app.use('/api', markenRouter);
app.use('/api', fahrzeugeRouter);

// Statische Bilder (z. B. Fahrzeugbilder im Unterordner "fahrzeuge")
app.use('/images', express.static(__dirname + '/../../Frontend/images'));
app.use('/images/fahrzeuge', express.static(__dirname + '/../../Frontend/images/fahrzeuge'));

app.listen(3000, () => {
  console.log('🚀 Server läuft auf http://localhost:3000');
});
