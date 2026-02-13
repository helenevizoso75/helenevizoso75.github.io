/* --- LOGIQUE POP-UP VIDÉO --- */
document.addEventListener('DOMContentLoaded', () => {
    
    const modal = document.getElementById('gameModal');
    // On cible la div de gauche qui contiendra la vidéo
    const modalLeft = document.querySelector('.modal-left'); 
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.querySelector('.close-btn');
    const items = document.querySelectorAll('.tree-item');

    // OUVERTURE DU MODAL
    items.forEach(item => {
        item.addEventListener('click', () => {
            // 1. Récupérer les infos
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            const videoId = item.getAttribute('data-video'); // L'ID YouTube

            // 2. Remplir le texte
            modalTitle.textContent = title;
            modalDesc.textContent = desc;

            // 3. INJECTER LA VIDÉO YOUTUBE
            // On remplace le contenu de la partie gauche par un iframe
            // autoplay=1 lance la vidéo automatiquement
            // mute=0 active le son
            modalLeft.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;

            // 4. Afficher le modal
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });

    // FERMETURE DU MODAL
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            // IMPORTANT : On vide le contenu pour couper le son de la vidéo
            modalLeft.innerHTML = ''; 
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });
});

// Initialisation des particules
function initParticles() {
    particlesArray = [];
    // Nombre de particules (adapté à la taille de l'écran)
    // Moins de particules sur mobile pour la performance
    const numberOfParticles = (canvas.width * canvas.height) / 15000; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

// Animation boucle
function animateParticles() {
    // On efface le canvas à chaque image pour redessiner
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Lancement
initParticles();
animateParticles();