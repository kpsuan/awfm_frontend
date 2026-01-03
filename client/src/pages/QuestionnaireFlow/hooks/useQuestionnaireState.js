import { useState, useEffect } from 'react';
import { FLOW_PHASES, FORWARD_TRANSITIONS, BACKWARD_TRANSITIONS } from '../constants';
import { loadSavedProgress, saveProgress, clearProgress } from '../utils/progressStorage';

/**
 * Custom hook to manage questionnaire state and navigation
 * Handles phase transitions, progress tracking, and localStorage persistence
 * @param {string} questionId - The question ID for per-question progress storage
 */
export const useQuestionnaireState = (questionId) => {
  // Load saved progress on initial mount (per-question)
  const savedProgress = loadSavedProgress(questionId);

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

  // Save progress whenever choices or completed checkpoints change (per-question)
  useEffect(() => {
    saveProgress({
      q1Choices,
      q2Choices,
      q3Choices,
      completedCheckpoints,
      hasVisitedSummary
    }, questionId);
  }, [q1Choices, q2Choices, q3Choices, completedCheckpoints, hasVisitedSummary, questionId]);

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
    // Group into 4 main sections: Q1, Q2, Q3, Final
    if (currentPhase.startsWith('q1')) return { current: 1, total: 4 };
    if (currentPhase.startsWith('q2')) return { current: 2, total: 4 };
    if (currentPhase.startsWith('q3')) return { current: 3, total: 4 };
    return { current: 4, total: 4 };
  };

  // Handle forward navigation
  const handleContinue = () => {
    // Mark checkpoints as complete when transitioning past mental health check
    if (currentPhase === FLOW_PHASES.Q1_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q1: true }));
    } else if (currentPhase === FLOW_PHASES.Q2_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q2: true }));
    } else if (currentPhase === FLOW_PHASES.Q3_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q3: true }));
    }

    setCurrentPhase(FORWARD_TRANSITIONS[currentPhase] || FLOW_PHASES.COMPLETE);
  };

  // Handle backward navigation (returns true if should show exit modal)
  const handleBack = () => {
    const nextPhase = BACKWARD_TRANSITIONS[currentPhase];
    if (nextPhase === FLOW_PHASES.MAIN) {
      return true; // Signal to show exit modal
    } else if (nextPhase) {
      setCurrentPhase(nextPhase);
    }
    return false;
  };

  // Handle restart - clear all progress for this question
  const handleRestart = () => {
    clearProgress(questionId);
    setQ1Choices([]);
    setQ2Choices([]);
    setQ3Choices([]);
    setCompletedCheckpoints({ q1: false, q2: false, q3: false });
    setCurrentPhase(FLOW_PHASES.MAIN);
  };

  // Navigate to a specific phase
  const goToPhase = (phase) => {
    setCurrentPhase(phase);
  };

  // Mark summary as visited
  const markSummaryVisited = () => {
    setHasVisitedSummary(true);
  };

  return {
    // State
    currentPhase,
    q1Choices,
    q2Choices,
    q3Choices,
    completedCheckpoints,
    hasVisitedSummary,
    selectedMemberForFullSummary,

    // Setters
    setQ1Choices,
    setQ2Choices,
    setQ3Choices,
    setCompletedCheckpoints,
    setSelectedMemberForFullSummary,

    // Computed
    progress: getProgress(),
    progressPercentage: getProgressPercentage(),
    isComplete: isQuestionnaireComplete(),
    hasStarted: hasStarted(),

    // Actions
    handleContinue,
    handleBack,
    handleRestart,
    goToPhase,
    getResumePhase,
    markSummaryVisited,
  };
};

export default useQuestionnaireState;
