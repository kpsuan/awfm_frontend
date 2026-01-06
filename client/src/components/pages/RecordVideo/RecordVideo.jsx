import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Trash2,
  Check,
  SwitchCamera,
  X,
  Play,
  Pause,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Image
} from 'lucide-react';
import { Button } from '../../common/Button';
import { ConfirmationModal } from '../../common/Modal';
import { TeamSelector } from '../../common/TeamSelector';
import { DescriptionInput, ReviewControls, AudioWaveform, RecordingTimer } from '../../common/Recording';
import { teamsService } from '../../../services';
import './RecordVideo.css';



// Instructions Modal Component
const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="record-video__modal-overlay" onClick={onClose}>
      <div className="record-video__modal" onClick={(e) => e.stopPropagation()}>
        <button className="record-video__modal-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>

        <div className="record-video__modal-content">
          <h2 className="record-video__modal-title">Record Your Reasoning</h2>

          <p className="record-video__modal-intro">
            Now that you've completed all three layers and seen what your
            choices reveal, please record your reasoning. You can record
            multiple times if you wish to address different aspects of
            your decision.
          </p>

          <div className="record-video__modal-section">
            <h3 className="record-video__modal-subtitle">Consider explaining:</h3>
            <ul className="record-video__modal-list">
              <li>Why you chose your Layer 1 position</li>
              <li>Why you selected your Layer 2 challenges</li>
              <li>Why you picked your Layer 3 change factor</li>
              <li>How these choices connect to each other</li>
              <li>Your responses to the reflection questions above</li>
            </ul>
          </div>

          <div className="record-video__modal-tips">
            <h3 className="record-video__modal-subtitle">Tips:</h3>
            <ul className="record-video__modal-list">
              <li>Speak naturally — there's no right or wrong answer</li>
              <li>Take your time to gather your thoughts</li>
              <li>You can re-record as many times as needed</li>
              <li>Your recording will be shared with your care team</li>
            </ul>
          </div>

          <Button variant="primary" fullWidth onClick={onClose}>
            I'm Ready to Record
          </Button>
        </div>
      </div>
    </div>
  );
};


