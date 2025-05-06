document.addEventListener('DOMContentLoaded', function () {
    const demoVehicles = [
        { id: 1, marke: 'BMW', modell: '3er', preis: 22900, baujahr: 2019, kilometer: 54000, bild: '../images/auto1.jpg' },
        { id: 2, marke: 'VW', modell: 'Golf', preis: 18900, baujahr: 2020, kilometer: 32000, bild: '../images/auto2.jpg' },
        { id: 3, marke: 'Audi', modell: 'A4', preis: 23900, baujahr: 2018, kilometer: 61000, bild: '../images/auto3.jpg' },
        { id: 4, marke: 'Ford', modell: 'Focus', preis: 16500, baujahr: 2021, kilometer: 15000, bild: '../images/auto4.jpg' },
        { id: 5, marke: 'Opel', modell: 'Astra', preis: 17200, baujahr: 2020, kilometer: 28000, bild: '../images/auto5.jpg' },
        { id: 6, marke: 'Mercedes', modell: 'C-Klasse', preis: 24500, baujahr: 2017, kilometer: 72000, bild: '../images/auto6.jpg' }
    ];

    const container = document.getElementById('angeboteGrid');

    demoVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'angebot-card';
        card.innerHTML = `
            <img src="${vehicle.bild}" alt="${vehicle.marke} ${vehicle.modell}">
            <div class="angebot-info">
                <h3>${vehicle.marke} ${vehicle.modell}</h3>
                <p class="price">${vehicle.preis.toLocaleString('de-DE')} €</p>
                <p>Baujahr: ${vehicle.baujahr} | ${vehicle.kilometer.toLocaleString('de-DE')} km</p>
                <a href="einzelangebot.html?id=${vehicle.id}" class="btn-details">Zum Angebot</a>
            </div>
        `;
        container.appendChild(card);
    });
});
