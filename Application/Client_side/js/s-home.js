// // Fetch question details
// const token = localStorage.getItem("token");
// console.log(token);
// // Retrieve token from local storage
// axios
//   .get("http://localhost:8000/quizques", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//   .then((response) => {
//     console.log(response.data.data);
//     const data = response.data.data;
//     document.getElementById("img").src = data.image;
//     document.getElementById("Question").innerText = data.question;
//     document.getElementById("ch1").innerText = data.choice1;
//     document.getElementById("ch2").innerText = data.choice1;
//     document.getElementById("ch3").innerText = data.choice1;
//     document.getElementById("ch4").innerText = data.choice1;
//     document.getElementById("ch5").innerText = data.choice1;



   
 
//   })
//   .catch((error) => console.error("Error fetching user details:", error));

let currentQuestionIndex = 0;
let questionsData = [];
let startTime = null; // Variable to store the start time when the window is loaded
let userResponses = [];

$(document).ready(function () {
  $(".btn").click(function () {
    $(".btn").removeClass("clicked");
    $(this).addClass("clicked");
  });

  startTime = new Date().getTime(); // Record the start time when the window is loaded
});

const fetchQuestions = () => {
  const token = window.localStorage.getItem("token");
  console.log(token);
  axios
    .get("http://localhost:8000/quizques", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      questionsData = response.data;
      console.log("Questions Data:", questionsData);
      displayQuestion(currentQuestionIndex);
     
    })
    .catch((error) => console.error("Error fetching Questions:", error));
};

const displayQuestion = (index) => {
  const data = questionsData[index];
  if (data) {
    document.getElementById("Question").innerText = data.Question;
    document.getElementById("ch1").innerText = data.Choice1;
    document.getElementById("ch2").innerText = data.Choice2;
    document.getElementById("ch3").innerText = data.Choice3;
    document.getElementById("ch4").innerText = data.Choice4;
    document.getElementById("ch5").innerText = data.Choice5;
  }
};

const requestBody = {
  answers: []
};

const correctAnswersByCategory = {
  "Inorganic": 0,
  "Organic": 0,
  "Physical": 0
};

// Function to calculate correct answers by category
const calculateCorrectAnswersByCategory = () => {
  // Iterate through questionsData array
  questionsData.forEach((question, index) => {
    // Get the category of the question
    const category = question.Category;
    
    // Get the correctness of the answer for this question
    const answeredCorrectly = requestBody.answers[index].answeredCorrectly;

    // Increment the correct answer count for the corresponding category
    if (answeredCorrectly) {
      correctAnswersByCategory[category]++;
    }
  });



  // Output the results
  console.log("Correct Answers by Category:");
  console.log("Inorganic:", correctAnswersByCategory["Inorganic"]);
  console.log("Organic:", correctAnswersByCategory["Organic"]);
  console.log("Physical:", correctAnswersByCategory["Physical"]);
}




$("#next-btn").click(() => {
  const currentTime = new Date().getTime(); // Get current time in milliseconds
  const timeSpent = (currentTime - startTime) / (1000 * 60); // Convert milliseconds to minutes

  const clickedButtonId = $(".btn.clicked").attr("id"); 
  const currentQuestion = questionsData[currentQuestionIndex]; // Get the current question

  if (!clickedButtonId) {
    alert("Select an answer before proceeding");
    return; // Exit the function if no button is selected
  }

  // Find the correct answer for the current question
  const correctAnswer = currentQuestion.Correctans;
  
  // Determine if the answer is correct
  const answeredCorrectly = (clickedButtonId === correctAnswer);

  // Prepare data to be sent in req.body
  const answerData = {
    questionId: currentQuestion._id,
    questionNo: currentQuestionIndex + 1, // Assuming question numbers start from 1
    givenanswer: clickedButtonId,
    answeredCorrectly: answeredCorrectly,
    time: timeSpent
  };
  console.log(currentQuestionIndex);
  // Push the data for the current question into the array
  requestBody.answers.push(answerData);

  //console.log("Request body:", requestBody); // For testing
  // Now you can send this data in the req.body to your server

  if (currentQuestionIndex == 8) {
    $("#next-btn").text("Finish").off("click").on("click", () => {
      // Perform finish actions here
      console.log("Quiz finished. Sending data to server:", requestBody);
      // You can send this data in the req.body to your server or perform other actions
      calculateCorrectAnswersByCategory();
      openMessageModal()
      submitresults()
    
    
      
    });
  }

  startTime = currentTime; // Reset the start time for the next question
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
  $(".btn").removeClass("clicked");
});




function openMessageModal() {
  document.getElementById("myModal").style.display = "block";
  document.getElementById("organicResult").innerText = correctAnswersByCategory["Organic"];
  document.getElementById("inorganicResult").innerText = correctAnswersByCategory["Inorganic"];
  document.getElementById("physicalResult").innerText = correctAnswersByCategory["Physical"];
}

// Function to close the message modal
function closeMessageModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("organicResult").value = "";
  document.getElementById("inorganicResult").value = "";
  document.getElementById("physicalResult").value = "";
}

function submitresults(){
  console.log("sending...");
  fetch('http://localhost:8000/saveresults',{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`,
    },
    body:JSON.stringify({answer:requestBody.answers}),
    
  })
  .then((response)=>{
    if(!response.ok){
      throw new Error("Failed to save results");
    }
    return response.json();
  }).catch((error)=>{
    console.log("There was a problen saving results:",error);
  })

  console.log(requestBody);
}





fetchQuestions();
