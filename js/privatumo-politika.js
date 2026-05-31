/**
 * Privatumo politikos modal sistema
 * Universalus sprendimas visiems puslapiams
 */
(function() {
    'use strict';

    const MODAL_HTML = `
        <div class="custom-modal-backdrop" id="privatumoModal">
            <div class="custom-modal" style="max-width: 700px;">
                <div class="modal-bar">
                    <div class="modal-title">Privatumo Politika</div>
                    <div class="modal-actions">
                        <button class="modal-close" id="privatumoClose" aria-label="Uždaryti">✕</button>
                    </div>
                </div>
                <div style="padding: 30px; max-height: 70vh; overflow-y: auto; background: #fff;">
                    <h3 style="color: #667eea; margin-bottom: 15px;">📋 Bendrosios Nuostatos</h3>
                    <p style="margin-bottom: 15px; line-height: 1.8;">Ši privatumo politika nustato, kaip VP Fotografija renka, naudoja ir saugo jūsų asmeninę informaciją. Mes vertiname jūsų privatumą ir įsipareigojame saugoti jūsų duomenis pagal BDAR reikalavimus.</p>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">🔒 Duomenų Rinkimas</h3>
                    <p style="margin-bottom: 10px;"><strong>Mes renkame šią informaciją:</strong></p>
                    <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
                        <li>Vardą ir pavardę (būtina paslaugos suteikimui)</li>
                        <li>El. pašto adresą (komunikacijai)</li>
                        <li>Telefono numerį (greitam susisiekimui)</li>
                        <li>Pageidavimus dėl fotosesijos (paslaugos teikimui)</li>
                        <li>Fotografijas (tik su jūsų aiškiu sutikimu)</li>
                        <li>Mokėjimo informaciją (saugiai per mokėjimo sistemą)</li>
                    </ul>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">📸 Nuotraukų Naudojimas</h3>
                    <p style="margin-bottom: 15px; line-height: 1.8;">Jūsų nuotraukos naudojamos tik su jūsų <strong>aiškiu rašytiniu sutikimu</strong>. Galite bet kada atšaukti sutikimą dėl nuotraukų viešinimo portfolio, socialiniuose tinkluose ar reklaminiuose materiuose. Prašymas ištrinti nuotraukas bus įvykdytas per 7 darbo dienas.</p>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">🛡️ Duomenų Apsauga</h3>
                    <p style="margin-bottom: 15px; line-height: 1.8;">Mes naudojame šiuolaikines saugumo priemones:</p>
                    <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
                        <li>SSL šifravimą duomenų perdavimui</li>
                        <li>Saugius serverius su ugniasienėmis</li>
                        <li>Ribotas prieigos teises darbuotojams</li>
                        <li>Reguliarius saugumo patikrinimus</li>
                        <li>Šifruotus duomenų bazių atsarginius kopijavimus</li>
                    </ul>
                    <p style="margin-bottom: 15px; line-height: 1.8;"><strong>Jūsų duomenys niekada neparduodami trečiosioms šalims!</strong></p>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">🍪 Slapukai (Cookies)</h3>
                    <p style="margin-bottom: 15px; line-height: 1.8;">Svetainė naudoja būtinus slapukus funkcionalumui užtikrinti (pvz., prisiminti jūsų pasirinkimus). Analitiniai slapukai naudojami tik su jūsų sutikimu. Galite bet kada pakeisti slapukų nustatymus naršyklėje.</p>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">✉️ Jūsų Teisės (BDAR)</h3>
                    <p style="margin-bottom: 10px;"><strong>Turite šias teises:</strong></p>
                    <ul style="margin-left: 20px; margin-bottom: 15px; line-height: 1.8;">
                        <li><strong>Teisė susipažinti</strong> - gauti kopiją savo duomenų</li>
                        <li><strong>Teisė ištaisyti</strong> - reikalauti netikslių duomenų taisymo</li>
                        <li><strong>Teisė ištrinti</strong> - "teisė būti pamirštiems"</li>
                        <li><strong>Teisė apriboti</strong> - sustabdyti duomenų tvarkymą</li>
                        <li><strong>Teisė perkelti</strong> - gauti duomenis mašininio skaitymo formatu</li>
                        <li><strong>Teisė nesutikti</strong> - atšaukti sutikimą bet kada</li>
                    </ul>

                    <h3 style="color: #667eea; margin: 25px 0 15px;">⏳ Duomenų Saugojimas</h3>
                    <p style="margin-bottom: 15px; line-height: 1.8;">Asmens duomenys saugomi tik tiek, kiek reikalinga paslaugai suteikti ir įstatymų reikalavimams įvykdyti. Fotografijos saugomos 5 metus, kontaktiniai duomenys - 2 metus po paskutinio kontakto.</p>

                    <p style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #ecf0f1; color: #555;">
                        <strong>Kontaktai dėl privatumo klausimų:</strong><br>
                        El. paštas: <a href="mailto:privatumas@fotografija.lt" style="color: #667eea;">privatumas@fotografija.lt</a><br>
                        Telefonas: +370 5 215 1190<br>
                        Duomenų apsaugos pareigūnas: VP Fotografija<br>
                        <em style="font-size: 13px; display: block; margin-top: 10px;">Paskutinį kartą atnaujinta: 2025 m. sausio 9 d.</em>
                    </p>
                </div>
            </div>
        </div>
    `;

    function initPrivatumoModal() {
        // Patikrinti ar modal jau egzistuoja
        if (document.getElementById('privatumoModal')) {
            return;
        }

        // Įterpti modal HTML į body
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = MODAL_HTML;
        document.body.appendChild(tempDiv.firstElementChild);

        // Gauti elementus
        const modal = document.getElementById('privatumoModal');
        const closeBtn = document.getElementById('privatumoClose');

        // Uždarymo funkcija
        function closeModal() {
            modal.classList.remove('show');
        }

        // Uždarymo mygtukas
        closeBtn.addEventListener('click', closeModal);

        // Uždaryti paspaudus už modal
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Uždaryti su ESC klavišu
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        // Prisegti event listener'ius visiems privatumo linkams
        attachPrivatumoLinks();
    }

    function attachPrivatumoLinks() {
        // Rasti tik konkretūs privatumo linkai
        const links = document.querySelectorAll('#privatumo-link-forma');
        
        links.forEach(function(link) {
            // Pašalinti seną listener jei yra
            link.removeEventListener('click', openModalHandler);
            // Pridėti naują
            link.addEventListener('click', openModalHandler);
        });
    }

    function openModalHandler(e) {
        e.preventDefault();
        const modal = document.getElementById('privatumoModal');
        if (modal) {
            modal.classList.add('show');
        }
    }

    // Inicializuoti kai DOM paruoštas
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrivatumoModal);
    } else {
        initPrivatumoModal();
    }

})();