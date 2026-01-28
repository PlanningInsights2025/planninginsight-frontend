// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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