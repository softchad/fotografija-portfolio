// ===== FORMOS VALIDACIJA (PD4 reikalavimas) =====

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

document.addEventListener('DOMContentLoaded', function() {
    const forma = document.querySelector('.uzsakymo-forma');
    
    if (!forma) return; // Jei nera formos, neieskoti
    
    // Custom validation messages
    const messages = {
        valueMissing: 'Šis laukas yra privalomas',
        typeMismatch: 'Įveskite teisingą formatą',
        tooShort: 'Per trumpas tekstas',
        patternMismatch: 'Neteisingas formatas'
    };
    
    // Real-time validacija kiekvienam input
    forma.querySelectorAll('input, select, textarea').forEach(input => {
        // Validacija kai user palieka lauka
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Pasalinti error kai user pradeda rasyti
        input.addEventListener('input', function() {
            removeError(this);
        });
    });
    
        // Formos submit
    forma.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        // Validuoti visus laukus
        forma.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
            if (!validateField(input)) {
                isValid = false;
                errors.push(input.name || input.id);
            }
        });
        
        // Patikrinti sutikima
        const sutikimas = forma.querySelector('input[name="sutikimas"]');
        if (sutikimas && !sutikimas.checked) {
            isValid = false;
            showError(sutikimas.parentElement, 'Turite sutikti su privatumo politika');
            errors.push('sutikimas');
        }
        
        if (isValid) {
            // Formos duomenys teisingi - surinkti ir parodyti
            const formData = new FormData(forma);
            showSuccessModal(formData);
        } else {
            // PATAISYTA: Rodomas error modal
            showErrorModal(errors.length);
            // Smooth scroll į pirmą error
            const firstError = forma.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});

// Validuoti viena lauka
function validateField(input) {
    removeError(input);
    
    // Praleisti jei ne required ir tuscias
    if (!input.required && !input.value) {
        return true;
    }
    
    // Tikrinti validity
    if (!input.validity.valid) {
        let message = 'Neteisingas įvedimas';
        
        if (input.validity.valueMissing) {
            message = 'Šis laukas yra privalomas';
        } else if (input.validity.typeMismatch) {
            if (input.type === 'email') {
                message = 'Įveskite teisingą el. paštą (pvz: vardas@gmail.com)';
            } else if (input.type === 'tel') {
                message = 'Įveskite teisingą telefono numerį';
            }
        } else if (input.validity.patternMismatch) {
            message = 'Neteisingas formatas';
        }
        
        showError(input, message);
        return false;
    }
    
    // Papildoma validacija
    // Email validacija
    if (input.type === 'email' && input.value) {
        const emailRegex = /^[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(input.value)) {
            showError(input, 'Įveskite teisingą el. pašto adresą');
            return false;
        }
    }
    
    // Telefono validacija
    if (input.type === 'tel' && input.value) {
        const telRegex = /^\+?[0-9\s\-()]{8,}$/;
        if (!telRegex.test(input.value)) {
            showError(input, 'Įveskite teisingą telefono numerį (pvz: +370 600 00000)');
            return false;
        }
    }
    
    // Vardas - bent 2 raides
    if (input.id === 'vardas' && input.value.length < 2) {
        showError(input, 'Vardas turi būti bent 2 simbolių');
        return false;
    }
    
    return true;
}

// Parodyti error
function showError(input, message) {
    const parent = input.closest('.forma-grupe') || input.parentElement;
    
    // Pazymeti input
    input.style.borderColor = '#e74c3c';
    input.style.background = '#ffe6e6';
    
    // Prideti error message
    let errorDiv = parent.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #e74c3c; font-size: 13px; margin-top: 5px; font-weight: 600;';
        parent.appendChild(errorDiv);
    }
    errorDiv.textContent = '⚠️ ' + message;
}

