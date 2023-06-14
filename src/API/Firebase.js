// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBH_6yt_DopgHTt7-bbNAkCW5EFXhzeR4Q',
  authDomain: 'moviematrix-b5fbb.firebaseapp.com',
  projectId: 'moviematrix-b5fbb',
  storageBucket: 'moviematrix-b5fbb.appspot.com',
  messagingSenderId: '62499366993',
  appId: '1:62499366993:web:cd86240ef6f04b605df070',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
