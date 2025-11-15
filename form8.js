document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('formMessage');
    
    // URL для отправки формы (ваша ссылка от formcarry)
    const FORM_SUBMISSION_URL = 'https://formcarry.com/s/_na1c8kkBc4';
    
    // Функция для открытия формы
    function openFeedbackForm() {
        feedbackPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
        // Изменяем URL с помощью History API
        history.pushState({ formOpen: true }, '', '#feedback');
        // Восстанавливаем сохраненные данные
        restoreFormData();
    }
    
    // Функция для закрытия формы
    function closeFeedbackForm() {
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
        // Возвращаем URL к исходному состоянию
        if (history.state && history.state.formOpen) {
            history.back();
        }
        // Скрываем сообщение
        hideMessage();
    }
    
    // Функция для сохранения данных формы в LocalStorage
    function saveFormData() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            organization: document.getElementById('organization').value,
            message: document.getElementById('message').value,
            privacyPolicy: document.getElementById('privacyPolicy').checked
        };
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
        console.log('Данные сохранены в LocalStorage:', formData);
    }
    
    // Функция для восстановления данных формы из LocalStorage
    function restoreFormData() {
        const savedData = localStorage.getItem('feedbackFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                document.getElementById('fullName').value = formData.fullName || '';
                document.getElementById('email').value = formData.email || '';
                document.getElementById('phone').value = formData.phone || '';
                document.getElementById('organization').value = formData.organization || '';
                document.getElementById('message').value = formData.message || '';
                document.getElementById('privacyPolicy').checked = formData.privacyPolicy || false;
                console.log('Данные восстановлены из LocalStorage:', formData);
            } catch (e) {
                console.error('Ошибка при восстановлении данных:', e);
                // Если данные повреждены, очищаем LocalStorage
                localStorage.removeItem('feedbackFormData');
            }
        }
    }
    
    // Функция для очистки данных формы в LocalStorage
    function clearFormData() {
        localStorage.removeItem('feedbackFormData');
        feedbackForm.reset();
        console.log('Данные очищены из LocalStorage');
    }
    
    // Функция для отображения сообщения
    function showMessage(text, isSuccess) {
        formMessage.textContent = text;
        formMessage.className = isSuccess ? 'message success' : 'message error';
        formMessage.style.display = 'block';
        
        // Автоматически скрываем сообщение только для ошибок
        if (!isSuccess) {
            setTimeout(hideMessage, 5000);
        }
    }
    
    // Функция для скрытия сообщения
    function hideMessage() {
        formMessage.style.display = 'none';
    }
    
    // Обработчик отправки формы
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Показываем индикатор загрузки
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Собираем данные формы
        const formData = new FormData(feedbackForm);
        const data = Object.fromEntries(formData);
        
        console.log('Отправка данных:', data);
        
        // Отправляем данные на сервер с помощью fetch
        fetch(FORM_SUBMISSION_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Получен ответ от сервера:', response);
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {
            console.log('Данные ответа:', data);
            // Formcarry возвращает статус в поле code или status
            if (data.code === 200 || data.status === 'success') {
                // Показываем сообщение об успехе
                showMessage('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', true);
                // Очищаем данные формы
                clearFormData();
                // НЕ закрываем форму автоматически - пользователь должен видеть сообщение
            } else {
                throw new Error(data.message || 'Ошибка отправки формы');
            }
        })
        .catch(error => {
            console.error('Ошибка отправки формы:', error);
            // Показываем сообщение об ошибке
            showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами другим способом.', false);
        })
        .finally(() => {
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Обработчики событий для элементов формы для сохранения данных
    const formInputs = feedbackForm.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
    
    // Обработчики событий для кнопок открытия/закрытия
    openFeedbackBtn.addEventListener('click', openFeedbackForm);
    closeFeedbackBtn.addEventListener('click', closeFeedbackForm);
    
    // Обработчик события popstate для поддержки кнопки "Назад"
    window.addEventListener('popstate', function(e) {
        if (window.location.hash === '#feedback') {
            openFeedbackForm();
        } else {
            closeFeedbackForm();
        }
    });
    
    // Проверяем hash при загрузке страницы
    if (window.location.hash === '#feedback') {
        openFeedbackForm();
    }
    
    // Закрытие формы при клике вне её области
    feedbackPopup.addEventListener('click', function(e) {
        if (e.target === feedbackPopup) {
            closeFeedbackForm();
        }
    });
    
    // Закрытие формы при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && feedbackPopup.classList.contains('active')) {
            closeFeedbackForm();
        }
    });
});