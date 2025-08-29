// Game state
let currentStep = 'survey';
let currentQuestion = 0;
let answers = {};
let timeLeft = { minutes: 1, seconds: 27 };
let selectedBox = null;
let attempts = 3;
let showEmpty = false;

// Questions data
const questions = [
    {
        text: "Do you have a valid US address to ship to?",
        options: ["Yes", "No"]
    },
    {
        text: "Have you participated in a LeCreuset.com promotion in the last 30 days?",
        options: ["Yes", "No"]
    },
    {
        text: "How old are you?",
        options: ["18-29", "30-39", "40-49", "50+"]
    },
    {
        text: "Do you agree to pay for shipping if selected?",
        options: ["Yes", "No"]
    }
];

// Timer functionality
function startTimer() {
    const timer = setInterval(() => {
        if (timeLeft.seconds > 0) {
            timeLeft.seconds--;
        } else if (timeLeft.minutes > 0) {
            timeLeft.minutes--;
            timeLeft.seconds = 59;
        } else {
            clearInterval(timer);
            return;
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `${timeLeft.minutes} minutes and ${timeLeft.seconds} seconds`;
    }
}

// Handle survey answers
function handleAnswer(questionIndex, answer) {
    answers[questionIndex] = answer;
    
    if (questionIndex < questions.length - 1) {
        currentQuestion = questionIndex + 1;
        updateQuestion();
    } else {
        // Move to checking phase
        currentStep = 'checking';
        showSection('checking-section');
        
        setTimeout(() => {
            currentStep = 'boxes';
            showSection('boxes-section');
        }, 3000);
    }
}

// Update question display
function updateQuestion() {
    const questionTitle = document.getElementById('question-title');
    const questionOptions = document.getElementById('question-options');
    
    const question = questions[currentQuestion];
    questionTitle.innerHTML = `<strong>Question ${currentQuestion + 1} of 4:</strong> ${question.text}`;
    
    questionOptions.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.onclick = () => handleAnswer(currentQuestion, option);
        questionOptions.appendChild(button);
    });
}

// Handle box selection
function handleBoxClick(boxId) {
    if (selectedBox !== null) return; // Prevent multiple clicks
    
    selectedBox = boxId;
    
    // Add visual feedback
    const boxes = document.querySelectorAll('.gift-box');
    boxes[boxId - 1].classList.add('selected');
    
    // Disable all boxes
    boxes.forEach(box => {
        box.disabled = true;
    });
    
    setTimeout(() => {
        if (boxId === 2) { // Middle box wins
            currentStep = 'win';
            showSection('win-section');
        } else {
            showEmptyMessage();
        }
    }, 1000);
}

// Show empty box message
function showEmptyMessage() {
    attempts--;
    const emptyMessage = document.getElementById('empty-box-message');
    const remainingAttempts = document.getElementById('remaining-attempts');
    
    if (attempts > 1) {
        remainingAttempts.textContent = `${attempts} more times`;
    } else if (attempts === 1) {
        remainingAttempts.textContent = 'one more time';
    } else {
        remainingAttempts.textContent = 'no more times';
    }
    
    emptyMessage.style.display = 'block';
    showEmpty = true;
}

// Close empty message and reset boxes
function closeEmptyMessage() {
    const emptyMessage = document.getElementById('empty-box-message');
    emptyMessage.style.display = 'none';
    showEmpty = false;
    selectedBox = null;
    
    // Re-enable boxes and remove selected class
    const boxes = document.querySelectorAll('.gift-box');
    boxes.forEach(box => {
        box.disabled = false;
        box.classList.remove('selected');
    });
    
    // Update attempts display
    document.getElementById('attempts-count').textContent = attempts;
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = ['survey-section', 'checking-section', 'boxes-section', 'win-section'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
}

// Initialize the application
function init() {
    startTimer();
    updateTimerDisplay();
    showSection('survey-section');
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init);