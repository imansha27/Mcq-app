//navbar

fetch("./components/navbar_after_login.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
  })
  .catch((error) => console.error("Error fetching navbar content:", error));

console.log("Discussion ID:", localStorage.discussionId);

for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  console.log("Key:", key, "Value:", value);
}

// Function to open the message modal
function openMessageModal() {
  document.getElementById("messageModal").style.display = "block";
}

// Function to close the message modal
function closeMessageModal() {
  document.getElementById("messageModal").style.display = "none";
  document.getElementById("messageContent").value = "";
}

// Function to send a message
function sendMessage() {
  var messageText = document.getElementById("messageContent").value;
  if (messageText.trim() !== "") {
    // Send message to server
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
        messageContent.textContent = messageText;

        // Append the message content to the message element
        messageElement.appendChild(messageContent);

        // Append the message to the chat area
        document.getElementById("chatMessages").appendChild(messageElement);
      })
      .catch((error) => {
        console.error("Error saving comment:", error);
      });

    alert("Your reply was posted succesfully!");
  } else {
    alert("Please enter a message.");
  }
}




function GetMessage() {
  // Get discussionId from localStorage
  const discussionId = localStorage.getItem("discussionId");

  // Send message to server with discussionId as a query parameter
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
      console.log(data);
      const chatMessages = document.getElementById("chatMessages");
      // Clear existing content
      chatMessages.innerHTML = "";

      data.forEach((comment) => {
        // Create a div element for each comment
        const bubble = document.createElement("div");
        bubble.textContent = comment.content; // Assuming the comment object has a 'content' property
        bubble.classList.add("bubble"); // Add a class to style the bubble

        const replyButton = document.createElement("button");
        replyButton.textContent = "Reply";
        replyButton.classList.add("reply-button");

        // Append the reply button to the bubble
        bubble.appendChild(replyButton);

        // Append the bubble to the chatMessages container
        chatMessages.appendChild(bubble);
      });
    })

    .catch((error) => {
      console.error("Error fetching comments:", error);
    });
}

// Call GetMessage function when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  GetMessage();
});






