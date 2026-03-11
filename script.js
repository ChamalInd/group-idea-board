let ideas = JSON.parse(localStorage.getItem('ideas')) || [];

// Function to update the idea counter
function updateCounter() {
    document.getElementById('ideaCount').textContent = ideas.length;
}

// Function to save ideas to localStorage
function saveIdeas() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
}

// Function to render all ideas from the array
function renderIdeas() {
    const tableBody = document.querySelector('#ideasTable tbody');
    tableBody.innerHTML = '';
    
    ideas.forEach((ideaObj, index) => {
        const newRow = tableBody.insertRow();

        // Create Name cell
        const nameCell = newRow.insertCell(0);
        nameCell.textContent = ideaObj.name;

        // Create Idea cell with integrated content
        const ideaCell = newRow.insertCell(1);

        // Container for all content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'idea-cell-content';

        const textSpan = document.createElement('span');
        textSpan.className = 'idea-text';
        textSpan.innerHTML = ideaObj.idea;

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
            if (i <= (ideaObj.rating || 0)) {
                star.classList.add('active');
            }
            star.onclick = function (e) {
                e.stopPropagation();
                rateIdea(index, i);
            };
            starsDiv.appendChild(star);
        }

        // Rating score display
        const ratingScore = document.createElement('div');
        ratingScore.className = 'rating-score';
        ratingScore.textContent = (ideaObj.rating || 0) + '/5';

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete Idea';
        deleteBtn.onclick = function (e) {
            e.stopPropagation();
            deleteIdea(index);
        };

        ratingContainer.appendChild(starsDiv);
        ratingContainer.appendChild(ratingScore);
        contentDiv.appendChild(textSpan);
        contentDiv.appendChild(ratingContainer);
        contentDiv.appendChild(deleteBtn);
        ideaCell.appendChild(contentDiv);
    });

    updateCounter();
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

    // Check for duplicate ideas
    const isDuplicate = ideas.some(existingIdea => 
        existingIdea.idea.toLowerCase() === idea.toLowerCase()
    );

    if (isDuplicate) {
        alert('This idea has already been added to the board!');
        return;
    }

    // Add to ideas array
    ideas.push({
        name: name,
        idea: idea,
        rating: 0
    });

    // Save and render
    saveIdeas();
    renderIdeas();

    // Clear input fields
    clearInputs();

    // Optional: Scroll to the last row (newly added idea)
    const tableBody = document.querySelector('#ideasTable tbody');
    if (tableBody.lastElementChild) {
        tableBody.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to rate an idea
function rateIdea(index, rating) {
    ideas[index].rating = rating;
    saveIdeas();
    renderIdeas();
}

// Function to delete an idea
function deleteIdea(index) {
    if (confirm('Are you sure you want to delete this idea?')) {
        ideas.splice(index, 1);
        saveIdeas();
        renderIdeas();
    }
}

// Function to clear input fields
function clearInputs() {
    document.getElementById('nameInput').value = '';
    document.getElementById('ideaInput').value = '';
    document.getElementById('charCount').textContent = '0';
}

// Update character counter as user types
document.getElementById('ideaInput').addEventListener('input', function() {
    const length = this.value.length;
    document.getElementById('charCount').textContent = length;
});

// Allow adding idea with Enter key in textarea
document.getElementById('ideaInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addIdea();
    }
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('darkMode', isDark);
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Load data and dark mode preference on page load
window.addEventListener('load', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    } else {
        darkModeToggle.textContent = '🌙';
    }
    renderIdeas();
    loadEvents();
});

// Function to load events from localStorage
function loadEvents() {
    const events = JSON.parse(localStorage.getItem('upcomingEvents')) || [];
    const eventsList = document.getElementById('eventsList');
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

// Function to add a new event
function addEvent() {
    const eventInput = document.getElementById('eventInput');
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
