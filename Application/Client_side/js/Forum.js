function todiscuss(discussionId) {
    localStorage.setItem('discussionId', discussionId);

 
    window.location.href = `discussion.html?discussionId=${discussionId}`;
}


// Function to fetch comments for a given discussionId
function fetchComments(discussionId) {
  fetch(`http://localhost:8000/getcomment?discussionId=${discussionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",

      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      // Handle successful response if needed
      return response.json();
    })
    .then((data) => {
      // Process fetched comments if needed
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
      // Handle error if needed
    });
}

// Iterate over all items in local storage and log them
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  console.log("Key:", key, "Value:", value);
}

// Fetch and inject navbar content
fetch("./components/navbar_after_login.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
  })
  .catch((error) => console.error("Error fetching navbar content:", error));

//"start a new discussion" window
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  document.getElementById("imageInput").value = "";
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("modal").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
  // Retrieve token from local storage
  const token = localStorage.getItem("token");
  // Set the value of the hidden input field to the token
  document.getElementById("token").value = token;
});

async function saveDiscussion() {
  try {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const imageInput = document.getElementById("imageInput").files[0];
    const token = document.getElementById("token").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (imageInput) {
      formData.append("image", imageInput);
    }

    const response = await fetch("http://localhost:8000/newdiscuss", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.success);
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error submitting question:", error);
  }

  closeModal();
}

//image preview on the window

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

// Load discussions when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:8000/discussions");
    const discussions = await response.json();
    const discussionContainer = document.getElementById("discussionContainer");

    discussions.forEach((discussion) => {
      const discussionBox = document.createElement("div");
      discussionBox.classList.add("box");

      const imgDiv = document.createElement("div");
      imgDiv.classList.add("img");

      const img = document.createElement("img");

      // Check if discussion.image exists before accessing its properties
      if (discussion.image) {
        img.src = discussion.image.path;
      } else {
        // Provide a default image source if discussion.image is null
        img.src = "./images/logo.png";
      }

      imgDiv.appendChild(img);

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("details");

      const contentP = document.createElement("p");
      contentP.textContent = discussion.content;

      const titleH3 = document.createElement("h3");
      titleH3.textContent = discussion.title;

      const subDetailsDiv = document.createElement("div");
      subDetailsDiv.classList.add("sub-details");

      const authorSpan = document.createElement("div");
      authorSpan.textContent = discussion.author;

      const createdAtSpan = document.createElement("div");
      createdAtSpan.textContent = discussion.created_at.slice(0, 10);

      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const commentIcon = document.createElement("i");
      commentIcon.classList.add("fa-solid", "fa-comment");

      const commentCountSpan = document.createElement("span");
      commentCountSpan.textContent = discussion.commentCount;

      commentDiv.appendChild(commentIcon);
      commentDiv.appendChild(commentCountSpan);

      const viewButton = document.createElement("button");
      viewButton.classList.add("view-button");
      viewButton.textContent = "View";
      viewButton.onclick = function () {
        todiscuss(discussion._id);
        localStorage.setItem('discussionId', discussion._id); 
    };
    
      subDetailsDiv.appendChild(authorSpan);
      subDetailsDiv.appendChild(createdAtSpan);

      const actionContainer = document.createElement("div");

      actionContainer.classList.add("action-container");

      // Append commentDiv and viewButton to actionContainer
      actionContainer.appendChild(commentDiv);
      actionContainer.appendChild(viewButton);

      // Append actionContainer to subDetailsDiv
      subDetailsDiv.appendChild(actionContainer);

      // subDetailsDiv.appendChild(commentDiv);
      // subDetailsDiv.appendChild(viewButton);

      detailsDiv.appendChild(titleH3);
      detailsDiv.appendChild(contentP);
      detailsDiv.appendChild(subDetailsDiv);

      discussionBox.appendChild(imgDiv);
      discussionBox.appendChild(detailsDiv);

      discussionContainer.appendChild(discussionBox);
    });
  } catch (error) {
    console.error("Error loading discussions:", error);
  }
});
