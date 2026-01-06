import { FLOW_PHASES } from '../constants';

// Import components
import MainScreen from '../../../components/pages/MainScreen';
import CheckpointSelection from '../../../components/pages/CheckpointSelection';
import ChoiceReview from '../../../components/pages/ChoiceReview';
import CompletionSuccess from '../../../components/pages/CompletionSuccess';
import MentalHealthCheck from '../../../components/pages/MentalHealthCheck';

import {
  SummaryPhase,
  TeamVisibilityPhase,
  RecordVideoPhase,
  RecordAudioPhase,
  RecordTextPhase,
  RecordingCompletePhase,
  TeamRecordingsPhase,
  MemberFullSummaryPhase
} from '../phases';

/**
 * Helper to map choice IDs to choice objects
 */
const mapChoicesToData = (choiceIds, choicesData) =>
  choiceIds.map(id => choicesData?.find(c => c.id === id)).filter(Boolean);

/**
 * Get props for selection phases (Q1, Q2, Q3)
 */
const getSelectionProps = (ctx, layerNum) => {
  const layerKey = `q${layerNum}`;
  const isMultiSelect = layerNum > 1;

  return {
    question: ctx.questionData[layerKey],
    choices: ctx.choices[layerKey],
    team: ctx.team,
    progress: ctx.progress,
    initialSelection: ctx[`${layerKey}Choices`],
    onSelect: ctx[`set${layerKey.charAt(0).toUpperCase() + layerKey.slice(1)}Choices`],
    onContinue: ctx.handleContinue,
    onBack: ctx.onBack,
    multiSelect: isMultiSelect,
    layout: 'horizontal', // All layers use horizontal carousel layout
    ...(layerNum === 2 && { isQ2: true }),
    ...(layerNum === 3 && { isQ3: true })
  };
};

/**
 * Get props for review phases (Q1, Q2, Q3)
 */
const getReviewProps = (ctx, layerNum) => {
  const layerKey = `q${layerNum}`;
  const choices = ctx[`${layerKey}Choices`];
  const choicesData = ctx.choices[layerKey];

  return {
    question: ctx.questionData[layerKey],
    selectedChoices: mapChoicesToData(choices, choicesData),
    ...(layerNum === 1 && { selectedChoice: choicesData?.find(c => choices.includes(c.id)) }),
    progress: ctx.progress,
    onConfirm: () => ctx.handleConfirmAndSave(layerNum, choices),
    onBack: ctx.onBack,
    onChangeAnswer: ctx.onBack
  };
};

/**
 * Get props for mental health check phases
 */
const getMentalHealthProps = (ctx, layerNum, variant) => {
  const layerKey = `q${layerNum}`;
  return {
    question: ctx.questionData[layerKey],
    progress: ctx.progress,
    onContinue: ctx.handleContinue,
    onBack: ctx.onBack,
    onBackHome: () => ctx.goToPhase(FLOW_PHASES.MAIN),
    variant
  };
};

/**
 * Phase configuration map
 * Each phase defines its component and how to get props from context
 */
