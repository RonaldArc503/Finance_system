// Elementos del DOM
const calendarEl = document.getElementById('calendar');
const selectedDateEl = document.getElementById('selected-date');
const noteEl = document.getElementById('note');
const savedNotesEl = document.getElementById('saved-notes');
const saveNoteBtn = document.getElementById('save-note');
const clearNoteBtn = document.getElementById('clear-note');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const noteColorInput = document.getElementById('note-color'); // Color picker for note color

// Obtener la fecha actual
const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

let selectedMonth = currentMonth; // Inicialmente el mes seleccionado es el actual
let selectedYear = currentYear;
let selectedDate = `${currentDay}-${selectedMonth + 1}-${selectedYear}`;

// Mostrar la fecha seleccionada inicialmente
selectedDateEl.textContent = selectedDate;

// Función para llenar el selector de años
function populateYearSelect() {
    for (let year = currentYear; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear; // Seleccionar el año actual por defecto
}

// Deshabilitar meses pasados
function disablePastMonths() {
    const monthOptions = monthSelect.querySelectorAll('option');
    monthOptions.forEach((option, index) => {
        if (selectedYear === currentYear && index < currentMonth) {
            option.disabled = true; // Desactivar meses anteriores en el año actual
        } else {
            option.disabled = false; // Activar meses si estamos en un año futuro
        }
    });
}

// Seleccionar una fecha
function selectDate(day) {
    selectedDate = `${day}-${selectedMonth + 1}-${selectedYear}`;
    loadNoteForDate(selectedDate); // Cargar la nota para la fecha seleccionada
    selectedDateEl.textContent = `Fecha: ${selectedDate}`; // Mostrar la fecha seleccionada
}

// Guardar la nota con color desde el selector de color
saveNoteBtn.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    const noteColor = noteColorInput.value; // Obtener el color seleccionado
    const noteDescription = noteEl.value;

    // Solo guardar si hay una descripción de nota
    if (noteDescription) {
        notes[selectedDate] = { color: noteColor, description: noteDescription };
        localStorage.setItem('notes', JSON.stringify(notes));
        noteEl.value = ''; // Limpiar el campo de texto de la nota

        // Actualizar el calendario y mostrar notas guardadas
        generateCalendar(selectedMonth, selectedYear);
        displaySavedNotes();
    } else {
        alert('Por favor, ingrese una nota antes de guardar.');
    }
});

// Cargar notas de la fecha seleccionada
function loadNoteForDate(date) {
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    if (notes[date]) {
        noteEl.value = notes[date].description;
        noteColorInput.value = notes[date].color; // Set color picker to the saved note color
    } else {
        noteEl.value = '';
        noteColorInput.value = '#ff0000'; // Reset to default color
    }
    displaySavedNotes();
}

// Generar el calendario con notas de diferentes colores
function generateCalendar(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarEl.innerHTML = ''; // Limpiar el calendario antes de generarlo

    const notes = JSON.parse(localStorage.getItem('notes')) || {}; // Obtener notas guardadas

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.textContent = day;

        const dateKey = `${day}-${month + 1}-${year}`; // Crear la clave de fecha

        const isPast = year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && day < currentDay);

        if (isPast) {
            dayEl.style.color = '#707070'; // Mostrar fechas pasadas en gris
        } else {
            dayEl.addEventListener('click', () => selectDate(day));
        }

        // Verificar si hay una nota para el día actual y agregar una nota coloreada
        if (notes[dateKey]) {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note');
            noteDiv.style.backgroundColor = notes[dateKey].color; // Establecer el color de fondo según la nota
            noteDiv.textContent = `${notes[dateKey].description} (${day})`; // Mostrar la descripción de la nota con el día
            dayEl.appendChild(noteDiv); // Adjuntar la nota al elemento del día
        }

        calendarEl.appendChild(dayEl);
    }
}

// Limpiar la nota de la fecha seleccionada
clearNoteBtn.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    delete notes[selectedDate];
    localStorage.setItem('notes', JSON.stringify(notes));
    noteEl.value = '';
   // alert('Nota eliminada.');

    // Actualizar el calendario y mostrar notas guardadas
    generateCalendar(selectedMonth, selectedYear);
    displaySavedNotes();
});

// Mostrar las notas guardadas
function displaySavedNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || {};
    savedNotesEl.innerHTML = ''; // Limpiar el contenedor de notas guardadas
    for (const date in notes) {
        const noteItem = document.createElement('div');
        noteItem.innerHTML = `${date}: <span style="color: ${notes[date].color};">${notes[date].description}</span>`; // Mostrar la descripción de la nota con el color correspondiente
        savedNotesEl.appendChild(noteItem);
    }
}

// Actualizar el calendario cuando se cambia el mes o el año
monthSelect.addEventListener('change', (e) => {
    selectedMonth = parseInt(e.target.value);
    generateCalendar(selectedMonth, selectedYear);
});

yearSelect.addEventListener('change', (e) => {
    selectedYear = parseInt(e.target.value);
    disablePastMonths(); // Deshabilitar meses pasados al cambiar el año
    generateCalendar(selectedMonth, selectedYear);
});

// Inicializar la página
populateYearSelect(); // Llenar el selector de años
disablePastMonths(); // Deshabilitar meses pasados al cargar la página

// Establecer el mes actual como el mes seleccionado
monthSelect.value = currentMonth; // Mostrar el mes actual en el selector

generateCalendar(selectedMonth, selectedYear); // Generar el calendario con el mes y año actuales
displaySavedNotes(); // Mostrar las notas guardadas
