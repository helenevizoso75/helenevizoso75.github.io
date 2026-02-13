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