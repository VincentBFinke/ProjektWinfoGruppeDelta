// datenbank.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // bei XAMPP meistens leer
  database: 'carpro'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL verbunden!');
});

module.exports = db;
