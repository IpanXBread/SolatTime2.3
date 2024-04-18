// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPKEm4sF3VG-DFtQCWkUQ4zgAb_eVLzV8",
  authDomain: "solattime2.firebaseapp.com",
  projectId: "solattime2",
  storageBucket: "solattime2.appspot.com",
  messagingSenderId: "216469505228",
  appId: "1:216469505228:web:f1432e4fa323f8e4f46e69"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };
