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

  const emailInput = document.getElementById("email-input");
  const emailError = document.getElementById("email-error");
  let emailTouched = false; // Merker: Schon geprüft?

  // Live-Check NUR falls vorher Fehler
  emailInput.addEventListener("input", function() {
    if (emailTouched) {
      validateEmailField();
    }
  });

  function validateEmailField() {
    const email = emailInput.value.trim();
    if (!/^[^@]+@[^@]+\.(de|com)$/i.test(email)) {
      emailInput.classList.add("input-error");
      emailError.textContent = "Geben Sie eine gültige Top-Level-Domain an, zum Beispiel .com oder .de";
      emailError.style.display = "block";
      return false;
    } else {
      emailInput.classList.remove("input-error");
      emailError.textContent = "";
      emailError.style.display = "none";
      return true;
    }
  }

  document.getElementById("register-form").onsubmit = async function(e) {
    e.preventDefault();
    emailTouched = true; // Jetzt erst prüfen & anzeigen

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // E-Mail-Domain-Check mit UI-Meldung
    if (!validateEmailField()) {
      emailInput.focus();
      return;
    }

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

  // Login-Link übernimmt redirect (damit der zurück weiß, wohin danach)
  document.getElementById("login-link").onclick = function(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    let loginUrl = "anmelden.html";
    if (redirect) {
      loginUrl += "?redirect=" + encodeURIComponent(redirect);
    }
    window.location.href = loginUrl;
  };
});
