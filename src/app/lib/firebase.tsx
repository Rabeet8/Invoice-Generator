// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc } from "firebase/firestore";



// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALIE8bi2wUSyTg_IR0kO4TbKVAglo_WQQ",
  authDomain: "invoice-8fae7.firebaseapp.com",
  projectId: "invoice-8fae7",
  storageBucket: "invoice-8fae7.appspot.com",
  messagingSenderId: "492967946546",
  appId: "1:492967946546:web:b7e6c024f223106a928f2b",
  measurementId: "G-KTPQQJZC1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { db };
const db = getFirestore(app);
const analytics = getAnalytics(app);