document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('feedbackFormMessage');
    
    // Элементы формы с уникальными ID
    const feedbackFullName = document.getElementById('feedbackFullName');
    const feedbackEmail = document.getElementById('feedbackEmail');
    const feedbackPhone = document.getElementById('feedbackPhone');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const feedbackPrivacyPolicy = document.getElementById('feedbackPrivacyPolicy');
    
    // URL для отправки формы
    const FORM_SUBMISSION_URL = 'https://formcarry.com/s/_na1c8kkBc4';
    
    // Флаг для отслеживания состояния формы
    let isFormOpen = false;

    // Функция для валидации формы
    function validateForm() {
        let isValid = true;
        
        // Валидация ФИО
        if (!feedbackFullName.value.trim()) {
            showFieldError(feedbackFullName, 'Пожалуйста, введите ваше ФИО');
            isValid = false;
        } else {
            hideFieldError(feedbackFullName);
        }
        
        // Валидация email
        if (!feedbackEmail.value || !isValidEmail(feedbackEmail.value)) {
            showFieldError(feedbackEmail, 'Пожалуйста, введите корректный email');
            isValid = false;
        } else {
            hideFieldError(feedbackEmail);
        }
        
        // Валидация телефона
        if (!feedbackPhone.value || !isValidPhone(feedbackPhone.value)) {
            showFieldError(feedbackPhone, 'Пожалуйста, введите корректный номер телефона');
            isValid = false;
        } else {
            hideFieldError(feedbackPhone);
        }
        
        // Валидация сообщения
        if (!feedbackMessage.value.trim() || feedbackMessage.value.trim().length < 10) {
            showFieldError(feedbackMessage, 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        } else {
            hideFieldError(feedbackMessage);
        }
        
        // Валидация чекбокса
        if (!feedbackPrivacyPolicy.checked) {
            showFieldError(feedbackPrivacyPolicy, 'Необходимо принять условия соглашения');
            isValid = false;
        } else {
            hideFieldError(feedbackPrivacyPolicy);
        }
        
        return isValid;
    }
    
    // Функция для проверки email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Функция для проверки телефона
    function isValidPhone(phone) {
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return phoneRegex.test(phone);
    }
    
    // Функция для показа ошибки поля
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Находим или создаем элемент для отображения ошибки
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Функция для скрытия ошибки поля
    function hideFieldError(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // Функция для форматирования телефона
    function formatPhone(phone) {
        return phone.replace(/[^\d+]/g, '');
    }
    
    // Функция для открытия формы
    function openFeedbackForm() {
        if (isFormOpen) return;
        
        // Показываем попап
        feedbackPopup.style.display = 'flex';
        
        // Запускаем анимацию после отображения элемента
        setTimeout(() => {
            feedbackPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            isFormOpen = true;
        }, 10);
        
        // Изменяем URL с помощью History API
        history.pushState({ formOpen: true }, '', '#feedback');
        
        // Восстанавливаем сохраненные данные
        restoreFormData();
        
        // Фокусируемся на первом поле
        setTimeout(() => {
            feedbackFullName.focus();
        }, 300);
    }
    
    // Функция для закрытия формы
    function closeFeedbackForm() {
        if (!isFormOpen) return;
        
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = '';
        isFormOpen = false;
        
        // Скрываем попап после завершения анимации
        setTimeout(() => {
            feedbackPopup.style.display = 'none';
        }, 300);
        
        // Скрываем сообщение
        hideMessage();
        
        // Возвращаем URL к исходному состоянию
        if (window.location.hash === '#feedback') {
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
        
        setTimeout(() => {
            feedbackPopup.style.display = 'none';
        }, 300);
    }
    
    // Функция для сохранения данных формы в LocalStorage
    function saveFormData() {
        const formData = {
            fullName: feedbackFullName.value,
            email: feedbackEmail.value,
            phone: feedbackPhone.value,
            message: feedbackMessage.value,
            privacyPolicy: feedbackPrivacyPolicy.checked
        };
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
    }
    
    // Функция для восстановления данных формы из LocalStorage
    function restoreFormData() {
        const savedData = localStorage.getItem('feedbackFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                feedbackFullName.value = formData.fullName || '';
                feedbackEmail.value = formData.email || '';
                feedbackPhone.value = formData.phone || '';
                feedbackMessage.value = formData.message || '';
                feedbackPrivacyPolicy.checked = formData.privacyPolicy || false;
                
                // Валидируем восстановленные данные
                validateFormOnInput();
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
    
    // Функция для сброса формы
    function resetForm() {
        feedbackForm.reset();
        // Сбрасываем классы валидации
        const formFields = [feedbackFullName, feedbackEmail, feedbackPhone, feedbackMessage];
        formFields.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });
        feedbackPrivacyPolicy.classList.remove('is-invalid');
    }
    
    // Функция для отображения сообщения
    function showMessage(text, isSuccess) {
        formMessage.textContent = text;
        formMessage.className = isSuccess ? 'message success' : 'message error';
        formMessage.style.display = 'block';
        
        if (isSuccess) {
            // Автоматически скрываем сообщение об успехе через 3 секунды
            setTimeout(hideMessage, 3000);
        }
    }
    
    // Функция для скрытия сообщения
    function hideMessage() {
        formMessage.style.display = 'none';
    }
    
    // Функция для валидации при вводе
    function validateFormOnInput() {
        // Валидация ФИО
        if (feedbackFullName.value.trim()) {
            hideFieldError(feedbackFullName);
        }
        
        // Валидация email
        if (feedbackEmail.value && isValidEmail(feedbackEmail.value)) {
            hideFieldError(feedbackEmail);
        }
        
        // Валидация телефона
        if (feedbackPhone.value && isValidPhone(feedbackPhone.value)) {
            hideFieldError(feedbackPhone);
        }
        
        // Валидация сообщения
        if (feedbackMessage.value.trim() && feedbackMessage.value.trim().length >= 10) {
            hideFieldError(feedbackMessage);
        }
        
        // Валидация чекбокса
        if (feedbackPrivacyPolicy.checked) {
            hideFieldError(feedbackPrivacyPolicy);
        }
    }
    
    // Обработчик отправки формы
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидируем форму
        if (!validateForm()) {
            showMessage('Пожалуйста, исправьте ошибки в форме', false);
            return;
        }
        
        // Показываем индикатор загрузки
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Собираем данные формы
        const formData = new FormData(feedbackForm);
        const data = Object.fromEntries(formData);
        
        // Форматируем телефон перед отправкой
        if (data.phone) {
            data.phone = formatPhone(data.phone);
        }
        
        // Отправляем данные на сервер
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
            if (data.code === 200 || data.status === 'success') {
                showMessage('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.', true);
                // Очищаем данные формы и LocalStorage после успешной отправки
                setTimeout(() => {
                    resetForm();
                    clearFormData();
                }, 100);
            } else {
                throw new Error(data.message || 'Ошибка отправки формы');
            }
        })
        .catch(error => {
            showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз или свяжитесь с нами другим способом.', false);
        })
        .finally(() => {
            // Восстанавливаем кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Обработчики событий для элементов формы для сохранения данных и валидации
    const formInputs = [feedbackFullName, feedbackEmail, feedbackPhone, feedbackMessage, feedbackPrivacyPolicy];
    formInputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.addEventListener('change', function() {
                saveFormData();
                validateFormOnInput();
            });
        } else {
            input.addEventListener('input', function() {
                saveFormData();
                validateFormOnInput();
            });
        }
    });
    
    // Обработчики событий для кнопок открытия/закрытия
    openFeedbackBtn.addEventListener('click', openFeedbackForm);
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
        if (e.key === 'Escape' && isFormOpen) {
            closeFeedbackForm();
        }
    });
});
