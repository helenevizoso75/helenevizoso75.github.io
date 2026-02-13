document.addEventListener('DOMContentLoaded', () => {
    
    // Sélection des éléments
    const modal = document.getElementById('gameModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.querySelector('.close-btn');
    
    // Sélectionner tous les articles (items de la frise)
    const items = document.querySelectorAll('.tree-item');

    // Ajouter un clic sur chaque jeu
    items.forEach(item => {
        item.addEventListener('click', () => {
            // 1. Récupérer les infos
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            // On récupère l'image qui est déjà dans la carte
            const imgSrc = item.querySelector('img').src;

            // 2. Remplir le modal
            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalImg.src = imgSrc;

            // 3. Afficher le modal
            modal.style.display = 'flex'; // Nécessaire pour l'alignement
            // Petit délai pour permettre l'animation CSS
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });

    // Fonction pour fermer
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Attendre la fin de l'animation
    };

    // Clic sur la croix
    closeBtn.addEventListener('click', closeModal);

    // Clic en dehors du contenu (sur le fond sombre)
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });
});

/* --- EFFET POUSSIÈRE D'OR (PARTICULES) --- */
const canvas = document.getElementById('gold-dust');
const ctx = canvas.getContext('2d');

let particlesArray;

// Réglage de la taille du canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Création de la classe Particule
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        // Taille très petite pour l'effet "poussière"
        this.size = Math.random() * 2 + 0.5; 
        // Vitesse très lente (flottement)
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        // Couleur Or avec transparence variable
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Si la particule sort de l'écran, elle réapparaît de l'autre côté
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Couleur OR
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

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