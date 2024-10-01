document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('decryptPasswords').addEventListener('click', function() {
        const passwordInput = document.getElementById('passwordInput').value;
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        const messageElement = document.getElementById('passwordMessage');
        messageElement.innerHTML = ''; // Limpiar mensajes anteriores

        // Verificar la contraseña de usuario
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
        const user = users.find(user => user.password === hashedPassword);

        if (user) {
            passwordList.forEach((encryptedPassword, index) => {
                const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'mi_clave_secreta').toString(CryptoJS.enc.Utf8);
                const li = document.createElement('li');
                li.textContent = `Contraseña ${index + 1}: ${decryptedPassword}`;

                // Agregar botón de eliminar
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Eliminar';
                deleteButton.className = 'btn btn-danger btn-sm ml-2';
                deleteButton.addEventListener('click', function() {
                    deletePassword(index);
                });

                li.appendChild(deleteButton);
                messageElement.appendChild(li);
            });
        } else {
            messageElement.innerHTML = 'Contraseña incorrecta.';
        }
    });

    document.getElementById('savePassword').addEventListener('click', function() {
        const newPassword = document.getElementById('newPassword').value;
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword, 'mi_clave_secreta').toString();

        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        passwordList.push(encryptedPassword);
        localStorage.setItem('claves_crip', JSON.stringify(passwordList));

        displayPasswords();
        document.getElementById('newPassword').value = ''; // Limpiar el campo
    });

    // Función para mostrar contraseñas
    function displayPasswords() {
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        const passwordListElement = document.getElementById('password-list');
        passwordListElement.innerHTML = ''; // Limpiar la lista

        passwordList.forEach((encryptedPassword, index) => {
            const li = document.createElement('li');
            li.textContent = `Contraseña ${index + 1}: ${encryptedPassword}`;
            
            // Agregar botón de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
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
        passwordList.splice(index, 1); // Eliminar la contraseña en el índice especificado
        localStorage.setItem('claves_crip', JSON.stringify(passwordList)); // Guardar la lista actualizada
        displayPasswords(); // Actualizar la visualización
    }

    // Mostrar contraseñas guardadas al cargar la página
    displayPasswords();
});
