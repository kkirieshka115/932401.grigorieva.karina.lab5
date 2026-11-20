const STORAGE_KEY_HYPOTHESES = 'lab5_hypotheses';
const STORAGE_KEY_THEME = 'lab5_theme';

const defaultHypotheses = [
    {
        title: 'Гипотеза обитаемости',
        text: 'В зонах обитаемости звёзд спектрального класса K существуют планеты с условиями, пригодными для жизни.',
        status: 'checked'
    },
    {
        title: 'Гипотеза эволюции скоплений',
        text: 'Шаровые скопления Млечного Пути формировались в несколько этапов, а не единовременно.',
        status: 'unchecked'
    },
    {
        title: 'Гипотеза солнечного влияния',
        text: 'Циклы солнечной активности напрямую влияют на интенсивность космического излучения вблизи Земли.',
        status: 'checked'
    }
];

const statusLabels = {
    'checked': 'Статус: проверена',
    'unchecked': 'Статус: не проверена'
};

const statusOrder = ['unchecked', 'checked'];

function getHypotheses() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_HYPOTHESES);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Ошибка чтения localStorage:', e);
    }
    return defaultHypotheses;
}

function saveHypotheses(hypotheses) {
    try {
        localStorage.setItem(STORAGE_KEY_HYPOTHESES, JSON.stringify(hypotheses));
    } catch (e) {
        console.error('Ошибка записи в localStorage:', e);
    }
}

function createHypothesisCard(hypothesis, index) {
    const article = document.createElement('article');
    article.className = 'hypothesis-card';

    const h3 = document.createElement('h3');
    h3.textContent = hypothesis.title;
    article.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = hypothesis.text;
    article.appendChild(p);

    const statusSpan = document.createElement('span');
    statusSpan.className = 'status ' + hypothesis.status;
    statusSpan.textContent = statusLabels[hypothesis.status];
    article.appendChild(statusSpan);

    const changeBtn = document.createElement('button');
    changeBtn.className = 'change-status';
    changeBtn.type = 'button';
    changeBtn.textContent = 'Изменить статус';
    changeBtn.addEventListener('click', function() {
        changeStatus(index);
    });
    article.appendChild(changeBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'change-status delete-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', function() {
        deleteHypothesis(index);
    });
    article.appendChild(deleteBtn);

    return article;
}

function renderHypotheses() {
    const container = document.querySelector('#hypothesesContainer');
    if (!container) {
        console.error('Контейнер гипотез не найден');
        return;
    }

    container.innerHTML = '';
    const hypotheses = getHypotheses();

    hypotheses.forEach(function(hypothesis, index) {
        const card = createHypothesisCard(hypothesis, index);
        container.appendChild(card);
    });

    const allCards = document.querySelectorAll('.hypothesis-card');
    console.log('Всего карточек гипотез:', allCards.length);

    const firstCard = document.querySelector('.hypothesis-card');
    if (firstCard) {
        const title = firstCard.querySelector('h3').textContent;
        console.log('Первая гипотеза:', title);
    }

    const allStatusBtns = document.querySelectorAll('.change-status:not(.delete-btn)');
    console.log('Кнопок изменения статуса:', allStatusBtns.length);
}

function changeStatus(index) {
    const hypotheses = getHypotheses();
    if (index < 0 || index >= hypotheses.length) {
        console.error('Неверный индекс гипотезы:', index);
        return;
    }

    const currentStatus = hypotheses[index].status;
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    hypotheses[index].status = statusOrder[nextIndex];

    saveHypotheses(hypotheses);
    renderHypotheses();
}

function deleteHypothesis(index) {
    const hypotheses = getHypotheses();
    if (index < 0 || index >= hypotheses.length) {
        console.error('Неверный индекс гипотезы для удаления:', index);
        return;
    }

    const confirmDelete = confirm('Удалить гипотезу "' + hypotheses[index].title + '"?');
    if (!confirmDelete) {
        return;
    }

    hypotheses.splice(index, 1);
    saveHypotheses(hypotheses);
    renderHypotheses();
}

function addHypothesis() {
    const title = prompt('Введите название гипотезы:');
    if (!title) {
        console.log('Добавление гипотезы отменено');
        return;
    }

    const text = prompt('Введите формулировку гипотезы:');
    if (!text) {
        console.log('Добавление гипотезы отменено');
        return;
    }

    const hypotheses = getHypotheses();
    hypotheses.push({
        title: title,
        text: text,
        status: 'unchecked'
    });

    saveHypotheses(hypotheses);
    renderHypotheses();
}

function toggleHypothesesSection() {
    const container = document.querySelector('#hypothesesContainer');
    const button = document.querySelector('#toggleHypothesesBtn');

    if (!container || !button) {
        console.error('Элементы для скрытия не найдены');
        return;
    }

    container.classList.toggle('hidden');

    if (container.classList.contains('hidden')) {
        button.textContent = 'Показать гипотезы';
    } else {
        button.textContent = 'Скрыть гипотезы';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');

    try {
        localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
    } catch (e) {
        console.error('Ошибка сохранения темы:', e);
    }
}

function loadTheme() {
    try {
        const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    } catch (e) {
        console.error('Ошибка загрузки темы:', e);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    renderHypotheses();

    const themeBtn = document.querySelector('#themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    } else {
        console.error('Кнопка переключения темы не найдена');
    }

    const addBtn = document.querySelector('#addHypothesisBtn');
    if (addBtn) {
        addBtn.addEventListener('click', addHypothesis);
    } else {
        console.error('Кнопка добавления гипотезы не найдена');
    }

    const toggleBtn = document.querySelector('#toggleHypothesesBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleHypothesesSection);
    } else {
        console.error('Кнопка скрытия гипотез не найдена');
    }
});
