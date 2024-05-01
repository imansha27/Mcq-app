

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
      questionsData = response.data.questions;
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
    document.getElementById("qhint").innerText = data.hint;
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

    questionsData.forEach((question, index) => {
 
        const category = question.Category;
        
        // Get the correctness of the answer for this question
        const answeredCorrectly = requestBody.answers[index].answeredCorrectly;

        // Increment the correct answer count for the corresponding category
        if (answeredCorrectly) {
            correctAnswersByCategory[category]++;
        }
    });

    // Calculate total correct answers
    const totalCorrectAnswers = Object.values(correctAnswersByCategory).reduce((total, count) => total + count, 0);
    console.log("Total Correct Answers:", totalCorrectAnswers);
}




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
    questionId: currentQuestion._id,
    questionNo: currentQuestionIndex + 1,
    givenanswer: clickedButtonId,
    answeredCorrectly: answeredCorrectly,
    time: timeSpent
  };
  console.log(currentQuestionIndex);
  // Push the data for the current question into the array
  requestBody.answers.push(answerData);

  //console.log("Request body:", requestBody);


  if (currentQuestionIndex ==8 ) {
    $("#next-btn").text("Finish").off("click").on("click", () => {
   
      console.log("Quiz finished. Sending data to server:", requestBody);
      
      calculateCorrectAnswersByCategory();
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
  document.getElementById("Total Correct").innerText = correctAnswersByCategory["totalCorrectAnswers"];
  document.getElementById("Total Time").innerText = timeSpent.toFixed(2) + " minutes";
}

// Function to close the message modal
function closeMessageModal() {
  document.getElementById("myModal").style.display = "none";
  document.getElementById("organicResult").value = "";
  document.getElementById("inorganicResult").value = "";
  document.getElementById("physicalResult").value = "";
  //window.location.reload();
  
  setTimeout(() => {
    location.reload(); 
  }, 1000);
}



// Function to set the category in local storage and highlight the selected button
const setCategory = (category) => {
    localStorage.setItem("pqCategory", category);
    $(".category-button").removeClass("highlighted");
    $("#" + category.toLowerCase() + "Button").addClass("highlighted");
};

// Check if a category is already selected in local storage
const selectedCategory = localStorage.getItem("pqCategory");
if (selectedCategory) {
    $("#" + selectedCategory.toLowerCase() + "Button").addClass("highlighted");
}



fetchQuestions();
