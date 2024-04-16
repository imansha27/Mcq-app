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
let lastSubmitTime = null; // Variable to store the timestamp of the last submit
let userResponses =[];


$(document).ready(function () {
  $(".btn").click(function () {
    $(".btn").removeClass("clicked"); 
    $(this).addClass("clicked");
  });
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

// Function to convert milliseconds to a human-readable format
const millisecondsToTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + " minutes " + (seconds < 10 ? "0" : "") + seconds + " seconds";
};

$("#next-btn").click(() => {
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
});

$("#submit-btn").click(() => {
  const currentTime = Date.now(); // Get current timestamp
  if (lastSubmitTime) {
    const timeDifference = currentTime - lastSubmitTime;
    const formattedTime = millisecondsToTime(timeDifference);
    console.log("Time between two submit clicks:", formattedTime);
  }
  lastSubmitTime = currentTime;

  const selectedChoice = $(".btn.clicked").attr("id");
  const question =questionsData[currentQuestionIndex];
  const answeredCorrectly = questions.Correctans === selectedChoice;
  const Response ={
    questionId : question._id,
    questionNo:currentQuestionIndex +1,
    givenAnswer:selectedChoice,
    answeredCorrectly:answeredCorrectly,
    timestamp:formattedTime
  };

userResponses.push(Response);

});

fetchQuestions();
