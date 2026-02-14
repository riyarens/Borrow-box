// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCSjlO93tT8D35UGcl0E3eN1cHPD4IIrzE",
    authDomain: "borrowbox-42e02.firebaseapp.com",
    projectId: "borrowbox-42e02",
    storageBucket: "borrowbox-42e02.firebasestorage.app",
    messagingSenderId: "120565837629",
    appId: "1:120565837629:web:dd395a98d2b475108a9f54"
};

// Initialize Firebase
console.log("Firebase Config:", firebaseConfig); // Debugging: Check console for correct values
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
