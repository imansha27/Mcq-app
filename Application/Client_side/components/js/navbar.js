


// Function to replace links based on user type
// function replaceLinks(userType) {
//     if (userType === 'Teacher') {
//         document.getElementById('lnk-home').href = '/Application/Client_side/t-home.html';
//         document.getElementById('lnk-profile').href = '/Application/Client_side/t-profile.html';
//     }
// }

console.log("what?vvvv");

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
    console.log("what?");
    console.log('Replacing links for user type:', userType);
    if (userType === 'Teacher') {
        const homeLink = document.getElementById('lnk-home');
        const profileLink = document.getElementById('lnk-profile');
        console.log('Home link:', homeLink);
        console.log('Profile link:', profileLink);
        if (homeLink && profileLink) {
            homeLink.href = 't-home.html'; // Update link href
            profileLink.href = 't-profile.html'; // Update link href
        } else {
            console.error('One or both links not found.');
        }
    }
}


function clearUserLocalStorage() {
    const username=localStorage.getItem('username');
    console.log("nnnnnfnfnfn");
    console.log(username)
    if(username){
      localSrorage.removeItem(username+"_token");
       localSrorage.removeItem(username+"_userType");

        console.log("User data cleared for",username);
    }else{
        console.error('No user data found');
    }
}