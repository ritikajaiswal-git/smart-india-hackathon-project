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

document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('scan-status');
    let html5QrcodeScanner;

    // This function runs when a QR code is successfully scanned.
    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code scanned = ${decodedText}`, decodedResult);
        statusDiv.textContent = `Scan Successful! Stop ID: ${decodedText}. Logging...`;
        
        // Use CSS classes for styling to allow for smooth transitions
        statusDiv.classList.remove('error', 'info');
        statusDiv.classList.add('success');

        // Stop the scanner after a successful scan
        if (html5QrcodeScanner && html5QrcodeScanner.getState() === Html5QrcodeScannerState.SCANNING) {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner.", error);
            });
        }

        // Send the verification data to Firestore
        logVerification(decodedText);
    }

    // This function sends the scanned data to your database
    function logVerification(stopId) {
        // In a real app, you would get the busId and driverId from the logged-in user.
        const busId = "bus-001";
        const driverId = "driver-123";

        db.collection("qrScans").add({
            busId: busId,
            driverId: driverId,
            stopId: stopId, // This is the data from the QR code
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log("Verification logged with ID: ", docRef.id);
            statusDiv.textContent = `Verification for stop '${stopId}' logged successfully!`;
        })
        .catch((error) => {
            console.error("Error logging verification: ", error);
            statusDiv.textContent = "Error: Could not log verification.";
            statusDiv.classList.remove('success', 'info');
            statusDiv.classList.add('error');
        });
    }

    // Create a new QR code scanner object
    html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", 
        { 
            fps: 10, 
            qrbox: { width: 250, height: 250 } // Make viewfinder square
        },
        /* verbose= */ false
    );
    
    // Start the scanner
    html5QrcodeScanner.render(onScanSuccess);
});

