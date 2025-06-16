document.addEventListener("DOMContentLoaded", () => {
    // Umschalten Privat/Geschäftskunde
    const privatFields = document.getElementById("privat-fields");
    const geschaeftFields = document.getElementById("geschaeft-fields");
    document.querySelectorAll('input[name="kundentyp"]').forEach(radio => {
      radio.addEventListener("change", function() {
        if(this.value === "privat") {
          privatFields.style.display = "block";
          geschaeftFields.style.display = "none";
          geschaeftFields.querySelectorAll("input").forEach(inp => inp.required = false);
          privatFields.querySelector("input").required = true;
        } else {
          privatFields.style.display = "none";
          geschaeftFields.style.display = "block";
          privatFields.querySelector("input").required = false;
          geschaeftFields.querySelector('input[name="firma"]').required = true;
          geschaeftFields.querySelector('input[name="ansprechpartner"]').required = true;
        }
      });
    });
  
    // Registrierung abschicken
    document.getElementById("register-form").onsubmit = async function(e) {
      e.preventDefault(); // Verhindert klassischen Submit!
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      // Geschäftslogik
      if (data.kundentyp === "geschaeft" && (!data.firma || !data.ansprechpartner)) {
        alert("Bitte alle Pflichtfelder für Geschäftskunden ausfüllen.");
        return;
      }
  
      try {
        const res = await fetch("http://localhost:3000/api/auth/registrieren", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
  
        if (!res.ok || !result.success) {
          alert(result.message || "Registrierung fehlgeschlagen!");
          return;
        }
  
        // Weiterleitung: zurück zur Loginseite ODER auf vorherige Seite
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect") || "startseite.html";
        window.location.href = "anmelden.html?redirect=" + encodeURIComponent(redirect);
  
      } catch (err) {
        alert("Serverfehler bei der Registrierung.");
      }
    };
  
    // Login-Link übernimmt redirect
    document.getElementById("login-link").onclick = function(e) {
      e.preventDefault();
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect") || "startseite.html";
      window.location.href = "anmelden.html?redirect=" + encodeURIComponent(redirect);
    };
  });
  