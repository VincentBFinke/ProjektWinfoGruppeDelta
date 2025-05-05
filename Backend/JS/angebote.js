/**
 * Displays special offers
 */

document.addEventListener('DOMContentLoaded', function() {
    // Hier würde normalerweise eine API-Anfrage stehen
    const topAngebote = demoVehicles.filter(v => v.preis < 25000).slice(0, 6);
    
    const container = document.getElementById('angeboteGrid');
    topAngebote.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'angebot-card';
        card.innerHTML = `
            <span class="highlight-badge">TOP ANGEBOT</span>
            <img src="${vehicle.bild}" alt="${vehicle.marke} ${vehicle.modell}">
            <div class="angebot-info">
                <h3>${vehicle.marke} ${vehicle.modell}</h3>
                <p class="price">${new Intl.NumberFormat('de-DE').format(vehicle.preis)} €</p>
                <p>Baujahr: ${vehicle.baujahr} | ${vehicle.kilometer} km</p>
                <a href="einzelangebot.html?id=${vehicle.id}" class="btn-details">Details</a>
            </div>
        `;
        container.appendChild(card);
    });
});