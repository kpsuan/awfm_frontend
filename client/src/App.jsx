import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { queryClient } from './lib/queryClient';
import { QuestionnaireProvider, AuthProvider } from './context';
import QuestionnaireFlow from './pages/QuestionnaireFlow';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import VerificationPending from './pages/VerificationPending';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RestoreAccount from './pages/RestoreAccount';
import AccountSettings from './pages/AccountSettings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SplashScreen from './components/pages/SplashScreen';
import { TopNavbar, Sidebar } from './components/common/Navigation';
import 'react-toastify/dist/ReactToastify.css';
import './styles/variables.css';
import './styles/globals.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QuestionnaireProvider>
          <Router>
            <div className="app">
              <ToastContainer position="top-right" autoClose={3000} />
              <TopNavbar onMenuClick={handleMenuClick} />
              <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
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
                <Route path="/account-settings" element={<AccountSettings />} />

                {/* Questionnaire routes */}
                <Route path="/questionnaire/:questionId" element={<QuestionnaireFlow />} />
                <Route path="/questionnaire" element={<Navigate to="/questionnaire/Q10A" replace />} />
                <Route path="/" element={<Navigate to="/questionnaire/Q10A" replace />} />
                <Route path="*" element={<Navigate to="/questionnaire/Q10A" replace />} />
              </Routes>
            </div>
          </Router>
        </QuestionnaireProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
