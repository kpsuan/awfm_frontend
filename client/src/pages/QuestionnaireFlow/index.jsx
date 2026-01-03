import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQuestionnaire } from '../../context';

// Modals
import { AuthModal, ExitConfirmModal } from '../../components/common/Modal';

// Components
import { PhaseRenderer } from './components';

// Hooks
import {
  useQuestionnaireState,
  useQuestionnaireData,
  useQuestionnaireModals,
  useChoicesSync
} from './hooks';

// Constants
import { FLOW_PHASES } from './constants';

/**
 * QuestionnaireFlow Component
 * Main orchestrator for the questionnaire experience
 * Manages state, data fetching, and phase rendering through configuration
 */
const QuestionnaireFlow = () => {
  const { questionId = 'Q10A' } = useParams();
  const { state } = useQuestionnaire();

  // 1. Flow state management (choices, phase, progress) - per question
  const flowState = useQuestionnaireState(questionId);
  const {
    currentPhase,
    q1Choices, q2Choices, q3Choices,
    setQ1Choices, setQ2Choices, setQ3Choices,
    completedCheckpoints, setCompletedCheckpoints,
    hasVisitedSummary,
    selectedMemberForFullSummary,
    setSelectedMemberForFullSummary,
    progress, progressPercentage,
    isComplete, hasStarted,
    handleContinue, handleBack, handleRestart,
    goToPhase, getResumePhase, markSummaryVisited
  } = flowState;

  // 2. Fetch all questionnaire data
  const {
    mainScreenQuestion,
    choices,
    questionData,
    pprPatterns,
    isLoading,
    isReady,
    error
  } = useQuestionnaireData(questionId);

  // 3. Modal management
  const modals = useQuestionnaireModals({
    goToPhase,
    getResumePhase,
    isComplete,
    hasStarted
  });

  // 4. Choices sync with backend
  const { handleConfirmAndSave } = useChoicesSync(questionId, choices, {
    q1Choices, q2Choices, q3Choices,
    setQ1Choices, setQ2Choices, setQ3Choices,
    setCompletedCheckpoints,
    handleContinue
  });

  // Handle back with exit modal
  const onBack = useCallback(() => {
    const shouldShowExitModal = handleBack();
    if (shouldShowExitModal) {
      modals.setShowExitModal(true);
    }
  }, [handleBack, modals]);

  // Handle view full report for team member
  const handleViewFullReport = useCallback((member) => {
    setSelectedMemberForFullSummary(member);
    goToPhase(FLOW_PHASES.MEMBER_FULL_SUMMARY);
  }, [setSelectedMemberForFullSummary, goToPhase]);

  // Handle go to layer button
  const handleGoToLayer = useCallback((layerNumber) => {
    if (!modals.user) {
      modals.setShowAuthModal(true);
      return;
    }
    const phases = {
      1: FLOW_PHASES.Q1_SELECTION,
      2: FLOW_PHASES.Q2_SELECTION,
      3: FLOW_PHASES.Q3_SELECTION
    };
    goToPhase(phases[layerNumber]);
  }, [modals, goToPhase]);

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" />
        <p>Loading questions from Django backend...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Error loading data</h2>
        <p style={{ color: 'red' }}>{error.message}</p>
        <p>Make sure Django backend is running at http://localhost:8000</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Retry
        </button>
      </div>
    );
  }

  // Not ready state
  if (!isReady) {
    return (
      <div className="loading-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Preparing questionnaire...</p>
      </div>
    );
  }

  // Build context for PhaseRenderer
  const phaseContext = {
    // Data
    mainScreenQuestion,
    choices,
    questionData,
    pprPatterns,
    team: state.team,

    // Flow state
    q1Choices, q2Choices, q3Choices,
    setQ1Choices, setQ2Choices, setQ3Choices,
    completedCheckpoints,
    hasVisitedSummary,
    selectedMemberForFullSummary,
    progress,
    progressPercentage,
    isComplete,
    hasStarted,

    // Handlers
    handleContinue,
    handleConfirmAndSave,
    handleRestart,
    goToPhase,
    markSummaryVisited,
    onBack,
    handleViewFullReport,
    handleGoToLayer,
    handleMainScreenContinue: modals.handleMainScreenContinue,

    // User
    user: modals.user
  };

  return (
    <>
      <PhaseRenderer phase={currentPhase} context={phaseContext} />
      <AuthModal {...modals.authModalProps} />
      <ExitConfirmModal {...modals.exitModalProps} />
    </>
  );
};

export default QuestionnaireFlow;
