// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiIBhmE-UlaHeWXhfy3YDtdGyRvIzyaug",
  authDomain: "dating-app-017.firebaseapp.com",
  projectId: "dating-app-017",
  storageBucket: "dating-app-017.appspot.com",
  messagingSenderId: "243770099040",
  appId: "1:243770099040:web:b5958390bfa10b120f0a05",
  measurementId: "G-03B3QB2WCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication instance

export { auth };
