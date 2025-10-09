(function() {
    'use strict';

    // Pradiniai atsiliepimai
    const pradiniaiAtsiliepimai = [
        {
            vardas: "Ieva & Tomas",
            rating: 5,
            tekstas: "Nuostabi patirtis! Vytautas užfiksavo kiekvieną svarbią akimirką mūsų vestuvėse. Nuotraukos viršijo visus lūkesčius!",
            data: "2024-12-15"
        },
        {
            vardas: "Mindaugas",
            rating: 5,
            tekstas: "Profesionalumas ir kokybė - tikrai rekomenduoju! Verslo portretai išėjo puikūs.",
            data: "2024-12-20"
        },
        {
            vardas: "Laura",
            rating: 5,
            tekstas: "Labai patiko nuotraukos ir greitas darbų perdavimas! Šeimos fotosesija buvo nuostabi.",
            data: "2025-01-03"
        },
        {
            vardas: "Darius",
            rating: 4,
            tekstas: "Geros nuotraukos, bet laukimo laikas buvo šiek tiek ilgesnis nei tikėjausi. Bet rezultatas vertas!",
            data: "2024-11-28"
        },
        {
            vardas: "Rūta",
            rating: 5,
            tekstas: "Sužadėtuvių fotosesija buvo tiesiog fantastinė! Vytautas žino kaip sukurti jaukią atmosferą.",
            data: "2024-12-05"
        },
        {
            vardas: "Andrius",
            rating: 5,
            tekstas: "Renginio fotografavimas buvo profesionalus. Visos svarbios akimirkos užfiksuotos!",
            data: "2024-11-15"
        },
        {
            vardas: "Greta",
            rating: 5,
            tekstas: "Mėgstu gamtos nuotraukas! Vytautas turi unikalų matomą būdą užfiksuoti grožį.",
            data: "2024-10-22"
        },
        {
            vardas: "Justas",
            rating: 4,
            tekstas: "Labai geros produktų nuotraukos mūsų parduotuvei. Kaina šiek tiek aukštoka, bet kokybė aukščiausia.",
            data: "2024-12-01"
        }
    ];

    // Patikrinti ar yra išsaugotų atsiliepimų localStorage
    let atsiliepimai = localStorage.getItem('atsiliepimai');
    if (!atsiliepimai) {
        atsiliepimai = pradiniaiAtsiliepimai;
        localStorage.setItem('atsiliepimai', JSON.stringify(atsiliepimai));
    } else {
        atsiliepimai = JSON.parse(atsiliepimai);
    }

    // Funkcija atvaizdavimui
    function atvaizduotiAtsiliepimus() {
        const sarasas = document.getElementById('atsiliepimai-sarasas');
        if (!sarasas) return;

        sarasas.innerHTML = '';

        // Rūšiuoti pagal datą (naujausi viršuje)
        const surusiuoti = [...atsiliepimai].sort((a, b) => new Date(b.data) - new Date(a.data));

        surusiuoti.forEach(function(atsiliepimas) {
            const div = document.createElement('div');
            div.style.cssText = 'background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 3px solid #667eea;';
            
            const stars = '★'.repeat(atsiliepimas.rating) + '☆'.repeat(5 - atsiliepimas.rating);
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #667eea; font-size: 14px;">${escapeHtml(atsiliepimas.vardas)}</strong>
                    <span style="color: #f39c12; font-size: 16px;">${stars}</span>
                </div>
                <p style="font-size: 13px; line-height: 1.6; color: #555; margin-bottom: 6px;">${escapeHtml(atsiliepimas.tekstas)}</p>
                <small style="color: #999; font-size: 11px;">${formatuotiData(atsiliepimas.data)}</small>
            `;
            
            sarasas.appendChild(div);
        });
    }

    // HTML escape funkcija saugumui
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Datos formatavimas
    function formatuotiData(dataStr) {
        const data = new Date(dataStr);
        const dabar = new Date();
        const skirtumas = Math.floor((dabar - data) / (1000 * 60 * 60 * 24));
        
        if (skirtumas === 0) return 'Šiandien';
        if (skirtumas === 1) return 'Vakar';
        if (skirtumas < 7) return `Prieš ${skirtumas} d.`;
        if (skirtumas < 30) return `Prieš ${Math.floor(skirtumas / 7)} sav.`;
        
        const metai = data.getFullYear();
        const menuo = String(data.getMonth() + 1).padStart(2, '0');
        const diena = String(data.getDate()).padStart(2, '0');
        return `${metai}-${menuo}-${diena}`;
    }

    // Žvaigždučių reitingo sistema
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('selected-rating');
    let selectedRating = 5;

    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = selectedRating;
            updateStars();
        });

        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(hoverRating);
        });
    });

    const ratingDiv = document.getElementById('rating-input');
    ratingDiv.addEventListener('mouseleave', function() {
        updateStars();
    });

    function highlightStars(rating) {
        stars.forEach(function(star, index) {
            if (index < rating) {
                star.textContent = '★';
                star.style.color = '#f39c12';
            } else {
                star.textContent = '☆';
                star.style.color = '#ddd';
            }
        });
    }

    function updateStars() {
        highlightStars(selectedRating);
    }

    // Pradinė žvaigždučių būsena
    updateStars();

    // Formos pateikimas
    const forma = document.getElementById('atsiliepimas-forma');
    if (forma) {
        forma.addEventListener('submit', function(e) {
            e.preventDefault();

            const vardas = document.getElementById('komentaro-vardas').value.trim();
            const tekstas = document.getElementById('komentaro-tekstas').value.trim();
            const rating = selectedRating;

            if (!vardas || !tekstas) {
                alert('Prašome užpildyti visus laukus!');
                return;
            }

            // Naujas atsiliepimas
            const naujasAtsiliepimas = {
                vardas: vardas,
                rating: rating,
                tekstas: tekstas,
                data: new Date().toISOString().split('T')[0]
            };

            // Pridėti į masyvą ir išsaugoti
            atsiliepimai.unshift(naujasAtsiliepimas);
            localStorage.setItem('atsiliepimai', JSON.stringify(atsiliepimai));

            // Atvaizduoti atnaujintą sąrašą
            atvaizduotiAtsiliepimus();

            // Išvalyti formą
            forma.reset();
            selectedRating = 5;
            updateStars();

            // Scrollinti į naują komentarą
            const sarasas = document.getElementById('atsiliepimai-sarasas');
            if (sarasas) {
                sarasas.scrollTop = 0;
            }

            // Pranešimas
            alert('Ačiū už atsiliepimą! ⭐');
        });
    }

    // Pradinis atvaizdavimas
    atvaizduotiAtsiliepimus();

})();