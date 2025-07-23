// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI2-DHA9BXkV___SguFiRPt3fnOoTL7us",
  authDomain: "minitrello-2ff9b.firebaseapp.com",
  projectId: "minitrello-2ff9b",
  storageBucket: "minitrello-2ff9b.firebasestorage.app",
  messagingSenderId: "493545330147",
  appId: "1:493545330147:web:79a5bc6332556f6d08bcd6",
  measurementId: "G-ER0R7SM7H9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;