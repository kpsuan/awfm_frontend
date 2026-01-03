import React from 'react';

// Plus icon for add member button
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Slide 2: "Your Care Team" - Team members and invites
 */
const CareTeamSlide = ({
  title,
  content,
  user,
  userAvatar,
  team,
  onViewTeamRecordings,
  onOpenAddMemberModal
}) => {
  const handleAvatarClick = (member) => {
    if (onViewTeamRecordings) {
      onViewTeamRecordings(member.id);
    }
  };

  return (
    <div className="main-screen__slide-content">
      <h3 className="main-screen__slide-title">{title}</h3>
      {content.map((item, idx) => (
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
          onClick={onOpenAddMemberModal}
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
};

export default CareTeamSlide;
