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

/* --- SYSTÈME DE SONDAGE (SIMULÉ AVEC HISTOIRE RÉELLE) --- */

function initPollData() {
    if (!localStorage.getItem('goty_votes')) {
        const initialData = {};
        
        // Configuration des années avec des ratios réalistes
        const configs = {
            // 2025 : Futur (On met 50/50 pour le suspense ou un léger avantage GTA/Clair Obscur)
            2025: { yesMin: 400, yesMax: 600, noMin: 300, noMax: 500 },
            
            // 2024 : Astro Bot (Aimé mais Wukong/FF7 avaient des fans) -> ~65% Oui
            2024: { yesMin: 2000, yesMax: 2500, noMin: 1000, noMax: 1500 },

            // 2023 : BG3 (Le Roi incontesté) -> ~95% Oui
            2023: { yesMin: 4800, yesMax: 5000, noMin: 100, noMax: 300 },

            // 2022 : Elden Ring (Chef d'oeuvre, mais Ragnarok existait) -> ~85% Oui
            2022: { yesMin: 4000, yesMax: 4500, noMin: 500, noMax: 800 },

            // 2021 : It Takes Two (Surprise, certains voulaient RE Village) -> ~60% Oui
            2021: { yesMin: 1500, yesMax: 1800, noMin: 1000, noMax: 1200 },

            // 2020 : TLOU2 (LA GUERRE TOTALE - Ghost of Tsushima volé ?) -> ~45% Oui (Controversé)
            2020: { yesMin: 2000, yesMax: 2200, noMin: 2300, noMax: 2800 }, 

            // 2019 : Sekiro (Respecté, mais dur) -> ~80% Oui
            2019: { yesMin: 3000, yesMax: 3500, noMin: 600, noMax: 900 },

            // 2018 : God of War (Vs Red Dead 2, duel de titans) -> ~60% Oui (Serré)
            2018: { yesMin: 3500, yesMax: 3800, noMin: 2000, noMax: 2500 },

            // 2017 : Zelda BotW (Légendaire) -> ~92% Oui
            2017: { yesMin: 4500, yesMax: 4800, noMin: 300, noMax: 500 },

            // 2016 : Overwatch (Le grand "Vol" face à Uncharted 4) -> ~40% Oui (Mal vieilli)
            2016: { yesMin: 1200, yesMax: 1500, noMin: 2500, noMax: 3000 },

            // 2015 : Witcher 3 (Le GOAT) -> ~96% Oui
            2015: { yesMin: 4900, yesMax: 5000, noMin: 50, noMax: 200 },

            // 2014 : Dragon Age (Année faible, gagné par défaut) -> ~55% Oui
            2014: { yesMin: 1200, yesMax: 1500, noMin: 1000, noMax: 1300 }
        };
        
        // Génération des données
        for (const [year, conf] of Object.entries(configs)) {
            const randomYes = Math.floor(Math.random() * (conf.yesMax - conf.yesMin + 1)) + conf.yesMin;
            const randomNo = Math.floor(Math.random() * (conf.noMax - conf.noMin + 1)) + conf.noMin;
            
            initialData[year] = {
                yes: randomYes,
                no: randomNo,
                userVoted: false
            };
        }
        
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

/* --- LOGIQUE DU QUIZ --- */
const quizQuestions = [
    { q: "Quel studio a gagné deux fois le GOTY entre 2014 et 2024 ?", a: ["FromSoftware", "Naughty Dog", "Nintendo", "Santa Monica"], correct: 0 },
    { q: "En 2018, quel jeu a perdu face à God of War ?", a: ["RDR2", "Spider-Man", "Celeste", "Assassin's Creed"], correct: 0 },
    { q: "Quel jeu détient le record du nombre total de récompenses ?", a: ["The Witcher 3", "Elden Ring", "TLOU Part II", "Zelda BotW"], correct: 1 },
    { q: "Quel est le seul jeu exclusivement coopératif à avoir gagné ?", a: ["A Way Out", "It Takes Two", "Portal 2", "Overwatch"], correct: 1 },
    { q: "Qui a prononcé le discours le plus long de l'histoire ?", a: ["Hideo Kojima", "Christopher Judge", "Neil Druckmann", "Geoff Keighley"], correct: 1 },
    { q: "En quelle année Overwatch a-t-il créé la surprise ?", a: ["2014", "2015", "2016", "2017"], correct: 2 },
    { q: "Quel jeu a gagné le premier prix GOTY en 2014 ?", a: ["Dragon Age: Inquisition", "Dark Souls 2", "The Witcher 3", "Skyrim"], correct: 0 },
    { q: "Lequel de ces jeux FromSoftware n'a PAS eu de GOTY ?", a: ["Elden Ring", "Sekiro", "Bloodborne", "Aucun, ils ont tous gagné"], correct: 2 },
    { q: "Baldur's Gate 3 est basé sur quel univers ?", a: ["Warhammer", "Witcher", "Donjons & Dragons", "World of Warcraft"], correct: 2 },
    { q: "Quel jeu a gagné en 2017 avec un monde ouvert révolutionnaire ?", a: ["Horizon", "Zelda BotW", "Mario Odyssey", "PUBG"], correct: 1 },
    { q: "Dans TLOU Part II, quel personnage incarne-t-on principalement ?", a: ["Joel", "Abby", "Ellie", "Tess"], correct: 2 },
    { q: "Quel studio a développé Sekiro: Shadows Die Twice ?", a: ["FromSoftware", "Team Ninja", "Sucker Punch", "Capcom"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedQuestions = [];

function startQuiz() {
    // Mélanger et prendre 10 questions
    selectedQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-box').style.display = 'block';
    showQuestion();
}

function showQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    document.getElementById('question-text').innerText = question.q;
    document.getElementById('question-number').innerText = `Question ${currentQuestionIndex + 1}/10`;
    
    const container = document.getElementById('answer-buttons');
    container.innerHTML = '';
    
    question.a.forEach((ans, i) => {
        const btn = document.createElement('button');
        btn.innerText = ans;
        btn.classList.add('answer-btn');
        btn.onclick = () => checkAnswer(i);
        container.appendChild(btn);
    });
}

function checkAnswer(index) {
    const correct = selectedQuestions[currentQuestionIndex].correct;
    const btns = document.querySelectorAll('.answer-btn');
    
    if (index === correct) {
        btns[index].classList.add('correct');
        score++;
    } else {
        btns[index].classList.add('wrong');
        btns[correct].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            showQuestion();
        } else {
            showResult();
        }
    }, 1000);
}

function showResult() {
    document.getElementById('quiz-box').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('final-score').innerText = `${score}/10`;
    
    let rank = "";
    if (score <= 3) rank = "Noob (Achetez une console !)";
    else if (score <= 6) rank = "Casual Gamer (Pas mal)";
    else if (score <= 9) rank = "Expert (Respect)";
    else rank = "LÉGENDE DES GAME AWARDS";
    
    document.getElementById('rank-text').innerText = `Rang : ${rank}`;
}

/* --- LOGIQUE MENU MOBILE --- */
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

// Ouvre/Ferme le menu au clic sur le burger
menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

// Ferme le menu quand on clique sur un lien (pour naviguer)
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
}));