//navbar

fetch("./components/navbar_after_login.html")
.then((response) => response.text())
.then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
})
.catch((error) =>
    console.error("Error fetching navbar content:", error)
);





 console.log("Discussion ID:", localStorage.discussionId);

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
               
                 "Authorization": `Bearer ${localStorage.getItem("token")}`
             },
             body: JSON.stringify({
                 content: messageText,
                 discussion_id: localStorage.getItem("discussionId")
             })
         })
         .then(response => {
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
         .catch(error => {
             console.error("Error saving comment:", error);
             
         });
         
         
         alert("Your reply was posted succesfully!")
     } else {
        
         alert("Please enter a message.");
     }
 }