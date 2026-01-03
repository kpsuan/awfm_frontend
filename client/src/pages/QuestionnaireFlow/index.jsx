import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useQuestionnaire, useAuth } from '../../context';
import { useMainQuestion, useQ1Choices, useQ2Choices, useQ3Choices, useQuestionData, usePPRPatterns } from '../../hooks';
import { teamWithAffirmation } from '../../services/mockData';
import { clearQuestionCache } from '../../services';

// Components
import MainScreen from '../../components/pages/MainScreen';
import QuestionIntro from '../../components/pages/QuestionIntro';
import CheckpointSelection from '../../components/pages/CheckpointSelection';
import ChoiceReview from '../../components/pages/ChoiceReview';
import CompletionSuccess from '../../components/pages/CompletionSuccess';
import MentalHealthCheck from '../../components/pages/MentalHealthCheck';
import { AuthModal, ExitConfirmModal } from '../../components/common/Modal';

// Phase Components
import {
  SummaryPhase,
  TeamVisibilityPhase,
  RecordVideoPhase,
  RecordAudioPhase,
  RecordTextPhase,
  RecordingCompletePhase,
  TeamRecordingsPhase,
  MemberFullSummaryPhase
} from './phases';

// Hooks & Constants
import { useQuestionnaireState } from './hooks';
import { FLOW_PHASES } from './constants';

