// This code waits until the entire HTML page is loaded before running,
// which is a best practice to prevent errors.
document.addEventListener('DOMContentLoaded', () => {

    // --- PASTE YOUR FIREBASE CONFIGURATION CODE HERE ---
    // This is the key that connects your website to your specific Firebase project.
    const firebaseConfig = {
        apiKey: "AIzaSyD7EfoRBwElEEBnIyTblyK77b0IywfAGIA",
        authDomain: "pravah-sih-project.firebaseapp.com",
        projectId: "pravah-sih-project",
        storageBucket: "pravah-sih-project.firebasestorage.app",
        messagingSenderId: "871676813336",
        appId: "1:871676813336:web:c0e52e036edfddbad7e36d"

    };
    // ----------------------------------------------------


    // Initialize a connection to Firebase and get a reference to the Authentication service.
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();


    // Find all the HTML elements on the login.html page that we need to work with.
    const commuterTab = document.getElementById('commuter-tab');
    const driverTab = document.getElementById('driver-tab');
    const authorityTab = document.getElementById('authority-tab');
    
    const commuterForm = document.getElementById('commuter-form');
    const driverForm = document.getElementById('driver-form');
    const authorityForm = document.getElementById('authority-form');

    const errorMessage = document.getElementById('error-message');


    // --- Logic for switching between the user login tabs ---
    commuterTab.addEventListener('click', () => {
        commuterForm.style.display = 'block';
        driverForm.style.display = 'none';
        authorityForm.style.display = 'none';

        commuterTab.classList.add('active');
        driverTab.classList.remove('active');
        authorityTab.classList.remove('active');
        errorMessage.textContent = ''; // Clear any old error messages.
    });

    driverTab.addEventListener('click', () => {
        driverForm.style.display = 'block';
        commuterForm.style.display = 'none';
        authorityForm.style.display = 'none';

        driverTab.classList.add('active');
        commuterTab.classList.remove('active');
        authorityTab.classList.remove('active');
        errorMessage.textContent = '';
    });

    authorityTab.addEventListener('click', () => {
        authorityForm.style.display = 'block';
        commuterForm.style.display = 'none';
        driverForm.style.display = 'none';

        authorityTab.classList.add('active');
        commuterTab.classList.remove('active');
        driverTab.classList.remove('active');
        errorMessage.textContent = '';
    });

    // --- Handle Commuter Login ---
    commuterForm.addEventListener('submit', (e) => {
        // This stops the page from reloading when the form button is clicked.
        e.preventDefault();
        const email = commuterForm['c-email'].value;
        const password = commuterForm['c-password'].value;

        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Commuter signed in!', userCredential.user);
                errorMessage.textContent = 'Login successful! Redirecting to dashboard...';
                
                // After a successful commuter login, open the commuter dashboard page.
                window.location.href = 'commuter_dashboard.htm'; 
            })
            .catch(error => {
                console.error('live_map.html', error);
                errorMessage.textContent = error.message;
            });
    });

    // --- Handle Driver Login ---
     driverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = driverForm['d-email'].value;
        const password = driverForm['d-password'].value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Driver signed in!', userCredential.user);
                 errorMessage.textContent = 'Login successful! Redirecting to driver app...';
                 
                 // After a successful driver login, open the driver app page.
                 window.location.href = 'driver.html';
            })
            .catch(error => {
                console.error('Driver login failed:', error);
                errorMessage.textContent = error.message;
            });
    });

    // --- Handle Authority Login ---
     authorityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = authorityForm['a-email'].value;
        const password = authorityForm['a-password'].value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log('Authority signed in!', userCredential.user);
                 errorMessage.textContent = 'Login successful! Redirecting to authority dashboard...';
                 
                 // After a successful authority login, open the authority dashboard page.
                 window.location.href = 'authority_dashboard.html';
            })
            .catch(error => {
                console.error('Authority login failed:', error);
                errorMessage.textContent = error.message;
            });
    });
});

