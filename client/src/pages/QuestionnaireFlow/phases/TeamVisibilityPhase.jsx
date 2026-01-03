import React from 'react';
import TeamVisibilitySuccess from '../../../components/pages/TeamVisibilitySuccess';
import { FLOW_PHASES } from '../constants';

/**
 * Team Visibility phase component
 * Shows options to record video/audio/text explanation for care team
 */
const TeamVisibilityPhase = ({ onGoToPhase }) => {
  return (
    <TeamVisibilitySuccess
      userName="Norman"
      userAvatar="https://i.pravatar.cc/280?img=12"
      onSkip={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onBackHome={() => onGoToPhase(FLOW_PHASES.MAIN)}
      onRecordVideo={() => onGoToPhase(FLOW_PHASES.RECORD_VIDEO)}
      onRecordAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
      onEnterText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
    />
  );
};

export default TeamVisibilityPhase;
