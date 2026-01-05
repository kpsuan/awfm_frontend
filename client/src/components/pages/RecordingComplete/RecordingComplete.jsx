import React, { useRef, useState } from 'react';
import './RecordingComplete.css';

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Refresh/Retry Icon for Record Again
const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3313 3 18.2398 4.80909 19.796 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 3V7.5H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Play Icon for video/audio preview
const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.14V19.14L19 12.14L8 5.14Z" fill="currentColor"/>
  </svg>
);

// Pause Icon
const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
  </svg>
);

// Recording Preview Component
const RecordingPreviewComponent = ({ recordingPreview }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playPromiseRef = useRef(null);

  if (!recordingPreview) return null;

  const handlePlayPause = async () => {
    const mediaRef = recordingPreview.type === 'video' ? videoRef : audioRef;

    if (!mediaRef.current) return;

    if (isPlaying) {
      // If there's a pending play promise, wait for it before pausing
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          // Ignore - play was interrupted
        }
        playPromiseRef.current = null;
      }
      mediaRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        playPromiseRef.current = mediaRef.current.play();
        await playPromiseRef.current;
        playPromiseRef.current = null;
        setIsPlaying(true);
      } catch (error) {
        // Play was interrupted or failed - ignore gracefully
        playPromiseRef.current = null;
        setIsPlaying(false);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    playPromiseRef.current = null;
  };

  if (recordingPreview.type === 'video') {
    return (
      <div className="recording-complete__preview recording-complete__preview--video">
        <video
          ref={videoRef}
          src={recordingPreview.url}
          className="recording-complete__preview-video"
          onEnded={handleEnded}
          playsInline
        />
        <button
          className="recording-complete__preview-play"
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="recording-complete__preview-label">Your Video Recording</div>
      </div>
    );
  }

  if (recordingPreview.type === 'audio') {
    return (
      <div className="recording-complete__preview recording-complete__preview--audio">
        <audio
          ref={audioRef}
          src={recordingPreview.url}
          onEnded={handleEnded}
        />
        <div className="recording-complete__audio-visualizer">
          <div className="recording-complete__audio-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10.3431 2 9 3.34315 9 5V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V5C15 3.34315 13.6569 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="recording-complete__audio-bars">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`recording-complete__audio-bar ${isPlaying ? 'recording-complete__audio-bar--playing' : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <button
          className="recording-complete__preview-play recording-complete__preview-play--audio"
          onClick={handlePlayPause}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="recording-complete__preview-label">Your Audio Recording</div>
      </div>
    );
  }

  if (recordingPreview.type === 'text') {
    return (
      <div className="recording-complete__preview recording-complete__preview--text">
        <div className="recording-complete__text-content">
          <p>{recordingPreview.content}</p>
        </div>
        <div className="recording-complete__preview-label">Your Written Response</div>
      </div>
    );
  }

  return null;
};

// User avatars - using placeholder images from the design
const userAvatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', alt: 'Team member 1' },
  { id: 2, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', alt: 'Team member 2' },
  { id: 3, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', alt: 'Team member 3' },
  { id: 4, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', alt: 'Team member 4' },
  { id: 5, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', alt: 'Team member 5' },
  { id: 6, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', alt: 'Team member 6' },
  { id: 7, src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face', alt: 'Team member 7' },
  { id: 8, src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face', alt: 'Team member 8' },
];

// Top row avatars (will scroll left to right)
const topRowAvatars = userAvatars.slice(0, 5);
// Bottom row avatars (will scroll right to left) - different order
const bottomRowAvatars = [...userAvatars.slice(3), ...userAvatars.slice(0, 3)];

const RecordingComplete = ({
  recordingPreview,
  onViewTeamRecordings,
  onRecordAgain
}) => {
  return (
    <div className="recording-complete">
      {/* Illustration Area with Avatars */}
      <div className="recording-complete__illustration">
        <div className="recording-complete__gradient-bg"></div>

        {/* Avatar Rows - duplicated for seamless infinite scroll */}
        <div className="recording-complete__avatars">
          <div className="recording-complete__avatar-row recording-complete__avatar-row--top">
            {/* First set */}
            {topRowAvatars.map((avatar) => (
              <div
                key={`top-1-${avatar.id}`}
                className="recording-complete__avatar"
              >
                <img src={avatar.src} alt={avatar.alt} />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {topRowAvatars.map((avatar) => (
              <div
                key={`top-2-${avatar.id}`}
                className="recording-complete__avatar"
              >
                <img src={avatar.src} alt={avatar.alt} />
              </div>
            ))}
          </div>
          <div className="recording-complete__avatar-row recording-complete__avatar-row--bottom">
            {/* First set */}
            {bottomRowAvatars.map((avatar, index) => (
              <div
                key={`bottom-1-${avatar.id}-${index}`}
                className="recording-complete__avatar"
              >
                <img src={avatar.src} alt={avatar.alt} />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {bottomRowAvatars.map((avatar, index) => (
              <div
                key={`bottom-2-${avatar.id}-${index}`}
                className="recording-complete__avatar"
              >
                <img src={avatar.src} alt={avatar.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="recording-complete__content">
        {/* Recording Preview - above the title */}
        {recordingPreview && (
          <div className="recording-complete__preview-wrapper">
            <RecordingPreviewComponent recordingPreview={recordingPreview} />
          </div>
        )}

        <div className="recording-complete__text-block">
          <h2 className="recording-complete__title">A Whole Family Matter</h2>
          <p className="recording-complete__description">
            Now that you've explained your reasoning, it's time to hear what your care team thinks. Because you deserve to be heard, and so do they.
          </p>
        </div>

        {/* Buttons */}
        <div className="recording-complete__actions">
          <button
            className="recording-complete__btn recording-complete__btn--primary"
            onClick={onViewTeamRecordings}
          >
            <span>View Team Recordings</span>
            <ArrowRightIcon />
          </button>
          <button
            className="recording-complete__btn recording-complete__btn--secondary"
            onClick={onRecordAgain}
          >
            <RefreshIcon />
            <span>Record Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingComplete;
