document.addEventListener("DOMContentLoaded", function() {
    const decryptButton = document.getElementById('decryptPasswords');
    const saveButton = document.getElementById('savePassword');
    const messageElement = document.getElementById('passwordMessage');

    // Desencriptar contraseñas
    decryptButton.addEventListener('click', function() {
        const passwordInput = document.getElementById('passwordInput').value.trim();
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        messageElement.innerHTML = '';

        if (passwordInput === '') {
            messageElement.innerHTML = 'Por favor, ingrese la contraseña.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
        const user = users.find(user => user.password === hashedPassword);
       
        if (user) {
            passwordList.forEach(({ emailOrUsername, encryptedPassword }, index) => {
                const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'mi_clave_secreta').toString(CryptoJS.enc.Utf8);
                const decryptedEmailOrUsername = CryptoJS.AES.decrypt(emailOrUsername, 'mi_clave_secreta').toString(CryptoJS.enc.Utf8);
                const li = document.createElement('li');
                li.innerHTML = `<p>${decryptedEmailOrUsername}: ${decryptedPassword}</p>`;
                messageElement.appendChild(li);
            });
        } else {
            messageElement.innerHTML = 'Contraseña incorrecta.';
        }
        displayPasswords();
    });

    // Guardar contraseñas
    saveButton.addEventListener('click', function() {
        const emailOrUsername = document.getElementById('emailOrUsername').value.trim(); // Obtener correo o usuario
        const newPassword = document.getElementById('newPassword').value.trim();

        messageElement.innerHTML = '';

        if (emailOrUsername === '' || newPassword === '') {
          
            return;
        }

        const encryptedEmailOrUsername = CryptoJS.AES.encrypt(emailOrUsername, 'mi_clave_secreta').toString(); // Encriptar correo o usuario
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword, 'mi_clave_secreta').toString();

        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        
        // Guardar el correo o usuario encriptado junto con la contraseña
        passwordList.push({ emailOrUsername: encryptedEmailOrUsername, encryptedPassword });
        localStorage.setItem('claves_crip', JSON.stringify(passwordList));

        messageElement.innerHTML = 'Contraseña guardada con éxito.';
        displayPasswords();
        document.getElementById('newPassword').value = '';
        document.getElementById('emailOrUsername').value = ''; // Limpiar el campo de correo o usuario
    });

    // Función para mostrar contraseñas guardadas
    function displayPasswords() {
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        const passwordListElement = document.getElementById('password-list');
        passwordListElement.innerHTML = '';

        passwordList.forEach(({ emailOrUsername, encryptedPassword }, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<p>${emailOrUsername}: ${encryptedPassword}</p>`;
            
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.className = 'btn btn-danger btn-sm ml-2';
            deleteButton.addEventListener('click', function() {
                deletePassword(index);
            });

            li.appendChild(deleteButton);
            passwordListElement.appendChild(li);
        });
    }

    // Función para eliminar una contraseña
    function deletePassword(index) {
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        passwordList.splice(index, 1);
        localStorage.setItem('claves_crip', JSON.stringify(passwordList));
        displayPasswords();
    }

    // Mostrar contraseñas guardadas al cargar la página
    displayPasswords();
});
