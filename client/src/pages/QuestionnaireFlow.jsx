import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../context';
import MainScreen from '../components/pages/MainScreen';
import QuestionIntro from '../components/pages/QuestionIntro';
import CheckpointSelection from '../components/pages/CheckpointSelection';
import ChoiceReview from '../components/pages/ChoiceReview';
import CompletionSuccess from '../components/pages/CompletionSuccess';
import MentalHealthCheck from '../components/pages/MentalHealthCheck';
import Summary from '../components/pages/Summary';
import TeamVisibilitySuccess from '../components/pages/TeamVisibilitySuccess';
import RecordVideo from '../components/pages/RecordVideo';
import RecordingComplete from '../components/pages/RecordingComplete';
import TeamRecordings from '../components/pages/TeamRecordings';
import FullSummary from '../components/pages/FullSummary';
import {
  mainScreenQuestion,
  questionData,
  q1ChoicesData,
  q2ChoicesData,
  q3ChoicesData,
  teamWithAffirmation
} from '../services/mockData';

// Flow for each question: Question -> Review -> Mental Health Check
// After all 3 questions: Summary -> Team Visibility -> Complete
const FLOW_PHASES = {
  MAIN: 'main',
  Q1_SELECTION: 'q1_selection',
  Q1_REVIEW: 'q1_review',
  Q1_MENTAL_HEALTH: 'q1_mental_health',
  Q2_SELECTION: 'q2_selection',
  Q2_REVIEW: 'q2_review',
  Q2_MENTAL_HEALTH: 'q2_mental_health',
  Q3_SELECTION: 'q3_selection',
  Q3_REVIEW: 'q3_review',
  Q3_MENTAL_HEALTH: 'q3_mental_health',
  SUMMARY: 'summary',
  TEAM_VISIBILITY: 'team_visibility',
  RECORD_VIDEO: 'record_video',
  RECORD_AUDIO: 'record_audio',
  RECORD_TEXT: 'record_text',
  RECORDING_COMPLETE: 'recording_complete',
  TEAM_RECORDINGS: 'team_recordings',
  MEMBER_FULL_SUMMARY: 'member_full_summary',
  COMPLETE: 'complete'
};

// localStorage key for saving progress
const STORAGE_KEY = 'awfm_questionnaire_progress';

// Helper to load saved progress from localStorage
const loadSavedProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved progress:', e);
  }
  return null;
};

// Helper to save progress to localStorage
const saveProgress = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

// Helper to clear saved progress
const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing progress:', e);
  }
};

