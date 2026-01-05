import React from 'react';
import './TeamVisibilitySuccess.css';
import { PrimaryButton, SecondaryButton } from '../../common/Button';

// Video Record Icon
const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
    <circle cx="10" cy="10" r="4" fill="white"/>
  </svg>
);

// Audio Record Icon
const AudioIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C8.34 2 7 3.34 7 5V10C7 11.66 8.34 13 10 13C11.66 13 13 11.66 13 10V5C13 3.34 11.66 2 10 2Z" fill="white"/>
    <path d="M15 10C15 12.76 12.76 15 10 15C7.24 15 5 12.76 5 10H3C3 13.53 5.61 16.43 9 16.92V19H11V16.92C14.39 16.43 17 13.53 17 10H15Z" fill="white"/>
  </svg>
);

// Text Entry Icon
const TextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17H17V15H3V17ZM3 13H17V11H3V13ZM3 9H17V7H3V9ZM3 3V5H17V3H3Z" fill="white"/>
    <path d="M15 3L17 5V17H15V3Z" fill="white"/>
  </svg>
);

const TeamVisibilitySuccess = ({
  userName = "User",
  userAvatar,
  onSkip,
  onBackHome,
  onRecordVideo,
  onRecordAudio,
  onEnterText
}) => {
  // Generate initials for fallback avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="team-success">
      {/* Background Gradient */}
      <div className="team-success__background" />

      {/* Animated Breathing Orbs */}
      <div className="team-success__orbs">
        <div className="team-success__orb team-success__orb--1" />
        <div className="team-success__orb team-success__orb--2" />
        <div className="team-success__orb team-success__orb--3" />
      </div>

      {/* Content */}
      <div className="team-success__content">
        {/* User Avatar */}
        <div className="team-success__avatar-container">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="team-success__avatar"
            />
          ) : (
            <div className="team-success__avatar team-success__avatar--initials">
              {getInitials(userName)}
            </div>
          )}
        </div>

        {/* Right side content group (for desktop layout) */}
        <div className="team-success__right">
          {/* Text Block */}
          <div className="team-success__text">
            <h1 className="team-success__title">You Did It!</h1>
            <p className="team-success__subtitle">
              You made your choice, now it's time to explain the reason behind it.
            </p>
          </div>

          {/* Response Options */}
          <div className="team-success__options">
            <button className="team-success__option" onClick={onRecordVideo}>
              <div className="team-success__option-icon">
                <VideoIcon />
              </div>
              <span className="team-success__option-label">
                RECORD<br />VIDEO
              </span>
            </button>

            <button className="team-success__option" onClick={onRecordAudio}>
              <div className="team-success__option-icon">
                <AudioIcon />
              </div>
              <span className="team-success__option-label">
                RECORD<br />AUDIO
              </span>
            </button>

            <button className="team-success__option" onClick={onEnterText}>
              <div className="team-success__option-icon">
                <TextIcon />
              </div>
              <span className="team-success__option-label">
                ENTER<br />TEXT
              </span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="team-success__actions">
          <PrimaryButton onClick={onSkip} fullWidth>
            Skip for Now
          </PrimaryButton>
          <SecondaryButton onClick={onBackHome} fullWidth>
            Back to Home
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default TeamVisibilitySuccess;
