function clearLocalStorage() {
    localStorage.clear();
}

// Function to replace links based on user type
function replaceLinks(userType) {
    if (userType === 'Teacher') {
        document.getElementById('lnk-home').href = 't-home.html';
        document.getElementById('lnk-profile').href = 't-profile.html';
    }
}

// Retrieve user type from local storage and replace links
window.addEventListener('DOMContentLoaded', function() {
    const userType = localStorage.getItem('userType');
    if (userType) {
        replaceLinks(userType);
    }
});