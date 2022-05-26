// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQbg8oiVOWP0alWMeWB6rXG0DXpv8nMuY",
  authDomain: "realtime-social-media.firebaseapp.com",
  projectId: "realtime-social-media",
  storageBucket: "realtime-social-media.appspot.com",
  messagingSenderId: "207924056563",
  appId: "1:207924056563:web:34ad3638ec08d9bce48286",
  measurementId: "G-9M582KVT19"
};

// Initialize Firebase
const app = !getApps().length ?  initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()
const storage = getStorage();

export default app
export { auth, db, storage }
