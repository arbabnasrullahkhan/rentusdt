// firebase-config.js - Centralized Firebase Initializer with Analytics, Auth, and Firestore
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDK9AkYXNPVAVHAak0F6aVIRM2RCZvNR9M",
  authDomain: "rental-dollor.firebaseapp.com",
  projectId: "rental-dollor",
  storageBucket: "rental-dollor.firebasestorage.app",
  messagingSenderId: "644498779322",
  appId: "1:644498779322:web:acaedbecf1844ab62ba683",
  measurementId: "G-YZBYEV54Q9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {});

export { app, auth, db, googleProvider, analytics };
