// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpV6tU6HjwsQ6FRxqvCSE61AiZSFRZrkA",
  authDomain: "mern-auth-ce198.firebaseapp.com",
  projectId: "mern-auth-ce198",
  storageBucket: "mern-auth-ce198.appspot.com",
  messagingSenderId: "20223859218",
  appId: "1:20223859218:web:050eae897d1835806256cb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);