// Pasalinti error
function removeError(input) {
    input.style.borderColor = '';
    input.style.background = '';
    
    const parent = input.closest('.forma-grupe') || input.parentElement;
    const errorDiv = parent.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Success modal su duomenimis (PD4 reikalavimas)
function showSuccessModal(formData) {
    // Surinkti duomenis
    let data = {};
    for (let [key, value] of formData.entries()) {
        if (key !== 'papildomos[]') { // Array laukai atskirai
            data[key] = value;
        }
    }
    
    // Papildomos paslaugos
    const papildomos = formData.getAll('papildomos[]');
    
    // Sukurti modal HTML
    const modalHTML = `
        <div class="custom-modal-backdrop show" id="successModal" style="z-index: 9999;">
            <div class="custom-modal" style="max-width: 600px;">
                <div class="modal-bar" style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);">
                    <div class="modal-title">✅ Užklausa sėkmingai pateikta!</div>
                    <div class="modal-actions">
                        <button class="modal-close" onclick="closeSuccessModal()">✕</button>
                    </div>
                </div>
                <div style="padding: 30px; background: white; max-height: 70vh; overflow-y: auto;">
                    <h4 style="color: #27ae60; margin-bottom: 20px; text-align: center;">
                        🎉 Ačiū už užklausą!
                    </h4>
                    <p style="text-align: center; margin-bottom: 30px; color: #555;">
                        Su jumis susisieksime per 24 valandas. Čia jūsų pateikti duomenys:
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <table style="width: 100%; line-height: 2;">
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Vardas:</td>
                                <td>${escapeHtml(data.vardas || '-')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">El. paštas:</td>
                                <td>${escapeHtml(data.email || '-')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Telefonas:</td>
                                <td>${escapeHtml(data.telefonas || '-')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Paslauga:</td>
                                <td>${escapeHtml(getServiceName(data.paslauga))}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Data:</td>
                                <td>${escapeHtml(data.data || 'Nenurodyta')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Laikas:</td>
                                <td>${escapeHtml(data.laikas || 'Nenurodyta')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Vieta:</td>
                                <td>${escapeHtml(data.vieta || 'Nenurodyta')}</td>
                            </tr>
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Biudžetas:</td>
                                <td>${data.biudzetas ? escapeHtml(data.biudzetas) + '€' : 'Nenurodyta'}</td>
                            </tr>
                            ${papildomos.length > 0 ? `
                            <tr>
                                <td style="font-weight: 600; color: #667eea;">Papildomos:</td>
                                <td>${papildomos.map(p => escapeHtml(getPapildomaName(p))).join(', ')}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>

                    ${data.zinute ? `
                    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
                        <strong style="color: #856404;">Jūsų žinutė:</strong>
                        <p style="margin: 10px 0 0 0; color: #856404;">${escapeHtml(data.zinute)}</p>
                    </div>
                    ` : ''}
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button onclick="closeSuccessModal()" style="padding: 12px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                            Gerai
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Prideti i body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Error modal
function showErrorModal(errorCount) {
    const modalHTML = `
        <div class="custom-modal-backdrop show" id="errorModal" style="z-index: 9999;">
            <div class="custom-modal" style="max-width: 500px;">
                <div class="modal-bar" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                    <div class="modal-title">❌ Klaida formoje</div>
                    <div class="modal-actions">
                        <button class="modal-close" onclick="closeErrorModal()">✕</button>
                    </div>
                </div>
                <div style="padding: 30px; background: white; text-align: center;">
                    <h4 style="color: #e74c3c; margin-bottom: 20px;">
                        Neteisingai užpildyta forma
                    </h4>
                    <p style="color: #555; margin-bottom: 30px;">
                        Aptikta <strong>${errorCount}</strong> klaidų. Prašome pataisyti pažymėtus laukus.
                    </p>
                    <button onclick="closeErrorModal()" style="padding: 12px 40px; background: #e74c3c; color: white; border: none; border-radius: 25px; font-weight: 600; cursor: pointer;">
                        Gerai
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Helper funkcijos
function getServiceName(code) {
    const services = {
        'vestuves': 'Vestuvių fotografavimas',
        'portretas': 'Portretinė fotosesija',
        'seima': 'Šeimos fotosesija',
        'renginys': 'Renginio fotografavimas',
        'verslas': 'Verslo portretai',
        'produktai': 'Produktų fotografija',
        'kita': 'Kita'
    };
    return services[code] || code;
}

function getPapildomaName(code) {
    const names = {
        'albumas': 'Foto albumas',
        'dronas': 'Dronas',
        'video': 'Video klipas',
        'budele': 'Foto būdelė'
    };
    return names[code] || code;
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
    
    // Isvalyti forma
    const forma = document.querySelector('.uzsakymo-forma');
    if (forma) forma.reset();
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) modal.remove();
}