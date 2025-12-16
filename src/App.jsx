import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

// Layout Components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';

// Page Components
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Jobs from './pages/Jobs/Jobs';
import JobPortal from './pages/Jobs/JobPortal';
import JobDetail from './pages/Jobs/JobDetail';
import Learning from './pages/Learning/Learning';
import CourseDetail from './components/learningCentre/CourseDetail/CourseDetail';
import Enrollment from './pages/Learning/Enrollment';
import Publishing from './pages/Publishing/Publishing';
import News from './pages/News/News';
import CollaborateEvent from './pages/News/CollaborateEvent/CollaborateEvent';
import Forum from './pages/Forum/Forum';
import ForumCreate from './pages/Forum/ForumCreate';
import ForumThreadDetail from './pages/Forum/ForumThreadDetail';
import NetworkingArena from './pages/Networking Arena/NetworkingArena';
import Admin from './pages/Admin/Admin';

// Styles
import './App.css';

/**
 * Main Application Component
 * Handles routing, providers, and layout structure
 */
function App() {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <UserProvider>
              <div className="app">
                {/* Header - Present on all pages */}
                <Header />

                {/* Main Content Area */}
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Dashboard */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Job Portal */}
                    <Route path="/jobs" element={<JobPortal />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />

                    {/* Learning Centre */}
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/learning/enroll" element={<Enrollment />} />
                    <Route path="/learning/courses/:id" element={<CourseDetail />} />

                    {/* Publishing House */}
                    <Route path="/publishing" element={<Publishing />} />

                    {/* Newsroom */}
                    <Route path="/news" element={<News />} />
                    <Route path="/collaborate-event" element={<CollaborateEvent />} />

                    {/* Discussion Forum */}
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/forum/create" element={<ForumCreate />} />
                    <Route path="/forum/threads/:id" element={<ForumThreadDetail />} />

                    {/* Networking Arena */}
                    <Route path="/networking-arena" element={<NetworkingArena />} />

                    {/* Admin Panel */}
                    <Route path="/admin/*" element={<Admin />} />

                    {/* Fallback - Redirect to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Footer - Present on all pages */}
                <Footer />

                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 4000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </UserProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;