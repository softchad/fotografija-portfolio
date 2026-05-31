/**
 * PD4 - ŽAIDIMŲ LOGIKA
 * 3 edukaciniai žaidimai su fotografijos tematika
 */

(function() {
    'use strict';

    // =============================================================================
    // BENDROS FUNKCIJOS
    // =============================================================================
    
    let currentLevel = {
        memory: 'easy',
        quiz: 'easy',
        reaction: 'easy'
    };

    // Level button handling
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const game = this.dataset.game;
            const level = this.dataset.level;
            
            document.querySelectorAll(`.level-btn[data-game="${game}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            currentLevel[game] = level;
            
            if (game === 'memory') {
                resetMemoryGame();
            } else if (game === 'quiz') {
                resetQuiz();
            } else if (game === 'reaction') {
                resetReactionTest();
            }
        });
    });

    // =============================================================================
    // ŽAIDIMAS 1: ATMINTIES KORTELĖS
    // =============================================================================
    
    let memoryState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        canFlip: true
    };

    const cameraEmojis = ['📷', '📸', '📹', '🎥', '🎬', '🎞️', '📺', '🖼️'];

    window.startMemoryGame = function() {
        const level = currentLevel.memory;
        let pairs;
        
        if (level === 'easy') {
            pairs = 4;
        } else if (level === 'medium') {
            pairs = 6;
        } else {
            pairs = 8;
        }
        
        const icons = cameraEmojis.slice(0, pairs);
        const cardArray = [...icons, ...icons];
        
        memoryState.cards = shuffleArray(cardArray);
        memoryState.flippedCards = [];
        memoryState.matchedPairs = 0;
        memoryState.moves = 0;
        memoryState.canFlip = true;
        
        const grid = document.getElementById('memoryGrid');
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        
        renderMemoryCards();
        updateMemoryStats();
    };

    function renderMemoryCards() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        
        memoryState.cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.icon = icon;
            card.textContent = '❓';
            
            card.addEventListener('click', () => flipCard(index));
            
            grid.appendChild(card);
        });
    }

    function flipCard(index) {
        if (!memoryState.canFlip) return;
        
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.icon;
        memoryState.flippedCards.push(index);
        
        if (memoryState.flippedCards.length === 2) {
            memoryState.moves++;
            updateMemoryStats();
            checkMatch();
        }
    }

    function checkMatch() {
        memoryState.canFlip = false;
        
        const [index1, index2] = memoryState.flippedCards;
        const card1 = document.querySelector(`.memory-card[data-index="${index1}"]`);
        const card2 = document.querySelector(`.memory-card[data-index="${index2}"]`);
        
        const icon1 = card1.dataset.icon;
        const icon2 = card2.dataset.icon;
        
        if (icon1 === icon2) {
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                memoryState.matchedPairs++;
                updateMemoryStats();
                
                memoryState.flippedCards = [];
                memoryState.canFlip = true;
                
                checkMemoryWin();
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '❓';
                card2.textContent = '❓';
                
                memoryState.flippedCards = [];
                memoryState.canFlip = true;
            }, 1000);
        }
    }

    function checkMemoryWin() {
        const totalPairs = memoryState.cards.length / 2;
        if (memoryState.matchedPairs === totalPairs) {
            setTimeout(() => {
                const grid = document.getElementById('memoryGrid');
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 30px;">
                        <h3 style="color: #27ae60; margin-bottom: 15px;">🎉 Laimėjai!</h3>
                        <div style="font-size: 36px; font-weight: bold; color: #27ae60; margin: 15px 0;">${memoryState.moves}</div>
                        <div style="color: #555; margin-bottom: 25px;">ėjimų</div>
                        <button class="start-btn" onclick="startMemoryGame()">Žaisti iš naujo</button>
                    </div>
                `;
            }, 500);
        }
    }

    function updateMemoryStats() {
        const stats = document.getElementById('memoryStats');
        const totalPairs = memoryState.cards.length / 2;
        stats.textContent = `Ėjimai: ${memoryState.moves} | Rasta porų: ${memoryState.matchedPairs}/${totalPairs}`;
    }

    function resetMemoryGame() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        memoryState = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            canFlip: true
        };
        updateMemoryStats();
    }

    // =============================================================================
    // ŽAIDIMAS 2: QUIZ
    // =============================================================================
    
    const quizQuestions = {
        easy: [
            {
                question: "Kas yra ISO fotografijoje?",
                options: ["Fotoaparato jautrumas šviesai", "Objektyvo tipas", "Fotoaparato gamintojas", "Spalvų schema"],
                correct: 0
            },
            {
                question: "Kas yra aperture (diafragma)?",
                options: ["Fotoaparato dydis", "Objektyvo angos dydis", "Fokuso tipas", "Blykstės galia"],
                correct: 1
            },
            {
                question: "Kokia failų formato galūnė reiškia 'neapdorotą' nuotrauką?",
                options: ["JPG", "PNG", "RAW", "GIF"],
                correct: 2
            },
            {
                question: "Koks yra pagrindinis fotoaparato komponentas, kuris fiksuoja šviesą?",
                options: ["Objektyvas", "Blykstė", "Jutiklis (sensor)", "SD kortelė"],
                correct: 2
            },
            {
                question: "Kas yra megapikseliai?",
                options: ["Fotoaparato greitis", "Vaizdo raiška", "Spalvų kiekis", "Atminties dydis"],
                correct: 1
            }
        ],
        medium: [
            {
                question: "Kas yra 'Golden Hour' fotografijoje?",
                options: ["Vidurdienio metas", "Valanda po saulėtekio/prieš saulėlydį", "Nakties fotografavimas", "Studijos apšvietimas"],
                correct: 1
            },
            {
                question: "Ką reiškia 'bokeh' efektas?",
                options: ["Ryškus fokusas", "Sulietas fonas", "Juoda-balta nuotrauka", "Didelė ekspozicija"],
                correct: 1
            },
            {
                question: "Kas yra HDR fotografija?",
                options: ["Didelė sparta", "Aukšto dinaminio diapazono vaizdas", "Mažas failo dydis", "Aukšta raiška"],
                correct: 1
            },
            {
                question: "Koks shutter speed naudojamas judantiems objektams fotografuoti?",
                options: ["Lėtas (1s ar ilgiau)", "Greitas (1/500s ar greičiau)", "Automatinis", "B režimas"],
                correct: 1
            },
            {
                question: "Kas yra 'rule of thirds' (trečdalių taisyklė)?",
                options: ["Kompozicijos principas", "Apšvietimo technika", "Spalvų schema", "Fokusavimo metodas"],
                correct: 0
            }
        ],
        hard: [
            {
                question: "Kas yra hyperfocal distance?",
                options: ["Minimalus fokuso atstumas", "Maksimalus zoomavimas", "Atstumas, kuriame visa scena ryški", "Objektyvo fokusinis nuotolis"],
                correct: 2
            },
            {
                question: "Kaip vadinamas fotografijos 'exposure triangle'?",
                options: ["ISO, fokusas, kompozicija", "Aperture, shutter speed, ISO", "RAW, JPG, PNG", "Spalva, kontrastas, ryškumas"],
                correct: 1
            },
            {
                question: "Kas yra 'chimping' fotografijoje?",
                options: ["Greitasis fotografavimas", "Nuolatinis nuotraukų peržiūrėjimas ekrane", "Objektyvo keitimas", "Blykstės naudojimas"],
                correct: 1
            },
            {
                question: "Koks yra optimalus ISO nustatymas dieną fotografuojant lauke?",
                options: ["ISO 3200", "ISO 100-200", "ISO 6400", "ISO 800"],
                correct: 1
            },
            {
                question: "Kas yra 'chromatic aberration'?",
                options: ["Spalvų iškraipymas objektyvo kraštuose", "Pilka nuotrauka", "Per tamsus vaizdas", "Fokuso praradimas"],
                correct: 0
            }
        ]
    };

    let quizState = {
        currentQuestion: 0,
        score: 0,
        questions: [],
        answered: false
    };

    window.startQuiz = function() {
        const level = currentLevel.quiz;
        quizState.questions = [...quizQuestions[level]];
        quizState.currentQuestion = 0;
        quizState.score = 0;
        quizState.answered = false;
        
        showQuestion();
    };

    function showQuestion() {
        if (quizState.currentQuestion >= quizState.questions.length) {
            showQuizResults();
            return;
        }
        
        const container = document.getElementById('quizContainer');
        const q = quizState.questions[quizState.currentQuestion];
        
        container.innerHTML = `
            <div class="quiz-question">${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <div class="quiz-option" data-index="${i}">
                        ${opt}
                    </div>
                `).join('')}
            </div>
        `;
        
        container.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => checkAnswer(parseInt(opt.dataset.index)));
        });
        
        updateQuizStats();
    }

    function checkAnswer(selected) {
        if (quizState.answered) return;
        quizState.answered = true;
        
        const q = quizState.questions[quizState.currentQuestion];
        const options = document.querySelectorAll('.quiz-option');
        
        options[q.correct].classList.add('correct');
        
        if (selected !== q.correct) {
            options[selected].classList.add('wrong');
        } else {
            quizState.score++;
        }
        
        updateQuizStats();
        
        setTimeout(() => {
            quizState.currentQuestion++;
            quizState.answered = false;
            showQuestion();
        }, 1500);
    }

    function showQuizResults() {
        const container = document.getElementById('quizContainer');
        const total = quizState.questions.length;
        const percentage = Math.round((quizState.score / total) * 100);
        
        let message = '';
        let color = '';
        
        if (percentage >= 80) {
            message = '🏆 Puiku! Tikras fotografijos ekspertas!';
            color = '#27ae60';
        } else if (percentage >= 60) {
            message = '👍 Neblogai! Turi gerų žinių.';
            color = '#f39c12';
        } else {
            message = '📚 Reikia pasimokti daugiau!';
            color = '#e74c3c';
        }
        
        container.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <h3 style="color: ${color}; margin-bottom: 20px;">${message}</h3>
                <div style="font-size: 48px; font-weight: bold; color: ${color}; margin: 20px 0;">
                    ${quizState.score}/${total}
                </div>
                <div style="font-size: 24px; margin-bottom: 30px;">
                    ${percentage}%
                </div>
                <button class="start-btn" onclick="startQuiz()">Žaisti iš naujo</button>
            </div>
        `;
        
        updateQuizStats();
    }

    function updateQuizStats() {
        const stats = document.getElementById('quizStats');
        stats.textContent = `Taškai: ${quizState.score} / ${quizState.questions.length}`;
    }

    function resetQuiz() {
        const container = document.getElementById('quizContainer');
        container.innerHTML = `
            <div style="text-align: center;">
                <button class="start-btn" onclick="startQuiz()">Pradėti Quiz</button>
            </div>
        `;
        quizState = {
            currentQuestion: 0,
            score: 0,
            questions: [],
            answered: false
        };
        updateQuizStats();
    }

    // =============================================================================
    // ŽAIDIMAS 3: REAKCIJOS TESTAS
    // =============================================================================
    
    let reactionState = {
        round: 0,
        totalRounds: 5,
        times: [],
        waitTime: 0,
        startTime: 0,
        timeout: null,
        isWaiting: false,
        isReady: false
    };

    window.startReactionTest = function() {
        const level = currentLevel.reaction;
        
        if (level === 'easy') {
            reactionState.waitTime = 1000;
        } else if (level === 'medium') {
            reactionState.waitTime = 500;
        } else {
            reactionState.waitTime = 300;
        }
        
        reactionState.round = 0;
        reactionState.times = [];
        reactionState.isWaiting = false;
        reactionState.isReady = false;
        
        updateReactionStats();
        nextReactionRound();
    };

    function nextReactionRound() {
        if (reactionState.round >= reactionState.totalRounds) {
            showReactionResults();
            return;
        }
        
        reactionState.round++;
        updateReactionStats();
        
        const area = document.getElementById('reactionArea');
        area.className = 'reaction-area waiting';
        area.textContent = '⏳ Laukite žalio signalo...';
        
        reactionState.isWaiting = true;
        reactionState.isReady = false;
        
        const randomDelay = 2000 + Math.random() * 2000;
        
        reactionState.timeout = setTimeout(() => {
            if (!reactionState.isWaiting) return;
            
            area.className = 'reaction-area ready';
            area.textContent = '📸 DABAR! Spausk!';
            
            reactionState.isReady = true;
            reactionState.startTime = Date.now();
            
            reactionState.timeout = setTimeout(() => {
                if (reactionState.isReady) {
                    reactionState.times.push(null);
                    area.className = 'reaction-area';
                    area.textContent = '❌ Per lėtai!';
                    reactionState.isReady = false;
                    
                    setTimeout(() => {
                        nextReactionRound();
                    }, 1000);
                }
            }, reactionState.waitTime);
        }, randomDelay);
    }

    document.addEventListener('DOMContentLoaded', function() {
        const area = document.getElementById('reactionArea');
        if (!area) return;
        
        area.addEventListener('click', function() {
            if (reactionState.isWaiting && !reactionState.isReady) {
                clearTimeout(reactionState.timeout);
                reactionState.isWaiting = false;
                this.className = 'reaction-area';
                this.textContent = '❌ Per anksti! Laukite žalio.';
                
                reactionState.times.push(null);
                
                setTimeout(() => {
                    nextReactionRound();
                }, 1500);
            } else if (reactionState.isReady) {
                clearTimeout(reactionState.timeout);
                const reactionTime = Date.now() - reactionState.startTime;
                reactionState.times.push(reactionTime);
                reactionState.isReady = false;
                
                this.className = 'reaction-area';
                this.textContent = `✅ ${reactionTime}ms!`;
                
                setTimeout(() => {
                    nextReactionRound();
                }, 1000);
            }
        });
    });

    function showReactionResults() {
        const area = document.getElementById('reactionArea');
        
        const validTimes = reactionState.times.filter(t => t !== null);
        
        if (validTimes.length === 0) {
            area.className = 'reaction-area';
            area.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="color: #e74c3c;">😅 Nei vieno sėkmingo bandymo</h3>
                    <p style="margin: 20px 0;">Pabandyk dar kartą!</p>
                    <button class="start-btn" onclick="startReactionTest()">Žaisti iš naujo</button>
                </div>
            `;
            return;
        }
        
        const best = Math.min(...validTimes);
        const avg = Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);
        const success = validTimes.length;
        
        let rating = '';
        let color = '';
        
        if (best < 200) {
            rating = '🏆 Žaibo greitis!';
            color = '#27ae60';
        } else if (best < 300) {
            rating = '⚡ Labai greitas!';
            color = '#f39c12';
        } else {
            rating = '👍 Neblogai!';
            color = '#3498db';
        }
        
        area.className = 'reaction-area';
        area.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: ${color}; margin-bottom: 20px;">${rating}</h3>
                <div style="font-size: 18px; margin-bottom: 15px;">
                    <strong>Geriausias laikas:</strong> <span style="color: ${color}; font-size: 32px; font-weight: bold;">${best}ms</span>
                </div>
                <div style="font-size: 16px; margin-bottom: 15px;">
                    <strong>Vidutinis:</strong> ${avg}ms
                </div>
                <div style="font-size: 16px; margin-bottom: 25px;">
                    <strong>Sėkmingi bandymai:</strong> ${success}/${reactionState.totalRounds}
                </div>
                <button class="start-btn" onclick="startReactionTest()">Žaisti iš naujo</button>
            </div>
        `;
        
        updateReactionStats();
    }

    function updateReactionStats() {
        const stats = document.getElementById('reactionStats');
        const validTimes = reactionState.times.filter(t => t !== null);
        const best = validTimes.length > 0 ? Math.min(...validTimes) + 'ms' : '-';
        stats.textContent = `Geriausias laikas: ${best} | Bandymas: ${reactionState.round}/${reactionState.totalRounds}`;
    }

    function resetReactionTest() {
        const area = document.getElementById('reactionArea');
        area.className = 'reaction-area';
        area.textContent = 'Spausk "Pradėti testą" žemiau';
        
        if (reactionState.timeout) {
            clearTimeout(reactionState.timeout);
        }
        
        reactionState = {
            round: 0,
            totalRounds: 5,
            times: [],
            waitTime: 0,
            startTime: 0,
            timeout: null,
            isWaiting: false,
            isReady: false
        };
        
        updateReactionStats();
    }

    // =============================================================================
    // UTILITY
    // =============================================================================
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Taikyti nustatymus
    function applyStoredSettings() {
        const bgColor = localStorage.getItem('bgColor');
        const headingColor = localStorage.getItem('headingColor');
        const headingSize = localStorage.getItem('headingSize');
        
        if (bgColor) {
            document.body.style.backgroundColor = bgColor;
            
            if (bgColor === '#2c3e50' || bgColor === '#1a1a1a') {
                document.body.style.color = '#ecf0f1';
                document.querySelectorAll('.game-container').forEach(el => {
                    el.style.backgroundColor = '#2c3e50';
                    el.style.color = '#ecf0f1';
                });
            }
        }
        
        if (headingColor) {
            document.querySelectorAll('h2, h3, .game-header h3').forEach(el => {
                el.style.color = headingColor;
            });
        }
        
        if (headingSize) {
            document.querySelectorAll('h2').forEach(el => {
                el.style.fontSize = headingSize;
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyStoredSettings);
    } else {
        applyStoredSettings();
    }

})();