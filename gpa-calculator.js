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

// Function to add a course row
function addCourseRow() {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return; // Exit if element doesn't exist

    const newRow = tableBody.insertRow();

    const courseNameCell = newRow.insertCell(0);
    courseNameCell.innerHTML = '<input type="text" placeholder="Enter course name" required>';

    const creditsCell = newRow.insertCell(1);
    creditsCell.innerHTML = '<input type="number" placeholder="Credits" min="1" max="6" value="3" required>';

    const gradeCell = newRow.insertCell(2);
    gradeCell.innerHTML = `<select required>
        <option value="">Select Grade</option>
        <option value="A">A (4.0)</option>
        <option value="A-">A- (3.7)</option>
        <option value="B+">B+ (3.3)</option>
        <option value="B">B (3.0)</option>
        <option value="B-">B- (2.7)</option>
        <option value="C+">C+ (2.3)</option>
        <option value="C">C (2.0)</option>
        <option value="C-">C- (1.7)</option>
        <option value="D+">D+ (1.3)</option>
        <option value="D">D (1.0)</option>
        <option value="F">F (0.0)</option>
    </select>`;

    const actionCell = newRow.insertCell(3);
    actionCell.innerHTML = '<button class="gpa-remove-btn" onclick="removeCourseRow(this)">Remove</button>';
}

// Function to remove a course row
function removeCourseRow(btn) {
    if (confirm('Are you sure you want to remove this course?')) {
        btn.parentElement.parentElement.remove();
    }
}

// Function to calculate GPA
function calculateGPA() {
    const tableBody = document.getElementById('gpaTableBody');
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('tr');

    if (rows.length === 0) {
        alert('Please add at least one course.');
        return;
    }

    let totalCredits = 0;
    let totalPoints = 0;
    let hasErrors = false;

    for (let row of rows) {
        const courseName = row.cells[0].querySelector('input').value.trim();
        const credits = parseFloat(row.cells[1].querySelector('input').value);
        const grade = row.cells[2].querySelector('select').value;

        if (!courseName || !credits || !grade) {
            alert('Please fill in all fields for each course.');
            hasErrors = true;
            break;
        }

        if (isNaN(credits) || credits <= 0) {
            alert('Please enter valid credits (positive number).');
            hasErrors = true;
            break;
        }

        const gpaPoints = gradeToGPA[grade];
        totalCredits += credits;
        totalPoints += gpaPoints * credits;
    }

    if (hasErrors) return;

    const overallGPA = (totalPoints / totalCredits).toFixed(2);

    const resultDiv = document.getElementById('gpaResult');
    if (resultDiv) {
        resultDiv.innerHTML = `<div class="gpa-result-text">Overall GPA: <span style="color: #10b981; font-weight: bold;">${overallGPA}</span></div>`;
    }
}

// Initialize GPA calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add initial course row if on GPA calculator page
    if (document.getElementById('gpaTableBody')) {
        addCourseRow();
    }
});