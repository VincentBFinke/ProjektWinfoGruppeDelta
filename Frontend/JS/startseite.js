document.addEventListener("DOMContentLoaded", () => {
  const marken = [
    { name: "Audi", image: "audi.png" },
    { name: "BMW", image: "bmw.png" },
    { name: "Mercedes-Benz", image: "mercedes.png" },
    { name: "Volkswagen", image: "vw.png" },
  ];

  marken.sort((a, b) => a.name.localeCompare(b.name));

  const container = document.getElementById("marken-container");

  marken.forEach(marke => {
    const card = document.createElement("div");
    card.innerHTML = `
      <a href="marke.html?name=${encodeURIComponent(marke.name)}" class="marken-link">
        <div class="marken-card">
          <img src="../images/${marke.image}" alt="${marke.name} Logo">
          <h3>${marke.name}</h3>
          <p>Überprüfen Sie alle<br>${marke.name} Modelle</p>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
});