const QuestionnaireFlow = () => {
  const navigate = useNavigate();
  const { state, saveResponse } = useQuestionnaire();

  // Load saved progress on initial mount
  const savedProgress = loadSavedProgress();

  const [currentPhase, setCurrentPhase] = useState(FLOW_PHASES.MAIN);
  const [q1Choices, setQ1Choices] = useState(savedProgress?.q1Choices || []);
  const [q2Choices, setQ2Choices] = useState(savedProgress?.q2Choices || []);
  const [q3Choices, setQ3Choices] = useState(savedProgress?.q3Choices || []);
  const [selectedMemberForFullSummary, setSelectedMemberForFullSummary] = useState(null);
  const [hasVisitedSummary, setHasVisitedSummary] = useState(savedProgress?.hasVisitedSummary || false);

  // Track the highest completed checkpoint for resume functionality
  const [completedCheckpoints, setCompletedCheckpoints] = useState(savedProgress?.completedCheckpoints || {
    q1: false,
    q2: false,
    q3: false
  });

  // Save progress whenever choices or completed checkpoints change
  useEffect(() => {
    saveProgress({
      q1Choices,
      q2Choices,
      q3Choices,
      completedCheckpoints,
      hasVisitedSummary
    });
  }, [q1Choices, q2Choices, q3Choices, completedCheckpoints, hasVisitedSummary]);

  // Calculate progress percentage for the "How it Works" section
  const getProgressPercentage = () => {
    let completed = 0;
    if (completedCheckpoints.q1) completed++;
    if (completedCheckpoints.q2) completed++;
    if (completedCheckpoints.q3) completed++;
    return Math.round((completed / 3) * 100);
  };

  // Check if questionnaire is complete (all 3 checkpoints done)
  const isQuestionnaireComplete = () => {
    return completedCheckpoints.q1 && completedCheckpoints.q2 && completedCheckpoints.q3;
  };

  // Check if user has started (any progress made)
  const hasStarted = () => {
    return q1Choices.length > 0 || q2Choices.length > 0 || q3Choices.length > 0;
  };

  // Get the phase to resume from
  const getResumePhase = () => {
    if (isQuestionnaireComplete()) {
      return FLOW_PHASES.SUMMARY;
    }
    if (completedCheckpoints.q2) {
      return FLOW_PHASES.Q3_SELECTION;
    }
    if (completedCheckpoints.q1) {
      return FLOW_PHASES.Q2_SELECTION;
    }
    if (q1Choices.length > 0) {
      return FLOW_PHASES.Q1_SELECTION;
    }
    return FLOW_PHASES.Q1_SELECTION;
  };

  // Calculate progress based on current phase
  const getProgress = () => {
    const phaseOrder = Object.values(FLOW_PHASES);
    const currentIndex = phaseOrder.indexOf(currentPhase);
    // Group into 4 main sections: Q1, Q2, Q3, Final
    if (currentPhase.startsWith('q1')) return { current: 1, total: 4 };
    if (currentPhase.startsWith('q2')) return { current: 2, total: 4 };
    if (currentPhase.startsWith('q3')) return { current: 3, total: 4 };
    return { current: 4, total: 4 };
  };

  const handleContinue = () => {
    // Mark checkpoints as complete when transitioning past mental health check
    if (currentPhase === FLOW_PHASES.Q1_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q1: true }));
    } else if (currentPhase === FLOW_PHASES.Q2_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q2: true }));
    } else if (currentPhase === FLOW_PHASES.Q3_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q3: true }));
    }

    const phaseTransitions = {
      [FLOW_PHASES.MAIN]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q1_SELECTION]: FLOW_PHASES.Q1_REVIEW,
      [FLOW_PHASES.Q1_REVIEW]: FLOW_PHASES.Q1_MENTAL_HEALTH,
      [FLOW_PHASES.Q1_MENTAL_HEALTH]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q2_SELECTION]: FLOW_PHASES.Q2_REVIEW,
      [FLOW_PHASES.Q2_REVIEW]: FLOW_PHASES.Q2_MENTAL_HEALTH,
      [FLOW_PHASES.Q2_MENTAL_HEALTH]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.Q3_SELECTION]: FLOW_PHASES.Q3_REVIEW,
      [FLOW_PHASES.Q3_REVIEW]: FLOW_PHASES.Q3_MENTAL_HEALTH,
      [FLOW_PHASES.Q3_MENTAL_HEALTH]: FLOW_PHASES.SUMMARY,
      [FLOW_PHASES.SUMMARY]: FLOW_PHASES.TEAM_VISIBILITY,
      [FLOW_PHASES.TEAM_VISIBILITY]: FLOW_PHASES.COMPLETE,
    };
    setCurrentPhase(phaseTransitions[currentPhase] || FLOW_PHASES.COMPLETE);
  };

  // Handle continue from main screen - either resume or start fresh
  const handleMainScreenContinue = () => {
    if (isQuestionnaireComplete()) {
      setCurrentPhase(FLOW_PHASES.SUMMARY);
    } else if (hasStarted()) {
      setCurrentPhase(getResumePhase());
    } else {
      setCurrentPhase(FLOW_PHASES.Q1_SELECTION);
    }
  };

  // Handle restart - clear all progress
  const handleRestart = () => {
    clearProgress();
    setQ1Choices([]);
    setQ2Choices([]);
    setQ3Choices([]);
    setCompletedCheckpoints({ q1: false, q2: false, q3: false });
    setCurrentPhase(FLOW_PHASES.MAIN);
  };

  const handleBack = () => {
    const phaseTransitions = {
      [FLOW_PHASES.Q1_SELECTION]: FLOW_PHASES.MAIN,
      [FLOW_PHASES.Q1_REVIEW]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q1_MENTAL_HEALTH]: FLOW_PHASES.Q1_REVIEW,
      [FLOW_PHASES.Q2_SELECTION]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q2_REVIEW]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q2_MENTAL_HEALTH]: FLOW_PHASES.Q2_REVIEW,
      [FLOW_PHASES.Q3_SELECTION]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q3_REVIEW]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.Q3_MENTAL_HEALTH]: FLOW_PHASES.Q3_REVIEW,
      [FLOW_PHASES.SUMMARY]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.TEAM_VISIBILITY]: FLOW_PHASES.SUMMARY,
    };
    if (phaseTransitions[currentPhase]) {
      setCurrentPhase(phaseTransitions[currentPhase]);
    }
  };

  const progress = getProgress();

  // Loading/Error states
  if (state.loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading...</p></div>;
  if (state.error) return <div className="error-container"><p>Error: {state.error}</p><button onClick={() => window.location.reload()}>Retry</button></div>;

  // Main Screen
  if (currentPhase === FLOW_PHASES.MAIN) {
    return (
      <MainScreen
        question={mainScreenQuestion}
        team={state.team}
        progress={progress}
        progressPercentage={getProgressPercentage()}
        hasStarted={hasStarted()}
        isComplete={isQuestionnaireComplete()}
        completedCheckpoints={completedCheckpoints}
        onContinue={handleMainScreenContinue}
        onBack={handleBack}
        onViewTeamRecordings={(memberId) => {
          // If memberId is provided, we could scroll to that member's recording
          // For now, just navigate to the team recordings page
          setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS);
        }}
      />
    );
  }

  // Q1 - Single Selection
  if (currentPhase === FLOW_PHASES.Q1_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q1}
        choices={q1ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q1Choices}
        onSelect={setQ1Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={false}
      />
    );
  }

  // Q1 Review
  if (currentPhase === FLOW_PHASES.Q1_REVIEW) {
    const selectedChoice = q1ChoicesData.find(c => q1Choices.includes(c.id));
    return (
      <ChoiceReview 
        question={questionData.q1}
        selectedChoice={selectedChoice}
        selectedChoices={q1Choices.map(id => q1ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q1 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q1_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q1}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="doing-great"
      />
    );
  }

  // Q2 - Multiple Selection
  if (currentPhase === FLOW_PHASES.Q2_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q2}
        choices={q2ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q2Choices}
        onSelect={setQ2Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={true}
        layout="vertical"
      />
    );
  }

  // Q2 Review
  if (currentPhase === FLOW_PHASES.Q2_REVIEW) {
    return (
      <ChoiceReview 
        question={questionData.q2}
        selectedChoices={q2Choices.map(id => q2ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q2 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q2_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q2}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="almost-there"
      />
    );
  }

  // Q3 - Multiple Selection
  if (currentPhase === FLOW_PHASES.Q3_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q3}
        choices={q3ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q3Choices}
        onSelect={setQ3Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={true}
        layout="vertical"
      />
    );
  }

  // Q3 Review
  if (currentPhase === FLOW_PHASES.Q3_REVIEW) {
    return (
      <ChoiceReview 
        question={questionData.q3}
        selectedChoices={q3Choices.map(id => q3ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q3 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q3_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q3}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="take-break"
      />
    );
  }

  // Summary
  if (currentPhase === FLOW_PHASES.SUMMARY) {
    // Build checkpoints data from selections
    const checkpointsData = [
      {
        id: 1,
        title: `Checkpoint 1: ${questionData.q1.title}`,
        choices: q1Choices.map(id => {
          const choice = q1ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      },
      {
        id: 2,
        title: `Checkpoint 2: ${questionData.q2.title}`,
        choices: q2Choices.map(id => {
          const choice = q2ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      },
      {
        id: 3,
        title: `Checkpoint 3: ${questionData.q3.title}`,
        choices: q3Choices.map(id => {
          const choice = q3ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      }
    ];

    // Build reflections data for FullSummary (with full choice details)
    const reflectionsData = [
      {
        id: 1,
        label: "Reflection 1:",
        question: questionData.q1.title,
        choices: q1Choices.map(id => {
          const choice = q1ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            whyMatters: choice.whyThisMatters,
            research: choice.researchEvidence,
            impact: choice.decisionImpact
          } : null;
        }).filter(Boolean)
      },
      {
        id: 2,
        label: "Reflection 2:",
        question: questionData.q2.title,
        choices: q2Choices.map(id => {
          const choice = q2ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            whatYouAreFightingFor: choice.whatYouAreFightingFor,
            cooperativeLearning: choice.cooperativeLearning,
            barriersToAccess: choice.barriersToAccess
          } : null;
        }).filter(Boolean)
      },
      {
        id: 3,
        label: "Reflection 3:",
        question: questionData.q3.title,
        choices: q3Choices.map(id => {
          const choice = q3ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            careTeamAffirmation: choice.careTeamAffirmation,
            interdependencyAtWork: choice.interdependencyAtWork,
            reflectionGuidance: choice.reflectionGuidance
          } : null;
        }).filter(Boolean)
      }
    ];

    return (
      <Summary
        question={mainScreenQuestion}
        userName="Norman"
        userAvatar="https://i.pravatar.cc/82?img=8"
        checkpoints={checkpointsData}
        reflections={reflectionsData}
        team={teamWithAffirmation}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onChangeAnswer={() => setCurrentPhase(FLOW_PHASES.Q1_SELECTION)}
        onViewTeamRecordings={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        isFirstVisit={!hasVisitedSummary}
        onNavigateToTeamVisibility={() => {
          setHasVisitedSummary(true);
          setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY);
        }}
      />
    );
  }

  // Team Visibility
  if (currentPhase === FLOW_PHASES.TEAM_VISIBILITY) {
    return (
      <TeamVisibilitySuccess
        userName="Norman"
        userAvatar="https://i.pravatar.cc/280?img=12"
        onSkip={() => setCurrentPhase(FLOW_PHASES.SUMMARY)}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onRecordVideo={() => setCurrentPhase(FLOW_PHASES.RECORD_VIDEO)}
        onRecordAudio={() => setCurrentPhase(FLOW_PHASES.RECORD_AUDIO)}
        onEnterText={() => setCurrentPhase(FLOW_PHASES.RECORD_TEXT)}
      />
    );
  }

  // Record Video
  if (currentPhase === FLOW_PHASES.RECORD_VIDEO) {
    return (
      <RecordVideo
        initialMode="video"
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY)}
        onComplete={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onSwitchToText={() => setCurrentPhase(FLOW_PHASES.RECORD_TEXT)}
        onSwitchToAudio={() => setCurrentPhase(FLOW_PHASES.RECORD_AUDIO)}
      />
    );
  }

  // Record Audio
  if (currentPhase === FLOW_PHASES.RECORD_AUDIO) {
    return (
      <RecordVideo
        initialMode="audio"
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY)}
        onComplete={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onSwitchToText={() => setCurrentPhase(FLOW_PHASES.RECORD_TEXT)}
        onSwitchToAudio={() => {}}
      />
    );
  }

  // Record Text
  if (currentPhase === FLOW_PHASES.RECORD_TEXT) {
    return (
      <RecordVideo
        initialMode="text"
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY)}
        onComplete={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onSwitchToText={() => {}}
        onSwitchToAudio={() => setCurrentPhase(FLOW_PHASES.RECORD_AUDIO)}
      />
    );
  }

  // Recording Complete - shown after submitting recording
  if (currentPhase === FLOW_PHASES.RECORDING_COMPLETE) {
    return (
      <RecordingComplete
        onReady={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        onSkip={() => setCurrentPhase(FLOW_PHASES.SUMMARY)}
      />
    );
  }

  // Team Recordings - view care team's recordings
  if (currentPhase === FLOW_PHASES.TEAM_RECORDINGS) {
    return (
      <TeamRecordings
        onBack={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onRecordVideo={() => setCurrentPhase(FLOW_PHASES.RECORD_VIDEO)}
        onRecordAudio={() => setCurrentPhase(FLOW_PHASES.RECORD_AUDIO)}
        onEnterText={() => setCurrentPhase(FLOW_PHASES.RECORD_TEXT)}
        onSkip={() => setCurrentPhase(FLOW_PHASES.SUMMARY)}
        onViewFullReport={(member) => {
          setSelectedMemberForFullSummary(member);
          setCurrentPhase(FLOW_PHASES.MEMBER_FULL_SUMMARY);
        }}
      />
    );
  }

  // Member Full Summary - view a specific member's full summary
  if (currentPhase === FLOW_PHASES.MEMBER_FULL_SUMMARY && selectedMemberForFullSummary) {
    return (
      <FullSummary
        userName={selectedMemberForFullSummary.name}
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        onContinue={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      />
    );
  }

  // Complete
  if (currentPhase === FLOW_PHASES.COMPLETE) {
    return <CompletionSuccess onRestart={handleRestart} />;
  }

  return <div className="loading-container"><p>Loading...</p></div>;
};

export default QuestionnaireFlow;
