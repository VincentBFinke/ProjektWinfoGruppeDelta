/**
 * Shows detailed vehicle information
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fahrzeug-ID aus URL holen
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    
    // Hier würde normalerweise eine API-Anfrage stehen
    const vehicle = demoVehicles.find(v => v.id == vehicleId) || demoVehicles[0];
    
    // Seite befüllen
    document.getElementById('fahrzeugTitel').textContent = 
        `${vehicle.marke} ${vehicle.modell}`;
    
    document.getElementById('mainImage').src = vehicle.bild;
    
    const specsContainer = document.querySelector('.detail-specs');
    specsContainer.innerHTML = `
        <div class="spec-item">
            <span>Preis:</span>
            <span>${new Intl.NumberFormat('de-DE').format(vehicle.preis)} €</span>
        </div>
        <div class="spec-item">
            <span>Baujahr:</span>
            <span>${vehicle.baujahr}</span>
        </div>
        <div class="spec-item">
            <span>Kilometerstand:</span>
            <span>${new Intl.NumberFormat('de-DE').format(vehicle.kilometer)} km</span>
        </div>
        <div class="spec-item">
            <span>Leistung:</span>
            <span>${vehicle.leistung} PS</span>
        </div>
    `;
    
    // Thumbnails (in der Praxis mehrere Bilder)
    const thumbContainer = document.querySelector('.thumbnail-container');
    thumbContainer.innerHTML = `
        <img src="${vehicle.bild}" class="thumbnail active" onclick="changeMainImage(this)">
    `;
});

function changeMainImage(thumb) {
    document.getElementById('mainImage').src = thumb.src;
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}