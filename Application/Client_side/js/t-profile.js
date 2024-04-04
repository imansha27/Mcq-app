

fetch("./components/navbar_after_login.html")
.then((response) => response.text())
.then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
})
.catch((error) =>
    console.error("Error fetching navbar content:", error)
);

      function toggleUploadButtonVisibility(show) {
      const uploadButton = document.getElementById("upload-button");
      uploadButton.style.display = show ? "block" : "none";
    }



    // Handle profile image input
    document.getElementById("upload-button").addEventListener("click", function () {
      document.getElementById("profile-image-input").click(); 
    });





    // Edit/Save button click event
     document.getElementById("edit-save-button").addEventListener("click", function () {
      const isEditMode = this.innerText === "Edit";
      toggleEditInputs(isEditMode); // Toggle edit inputs
      toggleUploadButtonVisibility(isEditMode); 
      console.log("Clicked Save Button");// Toggle upload button visibility
      if (!isEditMode) saveChanges(); 
    });

    // Function to toggle between edit and view mode for all inputs
    function toggleEditInputs(editMode) {
      const elements = [ "email", "teaches-at"];
      elements.forEach((elementId) => {
        const viewElement = document.getElementById(`${elementId}-value`);
        const editElement = document.getElementById(`${elementId}-input`);
        if (editMode) {
          viewElement.style.display = "none";
          editElement.style.display = "inline-block";
        } else {
          viewElement.style.display = "inline-block";
          editElement.style.display = "none";
        }
      });
    
      document.getElementById("edit-save-button").innerText = editMode ? "Save" : "Edit";
    }




 
  // Function to save changes to Email, and Teaches At and image fields
  function saveChanges() {
    console.log("Saving Changes...");
    const newEmail = document.getElementById("email-input").value;
    const newTeachesAt = document.getElementById("teaches-at-input").value;

    const token = localStorage.getItem("token");
    const imageData = document.getElementById("profile-image").src; // Get the image data
    axios.post("http://localhost:8000/edit-profile", {
      Email: newEmail,
      School: newTeachesAt,
      image: imageData, // Send the image data to the server
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const data = response.data;
        console.log("Profile data saved successfully:", data);
      })
      .catch((error) => console.error("Error saving profile data:", error));
  }

  // Fetch user details
  const token = localStorage.getItem("token");
  console.log(token);
  axios.get("http://localhost:8000/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      console.log(response.data.data);
      const data = response.data.data;
      document.getElementById("profile-image").src = data.image;
      document.getElementById("username").innerText = data.UserName;
      document.getElementById("name-value").innerText = data.FirstName + " " + data.LastName;
      document.getElementById("email-value").innerText = data.Email;
      document.getElementById("usertype").innerText = data.UserType;
      const teachesAtValue = document.getElementById("teaches-at-value");
      if (data.TeachesAt) {
        teachesAtValue.innerText = data.TeachesAt;
      } else {
        teachesAtValue.innerText = "(Not set)";
      }
    })
    .catch((error) => console.error("Error fetching user details:", error));