export const PHASE_CONFIG = {
  // Main Screen
  [FLOW_PHASES.MAIN]: {
    component: MainScreen,
    getProps: (ctx) => ({
      question: ctx.mainScreenQuestion,
      team: ctx.team,
      user: ctx.user,
      progress: ctx.progress,
      progressPercentage: ctx.progressPercentage,
      hasStarted: ctx.hasStarted,
      isComplete: ctx.isComplete,
      completedCheckpoints: ctx.completedCheckpoints,
      onContinue: ctx.handleMainScreenContinue,
      onBack: ctx.onBack,
      onViewTeamRecordings: () => ctx.goToPhase(FLOW_PHASES.TEAM_RECORDINGS),
      onGoToLayer: ctx.handleGoToLayer
    })
  },

  // Q1 Flow
  [FLOW_PHASES.Q1_SELECTION]: {
    component: CheckpointSelection,
    getProps: (ctx) => getSelectionProps(ctx, 1)
  },
  [FLOW_PHASES.Q1_REVIEW]: {
    component: ChoiceReview,
    getProps: (ctx) => getReviewProps(ctx, 1)
  },
  [FLOW_PHASES.Q1_MENTAL_HEALTH]: {
    component: MentalHealthCheck,
    getProps: (ctx) => getMentalHealthProps(ctx, 1, 'doing-great')
  },

  // Q2 Flow
  [FLOW_PHASES.Q2_SELECTION]: {
    component: CheckpointSelection,
    getProps: (ctx) => getSelectionProps(ctx, 2)
  },
  [FLOW_PHASES.Q2_REVIEW]: {
    component: ChoiceReview,
    getProps: (ctx) => getReviewProps(ctx, 2)
  },
  [FLOW_PHASES.Q2_MENTAL_HEALTH]: {
    component: MentalHealthCheck,
    getProps: (ctx) => getMentalHealthProps(ctx, 2, 'almost-there')
  },

  // Q3 Flow
  [FLOW_PHASES.Q3_SELECTION]: {
    component: CheckpointSelection,
    getProps: (ctx) => getSelectionProps(ctx, 3)
  },
  [FLOW_PHASES.Q3_REVIEW]: {
    component: ChoiceReview,
    getProps: (ctx) => getReviewProps(ctx, 3)
  },
  [FLOW_PHASES.Q3_MENTAL_HEALTH]: {
    component: MentalHealthCheck,
    getProps: (ctx) => getMentalHealthProps(ctx, 3, 'take-break')
  },

  // Summary
  [FLOW_PHASES.SUMMARY]: {
    component: SummaryPhase,
    getProps: (ctx) => ({
      mainScreenQuestion: ctx.mainScreenQuestion,
      questionData: ctx.questionData,
      q1Choices: ctx.q1Choices,
      q2Choices: ctx.q2Choices,
      q3Choices: ctx.q3Choices,
      q1ChoicesData: ctx.choices.q1,
      q2ChoicesData: ctx.choices.q2,
      q3ChoicesData: ctx.choices.q3,
      pprPatterns: ctx.pprPatterns,
      progress: ctx.progress,
      hasVisitedSummary: ctx.hasVisitedSummary,
      user: ctx.user,
      team: ctx.team,
      onContinue: ctx.handleContinue,
      onBack: ctx.onBack,
      onGoToPhase: ctx.goToPhase,
      onMarkSummaryVisited: ctx.markSummaryVisited
    })
  },

  // Team Visibility
  [FLOW_PHASES.TEAM_VISIBILITY]: {
    component: TeamVisibilityPhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      user: ctx.user
    })
  },

  // Recording phases
  [FLOW_PHASES.RECORD_VIDEO]: {
    component: RecordVideoPhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      questionId: ctx.questionId,
      team: ctx.team,
      setRecordingPreview: ctx.setRecordingPreview
    })
  },
  [FLOW_PHASES.RECORD_AUDIO]: {
    component: RecordAudioPhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      questionId: ctx.questionId,
      team: ctx.team,
      setRecordingPreview: ctx.setRecordingPreview
    })
  },
  [FLOW_PHASES.RECORD_TEXT]: {
    component: RecordTextPhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      questionId: ctx.questionId,
      team: ctx.team,
      setRecordingPreview: ctx.setRecordingPreview
    })
  },
  [FLOW_PHASES.RECORDING_COMPLETE]: {
    component: RecordingCompletePhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      recordingPreview: ctx.recordingPreview,
      clearRecordingPreview: ctx.clearRecordingPreview
    })
  },

  // Team recordings
  [FLOW_PHASES.TEAM_RECORDINGS]: {
    component: TeamRecordingsPhase,
    getProps: (ctx) => ({
      onGoToPhase: ctx.goToPhase,
      onGoToDashboard: () => ctx.navigate('/dashboard'),
      onViewFullReport: ctx.handleViewFullReport,
      team: ctx.team,
      user: ctx.user,
      questionId: ctx.questionId
    })
  },

  // Member full summary
  [FLOW_PHASES.MEMBER_FULL_SUMMARY]: {
    component: MemberFullSummaryPhase,
    getProps: (ctx) => ({
      selectedMember: ctx.selectedMemberForFullSummary,
      onGoToPhase: ctx.goToPhase
    })
  },

  // Complete
  [FLOW_PHASES.COMPLETE]: {
    component: CompletionSuccess,
    getProps: (ctx) => ({ onRestart: ctx.handleRestart })
  }
};

export default PHASE_CONFIG;
