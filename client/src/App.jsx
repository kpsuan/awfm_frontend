import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { queryClient } from './lib/queryClient';
import { QuestionnaireProvider, AuthProvider, NotificationProvider, useAuth } from './context';
import QuestionnaireFlow from './pages/QuestionnaireFlow';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerificationPending from './pages/VerificationPending';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RestoreAccount from './pages/RestoreAccount';
import AccountSettings from './pages/AccountSettings';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import CareTeamPage from './pages/CareTeamPage';
import MyRecordingsPage from './pages/MyRecordingsPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SplashScreen from './components/pages/SplashScreen';
import { TopNavbar, Sidebar } from './components/common/Navigation';
import 'react-toastify/dist/ReactToastify.css';
import './styles/variables.css';
import './styles/globals.css';

// Inner component that can use auth context
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Determine page types
  const authRoutes = ['/login', '/register', '/verify-email', '/verification-pending', '/forgot-password', '/reset-password', '/restore-account'];
  const isAuthPage = authRoutes.some(route => location.pathname.startsWith(route));

  // Focus mode = questionnaire pages (hide sidebar, show hamburger)
  const isFocusMode = location.pathname.startsWith('/questionnaire');

  // Show navigation only when logged in and not on auth pages
  const showNavigation = user && !isAuthPage;

  return (
    <div className={`app ${showNavigation && !isFocusMode ? 'app--with-sidebar' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Desktop sidebar - always visible when logged in (except focus mode) */}
      {showNavigation && !isFocusMode && (
        <Sidebar isMobileOrFocus={false} />
      )}

      {/* Mobile/Focus mode sidebar - slide in/out */}
      {showNavigation && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
          isMobileOrFocus={true}
        />
      )}

      {/* Top navbar with hamburger - only on mobile or focus mode */}
      {showNavigation && isFocusMode && (
        <TopNavbar onMenuClick={handleMenuClick} />
      )}

      {/* Mobile hamburger button */}
      {showNavigation && !isFocusMode && (
        <button
          className="mobile-menu-btn"
          onClick={handleMenuClick}
          aria-label="Open menu"
        >
          <span className="material-icons">menu</span>
        </button>
      )}

      <main className="app__main">
        <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verification-pending" element={<VerificationPending />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/restore-account" element={<RestoreAccount />} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Account routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account-settings" element={<AccountSettings />} />

        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Care Team */}
        <Route path="/team/:teamId" element={<CareTeamPage />} />

        {/* My Recordings */}
        <Route path="/my-recordings" element={<MyRecordingsPage />} />

        {/* Questionnaire routes */}
        <Route path="/questionnaire/:questionId" element={<QuestionnaireFlow />} />
        <Route path="/questionnaire" element={<Navigate to="/questionnaire/Q10A" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <QuestionnaireProvider>
            <Router>
              <AppContent />
            </Router>
          </QuestionnaireProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
