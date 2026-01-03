import React from 'react';
import RecordVideo from '../../../components/pages/RecordVideo';
import RecordingComplete from '../../../components/pages/RecordingComplete';
import TeamRecordings from '../../../components/pages/TeamRecordings';
import FullSummary from '../../../components/pages/FullSummary';
import { FLOW_PHASES } from '../constants';

/**
 * Record Video phase component
 */
export const RecordVideoPhase = ({ onGoToPhase }) => {
  return (
    <RecordVideo
      initialMode="video"
      onBack={() => onGoToPhase(FLOW_PHASES.TEAM_VISIBILITY)}
      onComplete={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
      onSwitchToText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSwitchToAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    />
  );
};

/**
 * Record Audio phase component
 */
export const RecordAudioPhase = ({ onGoToPhase }) => {
  return (
    <RecordVideo
      initialMode="audio"
      onBack={() => onGoToPhase(FLOW_PHASES.TEAM_VISIBILITY)}
      onComplete={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
      onSwitchToText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSwitchToAudio={() => {}}
    />
  );
};

/**
 * Record Text phase component
 */
export const RecordTextPhase = ({ onGoToPhase }) => {
  return (
    <RecordVideo
      initialMode="text"
      onBack={() => onGoToPhase(FLOW_PHASES.TEAM_VISIBILITY)}
      onComplete={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
      onSwitchToText={() => {}}
      onSwitchToAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    />
  );
};

/**
 * Recording Complete phase component
 * Shown after submitting a recording
 */
export const RecordingCompletePhase = ({ onGoToPhase }) => {
  return (
    <RecordingComplete
      onReady={() => onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      onSkip={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
    />
  );
};

/**
 * Team Recordings phase component
 * View care team's recordings
 */
export const TeamRecordingsPhase = ({ onGoToPhase, onViewFullReport }) => {
  return (
    <TeamRecordings
      onBack={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
      onBackHome={() => onGoToPhase(FLOW_PHASES.MAIN)}
      onRecordVideo={() => onGoToPhase(FLOW_PHASES.RECORD_VIDEO)}
      onRecordAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
      onEnterText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSkip={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onViewFullReport={onViewFullReport}
    />
  );
};

/**
 * Member Full Summary phase component
 * View a specific member's full summary
 */
export const MemberFullSummaryPhase = ({ selectedMember, onGoToPhase }) => {
  if (!selectedMember) return null;

  return (
    <FullSummary
      userName={selectedMember.name}
      onBack={() => onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      onContinue={() => onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
    />
  );
};
