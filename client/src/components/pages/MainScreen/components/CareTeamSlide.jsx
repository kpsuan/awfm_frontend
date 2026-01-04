import React from 'react';

// Plus icon for add member button
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Chevron icons for carousel navigation
const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Slide 2: "Your Care Team" - Team members and invites with carousel
 */
const CareTeamSlide = ({
  title,
  content,
  user,
  userAvatar,
  team,
  teams = [], // All user's teams
  currentTeamIndex = 0,
  onTeamChange,
  onViewTeamRecordings,
  onOpenAddMemberModal,
  onCreateNewTeam
}) => {
  const handleAvatarClick = (member) => {
    if (onViewTeamRecordings) {
      onViewTeamRecordings(member.id);
    }
  };

  // Current team from the teams array
  const currentTeam = teams[currentTeamIndex];
  const isLastSlide = currentTeamIndex === teams.length; // "Add new team" slide
  const totalSlides = teams.length + 1; // All teams + "Add new team"

  const handlePrevTeam = () => {
    if (currentTeamIndex > 0 && onTeamChange) {
      onTeamChange(currentTeamIndex - 1);
    }
  };

  const handleNextTeam = () => {
    if (currentTeamIndex < totalSlides - 1 && onTeamChange) {
      onTeamChange(currentTeamIndex + 1);
    }
  };

  // Get team members for display (excluding current user who is shown separately)
  const teamMembers = currentTeam?.members?.filter(m => m.user_id !== user?.id) || team || [];

  return (
    <div className="main-screen__slide-content">
      <h3 className="main-screen__slide-title">{title}</h3>
      {content.map((item, idx) => (
        <p key={idx} className="main-screen__slide-text">{item.text}</p>
      ))}

      {/* Team Carousel Navigation - always show */}
      <div className="main-screen__team-carousel">
          <button
            className="main-screen__team-nav main-screen__team-nav--prev"
            onClick={handlePrevTeam}
            disabled={currentTeamIndex === 0}
            aria-label="Previous team"
          >
            <ChevronLeftIcon />
          </button>

          <div className="main-screen__team-name-container">
            {isLastSlide ? (
              <span className="main-screen__team-name main-screen__team-name--new">
                + Create New Team
              </span>
            ) : currentTeam ? (
              <>
                {currentTeam.team_level && (
                  <span className="main-screen__team-level">Level {currentTeam.team_level}</span>
                )}
                <span className="main-screen__team-name">{currentTeam.name}</span>
              </>
            ) : (
              <span className="main-screen__team-name main-screen__team-name--empty">
                No team yet
              </span>
            )}
            {/* Carousel dots */}
            <div className="main-screen__team-dots">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  className={`main-screen__team-dot ${idx === currentTeamIndex ? 'main-screen__team-dot--active' : ''}`}
                  onClick={() => onTeamChange && onTeamChange(idx)}
                  aria-label={idx === teams.length ? 'Add new team' : `Team ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <button
            className="main-screen__team-nav main-screen__team-nav--next"
            onClick={handleNextTeam}
            disabled={currentTeamIndex === totalSlides - 1}
            aria-label="Next team"
          >
            <ChevronRightIcon />
          </button>
        </div>

      {/* Team Members or Create New Team */}
      {isLastSlide ? (
        // "Create New Team" slide
        <div className="main-screen__create-team-slide">
          <div
            className="main-screen__create-team-btn"
            onClick={onCreateNewTeam}
            title="Create a new care team"
          >
            <div className="main-screen__create-team-icon">
              <PlusIcon />
            </div>
            <span className="main-screen__create-team-text">Create Care Team</span>
          </div>
        </div>
      ) : (
        // Team members display
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
          {teamMembers.map((member) => {
            const isPending = member.status === 'pending';
            const displayName = member.display_name || member.name || member.email?.split('@')[0];

            return (
              <div
                key={member.id}
                className={`main-screen__team-avatar-wrapper ${member.hasRecording ? 'main-screen__team-avatar-wrapper--has-recording' : ''} ${isPending ? 'main-screen__team-avatar-wrapper--pending' : ''}`}
                onClick={() => !isPending && handleAvatarClick(member)}
                title={isPending ? `${displayName} (Invitation pending)` : (member.hasRecording ? `View ${displayName}'s recording` : displayName)}
              >
                <img
                  src={member.profile_photo_url || member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.display_name || member.email)}&background=5C40FB&color=fff`}
                  alt={displayName}
                  className="main-screen__team-avatar-img"
                />
                {isPending && (
                  <div className="main-screen__team-avatar-pending-badge">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeDasharray="2 2"/>
                    </svg>
                  </div>
                )}
                {member.hasRecording && !isPending && (
                  <div className="main-screen__team-avatar-play">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="10" fill="rgba(255, 255, 255, 0.95)" />
                      <path d="M8 6L14 10L8 14V6Z" fill="#B432A3" />
                    </svg>
                  </div>
                )}
                <span className="main-screen__team-avatar-name">
                  {displayName}
                  {isPending && <span className="main-screen__pending-label"> (Pending)</span>}
                </span>
              </div>
            );
          })}
          {/* Add Member Button */}
          <div
            className="main-screen__team-avatar-wrapper main-screen__add-member-btn"
            onClick={onOpenAddMemberModal}
            title="Add team member"
          >
            <div className="main-screen__add-member-icon">
              <PlusIcon />
            </div>
            <span className="main-screen__team-avatar-name">Add</span>
          </div>
        </div>
      )}

      {onViewTeamRecordings && !isLastSlide && (
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
};

export default CareTeamSlide;
