// ========================================
// STUDY TIMER FUNCTIONS
// ========================================

let timerInterval = null;
let totalSeconds = 0;
let isTimerRunning = false;

// Function to start the timer
function startTimer() {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

    if (minutes === 0 && seconds === 0) {
        alert('Please set a time for the timer.');
        return;
    }

    if (isTimerRunning) return; // Prevent multiple starts

    totalSeconds = minutes * 60 + seconds;
    isTimerRunning = true;

    // Update button states
    updateButtonStates('running');

    // Disable input fields
    document.getElementById('timerMinutes').disabled = true;
    document.getElementById('timerSeconds').disabled = true;

    timerInterval = setInterval(updateTimer, 1000);
}

// Function to pause the timer
function pauseTimer() {
    if (!isTimerRunning) return;

    clearInterval(timerInterval);
    isTimerRunning = false;

    // Update button states
    updateButtonStates('paused');
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    totalSeconds = 0;

    // Reset display
    document.getElementById('timerDisplay').textContent = '00:00';
    document.getElementById('timerMinutes').value = '25';
    document.getElementById('timerSeconds').value = '0';

    // Update button states
    updateButtonStates('reset');

    // Enable input fields
    document.getElementById('timerMinutes').disabled = false;
    document.getElementById('timerSeconds').disabled = false;
}

// Function to update button states
function updateButtonStates(state) {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');

    if (!startBtn || !pauseBtn) return;

    switch(state) {
        case 'running':
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            break;
        case 'paused':
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            break;
        case 'reset':
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            break;
    }
}

// Function to update the timer display
function updateTimer() {
    if (totalSeconds <= 0) {
        timerComplete();
        return;
    }

    totalSeconds--;

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

// Function to handle timer completion
function timerComplete() {
    clearInterval(timerInterval);
    isTimerRunning = false;

    document.getElementById('timerDisplay').textContent = '00:00';

    // Enable input fields
    document.getElementById('timerMinutes').disabled = false;
    document.getElementById('timerSeconds').disabled = false;

    // Update button states
    updateButtonStates('reset');

    // Play bell sound notification
    playBellSound();

    // Show notification
    showTimerNotification();
}

// Function to play bell sound
function playBellSound() {
    try {
        // Create a simple bell sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.5);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio not supported');
    }
}

// Function to show timer notification
function showTimerNotification() {
    // Check if browser supports Notification API
    if ('Notification' in window) {
        // Request permission if not already granted
        if (Notification.permission === 'granted') {
            new Notification('⏱️ Study Timer Complete!', {
                body: 'Your study session has ended. Time for a break!',
                icon: '⏱️'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('⏱️ Study Timer Complete!', {
                        body: 'Your study session has ended. Time for a break!',
                        icon: '⏱️'
                    });
                }
            });
        }
    }

    // Also show an alert as fallback
    alert('⏱️ Study Timer Complete! Time for a break!');
}

// Function to update timer display when inputs change
function updateTimerDisplay() {
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;

    const totalTime = minutes * 60 + seconds;
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;

    const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

// Initialize study timer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Set up input listeners for live timer display update
    const minutesInput = document.getElementById('timerMinutes');
    const secondsInput = document.getElementById('timerSeconds');

    if (minutesInput && secondsInput) {
        minutesInput.addEventListener('input', updateTimerDisplay);
        secondsInput.addEventListener('input', updateTimerDisplay);

        // Initialize display
        updateTimerDisplay();
    }
});