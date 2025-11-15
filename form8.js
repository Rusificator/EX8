document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('feedback-formMessage');
    
    // URL для отправки формы
    const FORM_SUBMISSION_URL = 'https://formcarry.com/s/_na1c8kkBc4';
    
    // Флаг для отслеживания состояния формы
    let isFormOpen = false;
    let isInitialLoad = true;
    
    // Функция для открытия формы
    function openFeedbackForm() {
        if (isFormOpen) return;
        
        feedbackPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        isFormOpen = true;
        
        // Изменяем URL с помощью History API только если это не начальная загрузка
        if (!isInitialLoad) {
            history.pushState({ formOpen: true }, '', '#feedback');
        }
        isInitialLoad = false;
        
        // Восстанавливаем сохраненные данные
        restoreFormData();
    }
    
    // Функция для закрытия формы
    function closeFeedbackForm() {
        if (!isFormOpen) return;
        
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = '';
        isFormOpen = false;
        
        // Скрываем сообщение
        hideMessage();
        
        // Если URL содержит #feedback, убираем его
        if (window.location.hash === '#feedback') {
            // Используем replaceState чтобы не создавать новую запись в истории
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }
    
    // Функция для принудительного закрытия формы (при нажатии назад)
    function forceCloseFeedbackForm() {
        if (!isFormOpen) return;
        
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = '';
        isFormOpen = false;
        hideMessage();
    }
    
    // Функция для сохранения данных формы в LocalStorage
    function saveFormData() {
        const formData = {
            fullName: document.getElementById('feedback-fullName').value,
            email: document.getElementById('feedback-email').value,
            phone: document.getElementById('feedback-phone').value,
            organization: document.getElementById('feedback-organization').value,
            message: document.getElementById('feedback-message').value,
            privacyPolicy: document.getElementById('feedback-privacyPolicy').checked
        };
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
    }
    
    // Функция для восстановления данных формы из LocalStorage
    function restoreFormData() {
        const savedData = localStorage.getItem('feedbackFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                document.getElementById('feedback-fullName').value = formData.fullName || '';
                document.getElementById('feedback-email').value = formData.email || '';
                document.getElementById('feedback-phone').value = formData.phone || '';
                document.getElementById('feedback-organization').value = formData.organization || '';
                document.getElementById('feedback-message').value = formData.message || '';
                document.getElementById('feedback-privacyPolicy').checked = formData.privacyPolicy || false;
            } catch (e) {
                console.error('Ошибка при восстановлении данных:', e);
                localStorage.removeItem('feedbackFormData');
            }
        }
    }
    
    // Функция для очистки данных формы в LocalStorage
    function clearFormData() {
        localStorage.removeItem('feedbackFormData');
    }
    
    // Функция для сброса формы (без очистки LocalStorage)
    function resetForm() {
        feedbackForm.reset();
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
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {
            // Formcarry возвращает статус в поле code или status
            if (data.code === 200 || data.status === 'success') {
                // Показываем сообщение об успехе
                showMessage('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', true);
                // Очищаем данные формы И LocalStorage только после успешной отправки
                setTimeout(() => {
                    resetForm();
                    clearFormData();
                }, 100);
            } else {
                throw new Error(data.message || 'Ошибка отправки формы');
            }
        })
        .catch(error => {
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
    const formInputs = feedbackForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', saveFormData);
        input.addEventListener('change', saveFormData);
    });
    
    // Отдельный обработчик для чекбокса
    document.getElementById('feedback-privacyPolicy').addEventListener('change', saveFormData);
    
    // Обработчики событий для кнопок открытия/закрытия
    openFeedbackBtn.addEventListener('click', function() {
        isInitialLoad = false;
        openFeedbackForm();
    });
    
    closeFeedbackBtn.addEventListener('click', closeFeedbackForm);
    
    // Обработчик события popstate для поддержки кнопки "Назад"
    window.addEventListener('popstate', function(e) {
        // Если нажали "Назад" и форма открыта - закрываем её
        if (isFormOpen) {
            forceCloseFeedbackForm();
        }
        // Если нажали "Вперед" к форме и она закрыта - открываем её
        else if (window.location.hash === '#feedback') {
            openFeedbackForm();
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
