// This code waits until the entire HTML page is loaded before it runs.
document.addEventListener('DOMContentLoaded', () => {

    // --- PASTE YOUR FIREBASE CONFIGURATION CODE HERE ---
    // This object connects your website to YOUR specific Firebase project.
    // This is the most important step.
    const firebaseConfig = {
      apiKey: "AIzaSyD7EfoRBwElEEBnIyTblyK77b0IywfAGIA",
      authDomain: "pravah-sih-project.firebaseapp.com",
      projectId: "pravah-sih-project",
      storageBucket: "pravah-sih-project.firebasestorage.app",
      messagingSenderId: "871676813336",
      appId: "1:871676813336:web:c0e52e036edfddbad7e36d"
    };
    // ----------------------------------------------------

    // Initialize a connection to Firebase and get a reference to the Firestore database
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Find all the HTML elements on the driver.html page that we need to interact with
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusMessage = document.getElementById('status-message');
    const busIdEl = document.getElementById('bus-id');
    const coordinatesEl = document.getElementById('coordinates');

    let watchId = null; // This variable will store the ID of our location watcher, so we can stop it later.

    // --- Logic for the "Start Transmitting" button ---
    startBtn.addEventListener('click', () => {
        // First, check if the user's browser even supports geolocation
        if (!navigator.geolocation) {
            statusMessage.textContent = "Geolocation is not supported by your browser.";
            return;
        }

        // Don't start another process if one is already running
        if (watchId) {
            statusMessage.textContent = "Already transmitting.";
            return;
        }

        // Start watching the user's position. This function will automatically run
        // every time the device's location changes.
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                // This part runs every time we get a new, successful location update
                const { latitude, longitude } = position.coords;
                const busId = busIdEl.textContent; // Get the bus ID from the HTML

                // Update the status on the screen
                statusMessage.textContent = "Transmitting...";
                statusMessage.style.color = 'green';
                coordinatesEl.textContent = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

                // Send the location data to the Firestore database.
                // We create a collection called "busLocations" and a document inside it named after the busId.
                db.collection("busLocations").doc(busId).set({
                    lat: latitude,
                    lng: longitude,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Use the server's time for accuracy
                })
                .then(() => {
                    console.log(`Location for ${busId} updated successfully!`);
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    statusMessage.textContent = "Database Error.";
                    statusMessage.style.color = 'red';
                });
            },
            (error) => {
                // This part runs if there's an error getting the location
                console.error("Geolocation error:", error);
                statusMessage.textContent = `Error: ${error.message}`;
                statusMessage.style.color = 'red';
            }
        );

        console.log("Started location watch with ID:", watchId);
    });

    // --- Logic for the "Stop Transmitting" button ---
    stopBtn.addEventListener('click', () => {
        // Check if we are currently watching the location
        if (watchId) {
            navigator.geolocation.clearWatch(watchId); // Stop the watch
            watchId = null; // Reset our variable
            statusMessage.textContent = "Stopped.";
            statusMessage.style.color = 'red';
            coordinatesEl.textContent = "--";
            console.log("Stopped location watch.");
        } else {
            statusMessage.textContent = "Not transmitting.";
        }
    });
});

