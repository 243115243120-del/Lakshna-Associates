// Firebase configuration for Lakshna Associates.
// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Add a Web App and paste its config below.
// 3) Enable Authentication > Sign-in method > Email/Password.
// 4) Create a Firestore database.
// 5) Publish firestore.rules from this project.
// 6) Create your first admin user using the Admin Portal, copy the user's UID,
//    then create Firestore document: admins/{UID} with { role: "admin", name: "..." }.
//
// Do NOT put service-account/private keys in this file. The web config below is
// designed to be public; Firestore Security Rules are what protect your data.

export const firebaseConfig = {
  apiKey: "AIzaSyBG_aF7Oqv1heOH8Nl10ddCT_X-j0oGSJw",
  authDomain: "lakshna-associates.firebaseapp.com",
  projectId: "lakshna-associates",
  storageBucket: "lakshna-associates.firebasestorage.app",
  messagingSenderId: "631279387920",
  appId: "1:631279387920:web:21c2cc03d5cb72aaa65195",
  measurementId: "G-QSDYQNR39Q"
};