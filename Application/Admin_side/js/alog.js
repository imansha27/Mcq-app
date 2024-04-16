async function Login() {
    
    const username = document.getElementById("uname").value;
    const password = document.getElementById("password").value;
    
    if (username.trim() === "" || password.trim() === "") {
        alert("Please enter both username and password.");
        return;
    }
    try {
        const response = await fetch("http://localhost:8000/alogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const result = await response.json();
            alert("Login Successful");
            window.location.href = "dashboard.html";
        } else {
            alert("Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred while logging in. Please try again later.");
    }
}
