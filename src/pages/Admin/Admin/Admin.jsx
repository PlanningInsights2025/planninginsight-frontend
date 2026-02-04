import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
    
    if (!token) {
      // No token, redirect to login
      navigate('/login')
      return
    }

    // Verify admin token
    fetch('http://localhost:3000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.role === 'admin') {
        setAdminUser(data)
      } else {
        // Not an admin, redirect to user dashboard
        navigate('/dashboard')
      }
      setIsLoading(false)
    })
    .catch(err => {
      console.error('Auth check failed:', err)
      navigate('/login')
    })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div style={{padding: 40, textAlign: 'center'}}>
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{padding: 40, maxWidth: 1200, margin: '0 auto'}}>
      <div style={{
        background: '#f8f9fa',
        padding: 30,
        borderRadius: 12,
        marginBottom: 30,
        border: '2px solid #524393'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0, color: '#524393', fontSize: 32}}>
              🛡️ Admin Dashboard
            </h1>
            <p style={{margin: '10px 0 0 0', color: '#666'}}>
              Welcome back, {adminUser?.firstName || adminUser?.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
        marginBottom: 30
      }}>
        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>👥</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Users</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>📚</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Courses</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>💼</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Jobs</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>

        <div style={{
          background: 'white',
          padding: 25,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{fontSize: 24, marginBottom: 10}}>📰</div>
          <h3 style={{margin: '0 0 5px 0', fontSize: 16, color: '#374151'}}>Articles</h3>
          <p style={{fontSize: 28, fontWeight: 700, margin: 0, color: '#524393'}}>-</p>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{margin: '0 0 20px 0', fontSize: 20, color: '#374151'}}>
          Quick Actions
        </h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15}}>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            📋 Manage Users
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            📚 Manage Courses
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            💼 Manage Jobs
          </button>
          <button style={{
            padding: '15px 20px',
            background: '#524393',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'left'
          }}>
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 30,
        padding: 20,
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: 8
      }}>
        <p style={{margin: 0, color: '#166534'}}>
          ✅ <strong>Admin Account Active:</strong> {adminUser?.email}
        </p>
      </div>
    </div>
  )
}

export default Admin
