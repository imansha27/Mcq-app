// Fetch and inject navbar contents
fetch('./components/navbar_after_login.html')
.then(response => response.text())
.then(html => {
  document.getElementById('navbarContainer').innerHTML = html;
})
.catch(error => console.error('Error fetching navbar content:', error));





// Fetch user details
const token = localStorage.getItem("token");
console.log(token);
// Retrieve token from local storage
axios
.get("http://localhost:8000/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
.then((response) => {
  console.log(response.data.data);
  const data = response.data.data;
  document.getElementById("profile-image").src = data.image || "/Application/Client_side/images/pro.png";
  document.getElementById("username").innerText = data.UserName;
  document.getElementById("name").innerText =
    "Name: " + data.FirstName + " " + data.LastName;
  document.getElementById("email").innerText = "Email: " + data.Email;
  document.getElementById("usertype").innerText =
    "User Type: " + data.UserType;
 document.getElementById("school").innerText = "School: " + data.School;
})
  

.catch((error) => console.error("Error fetching user details:", error));










// Upload user profile image and update user details
document.getElementById("upload-button").addEventListener("click", function () {
  document.getElementById("profile-image-input").click();
});

document.getElementById("profile-image-input").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          document.getElementById("profile-image").src = e.target.result;
      };
      reader.readAsDataURL(file);

      
  }
});

// Click event for the edit-s button
document.getElementById("edit-s").addEventListener("click", function() {
  // Show the upload button
  document.getElementById("upload-button").style.display = "block";
  
  // Hide the edit button
  document.getElementById("edit-s").style.display = "none";
  
  // Show the save button
  document.getElementById("save-s").style.display = "block";
  
  // Enable the email and school input fields for editing
  document.getElementById("email-input").style.display = "block";
  document.getElementById("school-input").style.display = "block";
});





// Click event for the save-s button
document.getElementById("save-s").addEventListener("click", function() {
  // Hide the upload button
  document.getElementById("upload-button").style.display = "none";
  
  // Show the edit button
  document.getElementById("edit-s").style.display = "block";
  
  // Hide the save button
  document.getElementById("save-s").style.display = "none";
  
  // Disable the email and school input fields to prevent editing
  document.getElementById("email-input").style.display = "none";
  document.getElementById("school-input").style.display = "none";

  // Prepare form data with image, email, and school
  const formData = new FormData();
  const fileInput = document.getElementById("profile-image-input");
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formData.append("image", file);
  }
  formData.append("Email", document.getElementById("email-input").value);
  formData.append("School", document.getElementById("school-input").value);

  // Send the data to the backend for update
  axios.put("http://localhost:8000/edit-profile", formData, {
    method: "PUT",
      headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
  })
  .then((response) => {
      console.log("User details updated successfully:", response.data);
      location.reload();
      console.log(formData);
  })
  .catch((error) => {
      console.error("Error updating user details:", error);
      // Handle error and update UI if needed
  });
});














