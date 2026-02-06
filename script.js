/**
 * ЛингоИгры: Викторина "Członkowie rodziny" (польский)
 * Полностью оффлайн-игра для изучения польской лексики
 */

// Конфигурация игры
const GAME_CONFIG = {
    totalQuestions: 20,
    answerOptions: 4,
    animationDuration: 500
};

// Словарь: польские слова и их русские переводы
const VOCABULARY = [
    { polish: "matka", russian: "мама", english: "mother" },
    { polish: "ojciec", russian: "папа", english: "father" },
    { polish: "rodzice", russian: "родители", english: "parents" },
    { polish: "siostra", russian: "сестра", english: "sister" },
    { polish: "brat", russian: "брат", english: "brother" },
    { polish: "rodzeństwo", russian: "братья и сёстры", english: "siblings" },
    { polish: "babcia", russian: "бабушка", english: "grandmother" },
    { polish: "dziadek", russian: "дедушка", english: "grandfather" },
    { polish: "dziadkowie", russian: "бабушка и дедушка", english: "grandparents" },
    { polish: "ciocia", russian: "тётя", english: "aunt" },
    { polish: "wujek", russian: "дядя", english: "uncle" },
    { polish: "kuzyn / kuzynka", russian: "двоюродный брат / сестра", english: "cousin" },
    { polish: "córka", russian: "дочь", english: "daughter" },
    { polish: "syn", russian: "сын", english: "son" },
    { polish: "dzieci", russian: "дети", english: "children" },
    { polish: "żona", russian: "жена", english: "wife" },
    { polish: "mąż", russian: "муж", english: "husband" },
    { polish: "rodzina", russian: "семья", english: "family" },
    { polish: "krewny / krewna", russian: "родственник", english: "relative" },
    { polish: "siostrzenica", russian: "племянница", english: "niece" },
    { polish: "bratanek", russian: "племянник", english: "nephew" },
    { polish: "teściowa", russian: "тёща / свекровь", english: "mother-in-law" },
    { polish: "teść", russian: "тёсть / свёкор", english: "father-in-law" },
    { polish: "szwagier", russian: "шурин / деверь", english: "brother-in-law" },
    { polish: "szwagierka", russian: "золовка / невестка", english: "sister-in-law" }
];

// Состояние игры
const gameState = {
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
    selectedAnswer: null,
    gameCompleted: false
};

// Элементы DOM
const domElements = {
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    startBtn: document.getElementById('start-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    backToStartBtn: document.getElementById('back-to-start-btn'),
    
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    scoreElement: document.getElementById('score'),
    questionNumber: document.getElementById('question-number'),
    russianWord: document.getElementById('russian-word'),
    answersContainer: document.getElementById('answers-container'),
    feedback: document.getElementById('feedback'),
    
    resultIcon: document.getElementById('result-icon'),
    resultTitle: document.getElementById('result-title'),
    scoreCircle: document.getElementById('score-circle'),
    circleScore: document.getElementById('circle-score'),
    scorePercent: document.getElementById('score-percent'),
    correctAnswers: document.getElementById('correct-answers'),
    finalScore: document.getElementById('final-score'),
    resultMessage: document.getElementById('result-message')
};

/**
 * Инициализация игры при загрузке страницы
 */
function initGame() {
    domElements.startBtn.addEventListener('click', startGame);
    domElements.nextBtn.addEventListener('click', nextQuestion);
    domElements.restartBtn.addEventListener('click', restartGame);
    domElements.backToStartBtn.addEventListener('click', goToStartScreen);
    
    showScreen('start-screen');
    prepareQuestions();
    
    console.log('Gra "Członkowie rodziny" zainicjalizowana. Gotowa do uruchomienia!');
}

/**
 * Подготовка списка вопросов для викторины
 */
function prepareQuestions() {
    // Выбираем 20 случайных слов из словаря
    const shuffledVocabulary = [...VOCABULARY]
        .sort(() => Math.random() - 0.5)
        .slice(0, GAME_CONFIG.totalQuestions);
    
    gameState.questions = shuffledVocabulary;
    console.log(`Przygotowano ${gameState.questions.length} pytań`);
}

/**
 * Запуск игры
 */
function startGame() {
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.selectedAnswer = null;
    gameState.gameCompleted = false;
    
    prepareQuestions();
    updateScore();
    updateProgress();
    showQuestion();
    showScreen('quiz-screen');
    
    console.log('Gra rozpoczęta!');
}

/**
 * Отображение текущего вопроса
 */
function showQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    domElements.questionNumber.textContent = `Pytanie ${gameState.currentQuestionIndex + 1}`;
    domElements.russianWord.textContent = question.russian;
    
    generateAnswerOptions(question);
    
    gameState.selectedAnswer = null;
    domElements.feedback.classList.remove('show', 'correct', 'incorrect');
    domElements.nextBtn.disabled = true;
    
    updateProgress();
}

/**
 * Генерация вариантов ответов для вопроса
 */
function generateAnswerOptions(correctQuestion) {
    domElements.answersContainer.innerHTML = '';
    
    let answerOptions = [correctQuestion.polish];
    
    // Добавляем случайные неправильные варианты
    const otherWords = VOCABULARY
        .filter(item => item.polish !== correctQuestion.polish)
        .sort(() => Math.random() - 0.5)
        .slice(0, GAME_CONFIG.answerOptions - 1)
        .map(item => item.polish);
    
    answerOptions = [...answerOptions, ...otherWords];
    answerOptions = answerOptions.sort(() => Math.random() - 0.5);
    
    answerOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = option;
        button.dataset.answer = option;
        
        button.addEventListener('click', () => selectAnswer(option, button));
        domElements.answersContainer.appendChild(button);
    });
}

