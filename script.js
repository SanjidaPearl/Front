// JavaScript code to handle form submission, fetch students, and display them
const createStudentForm = document.getElementById("createStudentForm");
const updateStudentForm = document.getElementById("updateStudentForm");
const deleteStudentForm = document.getElementById("deleteStudentForm");
const studentList = document.getElementById("studentList");
const messageElement = document.getElementById("message");

function showMessage(message, success = true) {
    messageElement.textContent = message;
    if (success) {
        messageElement.style.color = "green";
    } else {
        messageElement.style.color = "red";
    }
}

// Function to fetch and display students (GET request)
function fetchStudents() {
    // Send a GET request to retrieve the list of students
    fetch("http://localhost:8080/getAllStudent")
        .then(response => response.json())
        .then(students => {
            studentList.innerHTML = ""; // Clear the existing list
            students.forEach(student => {
                const listItem = document.createElement("li");
                listItem.textContent = `Roll: ${student.roll}, Name: ${student.name}, Address: ${student.address}`;
                listItem.setAttribute("data-roll", student.roll); // Store the roll number as a data attribute
                studentList.appendChild(listItem);
            });
        })
        .catch(error => console.error(error));
}

// Code for creating students (POST request)
createStudentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const roll = document.getElementById("roll").value;
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;

    // Create a JSON object representing the student data
    const studentData = {
        roll: parseInt(roll),
        name: name,
        address: address
    };

    // Send a POST request to create a new student
    fetch("http://localhost:8080/saveStudent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => {
        if (typeof data === 'string') {
            // If the response is a string, it's an error message
            showMessage(data, false);
        } else {
            // If the response is an object, it's a student object
            showMessage("Student created successfully", true);

            // Add the new student to the list
            const listItem = document.createElement("li");
            listItem.textContent = `Roll: ${data.roll}, Name: ${data.name}, Address: ${data.address}`;
            listItem.setAttribute("data-roll", data.roll);
            studentList.appendChild(listItem);

            // Clear the form
            document.getElementById("roll").value = "";
            document.getElementById("name").value = "";
            document.getElementById("address").value = "";
        }
    })
    .catch(error => console.error(error));
});

// Code for updating students (PUT request)
updateStudentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updateRoll = document.getElementById("updateRoll").value;
    const updateName = document.getElementById("updateName").value;
    const updateAddress = document.getElementById("updateAddress").value;

    const updatedStudentData = {
        roll: parseInt(updateRoll),
        name: updateName,
        address: updateAddress
    };

    // Send a PUT request to update a student
    fetch("http://localhost:8080/updateData", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudentData)
    })
    .then(response => response.json())
    .then(data => {
        if (typeof data === 'string') {
            // If the response is a string, it's an error message
            showMessage(data, false);
        } else {
            // If the response is an object, it's a student object
            showMessage("Student updated successfully", true);

            // Update the student's details in the list
            const studentListItem = document.querySelector(`li[data-roll="${data.roll}"]`);
            if (studentListItem) {
                studentListItem.textContent = `Roll: ${data.roll}, Name: ${data.name}, Address: ${data.address}`;
            }

            // Clear the form
            document.getElementById("updateRoll").value = "";
            document.getElementById("updateName").value = "";
            document.getElementById("updateAddress").value = "";
        }
    })
    .catch(error => console.error(error));
});

// Code for deleting students (DELETE request)
deleteStudentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const deleteRoll = document.getElementById("deleteRoll").value;

    // Send a DELETE request to delete a student
    fetch(`http://localhost:8080/deleteStudent/${deleteRoll}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            showMessage("Student deleted successfully", true);

            // Remove the deleted student from the list
            const studentListItem = document.querySelector(`li[data-roll="${deleteRoll}"]`);
            if (studentListItem) {
                studentListItem.remove();
            }

            // Clear the form
            document.getElementById("deleteRoll").value = "";
        } else {
            showMessage(data, false);
        }
    })
    .catch(error => console.error(error));
});

// Fetch and display students when the page loads
fetchStudents();

