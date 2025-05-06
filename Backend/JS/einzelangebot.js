document.querySelectorAll('.thumbnail').forEach(thumbnail => {
  thumbnail.addEventListener('click', function () {
    // Hauptbild ändern
    document.getElementById('mainImage').src = this.dataset.src;

    // aktive Klasse setzen
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});
