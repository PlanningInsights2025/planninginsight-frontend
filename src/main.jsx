import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Main App Component
import App from './App'

// Global Styles
import './index.css'

/**
 * Main Application Entry Point
 * Sets up providers and renders the app
 */
const Main = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

// Render the app
const container = document.getElementById('root')

if (container) {
  const root = ReactDOM.createRoot(container)
  root.render(<Main />)
} else {
  console.error('Failed to find the root element')
}

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Error Boundary for global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error)
  // In production, you might want to send this to an error reporting service
})

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  event.preventDefault()
})

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Log performance marks in development
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`${entry.name}: ${entry.duration}ms`)
    })
  })
  
  observer.observe({ entryTypes: ['measure'] })
}

export default Main