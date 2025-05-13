// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const markenRouter = require('./marken');

app.use(cors());
app.use('/api', markenRouter);
app.use('/images', express.static(__dirname + '/../../Frontend/images'));

app.listen(3000, () => {
  console.log('🚀 Server läuft auf http://localhost:3000');
});