const RecordVideo = ({
  onBack,
  onComplete,
  onSwitchToText,
  onSwitchToAudio,
  initialMode = 'video',
  defaultTeamId = null
}) => {
  const [activeMode, setActiveMode] = useState(initialMode);
  const [recordingState, setRecordingState] = useState('idle'); // idle, recording, paused, reviewing
  const [hasPermission, setHasPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordedTime, setRecordedTime] = useState(0);
  const [facingMode, setFacingMode] = useState('user');
  const [showInstructions, setShowInstructions] = useState(true);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef(null);
  const reviewVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null); // Ref to track current stream for cleanup

  // Team visibility state
  const [userTeams, setUserTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(defaultTeamId);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);

  // Fetch user's teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamsService.getTeams();
        // Handle DRF pagination format { results: [...] } or direct array
        const teams = response.results || response.data || (Array.isArray(response) ? response : []);
        setUserTeams(teams);
        // Set default team if not already set
        if (!selectedTeamId && teams.length > 0) {
          setSelectedTeamId(defaultTeamId || teams[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };
    fetchTeams();
  }, [defaultTeamId]);

  // Helper to stop current camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, []);

  // Start camera only when in video mode and not reviewing
  useEffect(() => {
    // Don't restart camera during active recording (would break MediaRecorder)
    if (recordingState === 'recording' || recordingState === 'paused') {
      return;
    }

    if (activeMode === 'video' && recordingState !== 'reviewing') {
      startCamera();
    } else if (activeMode !== 'video') {
      // Stop camera when switching away from video mode
      stopCamera();
    }
  }, [activeMode, facingMode, recordingState, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stopCamera]);

  const startCamera = async () => {
    try {
      // Stop existing stream first
      stopCamera();

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordedTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleRecord = () => {
    if (recordingState === 'idle') {
      // Start recording
      setRecordingState('recording');
      setRecordedTime(0);
      startTimer();
      
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        // Start with 1 second timeslice to capture data periodically
        mediaRecorderRef.current.start(1000);
      }
    } else if (recordingState === 'recording') {
      // Pause recording
      setRecordingState('paused');
      stopTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
    } else if (recordingState === 'paused') {
      // Resume recording
      setRecordingState('recording');
      startTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
      }
    }
  };

  const handleDelete = () => {
    // Delete recording and reset
    stopTimer();
    setRecordingState('idle');
    setRecordedTime(0);
    chunksRef.current = [];
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
  };

  const handleConfirm = () => {
    // Stop recording and enter review mode
    stopTimer();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        // Create blob from recorded chunks
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setRecordingState('reviewing');
      };
      mediaRecorderRef.current.stop();
    } else if (chunksRef.current.length > 0) {
      // MediaRecorder already stopped but we have chunks - create blob directly
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlobUrl(url);
      setRecordingState('reviewing');
    }
  };

  const handleReRecord = () => {
    // Clean up old recording and start fresh
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
      setRecordedBlobUrl(null);
    }
    setIsPlaying(false);
    chunksRef.current = [];
    setRecordedTime(0);
    setRecordingDescription('');
    setRecordingState('idle');
    // Restart the camera since it was stopped during review
    startCamera();
  };

  const handleSubmitClick = () => {
    // Show confirmation modal instead of submitting directly
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    // Actually submit the recording after confirmation based on activeMode
    if (activeMode === 'video') {
      setIsSubmitting(true);
      if (onComplete) {
        onComplete({
          type: 'video',
          chunks: chunksRef.current,
          blobUrl: recordedBlobUrl,
          duration: recordedTime,
          description: recordingDescription.trim() || 'Here is my explanation on my position',
          teamId: selectedTeamId
        });
      }
    } else if (activeMode === 'audio') {
      handleAudioSubmit();
    } else if (activeMode === 'text') {
      handleTextSubmit();
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
  };

  const handlePlayPause = () => {
    if (reviewVideoRef.current) {
      if (isPlaying) {
        reviewVideoRef.current.pause();
      } else {
        reviewVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleUpload = () => {
    // Handle video upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Uploaded file:', file.name);
        // Process uploaded file
      }
    };
    input.click();
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    // Don't call external handlers - handle all modes internally
  };

  const isPaused = recordingState === 'paused';
  const isRecording = recordingState === 'recording';
  const isReviewing = recordingState === 'reviewing';
  const isActive = isRecording || isPaused;

  // Text mode state
  const [textContent, setTextContent] = useState('');
  const [textReviewing, setTextReviewing] = useState(false);
  const [textDescription, setTextDescription] = useState('');

  // Audio mode state
  const [audioReviewing, setAudioReviewing] = useState(false);
  const [audioDescription, setAudioDescription] = useState('');
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Description for recording (shown in team recordings)
  const [recordingDescription, setRecordingDescription] = useState('');

  // Clean up blob URLs and recorders on unmount
  useEffect(() => {
    return () => {
      // Revoke video blob URL
      if (recordedBlobUrl) {
        URL.revokeObjectURL(recordedBlobUrl);
      }
      // Revoke audio blob URL
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
      // Clean up media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      // Clean up audio recorder
      if (audioRecorderRef.current) {
        if (audioRecorderRef.current.state !== 'inactive') {
          audioRecorderRef.current.stop();
        }
        if (audioRecorderRef.current.stream) {
          audioRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [recordedBlobUrl, audioBlobUrl]);

  // Stop camera when entering review mode to prevent interference
  useEffect(() => {
    if (recordingState === 'reviewing') {
      stopCamera();
    }
  }, [recordingState, stopCamera]);

  // Ensure review video uses blob URL not camera stream
  useEffect(() => {
    if (recordingState === 'reviewing' && reviewVideoRef.current && recordedBlobUrl) {
      // Explicitly clear any srcObject and set src
      reviewVideoRef.current.srcObject = null;
      reviewVideoRef.current.src = recordedBlobUrl;
      reviewVideoRef.current.load();
    }
  }, [recordingState, recordedBlobUrl]);

  // Render Review Mode Content
  const renderReviewMode = () => (
    <div className="record-video__preview-container">
      <div className="record-video__preview record-video__preview--review">
        <video 
          ref={reviewVideoRef}
          src={recordedBlobUrl}
          className="record-video__video record-video__video--review"
          playsInline
          onEnded={() => setIsPlaying(false)}
          onClick={handlePlayPause}
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <button
            className="record-video__play-btn"
            onClick={handlePlayPause}
            aria-label="Play recording"
          >
            <Play size={48} fill="currentColor" />
          </button>
        )}

        {/* Duration Badge */}
        <div className="record-video__review-duration">
          <span>{formatTime(recordedTime)}</span>
        </div>
      </div>

      {/* Description Input */}
      <DescriptionInput
        value={recordingDescription}
        onChange={setRecordingDescription}
        className="record-video__description-section"
      />

      {/* Review Controls */}
      <ReviewControls
        type="video"
        onReRecord={handleReRecord}
        onSubmit={handleSubmitClick}
        className="record-video__review-controls"
      />
    </div>
  );

  // Render Video Mode Content
  const renderVideoMode = () => {
    // Show review mode if reviewing
    if (isReviewing && recordedBlobUrl) {
      return renderReviewMode();
    }

    return (
      <div className="record-video__preview-container">
        <div className="record-video__preview">
          {hasPermission ? (
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline
              className="record-video__video"
            />
          ) : (
            <div className="record-video__placeholder">
              <p>Camera access required</p>
              <button onClick={startCamera} className="record-video__enable-btn">
                Enable Camera
              </button>
            </div>
          )}

          {/* Recording Timer */}
          {isActive && (
            <RecordingTimer
              time={recordedTime}
              isRecording={isRecording}
              className="record-video__timer"
            />
          )}

          {/* Controls Container */}
          <div className="record-video__controls">
            {/* Delete Button (left side) - shown when paused */}
            <div className="record-video__control-side record-video__control-left">
              {isPaused && (
                <button
                  className="record-video__action-btn record-video__delete-btn"
                  onClick={handleDelete}
                  aria-label="Delete recording"
                >
                  <Trash2 size={24} />
                </button>
              )}
              {!isActive && (
                <div className="record-video__time-badge">
                  <span>{formatTime(recordedTime)}</span>
                </div>
              )}
            </div>

            {/* Record Button (center) */}
            <button 
              className={`record-video__record-btn ${isRecording ? 'recording' : ''} ${isPaused ? 'paused' : ''}`}
              onClick={handleRecord}
              aria-label={isRecording ? 'Pause recording' : isPaused ? 'Resume recording' : 'Start recording'}
            >
              <span className="record-video__record-btn-inner" />
            </button>

            {/* Confirm Button (right side) - shown when paused */}
            <div className="record-video__control-side record-video__control-right">
              {isPaused && (
                <button
                  className="record-video__action-btn record-video__confirm-btn"
                  onClick={handleConfirm}
                  aria-label="Confirm recording"
                >
                  <Check size={24} />
                </button>
              )}
              {!isActive && (
                <div className="record-video__time-badge">
                  <span>{formatTime(recordedTime)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          {!isActive && (
            <button
              className="record-video__upload-btn"
              onClick={handleUpload}
              aria-label="Upload video"
            >
              <div className="record-video__upload-icon">
                <Image size={24} />
              </div>
              <span className="record-video__upload-label">Upload</span>
            </button>
          )}

          {/* Flip Camera Button */}
          {!isActive && hasPermission && (
            <button
              className="record-video__flip-btn"
              onClick={handleFlipCamera}
              aria-label="Flip camera"
            >
              <SwitchCamera size={20} />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Handle text submission to review mode
  const handleTextConfirm = () => {
    if (textContent.trim()) {
      setTextReviewing(true);
    }
  };

  // Handle text edit (go back from review)
  const handleTextEdit = () => {
    setTextReviewing(false);
  };

  // Handle text submit click (show modal)
  const handleTextSubmitClick = () => {
    setShowConfirmModal(true);
  };

  // Handle text final submit after confirmation
  const handleTextSubmit = () => {
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({
        type: 'text',
        content: textContent,
        description: textDescription.trim() || 'My written explanation',
        teamId: selectedTeamId
      });
    }
  };

  // Render Text Review Mode
  const renderTextReviewMode = () => (
    <div className="record-video__text-mode">
      <div className="record-video__text-container">
        <h2 className="record-video__text-title">Review Your Response</h2>
        <div className="record-video__text-preview">
          {textContent}
        </div>

        {/* Description Input */}
        <DescriptionInput
          value={textDescription}
          onChange={setTextDescription}
          className="record-video__description-section record-video__description-section--text"
        />

        {/* Review Controls */}
        <ReviewControls
          type="text"
          onReRecord={handleTextEdit}
          onSubmit={handleTextSubmitClick}
          className="record-video__review-controls record-video__review-controls--text"
        />
      </div>
    </div>
  );

  // Render Text Mode Content
  const renderTextMode = () => {
    // Show review mode if reviewing
    if (textReviewing && textContent.trim()) {
      return renderTextReviewMode();
    }

    return (
      <div className="record-video__text-mode">
        <div className="record-video__text-container">
          <h2 className="record-video__text-title">Reason for my Answers</h2>
          <textarea
            className="record-video__textarea"
            placeholder="Share your thoughts here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />
          <div className="record-video__text-toolbar">
            <div className="record-video__text-toolbar-group">
              <button className="record-video__text-btn" title="Align left">
                <AlignLeft size={16} />
              </button>
              <button className="record-video__text-btn" title="Align center">
                <AlignCenter size={16} />
              </button>
              <button className="record-video__text-btn" title="Align right">
                <AlignRight size={16} />
              </button>
            </div>
            <div className="record-video__text-toolbar-group">
              <button className="record-video__text-btn record-video__text-btn--font" title="Font size">A</button>
              <button className="record-video__text-btn" title="Bold"><strong>B</strong></button>
              <button className="record-video__text-btn" title="Italic"><em>I</em></button>
              <button className="record-video__text-btn" title="List">
                <List size={16} />
              </button>
            </div>
            <button
              className="record-video__text-submit"
              onClick={handleTextConfirm}
              disabled={!textContent.trim()}
            >
              <Check size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Start audio-only recording
  const startAudioRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorderRef.current = new MediaRecorder(audioStream);
      audioChunksRef.current = [];

      audioRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      // Start with 1 second timeslice to capture data periodically
      audioRecorderRef.current.start(1000);
      setRecordingState('recording');
      setRecordedTime(0);
      startTimer();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Handle audio record button
  const handleAudioRecord = () => {
    if (recordingState === 'idle') {
      startAudioRecording();
    } else if (recordingState === 'recording') {
      setRecordingState('paused');
      stopTimer();
      if (audioRecorderRef.current && audioRecorderRef.current.state === 'recording') {
        audioRecorderRef.current.pause();
      }
    } else if (recordingState === 'paused') {
      setRecordingState('recording');
      startTimer();
      if (audioRecorderRef.current && audioRecorderRef.current.state === 'paused') {
        audioRecorderRef.current.resume();
      }
    }
  };

  // Handle audio delete
  const handleAudioDelete = () => {
    stopTimer();
    setRecordingState('idle');
    setRecordedTime(0);
    audioChunksRef.current = [];
    if (audioRecorderRef.current) {
      if (audioRecorderRef.current.state !== 'inactive') {
        audioRecorderRef.current.stop();
      }
      // Stop the audio stream tracks
      if (audioRecorderRef.current.stream) {
        audioRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      audioRecorderRef.current = null;
    }
  };

  // Handle audio confirm (go to review)
  const handleAudioConfirm = () => {
    stopTimer();

    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      audioRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlobUrl(url);
        setAudioReviewing(true);
        setRecordingState('idle');
      };
      audioRecorderRef.current.stop();
    } else if (audioChunksRef.current.length > 0) {
      // MediaRecorder already stopped but we have chunks - create blob directly
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioBlobUrl(url);
      setAudioReviewing(true);
      setRecordingState('idle');
    }
  };

  // Handle audio re-record
  const handleAudioReRecord = () => {
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
      setAudioBlobUrl(null);
    }
    setIsAudioPlaying(false);
    audioChunksRef.current = [];
    setRecordedTime(0);
    setAudioDescription('');
    setAudioReviewing(false);
  };

  // Handle audio submit click (show modal)
  const handleAudioSubmitClick = () => {
    setShowConfirmModal(true);
  };

  // Handle audio submit after confirmation
  const handleAudioSubmit = () => {
    setIsSubmitting(true);
    if (onComplete) {
      onComplete({
        type: 'audio',
        chunks: audioChunksRef.current,
        blobUrl: audioBlobUrl,
        duration: recordedTime,
        description: audioDescription.trim() || 'My audio explanation',
        teamId: selectedTeamId
      });
    }
  };

  // Handle audio play/pause
  const handleAudioPlayPause = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Render Audio Review Mode
  const renderAudioReviewMode = () => (
    <div className="record-video__audio-mode record-video__audio-mode--review">
      {/* Audio Player */}
      <div className="record-video__audio-player">
        <audio
          ref={audioRef}
          src={audioBlobUrl}
          onEnded={() => setIsAudioPlaying(false)}
        />
        <button
          className="record-video__audio-play-btn"
          onClick={handleAudioPlayPause}
          aria-label={isAudioPlaying ? 'Pause' : 'Play'}
        >
          {isAudioPlaying ? (
            <Pause size={32} fill="currentColor" />
          ) : (
            <Play size={48} fill="currentColor" />
          )}
        </button>
        <div className="record-video__audio-duration">
          {formatTime(recordedTime)}
        </div>
      </div>

      {/* Description Input */}
      <DescriptionInput
        value={audioDescription}
        onChange={setAudioDescription}
        className="record-video__description-section record-video__description-section--audio"
      />

      {/* Review Controls */}
      <ReviewControls
        type="audio"
        onReRecord={handleAudioReRecord}
        onSubmit={handleAudioSubmitClick}
        className="record-video__review-controls"
      />
    </div>
  );

  // Render Audio Mode Content
  const renderAudioMode = () => {
    // Show review mode if reviewing
    if (audioReviewing && audioBlobUrl) {
      return renderAudioReviewMode();
    }

    return (
      <div className="record-video__audio-mode">
        {/* Central Recording Hub */}
        <div className={`record-video__audio-hub ${isRecording ? 'is-recording' : ''} ${isPaused ? 'is-paused' : ''}`}>
          {/* Circular Waveform Rings */}
          <div className="record-video__audio-rings">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`record-video__audio-ring ${isRecording ? 'active' : ''}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>

          {/* Waveform Bars in Circle */}
          <div className="record-video__audio-circle-wave">
            {[...Array(32)].map((_, i) => (
              <span
                key={i}
                className={`record-video__audio-circle-bar ${isRecording ? 'active' : ''}`}
                style={{
                  transform: `rotate(${i * 11.25}deg)`,
                  animationDelay: `${i * 0.03}s`
                }}
              />
            ))}
          </div>

          {/* Record Button */}
          <button
            className={`record-video__audio-record-btn ${isRecording ? 'recording' : ''} ${isPaused ? 'paused' : ''}`}
            onClick={handleAudioRecord}
            aria-label={isRecording ? 'Pause recording' : isPaused ? 'Resume recording' : 'Start recording'}
          >
            <span className="record-video__audio-record-btn-inner" />
          </button>
        </div>

        {/* Timer Display */}
        <div className={`record-video__audio-timer-display ${isActive ? 'visible' : ''}`}>
          <span className={`record-video__audio-timer-dot ${isRecording ? 'active' : ''}`} />
          <span className="record-video__audio-timer-text">{formatTime(recordedTime)}</span>
        </div>

        {/* Status Text */}
        <p className="record-video__audio-status">
          {isRecording ? 'Recording...' : isPaused ? 'Paused' : 'Tap to start recording'}
        </p>

        {/* Action Buttons */}
        {isPaused && (
          <div className="record-video__audio-actions">
            <button
              className="record-video__audio-action-btn record-video__audio-action-btn--delete"
              onClick={handleAudioDelete}
              aria-label="Delete recording"
            >
              <Trash2 size={20} />
              <span>Delete</span>
            </button>
            <button
              className="record-video__audio-action-btn record-video__audio-action-btn--confirm"
              onClick={handleAudioConfirm}
              aria-label="Confirm recording"
            >
              <Check size={20} />
              <span>Done</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`record-video record-video--${activeMode}`}>
      {/* Gradient Background */}
      <div className="record-video__background" />

      {/* Close Button (mobile) */}
      <button
        className="record-video__close-btn"
        onClick={onBack}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="record-video__content">
        {/* Heading - show for all modes */}
        <h1 className="record-video__title">Record your Explanation</h1>

        {/* Team Visibility Selector */}
        {userTeams.length > 0 && (
          <TeamSelector
            teams={userTeams}
            selectedTeamId={selectedTeamId}
            onSelectTeam={setSelectedTeamId}
            isOpen={showTeamDropdown}
            onToggle={() => setShowTeamDropdown(!showTeamDropdown)}
            className="record-video__team-selector"
          />
        )}

        {/* Mode Content */}
        {activeMode === 'video' && renderVideoMode()}
        {activeMode === 'text' && renderTextMode()}
        {activeMode === 'audio' && renderAudioMode()}

        {/* Mode Tabs */}
        <div className="record-video__mode-tabs">
          <button 
            className={`record-video__mode-tab ${activeMode === 'text' ? 'active' : ''}`}
            onClick={() => handleModeChange('text')}
          >
            TEXT
            {activeMode === 'text' && <span className="record-video__mode-underline" />}
          </button>
          <button 
            className={`record-video__mode-tab ${activeMode === 'video' ? 'active' : ''}`}
            onClick={() => handleModeChange('video')}
          >
            VIDEO
            {activeMode === 'video' && <span className="record-video__mode-underline" />}
          </button>
          <button 
            className={`record-video__mode-tab ${activeMode === 'audio' ? 'active' : ''}`}
            onClick={() => handleModeChange('audio')}
          >
            AUDIO
            {activeMode === 'audio' && <span className="record-video__mode-underline" />}
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        title="Submit Recording?"
        message={`Are you sure you want to submit this ${activeMode === 'text' ? 'written response' : activeMode === 'audio' ? 'audio recording' : 'video'}? It will be shared with your care team.`}
        confirmLabel="Yes, Submit"
        cancelLabel="Go Back"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default RecordVideo;
