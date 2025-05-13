// Daten dynamisch laden und auf der Startseite einfügen
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/api/marken");
    const marken = await response.json();

    const container = document.getElementById("marken-container");

    marken.forEach(marke => {
      const card = document.createElement("div");
      card.classList.add("marken-card");

      const img = document.createElement("img");
      img.src = marke.logoPfad;
      img.alt = `${marke.name} Logo`;
      img.classList.add("marken-logo");

      const name = document.createElement("h3");
      name.textContent = marke.name;

      const beschreibung = document.createElement("p");
      beschreibung.textContent = marke.beschreibung;

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(beschreibung);

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Marken:", error);
  }
});
