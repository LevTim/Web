let currentDate = null;
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let notes = JSON.parse(localStorage.getItem(`notes_${currentUser?.username}`)) || {};

function updateSeasonalTheme(month) {
    const seasonColors = ["#f0f8ff", "#f0f8ff", "#dfffd6", "#dfffd6", "#dfffd6", "#fff5cc", "#fff5cc", "#fff5cc", "#ffd699", "#ffcc99", "#ff9966", "#f0f8ff"];
    document.body.style.backgroundColor = seasonColors[month];
}

function generateCalendar() {
    const year = parseInt(document.getElementById("year").value, 10);
    const month = parseInt(document.getElementById("month").value, 10);
    const view = document.getElementById("view").value;
    const container = document.getElementById("calendar-container");
    container.innerHTML = "";
    updateSeasonalTheme(month);

    const monthNames = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        daysInMonth[1] = 29;
    }

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        container.classList.add("single-month-view");
        container.style.display = "block";
        createMonthView(container, monthNames, daysInMonth, month, year);
    } else {
        container.classList.remove("single-month-view");
        container.style.display = "grid";
        if (view === "all") {
            for (let i = 0; i < 12; i++) {
                createMonthView(container, monthNames, daysInMonth, i, year);
            }
        } else {
            createMonthView(container, monthNames, daysInMonth, month, year);
        }
    }
}

function createMonthView(container, monthNames, daysInMonth, month, year) {
    let div = document.createElement("div");
    div.classList.add("calendar");
    div.innerHTML = `<h2>${monthNames[month]} ${year}</h2>`;

    let daysGrid = document.createElement("div");
    daysGrid.classList.add("days");

    const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    weekdays.forEach(day => {
        let dayElem = document.createElement("div");
        dayElem.classList.add("weekday");
        dayElem.textContent = day;
        daysGrid.appendChild(dayElem);
    });

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < firstDay; i++) {
        let emptyElem = document.createElement("div");
        daysGrid.appendChild(emptyElem);
    }

    for (let day = 1; day <= daysInMonth[month]; day++) {
        let dayElem = document.createElement("div");
        dayElem.classList.add("day");
        dayElem.textContent = day;

        const noteKey = `${year}-${month + 1}-${day}`;
        if (notes[noteKey]) {
            dayElem.classList.add("has-note");
        }

        dayElem.addEventListener("click", () => openNoteModal(year, month, day));
        daysGrid.appendChild(dayElem);
    }

    div.appendChild(daysGrid);
    container.appendChild(div);
}

function openNoteModal(year, month, day) {
    currentDate = { year, month, day };
    const noteKey = `${year}-${month + 1}-${day}`;
    const note = notes[noteKey] || { text: '', timestamp: '' };
    document.getElementById("note-text").value = note.text;
    document.getElementById("note-timestamp").textContent = note.timestamp ? `Створено: ${note.timestamp}` : '';
    document.getElementById("note-modal").style.display = 'block';
}

function saveNote() {
    if (!currentDate) return;
    const noteText = document.getElementById("note-text").value.trim();
    const noteKey = `${currentDate.year}-${currentDate.month + 1}-${currentDate.day}`;

    if (noteText === "") {
        delete notes[noteKey];
    } else {
        const timestamp = new Date().toLocaleString('uk-UA');
        notes[noteKey] = { text: noteText, timestamp: timestamp };
    }

    localStorage.setItem(`notes_${currentUser.username}`, JSON.stringify(notes));
    generateCalendar();
    closeNoteModal();
}

function closeNoteModal() {
    document.getElementById("note-modal").style.display = 'none';
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = 'auth.html';
}

document.getElementById("save-note").addEventListener("click", saveNote);
document.getElementById("close-btn").addEventListener("click", closeNoteModal);

window.addEventListener("load", () => {
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    const yearSelect = document.getElementById("year");
    const monthSelect = document.getElementById("month");
    const viewSelect = document.getElementById("view");

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    for (let i = 0; i < 12; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"][i];
        monthSelect.appendChild(option);
    }
    monthSelect.value = new Date().getMonth();

    generateCalendar();

    yearSelect.addEventListener("change", generateCalendar);
    monthSelect.addEventListener("change", generateCalendar);
    viewSelect.addEventListener("change", generateCalendar);
});