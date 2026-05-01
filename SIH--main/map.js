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

// --- Map Initialization & Global Variables ---
let map;
let busMarker;
const patnaCoords = [25.5941, 85.1376];
let routeLayer = L.featureGroup();

// Initialize the map
map = L.map('map').setView(patnaCoords, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
routeLayer.addTo(map);

// --- SIMULATED ROUTE DATA ---
// In a real application, this would come from your database.
const routes = {
    "bus-001": { routeName: "Route 5A", color: "#1d4ed8", path: [[25.6121, 85.1325], [25.6100, 85.1410], [25.6065, 85.1515], [25.5930, 85.1580], [25.5890, 85.1450]]},
    "bus-002": { routeName: "Route 12C", color: "#be185d", path: [[25.6200, 85.1300], [25.6150, 85.1350], [25.6100, 85.1410], [25.6050, 85.1480]]},
    "bus-003": { routeName: "Rapid Metro", color: "#059669", path: [[25.5900, 85.1200], [25.5950, 85.1300], [25.6000, 85.1400], [25.6100, 85.1410]]}
};

// --- Custom Icons ---
const busIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" width="36px" height="36px" style="background-color: #0d9488; border-radius: 50%; padding: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zM18 11H6V6h12v5z"/></svg>`,
    className: '', iconSize: [36, 36], iconAnchor: [18, 18]
});

/**
 * This function reads the bus ID from the URL.
 * For example, if the URL is live_map.html?busId=bus-001, it will return "bus-001".
 */
function getBusIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('busId');
}

/**
 * Listens for live location updates for the specific bus we are tracking.
 */
function listenForBusLocation() {
    const busId = getBusIdFromURL();
    const mapStatus = document.getElementById('map-status');

    if (!busId) {
        mapStatus.textContent = "Error: No bus selected. Please go back and select a bus to track.";
        return;
    }

    // First, draw the bus's route on the map
    drawRouteForBus(busId);

    // Now, start listening for its live location
    db.collection("busLocations").doc(busId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                const position = [data.latitude, data.longitude];
                const routeInfo = routes[busId] || { routeName: 'Unknown Route' };
                mapStatus.textContent = `Tracking ${routeInfo.routeName}. Last updated: ${new Date(data.timestamp.toDate()).toLocaleTimeString()}`;
                updateMap(position);
            } else {
                mapStatus.textContent = `Waiting for bus '${busId}' to come online...`;
            }
        }, (error) => {
            console.error("Error listening to bus location:", error);
            mapStatus.textContent = "Error connecting to the live feed.";
        });
}

/**
 * Creates or moves the bus marker on the map.
 */
function updateMap(position) {
    if (!busMarker) {
        busMarker = L.marker(position, { icon: busIcon }).addTo(map);
    } else {
        busMarker.setLatLng(position);
    }
    map.panTo(position);
}

/**
 * Draws the specified bus route on the map.
 */
function drawRouteForBus(busId) {
    const routeInfo = routes[busId];
    if (!routeInfo) return;

    routeLayer.clearLayers();
    const routeLine = L.polyline(routeInfo.path, {
        color: routeInfo.color,
        weight: 5,
        opacity: 0.8
    });
    routeLayer.addLayer(routeLine);
    map.fitBounds(routeLine.getBounds().pad(0.1));
}

// Start the whole process when the page loads
listenForBusLocation();

