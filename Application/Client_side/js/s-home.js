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



let currentQuestionIndex =0;
let question=[];

const fetchQuestions =() =>{
  const token =window.localStorage.getItem("token");
  console.log(token);
  axios.get("http://localhost:8000/quizques",{
    headers:{
      "Content-Type": "application/json",
               
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
  })
  .then((response)=>{
    questionsData =response.data;
    console.log("Questions Data:", questionsData); 
    displayQuestion(currentQuestionIndex);
  })
  .catch((error)=>console.error("Error fetching Questions:",error));
};

const displayQuestion =(index)=>{
  //console.log("Displaying question at index:", index); 
  const data =questionsData[index];
  //console.log("Question:", data);
  if(data){
   
    //document.getElementById("img").src = data.image;
    
    document.getElementById("Question").innerText = data.Question;
    document.getElementById("ch1").innerText = data.Choice1;
    document.getElementById("ch2").innerText = data.Choice2;
    document.getElementById("ch3").innerText = data.Choice3;
    document.getElementById("ch4").innerText = data.Choice4;
    document.getElementById("ch5").innerText = data.Choice5;
  }
};

$("#next-btn").click(()=>{
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
});

fetchQuestions();


