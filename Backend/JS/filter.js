/**
 * Handles vehicle filtering and display
 */

// Demo-Daten - in der Praxis würden diese von einer API kommen
// Demo-Daten mit mehr Attributenn
const demoVehicles = [
    {
        id: 1,
        marke: 'Audi',
        modell: 'A4',
        preis: 28900,
        baujahr: 2019,
        kilometer: 45000,
        leistung: 190,
        getriebe: 'automatik',
        kraftstoff: 'diesel',
        bild: '../images/auto1.jpg'
    },
    {
        id: 2,
        marke: 'BMW',
        modell: '320i',
        preis: 32500,
        baujahr: 2020,
        kilometer: 12000,
        leistung: 184,
        getriebe: 'manuell',
        kraftstoff: 'benzin',
        bild: '../images/auto2.jpg'
    },
    // Weitere Fahrzeuge...
];

function applyFilters() {
    const marke = document.getElementById('marke').value;
    const maxPreis = document.getElementById('preis').value;
    const kilometer = document.getElementById('kilometer').value;
    const getriebe = document.querySelector('input[name="getriebe"]:checked').value;
    const kraftstoffe = Array.from(document.querySelectorAll('input[name="kraftstoff"]:checked')).map(el => el.value);
    const leistung = document.getElementById('leistung').value;
    const baujahr = document.getElementById('baujahr').value;

    const filtered = demoVehicles.filter(vehicle => {
        // Markenfilter
        if (marke && vehicle.marke.toLowerCase() !== marke) return false;
        
        // Preisfilter
        if (vehicle.preis > maxPreis) return false;
        
        // Kilometerfilter
        if (kilometer) {
            const [min, max] = kilometer.split('-').map(Number);
            if (vehicle.kilometer < min || vehicle.kilometer > max) return false;
        }
        
        // Getriebefilter
        if (getriebe && vehicle.getriebe !== getriebe) return false;
        
        // Kraftstofffilter
        if (kraftstoffe.length > 0 && !kraftstoffe.includes(vehicle.kraftstoff)) return false;
        
        // Leistungsfilter
        if (leistung) {
            const [min, max] = leistung.split('-').map(Number);
            if (vehicle.leistung < min || (max && vehicle.leistung > max)) return false;
        }
        
        // Baujahrfilter
        if (baujahr && vehicle.baujahr < baujahr) return false;
        
        return true;
    });
    
    displayVehicles(filtered);
}

// Event-Listener für Formular-Reset
document.querySelector('button[type="reset"]').addEventListener('click', function() {
    setTimeout(() => {
        document.getElementById('preisValue').textContent = '25.000';
        applyFilters();
    }, 0);
});
    
    // Initiale Anzeige
    displayVehicles(demoVehicles);
;

function applyFilters() {
    const marke = document.getElementById('marke').value;
    const maxPreis = document.getElementById('preis').value;
    
    const filtered = demoVehicles.filter(vehicle => {
        return (!marke || vehicle.marke.toLowerCase() === marke) &&
               vehicle.preis <= maxPreis;
    });
    
    displayVehicles(filtered);
}

function displayVehicles(vehicles) {
    const container = document.getElementById('resultsGrid');
    container.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.innerHTML = `
            <img src="${vehicle.bild}" alt="${vehicle.marke} ${vehicle.modell}">
            <div class="vehicle-info">
                <h3>${vehicle.marke} ${vehicle.modell}</h3>
                <p>${new Intl.NumberFormat('de-DE').format(vehicle.preis)} €</p>
                <a href="einzelangebot.html?id=${vehicle.id}">Details</a>
            </div>
        `;
        container.appendChild(card);
    });
}