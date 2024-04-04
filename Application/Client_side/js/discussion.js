// Fetch and inject navbar contents
fetch("./components/navbar_after_login.html")
.then((response) => response.text())
.then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
})
.catch((error) =>
    console.error("Error fetching navbar content:", error)
);



console.log("Discussion ID:", localStorage.discussionId);

document.getElementById("sendButton").addEventListener("click", function () {
    // Get the input value
    var commentText = document.getElementById("commentInput").value;

    // If the input is not empty
    if (commentText.trim() !== "") {
        // Create a new message element
        var messageElement = document.createElement("div");
        messageElement.classList.add("message"); // Add the message class

        // Create a new paragraph element for the message content
        var messageContent = document.createElement("p");
        messageContent.textContent = commentText;

        // Append the message content to the message element
        messageElement.appendChild(messageContent);

        // Append the message to the chat area
        document.getElementById("chatMessages").appendChild(messageElement);

        // Clear the input field
        document.getElementById("commentInput").value = "";
       
        // Send comment to server
        fetch("http://localhost:8000/savecomment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Assuming you have a JWT token stored in localStorage
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            
            body: JSON.stringify({
                content: commentText,
                discussion_id: localStorage.getItem("discussionId")
              
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to post the reply");
            }
            // Handle successful response if needed
        })
        .catch(error => {
            console.error("Error saving comment:", error);
            // Handle error if needed
        });
    }
});
