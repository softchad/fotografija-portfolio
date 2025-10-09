        const rangeInput = document.getElementById('svarba');
        const rangeValue = document.getElementById('svarba-reiksme');
        
        rangeInput.addEventListener('input', function() {
            rangeValue.textContent = this.value;
        });

        // Privatumo politikos modal
        const privatumoLinkai = document.querySelectorAll('#privatumo-link-forma, #privatumo-link-footer');
        const privatumoModal = document.getElementById('privatumoModal');
        const privatumoClose = document.getElementById('privatumoClose');

        privatumoLinkai.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                privatumoModal.classList.add('show');
            });
        });

        privatumoClose.addEventListener('click', function() {
            privatumoModal.classList.remove('show');
        });

        privatumoModal.addEventListener('click', function(e) {
            if (e.target === privatumoModal) {
                privatumoModal.classList.remove('show');
            }
        });

        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                privatumoModal.classList.remove('show');
            }
        });