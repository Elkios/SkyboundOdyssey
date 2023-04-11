// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "AIzaSyD81AUWoHY2rGtNLvFjMi5-uqFwK4SF0V4",

    authDomain: "skybound-odyssey.firebaseapp.com",

    databaseURL: "https://skybound-odyssey-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "skybound-odyssey",

    storageBucket: "skybound-odyssey.appspot.com",

    messagingSenderId: "750665327192",

    appId: "1:750665327192:web:a2768fcc0e0501deb3a02d"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export default firebase;

