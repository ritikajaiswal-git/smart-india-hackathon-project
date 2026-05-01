// --- PASTE YOUR FIREBASE CONFIGURATION CODE HERE ---
const firebaseConfig = {
    apiKey: "AIzaSyD7EfoRBwElEEBnIyTblyK77b0IywfAGIA",
    authDomain: "pravah-sih-project.firebaseapp.com",
    projectId: "pravah-sih-project",
    storageBucket: "pravah-sih-project.firebasestorage.app",
    messagingSenderId: "871676813336",
    appId: "1:871676813336:web:c0e52e036edfddbad7e36d"

};
// ----------------------------------------------------

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const logBody = document.getElementById('log-body');
const placeholder = document.querySelector('.placeholder');

/**
 * Listens for new documents added to the 'qrScans' collection in Firestore.
 */
function listenForQRScans() {
    // We are listening to the entire collection.
    // .orderBy('timestamp', 'desc') ensures we always get the newest scans first.
    db.collection("qrScans").orderBy('timestamp', 'desc')
        .onSnapshot((querySnapshot) => {
            console.log("Received update from qrScans collection.");
            
            // Clear the existing log entries
            logBody.innerHTML = ''; 

            if (querySnapshot.empty) {
                 logBody.innerHTML = '<tr><td colspan="4" class="placeholder">Waiting for first scan...</td></tr>';
                 return;
            }

            // Loop through each new document (scan) that comes in
            querySnapshot.forEach((doc) => {
                const scanData = doc.data();
                
                // Create a new row for the table
                const row = document.createElement('tr');
                
                // Format the timestamp to be readable
                const timestamp = new Date(scanData.timestamp).toLocaleString();
                
                // Set the content of the row
                row.innerHTML = `
                    <td>${timestamp}</td>
                    <td>${scanData.busId}</td>
                    <td>${scanData.stopName}</td>
                    <td><span class="status-verified">Verified</span></td>
                `;
                
                // Add the new row to the table body
                logBody.appendChild(row);
            });
        }, (error) => {
            console.error("Error listening to QR scans:", error);
            placeholder.textContent = "Error connecting to the verification feed.";
        });
}

// Start listening as soon as the page loads
listenForQRScans();
