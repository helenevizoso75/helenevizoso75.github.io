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

/* --- EFFET POUSSIÈRE D'OR (VERSION PLUS VISIBLE) --- */
const canvas = document.getElementById('gold-dust');
const ctx = canvas.getContext('2d');

let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // MODIFICATION 1 : TAILLE PLUS GROSSE
        // Avant : de 0.5px à 2.5px
        // Maintenant : de 2px à 5px
        this.size = Math.random() * 3 + 2; 
        
        this.speedX = Math.random() * 0.6 - 0.3; // Un tout petit peu plus rapide aussi
        this.speedY = Math.random() * 0.6 - 0.3;
        
        // MODIFICATION 2 : PLUS OPAQUE (BRILLANT)
        // Avant : de 0.1 à 0.6
        // Maintenant : de 0.4 à 0.9 (Presque solide)
        this.opacity = Math.random() * 0.5 + 0.4;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    // MODIFICATION 3 : PLUS DE PARTICULES
    // On divise par un chiffre plus petit (9000 au lieu de 15000) pour en créer plus
    const numberOfParticles = (canvas.width * canvas.height) / 9000; 
    
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();

/* --- SYSTÈME DE SONDAGE (SIMULÉ) --- */

// 1. Initialisation des données (Fake Database)
// Si l'utilisateur n'a jamais visité, on crée des stats aléatoires
function initPollData() {
    if (!localStorage.getItem('goty_votes')) {
        const initialData = {};
        // Liste des années de 2014 à 2025
        const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014];
        
        years.forEach(year => {
            // On génère entre 100 et 5000 votes aléatoires
            const randomYes = Math.floor(Math.random() * 4000) + 100; 
            const randomNo = Math.floor(Math.random() * 1000) + 50; 
            
            initialData[year] = {
                yes: randomYes,
                no: randomNo,
                userVoted: false // L'utilisateur n'a pas encore voté
            };
        });
        
        localStorage.setItem('goty_votes', JSON.stringify(initialData));
    }
}

// 2. Fonction pour récupérer les données
function getPollData() {
    return JSON.parse(localStorage.getItem('goty_votes'));
}

// 3. Fonction pour afficher les résultats
function displayResults(year) {
    const data = getPollData();
    const yearData = data[year];
    const total = yearData.yes + yearData.no;
    
    // Calcul pourcentage
    const percentYes = Math.round((yearData.yes / total) * 100);
    const percentNo = 100 - percentYes;

    // Sélection des éléments HTML
    const container = document.querySelector(`.poll-container[data-year="${year}"]`);
    const buttons = container.querySelector('.poll-buttons');
    const results = container.querySelector('.poll-results');
    const fill = container.querySelector('.progress-fill');
    const statYes = container.querySelector('.stat-yes');
    const statNo = container.querySelector('.stat-no');

    // Masquer boutons, afficher résultats
    buttons.style.display = 'none';
    results.style.display = 'block';

    // Animation de la barre
    setTimeout(() => {
        fill.style.width = `${percentYes}%`;
    }, 100);

    // Mise à jour textes
    statYes.textContent = `${percentYes}% OUI (${yearData.yes})`;
    statNo.textContent = `${percentNo}% NON (${yearData.no})`;
}

// 4. Fonction appelée au clic sur le bouton (définie dans le HTML onclick)
window.vote = function(year, choice) {
    const data = getPollData();
    
    // Si déjà voté, on arrête
    if (data[year].userVoted) return;

    // Ajout du vote
    if (choice === 'yes') {
        data[year].yes++;
    } else {
        data[year].no++;
    }
    
    // Marquer comme voté
    data[year].userVoted = true;

    // Sauvegarde
    localStorage.setItem('goty_votes', JSON.stringify(data));

    // Affichage
    displayResults(year);
}

// 5. Au chargement de la page : Vérifier qui a déjà voté
document.addEventListener('DOMContentLoaded', () => {
    initPollData(); // Créer les fausses données si besoin
    const data = getPollData();
    
    // Pour chaque sondage sur la page
    document.querySelectorAll('.poll-container').forEach(container => {
        const year = container.getAttribute('data-year');
        
        // Si l'utilisateur a déjà voté pour cette année, on affiche direct les résultats
        if (data[year] && data[year].userVoted) {
            displayResults(year);
        }
    });
});