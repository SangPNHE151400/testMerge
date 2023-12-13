// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration

import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyBaXVfVhfQJ55XRxUlHSpcSQVep5AGo8so",
    authDomain: "capstone-84115.firebaseapp.com",
    projectId: "capstone-84115",
    storageBucket: "capstone-84115.appspot.com",
    messagingSenderId: "578816052911",
    appId: "1:578816052911:web:929ca58d7e99a3b17d0e5a",
    measurementId: "G-NB8SL5BC8T"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
