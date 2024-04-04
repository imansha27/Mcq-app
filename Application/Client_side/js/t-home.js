fetch("./components/navbar_after_login.html")
            .then((response) => response.text())
            .then((html) => {
                document.getElementById("navbarContainer").innerHTML = html;
            })
            .catch((error) =>
                console.error("Error fetching navbar content:", error)
            );



//token
window.addEventListener("DOMContentLoaded", () => {
// Retrieve token from local storage
const token = localStorage.getItem("token");
// Set the value of the hidden input field to the token
document.getElementById("token").value = token;
});



// Function to discard the question
function discard() {
// Reset textarea and input field values
document.getElementById("questionInput").value = "";
document.getElementById("choice1Input1").value = "";
document.getElementById("choice1Input2").value = "";
document.getElementById("choice1Input3").value = "";
document.getElementById("choice1Input4").value = "";
document.getElementById("choice1Input5").value = "";
document.getElementById("imageInput").value = "";
document.getElementById("imagePreview").style.backgroundImage = "";
document.getElementById("corr").value = "";
document.getElementById("cate").value = "";
document.getElementById("source").value = "";
}

//Function to show the image preview
function previewImage(event) {
const fileInput = event.target;
const files = fileInput.files;

if (files.length > 0) {
  const file = files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.style.backgroundImage = `url(${e.target.result})`;
    imagePreview.style.backgroundSize = "contain"; // Adjusted to 'contain'
    imagePreview.style.backgroundRepeat = "no-repeat";
  };

  reader.readAsDataURL(file);
} else {
  // Clear the preview if no file selected
  const imagePreview = document.getElementById("imagePreview");
  imagePreview.style.backgroundImage = "none";
}
}

// Function to handle form submission
async function submitQuestion() {
try {
  // Collect form data
  const question = document.getElementById("questionInput").value;
  const choice1 = document.getElementById("choice1Input1").value;
  const choice2 = document.getElementById("choice1Input2").value;
  const choice3 = document.getElementById("choice1Input3").value;
  const choice4 = document.getElementById("choice1Input4").value;
  const choice5 = document.getElementById("choice1Input5").value;
  const correctAnswer = document.getElementById("corr").value;
  const category = document.getElementById("cate").value;
  const source = document.getElementById("source").value;
  const token = document.getElementById("token").value;
  const imageInput = document.getElementById("imageInput").files[0]; // Get the image file

  // Prepare form data with the image
  const formData = new FormData();
  formData.append("Question", question);
  formData.append("Choice1", choice1);
  formData.append("Choice2", choice2);
  formData.append("Choice3", choice3);
  formData.append("Choice4", choice4);
  formData.append("Choice5", choice5);
  formData.append("Correctans", correctAnswer);
  formData.append("Category", category);
  formData.append("source", source);

  if (imageInput) {
    formData.append("image", imageInput);
  }

  // Make a POST request to submit the question
  const response = await fetch("http://localhost:8000/submitques", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // Parse response
  const result = await response.json();
  if (response.ok) {
    alert(result.success);
  } else {
    alert(result.error);
  }
} catch (error) {
  console.error("Error submitting question:", error);
}
}

// Attach submitQuestion function to submit button click event
document.getElementById("sub").addEventListener("click", submitQuestion);