async function registerUser() {
    // Collect form data using field names from the server-side code
    const formData = new FormData();
    formData.append('FirstName', document.getElementById('FirstName').value);
    formData.append('LastName', document.getElementById('LastName').value);
    formData.append('UserName', document.getElementById('UserName').value);
    formData.append('Email', document.getElementById('Email').value);
    formData.append('Password', document.getElementById('Password').value);
    formData.append('UserType', document.getElementById('UserType').value);

    // Log information about the request
    console.log('Making POST request to:', 'http://localhost:8000/register');
    console.log('Request method:', 'POST');
    console.log('Request headers:', {
        'Content-Type': 'multipart/form-data', // Adjust the content type if needed
    });
    console.log('Request data:', formData);

    try {
        const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            body: formData,
        });

        // Log information about the response
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Form Data:', formData);
        
        const result = await response.json();
        if (response.ok) {
            alert(result.success);
            window.location.href = "/Application/Client_side/login.html";
        } else {
            alert(result.error);
        }
    } catch (error) {
        // Log any errors that might occur during the API request
        console.error('Error registering user:', error);
    }
}


        // Fetch and inject navbar content
        fetch('./components/navbar_before_login.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('navbarContainer').innerHTML = html;
            })
            .catch(error => console.error('Error fetching navbar content:', error));