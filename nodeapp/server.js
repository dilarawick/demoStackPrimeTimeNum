const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = 9000;

// Greeting function based on time of day (Exercise 2)
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning!";
    if (hour < 18) return "Good afternoon!";
    return "Good evening!";
}

// Unique elements function (Exercise 3)
function getUniqueElements(arr) {
    return [...new Set(arr)];
}

// Random number function
function getRandomNumber() {
    return Math.random();
}

// Customer data
function getCustomers() {
    return [
        { forname: "John", surname: "Smith", email: "john.smith@example.com" },
        { forname: "Jane", surname: "Doe", email: "jane.doe@example.com" },
        { forname: "Bob", surname: "Wilson", email: "bob.wilson@example.com" }
    ];
}

// Server time
function getServerTime() {
    return new Date().toISOString();
}

// Serve static files
function serveStaticFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("File not found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    // Enable CORS for frontend communication
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API endpoint for greeting (Exercise 2)
    if (pathname === "/api/greeting") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ greeting: getGreeting() }));
        return;
    }

    // API endpoint for random number
    if (pathname === "/api/random") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ number: getRandomNumber() }));
        return;
    }

    // API endpoint for customers (JSON array)
    if (pathname === "/api/customers") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ customers: getCustomers() }));
        return;
    }

    // API endpoint for server time
    if (pathname === "/api/time") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ time: getServerTime() }));
        return;
    }

    // API endpoint for unique elements (Exercise 3)
    if (pathname === "/api/unique") {
        if (req.method === "POST") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                try {
                    const { numbers } = JSON.parse(body);
                    const unique = getUniqueElements(numbers);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ unique }));
                } catch (e) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ error: "Invalid input" }));
                }
            });
            return;
        }
    }

    // Serve static files from nodeapp/public
    let filePath = "";
    let contentType = "text/html";

    switch (pathname) {
        case "/":
        case "/unique.html":
            filePath = path.join(__dirname, "public", "unique.html");
            contentType = "text/html";
            break;
        case "/style.css":
            filePath = path.join(__dirname, "public", "style.css");
            contentType = "text/css";
            break;
        case "/script.js":
            filePath = path.join(__dirname, "public", "script.js");
            contentType = "application/javascript";
            break;
        default:
            res.writeHead(404);
            res.end("Not found");
            return;
    }

    serveStaticFile(res, filePath, contentType);
});

server.listen(PORT, () => {
    console.log(`Node.js server listening on port ${PORT}`);
});