// Exercise 3: Objects - Person, Lecturer, Student with Inheritance

// Base class Person
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    // Method to get basic info
    getInfo() {
        return {
            name: this.name,
            email: this.email
        };
    }

    // Method to create table row
    createTableRow() {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${this.name}</td><td>${this.email}</td>`;
        return row;
    }
}

// Lecturer class extends Person
class Lecturer extends Person {
    constructor(name, email, office) {
        super(name, email);
        this.office = office;
    }

    getInfo() {
        const baseInfo = super.getInfo();
        return {
            ...baseInfo,
            office: this.office,
            type: "Lecturer"
        };
    }

    createTableRow() {
        const row = super.createTableRow();
        row.innerHTML += `<td>${this.office}</td>`;
        return row;
    }
}

// Student class extends Person
class Student extends Person {
    constructor(name, email, studentNumber) {
        super(name, email);
        this.studentNumber = studentNumber;
    }

    getInfo() {
        const baseInfo = super.getInfo();
        return {
            ...baseInfo,
            studentNumber: this.studentNumber,
            type: "Student"
        };
    }

    createTableRow() {
        const row = super.createTableRow();
        row.innerHTML += `<td>${this.studentNumber}</td>`;
        return row;
    }
}

// Demo: Create a person object and log to console
function demoPersonObject() {
    const person = {
        forename: "John",
        surname: "Doe",
        dateOfBirth: "1990-05-15"
    };

    console.log("=== Person Object ===");
    console.log("Whole object:", person);
    console.log("--- Key/Value Pairs ---");
    for (const key in person) {
        if (person.hasOwnProperty(key)) {
            console.log(`${key}: ${person[key]}`);
        }
    }

    // Also demonstrate with classes
    const lecturer = new Lecturer("Mark Dixon", "mark.dixon@plymouth.ac.uk", "PSQ A319");
    const student = new Student("Jane Smith", "jane.smith@students.plymouth.ac.uk", "1234567");

    console.log("\n=== Lecturer Object ===");
    console.log("Whole object:", lecturer);
    console.log("--- Key/Value Pairs ---");
    const lecInfo = lecturer.getInfo();
    for (const key in lecInfo) {
        console.log(`${key}: ${lecInfo[key]}`);
    }

    console.log("\n=== Student Object ===");
    console.log("Whole object:", student);
    console.log("--- Key/Value Pairs ---");
    const stuInfo = student.getInfo();
    for (const key in stuInfo) {
        console.log(`${key}: ${stuInfo[key]}`);
    }

    // Display in output box
    const output = document.getElementById("personOutput");
    output.innerHTML = `
        <strong>Person Object:</strong><br>
        ${JSON.stringify(person, null, 2)}<br><br>
        <strong>Lecturer:</strong> ${lecturer.name}, ${lecturer.email}, ${lecturer.office}<br>
        <strong>Student:</strong> ${student.name}, ${student.email}, ${student.studentNumber}
    `;
    output.classList.remove("hidden");
}

// Add lecturer to table
function addLecturer(event) {
    event.preventDefault();

    const name = document.getElementById("lecName").value.trim();
    const email = document.getElementById("lecEmail").value.trim();
    const office = document.getElementById("lecOffice").value.trim();

    if (!name || !email || !office) return;

    const lecturer = new Lecturer(name, email, office);
    const tbody = document.querySelector("#lecturerTable tbody");
    tbody.appendChild(lecturer.createTableRow());

    // Clear form
    document.getElementById("lecturerForm").reset();
}

// Add student to table
function addStudent(event) {
    event.preventDefault();

    const name = document.getElementById("stuName").value.trim();
    const email = document.getElementById("stuEmail").value.trim();
    const studentNumber = document.getElementById("stuNumber").value.trim();

    if (!name || !email || !studentNumber) return;

    const student = new Student(name, email, studentNumber);
    const tbody = document.querySelector("#studentTable tbody");
    tbody.appendChild(student.createTableRow());

    // Clear form
    document.getElementById("studentForm").reset();
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
    // Demo button
    document.getElementById("btnDemoPerson").addEventListener("click", demoPersonObject);

    // Form submissions
    document.getElementById("lecturerForm").addEventListener("submit", addLecturer);
    document.getElementById("studentForm").addEventListener("submit", addStudent);
});