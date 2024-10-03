
    document.addEventListener("DOMContentLoaded", function () {
        const toggleButton = document.getElementById("theme-toggle");
        const body = document.body;

        // Verificar si hay una preferencia guardada en localStorage
        const savedTheme = localStorage.getItem("theme");

        if (savedTheme === "dark") {
            body.classList.add("dark-theme");
            toggleButton.textContent = "Tema Claro"; // Cambia el texto del botón
        } else {
            toggleButton.textContent = "Tema Oscuro";
        }

        // Alternar entre temas al hacer clic en el botón
        toggleButton.addEventListener("click", function () {
            body.classList.toggle("dark-theme");

            // Guardar la preferencia en localStorage
            if (body.classList.contains("dark-theme")) {
                localStorage.setItem("theme", "dark");
                toggleButton.textContent = "Tema Claro";
            } else {
                localStorage.setItem("theme", "light");
                toggleButton.textContent = "Tema Oscuro";
            }
        });
    });

