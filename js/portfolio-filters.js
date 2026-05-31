/**
 * Portfolio kategorijų filtravimas
 * Filtruoja portfolio elementus pagal pasirinktą kategoriją
 */
(function() {
    'use strict';

    function initPortfolioFilters() {
        const tabs = document.querySelectorAll('.nav-link[data-category]');
        const items = document.querySelectorAll('.portfolio-item');

        if (tabs.length === 0 || items.length === 0) {
            return; // Jei nėra portfolio puslapyje, nieko nedarom
        }

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Aktyvaus tab pažymėjimas
                tabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                
                const category = this.dataset.category;
                
                // Filtravimas
                items.forEach(function(item) {
                    if (category === 'visi' || item.dataset.category === category) {
                        item.style.display = 'block';
                        
                       // YRA:
                        const img = item.querySelector('img.open-photo');
                        if (!img) return;

                        // naudoja patį raktą kaip modalio modulyje
                        const src = img.getAttribute('src') || '';
                        const key = 'likes:' + src;

                        // jei localStorage neturi - krenta į pradinę data-likes
                        const initial = parseInt(img.dataset.likes || '0', 10) || 0;
                        const stored = localStorage.getItem(key);
                        const value = stored === null ? initial : (parseInt(stored, 10) || initial);

                        // normalizuojam ir rodom
                        localStorage.setItem(key, String(value));
                        const badge = item.querySelector('.like-badge');
                        if (badge) badge.textContent = String(value);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioFilters);
    } else {
        initPortfolioFilters();
    }

})();