document.addEventListener("DOMContentLoaded", function() {
    const decryptButton = document.getElementById('decryptPasswords');
    const saveButton = document.getElementById('savePassword');
    const messageElement = document.getElementById('passwordMessage');

    // Desencriptar contraseñas
    decryptButton.addEventListener('click', function() {
        const passwordInput = document.getElementById('passwordInput').value.trim(); // Eliminar espacios en blanco
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        messageElement.innerHTML = ''; // Limpiar mensajes anteriores

        // Verificar que la entrada de contraseña no esté vacía
        if (passwordInput === '') {
            messageElement.innerHTML = 'Por favor, ingrese la contraseña.'; // Mensaje para contraseña vacía
            return; // Salir de la función si está vacío
        }

        // Verificar la contraseña de usuario
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
        const user = users.find(user => user.password === hashedPassword);
       
        if (user) {
            passwordList.forEach((encryptedPassword, index) => {
                const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, 'mi_clave_secreta').toString(CryptoJS.enc.Utf8);
                const li = document.createElement('li');
                li.innerHTML = `<p>Contraseña ${index + 1}: ${decryptedPassword}</p>`; // Usar un párrafo para mostrar la contraseña
                messageElement.appendChild(li); // Solo muestra las contraseñas desencriptadas
            });
        } else {
            messageElement.innerHTML = 'Contraseña incorrecta.'; // Mensaje para contraseña incorrecta
        }
        displayPasswords(); // Actualizar la visualización
    });

    // Guardar contraseñas
    saveButton.addEventListener('click', function() {
        const newPassword = document.getElementById('newPassword').value.trim(); // Eliminar espacios en blanco

        // Limpiar mensajes anteriores
        messageElement.innerHTML = '';

        // Validar que la nueva contraseña no esté vacía
        if (newPassword === '') {
            messageElement.innerHTML = 'Por favor, ingrese la contraseña.'; // Mostrar el mensaje para claves vacías
            return; // Salir de la función si está vacío
        }

        // Si se ingresó una contraseña válida, continuar con el guardado
        const encryptedPassword = CryptoJS.AES.encrypt(newPassword, 'mi_clave_secreta').toString();

        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        passwordList.push(encryptedPassword);
        localStorage.setItem('claves_crip', JSON.stringify(passwordList));

        messageElement.innerHTML = 'Contraseña guardada con éxito.'; // Mensaje de éxito al guardar

        displayPasswords();
        document.getElementById('newPassword').value = ''; // Limpiar el campo
    });

    // Función para mostrar contraseñas guardadas
    function displayPasswords() {
        const passwordList = JSON.parse(localStorage.getItem('claves_crip')) || [];
        const passwordListElement = document.getElementById('password-list');
        passwordListElement.innerHTML = ''; // Limpiar la lista

        passwordList.forEach((encryptedPassword, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<p>Contraseña ${index + 1}: ${encryptedPassword}</p>`; // Usar un párrafo para mostrar la contraseña
            
            // Agregar ícono de eliminar
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Ícono de papelera
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
