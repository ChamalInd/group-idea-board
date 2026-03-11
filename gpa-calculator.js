// ========================================
// GPA CALCULATOR FUNCTIONS
// ========================================

// Grade to GPA point conversion
const gradeToGPA = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
};

// Function to save courses to localStorage
function saveCourses() {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');
    const courses = [];

    rows.forEach(row => {
        const name = row.cells[0].querySelector('input').value;
        const credits = row.cells[1].querySelector('input').value;
        const grade = row.cells[2].querySelector('select').value;
        courses.push({ name, credits, grade });
    });

    localStorage.setItem('gpaCourses', JSON.stringify(courses));
}

// Function to load courses from localStorage
function loadCourses() {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return;

    const savedCourses = JSON.parse(localStorage.getItem('gpaCourses'));
    
    if (savedCourses && savedCourses.length > 0) {
        tableBody.innerHTML = ''; // Clear existing rows
        savedCourses.forEach(course => {
            addCourseRow(course.name, course.credits, course.grade);
        });
        calculateGPA(); // Recalculate if there's data
    } else {
        addCourseRow(); // Add one empty row if no data
    }
}

// Function to add a course row
function addCourseRow(name = '', credits = '3', grade = '') {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return;

    const newRow = tableBody.insertRow();

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter course name';
    nameInput.value = name;
    nameInput.required = true;
    nameInput.oninput = saveCourses;
    newRow.insertCell(0).appendChild(nameInput);

    const creditsInput = document.createElement('input');
    creditsInput.type = 'number';
    creditsInput.placeholder = 'Credits';
    creditsInput.min = '1';
    creditsInput.max = '6';
    creditsInput.value = credits;
    creditsInput.required = true;
    creditsInput.oninput = saveCourses;
    newRow.insertCell(1).appendChild(creditsInput);

    const gradeSelect = document.createElement('select');
    gradeSelect.required = true;
    gradeSelect.onchange = () => {
        saveCourses();
        calculateGPA();
    };
    
    const grades = ['', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
    grades.forEach(g => {
        const option = document.createElement('option');
        option.value = g;
        option.textContent = g === '' ? 'Select Grade' : `${g} (${gradeToGPA[g].toFixed(1)})`;
        if (g === grade) option.selected = true;
        gradeSelect.appendChild(option);
    });
    newRow.insertCell(2).appendChild(gradeSelect);

    const actionCell = newRow.insertCell(3);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'gpa-remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = function() {
        removeCourseRow(this);
    };
    actionCell.appendChild(removeBtn);

    saveCourses();
}

// Function to remove a course row
function removeCourseRow(btn) {
    if (confirm('Are you sure you want to remove this course?')) {
        btn.parentElement.parentElement.remove();
        saveCourses();
        calculateGPA();
    }
}

// Function to calculate GPA
function calculateGPA() {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    let totalCredits = 0;
    let totalPoints = 0;
    let validRows = 0;

    for (let row of rows) {
        const credits = parseFloat(row.cells[1].querySelector('input').value);
        const grade = row.cells[2].querySelector('select').value;

        if (!isNaN(credits) && credits > 0 && grade) {
            const gpaPoints = gradeToGPA[grade];
            totalCredits += credits;
            totalPoints += gpaPoints * credits;
            validRows++;
        }
    }

    const resultDiv = document.getElementById('gpaResult');
    if (!resultDiv) return;

    if (validRows === 0) {
        resultDiv.innerHTML = '';
        return;
    }

    const overallGPA = (totalPoints / totalCredits).toFixed(2);
    resultDiv.innerHTML = `<div class="gpa-result-text">Overall GPA: <span style="color: #10b981; font-weight: bold;">${overallGPA}</span></div>`;
}

// Initialize GPA calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadCourses();

    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDark);
        }

        darkModeToggle.addEventListener('click', toggleDarkMode);

        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀️';
        } else {
            darkModeToggle.textContent = '🌙';
        }
    }
    loadEvents();
});

// Function to load events from localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('upcomingEvents')) || [];
    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
        eventsList.innerHTML = '';
        if (events.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No upcoming events';
            eventsList.appendChild(li);
        } else {
            events.forEach(event => {
                const li = document.createElement('li');
                li.textContent = event;
                eventsList.appendChild(li);
            });
        }
    }
}

// Function to add a new event
function addEvent() {
    const eventInput = document.getElementById('eventInput');
    if (eventInput) {
        const eventText = eventInput.value.trim();
        if (eventText === '') {
            alert('Please enter an event.');
            return;
        }
        const events = JSON.parse(localStorage.getItem('upcomingEvents')) || [];
        events.push(eventText);
        localStorage.setItem('upcomingEvents', JSON.stringify(events));
        eventInput.value = '';
        loadEvents();
    }
}
