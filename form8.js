document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const openFeedbackBtn = document.getElementById('openFeedbackBtn');
    const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
    const feedbackPopup = document.getElementById('feedbackPopup');
    const feedbackForm = document.getElementById('feedbackForm');
    const formMessage = document.getElementById('feedback-formMessage');
    const feedbackPhone = document.getElementById('feedback-phone');
    
    // URL для отправки формы
    const FORM_SUBMISSION_URL = 'https://formcarry.com/s/_na1c8kkBc4';
    
    // Флаг для отслеживания состояния формы
    let isFormOpen = false;
    let isInitialLoad = true;
    
    // Функция для валидации телефона
    function validatePhone(phone) {
        // Разрешаем форматы: +7XXXXXXXXXX, 8XXXXXXXXXX, +375XXXXXXXXX, и другие международные форматы
        const phoneRegex = /^(\+7|8|\+?\d{1,3})?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
        return phoneRegex.test(phone);
    }
    
    // Функция для форматирования телефона
    function formatPhone(phone) {
        // Удаляем все нецифровые символы кроме +
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        // Если номер начинается с 8, заменяем на +7
        if (cleaned.startsWith('8') && cleaned.length === 11) {
            cleaned = '+7' + cleaned.slice(1);
        }
        // Если номер начинается с 7 и нет +, добавляем +
        else if (cleaned.startsWith('7') && cleaned.length === 11 && !cleaned.startsWith('+7')) {
            cleaned = '+7' + cleaned.slice(1);
        }
        // Если номер без кода страны, добавляем +7
        else if (cleaned.length === 10 && !cleaned.startsWith('+')) {
            cleaned = '+7' + cleaned;
        }
        
        return cleaned;
    }
    
    // Функция для показа ошибки телефона
    function showPhoneError(message) {
        feedbackPhone.classList.add('is-invalid');
        const errorDiv = feedbackPhone.parentNode.querySelector('.phone-error') || 
                        document.createElement('div');
        errorDiv.className = 'phone-error text-danger mt-1 small';
        errorDiv.textContent = message;
        if (!feedbackPhone.parentNode.querySelector('.phone-error')) {
            feedbackPhone.parentNode.appendChild(errorDiv);
        }
    }
    
    // Функция для скрытия ошибки телефона
    function hidePhoneError() {
        feedbackPhone.classList.remove('is-invalid');
        feedbackPhone.classList.add('is-valid');
        const errorDiv = feedbackPhone.parentNode.querySelector('.phone-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Обработчик ввода телефона
    feedbackPhone.addEventListener('input', function(e) {
        const phone = e.target.value;
        
        if (phone === '') {
            feedbackPhone.classList.remove('is-invalid', 'is-valid');
            const errorDiv = feedbackPhone.parentNode.querySelector('.phone-error');
            if (errorDiv) errorDiv.remove();
            return;
        }
        
        if (validatePhone(phone)) {
            hidePhoneError();
            // Автоформатирование при вводе
            const formatted = formatPhone(phone);
            if (formatted !== phone) {
                e.target.value = formatted;
            }
        } else {
            showPhoneError('Введите корректный номер телефона');
        }
    });
    
    // Функция для открытия формы с анимацией
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
        
        // Изменяем URL с помощью History API только если это не начальная загрузка
        if (!isInitialLoad) {
            history.pushState({ formOpen: true }, '', '#feedback');
        }
        isInitialLoad = false;
        
        // Восстанавливаем сохраненные данные
        restoreFormData();
    }
    
    // Функция для закрытия формы с анимацией
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
        
        // Если URL содержит #feedback, убираем его
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
        // Сбрасываем классы валидации телефона
        feedbackPhone.classList.remove('is-invalid', 'is-valid');
        const errorDiv = feedbackPhone.parentNode.querySelector('.phone-error');
        if (errorDiv) errorDiv.remove();
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
        
        // Валидация телефона перед отправкой
        const phone = feedbackPhone.value;
        if (phone && !validatePhone(phone)) {
            showPhoneError('Пожалуйста, введите корректный номер телефона');
            feedbackPhone.focus();
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
    
    // Обработчик для чекбокса
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
          
