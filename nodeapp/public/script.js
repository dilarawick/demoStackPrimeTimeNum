// Unique Elements Page - Client-side JavaScript (Exercise 3)

document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("numbersInput");
    const btn = document.getElementById("btnFindUnique");
    const errorDiv = document.getElementById("error");
    const originalValues = document.getElementById("originalValues");
    const uniqueValues = document.getElementById("uniqueValues");
    const uniqueArrayDiv = document.getElementById("uniqueArray");

    // Function to find unique elements (can also be done client-side)
    function findUniqueElements(arr) {
        return [...new Set(arr)];
    }

    // Parse input string to array of numbers
    function parseInput(str) {
        return str
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
            .map(s => {
                const num = Number(s);
                if (isNaN(num)) throw new Error(`"${s}" is not a valid number`);
                return num;
            });
    }

    // Display error message
    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.classList.remove("hidden");
        uniqueArrayDiv.classList.add("hidden");
    }

    // Clear error
    function clearError() {
        errorDiv.classList.add("hidden");
    }

    // Handle find unique button click
    async function handleFindUnique() {
        clearError();
        btn.disabled = true;
        btn.textContent = "Processing...";

        const inputValue = input.value.trim();
        
        if (!inputValue) {
            showError("Please enter some numbers");
            btn.disabled = false;
            btn.textContent = "Find Unique Elements";
            return;
        }

        let numbers;
        try {
            numbers = parseInput(inputValue);
        } catch (e) {
            showError(e.message);
            btn.disabled = false;
            btn.textContent = "Find Unique Elements";
            return;
        }

        // Display original array
        originalValues.textContent = "[" + numbers.join(", ") + "]";

        try {
            // Call the Node.js backend API
            const response = await fetch("/api/unique", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ numbers })
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();
            
            if (data.unique) {
                uniqueValues.textContent = "[" + data.unique.join(", ") + "]";
                uniqueArrayDiv.classList.remove("hidden");
            } else {
                showError(data.error || "Failed to get unique elements");
            }
        } catch (err) {
            // Fallback: compute client-side if server fails
            console.warn("Server unavailable, computing client-side:", err);
            const unique = findUniqueElements(numbers);
            uniqueValues.textContent = "[" + unique.join(", ") + "] (computed client-side)";
            uniqueArrayDiv.classList.remove("hidden");
        }

        btn.disabled = false;
        btn.textContent = "Find Unique Elements";
    }

    btn.addEventListener("click", handleFindUnique);

    // Also allow Enter key to submit
    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            handleFindUnique();
        }
    });
});