function fetchQuizResults() {
    fetch('http://localhost:8000/getrounds', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayQuizResults(data);
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display quiz results on the webpage
function displayQuizResults(results) {
  const rec1 = document.querySelector('.rec1');
  results.forEach(result => {
    const roundNo = result.roundNo;
    const button = document.createElement('button');
    button.textContent = `Round ${roundNo}`;

    const correctAnswers = result.answers.filter(answer => answer.answeredCorrectly).length;
    console.log(correctAnswers);

    const totalTime = result.answers.reduce((total, answer) => total + answer.time, 0);

    button.innerHTML = `<span style="color: green;">&nbsp;<strong>Round:</strong> ${roundNo}</span> &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; <strong>Correct Answers:</strong> ${correctAnswers} &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; <strong>Total Time:</strong> ${totalTime.toFixed(2)}`;
    button.style.padding = "5px";
    button.style.textAlign = "left";
    button.style.fontSize = "16px";


    function createBar(category, correctAnswers, color) {
      const barContainer = document.createElement('div');
      barContainer.style.display = 'flex';
      barContainer.style.flexDirection = 'column';
      barContainer.style.alignItems = 'center';
     

      const bar = document.createElement('div');
      bar.style.width = '50px';
      bar.style.height = `${correctAnswers * 20}px`;
      bar.style.backgroundColor = color;
      bar.style.marginBottom = '5px';

      const label = document.createElement('span');
      label.textContent = `${category}: ${correctAnswers}`;
      label.style.fontWeight = 'bold';

      barContainer.appendChild(bar);
      barContainer.appendChild(label);

      return barContainer;
    }


    button.addEventListener("click", function() {
      const organicCorrectAnswers = result.answers.filter(answer => answer.category === "Organic" && answer.answeredCorrectly).length;
      const inorganicCorrectAnswers = result.answers.filter(answer => answer.category === "Inorganic" && answer.answeredCorrectly).length;
      const physicalCorrectAnswers = result.answers.filter(answer => answer.category === "Physical" && answer.answeredCorrectly).length;

      rec1.innerHTML = `<strong>Round:</strong> ${roundNo} 
      
      &nbsp; &nbsp; <strong>Total Time:</strong> ${totalTime.toFixed(2)}`;

      // Create vertical bar graph
      const chartContainer = document.createElement('div');
      chartContainer.style.width = '400px';
      chartContainer.style.height = '200px';
      chartContainer.style.margin = '0 auto';
      chartContainer.style.border = '1px solid black';
      chartContainer.style.padding = '10px';
      chartContainer.style.marginBottom = '40px';
      chartContainer.style.marginTop= '40px';

      const chartTitle = document.createElement('h3');
      chartTitle.textContent = 'Correct Answers by Category';
      chartContainer.appendChild(chartTitle);

      const chart = document.createElement('div');
      chart.style.display = 'flex';
      chart.style.justifyContent = 'space-between';
      chart.style.marginTop = '100px'; // Add this line to start at the bottom

      const organicBar = createBar('Organic', organicCorrectAnswers, '#4CAF50');
      const inorganicBar = createBar('Inorganic', inorganicCorrectAnswers, '#8BC34A');
      const physicalBar = createBar('Physical', physicalCorrectAnswers, '#CDDC39');

      chart.appendChild(organicBar);
      chart.appendChild(inorganicBar);
      chart.appendChild(physicalBar);

      chartContainer.appendChild(chart);
      rec1.appendChild(chartContainer);




      const backButton = document.createElement('button');
      backButton.textContent = 'Back';
      backButton.style.marginRight = '20px';
      backButton.style.position = 'fixed';
      backButton.style.right = '340px';
      backButton.style.top = '520px';

      backButton.style.zIndex = '999';
      backButton.style.padding = '10px 20px';
      backButton.style.backgroundColor = 'lightgreen';
      backButton.style.color = '#fff';
      backButton.style.border = 'none';
      backButton.style.borderRadius = '10px';
      backButton.style.cursor = 'pointer';
      backButton.style.backgroundColor = '#3cb300';
      backButton.addEventListener('click', function() {
        rec1.innerHTML = '';
        displayQuizResults(results);
      });


      rec1.appendChild(backButton);

  
     // Get questions and choices for each question
    result.answers.forEach(answer => {
      const questionRow = document.createElement('div');
      questionRow.style.padding = '10px'; 
      questionRow.style.borderBottom = '1px solid black'; // Add this line for bottom border

      const question = document.createElement('strong');
      question.textContent = answer.Question; 
      question.style.fontWeight = 'bold'; 
      //console.log(answer.Question);
      let givenan = "";
      const choices = document.createElement('div');
      const givenanswer = document.createElement('div');
      const choice1 = document.createElement('div');
      choice1.textContent = answer.Choice1;
      if (answer.Correctans === 'Choice1') {
        choice1.style.backgroundColor = 'yellow'; 
      }
      if(answer.givenanswer === "Choice1"){
       givenan =answer.Choice1;
        givenanswer.style.fontWeight = 'bold';
      }

      const choice2 = document.createElement('div');
      choice2.textContent = answer.Choice2;
      if (answer.Correctans === 'Choice2') {
        choice1.style.backgroundColor = 'yellow'; 
      }
      if(answer.givenanswer === "Choice2"){
      givenan =answer.Choice2;
        givenanswer.style.fontWeight = 'bold';
      }

      const choice3 = document.createElement('div');
      choice3.textContent = answer.Choice3;
      if (answer.Correctans === 'Choice3') {
        choice1.style.backgroundColor = 'yellow'; 
      }
      if(answer.givenanswer === "Choice3"){
        givenan =answer.Choice3;
        givenanswer.style.fontWeight = 'bold';
      }

      const choice4 = document.createElement('div');
      choice4.textContent = answer.Choice4;
      if (answer.Correctans === 'Choice4') {
        choice1.style.backgroundColor = 'yellow'; 
      }
      if(answer.givenanswer === "Choice4"){
       givenan =answer.Choice4;
        givenanswer.style.fontWeight = 'bold';
      }

      const choice5 = document.createElement('div');
      choice5.textContent = answer.Choice5;
      if (answer.Correctans === 'Choice5') {
        choice1.style.backgroundColor = 'yellow'; 
      }
      if(answer.givenanswer === "Choice5"){
        givenan=answer.Choice5;
        givenanswer.style.fontWeight = 'bold';
      }
      choice5.style.marginBottom = '20px';


     
    
      givenanswer.textContent = `Given Ans: ${givenan}`;
      givenanswer.style.color = 'red';


      const source = document.createElement('div');
      source.textContent = answer.source;
      source.style.fontStyle = 'italic';
     

      const unit = document.createElement('div');
      unit.textContent = `${answer.unit}`;

      const submitby = document.createElement('div');
      submitby.textContent = `Submitted By: ${answer.submitby}`;

      const difficulty = document.createElement('div');
      difficulty.textContent = `Difficulty: ${answer.difficulty}`;

      const time = document.createElement('div');
      submitby.textContent = `Time taken: ${answer.time.toFixed(2)}`;




      choices.appendChild(choice1);
      choices.appendChild(choice2);
      choices.appendChild(choice3);
      choices.appendChild(choice4);
      choices.appendChild(choice5);

      // Add choices and additional information to questionRow
      questionRow.appendChild(question);
      questionRow.appendChild(choices);
      questionRow.appendChild(givenanswer);
      questionRow.appendChild(source);
      questionRow.appendChild(unit);
      questionRow.appendChild(submitby);
      questionRow.appendChild(difficulty);
      questionRow.appendChild(time);

      rec1.appendChild(questionRow);

    });
  });


  

    button.classList.add('r-button');
    rec1.appendChild(button);
  });
}

fetchQuizResults();
