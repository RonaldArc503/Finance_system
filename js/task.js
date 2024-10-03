document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector(".task-input");
    const addBtn = document.querySelector(".btn-add-task");
    const ul = document.querySelector(".task-list");
    const empty = document.querySelector(".empty");

    // Función para cargar tareas desde localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => {
            const li = document.createElement("li");
            li.className = "lista";
            const p = document.createElement("p");
            p.textContent = task;

            li.appendChild(p);
            li.appendChild(addDeleteBtn()); 
            ul.appendChild(li);
        });

        if (tasks.length > 0) {
            empty.style.display = "none"; // Si hay tareas, oculta el mensaje "No tienes tareas"
        }
    }

    // Cargar tareas cuando la página se carga
    loadTasks();

    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const text = input.value.trim();

        if (text !== "") {
            const li = document.createElement("li");
            li.className = "lista";
            const p = document.createElement("p");
            p.textContent = text;

            li.appendChild(p);
            li.appendChild(addDeleteBtn());
            ul.appendChild(li);

            input.value = "";
            empty.style.display = "none";

            // Guardar la tarea en localStorage
            saveTask(text);
        }
    });

    // Función para añadir el botón de eliminar
    function addDeleteBtn() {
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.className = "btn-delete";

        deleteBtn.addEventListener("click", (e) => {
            const item = e.target.parentElement;
            ul.removeChild(item);

            // Actualizar las tareas en localStorage después de eliminar
            removeTask(item.querySelector("p").textContent);

            const items = document.querySelectorAll(".task-list li");
            if (items.length === 0) {
                empty.style.display = "block";
            }
        });

        return deleteBtn;
    }

    // Función para guardar tareas en localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Función para eliminar tareas de localStorage
    function removeTask(taskText) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter((task) => task !== taskText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
