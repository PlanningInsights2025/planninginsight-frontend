// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-T2kCehqBiWDClMzyx6hUwDx7o2uf8lw",
  authDomain: window.location.hostname === 'theplanninginsights.com' 
    ? "theplanninginsights.com" 
    : "planninginsight-4d5c2.firebaseapp.com",
  projectId: "planninginsight-4d5c2",
  storageBucket: "planninginsight-4d5c2.firebasestorage.app",
  messagingSenderId: "763015079836",
  appId: "1:763015079836:web:5a5d0c9b1cf89c3f184a59",
  measurementId: "G-E2MKPKTK90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics
try {
  analytics = getAnalytics(app);
} catch (err) {
  // Analytics may fail in some environments (SSR or if not supported)
  analytics = null
}

// Export commonly used Firebase services
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
// Note: getFirestore/getStorage are optional; import them where needed in the app
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()
let storage = null
let firestore = null
try {
  storage = getStorage(app)
} catch (e) {
  storage = null
}
try {
  firestore = getFirestore(app)
} catch (e) {
  firestore = null
}

export { app, analytics, auth, googleProvider, storage, firestore }