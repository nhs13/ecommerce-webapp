// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp1iiYnsF_oC1CbjR9rgUkoe5PMyk7v8c",
  authDomain: "mern-ecom-eec6e.firebaseapp.com",
  projectId: "mern-ecom-eec6e",
  storageBucket: "mern-ecom-eec6e.appspot.com",
  messagingSenderId: "65170978552",
  appId: "1:65170978552:web:f4ee43d25ca8564ceeed0d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)