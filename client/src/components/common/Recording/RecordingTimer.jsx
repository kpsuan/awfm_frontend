import React from 'react';
import './Recording.css';

const RecordingTimer = ({
  time,
  isRecording = false,
  showDot = true,
  className = ""
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`recording-timer ${className}`}>
      {showDot && (
        <span className={`recording-timer__dot ${isRecording ? 'recording-timer__dot--active' : ''}`} />
      )}
      <span className="recording-timer__text">{formatTime(time)}</span>
    </div>
  );
};

export default RecordingTimer;
