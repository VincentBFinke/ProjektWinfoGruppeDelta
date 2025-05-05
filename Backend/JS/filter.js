/**
 * Handles vehicle filtering and display
 */

// Demo-Daten - in der Praxis würden diese von einer API kommen
const demoVehicles = [
    {
        id: 1,
        marke: 'Audi',
        modell: 'A4',
        preis: 28900,
        baujahr: 2019,
        kilometer: 45000,
        leistung: 190,
        bild: '../images/auto1.jpg'
    },
    // Weitere Demo-Fahrzeuge...
];

document.addEventListener('DOMContentLoaded', function() {
    // Preis-Slider Update
    const preisSlider = document.getElementById('preis');
    const preisValue = document.getElementById('preisValue');
    
    preisSlider.addEventListener('input', function() {
        preisValue.textContent = new Intl.NumberFormat('de-DE').format(this.value);
    });
    
    // Filter-Formular
    document.getElementById('filterForm').addEventListener('submit', function(e) {
        e.preventDefault();
        applyFilters();
    });
    
    // Initiale Anzeige
    displayVehicles(demoVehicles);
});

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