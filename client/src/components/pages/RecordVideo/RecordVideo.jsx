import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../../common/Button';
import './RecordVideo.css';

// Delete/Trash Icon
const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Checkmark Icon
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Flip Camera Icon
const FlipCameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8C21 6.89543 20.1046 6 19 6H16.5L15 4H9L7.5 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14C13.6569 14 15 12.6569 15 11C15 9.34315 13.6569 8 12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 11L7 9M15 11L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Play Icon
const PlayIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
  </svg>
);

// Re-record Icon
const ReRecordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.51 15C4.15 16.82 5.32 18.42 6.87 19.57C8.42 20.72 10.26 21.38 12.18 21.47C14.09 21.56 15.99 21.08 17.63 20.09C19.27 19.1 20.58 17.64 21.38 15.9C22.19 14.16 22.46 12.22 22.15 10.33C21.84 8.44 21 6.69 19.71 5.28C18.43 3.87 16.76 2.87 14.91 2.41C13.06 1.95 11.12 2.05 9.33 2.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1 10L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Instructions Modal Component
const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="record-video__modal-overlay" onClick={onClose}>
      <div className="record-video__modal" onClick={(e) => e.stopPropagation()}>
        <button className="record-video__modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon />
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
  initialMode = 'video'
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
  const videoRef = useRef(null);
  const reviewVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode },
        audio: true 
      });
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
        
        mediaRecorderRef.current.start();
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
      mediaRecorderRef.current.stop();
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
  };

  const handleSubmit = () => {
    // Submit the recording
    if (onComplete) {
      onComplete({ 
        type: 'video', 
        chunks: chunksRef.current, 
        blobUrl: recordedBlobUrl, 
        duration: recordedTime,
        description: recordingDescription.trim() || 'Here is my explanation on my position'
      });
    }
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

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (recordedBlobUrl) {
        URL.revokeObjectURL(recordedBlobUrl);
      }
    };
  }, [recordedBlobUrl]);

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
            <PlayIcon />
          </button>
        )}

        {/* Duration Badge */}
        <div className="record-video__review-duration">
          <span>{formatTime(recordedTime)}</span>
        </div>
      </div>

      {/* Description Input */}
      <div className="record-video__description-section">
        <label className="record-video__description-label">Add a short description</label>
        <div className="record-video__description-input-wrapper">
          <input
            type="text"
            className="record-video__description-input"
            placeholder="E.g., My thoughts on quality of life..."
            value={recordingDescription}
            onChange={(e) => setRecordingDescription(e.target.value.slice(0, 150))}
            maxLength={150}
          />
          <span className="record-video__description-count">{recordingDescription.length}/150</span>
        </div>
      </div>

      {/* Review Controls */}
      <div className="record-video__review-controls">
        <button 
          className="record-video__review-btn record-video__review-btn--rerecord"
          onClick={handleReRecord}
        >
          <ReRecordIcon />
          <span>Re-record</span>
        </button>
        <button 
          className="record-video__review-btn record-video__review-btn--submit"
          onClick={handleSubmit}
        >
          <CheckIcon />
          <span>Use this video</span>
        </button>
      </div>
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
            <div className="record-video__timer">
              <span className={`record-video__timer-dot ${isRecording ? 'recording' : ''}`} />
              <span className="record-video__timer-text">{formatTime(recordedTime)}</span>
            </div>
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
                  <DeleteIcon />
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
                  <CheckIcon />
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="2" fill="#4A90D9"/>
                  <circle cx="8" cy="16" r="2" fill="#F5A623"/>
                  <path d="M4 18L8 14L12 16L20 8" stroke="#fff" strokeWidth="1.5" fill="none"/>
                </svg>
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
              <FlipCameraIcon />
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

  // Handle text final submit
  const handleTextSubmit = () => {
    if (onComplete) {
      onComplete({
        type: 'text',
        content: textContent,
        description: textDescription.trim() || 'My written explanation'
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
        <div className="record-video__description-section record-video__description-section--text">
          <label className="record-video__description-label">Add a short description</label>
          <div className="record-video__description-input-wrapper">
            <input
              type="text"
              className="record-video__description-input"
              placeholder="E.g., My thoughts on quality of life..."
              value={textDescription}
              onChange={(e) => setTextDescription(e.target.value.slice(0, 150))}
              maxLength={150}
            />
            <span className="record-video__description-count">{textDescription.length}/150</span>
          </div>
        </div>

        {/* Review Controls */}
        <div className="record-video__review-controls record-video__review-controls--text">
          <button
            className="record-video__review-btn record-video__review-btn--rerecord"
            onClick={handleTextEdit}
          >
            <ReRecordIcon />
            <span>Edit</span>
          </button>
          <button
            className="record-video__review-btn record-video__review-btn--submit"
            onClick={handleTextSubmit}
          >
            <CheckIcon />
            <span>Use this text</span>
          </button>
        </div>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/>
                </svg>
              </button>
              <button className="record-video__text-btn" title="Align center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z"/>
                </svg>
              </button>
              <button className="record-video__text-btn" title="Align right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"/>
                </svg>
              </button>
            </div>
            <div className="record-video__text-toolbar-group">
              <button className="record-video__text-btn record-video__text-btn--font" title="Font size">A</button>
              <button className="record-video__text-btn" title="Bold"><strong>B</strong></button>
              <button className="record-video__text-btn" title="Italic"><em>I</em></button>
              <button className="record-video__text-btn" title="List">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 4h2v2H3V4zm4 0h14v2H7V4zM3 10h2v2H3v-2zm4 0h14v2H7v-2zm-4 6h2v2H3v-2zm4 0h14v2H7v-2z"/>
                </svg>
              </button>
            </div>
            <button
              className="record-video__text-submit"
              onClick={handleTextConfirm}
              disabled={!textContent.trim()}
            >
              <CheckIcon />
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

      audioRecorderRef.current.start();
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
    if (audioRecorderRef.current && audioRecorderRef.current.state !== 'inactive') {
      audioRecorderRef.current.stop();
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

  // Handle audio submit
  const handleAudioSubmit = () => {
    if (onComplete) {
      onComplete({
        type: 'audio',
        chunks: audioChunksRef.current,
        blobUrl: audioBlobUrl,
        duration: recordedTime,
        description: audioDescription.trim() || 'My audio explanation'
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
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <PlayIcon />
          )}
        </button>
        <div className="record-video__audio-duration">
          {formatTime(recordedTime)}
        </div>
      </div>

      {/* Description Input */}
      <div className="record-video__description-section record-video__description-section--audio">
        <label className="record-video__description-label">Add a short description</label>
        <div className="record-video__description-input-wrapper">
          <input
            type="text"
            className="record-video__description-input"
            placeholder="E.g., My thoughts on quality of life..."
            value={audioDescription}
            onChange={(e) => setAudioDescription(e.target.value.slice(0, 150))}
            maxLength={150}
          />
          <span className="record-video__description-count">{audioDescription.length}/150</span>
        </div>
      </div>

      {/* Review Controls */}
      <div className="record-video__review-controls">
        <button
          className="record-video__review-btn record-video__review-btn--rerecord"
          onClick={handleAudioReRecord}
        >
          <ReRecordIcon />
          <span>Re-record</span>
        </button>
        <button
          className="record-video__review-btn record-video__review-btn--submit"
          onClick={handleAudioSubmit}
        >
          <CheckIcon />
          <span>Use this audio</span>
        </button>
      </div>
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
        {/* Audio Visualization */}
        <div className="record-video__audio-visualizer">
          <div className="record-video__audio-wave">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className={`record-video__audio-bar ${isRecording ? 'active' : ''}`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: isRecording ? `${Math.random() * 60 + 20}%` : '20%'
                }}
              />
            ))}
          </div>
        </div>

        {/* Recording Timer */}
        {isActive && (
          <div className="record-video__audio-timer">
            <span className={`record-video__timer-dot ${isRecording ? 'recording' : ''}`} />
            <span className="record-video__timer-text">{formatTime(recordedTime)}</span>
          </div>
        )}

        {/* Audio Controls */}
        <div className="record-video__audio-controls">
          <div className="record-video__control-side record-video__control-left">
            {isPaused && (
              <button
                className="record-video__action-btn record-video__delete-btn"
                onClick={handleAudioDelete}
                aria-label="Delete recording"
              >
                <DeleteIcon />
              </button>
            )}
          </div>

          <button
            className={`record-video__record-btn ${isRecording ? 'recording' : ''} ${isPaused ? 'paused' : ''}`}
            onClick={handleAudioRecord}
            aria-label={isRecording ? 'Pause recording' : isPaused ? 'Resume recording' : 'Start recording'}
          >
            <span className="record-video__record-btn-inner" />
          </button>

          <div className="record-video__control-side record-video__control-right">
            {isPaused && (
              <button
                className="record-video__action-btn record-video__confirm-btn"
                onClick={handleAudioConfirm}
                aria-label="Confirm recording"
              >
                <CheckIcon />
              </button>
            )}
          </div>
        </div>
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
        <CloseIcon />
      </button>

      {/* Content */}
      <div className="record-video__content">
        {/* Heading - show for all modes */}
        <h1 className="record-video__title">Record your Explanation</h1>

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
    </div>
  );
};

export default RecordVideo;
