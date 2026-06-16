// Global Variables
let currentUsername = '';
let noClickCount = 0;
let usersData = JSON.parse(localStorage.getItem('usersData')) || [];

// DOM Elements
const usernameScreen = document.getElementById('usernameScreen');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const adminPanel = document.getElementById('adminPanel');

const usernameInput = document.getElementById('usernameInput');
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noCounter = document.getElementById('noCounter');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const adminPassword = document.getElementById('adminPassword');
const submitPasswordBtn = document.getElementById('submitPasswordBtn');
const closeBtn = document.querySelector('.close');
const adminData = document.getElementById('adminData');
const displayUsername = document.getElementById('displayUsername');

// Initialize Background
function initializeBackground() {
    const heartsContainer = document.querySelector('.hearts');
    const starsContainer = document.querySelector('.stars');

    // Create falling hearts
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 6) + 's';
        heartsContainer.appendChild(heart);
    }

    // Create falling stars
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (Math.random() * 2 + 4) + 's';
        starsContainer.appendChild(star);
    }
}

// Switch screens
function showScreen(screen) {
    usernameScreen.classList.remove('active');
    questionScreen.classList.remove('active');
    successScreen.classList.remove('active');
    screen.classList.add('active');
}

// Start button - Username
startBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentUsername = username;
        noClickCount = 0;
        showScreen(questionScreen);
    } else {
        alert('Please enter a username!');
    }
});

// Enter key on username input
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startBtn.click();
    }
});

// Yes button
yesBtn.addEventListener('click', () => {
    saveUserData(currentUsername, 'Yes');
    showScreen(successScreen);
});

// No button - Moving and Counting
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchmove', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    noClickCount++;
    
    // Update counter display
    if (noClickCount === 1) {
        noCounter.textContent = 'Clicked No ' + noClickCount + ' time';
    } else if (noClickCount < 3) {
        noCounter.textContent = 'Clicked No ' + noClickCount + ' times';
    }

    // Auto-select Yes after 3 clicks
    if (noClickCount >= 3) {
        setTimeout(() => {
            saveUserData(currentUsername, 'Yes');
            showScreen(successScreen);
        }, 300);
        return;
    }

    // Move the button
    const randomX = Math.random() * 300 - 150;
    const randomY = Math.random() * 300 - 150;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

// Admin Panel Button
adminPanelBtn.addEventListener('click', () => {
    adminPanel.classList.add('active');
});

// Close modal
closeBtn.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    adminPassword.value = '';
    adminData.style.display = 'none';
});

// Submit password
submitPasswordBtn.addEventListener('click', () => {
    const password = adminPassword.value.toLowerCase();
    if (password === '2smart') {
        adminData.style.display = 'block';
        displayUsername.textContent = currentUsername;
    } else {
        alert('Incorrect password!');
        adminPassword.value = '';
    }
});

// Enter key on password
adminPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitPasswordBtn.click();
    }
});

// Save user data to localStorage
function saveUserData(username, response) {
    const userData = {
        username: username,
        response: response,
        timestamp: new Date().toLocaleString()
    };
    usersData.push(userData);
    localStorage.setItem('usersData', JSON.stringify(usersData));
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === adminPanel) {
        adminPanel.classList.remove('active');
        adminPassword.value = '';
        adminData.style.display = 'none';
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    initializeBackground();
    showScreen(usernameScreen);
});