const QuestionnaireFlow = () => {
  const navigate = useNavigate();
  const { questionId = 'Q10A' } = useParams();
  const { state, saveResponse } = useQuestionnaire();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Clear caches when questionId changes to ensure fresh data
  useEffect(() => {
    clearQuestionCache(questionId);
    // Invalidate React Query cache for this question
    queryClient.invalidateQueries({ queryKey: ['mainQuestion', questionId] });
    queryClient.invalidateQueries({ queryKey: ['choices', questionId] });
    queryClient.invalidateQueries({ queryKey: ['questionData', questionId] });
  }, [questionId, queryClient]);

  // Questionnaire state management
  const questionnaireState = useQuestionnaireState();
  const {
    currentPhase,
    q1Choices,
    q2Choices,
    q3Choices,
    completedCheckpoints,
    hasVisitedSummary,
    selectedMemberForFullSummary,
    setQ1Choices,
    setQ2Choices,
    setQ3Choices,
    setSelectedMemberForFullSummary,
    progress,
    progressPercentage,
    isComplete,
    hasStarted,
    handleContinue,
    handleBack,
    handleRestart,
    goToPhase,
    getResumePhase,
    markSummaryVisited,
  } = questionnaireState;

  // Fetch data from Django backend using React Query
  const { data: mainScreenQuestion, isLoading: loadingMain, error: errorMain } = useMainQuestion(questionId);
  const { data: q1ChoicesData, isLoading: loadingQ1, error: errorQ1 } = useQ1Choices(questionId);
  const { data: q2ChoicesData, isLoading: loadingQ2, error: errorQ2 } = useQ2Choices(questionId);
  const { data: q3ChoicesData, isLoading: loadingQ3, error: errorQ3 } = useQ3Choices(questionId);
  const { data: q1QuestionData, isLoading: loadingQ1Meta } = useQuestionData(questionId, 'q1');
  const { data: q2QuestionData, isLoading: loadingQ2Meta } = useQuestionData(questionId, 'q2');
  const { data: q3QuestionData, isLoading: loadingQ3Meta } = useQuestionData(questionId, 'q3');
  const { data: pprPatterns, isLoading: loadingPPR } = usePPRPatterns(questionId);

  // Combine question metadata
  const questionData = {
    q1: q1QuestionData,
    q2: q2QuestionData,
    q3: q3QuestionData
  };

  // Handle back with exit modal
  const onBack = () => {
    const shouldShowExitModal = handleBack();
    if (shouldShowExitModal) {
      setShowExitModal(true);
    }
  };

  // Handle exit confirmation
  const handleExitConfirm = () => {
    setShowExitModal(false);
    goToPhase(FLOW_PHASES.MAIN);
  };

  // Handle continue from main screen
  const handleMainScreenContinue = () => {
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
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    if (isComplete) {
      goToPhase(FLOW_PHASES.SUMMARY);
    } else if (hasStarted) {
      goToPhase(getResumePhase());
    } else {
      goToPhase(FLOW_PHASES.Q1_SELECTION);
    }
  };

  // Handle view full report for team member
  const handleViewFullReport = (member) => {
    setSelectedMemberForFullSummary(member);
    goToPhase(FLOW_PHASES.MEMBER_FULL_SUMMARY);
  };

  // Handle go to layer button
  const handleGoToLayer = (layerNumber) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const phases = {
      1: FLOW_PHASES.Q1_SELECTION,
      2: FLOW_PHASES.Q2_SELECTION,
      3: FLOW_PHASES.Q3_SELECTION
    };
    goToPhase(phases[layerNumber]);
  };

  // Loading state
  const isLoading = loadingMain || loadingQ1 || loadingQ2 || loadingQ3 || loadingQ1Meta || loadingQ2Meta || loadingQ3Meta;
  const error = errorMain || errorQ1 || errorQ2 || errorQ3;

  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" />
        <p>Loading questions from Django backend...</p>
      </div>
    );
  }

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

  // Don't render if data hasn't loaded yet
  if (!mainScreenQuestion || !q1ChoicesData || !q2ChoicesData || !q3ChoicesData || !questionData.q1 || !questionData.q2 || !questionData.q3) {
    return (
      <div className="loading-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Preparing questionnaire...</p>
      </div>
    );
  }

  // Render phase-specific content
  const renderPhase = () => {
    switch (currentPhase) {
      // Main Screen
      case FLOW_PHASES.MAIN:
        return (
          <MainScreen
            question={mainScreenQuestion}
            team={state.team}
            user={user}
            progress={progress}
            progressPercentage={progressPercentage}
            hasStarted={hasStarted}
            isComplete={isComplete}
            completedCheckpoints={completedCheckpoints}
            onContinue={handleMainScreenContinue}
            onBack={onBack}
            onViewTeamRecordings={() => goToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
            onGoToLayer={handleGoToLayer}
          />
        );

      // Q1 Selection
      case FLOW_PHASES.Q1_SELECTION:
        return (
          <CheckpointSelection
            question={questionData.q1}
            choices={q1ChoicesData}
            team={state.team}
            progress={progress}
            initialSelection={q1Choices}
            onSelect={setQ1Choices}
            onContinue={handleContinue}
            onBack={onBack}
            multiSelect={false}
          />
        );

      // Q1 Review
      case FLOW_PHASES.Q1_REVIEW:
        return (
          <ChoiceReview
            question={questionData.q1}
            selectedChoice={q1ChoicesData.find(c => q1Choices.includes(c.id))}
            selectedChoices={q1Choices.map(id => q1ChoicesData.find(c => c.id === id)).filter(Boolean)}
            progress={progress}
            onConfirm={handleContinue}
            onBack={onBack}
            onChangeAnswer={onBack}
          />
        );

      // Q1 Mental Health Check
      case FLOW_PHASES.Q1_MENTAL_HEALTH:
        return (
          <MentalHealthCheck
            question={questionData.q1}
            progress={progress}
            onContinue={handleContinue}
            onBack={onBack}
            onBackHome={() => goToPhase(FLOW_PHASES.MAIN)}
            variant="doing-great"
          />
        );

      // Q2 Selection
      case FLOW_PHASES.Q2_SELECTION:
        return (
          <CheckpointSelection
            question={questionData.q2}
            choices={q2ChoicesData}
            team={state.team}
            progress={progress}
            initialSelection={q2Choices}
            onSelect={setQ2Choices}
            onContinue={handleContinue}
            onBack={onBack}
            multiSelect={true}
            layout="vertical"
            isQ2={true}
          />
        );

      // Q2 Review
      case FLOW_PHASES.Q2_REVIEW:
        return (
          <ChoiceReview
            question={questionData.q2}
            selectedChoices={q2Choices.map(id => q2ChoicesData.find(c => c.id === id)).filter(Boolean)}
            progress={progress}
            onConfirm={handleContinue}
            onBack={onBack}
            onChangeAnswer={onBack}
          />
        );

      // Q2 Mental Health Check
      case FLOW_PHASES.Q2_MENTAL_HEALTH:
        return (
          <MentalHealthCheck
            question={questionData.q2}
            progress={progress}
            onContinue={handleContinue}
            onBack={onBack}
            onBackHome={() => goToPhase(FLOW_PHASES.MAIN)}
            variant="almost-there"
          />
        );

      // Q3 Selection
      case FLOW_PHASES.Q3_SELECTION:
        return (
          <CheckpointSelection
            question={questionData.q3}
            choices={q3ChoicesData}
            team={state.team}
            progress={progress}
            initialSelection={q3Choices}
            onSelect={setQ3Choices}
            onContinue={handleContinue}
            onBack={onBack}
            multiSelect={true}
            layout="vertical"
            isQ3={true}
          />
        );

      // Q3 Review
      case FLOW_PHASES.Q3_REVIEW:
        return (
          <ChoiceReview
            question={questionData.q3}
            selectedChoices={q3Choices.map(id => q3ChoicesData.find(c => c.id === id)).filter(Boolean)}
            progress={progress}
            onConfirm={handleContinue}
            onBack={onBack}
            onChangeAnswer={onBack}
          />
        );

      // Q3 Mental Health Check
      case FLOW_PHASES.Q3_MENTAL_HEALTH:
        return (
          <MentalHealthCheck
            question={questionData.q3}
            progress={progress}
            onContinue={handleContinue}
            onBack={onBack}
            onBackHome={() => goToPhase(FLOW_PHASES.MAIN)}
            variant="take-break"
          />
        );

      // Summary
      case FLOW_PHASES.SUMMARY:
        return (
          <SummaryPhase
            mainScreenQuestion={mainScreenQuestion}
            questionData={questionData}
            q1Choices={q1Choices}
            q2Choices={q2Choices}
            q3Choices={q3Choices}
            q1ChoicesData={q1ChoicesData}
            q2ChoicesData={q2ChoicesData}
            q3ChoicesData={q3ChoicesData}
            pprPatterns={pprPatterns}
            progress={progress}
            hasVisitedSummary={hasVisitedSummary}
            onContinue={handleContinue}
            onBack={onBack}
            onGoToPhase={goToPhase}
            onMarkSummaryVisited={markSummaryVisited}
          />
        );

      // Team Visibility
      case FLOW_PHASES.TEAM_VISIBILITY:
        return <TeamVisibilityPhase onGoToPhase={goToPhase} />;

      // Recording phases
      case FLOW_PHASES.RECORD_VIDEO:
        return <RecordVideoPhase onGoToPhase={goToPhase} />;

      case FLOW_PHASES.RECORD_AUDIO:
        return <RecordAudioPhase onGoToPhase={goToPhase} />;

      case FLOW_PHASES.RECORD_TEXT:
        return <RecordTextPhase onGoToPhase={goToPhase} />;

      case FLOW_PHASES.RECORDING_COMPLETE:
        return <RecordingCompletePhase onGoToPhase={goToPhase} />;

      case FLOW_PHASES.TEAM_RECORDINGS:
        return (
          <TeamRecordingsPhase
            onGoToPhase={goToPhase}
            onViewFullReport={handleViewFullReport}
          />
        );

      case FLOW_PHASES.MEMBER_FULL_SUMMARY:
        return (
          <MemberFullSummaryPhase
            selectedMember={selectedMemberForFullSummary}
            onGoToPhase={goToPhase}
          />
        );

      // Complete
      case FLOW_PHASES.COMPLETE:
        return <CompletionSuccess onRestart={handleRestart} />;

      default:
        return <div className="loading-container"><p>Loading...</p></div>;
    }
  };

  return (
    <>
      {renderPhase()}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
      <ExitConfirmModal
        isOpen={showExitModal}
        onConfirm={handleExitConfirm}
        onCancel={() => setShowExitModal(false)}
      />
    </>
  );
};

export default QuestionnaireFlow;
