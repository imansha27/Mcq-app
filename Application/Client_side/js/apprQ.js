

 // Fetch navbar
 fetch("./components/navbar_after_login.html")
 .then((response) => response.text())
 .then((html) => {
     document.getElementById("navbarContainer").innerHTML = html;
 })
 .catch((error) => console.error("Error fetching navbar content:", error));






 function getsubQ() {
   
    fetch('http://localhost:8000/getAppQ', {
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
            tableRow.innerHTML= `
            <td>${question.Question}</td>
                <td>${question.Choice1}, ${question.Choice2}, ${question.Choice3}, ${question.Choice4}</td>
                <td>${question.Correctans}</td>
                <td>${question.Category}</td>
                <td>${question.keywords}</td>
                <td>${question.image}</td>
                <td>${question.source}</td>
                <td>${question.status}</td>
                <td>
                    <button class="delete-btn">Delete</button>
                  
                </td>
            `;
            const removeButton =tableRow.querySelector('.delete-btn');
            removeButton.addEventListener('click', (event) => {
                const tableRow = event.target.closest('tr'); 
                const questionId = tableRow.dataset.questionId; 
                console.log(questionId);
                const confirmed = confirm("Are you sure you want to Delete this question to the QBank?");
                if (confirmed) {
                    console.log("Question ID:", questionId); 
                    deleQuestion(questionId);
                    tableRow.remove();
                }
            });
            document.getElementById('submittedQuestionsBody').appendChild(tableRow);
        });
    })
    .catch((error)=>{
        console.error("Error fetching data:",error);
    });
}


function deleQuestion(questionId){
    fetch("http://localhost:8000/deleappQ", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question_id: questionId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Question removed successfully!");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
 
}

getsubQ();

