document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = loginForm.email.value.trim();
    const passwort = loginForm.passwort.value;

    try {
      const res = await fetch("http://localhost:3000/api/auth/anmelden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwort }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Login fehlgeschlagen!");
        return;
      }

      // Benutzername in LocalStorage speichern (für Header etc.)
      localStorage.setItem("userName", data.name || data.firma || "Profil");

      // Nach dem Login korrekt weiterleiten
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect") || "startseite.html";
      // Falls redirect bereits eine vollständige URL ist, einfach nutzen
      window.location.href = decodeURIComponent(redirect);
    } catch (err) {
      alert("Serverfehler beim Login.");
      console.error(err);
    }
  });

  // Register-Link übernimmt redirect (damit der zurück weiß, wohin danach)
  document.getElementById("register-link").onclick = function(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    let regUrl = "registrieren.html";
    if (redirect) {
      regUrl += "?redirect=" + encodeURIComponent(redirect);
    }
    window.location.href = regUrl;
  };
});
