const express = require('express');
const cors = require('cors');
const app = express();

const fahrzeugeRouter = require('./fahrzeuge'); // << Nur fahrzeuge nötig

app.use(cors());
app.use(express.json());

app.use('/api/fahrzeuge', fahrzeugeRouter);

app.use('/images', express.static(__dirname + '/../../Frontend/images'));
app.use('/images/fahrzeuge', express.static(__dirname + '/../../Frontend/images/fahrzeuge'));

app.listen(3000, () => {
  console.log('🚀 Server läuft auf http://localhost:3000');
});
