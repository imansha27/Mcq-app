

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
  const difficulty = window.localStorage.getItem("difficulty");
  console.log("Selected difficulty1:", difficulty);
  const token = window.localStorage.getItem("token");
  console.log(token);
  axios
    .get("http://localhost:8000/quizques", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: { difficulty: difficulty }
    })
    .then((response) => {
      questionsData = response.data.questions;
      roundNo=response.data.roundNo;
    
      document.getElementById("round").innerText=roundNo;
      console.log("Questions Data:", questionsData);
      console.log("round:",roundNo);
     
      displayQuestion(currentQuestionIndex);
     
    })
    .catch((error) => console.error("Error fetching Questions:", error));
};
predictions = [];

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
    const prediction =  data.predictions; 
    if (prediction === 0) {
      document.getElementById("qhint").innerText = data.hint; 
    } else {
      document.getElementById("qhint").innerText = "We predicted that you will get this question correct without a hint 😊😊😊"; 
    }
    predictions.push(prediction); 
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



  // Output the results
  console.log("Correct Answers by Category:");
  console.log("Inorganic:", correctAnswersByCategory["Inorganic"]);
  console.log("Organic:", correctAnswersByCategory["Organic"]);
  console.log("Physical:", correctAnswersByCategory["Physical"]);
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

  // Get the prediction for the current question
  const prediction = predictions[currentQuestionIndex];

  // Construct answer data with prediction
  const answerData = {
    questionId: currentQuestion._id,
    questionNo: currentQuestionIndex + 1,
    givenanswer: clickedButtonId,
    answeredCorrectly: answeredCorrectly,
    time: timeSpent,
    prediction: prediction // Add prediction to answer data
  };

  // Push the data for the current question into the array
  requestBody.answers.push(answerData);

  if (currentQuestionIndex == 8) {
    $("#next-btn").text("Finish").off("click").on("click", () => {
      console.log("Quiz finished. Sending data to server:", requestBody);
      calculateCorrectAnswersByCategory();
      openMessageModal();
      let leastCorrectCategory = Object.keys(correctAnswersByCategory).reduce((a, b) => correctAnswersByCategory[a] < correctAnswersByCategory[b] ? a : b);
      const leastCorrectCategories = Object.keys(correctAnswersByCategory).filter(category => correctAnswersByCategory[category] === correctAnswersByCategory[leastCorrectCategory]);
      const category = leastCorrectCategories.length > 1 ? "All" : leastCorrectCategories[0];
      localStorage.setItem("category", category);
    });
  }

  startTime = currentTime; 
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
  $(".btn").removeClass("clicked");
});



// $("#next-btn").click(() => {
//   const currentTime = new Date().getTime();
//   const timeSpent = (currentTime - startTime) / (1000 * 60); 

//   const clickedButtonId = $(".btn.clicked").attr("id"); 
//   const currentQuestion = questionsData[currentQuestionIndex]; 

//   if (!clickedButtonId) {
//     alert("Select an answer before proceeding");
//     return; 
//   }


//   const correctAnswer = currentQuestion.Correctans;
  

//   const answeredCorrectly = (clickedButtonId === correctAnswer);


//   const answerData = {
//     questionId: currentQuestion._id,
//     questionNo: currentQuestionIndex + 1,
//     givenanswer: clickedButtonId,
//     answeredCorrectly: answeredCorrectly,
//     time: timeSpent
//   };
//   console.log(currentQuestionIndex);
//   // Push the data for the current question into the array
//   requestBody.answers.push(answerData);

//   //console.log("Request body:", requestBody);


//   if (currentQuestionIndex ==8 ) {
//     $("#next-btn").text("Finish").off("click").on("click", () => {
   
//       console.log("Quiz finished. Sending data to server:", requestBody);
      
//       calculateCorrectAnswersByCategory();
//       openMessageModal()
    
//     ///Set the category in localStorage to the least correct category
//     let leastCorrectCategory = Object.keys(correctAnswersByCategory).reduce((a, b) => correctAnswersByCategory[a] < correctAnswersByCategory[b] ? a : b);
    
//     localStorage.setItem("category", leastCorrectCategory);
      
//     });
//   }

//   startTime = currentTime; 
//   currentQuestionIndex++;
//   displayQuestion(currentQuestionIndex);
//   $(".btn").removeClass("clicked");
// });





function openMessageModal() {

  // Calculate total correct predictions
const totalCorrectPredictions = requestBody.answers.reduce((ptotal, answer) => {
  if (answer.prediction === 1) {
    return ptotal + 1;
  }
  return ptotal;

}, 0);

console.log("Total Correct Predictions:", totalCorrectPredictions);
  document.getElementById("myModal").style.display = "block";


  // Display total correct predictions in the modal
  //document.getElementById("totalCorrectPredictions").innerText = totalCorrectPredictions;

  // You can customize the message based on the total correct predictions
  let message;
  if (totalCorrectPredictions === 0) {
    message = "We predicted that you would not get any correct answers.";
  } else {
    message = `We predicted that you would get ${totalCorrectPredictions} correct answers.`;
  }

  // Display the message in the modal
  document.getElementById("predictionMessage").innerText = message;

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
  //window.location.reload();
  
  setTimeout(() => {
    location.reload(); 
  }, 1000);
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


// Function to set the difficulty in local storage and highlight the selected button
const setDifficulty = (difficulty) => {
  localStorage.setItem("difficulty", difficulty);
   
  $(".difficulty-button").removeClass("highlighted");
  $("#" + difficulty.toLowerCase() + "Button").addClass("highlighted");
  $("#" + difficulty.toLowerCase() + "Button").css("background-color", "gray"); 
  location.reload(); 
};

// Check if a difficulty is already selected in local storage
const selectedDifficulty = localStorage.getItem("difficulty");
if (selectedDifficulty) {
  $("#" + selectedDifficulty.toLowerCase() + "Button").addClass("highlighted");
  $("#" + selectedDifficulty.toLowerCase() + "Button").css("background-color", "gray");
} else {
  setDifficulty("All"); 
  $("#allButton").addClass("highlighted"); 
  $("#allButton").css("background-color", "gray"); 
}




fetchQuestions();
