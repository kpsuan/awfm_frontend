import React from 'react';
import Summary from '../../../components/pages/Summary';
import { buildCheckpointsData, buildReflectionsData, matchPPRPattern } from '../utils/dataPreparation';
import { FLOW_PHASES } from '../constants';

/**
 * Summary phase component
 * Displays the user's choices summary with PPR matching
 */
const SummaryPhase = ({
  mainScreenQuestion,
  questionData,
  q1Choices,
  q2Choices,
  q3Choices,
  q1ChoicesData,
  q2ChoicesData,
  q3ChoicesData,
  pprPatterns,
  progress,
  hasVisitedSummary,
  user,
  team = [],
  onContinue,
  onBack,
  onGoToPhase,
  onMarkSummaryVisited,
}) => {
  // Build checkpoints data from selections
  const checkpointsData = buildCheckpointsData({
    questionData,
    q1Choices,
    q2Choices,
    q3Choices,
    q1ChoicesData,
    q2ChoicesData,
    q3ChoicesData
  });

  // Build reflections data for FullSummary (with full choice details)
  const reflectionsData = buildReflectionsData({
    questionData,
    q1Choices,
    q2Choices,
    q3Choices,
    q1ChoicesData,
    q2ChoicesData,
    q3ChoicesData
  });

  // Match PPR pattern based on user selections
  const matchedPPR = matchPPRPattern({
    pprPatterns,
    q1Choices,
    q2Choices,
    q3Choices
  });

  // Get user display info
  const userName = user?.display_name || user?.first_name || user?.email?.split('@')[0] || 'User';
  const userAvatar = user?.profile_photo_url || user?.avatar || `https://i.pravatar.cc/82?u=${user?.id || 'default'}`;

  return (
    <Summary
      question={mainScreenQuestion}
      userName={userName}
      userAvatar={userAvatar}
      checkpoints={checkpointsData}
      reflections={reflectionsData}
      pprText={matchedPPR?.text}
      team={team}
      progress={progress}
      onContinue={onContinue}
      onBack={onBack}
      onBackHome={() => onGoToPhase(FLOW_PHASES.MAIN)}
      onChangeAnswer={() => onGoToPhase(FLOW_PHASES.Q1_SELECTION)}
      onViewTeamRecordings={() => onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      isFirstVisit={!hasVisitedSummary}
      onNavigateToTeamVisibility={() => {
        onMarkSummaryVisited();
        onGoToPhase(FLOW_PHASES.TEAM_VISIBILITY);
      }}
    />
  );
};

export default SummaryPhase;
