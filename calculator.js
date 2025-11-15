// Функционал калькулятора стоимости услуги
(function() {
    'use strict';
    
    // Цены для разных типов услуг
    const servicePrices = {
        'basic': 1000,
        'standard': 2000,
        'premium': 5000
    };

    // Элементы DOM
    const serviceTypeRadios = document.querySelectorAll('.service-type');
    const quantityInput = document.getElementById('quantityInput');
    const optionsSection = document.getElementById('optionsSection');
    const optionsSelect = document.getElementById('optionsSelect');
    const propertiesSection = document.getElementById('propertiesSection');
    const propertyCheckbox = document.getElementById('propertyCheckbox');
    const totalCostSpan = document.getElementById('totalCost');
    const orderForm = document.getElementById('orderForm');

    // Инициализация калькулятора
    function initCalculator() {
        // Обработчики событий для пересчета стоимости
        serviceTypeRadios.forEach(radio => {
            radio.addEventListener('change', handleServiceTypeChange);
        });
        
        quantityInput.addEventListener('input', calculateTotal);
        optionsSelect.addEventListener('change', calculateTotal);
        propertyCheckbox.addEventListener('change', calculateTotal);
        
        // Первоначальный расчет
        handleServiceTypeChange();
        calculateTotal();
    }

    // Обработчик изменения типа услуги
    function handleServiceTypeChange() {
        const selectedService = document.querySelector('input[name="serviceType"]:checked').value;
        
        // Скрываем все дополнительные секции
        optionsSection.style.display = 'none';
        propertiesSection.style.display = 'none';
        
        // Показываем соответствующие секции в зависимости от типа услуги
        switch(selectedService) {
            case 'standard':
                optionsSection.style.display = 'block';
                break;
            case 'premium':
                propertiesSection.style.display = 'block';
                break;
            // Для 'basic' ничего не показываем
        }
        
        calculateTotal();
    }

    // Функция расчета общей стоимости
    function calculateTotal() {
        const selectedService = document.querySelector('input[name="serviceType"]:checked').value;
        const quantity = parseInt(quantityInput.value) || 0;
        
        let total = servicePrices[selectedService] * quantity;
        
        // Добавляем стоимость опции для стандартной услуги
        if (selectedService === 'standard' && optionsSection.style.display === 'block') {
            const optionPrice = parseInt(optionsSelect.value) || 0;
            total += optionPrice * quantity;
        }
        
        // Добавляем стоимость свойства для премиум услуги
        if (selectedService === 'premium' && propertiesSection.style.display === 'block' && propertyCheckbox.checked) {
            total += 1000 * quantity;
        }
        
        totalCostSpan.textContent = total.toLocaleString('ru-RU');
    }

    // Инициализация валидации формы
    function initValidation() {
        orderForm.addEventListener('submit', event => {
            if (!orderForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                calculateTotal();
            }
            orderForm.classList.add('was-validated');
        }, false);
    }

    // Запуск при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        initCalculator();
        initValidation();
    });

})();