# 🚍 Smart Bus Tracking System (SIH Project)

## 📌 Overview

This project was developed during the **Smart India Hackathon (SIH)**.
It is a web-based system that enables **real-time bus tracking** and improves public transport visibility.

---

## 🎯 Problem Statement

In many cities:

* Bus arrival time is uncertain
* No real-time tracking system
* Passengers face delays and confusion

---

## 💡 Solution

This system provides:

* 📍 Live bus tracking on map
* 🔐 Login system (Driver / User / Authority)
* 📷 QR-based stop logging
* 📊 Monitoring dashboard

---

## ⚙️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Map Integration

* Leaflet.js
* OpenStreetMap

### Backend

* Firebase Authentication
* Firebase Firestore

---

## 🔁 How It Works

### 🚍 Driver

* Logs in
* Starts transmitting location
* GPS data is sent to Firebase

### 👤 User

* Logs in
* Views live bus location on map

### 🧑‍💼 Authority

* Views QR scan logs
* Monitors system activity

---

## 🔗 System Flow

Driver → Firebase → Map → User
Driver → QR Scan → Firebase → Dashboard

---

## ✨ Features

* Real-time tracking
* Interactive map
* QR scan logging
* Multi-user system

---

## ⚠️ Limitations

* No ETA calculation
* No GPS + QR validation
* Basic backend logic

---

## 🚀 Future Improvements

* ETA prediction
* Better UI/UX
* Advanced backend logic

---

## 📌 Conclusion

This project demonstrates a **real-time tracking system using Firebase and Leaflet**, developed as part of SIH.
