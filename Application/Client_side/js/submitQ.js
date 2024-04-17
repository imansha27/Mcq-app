

 // Fetch navbar
 fetch("./components/navbar_after_login.html")
 .then((response) => response.text())
 .then((html) => {
     document.getElementById("navbarContainer").innerHTML = html;
 })
 .catch((error) => console.error("Error fetching navbar content:", error));






 function getsubQ() {
   
    fetch('http://localhost:8000/getsubQ', {
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
                    <button class="edit-btn">Edit</button>
                </td>
            `;

            if(question.status==="submit"){
                tableRow.style.backgroundColor="#F0FFF0";
            }else if (question.status==="reject"){
                tableRow.style.backgroundColor="#f43434"; 
            }
            

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



            const editButton = tableRow.querySelector('.edit-btn');
            editButton.addEventListener('click', (event) => {
                const tableRow = event.target.closest('tr'); 
                const questionId = tableRow.dataset.questionId;
                showEditModal(questionId);
            });





            document.getElementById('submittedQuestionsBody').appendChild(tableRow);
        });
    })
    .catch((error)=>{
        console.error("Error fetching data:",error);
    });
}


function deleQuestion(questionId){
    fetch("http://localhost:8000/delesubQ", {
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



function showEditModal(questionId) {
    fetch("http://localhost:8000/getquestion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question_id: questionId }),
      })
        .then(response => response.json())
        .then(question => {
            // Get the modal element
            const modal = document.getElementById('editModal');

            // Populate the modal fields with the question details
            modal.querySelector('#editQuestion').value = question.Question;
            modal.querySelector('#editChoice1').value = question.Choice1;
            modal.querySelector('#editChoice2').value = question.Choice2;
            modal.querySelector('#editChoice3').value = question.Choice3;
            modal.querySelector('#editChoice4').value = question.Choice4;
            modal.querySelector('#editCorrectAns').value = question.Correctans;
            modal.querySelector('#editCategory').value = question.Category;
            modal.querySelector('#editKeywords').value = question.keywords;
            modal.querySelector('#editImage').value = question.image;
            modal.querySelector('#editSource').value = question.source;
            modal.querySelector('#editStatus').value = question.status;

            // Show the modal
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error("Error fetching question details:", error);
        });
}


getsubQ();




