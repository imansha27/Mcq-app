async function getApQ() {
    try {
        const response = await fetch("http://localhost:8000/discussions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch discussions");
        }
        const data = await response.json();
        console.log(data);

        if (!data || !data.discussions || !Array.isArray(data.discussions)) {
            throw new Error("Invalid data format or discussions not found");
        }

        const discussions = data.discussions;
        discussions.forEach((discussion) => {
            const tableRow = document.createElement("tr");
            tableRow.dataset.discussionId = discussion._id;

            tableRow.innerHTML = `
                <td>${discussion.title}</td>
                <td>${discussion.content}</td>
                <td>${discussion.author}</td>
                <td>${discussion.category}</td>
                <td>${discussion.created_at}</td>
                <td>
                    <button class="remove-btn">Delete</button>
                </td>
            `;
            const removeButton = tableRow.querySelector(".remove-btn");
            removeButton.addEventListener("click", async (event) => {
                const tableRow = event.target.closest("tr");
                const discussionId = tableRow.dataset.discussionId;
                console.log(discussionId);
                const confirmed = confirm("Are you sure you want to delete this discussion?");
                if (confirmed) {
                    console.log("Discussion ID:", discussionId);
                    try {
                        await deleteDiscussion(discussionId);
                        tableRow.remove();
                    } catch (error) {
                        console.error("Error deleting discussion:", error);
                    }
                }
            });
            document.getElementById("submittedQuestionsBody").appendChild(tableRow);
        });
    } catch (error) {
        console.error("Error fetching discussions:", error);
    }
}

async function deleteDiscussion(discussionId) {
    try {
        const response = await fetch(`http://localhost:8000/discussions/${discussionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete discussion");
        }
        console.log("Discussion deleted successfully");
    } catch (error) {
        console.error("Error deleting discussion:", error);
        throw error; // Rethrow the error to propagate it to the caller
    }
}



getApQ();


