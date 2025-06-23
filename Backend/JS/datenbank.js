// .env laden (feste Pfadangabe)
require('dotenv').config({ path: __dirname + '/../../.env' });

// Zusätzliche Debug-Ausgaben
console.log("🌐 SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("🔑 SUPABASE_SERVICE_ROLE_KEY Länge:", process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 'undefined');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ FEHLER: SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY nicht gefunden! Bitte prüfe deine .env und den Pfad.');
  process.exit(1); // Beende das Programm, wenn Variablen fehlen
}

const { createClient } = require('@supabase/supabase-js');

// Supabase-Client initialisieren
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Einfache Testfunktion (optional)
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('fahrzeuge')
      .select('*')
      .limit(1);
    if (error) {
      console.error('❌ Fehler bei Verbindung zu Supabase API:', error);
    } else {
      console.log('✅ Mit Supabase API verbunden! Beispiel:', data);
    }
  } catch (err) {
    console.error('❌ Ausnahme beim Test der Supabase-Verbindung:', err);
  }
}

// Direkt beim Start testen (entfernen, wenn zu nervig)
testConnection();

module.exports = supabase;
