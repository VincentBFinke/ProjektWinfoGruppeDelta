/**
 * Handles user authentication for Carpro
 */

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kundentyp aus Dropdown
    const customerType = document.getElementById('customerType').value;

    // Validierung: Wurde ein Kundentyp gewählt?
    if (!customerType) {
        alert("Bitte wählen Sie einen Kundentyp aus.");
        return;
    }

    // Hier würde normalerweise eine API-Anfrage stehen
    console.log(`Login attempt with: ${username}, Kundentyp: ${customerType}`);

    // Optional: Kundentyp lokal speichern (z.B. für Filterseite)
    localStorage.setItem('customerType', customerType);

    // Demo: Weiterleitung nach 1 Sekunde
    setTimeout(() => {
        window.location.href = '../HTML/filterseite.html';
    }, 1000);
});
