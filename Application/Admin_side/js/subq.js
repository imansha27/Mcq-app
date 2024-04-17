function getsubQ() {
    fetch("http://localhost:8000/adminsubQ", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch comment");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const questionsArray = data.questions;
        questionsArray.forEach((question) => {
          const tableRow = document.createElement("tr");
          tableRow.dataset.questionId = question._id; 
        
          tableRow.innerHTML = `
              <td>${question.Question}</td>
              <td>${question.Choice1}, ${question.Choice2}, ${question.Choice3}, ${question.Choice4}</td>
              <td>${question.Correctans}</td>
              <td>${question.Category}</td>
              <td>${question.keywords}</td>
              <td>${question.image}</td>
              <td>${question.source}</td>
              <td>${question.status}</td>
              <td>
                  <button class="approve-btn">Approve</button>
                  <button class="reject-btn">Reject</button>
              </td>
          `;
          const approveButton = tableRow.querySelector(".approve-btn");
          approveButton.addEventListener('click', (event) => {
              const tableRow = event.target.closest('tr'); // Get the closest table row
              const questionId = tableRow.dataset.questionId; 
              console.log(questionId);
              const confirmed = confirm("Are you sure you want to Approve this question to the QBank?");
              if (confirmed) {
                  console.log("Question ID:", questionId); // Log the question id
                  updateQuestionStatus(questionId);
                  tableRow.remove();
              }
          });


          const  removeButton = tableRow.querySelector(".reject-btn");
          removeButton.addEventListener('click', (event) => {
              const tableRow = event.target.closest('tr'); // Get the closest table row
              const questionId = tableRow.dataset.questionId; 
              console.log(questionId);
              const confirmed = confirm("Are you sure you want to Reject this submitted question?");
              if (confirmed) {
                  console.log("Question ID:", questionId); // Log the question id
                  updateQuestionStatus2(questionId);
                  tableRow.remove();
              }
          });



          document.getElementById("submittedQuestionsBody").appendChild(tableRow);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  

function updateQuestionStatus(questionId) {
  fetch("http://localhost:8000/approveQ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question_id: questionId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Question status updated successfully");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  console.log(questionId);
}




function updateQuestionStatus2(questionId) {
  fetch("http://localhost:8000/rejectQ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question_id: questionId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Question status updated successfully");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  console.log(questionId);
}

getsubQ();
