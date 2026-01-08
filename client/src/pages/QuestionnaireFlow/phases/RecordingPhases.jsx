import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import RecordVideo from '../../../components/pages/RecordVideo';
import RecordingComplete from '../../../components/pages/RecordingComplete';
import TeamRecordings from '../../../components/pages/TeamRecordings';
import FullSummary from '../../../components/pages/FullSummary';
import { recordingsService } from '../../../services';
import { FLOW_PHASES } from '../constants';

/**
 * Shared hook for handling recording uploads across all recording types.
 * Handles video, audio, and text recordings with proper validation and error handling.
 */
const useRecordingUpload = ({ questionId, teamId, setRecordingPreview, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadTextRecording = async ({ content, description, teamId: selectedTeamId }) => {
    setRecordingPreview({ type: 'text', content, description, uploadSuccess: true });

    await recordingsService.createTextRecording(
      content,
      questionId,
      selectedTeamId || teamId || null,
      description
    );

    toast.success('Response saved successfully!');
  };

  const uploadMediaRecording = async ({ chunks, description, blobUrl, teamId: selectedTeamId }, type) => {
    const mimeType = `${type}/webm`;
    const blob = new Blob(chunks, { type: mimeType });
    const file = new File([blob], 'recording.webm', { type: mimeType });

    // Validate file size
    recordingsService.validateFileSize(file, type);

    const previewUrl = blobUrl || URL.createObjectURL(blob);
    setRecordingPreview({ type, url: previewUrl, description, uploadSuccess: true });

    await recordingsService.uploadRecording(
      file,
      type,
      questionId,
      selectedTeamId || teamId || null,
      description
    );

    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    toast.success(`${typeLabel} uploaded successfully!`);
  };

  const handleComplete = useCallback(async (recordingData) => {
    if (!recordingData || isUploading) return;

    setIsUploading(true);
    const recordingType = recordingData.type || 'video';

    try {
      if (recordingType === 'text') {
        await uploadTextRecording(recordingData);
      } else {
        await uploadMediaRecording(recordingData, recordingType);
      }
      onSuccess();
    } catch (error) {
      console.error(`Failed to upload ${recordingType} recording:`, error);

      const errorMessage = error.message?.includes('File too large')
        ? error.message
        : `Failed to upload ${recordingType}. Please try again.`;

      toast.error(errorMessage);
      setRecordingPreview(prev => prev ? { ...prev, uploadSuccess: false } : null);
    } finally {
      setIsUploading(false);
    }
  }, [questionId, teamId, isUploading, setRecordingPreview, onSuccess]);

  return { handleComplete, isUploading };
};

/**
 * Generic Recording Phase component.
 * Handles video, audio, and text recording modes with shared upload logic.
 */
const RecordingPhase = ({
  initialMode,
  onGoToPhase,
  questionId,
  team,
  setRecordingPreview
}) => {
  const { handleComplete } = useRecordingUpload({
    questionId,
    teamId: team?.id,
    setRecordingPreview,
    onSuccess: () => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE),
  });

  return (
    <RecordVideo
      initialMode={initialMode}
      defaultTeamId={team?.id}
      onBack={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onComplete={handleComplete}
      onSwitchToText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSwitchToAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    />
  );
};

/**
 * Record Video phase - starts in video mode
 */
export const RecordVideoPhase = (props) => (
  <RecordingPhase {...props} initialMode="video" />
);

/**
 * Record Audio phase - starts in audio mode
 */
export const RecordAudioPhase = (props) => (
  <RecordingPhase {...props} initialMode="audio" />
);

/**
 * Record Text phase - starts in text mode
 */
export const RecordTextPhase = (props) => (
  <RecordingPhase {...props} initialMode="text" />
);

/**
 * Recording Complete phase - shown after submitting a recording
 * Feedback modal is shown when leaving to dashboard from TeamRecordings, not here
 */
export const RecordingCompletePhase = ({
  onGoToPhase,
  recordingPreview,
  clearRecordingPreview
}) => {
  const handleRecordAgain = () => {
    clearRecordingPreview?.();
    onGoToPhase(FLOW_PHASES.RECORD_VIDEO);
  };

  return (
    <RecordingComplete
      recordingPreview={recordingPreview}
      onViewTeamRecordings={() => onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      onRecordAgain={handleRecordAgain}
    />
  );
};

/**
 * Team Recordings phase - view care team's recordings
 */
export const TeamRecordingsPhase = ({
  onGoToPhase,
  onGoToDashboard,
  onViewFullReport,
  team,
  user,
  questionId
}) => (
  <TeamRecordings
    onBack={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
    onBackHome={onGoToDashboard}
    onBackToSummary={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
    onRecordVideo={() => onGoToPhase(FLOW_PHASES.RECORD_VIDEO)}
    onRecordAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    onEnterText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
    onSkip={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
    onViewFullReport={onViewFullReport}
    team={team}
    currentUser={user}
    questionId={questionId}
  />
);

/**
 * Member Full Summary phase - view a specific member's full summary
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
