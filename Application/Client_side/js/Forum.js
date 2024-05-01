//navbar


// Fetch and inject navbar content
fetch("./components/navbar_after_login.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
  })
  .catch((error) => console.error("Error fetching navbar content:", error));





for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  console.log("Key:", key, "Value:", value);
}




function todiscuss(discussionId) {
    localStorage.setItem('discussionId', discussionId);
    window.location.href='discussion.html'
}






//"start a new discussion" window
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
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
    const token = document.getElementById("token").value;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    console.log(formData)

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
      location.reload();
    } else {
      alert(result.error);
    }
  } catch (error) {
    console.error("Error submitting question:", error);
  }

  closeModal();
}


// Load discussions when the page loads
// window.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const response = await fetch("http://localhost:8000/discussions");
//     const discussions = await response.json();
//     const discussionContainer = document.getElementById("discussionContainer");

//     discussions.forEach((discussion) => {
//       const discussionButton = document.createElement("button");
//       discussionButton.classList.add("discussion-button");

//       // Create elements for the discussion title, author, and excerpt
//       const titleElement = document.createElement("h3");
//       titleElement.style.fontWeight = "bold";
//       titleElement.textContent = discussion.title;

//       const authorElement = document.createElement("div");
//       authorElement.textContent = "By: " + discussion.author;

//       const excerptElement = document.createElement("p");
//       excerptElement.textContent = discussion.content.substring(0, 100) + "..."; // Display first 100 characters of content

//       // Append elements to the button
//       discussionButton.appendChild(titleElement);
//       discussionButton.appendChild(authorElement);
//       discussionButton.appendChild(excerptElement);

//       // Add click event to the button
//       discussionButton.onclick = function () {
//         //todiscuss(discussion._id);
//         localStorage.setItem('discussionId', discussion._id); 
//       };

//       discussionContainer.appendChild(discussionButton);
//     });
//   } catch (error) {
//     console.error("Error loading discussions:", error);
//   }
// });
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:8000/discussions");
    const discussions = await response.json();
    const discussionContainer = document.getElementById("discussionContainer");

    discussions.forEach((discussion, index) => {
      const discussionButton = document.createElement("button");
      discussionButton.classList.add("discussion-button");
      discussionButton.style.borderBottom = "2px solid green";
     

      const titleElement = document.createElement("h3");
      titleElement.style.fontWeight = "bold";
      titleElement.textContent = discussion.title;

      const authorElement = document.createElement("div");
      authorElement.textContent = "By: " + discussion.author;

      const excerptElement = document.createElement("p");
      excerptElement.textContent = discussion.content.substring(0, 100) + "...";

      discussionButton.appendChild(titleElement);
      discussionButton.appendChild(authorElement);
      discussionButton.appendChild(excerptElement);

      discussionButton.onclick = async function () {
        localStorage.setItem('discussionId', discussion._id);
      
        const buttons = document.querySelectorAll(".discussion-button");
        buttons.forEach(button => {
          button.classList.remove("selected");
        });
        discussionButton.classList.add("selected");
      
        GetMessage();
      
       
        displayDiscussionDetails(discussion);
      };
      
      discussionContainer.appendChild(discussionButton);

      if (index === 0) {
        discussionButton.click();
      }
    });
  } catch (error) {
    console.error("Error loading discussions:", error);
  }
});

console.log("Discussion ID:", localStorage.discussionId);

for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  console.log("Key:", key, "Value:", value);
}

function openMessageModal() {
  document.getElementById("messageModal").style.display = "block";
}

function closeMessageModal() {
  document.getElementById("messageModal").style.display = "none";
  document.getElementById("messageContent").value = "";
}

