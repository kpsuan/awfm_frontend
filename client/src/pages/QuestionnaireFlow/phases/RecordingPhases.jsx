import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import RecordVideo from '../../../components/pages/RecordVideo';
import RecordingComplete from '../../../components/pages/RecordingComplete';
import TeamRecordings from '../../../components/pages/TeamRecordings';
import FullSummary from '../../../components/pages/FullSummary';
import FeedbackModal, { hasFeedbackBeenSubmitted } from '../../../components/common/Modal/FeedbackModal';
import { recordingsService } from '../../../services';
import { FLOW_PHASES } from '../constants';

/**
 * Record Video phase component
 */
export const RecordVideoPhase = ({ onGoToPhase, questionId, team, setRecordingPreview }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleComplete = useCallback(async (recordingData) => {
    if (!recordingData || isUploading) return;

    setIsUploading(true);
    try {
      const { chunks, description, blobUrl, teamId } = recordingData;

      // Create blob from chunks
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'recording.webm', { type: 'video/webm' });

      // Validate file size before upload
      try {
        recordingsService.validateFileSize(file, 'video');
      } catch (sizeError) {
        toast.error(sizeError.message);
        setIsUploading(false);
        return;
      }

      // Store preview data for RecordingComplete page
      const previewUrl = blobUrl || URL.createObjectURL(blob);
      setRecordingPreview({ type: 'video', url: previewUrl, description, uploadSuccess: true });

      // Upload to backend - use selected teamId from recording form
      await recordingsService.uploadRecording(
        file,
        'video',
        questionId,
        teamId || team?.id || null,
        description
      );

      toast.success('Video uploaded successfully!');
      onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE);
    } catch (error) {
      console.error('Failed to upload video recording:', error);
      toast.error('Failed to upload video. Please try again.');
      // Update preview to show upload failed
      setRecordingPreview(prev => prev ? { ...prev, uploadSuccess: false } : null);
    } finally {
      setIsUploading(false);
    }
  }, [questionId, team, onGoToPhase, isUploading, setRecordingPreview]);

  return (
    <RecordVideo
      initialMode="video"
      defaultTeamId={team?.id}
      onBack={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onComplete={handleComplete}
      onSwitchToText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSwitchToAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    />
  );
};

/**
 * Record Audio phase component
 */
export const RecordAudioPhase = ({ onGoToPhase, questionId, team, setRecordingPreview }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleComplete = useCallback(async (recordingData) => {
    if (!recordingData || isUploading) return;

    setIsUploading(true);
    try {
      const { chunks, description, blobUrl, teamId } = recordingData;

      // Create blob from chunks
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });

      // Validate file size before upload
      try {
        recordingsService.validateFileSize(file, 'audio');
      } catch (sizeError) {
        toast.error(sizeError.message);
        setIsUploading(false);
        return;
      }

      // Store preview data for RecordingComplete page
      const previewUrl = blobUrl || URL.createObjectURL(blob);
      setRecordingPreview({ type: 'audio', url: previewUrl, description, uploadSuccess: true });

      // Upload to backend - use selected teamId from recording form
      await recordingsService.uploadRecording(
        file,
        'audio',
        questionId,
        teamId || team?.id || null,
        description
      );

      toast.success('Audio uploaded successfully!');
      onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE);
    } catch (error) {
      console.error('Failed to upload audio recording:', error);
      toast.error('Failed to upload audio. Please try again.');
      setRecordingPreview(prev => prev ? { ...prev, uploadSuccess: false } : null);
    } finally {
      setIsUploading(false);
    }
  }, [questionId, team, onGoToPhase, isUploading, setRecordingPreview]);

  return (
    <RecordVideo
      initialMode="audio"
      defaultTeamId={team?.id}
      onBack={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onComplete={handleComplete}
      onSwitchToText={() => onGoToPhase(FLOW_PHASES.RECORD_TEXT)}
      onSwitchToAudio={() => {}}
    />
  );
};

/**
 * Record Text phase component
 */
export const RecordTextPhase = ({ onGoToPhase, questionId, team, setRecordingPreview }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleComplete = useCallback(async (recordingData) => {
    if (!recordingData || isUploading) return;

    setIsUploading(true);
    try {
      const { content, description, teamId } = recordingData;

      // Store preview data for RecordingComplete page
      setRecordingPreview({ type: 'text', content, description, uploadSuccess: true });

      // Create text recording - use selected teamId from recording form
      await recordingsService.createTextRecording(
        content,
        questionId,
        teamId || team?.id || null,
        description
      );

      toast.success('Response saved successfully!');
      onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE);
    } catch (error) {
      console.error('Failed to create text recording:', error);
      toast.error('Failed to save response. Please try again.');
      setRecordingPreview(prev => prev ? { ...prev, uploadSuccess: false } : null);
    } finally {
      setIsUploading(false);
    }
  }, [questionId, team, onGoToPhase, isUploading, setRecordingPreview]);

  return (
    <RecordVideo
      initialMode="text"
      defaultTeamId={team?.id}
      onBack={() => onGoToPhase(FLOW_PHASES.SUMMARY)}
      onComplete={handleComplete}
      onSwitchToText={() => {}}
      onSwitchToAudio={() => onGoToPhase(FLOW_PHASES.RECORD_AUDIO)}
    />
  );
};

/**
 * Recording Complete phase component
 * Shown after submitting a recording
 */
export const RecordingCompletePhase = ({ onGoToPhase, recordingPreview, clearRecordingPreview }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Show feedback modal on mount if not already submitted
  useEffect(() => {
    if (!hasFeedbackBeenSubmitted()) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShowFeedbackModal(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleViewTeamRecordings = () => {
    if (!hasFeedbackBeenSubmitted()) {
      setPendingNavigation('team');
      setShowFeedbackModal(true);
    } else {
      onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS);
    }
  };

  const handleRecordAgain = () => {
    // Clear the current recording preview and go back to record video
    if (clearRecordingPreview) clearRecordingPreview();
    onGoToPhase(FLOW_PHASES.RECORD_VIDEO);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    // Navigate based on pending action
    if (pendingNavigation === 'team') {
      onGoToPhase(FLOW_PHASES.TEAM_RECORDINGS);
    }
    setPendingNavigation(null);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    // TODO: Send feedback to backend
    console.log('Feedback submitted:', feedbackData);
  };

  return (
    <>
      <RecordingComplete
        recordingPreview={recordingPreview}
        onViewTeamRecordings={handleViewTeamRecordings}
        onRecordAgain={handleRecordAgain}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
        onSkip={handleFeedbackClose}
      />
    </>
  );
};

/**
 * Team Recordings phase component
 * View care team's recordings
 */
export const TeamRecordingsPhase = ({ onGoToPhase, onViewFullReport, team, user, questionId }) => {
  return (
    <TeamRecordings
      onBack={() => onGoToPhase(FLOW_PHASES.RECORDING_COMPLETE)}
      onBackHome={() => onGoToPhase(FLOW_PHASES.MAIN)}
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
