import React from 'react';
import TeamVisibilitySuccess from '../../../components/pages/TeamVisibilitySuccess';
import { FLOW_PHASES } from '../constants';

/**
 * Team Visibility phase component
 * Shows options to record video/audio/text explanation for care team
 */
const TeamVisibilityPhase = ({ onGoToPhase, user }) => {
  return (
    <TeamVisibilitySuccess
      userName={user?.display_name || user?.full_name || user?.name || 'User'}
      userAvatar={user?.profile_photo_url || user?.avatar_url || user?.avatar}
      onSkip={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onBackHome={() => onGoToPhase(FLOW_PHASES.MAIN)}
      onRecordVideo={() => onGoToPhase(FLOW_PHASES.RECORD_VIDEO)}
      onRecordAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
      onEnterText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
    />
  );
};

export default TeamVisibilityPhase;
