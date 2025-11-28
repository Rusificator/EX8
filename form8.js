document.addEventListener('DOMContentLoaded', function() {
    //  DOM
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('feedbackFormMessage');
    
    // Элементы формы 
    const feedbackFullName = document.getElementById('feedbackFullName');
    const feedbackEmail = document.getElementById('feedbackEmail');
    const feedbackPhone = document.getElementById('feedbackPhone');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const feedbackPrivacyPolicy = document.getElementById('feedbackPrivacyPolicy');
    
    // UR
    const FORM_SUBMISSION_URL = 'https://formcarry.com/s/_na1c8kkBc4';
    
    // Флаг для состояния
    let isFormOpen = false;

    //  валидация формы
    function validateForm() {
        let isValid = true;
        
        //  ФИО
        if (!feedbackFullName.value.trim()) {
            showFieldError(feedbackFullName, 'Пожалуйста, введите ваше ФИО');
            isValid = false;
        } else {
            hideFieldError(feedbackFullName);
        }
        
        //  email
        if (!feedbackEmail.value || !isValidEmail(feedbackEmail.value)) {
            showFieldError(feedbackEmail, 'Пожалуйста, введите корректный email');
            isValid = false;
        } else {
            hideFieldError(feedbackEmail);
        }
        
        //  телефон
        if (!feedbackPhone.value || !isValidPhone(feedbackPhone.value)) {
            showFieldError(feedbackPhone, 'Пожалуйста, введите корректный номер телефона');
            isValid = false;
        } else {
            hideFieldError(feedbackPhone);
        }
        
        // сообщение
        if (!feedbackMessage.value.trim() || feedbackMessage.value.trim().length < 10) {
            showFieldError(feedbackMessage, 'Сообщение должно содержать минимум 10 символов');
            isValid = false;
        } else {
            hideFieldError(feedbackMessage);
        }
        
        //  чекбокс
        if (!feedbackPrivacyPolicy.checked) {
            showFieldError(feedbackPrivacyPolicy, 'Необходимо принять условия соглашения');
            isValid = false;
        } else {
            hideFieldError(feedbackPrivacyPolicy);
        }
        
        return isValid;
    }
    
    //  проверка email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    //  проверка телефона
    function isValidPhone(phone) {
        const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
        return phoneRegex.test(phone);
    }
    
    //  показ ошибк
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        //  создаем элемент для  ошибки
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    //  скрытие ошибки
    function hideFieldError(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    //  формат телефона
    function formatPhone(phone) {
        return phone.replace(/[^\d+]/g, '');
    }
    
    // открытие формы
    function openFeedbackForm() {
        if (isFormOpen) return;
        
        //  попап
        feedbackPopup.style.display = 'flex';
        
        // Запуск анимации 
        setTimeout(() => {
            feedbackPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            isFormOpen = true;
        }, 10);
        
        //  History API
        history.pushState({ formOpen: true }, '', '#feedback');
        
        // Восстанавливаем данные
        restoreFormData();
        
        // Фокус на первом поле
        setTimeout(() => {
            feedbackFullName.focus();
        }, 300);
    }
    
    // закрытие формы
    function closeFeedbackForm() {
        if (!isFormOpen) return;
        
        feedbackPopup.classList.remove('active');
        document.body.style.overflow = '';
        isFormOpen = false;
        
        // Скрываем попап после  анимации
        setTimeout(() => {
            feedbackPopup.style.display = 'none';
        }, 300);
        
        // Скрываем сообщение
        hideMessage();
        
        // Возвращаем URL к исходному
        if (window.location.hash === '#feedback') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }
    
    //  для закрытия формы (назад)
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
    
    //  сохранение данных формы в LocalStorage
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
    
    // восстановление данных формы из LocalStorage
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
                
                // Валид восстановленные данные
                validateFormOnInput();
            } catch (e) {
                console.error('Ошибка при восстановлении данных:', e);
                localStorage.removeItem('feedbackFormData');
            }
        }
    }
    
    // очистка данных в LocalStorage
    function clearFormData() {
        localStorage.removeItem('feedbackFormData');
    }
    
    //  сброс формы
    function resetForm() {
        feedbackForm.reset();
        // Сброс классов валидации
        const formFields = [feedbackFullName, feedbackEmail, feedbackPhone, feedbackMessage];
        formFields.forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });
        feedbackPrivacyPolicy.classList.remove('is-invalid');
    }
    
    //  отображение сообщения
    function showMessage(text, isSuccess) {
        formMessage.textContent = text;
        formMessage.className = isSuccess ? 'message success' : 'message error';
        formMessage.style.display = 'block';
        
        if (isSuccess) {
            // Авто скрываем сообщение об успехе через 3 секунды
            setTimeout(hideMessage, 3000);
        }
    }
    
    //  скрытие сообщения
    function hideMessage() {
        formMessage.style.display = 'none';
    }
    
    // валидации при вводе
    function validateFormOnInput() {
        // Вал ФИО
        if (feedbackFullName.value.trim()) {
            hideFieldError(feedbackFullName);
        }
        
        // Вал email
        if (feedbackEmail.value && isValidEmail(feedbackEmail.value)) {
            hideFieldError(feedbackEmail);
        }
        
        // Вал телефон
        if (feedbackPhone.value && isValidPhone(feedbackPhone.value)) {
            hideFieldError(feedbackPhone);
        }
        
        // Вал сообщение
        if (feedbackMessage.value.trim() && feedbackMessage.value.trim().length >= 10) {
            hideFieldError(feedbackMessage);
        }
        
        // Вал чекбокс
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
        
        // индикатор 
        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Сбоо данных формы
        const formData = new FormData(feedbackForm);
        const data = Object.fromEntries(formData);
        
        // Формат телефона перед отправкой
        if (data.phone) {
            data.phone = formatPhone(data.phone);
        }
        
        // Отправка данных на сервер
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
                // Очистка  формы и LocalStorage после успеха
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
            // Восстанавить кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
    
    // Обработчики событий  формы для сохранения данных и валидации
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
    
    // Обработчики событий  кнопок открытия/закрытия
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
    
    // Проверка hash при загрузке страницы
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



