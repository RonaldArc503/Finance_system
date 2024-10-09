document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const sesionActive = localStorage.getItem('sesionActive');
    const logoutButton = document.getElementById('logoutButton');
    const loginButton = document.getElementById('loginButton');
    const logoutSection = document.getElementById('logoutSection');

    // Función para actualizar la interfaz según el estado de la sesión
    function updateUI() {
        if (loggedInUser && sesionActive) {
            if (logoutSection) {
                logoutSection.style.display = 'block'; // Mostrar cierre de sesión
            }
            if (logoutButton) {
                logoutButton.textContent = "Cerrar Sesión";
            }
            if (loginButton) {
                loginButton.style.display = 'none'; // Ocultar iniciar sesión
            }
        } else {
            if (loginButton) {
                loginButton.style.display = 'block'; // Mostrar iniciar sesión
            }
            if (logoutSection) {
                logoutSection.style.display = 'none'; // Ocultar cierre de sesión
            }
        }
    }

    // Actualizar la UI al cargar la página
    updateUI();

    // Manejar el evento de clic en el botón de cierre de sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('sesionActive');
            updateUI(); // Actualizar la UI después de cerrar sesión
            window.location.href = '/'; // Redirigir al inicio
        });
    }

    // Manejar el evento de clic en el botón de iniciar sesión
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '/login/login.html'; // Redirigir al login
        });
    }
});
