const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL-Verbindung
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'carpro'
});

// Verbindung prüfen
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Verbunden mit MySQL-Datenbank "carpro"');
});

// Registrierung-Route
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Prüfen, ob E-Mail bereits existiert
  db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Serverfehler' });
    if (results.length > 0) return res.status(400).json({ message: 'E-Mail bereits registriert' });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ message: 'Fehler beim Einfügen' });
        res.status(201).json({ message: 'Registrierung erfolgreich' });
      }
    );
  });
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});
