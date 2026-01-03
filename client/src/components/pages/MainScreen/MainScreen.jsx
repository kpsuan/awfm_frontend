import React, { useState, useEffect, useRef } from 'react';
import './MainScreen.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton } from '../../common/Button';
import { CarouselIndicator } from '../../common/Indicator';
import { AvatarRow } from '../../common/Avatar';
import { AddMemberModal } from '../../common/Modal';
import image1 from '../../../styles/image1.png';
import logo from '../../../styles/logo.png';

// Plus icon for add member button
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Swipe icon for onboarding tooltip
const SwipeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 16L3 12M3 12L7 8M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MainScreen = ({
  question,
  team = [],
  progress = { current: 1, total: 4 },
  progressPercentage = 0,
  hasStarted = false,
  isComplete = false,
  completedCheckpoints = { q1: false, q2: false, q3: false },
  onContinue,
  onBack,
  onViewTeamRecordings,
  onAddTeamMember,
  onGoToLayer, // callback to navigate to specific layer (1, 2, or 3)
  user = null,
  userName = "Norman",
  userAvatar = "https://i.pravatar.cc/82?img=12",
  sentInvites = []
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Use refs for touch coordinates to avoid stale closure issues
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  // Minimum swipe distance to trigger slide change
  const minSwipeDistance = 50;

  // Check if user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('awfm_main_screen_onboarding');
    if (!hasSeenOnboarding) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('awfm_main_screen_onboarding', 'true');
  };

  const { title, subtitle, sectionLabel } = question || {
    title: "How important is staying alive even if you have substantial physical limitations?",
    subtitle: "Question 10 A",
    sectionLabel: "Advance Care Planning"
  };

  // Determine button text based on progress state
  const getButtonText = () => {
    if (isComplete) return "View Summary";
    if (hasStarted) return "Continue";
    return "Get Started";
  };

  const slides = [
    {
      id: 0,
      title: "Why this Matters:",
      content: [
        {
          text: 'Unlike prescriptive approaches, asking "What do you want your loved ones to know?" acknowledges that patients are the experts on their own lives and relationships.'
        },
        {
          text: 'This open-ended format respects individual differences in privacy preferences, cultural values, and family dynamics while still facilitating meaningful communication.'
        }
      ]
    },
    {
      id: 1,
      title: "How it Works",
      headerRight: `${progressPercentage}% PROGRESS`,
      layers: "3 Layers",
      content: [
        {
          checkpoint: "Layer 1: Your Position",
          description: "Where you stand what's your initial choice",
          completed: completedCheckpoints.q1,
          layerNumber: 1
        },
        {
          checkpoint: "Layer 2: Your Challenges",
          description: "What challenges might change your position",
          completed: completedCheckpoints.q2,
          layerNumber: 2
        },
        {
          checkpoint: "Layer 3: What Would Change Your Mind",
          description: "What would make you change your mind",
          completed: completedCheckpoints.q3,
          layerNumber: 3
        }
      ]
    },
    {
      id: 2,
      title: "Your Care Team",
      content: [
        {
          text: "Help each other make plans that prioritize dignity and wellbeing."
        }
      ],
      showTeam: true
    }
  ];

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  // Touch handlers for swipe
  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveSlide(prev => Math.min(prev + 1, slides.length - 1));
      dismissOnboarding();
    }
    if (isRightSwipe) {
      setActiveSlide(prev => Math.max(prev - 1, 0));
      dismissOnboarding();
    }

    // Reset refs
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  const renderSlideContent = (slide) => {
    if (slide.id === 0) {
      return (
        <div className="main-screen__slide-content">
          <h3 className="main-screen__slide-title">{slide.title}</h3>
          {slide.content.map((item, idx) => (
            <p key={idx} className="main-screen__slide-text">{item.text}</p>
          ))}
        </div>
      );
    }
    
    if (slide.id === 1) {
      return (
        <div className="main-screen__slide-content">
          <h3 className="main-screen__slide-title">{slide.title}</h3>
          <div className="main-screen__slide-header">
            <span className="main-screen__layers-label">{slide.layers}</span>
            <span className="main-screen__progress-label">{slide.headerRight}</span>
          </div>
          <div className="main-screen__checkpoints">
            {slide.content.map((item, idx) => (
              <div key={idx} className={`main-screen__checkpoint-item ${item.completed ? 'main-screen__checkpoint-item--completed' : ''}`}>
                <div className="main-screen__checkpoint-header">
                  <p className={`main-screen__checkpoint-link ${item.completed ? 'main-screen__checkpoint-link--completed' : ''}`}>
                    {item.checkpoint}
                  </p>
                  {item.completed && (
                    <span className="main-screen__checkpoint-check">✓</span>
                  )}
                  {onGoToLayer && (
                    <button
                      className="main-screen__go-to-layer-btn"
                      onClick={() => onGoToLayer(item.layerNumber)}
                      title={`Go to Layer ${item.layerNumber}`}
                    >
                      Go →
                    </button>
                  )}
                </div>
                <p className="main-screen__checkpoint-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (slide.id === 2) {
      const handleAvatarClick = (member) => {
        if (onViewTeamRecordings) {
          onViewTeamRecordings(member.id);
        }
      };

      return (
        <div className="main-screen__slide-content">
          <h3 className="main-screen__slide-title">{slide.title}</h3>
          {slide.content.map((item, idx) => (
            <p key={idx} className="main-screen__slide-text">{item.text}</p>
          ))}
          <div className="main-screen__team-avatars">
            {/* Current User (You) - only show if logged in */}
            {user && (
              <div
                className="main-screen__team-avatar-wrapper main-screen__team-avatar-wrapper--current-user"
                onClick={() => handleAvatarClick({ id: 'current-user', name: user.display_name || user.email })}
                title="You"
              >
                <img
                  src={user.profile_photo_url || userAvatar}
                  alt={user.display_name || user.email}
                  className="main-screen__team-avatar-img"
                />
                <span className="main-screen__team-avatar-name">You</span>
              </div>
            )}
            {/* Other Team Members */}
            {team.map((member) => (
              <div
                key={member.id}
                className={`main-screen__team-avatar-wrapper ${member.hasRecording ? 'main-screen__team-avatar-wrapper--has-recording' : ''}`}
                onClick={() => handleAvatarClick(member)}
                title={member.hasRecording ? `View ${member.name}'s recording` : member.name}
              >
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="main-screen__team-avatar-img"
                />
                {member.hasRecording && (
                  <div className="main-screen__team-avatar-play">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="rgba(255, 255, 255, 0.95)" />
                      <path d="M8 6L14 10L8 14V6Z" fill="#B432A3" />
                    </svg>
                  </div>
                )}
                <span className="main-screen__team-avatar-name">{member.name}</span>
              </div>
            ))}
            {/* Add Member Button */}
            <div
              className="main-screen__team-avatar-wrapper main-screen__add-member-btn"
              onClick={() => setIsAddMemberModalOpen(true)}
              title="Add team member"
            >
              <div className="main-screen__add-member-icon">
                <PlusIcon />
              </div>
              <span className="main-screen__team-avatar-name">Add</span>
            </div>
          </div>
          {onViewTeamRecordings && (
            <button
              type="button"
              className="main-screen__view-recordings-link"
              onClick={() => onViewTeamRecordings()}
            >
              View All Recordings →
            </button>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <TwoColumnLayout>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack} hideProgress={true}>
        <div className="main-screen__left">
          <div className="main-screen__icon">
            <div className="main-screen__icon-outer">
              <div className="main-screen__icon-inner">
                <img src={logo} alt="AWFM Logo" className="main-screen__logo-img" />
              </div>
            </div>
          </div>
          
          <div className="main-screen__question-info">
            <span className="main-screen__section-label">{sectionLabel || "Advance Care Planning"}</span>
            <span className="main-screen__question-number">{subtitle || "Question 10 A"}</span>
            <h1 className="main-screen__question-title">{title}</h1>
          </div>
        </div>
      </QuestionPanel>

      <ContentPanel>
        <div className="main-screen__right">
          <div className="main-screen__image-container">
            <img src={image1} alt="Elderly person" className="main-screen__image" />
          </div>
          
          {/* Question info for tablet view */}
          <div className="main-screen__tablet-question-info">
            <span className="main-screen__tablet-section-label">{sectionLabel || "Advance Care Planning"}</span>
            <span className="main-screen__tablet-question-number">{subtitle || "Question 10 A"}</span>
            <h1 className="main-screen__tablet-question-title">{title}</h1>
          </div>
          
          <div
            className="main-screen__info-section"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {renderSlideContent(slides[activeSlide])}
          </div>
          
          <div className="main-screen__carousel-indicator">
            <CarouselIndicator
              total={slides.length}
              active={activeSlide}
              onClick={handleSlideChange}
            />
            {/* Onboarding tooltip */}
            {showOnboarding && (
              <div className="main-screen__onboarding-tooltip">
                <div className="main-screen__onboarding-content">
                  <div className="main-screen__onboarding-icon">
                    <SwipeIcon />
                  </div>
                  <div className="main-screen__onboarding-text">
                    <p className="main-screen__onboarding-title">Swipe or tap to explore</p>
                    <p className="main-screen__onboarding-desc">Navigate between sections using the dots below</p>
                  </div>
                  <button
                    className="main-screen__onboarding-dismiss"
                    onClick={dismissOnboarding}
                    aria-label="Dismiss"
                  >
                    Got it
                  </button>
                </div>
                <div className="main-screen__onboarding-arrow" />
              </div>
            )}
          </div>
          
          <div className="main-screen__action">
            <PrimaryButton onClick={onContinue} fullWidth>
              {getButtonText()}
              <span className="main-screen__arrow">→</span>
            </PrimaryButton>
          </div>
        </div>
      </ContentPanel>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAddMember={(memberData) => {
          if (onAddTeamMember) {
            onAddTeamMember(memberData);
          }
          console.log('Adding team member:', memberData);
        }}
        userName={userName}
        userAvatar={userAvatar}
        sentInvites={sentInvites}
      />
    </TwoColumnLayout>
  );
};

export default MainScreen;
