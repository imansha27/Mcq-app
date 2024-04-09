// Iterate over all items in local storage and log them
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  console.log("Key:", key, "Value:", value);
  
}


// Fetch and inject navbar content
fetch("./components/navbar_before_login.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("navbarContainer").innerHTML = html;
  })
  .catch((error) => console.error("Error fetching navbar content:", error));









async function loginUser() {
  // Clear the localStorage before logging in
  //localStorage.clear();

  // Collect form data
  const username = document.getElementById("UserName").value;
  const password = document.getElementById("Password").value;
  const userType = document.getElementById("UserType").value;

  if (username.trim() === "" || password.trim() === "") {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, userType }),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Login Successful!");

      // Store the token in local storage
      localStorage.setItem("token", result.token);
      // Store the user type in local storage
      localStorage.setItem("userType", userType);

      // Redirect based on the userType
      if (result.redirect) {
        window.location.href = result.redirect;
      }
    } else {
      const result = await response.json();
      alert(result.error);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

