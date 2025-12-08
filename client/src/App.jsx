import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QuestionnaireProvider } from './context';
import QuestionnaireFlow from './pages/QuestionnaireFlow';
import SplashScreen from './components/pages/SplashScreen';
import { TopNavbar } from './components/common/Navigation';
import './styles/variables.css';
import './styles/globals.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleMenuClick = () => {
    // Handle menu click - can be expanded for drawer/sidebar
    console.log('Menu clicked');
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={3000} />;
  }

  return (
    <QuestionnaireProvider>
      <Router>
        <div className="app">
          <TopNavbar onMenuClick={handleMenuClick} />
          <Routes>
            <Route path="/questionnaire/*" element={<QuestionnaireFlow />} />
            <Route path="/" element={<Navigate to="/questionnaire" replace />} />
            <Route path="*" element={<Navigate to="/questionnaire" replace />} />
          </Routes>
        </div>
      </Router>
    </QuestionnaireProvider>
  );
}

export default App;
