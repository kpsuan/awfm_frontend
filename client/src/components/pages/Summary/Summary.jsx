import React, { useState, useEffect } from 'react';
import './Summary.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { Modal } from '../../common/Modal';
import logo from '../../../styles/logo.png';
import FullSummary from '../FullSummary';

// Checkmark icon with gradient
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M13.3 4.7L6.5 11.5L3 8" 
      stroke="url(#checkGradient)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="checkGradient" x1="3" y1="8" x2="13.3" y2="8" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5C40FB"/>
        <stop offset="1" stopColor="#F23B8B"/>
      </linearGradient>
    </defs>
  </svg>
);

// Play icon for video recordings
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="rgba(255, 255, 255, 0.9)" />
    <path d="M8 6L14 10L8 14V6Z" fill="#B432A3" />
  </svg>
);

const Summary = ({
  question,
  userName = "Norman",
  userAvatar = "https://i.pravatar.cc/82?img=8",
  checkpoints = [],
  reflections = [],
  team = [],
  teamRecordings = [],
  progress = { current: 4, total: 4 },
  onContinue,
  onBack,
  onBackHome,
  onChangeAnswer,
  onViewTeamRecordings,
  onNavigateToTeamVisibility,
  isFirstVisit = false
}) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  // Show modal on first visit
  useEffect(() => {
    if (isFirstVisit) {
      setShowRecordingModal(true);
    }
  }, [isFirstVisit]);

  const { title, subtitle, sectionLabel } = question || {
    title: "How important is staying alive even if you have substantial physical limitations?",
    subtitle: "Question 10 A",
    sectionLabel: "Advance Care Planning"
  };

  // Default checkpoints data if none provided
  const defaultCheckpoints = [
    {
      id: 1,
      title: "Checkpoint 1: How important is staying alive even if you have substantial physical limitations?",
      choices: ["Life extension is very important regardless of function"]
    },
    {
      id: 2,
      title: "Checkpoint 2: What concerns, issues, and challenges might you be facing?",
      choices: [
        "Worried about becoming a burden to loved ones",
        "Worried doctors might undervalue my life with disability"
      ]
    },
    {
      id: 3,
      title: "Checkpoint 3: What Would Change Your Mind",
      choices: ["Meeting people with disabilities living meaningful lives"]
    }
  ];

  const displayCheckpoints = checkpoints.length > 0 ? checkpoints : defaultCheckpoints;

  // Default team members if none provided
  const defaultTeam = [
    { id: 1, name: "Dr. Sarah", avatar: "https://i.pravatar.cc/82?img=1", affirmed: true, affirmedDate: "Dec 5, 2025" },
    { id: 2, name: "John", avatar: "https://i.pravatar.cc/82?img=2", affirmed: true, affirmedDate: "Dec 3, 2025" },
    { id: 3, name: "Mary", avatar: "https://i.pravatar.cc/82?img=3", affirmed: false },
    { id: 4, name: "James", avatar: "https://i.pravatar.cc/82?img=4", affirmed: false },
    { id: 5, name: "Lisa", avatar: "https://i.pravatar.cc/82?img=5", affirmed: false }
  ];

  const displayTeam = team.length > 0 ? team : defaultTeam;

  // Default team recordings if none provided
  const defaultTeamRecordings = [
    { id: 1, name: "Dr. Sarah", avatar: "https://i.pravatar.cc/82?img=1", hasRecording: true, thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" },
    { id: 2, name: "John", avatar: "https://i.pravatar.cc/82?img=2", hasRecording: true, thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
    { id: 3, name: "Mary", avatar: "https://i.pravatar.cc/82?img=3", hasRecording: false, thumbnail: null }
  ];

  const displayRecordings = teamRecordings.length > 0 ? teamRecordings : defaultTeamRecordings;
  const recordingsWithVideo = displayRecordings.filter(r => r.hasRecording);
  const recordingsCount = recordingsWithVideo.length;

  // If showing full summary, render that instead
  if (showFullSummary) {
    return (
      <FullSummary
        userName={userName}
        reflections={reflections}
        team={displayTeam}
        onContinue={onViewTeamRecordings}
        onBack={() => setShowFullSummary(false)}
      />
    );
  }

  return (
    <TwoColumnLayout>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack}>
        <div className="summary__left">
          <div className="summary__icon">
            <div className="summary__icon-outer">
              <div className="summary__icon-inner">
                <img src={logo} alt="AWFM Logo" className="summary__logo-img" />
              </div>
            </div>
          </div>
          
          <div className="summary__question-info">
            <span className="summary__section-label">{sectionLabel || "Advance Care Planning"}</span>
            <span className="summary__question-number">{subtitle || "Question 10 A"}</span>
            <h1 className="summary__question-title">{title}</h1>
          </div>
        </div>
      </QuestionPanel>

      <ContentPanel>
        <div className="summary__content">
          {/* Header */}
          <div className="summary__header">
            <span className="summary__header-label">Advance Care Planning</span>
            <h2 className="summary__header-title">{userName}'s Decisions for Q10A</h2>
          </div>

          {/* Checkpoints Summary Box */}
          <div className="summary__box">
            {displayCheckpoints.map((checkpoint, index) => (
              <div key={checkpoint.id || index} className="summary__checkpoint">
                <h3 className="summary__checkpoint-title">{checkpoint.title}</h3>
                <div className="summary__choices">
                  {checkpoint.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="summary__choice">
                      <CheckIcon />
                      <span className="summary__choice-text">{choice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Team Affirmation Section */}
            <div className="summary__affirmation">
              <h3 className="summary__affirmation-title">Who has affirmed their commitment</h3>
              <p className="summary__affirmation-description">
                Colored profiles indicate affirmation. Gray profiles indicate no affirmation yet.
              </p>
              <div className="summary__avatars">
                {displayTeam.map((member) => (
                  <div key={member.id} className="summary__avatar-wrapper">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={`summary__avatar ${member.affirmed ? 'summary__avatar--affirmed' : ''}`}
                    />
                    <div className="summary__avatar-tooltip">
                      <span className="summary__avatar-tooltip-name">{member.name}</span>
                      {member.affirmed ? (
                        <span className="summary__avatar-tooltip-date">Affirmed {member.affirmedDate}</span>
                      ) : (
                        <span className="summary__avatar-tooltip-pending">Not yet affirmed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Your Choices Reveal Section */}
          <div className="summary__reveal">
            <h3 className="summary__reveal-title">What Your Choices Reveal About You</h3>
            
            <div className="summary__reveal-image">
              <img 
                src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80" 
                alt="Two people embracing warmly" 
                className="summary__reveal-photo"
              />
            </div>

            <div className="summary__reveal-analysis">
              <p className="summary__reveal-paragraph">
                Your choices reveal a pattern of informed conditional thinking. You're not taking an absolute position
                —you want nuance based on actual situations. But you're aware providers might undervalue your life,
                which adds uncertainty to trusting their guidance.
              </p>
              <p className="summary__reveal-paragraph">
                Your desire for comprehensive education suggests you're trying to protect your autonomy through
                knowledge—if you understand interventions deeply, you can evaluate whether you're receiving
                biased counsel. This is a protective stance: conditional flexibility backed by informed skepticism.
              </p>
            </div>

            <button
              type="button"
              className="summary__reveal-link"
              onClick={() => setShowFullSummary(true)}
            >
              View Full Report
            </button>
          </div>

          {/* Team Visibility Section */}
          <div className="summary__team-visibility">
            <div className="summary__team-visibility-header">
              <h3 className="summary__team-visibility-title">Care Team Recordings</h3>
              <span className="summary__team-visibility-count">{recordingsCount} recording{recordingsCount !== 1 ? 's' : ''}</span>
            </div>
            <p className="summary__team-visibility-description">
              See what your care team members have shared about their commitment to supporting your decisions.
            </p>

            <div className="summary__team-visibility-preview">
              {/* Current user's recording slot */}
              <div
                className="summary__recording-thumbnail summary__recording-thumbnail--user"
                onClick={onNavigateToTeamVisibility}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNavigateToTeamVisibility?.()}
              >
                <img
                  src={userAvatar}
                  alt={`${userName}'s recording`}
                  className="summary__recording-image summary__recording-image--user summary__recording-image--circular"
                />
                <div className="summary__recording-add">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="rgba(255, 255, 255, 0.9)" />
                    <path d="M10 6V14M6 10H14" stroke="#B432A3" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="summary__recording-name">You</span>
              </div>
              {recordingsWithVideo.slice(0, 2).map((member) => (
                <div
                  key={member.id}
                  className="summary__recording-thumbnail"
                  onClick={onViewTeamRecordings}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onViewTeamRecordings?.()}
                >
                  <img
                    src={member.avatar}
                    alt={`${member.name}'s recording`}
                    className="summary__recording-image summary__recording-image--circular"
                  />
                  <div className="summary__recording-play">
                    <PlayIcon />
                  </div>
                  <span className="summary__recording-name">{member.name}</span>
                </div>
              ))}
            </div>

            {onViewTeamRecordings && (
              <button
                type="button"
                className="summary__team-visibility-link"
                onClick={onViewTeamRecordings}
              >
                See All Recordings →
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="summary__actions">
            <PrimaryButton onClick={onChangeAnswer} fullWidth>
              Change your Answers
              <span className="summary__arrow">→</span>
            </PrimaryButton>
            <SecondaryButton onClick={onBackHome || onBack} fullWidth>
              Back Home
              <span className="summary__back-arrow">←</span>
            </SecondaryButton>
          </div>
        </div>

        {/* First Visit Recording Modal */}
        <Modal
          isOpen={showRecordingModal}
          onClose={() => setShowRecordingModal(false)}
          showCloseButton={false}
          size="small"
        >
          <div className="summary__recording-modal">
            <div className="summary__recording-modal-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="url(#modalIconGradient)" fillOpacity="0.1"/>
                <path d="M24 16V32M16 24H32" stroke="url(#modalIconGradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="modalIconGradient" x1="16" y1="24" x2="32" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5C40FB"/>
                    <stop offset="1" stopColor="#F23B8B"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3 className="summary__recording-modal-title">Let's Record Your Answer</h3>
            <p className="summary__recording-modal-description">
              Share your thoughts with your care team by recording a personal message about your decisions.
            </p>
            <div className="summary__recording-modal-actions">
              <PrimaryButton
                onClick={() => {
                  setShowRecordingModal(false);
                  if (onNavigateToTeamVisibility) {
                    onNavigateToTeamVisibility();
                  }
                }}
                fullWidth
              >
                Continue
              </PrimaryButton>
              <SecondaryButton
                onClick={() => setShowRecordingModal(false)}
                fullWidth
              >
                Skip for Now
              </SecondaryButton>
            </div>
          </div>
        </Modal>
      </ContentPanel>
    </TwoColumnLayout>
  );
};

export default Summary;
