document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar el registro
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const email = document.getElementById('reg_mail').value;
        const password = document.getElementById('reg_password').value;

        // Hash de la contraseña
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Guardar en localStorage
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ email, password: hashedPassword });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! You can now log in.');
        document.getElementById('registerForm').reset();
        toggleForms(); // Volver al formulario de login
    });

    // Función para manejar el inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const email = document.getElementById('mail').value;
        const password = document.getElementById('password').value;

        // Hash de la contraseña ingresada
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el usuario existe
        const user = users.find(user => user.email === email && user.password === hashedPassword);
        if (user) {
          
            // Redirigir a index.html
            window.location.href = '/';
        } else {
            alert('Invalid email or password.');
        }
    });

    // Función para alternar entre formularios de registro y login
    function toggleForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
        registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
    }

    document.getElementById('showRegister').addEventListener('click', function() {
        toggleForms();
    });

    document.getElementById('showLogin').addEventListener('click', function() {
        toggleForms();
    });
});
