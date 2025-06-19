import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAzYp0Az2rgLYjsXyovIFZOG9AY7CwogH8",
    authDomain: "pulse-saas-df1a9.firebaseapp.com",
    projectId: "pulse-saas-df1a9",
    storageBucket: "pulse-saas-df1a9.firebasestorage.app",
    messagingSenderId: "956425160777",
    appId: "1:956425160777:web:e7c6f804afc3538bd71798",
    measurementId: "G-XERCRHRKQV"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;