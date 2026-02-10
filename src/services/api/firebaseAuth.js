import { auth, googleProvider } from '../../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'

/**
 * Sign up with email & password using Firebase Auth
 * @param {string} email
 * @param {string} password
 * @param {object} extraProfile - optional { displayName, photoURL }
 */
export const signUpWithEmail = async (email, password, extraProfile = {}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  if (extraProfile && (extraProfile.displayName || extraProfile.photoURL)) {
    await updateProfile(userCredential.user, extraProfile)
  }
  return userCredential.user
}

/**
 * Sign in with email & password
 */
export const signInWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

/**
 * Sign in with Google redirect
 */
export const signInWithGoogle = async () => {
  await signInWithRedirect(auth, googleProvider)
}

/**
 * Get redirect result after Google sign-in
 */
export const getGoogleRedirectResult = async () => {
  return await getRedirectResult(auth)
}

/**
 * Sign out
 */
export const signOut = async () => {
  await firebaseSignOut(auth)
}

/**
 * Send password reset email
 */
export const sendResetEmail = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

/**
 * Subscribe to auth state changes
 * callback receives the firebase user or null
 * returns the unsubscribe function
 */
export const onAuthChanged = (callback) => {
  return onAuthStateChanged(auth, callback)
}

export default {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  getGoogleRedirectResult,
  signOut,
  sendResetEmail,
  onAuthChanged,
}
