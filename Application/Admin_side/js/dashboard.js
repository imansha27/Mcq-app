function getusers() {
  fetch("http://localhost:8000/adminusers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch comment");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const usersArray = data.user;
      data.forEach((user) => {
        // Create table row and populate with user data
        const tableRow = document.createElement("tr");
        tableRow.dataset.userId = user._id;

        
        if (user.UserType === "Teacher") {
          
          tableRow.style.backgroundColor = "rgba(144, 238, 144, 0.5)";
        } else if (user.UserType === "Student") {
         
          tableRow.style.backgroundColor = "rgba(255, 255, 102, 0.5)";
        }

        tableRow.innerHTML = `
                <td>${user.UserName}</td>
                <td>${user.UserType}</td>
                <td>${user.Email}</td>
                <td>${user.FirstName}</td>
                <td>${user.LastName}</td>
                <td>${user.School}</td>
                <td>
                    <button class="remove-btn">Remove</button>
                </td>
            `;
        const removeButton = tableRow.querySelector(".remove-btn");
        removeButton.addEventListener("click", (event) => {
          const tableRow = event.target.closest("tr"); // Get the closest table row
          const userId = tableRow.dataset.userId;
          console.log(userId);
          const confirmed = confirm("Are you sure you want to remove user?");
          if (confirmed) {
            console.log("user ID:", userId);
            removeusers(userId);
            tableRow.remove();
          }
        });
        document.getElementById("userBody").appendChild(tableRow);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function removeusers(userId) {
  fetch("http://localhost:8000/delusers", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("User removed successfully");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  console.log(userId);
}

getusers();
