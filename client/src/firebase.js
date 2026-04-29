// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-project-9b40e.firebaseapp.com",
  projectId: "mern-project-9b40e",
  storageBucket: "mern-project-9b40e.firebasestorage.app",
  messagingSenderId: "660137312193",
  appId: "1:660137312193:web:cfe323001bf45598963940",
  measurementId: "G-9XVBBB1TRF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);