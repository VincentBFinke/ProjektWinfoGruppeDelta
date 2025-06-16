// JS/header-user.js
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderUser();
  
    // Login-Modal-Logik
    document.body.addEventListener("click", function (e) {
      // Login-Link im Header
      if (e.target.id === "login-link" || (e.target.closest && e.target.closest("#login-link"))) {
        e.preventDefault();
        document.getElementById("login-modal").style.display = "flex";
      }
      // Schließen-Button
      if (e.target.id === "close-login") {
        document.getElementById("login-modal").style.display = "none";
      }
      // Klick aufs Modal-Hintergrund zum Schließen
      if (e.target.id === "login-modal") {
        document.getElementById("login-modal").style.display = "none";
      }
    });
  
    // Modal-Login-Formular
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const passwort = document.getElementById("login-passwort").value;
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
          localStorage.setItem("userName", data.name || data.firma || "Profil");
          document.getElementById("login-modal").style.display = "none";
          updateHeaderUser();
        } catch (err) {
          alert("Serverfehler beim Login.");
        }
      };
    }
  
    // Weiterleitung zur vollständigen Login-Seite (mit Redirect)
    const toFullLogin = document.getElementById("to-full-login");
    if (toFullLogin) {
      toFullLogin.onclick = function (e) {
        e.preventDefault();
        const path = window.location.pathname.replace(/^.*\//, "");
        const search = window.location.search;
        window.location.href =
          "anmelden.html?redirect=" + encodeURIComponent(path + search);
      };
    }
  
    // Modal-Registrieren-Link: ebenfalls Redirect mitgeben
    const goRegister = document.getElementById("go-register");
    if (goRegister) {
      goRegister.onclick = function (e) {
        e.preventDefault();
        const path = window.location.pathname.replace(/^.*\//, "");
        const search = window.location.search;
        window.location.href =
          "registrieren.html?redirect=" + encodeURIComponent(path + search);
      };
    }
  });
  
  // Header dynamisch anpassen (Name/Logout oder Login)
  function updateHeaderUser() {
    const navRight = document.getElementById("nav-right");
    const userName = localStorage.getItem("userName");
    if (userName) {
      navRight.innerHTML = `
        <a href="#">Services</a>
        <a href="#">Kontakt</a>
        <a href="profil.html" id="profil-link"><i class="fas fa-user"></i> Profil ansehen</a>
        <a href="#" id="logout-link">Logout</a>
      `;
      document.getElementById("logout-link").onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem("userName");
        updateHeaderUser();
      };
    } else {
      navRight.innerHTML = `
        <a href="#">Services</a>
        <a href="#">Kontakt</a>
        <a href="#" id="login-link"><i class="fas fa-user"></i> Login</a>
      `;
    }
  }
  