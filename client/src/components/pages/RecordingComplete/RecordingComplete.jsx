import React, { useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Play, Pause, Mic } from 'lucide-react';
import './RecordingComplete.css';

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
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
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
            <Mic size={40} />
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
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
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
            <ArrowRight size={18} />
          </button>
          <button
            className="recording-complete__btn recording-complete__btn--secondary"
            onClick={onRecordAgain}
          >
            <RotateCcw size={18} />
            <span>Record Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordingComplete;