/**
 * Обработка выбора ответа пользователем
 */
function selectAnswer(selectedAnswer, buttonElement) {
    if (gameState.selectedAnswer !== null) return;
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.polish;
    
    gameState.selectedAnswer = selectedAnswer;
    buttonElement.classList.add('selected');
    
    if (isCorrect) {
        gameState.score++;
        updateScore();
        showFeedback(true, `Poprawnie! "${currentQuestion.russian}" → "${currentQuestion.polish}" (ang: ${currentQuestion.english})`);
        buttonElement.classList.add('correct');
    } else {
        showFeedback(false, `Niepoprawnie. Prawidłowa odpowiedź: "${currentQuestion.polish}" (ang: ${currentQuestion.english})`);
        buttonElement.classList.add('incorrect');
        
        const correctButton = Array.from(domElements.answersContainer.children)
            .find(btn => btn.dataset.answer === currentQuestion.polish);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
    }
    
    domElements.nextBtn.disabled = false;
    const allAnswerButtons = domElements.answersContainer.querySelectorAll('.answer-btn');
    allAnswerButtons.forEach(btn => {
        btn.disabled = true;
    });
}

/**
 * Показать обратную связь
 */
function showFeedback(isCorrect, message) {
    domElements.feedback.innerHTML = '';
    domElements.feedback.className = 'feedback';
    domElements.feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    const icon = document.createElement('i');
    icon.className = isCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
    
    const text = document.createElement('div');
    text.className = 'feedback-text';
    text.textContent = message;
    
    const content = document.createElement('div');
    content.className = 'feedback-content';
    content.appendChild(icon);
    content.appendChild(text);
    
    domElements.feedback.appendChild(content);
    domElements.feedback.classList.add('show');
}

/**
 * Переход к следующему вопросу
 */
function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        finishGame();
    } else {
        showQuestion();
    }
}

/**
 * Завершение игры и показ результатов
 */
function finishGame() {
    gameState.gameCompleted = true;
    const percentage = Math.round((gameState.score / GAME_CONFIG.totalQuestions) * 100);
    
    domElements.circleScore.textContent = gameState.score;
    domElements.scorePercent.textContent = `${percentage}%`;
    domElements.correctAnswers.textContent = gameState.score;
    
    let message = '';
    let title = 'Quiz zakończony!';
    let iconClass = 'fas fa-trophy';
    let iconColor = '#f1c40f';
    
    if (percentage === 100) {
        message = 'Niesamowicie! Znasz wszystkie słowa na temat "Członkowie rodziny"! Perfekcyjny wynik! 🎉';
        title = 'Wynik perfekcyjny!';
        iconClass = 'fas fa-crown';
        iconColor = '#f1c40f';
    } else if (percentage >= 80) {
        message = 'Świetny wynik! Dobrze znasz słownictwo dotyczące rodziny. Tak trzymaj!';
        title = 'Świetna robota!';
        iconClass = 'fas fa-star';
        iconColor = '#2ecc71';
    } else if (percentage >= 60) {
        message = 'Dobry wynik! Znasz podstawowe słowa na temat rodziny. Kontynuuj praktykę!';
        title = 'Dobra praca!';
        iconClass = 'fas fa-medal';
        iconColor = '#3498db';
    } else if (percentage >= 40) {
        message = 'Nieźle! Jest miejsce na poprawę. Powtórz słówka i spróbuj ponownie!';
        title = 'Można lepiej!';
        iconClass = 'fas fa-award';
        iconColor = '#9b59b6';
    } else {
        message = 'Musisz powtórzyć słownictwo na temat "Członkowie rodziny". Spróbuj jeszcze raz, na pewno ci się uda!';
        title = 'Spróbuj jeszcze raz!';
        iconClass = 'fas fa-redo';
        iconColor = '#e74c3c';
    }
    
    domElements.resultTitle.textContent = title;
    domElements.resultMessage.textContent = message;
    domElements.resultIcon.innerHTML = `<i class="${iconClass}"></i>`;
    domElements.resultIcon.style.color = iconColor;
    
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    
    domElements.scoreCircle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        domElements.scoreCircle.style.transition = `stroke-dashoffset 1.5s ease`;
        domElements.scoreCircle.style.strokeDashoffset = offset;
    }, 300);
    
    showScreen('result-screen');
    console.log(`Gra zakończona. Wynik: ${gameState.score}/${GAME_CONFIG.totalQuestions} (${percentage}%)`);
}

/**
 * Обновление счета в интерфейсе
 */
function updateScore() {
    const scoreSpan = domElements.scoreElement.querySelector('span');
    scoreSpan.textContent = gameState.score;
}

/**
 * Обновление индикатора прогресса
 */
function updateProgress() {
    const progressPercentage = ((gameState.currentQuestionIndex + 1) / GAME_CONFIG.totalQuestions) * 100;
    domElements.progressFill.style.width = `${progressPercentage}%`;
    domElements.progressText.textContent = `Pytanie ${gameState.currentQuestionIndex + 1} z ${GAME_CONFIG.totalQuestions}`;
}

/**
 * Перезапуск игры
 */
function restartGame() {
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.selectedAnswer = null;
    gameState.gameCompleted = false;
    
    prepareQuestions();
    updateScore();
    showQuestion();
    showScreen('quiz-screen');
    
    console.log('Gra ponownie uruchomiona!');
}

/**
 * Возврат на стартовый экран
 */
function goToStartScreen() {
    showScreen('start-screen');
}

/**
 * Переключение между экранами
 */
function showScreen(screenId) {
    domElements.startScreen.classList.remove('active');
    domElements.quizScreen.classList.remove('active');
    domElements.resultScreen.classList.remove('active');
    
    document.getElementById(screenId).classList.add('active');
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);
