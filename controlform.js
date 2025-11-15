 
        document.getElementById('userForm').addEventListener('submit', function(event) {
            const phoneInput = document.getElementById('phone');
            const phoneValue = phoneInput.value.trim();

            if (!phoneValue.startsWith('+7') || phoneValue.length !== 12) {
                event.preventDefault();
                alert('Телефон должен начинаться с +7 и содержать 10 цифр после него');
                phoneInput.focus();
                return false;
            }

            const digitOnly = phoneValue.substring(2);
            if (!/^\d{10}$/.test(digitOnly)) {
                event.preventDefault();
                alert('После +7 должны быть только цифры');
                phoneInput.focus();
                return false;
            }
        });
  