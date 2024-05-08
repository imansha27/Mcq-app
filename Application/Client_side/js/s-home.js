

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
      roundNo=response.data.roundNo;
      document.getElementById("round").innerText=roundNo;
      console.log("Questions Data:", questionsData);
      console.log("round:",roundNo);
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
    
    ///Set the category in localStorage to the least correct category
    let leastCorrectCategory = Object.keys(correctAnswersByCategory).reduce((a, b) => correctAnswersByCategory[a] < correctAnswersByCategory[b] ? a : b);
    
    localStorage.setItem("category", leastCorrectCategory);
      
    });
  }

  startTime = currentTime; 
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





fetchQuestions();
