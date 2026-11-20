// Ajax Demo - Demonstrating container communication (Exercise 1)
// Uses both XMLHttpRequest and fetch API

const API_BASE = "http://localhost:82";

// Helper: Show result in result box
function showResult(elementId, content, isError = false) {
    const elem = document.getElementById(elementId);
    elem.innerHTML = content;
    elem.classList.remove("hidden");
    elem.style.backgroundColor = isError ? "#fadbd8" : "#d5f5e3";
    elem.style.color = isError ? "#c0392b" : "#27ae60";
}

function hideResult(elementId) {
    const elem = document.getElementById(elementId);
    elem.classList.add("hidden");
}

// 1. XMLHttpRequest GET - Greeting
function fetchGreetingXHR() {
    hideResult("greetingResult");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                showResult("greetingResult", `<strong>Response:</strong> ${data.greeting}<br><small>Method: XMLHttpRequest (GET)</small>`);
            } else {
                showResult("greetingResult", `Error: ${this.status} ${this.statusText}`, true);
            }
        }
    };
    request.open("GET", `${API_BASE}/api/greeting`, true);
    request.send();
}

// 2. fetch GET - Random Number
async function fetchRandomFetch() {
    hideResult("randomResult");
    try {
        const response = await fetch(`${API_BASE}/api/random`);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const data = await response.json();
        showResult("randomResult", `<strong>Random Number:</strong> ${data.number}<br><small>Method: fetch API (GET)</small>`);
    } catch (err) {
        showResult("randomResult", `Error: ${err.message}`, true);
    }
}

// 3. fetch GET - Customers (JSON array)
async function fetchCustomersFetch() {
    hideResult("customersResult");
    try {
        const response = await fetch(`${API_BASE}/api/customers`);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const data = await response.json();
        let html = `<strong>Customers:</strong><ul>`;
        data.customers.forEach(c => {
            html += `<li>${c.surname}, ${c.forname} (${c.email})</li>`;
        });
        html += `</ul><small>Method: fetch API (GET) - JSON Array</small>`;
        showResult("customersResult", html);
    } catch (err) {
        showResult("customersResult", `Error: ${err.message}`, true);
    }
}

// 4. fetch POST - Unique Elements
async function fetchUniquePost() {
    hideResult("uniqueResult");
    const input = document.getElementById("numbersInput").value.trim();
    if (!input) {
        showResult("uniqueResult", "Please enter numbers", true);
        return;
    }

    const numbers = input.split(",").map(s => s.trim()).filter(s => s).map(Number);
    if (numbers.some(isNaN)) {
        showResult("uniqueResult", "Invalid input - please enter only numbers separated by commas", true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/unique`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ numbers })
        });
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const data = await response.json();
        showResult("uniqueResult", 
            `<strong>Original:</strong> [${numbers.join(", ")}]<br>` +
            `<strong>Unique:</strong> [${data.unique.join(", ")}]<br>` +
            `<small>Method: fetch API (POST) - JSON Request/Response</small>`
        );
    } catch (err) {
        showResult("uniqueResult", `Error: ${err.message}`, true);
    }
}

// 5. XMLHttpRequest GET - Server Time
function fetchTimeXHR() {
    hideResult("timeResult");
    const request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const data = JSON.parse(this.responseText);
                showResult("timeResult", `<strong>Server Time:</strong> ${data.time}<br><small>Method: XMLHttpRequest (GET)</small>`);
            } else {
                showResult("timeResult", `Error: ${this.status} ${this.statusText}`, true);
            }
        }
    };
    request.open("GET", `${API_BASE}/api/time`, true);
    request.send();
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btnGreeting").addEventListener("click", fetchGreetingXHR);
    document.getElementById("btnRandom").addEventListener("click", fetchRandomFetch);
    document.getElementById("btnCustomers").addEventListener("click", fetchCustomersFetch);
    document.getElementById("btnUnique").addEventListener("click", fetchUniquePost);
    document.getElementById("btnTime").addEventListener("click", fetchTimeXHR);
});