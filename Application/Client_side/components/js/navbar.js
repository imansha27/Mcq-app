


// Function to replace links based on user type
// function replaceLinks(userType) {
//     if (userType === 'Teacher') {
//         document.getElementById('lnk-home').href = '/Application/Client_side/t-home.html';
//         document.getElementById('lnk-profile').href = '/Application/Client_side/t-profile.html';
//     }
// }



// Retrieve user type from local storage and replace links
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const userType =localStorage.getItem('userType');
        if (userType) {
            replaceLinks(userType);
        }
    }, 100); // Delay in milliseconds
});


function replaceLinks(userType) {
   
    console.log('Replacing links for user type:', userType);
    if (userType === 'Teacher') {
        const homeLink = document.getElementById('lnk-home');
        const profileLink = document.getElementById('lnk-profile');
        //console.log('Home link:', homeLink);
        //console.log('Profile link:', profileLink);
        if (homeLink && profileLink) {
            homeLink.href = 't-home.html'; 
            profileLink.href = 't-profile.html'; 
        } else {
            console.error('One or both links not found.');
        }
    }
}


function clearUserLocalStorage() {
    localStorage.clear();

}