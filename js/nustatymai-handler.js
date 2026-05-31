/**
 * Nustatymų puslapio valdymas
 * Saugo pasirinkimus į localStorage ir taiko juos realtime
 */

(function() {
    'use strict';

    // Palaukti kol DOM paruoštas
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Užkrauti esamus nustatymus
        loadCurrentSettings();
        
        // Prisegti event listener'ius
        attachColorListeners();
        attachHeadingColorListeners();
        attachSizeListeners();
        attachResetListener();
    }

    // 1. FONO SPALVOS
    function attachColorListeners() {
        const colorOptions = document.querySelectorAll('.color-option[data-color]');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                const color = this.getAttribute('data-color');
                const colorName = this.getAttribute('data-name');
                
                // Pašalinti active iš visų
                colorOptions.forEach(opt => opt.classList.remove('active'));
                
                // Pridėti active į pasirinktą
                this.classList.add('active');
                
                // Išsaugoti
                localStorage.setItem('bgColor', color);
                
                // Atnaujinti label
                document.getElementById('selectedColorName').textContent = colorName;
                
                // Taikyti iš karto
                applyBgColor(color);
            });
        });
    }

    // 2. ANTRAŠČIŲ SPALVOS
    function attachHeadingColorListeners() {
        const headingOptions = document.querySelectorAll('.color-option[data-heading-color]');
        
        headingOptions.forEach(option => {
            option.addEventListener('click', function() {
                const color = this.getAttribute('data-heading-color');
                const colorName = this.getAttribute('data-name');
                
                // Pašalinti active iš visų
                headingOptions.forEach(opt => opt.classList.remove('active'));
                
                // Pridėti active
                this.classList.add('active');
                
                // Išsaugoti
                localStorage.setItem('headingColor', color);
                
                // Atnaujinti label
                document.getElementById('selectedHeadingName').textContent = colorName;
                
                // Taikyti
                applyHeadingColor(color);
            });
        });
    }

    // 3. ŠRIFTO DYDIS
    function attachSizeListeners() {
        const sizeButtons = document.querySelectorAll('.size-btn[data-size]');
        
        sizeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const size = this.getAttribute('data-size');
                
                // Pašalinti active
                sizeButtons.forEach(b => b.classList.remove('active'));
                
                // Pridėti active
                this.classList.add('active');
                
                // Išsaugoti
                localStorage.setItem('headingSize', size);
                
                // Taikyti
                applyHeadingSize(size);
            });
        });
    }

    // 4. RESET MYGTUKAS
    function attachResetListener() {
        // Jau yra onclick="resetSettings()" HTML'e
        // Bet galime pridėti ir čia
    }

    // === TAIKYMO FUNKCIJOS ===

    function applyBgColor(color) {
        document.body.style.backgroundColor = color;
    }

    function applyHeadingColor(color) {
        document.querySelectorAll('h2, h3, .hero-turinys h2, .hero-turinys p, .game-header h3').forEach(el => {
            el.style.color = color;
        });
    }

    function applyHeadingSize(size) {
        document.querySelectorAll('h2').forEach(el => {
            el.style.fontSize = size;
        });
    }

    // === UŽKROVIMO FUNKCIJOS ===

    function loadCurrentSettings() {
        // 1. Fono spalva
        const bgColor = localStorage.getItem('bgColor') || '#f8f9fa';
        const bgOption = document.querySelector(`.color-option[data-color="${bgColor}"]`);
        if (bgOption) {
            bgOption.classList.add('active');
            const colorName = bgOption.getAttribute('data-name');
            if (colorName) document.getElementById('selectedColorName').textContent = colorName;
        }
        applyBgColor(bgColor);

        // 2. Antraščių spalva
        const headingColor = localStorage.getItem('headingColor') || '#667eea';
        const headingOption = document.querySelector(`.color-option[data-heading-color="${headingColor}"]`);
        if (headingOption) {
            headingOption.classList.add('active');
            const colorName = headingOption.getAttribute('data-name');
            if (colorName) document.getElementById('selectedHeadingName').textContent = colorName;
        }
        applyHeadingColor(headingColor);

        // 3. Šrifto dydis
        const headingSize = localStorage.getItem('headingSize') || '36px';
        const sizeBtn = document.querySelector(`.size-btn[data-size="${headingSize}"]`);
        if (sizeBtn) {
            sizeBtn.classList.add('active');
        }
        applyHeadingSize(headingSize);
    }

    // === RESET FUNKCIJA (global scope) ===
    window.resetSettings = function() {
        if (!confirm('Ar tikrai norite atstatyti visus nustatymus?')) {
            return;
        }
        
        // Ištrinti iš localStorage
        localStorage.removeItem('bgColor');
        localStorage.removeItem('headingColor');
        localStorage.removeItem('headingSize');
        
        // Perkrauti puslapį
        location.reload();
    };

})();