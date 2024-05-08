

let currentQuestionIndex = 0;
let questionsData = [];
let startTime = null;
let userResponses = [];

$(document).ready(function () {
  $(".btn").click(function () {
    $(".btn").removeClass("clicked");
    $(this).addClass("clicked");
  });

  startTime = new Date().getTime(); 
});

// Frontend code
const fetchQuestions = () => {
  const qcategory = window.localStorage.getItem("pqCategory");
  console.log("Selected Category1:", qcategory);
  const token = window.localStorage.getItem("token");
  console.log(token);
  
  axios.get("http://localhost:8000/practice", {
    headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    params: { category: qcategory } // Send category as query parameter
  })
  .then((response) => {
  
    questionsData = response.data.questions;
    displayQuestion(currentQuestionIndex);
    //console.log("Questions Data:", questionsData);
    // Handle questions data here
  })
  .catch((error) => console.error("Error fetching Questions:", error));
  };

const displayQuestion = (index) => {
  const data = questionsData[index];
  console.log("Question Data:", data);
  if (data) {
  document.getElementById("Question").innerText = data.Question;
  document.getElementById("ch1").innerText = data.Choice1;
  document.getElementById("ch2").innerText = data.Choice2;
  document.getElementById("ch3").innerText = data.Choice3;
  document.getElementById("ch4").innerText = data.Choice4;
  document.getElementById("ch5").innerText = data.Choice5;
  document.getElementById("qhint").innerText = data.hint;
  }
};

const requestBody = {
  answers: []
};


let totalCorrectAnswers = 0;

// Function to calculate total correct answers
const calculateTotalCorrectAnswers = () => {
  totalCorrectAnswers = requestBody.answers.reduce((total, answer) => {
  if (answer.answeredCorrectly) {
    return total + 1;
  }
  return total;
  }, 0);
};


//Funtion to calculate total time 
let timeSpent = 0;
const calculateTotalTime = () => {
  timeSpent = requestBody.answers.reduce((total, answer) => {
  return total + answer.time;
  }, 0);
};

$("#next-btn").click(() => {
  const currentTime = new Date().getTime();
  const timeSpent = (currentTime - startTime) / (1000 * 60); 

  const clickedButtonId = $(".btn.clicked").attr("id"); 
  const currentQuestion = questionsData[currentQuestionIndex]; 

  if (!clickedButtonId) {
  alert("Select an answer before proceeding");
  return; 
  }


  const correctAnswer = currentQuestion.Correctans;
  

  const answeredCorrectly = (clickedButtonId === correctAnswer);


  const answerData = {
  question:currentQuestion.Question,
  answer:currentQuestion.Correctans,
  questionNo: currentQuestionIndex + 1,
  givenanswer: clickedButtonId,
  answeredCorrectly: answeredCorrectly,
  time: timeSpent
  };
  console.log(currentQuestionIndex);

  requestBody.answers.push(answerData);

 console.log("Request body:", requestBody);


  if (currentQuestionIndex ==8 ) {
  $("#next-btn").text("Finish").off("click").on("click", () => {
   
    //console.log("Quiz finished. Sending data to server:", requestBody);
    
    calculateTotalCorrectAnswers();
    calculateTotalTime();
    openMessageModal()
  });
  }

  startTime = currentTime; 
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
  $(".btn").removeClass("clicked");
});



function openMessageModal() {
  document.getElementById("myModal").style.display = "block";
  document.getElementById("Result").innerText = totalCorrectAnswers;
  document.getElementById("time").innerText = timeSpent.toFixed(2) + " minutes";
  const answerContainer = document.querySelector(".answer-container");
  answerContainer.innerHTML = ""; 

  // Loop through each answer data and create elements to display them
  requestBody.answers.forEach((answerData, index) => {
    const answerElement = document.createElement("div");
    answerElement.classList.add("answer");
    answerElement.innerHTML = `
      <p><strong>Question ${index + 1}: ${answerData.question}</strong></p>
      <p><strong>Correct Answer:</strong> ${answerData.answer}</p>
      <p><strong>Given Answer:</strong> ${answerData.givenanswer}</p>
      <p><strong>Answered Correctly:</strong> ${answerData.answeredCorrectly ? "Yes" : "No"}</p>
      <p><strong>Time Spent:</strong> ${answerData.time.toFixed(2)} minutes</p>
      <hr style="border-color: green; margin-bottom: 10px;">
    `;
    answerContainer.appendChild(answerElement);
  });

  // Set the height and add a scroll bar to the answer container
  answerContainer.style.height = "200px";
  answerContainer.style.overflowY = "scroll";

  
}


// Function to close the message modal
function closeMessageModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("Result").innerText = "";
  document.getElementById("time").innerText = "";
  setTimeout(() => {
  location.reload(); 
  }, 1000);
}



// Function to set the category in local storage and highlight the selected button
const setCategory = (category) => {
  localStorage.setItem("pqCategory", category);
   
  $(".category-button").removeClass("highlighted");
  $("#" + category.toLowerCase() + "Button").addClass("highlighted");
  $("#" + category.toLowerCase() + "Button").css("background-color", "gray"); 
  location.reload(); 
};

// Check if a category is already selected in local storage
const selectedCategory = localStorage.getItem("pqCategory");
if (selectedCategory) {
  $("#" + selectedCategory.toLowerCase() + "Button").addClass("highlighted");
  $("#" + selectedCategory.toLowerCase() + "Button").css("background-color", "gray");
} else {
  setCategory("All"); 
  $("#allButton").addClass("highlighted"); 
  $("#allButton").css("background-color", "gray"); 
}



fetchQuestions();
