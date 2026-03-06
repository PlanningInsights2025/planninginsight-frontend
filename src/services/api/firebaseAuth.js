/**
 * firebaseAuth.js  — Firebase removed, stubs kept for backward compat.
 *
 * Google sign-in is now handled via @react-oauth/google in Login.jsx / Signup.jsx.
 * AuthContext no longer uses Firebase; it relies solely on backend JWT.
 */

export const signUpWithEmail = async () => {
  throw new Error('Direct email signup removed. Use OTP flow via authAPI.')
}

export const signInWithEmail = async () => {
  throw new Error('Direct email login removed. Use OTP flow via authAPI.')
}

export const signInWithGoogle = async () => {
  throw new Error('Use useGoogleLogin() from @react-oauth/google in your component.')
}

export const signOut = async () => {
  localStorage.removeItem('authToken')
}

export const sendResetEmail = async () => {}

// No-op: auth state is now managed by JWT stored in localStorage
export const onAuthChanged = (callback) => {
  callback(null) // immediately signal "no firebase user"
  return () => {} // unsubscribe no-op
}

export default { signUpWithEmail, signInWithEmail, signInWithGoogle, signOut, sendResetEmail, onAuthChanged }
