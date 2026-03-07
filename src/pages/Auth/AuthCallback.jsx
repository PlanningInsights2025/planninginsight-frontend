import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../contexts/NotificationContext'

/**
 * Handles the redirect back from Google OAuth.
 * Backend redirects to /auth/callback#token=...&userId=...
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showNotification } = useNotification()

  useEffect(() => {
    const hash = window.location.hash.slice(1) // remove leading #
    const params = new URLSearchParams(hash)
    const token = params.get('token')
    const searchParams = new URLSearchParams(window.location.search)
    const error = searchParams.get('error')

    if (error) {
      showNotification('Google sign-in failed. Please try again.', 'error')
      navigate('/login')
      return
    }

    if (!token) {
      showNotification('No token received. Please try again.', 'error')
      navigate('/login')
      return
    }

    // Decode user info from JWT payload (no secret needed for reading public fields)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      localStorage.removeItem('isAdminSession')
      localStorage.removeItem('adminToken')
      localStorage.setItem('authToken', token)
      login({ id: payload.userId, email: payload.email, role: payload.role })
      showNotification('Signed in with Google', 'success')
      navigate('/dashboard')
    } catch {
      showNotification('Invalid token received. Please try again.', 'error')
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: 16 }}>Signing you in...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
