/**
 * Handles user authentication for Carpro
 */

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hier würde normalerweise eine API-Anfrage stehen
    console.log(`Login attempt with: ${username}`);
    
    // Demo: Weiterleitung nach 1 Sekunde
    setTimeout(() => {
        window.location.href = '../HTML/filterseite.html';
    }, 1000);
    
    // Fehlerbehandlung würde hier stehen
});