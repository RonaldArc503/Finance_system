document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si ya hay usuarios registrados
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Deshabilitar el botón de registro si ya hay un usuario registrado
    const registerButton = document.querySelector('#registerForm button[type="submit"]');
    if (users.length > 0) {
        registerButton.disabled = true; // Deshabilitar el botón
        registerButton.textContent = "Ya registrado"; // Cambiar el texto del botón
    }

    // Función para manejar el registro
    document.getElementById('registerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const username = document.getElementById('reg_username').value; // Capturar el nombre de usuario
        const email = document.getElementById('reg_mail').value;
        const password = document.getElementById('reg_password').value;

        // Hash de la contraseña
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Guardar en localStorage
        users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Verificar si el usuario ya existe
        const existingUser = users.find(user => user.email === email || user.username === username);
        if (existingUser) {
            alert('Ya existe un usuario o email registrado.');
            return; // Salir si el usuario ya existe
        }

        // Agregar usuario si no existe
        users.push({ username, email, password: hashedPassword });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registro exitoso');
        document.getElementById('registerForm').reset();
        registerButton.disabled = true; // Deshabilitar el botón después del registro
        registerButton.textContent = "Ya registrado"; // Cambiar el texto del botón
    });

    // Función para manejar el inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío del formulario

        const username = document.getElementById('username').value; // Capturar el nombre de usuario
        const password = document.getElementById('password').value;

        // Hash de la contraseña ingresada
        const hashedPassword = CryptoJS.SHA256(password).toString();
        users = JSON.parse(localStorage.getItem('users')) || [];

        // Verificar si el usuario existe
        const user = users.find(user => 
            user.username === username && user.password === hashedPassword
        );
        if (user) {
            // Guardar información del usuario en localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            localStorage.setItem('sesionActive', true); // Marcar sesión activa
            // Redirigir a index.html
            window.location.href = '/';
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });
});
