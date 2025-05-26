require('dotenv').config({ path: __dirname + '/../../.env' }); // <- feste Pfadangabe
const { Pool } = require('pg');

console.log("🌐 Verbindung zu:", process.env.PG_HOST); // Debug-Ausgabe

const db = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: { rejectUnauthorized: false } // notwendig für Supabase
});

db.connect()
  .then(() => console.log('✅ Mit Supabase (PostgreSQL) verbunden!'))
  .catch((err) => console.error('❌ Fehler bei Verbindung zu Supabase:', err));

module.exports = db;
