// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyB-52MFkEgLrNqrCLnYZw2lEnKk7G4dIb0",
  authDomain: "luba-d-01.firebaseapp.com",
  databaseURL: "https://luba-d-01-default-rtdb.firebaseio.com/",
  projectId: "luba-d-01",
  storageBucket: "luba-d-01.firebasestorage.app",
  messagingSenderId: "G-E3CNQ4E0VY",
  appId: "1:969180254695:web:1b3f3f78a1ecd56d3ded42"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app); 

export { db, auth }; 
