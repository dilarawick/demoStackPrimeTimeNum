// Hardcoded credentials (for exercise purposes only - not for production!)
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "password123";

// Login page logic
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElem = document.getElementById("loginError");
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Store login state in sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");
        // Redirect to content page
        window.location.href = "content.html";
    } else {
        errorElem.textContent = "Invalid username or password. Try: admin / password123";
        errorElem.style.color = "red";
    }
}

// Logout logic
function handleLogout() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}

// Check authentication on content page
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

// Original exercise 1 logic (for index.html)
function btnGo_click() {
    var elem = document.getElementById("parMessage");
    elem.innerText = "Hello there!!!";
}

// Fetch greeting from Node.js backend (Exercise 4 - two container communication)
async function fetchGreeting() {
    try {
        const response = await fetch("http://localhost:82/api/greeting");
        if (response.ok) {
            const data = await response.json();
            const greetingElem = document.getElementById("greetingText");
            if (greetingElem) {
                greetingElem.textContent = data.greeting;
            }
        }
    } catch (err) {
        console.warn("Could not fetch greeting from Node.js backend:", err);
        const greetingElem = document.getElementById("greetingText");
        if (greetingElem) {
            greetingElem.textContent = "Backend unavailable";
        }
    }
}

// Initialize based on current page
window.onload = function() {
    const currentPage = window.location.pathname.split("/").pop();
    
    if (currentPage === "login.html" || currentPage === "") {
        // Login page or index - attach login handler
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", handleLogin);
        }
        // Also support original index.html button
        var btnGo = document.getElementById("btnGo");
        if (btnGo) {
            btnGo.addEventListener("click", btnGo_click);
        }
        // Fetch greeting from Node.js backend (Exercise 4)
        fetchGreeting();
    } else if (currentPage === "content.html") {
        // Content page - check auth and attach logout handler
        checkAuth();
        var btnLogout = document.getElementById("btnLogout");
        if (btnLogout) {
            btnLogout.addEventListener("click", handleLogout);
        }
    }
}