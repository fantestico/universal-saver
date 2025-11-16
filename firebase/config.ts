// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYTwW5WsjsD7Fxqyb9qHpfRmtaGFesBXU",
  authDomain: "universal-saver-91606.firebaseapp.com",
  projectId: "universal-saver-91606",
  storageBucket: "universal-saver-91606.firebasestorage.app",
  messagingSenderId: "808076577264",
  appId: "1:808076577264:web:ce50cafccb38427189f535",
  measurementId: "G-KEWLJV9GV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);