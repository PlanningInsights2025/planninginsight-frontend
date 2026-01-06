import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';

// Layout Components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute';

// Page Components
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Login from './pages/Auth/Login';
import AdminLogin from './pages/Auth/AdminLogin';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Dashboard/Profile';
import MyArticles from './pages/Dashboard/MyArticles';
import Jobs from './pages/Jobs/Jobs';
import JobPortal from './pages/Jobs/JobPortal';
import JobDetail from './pages/Jobs/JobDetail';
import Learning from './pages/Learning/Learning';
import CourseDetail from './pages/Learning/CourseDetail';
import Enrollment from './pages/Learning/Enrollment';
import Publishing from './pages/Publishing/Publishing';
import ManuscriptSubmission from './pages/Publishing/ManuscriptSubmission/ManuscriptSubmission';
import News from './pages/News/News';
import CollaborateEvent from './pages/News/CollaborateEvent/CollaborateEvent';
import ArticleSubmissionEnhanced from './components/newsroom/ArticleSubmission/ArticleSubmissionEnhanced';
import ArticleDetail from './pages/News/ArticleDetail';
import Forum from './pages/Forum/Forum';
import ForumCreate from './pages/Forum/ForumCreate';
import ForumThreadDetail from './pages/Forum/ForumThreadDetail';
import NetworkingArena from './pages/Networking Arena/NetworkingArena';
import Admin from './pages/Admin/Admin/AdminNew';

// Styles
import './App.css';

/**
 * Layout wrapper that conditionally renders Header/Footer
 */
function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {/* Header - Hidden on all admin routes */}
      {!isAdminRoute && <Header />}

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer - Hidden on all admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

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
              <AppLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                  {/* Admin Login - Separate Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Routes - Protected */}
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedAdminRoute>
                        <Admin />
                      </ProtectedAdminRoute>
                    } 
                  />

                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-articles" element={<MyArticles />} />

                    {/* Job Portal */}
                    <Route path="/jobs" element={<JobPortal />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />

                    {/* Learning Centre */}
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/learning/enroll" element={<Enrollment />} />
                    <Route path="/learning/courses/:id" element={<CourseDetail />} />

                    {/* Publishing House */}
                    <Route path="/publishing" element={<Publishing />} />
                    <Route path="/publishing/submit" element={<ManuscriptSubmission />} />

                    {/* Newsroom */}
                    <Route path="/news" element={<News />} />
                    <Route path="/news/submit" element={<ArticleSubmissionEnhanced />} />
                    <Route path="/news/edit/:articleId" element={<ArticleSubmissionEnhanced />} />
                    <Route path="/news/:articleId" element={<ArticleDetail />} />
                    <Route path="/collaborate-event" element={<CollaborateEvent />} />

                    {/* Discussion Forum */}
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/forum/create" element={<ForumCreate />} />
                    <Route path="/forum/threads/:id" element={<ForumThreadDetail />} />

                    {/* Networking Arena */}
                    <Route path="/networking-arena" element={<NetworkingArena />} />

                    {/* Fallback - Redirect to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
              </AppLayout>

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

            </UserProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;