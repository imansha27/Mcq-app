 // Fetch navbar
 fetch("./components/navbar_after_login.html")
 .then((response) => response.text())
 .then((html) => {
     document.getElementById("navbarContainer").innerHTML = html;
 })
 .catch((error) => console.error("Error fetching navbar content:", error));








 // Fetch submitted questions
fetch("http://localhost:8000/getsubQ")
.then((response) => response.json())
.then((data) => {
    const submittedQuestions = data.questions;
    const tableBody = document.getElementById("submittedQuestionsBody");

    submittedQuestions.forEach((question) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${question.Question}</td>
            <td>
                <ol>
                    <li id="ch1">${question.Choice1}</li>
                    <li id="ch2">${question.Choice2}</li>
                    <li id="ch3">${question.Choice3}</li>
                    <li id="ch4">${question.Choice4}</li>
                    <li id="ch5">${question.Choice5}</li>
                </ol>
            </td>
            <td>${question.Correctans}</td>
            <td>${question.Category}</td>
            <td>${question.source}</td>
            <td>${question.submitby}</td>
            <td>${question.image ? `<img src="${question.image.path}" alt="${question.image.filename}" width="100">` : 'No Image'}</td>
            <td>
                <button onclick="editQuestion('${question._id}')">Edit</button>
                <button onclick="deleteQuestion('${question._id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
})
.catch((error) => console.error("Error fetching submitted questions:", error));

// Function to delete a question
function deleteQuestion(questionId) {
    fetch(`/deleteQuestion/${questionId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // Refresh the page after deletion
            location.reload();
        } else {
            throw new Error('Failed to delete question');
        }
    })
    .catch(error => console.error('Error deleting question:', error));
}

// Function to edit a question
function editQuestion(questionId) {
    // Implement the edit functionality as per your requirements
    console.log(`Edit question with ID: ${questionId}`);
}
