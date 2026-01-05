import { useState, useCallback } from 'react';
import { useAuth } from '../../../context';
import { FLOW_PHASES } from '../constants';

/**
 * Hook for managing questionnaire modal states and handlers
 * Handles authentication modal and exit confirmation modal
 * @param {Object} options - Configuration options
 * @param {Function} options.goToPhase - Function to navigate to a phase
 * @param {Function} options.getResumePhase - Function to get the phase to resume from
 * @param {boolean} options.isComplete - Whether questionnaire is complete
 * @param {boolean} options.hasStarted - Whether questionnaire has started
 */
export const useQuestionnaireModals = ({
  goToPhase,
  getResumePhase,
  isComplete,
  hasStarted,
  navigate,
  currentPhase
}) => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Handle successful authentication
  const handleAuthSuccess = useCallback(() => {
    setShowAuthModal(false);
    if (isComplete) {
      goToPhase(FLOW_PHASES.SUMMARY);
    } else if (hasStarted) {
      goToPhase(getResumePhase());
    } else {
      goToPhase(FLOW_PHASES.Q1_SELECTION);
    }
  }, [isComplete, hasStarted, goToPhase, getResumePhase]);

  // Handle exit confirmation
  const handleExitConfirm = useCallback(() => {
    setShowExitModal(false);
    // If on main screen, navigate to dashboard; otherwise go to main
    if (currentPhase === FLOW_PHASES.MAIN) {
      navigate('/dashboard');
    } else {
      goToPhase(FLOW_PHASES.MAIN);
    }
  }, [currentPhase, goToPhase, navigate]);

  // Check auth and navigate or show modal
  const requireAuth = useCallback((onAuthenticated) => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    if (onAuthenticated) {
      onAuthenticated();
    }
    return true;
  }, [user]);

  // Handle main screen continue with auth check
  const handleMainScreenContinue = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isComplete) {
      goToPhase(FLOW_PHASES.SUMMARY);
    } else if (hasStarted) {
      goToPhase(getResumePhase());
    } else {
      goToPhase(FLOW_PHASES.Q1_SELECTION);
    }
  }, [user, isComplete, hasStarted, goToPhase, getResumePhase]);

  return {
    // State
    showAuthModal,
    showExitModal,
    user,

    // Setters
    setShowAuthModal,
    setShowExitModal,

    // Handlers
    handleAuthSuccess,
    handleExitConfirm,
    handleMainScreenContinue,
    requireAuth,

    // Modal props for easy spreading
    authModalProps: {
      isOpen: showAuthModal,
      onClose: () => setShowAuthModal(false),
      onSuccess: handleAuthSuccess
    },
    exitModalProps: {
      isOpen: showExitModal,
      onConfirm: handleExitConfirm,
      onCancel: () => setShowExitModal(false)
    }
  };
};

export default useQuestionnaireModals;
