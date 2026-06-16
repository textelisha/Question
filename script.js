// Global Variables
let currentUsername = '';
let noClickCount = 0;
let usersData = JSON.parse(localStorage.getItem('usersData')) || [];
let adminUnlocked = false;

// DOM Elements
const usernameScreen = document.getElementById('usernameScreen');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const adminPanel = document.getElementById('adminPanel');
const adminBtn = document.getElementById('adminBtn');

const usernameInput = document.getElementById('usernameInput');
const startBtn = document.getElementById('startBtn');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noCounter = document.getElementById('noCounter');
const adminPassword = document.getElementById('adminPassword');
const submitPasswordBtn = document.getElementById('submitPasswordBtn');
const closeAdminBtn = document.querySelector('.close-admin');
const adminData = document.getElementById('adminData');
const dataTableBody = document.getElementById('dataTableBody');
const totalCount = document.getElementById('totalCount');
const yesCount = document.getElementById('yesCount');

// Initialize Background
function initializeBackground() {
    const heartsContainer = document.querySelector('.hearts');
    const starsContainer = document.querySelector('.stars');

    // Create falling hearts with more scatter
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.animationDuration = (Math.random() * 4 + 7) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.4;
        heartsContainer.appendChild(heart);
    }

    // Create falling stars
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 6 + 's';
        star.style.animationDuration = (Math.random() * 3 + 5) + 's';
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

// Admin Button
adminBtn.addEventListener('click', () => {
    adminPanel.classList.add('active');
    adminPassword.focus();
});

// Close Admin Panel
closeAdminBtn.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    adminPassword.value = '';
    adminData.style.display = 'none';
    adminUnlocked = false;
});

// Submit password
submitPasswordBtn.addEventListener('click', () => {
    const password = adminPassword.value.toLowerCase();
    if (password === '2smart') {
        adminUnlocked = true;
        adminData.style.display = 'block';
        displayAllData();
        adminPassword.value = '';
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

// Display all data in table
function displayAllData() {
    dataTableBody.innerHTML = '';
    usersData.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><strong style="color: #4169e1;">${user.response}</strong></td>
            <td>${user.timestamp}</td>
            <td><button class="delete-btn" onclick="deleteResponse(${index})">🗑️ Delete</button></td>
        `;
        dataTableBody.appendChild(row);
    });

    // Update stats
    totalCount.textContent = usersData.length;
    yesCount.textContent = usersData.filter(u => u.response === 'Yes').length;
}

// Delete response function
function deleteResponse(index) {
    if (confirm('Are you sure you want to delete this response?')) {
        usersData.splice(index, 1);
        localStorage.setItem('usersData', JSON.stringify(usersData));
        displayAllData();
    }
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

// No button - Moving and Counting with Smooth Animation
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);

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

    // Move the button smoothly with easing
    const randomX = Math.random() * 250 - 125;
    const randomY = Math.random() * 250 - 125;
    noBtn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

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

// Close admin panel when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === adminPanel) {
        adminPanel.classList.remove('active');
        adminPassword.value = '';
        adminData.style.display = 'none';
        adminUnlocked = false;
    }
});

// Initialize on page load
window.addEventListener('load', () => {
    initializeBackground();
    showScreen(usernameScreen);
});
