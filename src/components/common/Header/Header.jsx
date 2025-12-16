// Header.jsx - Professional Responsive Company Website Design (No Icons, No Notifications)
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Header.css'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('/')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const headerRef = useRef(null)
  const searchInputRef = useRef(null)
  const profileDropdownRef = useRef(null)

  const logoPath = '/assets/images/logos/planning insight logo-1.png'

  // Navigation items - ROUTES PRESERVED
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'Newsroom'},
    { path: '/networking-arena', label: 'Networking Arena' },
    { path: '/jobs', label: 'Job Portal' },
    { path: '/forum', label: 'Discussion Forum' },
    { path: '/learning', label: 'Learning Centre' },
    { path: '/publishing', label: 'Publishing House' }
  ]

  // Enhanced scroll behavior
  useEffect(() => {
    let ticking = false
    let lastKnownScrollPosition = 0

    const handleScroll = () => {
      lastKnownScrollPosition = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = lastKnownScrollPosition
          setIsScrolled(currentScrollY > 20)

          // Smart header hide/show
          if (currentScrollY > lastScrollY && currentScrollY > 150) {
            setShowHeader(false)
          } else {
            setShowHeader(true)
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Interactive cursor glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    const header = headerRef.current
    if (header) {
      header.addEventListener('mousemove', handleMouseMove)
      return () => header.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Active navigation tracking
  useEffect(() => {
    setActiveNav(location.pathname)
  }, [location.pathname])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
        setIsProfileDropdownOpen(false)
      }
    }

    if (isMobileMenuOpen || isSearchOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen, isSearchOpen, isProfileDropdownOpen])

  // Search input focus management
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 150)
    }
  }, [isSearchOpen])

  // Body scroll lock for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px'
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isMobileMenuOpen])

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [location.pathname])

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const handleSearchToggle = () => {
    setIsSearchOpen(prev => !prev)
  }

  const handleNavClick = (path) => {
    setActiveNav(path)
    setIsMobileMenuOpen(false)
    // Ensure navigation happens even if Link's default behaviour is blocked
    try {
      navigate(path)
    } catch (e) {
      // noop - navigation fallback
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsProfileDropdownOpen(false)
    navigate('/')
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    if (user?.displayName) {
      const names = user.displayName.split(' ')
      return names.map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    }
    return 'U'
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.displayName) {
      return user.displayName
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <>
      {/* Enhanced Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Main Header */}
      <header 
        ref={headerRef}
        className={`header ${isScrolled ? 'scrolled' : ''} ${showHeader ? 'visible' : 'hidden'}`}
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      >
        {/* Animated Glow */}
        <div className="header-glow" aria-hidden="true" />
        <div className="header-glow-cursor" aria-hidden="true" />

        <div className="header-container">
          <div className="header-main">
            {/* Logo Section */}
            <div className="logo-section">
              <Link to="/" className="logo-link" aria-label="Planning Insights Home">
                <div className="logo-img-wrapper">
                  <img 
                    src={logoPath} 
                    alt="Planning Insights Logo" 
                    className="logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'flex'
                    }}
                  />
                  <div className="logo-fallback" style={{ display: 'none' }}>
                    PI
                  </div>
                </div>
                <div className="logo-text">
                  <span className="logo-title">Planning Insights</span>
                  <span className="logo-subtitle">BUILT ENVIRONMENT</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-desktop" aria-label="Main Navigation">
              <ul className="nav-list">
                {navItems.map((item, index) => {
                  const isActive = activeNav === item.path
                  
                  return (
                    <li 
                      key={item.path} 
                      className="nav-item"
                      style={{ '--item-index': index }}
                    >
                      <Link
                        to={item.path}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => handleNavClick(item.path)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="nav-link-glow" aria-hidden="true" />
                        <span className="nav-label">{item.label}</span>
                        {item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Header Actions */}
            <div className="header-actions">
              {isAuthenticated && user ? (
                // User Profile Dropdown
                <div className="user-profile-section" ref={profileDropdownRef}>
                  <button
                    className="user-profile-btn"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    aria-label="User Profile"
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <div className="user-avatar">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt={getUserDisplayName()} />
                      ) : (
                        <span>{getInitials()}</span>
                      )}
                    </div>
                    <span className="user-name">{getUserDisplayName()}</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">
                          {user?.photoURL ? (
                            <img src={user.photoURL} alt={getUserDisplayName()} />
                          ) : (
                            <span>{getInitials()}</span>
                          )}
                        </div>
                        <div className="dropdown-info">
                          <p className="dropdown-name">{getUserDisplayName()}</p>
                          <p className="dropdown-email">{user?.email}</p>
                        </div>
                      </div>

                      <div className="dropdown-divider" />

                      <div className="dropdown-menu-items">
                        <Link 
                          to="/dashboard" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          📊 Dashboard
                        </Link>
                        <Link 
                          to="/profile" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          👤 My Profile
                        </Link>
                        <Link 
                          to="/settings" 
                          className="dropdown-item"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          ⚙ Settings
                        </Link>
                      </div>

                      <div className="dropdown-divider" />

                      <button
                        className="dropdown-item logout-btn"
                        onClick={handleLogout}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Auth Buttons
                <div className="auth-btns">
                  <Link to="/login" className="btn btn-ghost btn-sm">
                    <span className="btn-shine" aria-hidden="true" />
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">
                    <span className="btn-shine" aria-hidden="true" />
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className={`mobile-btn ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={handleMobileMenuToggle}
                aria-label="Toggle Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="search-bar">
              <form onSubmit={handleSearch} role="search">
                <input
                  ref={searchInputRef}
                  type="search"
                  className="search-input"
                  placeholder="Search jobs, courses, publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <ul>
              {navItems.map((item, index) => {
                const isActive = activeNav === item.path
                
                return (
                  <li 
                    key={item.path}
                    style={{ '--item-index': index }}
                  >
                    <Link
                      to={item.path}
                      className={isActive ? 'active' : ''}
                      onClick={() => handleNavClick(item.path)}
                    >
                      <span className="mobile-nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
              
              <li className="divider">
                <hr />
              </li>

              {isAuthenticated && user ? (
                <>
                  <li>
                    <Link to="/dashboard" onClick={() => handleNavClick('/dashboard')}>
                      <span className="mobile-nav-label">📊 Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" onClick={() => handleNavClick('/profile')}>
                      <span className="mobile-nav-label">👤 My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" onClick={() => handleNavClick('/settings')}>
                      <span className="mobile-nav-label">⚙ Settings</span>
                    </Link>
                  </li>
                  <li className="divider">
                    <hr />
                  </li>
                  <li>
                    <button 
                      className="mobile-logout-btn"
                      onClick={handleLogout}
                    >
                      <span className="mobile-nav-label">🚪 Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => handleNavClick('/login')}>
                      <span className="mobile-nav-label">Sign In</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="primary" onClick={() => handleNavClick('/signup')}>
                      <span className="mobile-nav-label">Get Started</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header