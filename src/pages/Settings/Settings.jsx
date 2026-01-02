import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  CheckCircle, 
  Shield, 
  Mail, 
  Bell, 
  Briefcase, 
  BookOpen, 
  Users, 
  FileText, 
  Lock,
  Settings as SettingsIcon,
  TrendingUp,
  Award,
  Clock,
  AlertCircle,
  File
} from 'lucide-react'
import './Settings.css'

const Settings = () => {
  const navigate = useNavigate()
  
  // Initialize state from localStorage where applicable
  const [settings, setSettings] = useState(() => {
    // Force light mode
    localStorage.setItem('darkMode', 'false')
    return {
      emailNotifications: true,
      pushNotifications: true,
      jobAlerts: true,
      courseUpdates: true,
      forumMentions: true,
      articleUpdates: false,
      darkMode: false,
      compactMode: false,
      animationsEnabled: true,
      publicProfile: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      twoFactorAuth: false
    }
  })

  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  
  // Form states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [newEmail, setNewEmail] = useState('')

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark-mode')
      localStorage.setItem('darkMode', 'false')
    }
  }, [settings.darkMode])

  const updateSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Helper function for timezone time (simplified)
  const getTimeInTimezone = (timezone) => {
    try {
      return new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return '--:--'
    }
  }

  // Handlers for buttons
  const handlePasswordChange = () => {
    setShowPasswordModal(true)
  }

  const submitPasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('⚠️ Please fill all fields.')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('⚠️ Password must be at least 8 characters long.')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('⚠️ Passwords do not match.')
      return
    }
    
    // In a real app, this would call an API endpoint
    alert('✅ Password updated successfully!')
    setShowPasswordModal(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleEmailChange = () => {
    setShowEmailModal(true)
  }

  const submitEmailChange = () => {
    if (!newEmail) {
      alert('⚠️ Please enter an email address.')
      return
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      alert('⚠️ Please enter a valid email address.')
      return
    }
    
    // In a real app, this would call an API endpoint
    alert('✅ Verification email sent! Please check your inbox.')
    setShowEmailModal(false)
    setNewEmail('')
  }

  const handleManageSessions = () => {
    setShowSessionsModal(true)
  }
  
  const handleDataExport = () => {
    // Create a data export object
    const userData = {
      profile: {
        // Add user profile data here
        exportDate: new Date().toISOString(),
        settings: settings
      },
      activity: {
        // Activity data would come from API
        exportNote: 'This is your exported data'
      }
    }
    
    // Convert to JSON and create download
    const dataStr = JSON.stringify(userData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `planning-insights-data-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert('✅ Your data has been exported successfully!')
  }
  
  const handleAccountDeletion = () => {
    const confirmation = window.confirm(
      '⚠️ WARNING: This action cannot be undone!\n\n' +
      'Are you sure you want to permanently delete your account?\n' +
      'All your data, including:\n' +
      '- Profile information\n' +
      '- Job applications\n' +
      '- Course enrollments\n' +
      '- Published articles\n' +
      '- Forum posts\n\n' +
      'will be permanently removed.'
    )
    
    if (confirmation) {
      const finalConfirmation = window.confirm(
        'This is your FINAL WARNING!\n\n' +
        'Type "DELETE" in the next prompt to confirm account deletion.'
      )
      
      if (finalConfirmation) {
        const userInput = prompt('Please type "DELETE" to confirm:')
        if (userInput === 'DELETE') {
          // In a real app, this would call an API endpoint
          alert('🗑️ Account deletion request has been submitted. You will receive a confirmation email.')
          // Optionally redirect to logout or home page
          // navigate('/logout')
        } else {
          alert('❌ Account deletion cancelled. Text did not match.')
        }
      } else {
        alert('✅ Account deletion cancelled.')
      }
    }
  }

  return (
    <div className="settings-page-container">
      <div className="settings-header">
        <button 
          className="back-button-settings"
          onClick={() => navigate(-1)}
          title="Go back"
          aria-label="Go back"
        >
          ←
        </button>
        <div className="settings-title">
          <h2>Settings</h2>
        </div>
      </div>

      <div className="settings-content-grid">
        <div className="settings-left-column">
          <div className="settings-card profile-completion-card">
            <div className="card-header">
              <div className="icon-badge">
                <Users size={20} />
              </div>
              <h3>Profile Completion</h3>
            </div>
            <div className="completion-stats">
              <div className="completion-number">33%</div>
              <div className="completion-bar"><div className="completion-fill" style={{ width: '33%' }}></div></div>
            </div>
            <p className="completion-text">Complete your profile to unlock all features.</p>
            <button className="btn-complete-profile" onClick={() => navigate('/profile')}>Complete Profile</button>
          </div>

          <div className="settings-card security-card">
            <h3>Account Security</h3>
            <div className="security-list">
              <div className="security-item success"><CheckCircle size={16} /><span>Email Verified</span></div>
              <div className="security-item warning">
                {settings.twoFactorAuth ? <CheckCircle size={16} /> : <Shield size={16} />}
                <span>{settings.twoFactorAuth ? '2FA Enabled' : '2FA Disabled'}</span>
              </div>
              <div className="security-item success"><CheckCircle size={16} /><span>Strong Password</span></div>
            </div>
          </div>

          <div className="settings-card activity-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon blue"><Briefcase size={14} /></div>
                <div className="activity-details">
                  <p className="activity-title">Applied for Senior Planner position</p>
                  <p className="activity-meta">City Development Authority</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon green"><BookOpen size={14} /></div>
                <div className="activity-details">
                  <p className="activity-title">Enrolled in Smart City Planning</p>
                  <p className="activity-meta">Course started successfully</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-right-column">
          {/* Account Management */}
          <div className="settings-section">
            <h3>Account Management</h3>
            <div className="settings-options-list">
              <div className="settings-option">
                <div className="option-icon"><Lock size={18} /></div>
                <div className="option-info"><h4>Change Password</h4><p>Update your account password</p></div>
                <button className="btn-action" onClick={handlePasswordChange}>Update</button>
              </div>
              <div className="settings-option">
                <div className="option-icon"><Mail size={18} /></div>
                <div className="option-info"><h4>Change Email</h4><p>Update your email address</p></div>
                <button className="btn-action" onClick={handleEmailChange}>Edit</button>
              </div>
              <div className="settings-option">
                <div className="option-icon"><Shield size={18} /></div>
                <div className="option-info"><h4>Two-Factor Authentication</h4><p>Add an extra layer of security</p></div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.twoFactorAuth} 
                    onChange={() => updateSetting('twoFactorAuth')} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="settings-option">
                <div className="option-icon"><Users size={18} /></div>
                <div className="option-info"><h4>Active Sessions</h4><p>Manage your logged in devices</p></div>
                <button className="btn-action" onClick={handleManageSessions}>Manage</button>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="settings-section">
            <h3>Notification Preferences</h3>
            <div className="settings-options-list">
              <div className="settings-option">
                <div className="option-icon"><Mail size={18} /></div>
                <div className="option-info"><h4>Email Notifications</h4><p>Receive notifications via email</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={settings.emailNotifications} onChange={() => updateSetting('emailNotifications')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="settings-option">
                <div className="option-icon"><Bell size={18} /></div>
                <div className="option-info"><h4>Push Notifications</h4><p>Enable browser push notifications</p></div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={settings.pushNotifications} onChange={() => updateSetting('pushNotifications')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="settings-option">
                  <div className="option-icon"><Briefcase size={18} /></div>
                  <div className="option-info"><h4>Job Alerts</h4><p>Get notified about new job postings</p></div>
                  <label className="toggle-switch"><input type="checkbox" checked={settings.jobAlerts} onChange={() => updateSetting('jobAlerts')} /><span className="slider round"></span></label>
              </div>
              <div className="settings-option">
                  <div className="option-icon"><BookOpen size={18} /></div>
                  <div className="option-info"><h4>Course Updates</h4><p>Updates on enrolled courses</p></div>
                  <label className="toggle-switch"><input type="checkbox" checked={settings.courseUpdates} onChange={() => updateSetting('courseUpdates')} /><span className="slider round"></span></label>
              </div>
              <div className="settings-option">
                  <div className="option-icon"><Users size={18} /></div>
                  <div className="option-info"><h4>Forum Mentions</h4><p>When someone mentions you in forums</p></div>
                  <label className="toggle-switch"><input type="checkbox" checked={settings.forumMentions} onChange={() => updateSetting('forumMentions')} /><span className="slider round"></span></label>
              </div>
              <div className="settings-option">
                  <div className="option-icon"><FileText size={18} /></div>
                  <div className="option-info"><h4>Article Updates</h4><p>Newsletter and article publications</p></div>
                  <label className="toggle-switch"><input type="checkbox" checked={settings.articleUpdates} onChange={() => updateSetting('articleUpdates')} /><span className="slider round"></span></label>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="settings-section">
            <h3>Appearance & Display</h3>
            <div className="settings-options-list">
              <div className="settings-option">
                <div className="option-icon"><SettingsIcon size={18} /></div>
                <div className="option-info"><h4>Dark Mode</h4><p>Switch to dark theme</p></div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.darkMode}
                    onChange={() => updateSetting('darkMode')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="option-icon"><TrendingUp size={18} /></div>
                <div className="option-info"><h4>Compact Mode</h4><p>Show more content in less space</p></div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.compactMode}
                    onChange={() => updateSetting('compactMode')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-option">
                <div className="option-icon"><Award size={18} /></div>
                <div className="option-info"><h4>Animations</h4><p>Enable smooth animations and transitions</p></div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.animationsEnabled}
                    onChange={() => updateSetting('animationsEnabled')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="settings-section">
            <h3>Language & Region</h3>
            <div className="language-region-grid">
              <div className="language-region-item">
                <div className="lr-header">
                  <div className="lr-icon"><SettingsIcon size={20} /></div>
                  <div>
                    <h4>Language</h4>
                    <p>Choose your preferred language</p>
                  </div>
                </div>
                <select 
                  className="setting-select-new"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                </select>
              </div>

              <div className="language-region-item">
                <div className="lr-header">
                  <div className="lr-icon"><Clock size={20} /></div>
                  <div>
                    <h4>Timezone</h4>
                    <p>Your local timezone</p>
                  </div>
                </div>
                <select 
                  className="setting-select-new"
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                >
                  <option value="Asia/Kolkata">IST ({getTimeInTimezone('Asia/Kolkata')})</option>
                  <option value="America/New_York">ET ({getTimeInTimezone('America/New_York')})</option>
                  <option value="America/Los_Angeles">PT ({getTimeInTimezone('America/Los_Angeles')})</option>
                  <option value="Europe/London">GMT ({getTimeInTimezone('Europe/London')})</option>
                  <option value="Asia/Dubai">GST ({getTimeInTimezone('Asia/Dubai')})</option>
                  <option value="Asia/Singapore">SGT ({getTimeInTimezone('Asia/Singapore')})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="settings-section danger-zone">
            <h3>Data Management</h3>
            <div className="settings-options-list">
              <div className="settings-option">
                <div className="option-icon"><File size={18} /></div>
                <div className="option-info"><h4>Export Your Data</h4><p>Download a copy of your profile and activity</p></div>
                <button className="btn-action" onClick={handleDataExport}>Export</button>
              </div>

              <div className="settings-option danger">
                <div className="option-icon"><AlertCircle size={18} /></div>
                <div className="option-info"><h4>Delete Account</h4><p>Permanently remove your account and data</p></div>
                <button className="btn-action danger" onClick={handleAccountDeletion}>Delete</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <span>Your password must be at least 8 characters long and include a mix of letters and numbers.</span>
              </div>
              <div className="form-group">
                <label>
                  <span className="label-icon">🔒</span>
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="password-input"
                />
              </div>
              <div className="form-group">
                <label>
                  <span className="label-icon">🆕</span>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="password-input"
                />
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill ${passwordData.newPassword.length >= 8 ? 'strong' : 'weak'}`}
                        style={{ width: `${Math.min((passwordData.newPassword.length / 8) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className={`strength-text ${passwordData.newPassword.length >= 8 ? 'strong' : 'weak'}`}>
                      {passwordData.newPassword.length < 4 ? 'Too Weak' : 
                       passwordData.newPassword.length < 8 ? 'Weak' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>
                  <span className="label-icon">✅</span>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="password-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowPasswordModal(false)}>
                <span>Cancel</span>
              </button>
              <button className="btn-modal-submit" onClick={submitPasswordChange}>
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Email Address</h3>
              <button className="modal-close" onClick={() => setShowEmailModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <span>You will receive a verification email at your new address to confirm the change.</span>
              </div>
              <div className="form-group">
                <label>
                  <span className="label-icon">📧</span>
                  New Email Address
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="email-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowEmailModal(false)}>
                <span>Cancel</span>
              </button>
              <button className="btn-modal-submit" onClick={submitEmailChange}>
                <span>Send Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Sessions Modal */}
      {showSessionsModal && (
        <div className="modal-overlay" onClick={() => setShowSessionsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Active Sessions</h3>
              <button className="modal-close" onClick={() => setShowSessionsModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-info">These are the devices currently logged into your account.</p>
              <div className="sessions-list">
                <div className="session-item current">
                  <div className="session-icon">💻</div>
                  <div className="session-details">
                    <h4>Windows PC - Chrome</h4>
                    <p>📍 Mumbai, India</p>
                    <p className="session-active">🟢 Active now</p>
                  </div>
                  <span className="session-badge">Current</span>
                </div>
                <div className="session-item">
                  <div className="session-icon">📱</div>
                  <div className="session-details">
                    <h4>iPhone 13 - Safari</h4>
                    <p>📍 Delhi, India</p>
                    <p>🕒 2 hours ago</p>
                  </div>
                  <button className="btn-remove-session">Remove</button>
                </div>
                <div className="session-item">
                  <div className="session-icon">💻</div>
                  <div className="session-details">
                    <h4>MacBook Pro - Firefox</h4>
                    <p>📍 Bangalore, India</p>
                    <p>🕒 1 day ago</p>
                  </div>
                  <button className="btn-remove-session">Remove</button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowSessionsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings