/**
 * Викторина "Польский язык: Члены семьи"
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
    { polish: "matka", russian: "мама" },
    { polish: "ojciec", russian: "папа" },
    { polish: "rodzice", russian: "родители" },
    { polish: "siostra", russian: "сестра" },
    { polish: "brat", russian: "брат" },
    { polish: "rodzeństwo", russian: "братья и сёстры" },
    { polish: "babcia", russian: "бабушка" },
    { polish: "dziadek", russian: "дедушка" },
    { polish: "dziadkowie", russian: "бабушка и дедушка" },
    { polish: "ciocia", russian: "тётя" },
    { polish: "wujek", russian: "дядя" },
    { polish: "kuzyn", russian: "двоюродный брат" },
    { polish: "kuzynka", russian: "двоюродная сестра" },
    { polish: "córka", russian: "дочь" },
    { polish: "syn", russian: "сын" },
    { polish: "dzieci", russian: "дети" },
    { polish: "żona", russian: "жена" },
    { polish: "mąż", russian: "муж" },
    { polish: "rodzina", russian: "семья" },
    { polish: "krewny", russian: "родственник (м)" },
    { polish: "krewna", russian: "родственница (ж)" },
    { polish: "siostrzenica", russian: "племянница" },
    { polish: "bratanek", russian: "племянник" },
    { polish: "teściowa", russian: "тёща / свекровь" },
    { polish: "teść", russian: "тёсть / свёкор" },
    { polish: "szwagier", russian: "шурин / деверь" },
    { polish: "szwagierka", russian: "золовка / невестка" },
    { polish: "wnuk", russian: "внук" },
    { polish: "wnuczka", russian: "внучка" },
    { polish: "prababcia", russian: "прабабушка" },
    { polish: "pradziadek", russian: "прадедушка" }
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
    // Экран
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    resultScreen: document.getElementById('result-screen'),
    
    // Кнопки
    startBtn: document.getElementById('start-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    backToStartBtn: document.getElementById('back-to-start-btn'),
    
    // Элементы викторины
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    scoreElement: document.getElementById('score'),
    questionNumber: document.getElementById('question-number'),
    russianWord: document.getElementById('russian-word'),
    answersContainer: document.getElementById('answers-container'),
    feedback: document.getElementById('feedback'),
    
    // Элементы результатов
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
    // Настройка обработчиков событий для кнопок
    domElements.startBtn.addEventListener('click', startGame);
    domElements.nextBtn.addEventListener('click', nextQuestion);
    domElements.restartBtn.addEventListener('click', restartGame);
    domElements.backToStartBtn.addEventListener('click', goToStartScreen);
    
    // Показываем стартовый экран
    showScreen('start-screen');
    
    // Готовим список вопросов (перемешиваем)
    prepareQuestions();
    
    console.log('Викторина "Польский язык: Члены семьи" инициализирована!');
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
    console.log(`Подготовлено ${gameState.questions.length} вопросов`);
}

/**
 * Запуск игры
 */
function startGame() {
    // Сброс состояния игры
    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.selectedAnswer = null;
    gameState.gameCompleted = false;
    
    // Перемешиваем вопросы заново
    prepareQuestions();
    
    // Обновляем интерфейс
    updateScore();
    updateProgress();
    
    // Показываем первый вопрос
    showQuestion();
    
    // Переключаемся на экран викторины
    showScreen('quiz-screen');
    
    console.log('Игра началась!');
}

/**
 * Отображение текущего вопроса
 */
function showQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    
    // Обновляем номер вопроса
    domElements.questionNumber.textContent = `Вопрос ${gameState.currentQuestionIndex + 1}`;
    
    // Обновляем русское слово
    domElements.russianWord.textContent = question.russian;
    
    // Генерируем варианты ответов (польские слова)
    generateAnswerOptions(question);
    
    // Сбрасываем выбранный ответ и обратную связь
    gameState.selectedAnswer = null;
    domElements.feedback.classList.remove('show', 'correct', 'incorrect');
    domElements.nextBtn.disabled = true;
    
    // Обновляем прогресс
    updateProgress();
}

/**
 * Генерация вариантов ответов для вопроса
 * @param {Object} correctQuestion - Текущий вопрос с правильным ответом
 */
function generateAnswerOptions(correctQuestion) {
    // Очищаем контейнер ответов
    domElements.answersContainer.innerHTML = '';
    
    // Создаем массив с вариантами ответов
    let answerOptions = [correctQuestion.polish];
    
    // Добавляем случайные неправильные варианты из словаря
    const otherWords = VOCABULARY
        .filter(item => item.polish !== correctQuestion.polish)
        .sort(() => Math.random() - 0.5)
        .slice(0, GAME_CONFIG.answerOptions - 1)
        .map(item => item.polish);
    
    answerOptions = [...answerOptions, ...otherWords];
    
    // Перемешиваем варианты ответов
    answerOptions = answerOptions.sort(() => Math.random() - 0.5);
    
    // Создаем кнопки для каждого варианта ответа
    answerOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = option;
        button.dataset.answer = option;
        
        // Добавляем обработчик события
        button.addEventListener('click', () => selectAnswer(option, button));
        
        // Добавляем кнопку в контейнер
        domElements.answersContainer.appendChild(button);
    });
}

