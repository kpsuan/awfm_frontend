import React, { useState, useEffect, useCallback } from 'react';
import './MainScreen.css';

// Layout components
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton } from '../../common/Button';
import { CarouselIndicator } from '../../common/Indicator';
import { AddMemberModal } from '../../common/Modal';

// Services
import { teamsService } from '../../../services/teams';

// Slide components
import { WhyMattersSlide, HowItWorksSlide, CareTeamSlide } from './components';

// Hooks and config
import { useSwipeGesture, useScrollCollapse } from './hooks';
import { generateSlides, SLIDE_TYPES } from './config/slideConfig';

// Assets
import image1 from '../../../styles/image1.png';
import logo from '../../../styles/logo.png';

// Swipe icon for onboarding tooltip
const SwipeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 16L3 12M3 12L7 8M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * MainScreen Component
 * Landing screen for a questionnaire showing question info, progress, and team members
 */
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
  onGoToLayer,
  user = null,
  userName = "Norman",
  userAvatar = "https://i.pravatar.cc/82?img=12"
}) => {
  // State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [createdTeam, setCreatedTeam] = useState(null);

  // Teams carousel state
  const [userTeams, setUserTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);

  // Scroll collapse for mobile header
  const { isCollapsed, scrollContainerRef } = useScrollCollapse({ threshold: 30 });

  // Fetch user's teams on mount
  const fetchUserTeams = useCallback(async () => {
    try {
      console.log('MainScreen: Fetching teams...');
      const response = await teamsService.getTeams();
      console.log('MainScreen: Raw response:', response);

      // Handle different response formats
      let teams = response;
      if (response?.data) teams = response.data;
      if (response?.results) teams = response.results;
      teams = Array.isArray(teams) ? teams : [];

      console.log('MainScreen: Parsed teams:', teams);
      setUserTeams(teams);

      // If user has no teams, stay at index 0 (will show "create team")
      // Otherwise default to first team
      if (teams.length === 0) {
        setCurrentTeamIndex(0);
      }
    } catch (error) {
      console.error('MainScreen: Error fetching teams:', error);
      setUserTeams([]);
    }
  }, []);

  useEffect(() => {
    console.log('MainScreen: user prop:', user);
    if (user) {
      fetchUserTeams();
    } else {
      console.log('MainScreen: No user, skipping team fetch');
    }
  }, [user, fetchUserTeams]);

  // Get current selected team
  const selectedTeam = userTeams[currentTeamIndex] || null;
  const isOnCreateNewTeamSlide = currentTeamIndex === userTeams.length;

  // Handle team creation
  const handleCreateTeam = useCallback(async (teamData) => {
    const response = await teamsService.createTeam(
      teamData.name,
      teamData.description || '',
      teamData.team_level || null
    );
    const result = response.data || response;
    setCreatedTeam(result.team);
    // Refresh teams list and select the new team
    await fetchUserTeams();
    return result;
  }, [fetchUserTeams]);

  // Handle inviting a member
  const handleInviteMember = useCallback(async (inviteData) => {
    // Use selected team or newly created team
    const teamId = selectedTeam?.id || createdTeam?.id;
    if (!teamId) {
      throw new Error('No team selected');
    }
    const response = await teamsService.inviteMember(teamId, inviteData.email, inviteData.role);
    return response.data || response;
  }, [selectedTeam, createdTeam]);

  // Handle opening modal for existing team (edit mode)
  const handleOpenAddMemberModal = useCallback(() => {
    setIsCreatingNewTeam(false);
    setIsAddMemberModalOpen(true);
  }, []);

  // Handle opening modal for creating new team
  const handleCreateNewTeam = useCallback(() => {
    setIsCreatingNewTeam(true);
    setCreatedTeam(null);
    setIsAddMemberModalOpen(true);
  }, []);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setIsAddMemberModalOpen(false);
    setIsCreatingNewTeam(false);
    // Refresh teams in case changes were made
    fetchUserTeams();
  }, [fetchUserTeams]);

  // Generate slides from config
  const slides = generateSlides({ progressPercentage, completedCheckpoints });

  // Onboarding dismissal
  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem('awfm_main_screen_onboarding', 'true');
  }, []);

  // Swipe gesture handling
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      setActiveSlide(prev => Math.min(prev + 1, slides.length - 1));
      dismissOnboarding();
    },
    onSwipeRight: () => {
      setActiveSlide(prev => Math.max(prev - 1, 0));
      dismissOnboarding();
    }
  });

  // Onboarding tooltip logic
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('awfm_main_screen_onboarding');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Question data with defaults
  const { title, subtitle, sectionLabel } = question || {
    title: "How important is staying alive even if you have substantial physical limitations?",
    subtitle: "Question 10 A",
    sectionLabel: "Advance Care Planning"
  };

  // Button text based on progress
  const getButtonText = () => {
    if (isComplete) return "View Summary";
    if (hasStarted) return "Continue";
    return "Get Started";
  };

  // Render active slide content
  const renderSlideContent = () => {
    const slide = slides[activeSlide];

    switch (slide.id) {
      case SLIDE_TYPES.WHY_MATTERS:
        return <WhyMattersSlide title={slide.title} content={slide.content} />;

      case SLIDE_TYPES.HOW_IT_WORKS:
        return (
          <HowItWorksSlide
            title={slide.title}
            layers={slide.layers}
            headerRight={slide.headerRight}
            content={slide.content}
            onGoToLayer={onGoToLayer}
          />
        );

      case SLIDE_TYPES.CARE_TEAM:
        return (
          <CareTeamSlide
            title={slide.title}
            content={slide.content}
            user={user}
            userAvatar={userAvatar}
            team={team}
            teams={userTeams}
            currentTeamIndex={currentTeamIndex}
            onTeamChange={setCurrentTeamIndex}
            onViewTeamRecordings={onViewTeamRecordings}
            onOpenAddMemberModal={handleOpenAddMemberModal}
            onCreateNewTeam={handleCreateNewTeam}
          />
        );

      default:
        return null;
    }
  };

  return (
    <TwoColumnLayout>
      {/* Left Panel - Question Info */}
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

      {/* Right Panel - Content */}
      <ContentPanel>
        <div className="main-screen__right" ref={scrollContainerRef}>
          {/* Collapsible Header (image + question info) */}
          <div className={`main-screen__header ${isCollapsed ? 'main-screen__header--collapsed' : ''}`}>
            {/* Hero Image */}
            <div className="main-screen__image-container">
              <img src={image1} alt="Elderly person" className="main-screen__image" />
            </div>

            {/* Tablet Question Info */}
            <div className="main-screen__tablet-question-info">
              <span className="main-screen__tablet-section-label">{sectionLabel || "Advance Care Planning"}</span>
              <span className="main-screen__tablet-question-number">{subtitle || "Question 10 A"}</span>
              <h1 className="main-screen__tablet-question-title">{title}</h1>
            </div>
          </div>

          {/* Swipeable Slide Content */}
          <div className="main-screen__info-section" {...swipeHandlers}>
            {renderSlideContent()}
          </div>

          {/* Carousel Indicator */}
          <div className="main-screen__carousel-indicator">
            <CarouselIndicator
              total={slides.length}
              active={activeSlide}
              onClick={setActiveSlide}
            />
            {/* Onboarding Tooltip */}
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

          {/* Action Button */}
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
        onClose={handleModalClose}
        onCreateTeam={handleCreateTeam}
        onInviteMember={handleInviteMember}
        teamId={selectedTeam?.id || createdTeam?.id}
        existingTeam={isCreatingNewTeam ? null : selectedTeam}
        onAddMember={(memberData) => {
          if (onAddTeamMember) {
            onAddTeamMember(memberData);
          }
        }}
        userName={user?.display_name || user?.first_name || userName}
        userAvatar={user?.profile_photo_url || userAvatar}
      />
    </TwoColumnLayout>
  );
};

export default MainScreen;
