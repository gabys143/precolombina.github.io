/* ============================================
   BUNNY-PEDIA · SPA + Quiz + Coquette + Audio + Modal
   ============================================ */

var isEasyMode = false;

// --- Diccionario Coquette 🎀 (traducciones modo niño) ---
var bunnyTranslations = {
    'Códices': 'Libritos de dibujos que parecen un acordeón infinito. 🎶',
    'Popol Vuh': 'La historia de cómo nos hicieron con masa de maíz (como una arepa o tortilla). 🌽✨',
    'Ollantay': 'Un general que se puso rebelde porque amaba a una princesa prohibida. Muy romántico, muy demure. 👑',
    'Quipus': 'Nudos de colores para contar cosas porque no tenían calculadoras. 🧶',
    'Anónima': 'Nadie sabe quién lo escribió, ¡fue un trabajo en equipo de todo el pueblo! 🐰🤝'
};

// --- Botón Auxilio Coquette (modo niño 7 años) ---
function toggleEasyMode() {
    isEasyMode = !isEasyMode;
    document.body.classList.toggle('easy-mode', isEasyMode);
}

// --- Navegación SPA ---
function showSection(id) {
    document.querySelectorAll('.section').forEach(function (s) {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    var section = document.getElementById(id);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
    }
    if (id === 'quiz') {
        restartQuiz();
    }
    stopSpeech();
}

// --- Quiz: banco de preguntas (TikTok 2026 Edition) ---
var quizData = [
    {
        question: '¿Qué material se usaba para los Códices?',
        options: ['Papel Amate', 'Plástico reciclado', 'Piedra', 'Barro'],
        correct: 'Papel Amate'
    },
    {
        question: '¿Quiénes son los gemelos héroes del Popol Vuh?',
        options: ['Hunahpú e Ixbalanqué', 'New y Jeans', 'Manco Cápac y Mama Ocllo', 'Ollantay y Cusi Coyllur'],
        correct: 'Hunahpú e Ixbalanqué'
    },
    {
        question: '¿Cómo se llama el guerrero del Rabinal Achí?',
        options: ['Quiché Achí', 'Skibidi Achí', 'Rabinaleb', 'Hunahpú'],
        correct: 'Quiché Achí'
    },
    {
        question: '¿Qué son los Quipus?',
        options: ['Nudos de colores', 'Zapatos de cuero', 'Libros de piel', 'Cantos de triunfo'],
        correct: 'Nudos de colores'
    }
];

var currentQuestionIndex = 0;
var quizScore = 0;
var answered = false;

function renderQuestion() {
    answered = false;
    var data = quizData[currentQuestionIndex];
    var container = document.getElementById('quiz-container');
    var resultDiv = document.getElementById('quiz-result');

    container.style.display = 'block';
    resultDiv.style.display = 'none';

    document.getElementById('quiz-counter').textContent = (currentQuestionIndex + 1) + ' / 4';
    document.getElementById('progress-fill').style.width = ((currentQuestionIndex + 1) / 4 * 100) + '%';

    document.getElementById('quiz-question').textContent = data.question;

    var optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = '';
    data.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = function () {
            if (answered) return;
            answered = true;
            checkAnswer(opt, btn, data.correct);
        };
        optionsEl.appendChild(btn);
    });

    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
    document.getElementById('quiz-next').style.display = 'none';
}

function checkAnswer(selected, buttonEl, correct) {
    var options = document.querySelectorAll('.quiz-option');
    options.forEach(function (btn) {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add('correct');
        } else if (btn === buttonEl && selected !== correct) {
            btn.classList.add('wrong');
        }
    });

    var feedback = document.getElementById('quiz-feedback');
    if (selected === correct) {
        quizScore += 1;
        feedback.textContent = '¡Correcto! 🐰💖';
        feedback.className = 'quiz-feedback correct';
    } else {
        feedback.textContent = 'Oops... La respuesta correcta es: ' + correct + ' · ¡Hype Boy!';
        feedback.className = 'quiz-feedback wrong';
        openErrorModal();
    }

    document.getElementById('quiz-next').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex += 1;
    if (currentQuestionIndex < quizData.length) {
        renderQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    document.getElementById('quiz-container').style.display = 'none';
    var resultDiv = document.getElementById('quiz-result');
    resultDiv.style.display = 'block';

    var scoreEl = document.getElementById('quiz-score');
    var msg = quizScore === 4
        ? '🐰 OMG! ' + quizScore + '/4 · ¡Perfecto!'
        : 'Obtuviste ' + quizScore + ' de 4. ¡Sigue leyendo! 🐰';
    scoreEl.textContent = msg;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    renderQuestion();
}

// --- Modal Error TikTok 2026 ---
function openErrorModal() {
    var modal = document.getElementById('modal-brainrot');
    if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeErrorModal() {
    var modal = document.getElementById('modal-brainrot');
    if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// --- Audio resumen (Web Speech API) ---
var sectionSummaries = {
    intro: 'Los pueblos antiguos de América escribían cuentos sobre la naturaleza. Nadie sabía quién los escribía porque eran de todos. Los mayas y aztecas usaban dibujos en piedras y libros de piel.',
    codices: 'Los códices son libros que se doblan como acordeón. Estaban hechos de papel amate o piel de venado. No tenían letras, tenían dibujos mágicos para recordar la historia.',
    maya: 'Los mayas escribían en piedras y libros de piel. El Rabinal Achí es un teatro de guerreros que se baila con máscaras. El Popol Vuh cuenta que nos hicieron de maíz.',
    inca: 'Los incas usaban nudos de colores llamados quipus para contar historias. El Ollantay es un drama de amor prohibido entre un soldado y una princesa.'
};

var currentUtterance = null;

function stopSpeech() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    document.querySelectorAll('.audio-btn').forEach(function (btn) {
        btn.classList.remove('playing');
        btn.querySelector('.audio-icon').textContent = '🔊';
    });
}

function playSectionSummary(sectionId) {
    var text = sectionSummaries[sectionId];
    if (!text || !window.speechSynthesis) return;

    stopSpeech();

    var btn = document.querySelector('.audio-resumen[data-section="' + sectionId + '"] .audio-btn');
    if (btn) {
        btn.classList.add('playing');
        btn.querySelector('.audio-icon').textContent = '⏸';
    }

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    if (isEasyMode) {
        utterance.rate = 1.05;
        if (utterance.pitch !== undefined) utterance.pitch = 1.35;
    } else {
        utterance.rate = 0.92;
        if (utterance.pitch !== undefined) utterance.pitch = 0.98;
    }
    utterance.onend = utterance.onerror = function () {
        if (btn) {
            btn.classList.remove('playing');
            btn.querySelector('.audio-icon').textContent = '🔊';
        }
    };
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
}

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.section').forEach(function (s) {
        if (!s.classList.contains('active')) {
            s.style.display = 'none';
        }
    });
    document.querySelectorAll('.kids-text').forEach(function (k) {
        k.style.display = 'none';
    });
    var modal = document.getElementById('modal-brainrot');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeErrorModal();
        });
    }
});
