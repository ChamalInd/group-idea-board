let ideaCount = 0;

// Function to update the idea counter
function updateCounter() {
    document.getElementById('ideaCount').textContent = ideaCount;
}

// Function to add a new idea to the table
function addIdea() {
    // Get input values and trim whitespace
    const name = document.getElementById('nameInput').value.trim();
    const idea = document.getElementById('ideaInput').value.trim();

    // Validate inputs
    if (name === '' || idea === '') {
        alert('Please fill in both your name and idea.');
        return;
    }

    // Get table body and create new row
    const tableBody = document.querySelector('#ideasTable tbody');
    const newRow = tableBody.insertRow();

    // Create Name cell
    const nameCell = newRow.insertCell(0);
    nameCell.textContent = name;

    // Create Idea cell with integrated content
    const ideaCell = newRow.insertCell(1);

    // Container for all content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'idea-cell-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'idea-text';
    textSpan.textContent = idea;

    // Rating container
    const ratingContainer = document.createElement('div');
    ratingContainer.className = 'rating-container';

    // Stars
    const starsDiv = document.createElement('div');
    starsDiv.className = 'stars';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.dataset.rating = i;
        star.onclick = function (e) {
            e.stopPropagation();
            rateIdea(star, starsDiv, ratingScore);
        };
        starsDiv.appendChild(star);
    }

    // Rating score display
    const ratingScore = document.createElement('div');
    ratingScore.className = 'rating-score';
    ratingScore.textContent = '0/5';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete Idea';
    deleteBtn.onclick = function (e) {
        e.stopPropagation();
        deleteIdea(newRow);
    };

    ratingContainer.appendChild(starsDiv);
    ratingContainer.appendChild(ratingScore);
    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(ratingContainer);
    contentDiv.appendChild(deleteBtn);
    ideaCell.appendChild(contentDiv);

    // Increment counter and update display
    ideaCount++;
    updateCounter();

    // Clear input fields
    clearInputs();

    // Optional: Scroll to the new idea
    newRow.scrollIntoView({ behavior: 'smooth' });
}

// Function to rate an idea
function rateIdea(star, starsDiv, scoreDisplay) {
    const rating = star.dataset.rating;

    // Update all stars
    const allStars = starsDiv.querySelectorAll('.star');
    allStars.forEach(s => {
        if (s.dataset.rating <= rating) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });

    // Update score display
    scoreDisplay.textContent = rating + '/5';
}

// Function to delete an idea
function deleteIdea(row) {
    if (confirm('Are you sure you want to delete this idea?')) {
        row.remove();
        ideaCount--;
        updateCounter();
    }
}

// Function to clear input fields
function clearInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('ideaInput').value = '';
}

// Allow adding idea with Enter key in textarea
document.getElementById('ideaInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addIdea();
    }
});