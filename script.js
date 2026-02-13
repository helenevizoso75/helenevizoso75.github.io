/* ==========================================
   1. INITIALISATION GLOBALE & MENU MOBILE
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    if (menu) {
        menu.addEventListener('click', function() {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    }));

    // Initialisation des Sondages
    initPollData();
    const pollData = getPollData();
    document.querySelectorAll('.poll-container').forEach(container => {
        const year = container.getAttribute('data-year');
        if (pollData[year] && pollData[year].userVoted) {
            displayResults(year);
        }
    });

    // Initialisation du Modal Vidéo
    initModalLogic();
});

/* ==========================================
   2. LOGIQUE DU QUIZ (Accessibles globalement)
   ========================================== */
const quizQuestions = [
    { q: "Quel studio a gagné deux fois le GOTY entre 2014 et 2024 ?", a: ["FromSoftware", "Naughty Dog", "Nintendo", "Santa Monica"], correct: 0 },
    { q: "En 2018, quel jeu a perdu face à God of War ?", a: ["RDR2", "Spider-Man", "Celeste", "Assassin's Creed"], correct: 0 },
    { q: "Quel jeu détient le record du nombre total de récompenses ?", a: ["The Witcher 3", "Clair Obscur", "TLOU Part II", "Zelda BotW"], correct: 1 },
    { q: "Quel est le seul jeu exclusivement coopératif à avoir gagné ?", a: ["A Way Out", "It Takes Two", "Portal 2", "Overwatch"], correct: 1 },
    { q: "Qui a prononcé le discours le plus long de l'histoire ?", a: ["Hideo Kojima", "Christopher Judge", "Neil Druckmann", "Geoff Keighley"], correct: 1 },
    { q: "En quelle année Overwatch a-t-il créé la surprise ?", a: ["2014", "2015", "2016", "2017"], correct: 2 },
    { q: "Quel jeu a gagné le premier prix GOTY en 2014 ?", a: ["Dragon Age: Inquisition", "Dark Souls 2", "The Witcher 3", "Skyrim"], correct: 0 },
    { q: "Lequel de ces jeux FromSoftware n'a PAS eu de GOTY ?", a: ["Elden Ring", "Sekiro", "Bloodborne", "Aucun, ils ont tous gagné"], correct: 2 },
    { q: "Baldur's Gate 3 est basé sur quel univers ?", a: ["Warhammer", "Witcher", "Donjons & Dragons", "World of Warcraft"], correct: 2 },
    { q: "Quel jeu a gagné en 2017 avec un monde ouvert révolutionnaire ?", a: ["Horizon", "Zelda BotW", "Mario Odyssey", "PUBG"], correct: 1 }
];

let currentQuestionIndex = 0;
let quizScore = 0;
let selectedQuestions = [];

window.startQuiz = function() {
    selectedQuestions = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-box').style.display = 'block';
    showQuestion();
};

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
        quizScore++;
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
    document.getElementById('final-score').innerText = `${quizScore}/10`;
    
    let rank = "";
    if (quizScore <= 3) rank = "Noob (Achetez une console !)";
    else if (quizScore <= 6) rank = "Casual Gamer (Pas mal)";
    else if (quizScore <= 9) rank = "Expert (Respect)";
    else rank = "LÉGENDE DES GAME AWARDS";
    
    document.getElementById('rank-text').innerText = `Rang : ${rank}`;
}

/* ==========================================
   3. LOGIQUE MODAL VIDÉO
   ========================================== */
function initModalLogic() {
    const modal = document.getElementById('gameModal');
    const modalLeft = document.querySelector('.modal-left'); 
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.querySelector('.close-btn');
    const items = document.querySelectorAll('.tree-item');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.getAttribute('data-title');
            const desc = item.getAttribute('data-desc');
            const videoId = item.getAttribute('data-video');

            modalTitle.textContent = title;
            modalDesc.textContent = desc;
            modalLeft.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allowfullscreen></iframe>`;

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        });
    });

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalLeft.innerHTML = ''; 
        }, 300);
    };

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });
}

/* ==========================================
   4. LOGIQUE SONDAGES (HISTOIRE RÉELLE)
   ========================================== */
function initPollData() {
    if (!localStorage.getItem('goty_votes')) {
        const initialData = {};
        const configs = {
            2025: { yesMin: 400, yesMax: 600, noMin: 300, noMax: 500 },
            2024: { yesMin: 2000, yesMax: 2500, noMin: 1000, noMax: 1500 },
            2023: { yesMin: 4800, yesMax: 5000, noMin: 100, noMax: 300 },
            2022: { yesMin: 4000, yesMax: 4500, noMin: 500, noMax: 800 },
            2021: { yesMin: 1500, yesMax: 1800, noMin: 1000, noMax: 1200 },
            2020: { yesMin: 2000, yesMax: 2200, noMin: 2300, noMax: 2800 }, 
            2019: { yesMin: 3000, yesMax: 3500, noMin: 600, noMax: 900 },
            2018: { yesMin: 3500, yesMax: 3800, noMin: 2000, noMax: 2500 },
            2017: { yesMin: 4500, yesMax: 4800, noMin: 300, noMax: 500 },
            2016: { yesMin: 1200, yesMax: 1500, noMin: 2500, noMax: 3000 },
            2015: { yesMin: 4900, yesMax: 5000, noMin: 50, noMax: 200 },
            2014: { yesMin: 1200, yesMax: 1500, noMin: 1000, noMax: 1300 }
        };
        for (const [year, conf] of Object.entries(configs)) {
            const randomYes = Math.floor(Math.random() * (conf.yesMax - conf.yesMin + 1)) + conf.yesMin;
            const randomNo = Math.floor(Math.random() * (conf.noMax - conf.noMin + 1)) + conf.noMin;
            initialData[year] = { yes: randomYes, no: randomNo, userVoted: false };
        }
        localStorage.setItem('goty_votes', JSON.stringify(initialData));
    }
}

function getPollData() { return JSON.parse(localStorage.getItem('goty_votes')); }

function displayResults(year) {
    const data = getPollData();
    const yearData = data[year];
    const total = yearData.yes + yearData.no;
    const percentYes = Math.round((yearData.yes / total) * 100);
    const container = document.querySelector(`.poll-container[data-year="${year}"]`);
    if(!container) return;
    container.querySelector('.poll-buttons').style.display = 'none';
    container.querySelector('.poll-results').style.display = 'block';
    setTimeout(() => { container.querySelector('.progress-fill').style.width = `${percentYes}%`; }, 100);
    container.querySelector('.stat-yes').textContent = `${percentYes}% OUI (${yearData.yes})`;
    container.querySelector('.stat-no').textContent = `${100 - percentYes}% NON (${yearData.no})`;
}

window.vote = function(year, choice) {
    const data = getPollData();
    if (data[year].userVoted) return;
    choice === 'yes' ? data[year].yes++ : data[year].no++;
    data[year].userVoted = true;
    localStorage.setItem('goty_votes', JSON.stringify(data));
    displayResults(year);
};

/* ==========================================
   5. EFFET POUSSIÈRE D'OR
   ========================================== */
const canvas = document.getElementById('gold-dust');
const ctx = canvas.getContext('2d');
let particlesArray;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2; 
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.opacity = Math.random() * 0.5 + 0.4;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0; if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0; if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const numberOfParticles = (canvas.width * canvas.height) / 9000; 
    for (let i = 0; i < numberOfParticles; i++) { particlesArray.push(new Particle()); }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(); particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animateParticles();