function sendMessage() {
  var messageText = document.getElementById("messageContent").value;
  if (messageText.trim() !== "") {
    fetch("http://localhost:8000/savecomment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        content: messageText,
        discussion_id: localStorage.getItem("discussionId"),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to post the reply");
        }
        closeMessageModal();
        var messageElement = document.createElement("div");
        messageElement.classList.add("message");
        var messageContent = document.createElement("p");
        var bubble = document.createElement("div");
        bubble.classList.add("bubble");

        var authorContainer = document.createElement("div");
        authorContainer.classList.add("author-container");

        var authorCircle = document.createElement("div");
        authorCircle.classList.add("author-circle");
        authorCircle.textContent = comment.author.charAt(0).toUpperCase();
        authorContainer.appendChild(authorCircle);

        var usernameElement = document.createElement("div");
        usernameElement.textContent = comment.author;
        usernameElement.classList.add("username");
        authorContainer.appendChild(usernameElement);

        bubble.appendChild(authorContainer);

        var contentElement = document.createElement("div");
        contentElement.textContent = comment.content;
        contentElement.style.marginLeft = "50px";
        contentElement.style.marginBottom = "20px";
        bubble.appendChild(contentElement);

        messageElement.appendChild(bubble);
        document.getElementById("chatMessages").appendChild(messageElement);
      })
      .catch((error) => {
        console.error("Error saving comment:", error);
      });

    alert("Your reply was posted successfully!");
  } else {
    alert("Please enter a message.");
  }
}

function GetMessage() {
  const discussionId = localStorage.getItem("discussionId");
  fetch(`http://localhost:8000/getcomments?discussionId=${discussionId}`, {
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
      return response.json();
    })
    .then((data) => {
      const chatMessages = document.getElementById("chatMessages");
      chatMessages.innerHTML = "";
      data.forEach((comment) => {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        
        const authorContainer = document.createElement("div");
        authorContainer.classList.add("author-container");

        const authorCircle = document.createElement("div");
        authorCircle.classList.add("author-circle");
        authorCircle.textContent = comment.author.charAt(0).toUpperCase();
        authorContainer.appendChild(authorCircle);

        const usernameElement = document.createElement("div");
        usernameElement.textContent = comment.author;
        usernameElement.classList.add("username");
        authorContainer.appendChild(usernameElement);

        bubble.appendChild(authorContainer);

        const contentElement = document.createElement("div");
        contentElement.textContent = comment.content;
        contentElement.style.marginLeft = "50px";
        contentElement.style.marginBottom = "20px";
        bubble.appendChild(contentElement);

        chatMessages.appendChild(bubble);
      });
    })
    .catch((error) => {
      console.error("Error fetching comments:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  GetMessage();
});




async function getDiscussionDetails() {
  try {
    const discussionId = localStorage.getItem("discussionId");
    fetch(`http://localhost:8000/selectdiscussion?discussionId=${discussionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch discussion details");
        }
        return response.json();
      })
      .then((data) => {
        // Process the data here
      })
      .catch((error) => {
        console.error("Error fetching discussion details:", error);
      });
  } catch (error) {
    console.error("Error fetching discussion details:", error);
  }
}


function displayDiscussionDetails(discussionDetails) {
  const discussionDetailsContainer = document.querySelector(".discussionDetailsContainer");
  discussionDetailsContainer.innerHTML = "";
  discussionDetailsContainer.style.marginLeft = "30px";
  discussionDetailsContainer.style.width = "93%";
 discussionDetailsContainer.style.borderBottom = "4px solid #3cb300";
 // discussionDetailsContainer.style.boxShadow = " 0 10px 10px -5px rgba(0, 255, 0, 0.5)";
  discussionDetailsContainer.style.fontWeight = "bold";
  discussionDetailsContainer.style.fontStyle = "italic";

  const titleElement = document.createElement("h1");
  titleElement.textContent = discussionDetails.title;

  const authorElement = document.createElement("div");
  authorElement.textContent = "By: " + discussionDetails.author;

  const contentElement = document.createElement("p");
  contentElement.textContent = discussionDetails.content;

  // Convert UTC time to local time
  const date = new Date(discussionDetails.created_at);
  const localDate = date.toLocaleString(); // Converts to local time format

  const dateElement = document.createElement("div");
  dateElement.textContent = "Date: " + localDate;
  dateElement.style.marginBottom = "20px";

  discussionDetailsContainer.appendChild(titleElement);
  discussionDetailsContainer.appendChild(authorElement);
  discussionDetailsContainer.appendChild(contentElement);
  discussionDetailsContainer.appendChild(dateElement);
}


