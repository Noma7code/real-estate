// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fanestate-2dcf0.firebaseapp.com",
  projectId: "fanestate-2dcf0",
  storageBucket: "fanestate-2dcf0.firebasestorage.app",
  messagingSenderId: "986484057613",
  appId: "1:986484057613:web:ea5d6239238de0e6fdd744",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