/**
 * Обработка выбора ответа пользователем
 * @param {string} selectedAnswer - Выбранный ответ (польское слово)
 * @param {HTMLElement} buttonElement - Элемент кнопки
 */
function selectAnswer(selectedAnswer, buttonElement) {
    // Если ответ уже выбран, игнорируем
    if (gameState.selectedAnswer !== null) return;
    
    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.polish;
    
    // Сохраняем выбранный ответ
    gameState.selectedAnswer = selectedAnswer;
    
    // Отмечаем выбранную кнопку
    buttonElement.classList.add('selected');
    
    // Проверяем правильность ответа
    if (isCorrect) {
        // Увеличиваем счет
        gameState.score++;
        updateScore();
        
        // Показываем позитивную обратную связь
        showFeedback(true, `Правильно! "${currentQuestion.russian}" → "${currentQuestion.polish}"`);
        
        // Подсвечиваем правильный ответ зеленым
        buttonElement.classList.add('correct');
    } else {
        // Показываем негативную обратную связь
        showFeedback(false, `Неправильно. Правильный ответ: "${currentQuestion.polish}"`);
        
        // Подсвечиваем неправильный ответ красным
        buttonElement.classList.add('incorrect');
        
        // Находим и подсвечиваем правильный ответ зеленым
        const correctButton = Array.from(domElements.answersContainer.children)
            .find(btn => btn.dataset.answer === currentQuestion.polish);
        if (correctButton) {
            correctButton.classList.add('correct');
        }
    }
    
    // Активируем кнопку "Следующий вопрос"
    domElements.nextBtn.disabled = false;
    
    // Отключаем все кнопки ответов
    const allAnswerButtons = domElements.answersContainer.querySelectorAll('.answer-btn');
    allAnswerButtons.forEach(btn => {
        btn.disabled = true;
    });
}

/**
 * Показать обратную связь
 * @param {boolean} isCorrect - Правильный ли ответ
 * @param {string} message - Сообщение для отображения
 */
function showFeedback(isCorrect, message) {
    // Очищаем предыдущую обратную связь
    domElements.feedback.innerHTML = '';
    
    // Устанавливаем классы и содержимое
    domElements.feedback.className = 'feedback';
    domElements.feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Создаем содержимое обратной связи
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
    // Увеличиваем индекс текущего вопроса
    gameState.currentQuestionIndex++;
    
    // Проверяем, завершена ли игра
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        finishGame();
    } else {
        // Показываем следующий вопрос
        showQuestion();
    }
}

/**
 * Завершение игры и показ результатов
 */
function finishGame() {
    // Устанавливаем флаг завершения игры
    gameState.gameCompleted = true;
    
    // Рассчитываем процент правильных ответов
    const percentage = Math.round((gameState.score / GAME_CONFIG.totalQuestions) * 100);
    
    // Обновляем элементы на экране результатов
    domElements.circleScore.textContent = gameState.score;
    domElements.scorePercent.textContent = `${percentage}%`;
    domElements.correctAnswers.textContent = gameState.score;
    
    // Устанавливаем сообщение в зависимости от результата
    let message = '';
    let title = 'Викторина завершена!';
    let iconClass = 'fas fa-trophy';
    let iconColor = '#f1c40f';
    
    if (percentage === 100) {
        message = 'Потрясающе! Вы знаете все польские слова на тему "Члены семьи"! Идеальный результат! 🎉';
        title = 'Безупречный результат!';
        iconClass = 'fas fa-crown';
        iconColor = '#f1c40f';
    } else if (percentage >= 80) {
        message = 'Отличный результат! Вы хорошо знаете польские слова на тему семьи. Так держать!';
        title = 'Отлично справились!';
        iconClass = 'fas fa-star';
        iconColor = '#2ecc71';
    } else if (percentage >= 60) {
        message = 'Хороший результат! Вы знаете основные польские слова на тему семьи. Продолжайте практиковаться!';
        title = 'Хорошая работа!';
        iconClass = 'fas fa-medal';
        iconColor = '#3498db';
    } else if (percentage >= 40) {
        message = 'Неплохой результат! Есть куда расти. Повторите польские слова и попробуйте снова!';
        title = 'Можно лучше!';
        iconClass = 'fas fa-award';
        iconColor = '#9b59b6';
    } else {
        message = 'Вам нужно повторить польские слова на тему "Члены семьи". Попробуйте еще раз, и у вас обязательно получится!';
        title = 'П
