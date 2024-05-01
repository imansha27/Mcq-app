// Fetch and inject navbar contents
fetch('./components/navbar_after_login.html')
.then(response => response.text())
.then(html => {
  document.getElementById('navbarContainer').innerHTML = html;
})
.catch(error => console.error('Error fetching navbar content:', error));










document
.getElementById("upload-button")
.addEventListener("click", function () {
  document.getElementById("profile-image-input").click();
});

document
.getElementById("edit-teaches-at")
.addEventListener("click", function () {
  // Show input field for editing "Teaches At"
  document.getElementById("teaches-at-value").style.display = "none";
  document.getElementById("teaches-at-input").style.display =
    "inline-block";
  document.getElementById("save-teaches-at").style.display =
    "inline-block";
  this.style.display = "none"; // Hide the "Edit" button
});

document
.getElementById("save-teaches-at")
.addEventListener("click", function () {
  // Handle saving of "Teaches At"
  const newTeachesAt =
    document.getElementById("teaches-at-input").value;
  // Send request to backend to save the newTeachesAt data
  // After successful response, update UI accordingly
  axios
    .post("/api/save-teaches-at", { teachesAt: newTeachesAt })
    .then((response) => {
      document.getElementById("teaches-at-value").innerText =
        newTeachesAt;
      document.getElementById("teaches-at-value").style.display =
        "inline-block";
      document.getElementById("teaches-at-input").style.display =
        "none";
      document.getElementById("edit-teaches-at").style.display =
        "inline-block";
      this.style.display = "none"; // Hide the "Save" button
    })
    .catch((error) =>
      console.error('Error saving "Teaches At":', error)
    );
});

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
  document.getElementById("profile-image").src = data.image;
  document.getElementById("username").innerText = data.UserName;
  document.getElementById("name").innerText =
    "Name: " + data.FirstName + " " + data.LastName;
  document.getElementById("email").innerText = "Email: " + data.Email;
  document.getElementById("usertype").innerText =
    "User Type: " + data.UserType;
  const teachesAtValue = document.getElementById("teaches-at-value");
  if (data.TeachesAt) {
    teachesAtValue.innerText = data.TeachesAt;
  } else {
    teachesAtValue.innerText = "(Not set)";
  }
})
.catch((error) => console.error("Error fetching user details:", error));

//Upload userprofile image
document
.getElementById("profile-image-input")
.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profile-image").src = e.target.result;
    };
    reader.readAsDataURL(file);
    // Send the file to the backend for upload
    const formData = new FormData();
    formData.append("image", file);
    axios
      .post("/api/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) =>
        console.log("Image uploaded successfully:", response)
      )
      .catch((error) => console.error("Error uploading image:", error));
  }
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
            
        
        button.innerHTML = `<strong>Round:</strong> ${roundNo} <strong>Correct Answers:</strong> ${correctAnswers}  <strong>Total Time:</strong> ${totalTime}`;
        button.style.padding = "5px";
        
     
        button.classList.add('r-button'); 
        rec1.appendChild(button);
    });
}

fetchQuizResults();
