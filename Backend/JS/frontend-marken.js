document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('marken-container');
  
    try {
      const res = await fetch('http://localhost:3000/api/marken');
      const marken = await res.json();
  
      marken.forEach(marke => {
        const div = document.createElement('div');
        div.className = 'marken-logo';
  
        const img = document.createElement('img');
        img.src = `http://localhost:3000/${marke.logo_url}`;
        img.alt = marke.name;
  
        div.appendChild(img);
        container.appendChild(div);
      });
    } catch (error) {
      console.error('Fehler beim Laden der Marken:', error);
    }
  });
  