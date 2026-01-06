import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { VideoIcon, MicIcon, TextIcon, LockIcon, EyeIcon } from '../../components/common/Icons';
import { getInitials, getColorFromString, formatRelativeDate } from '../../utils/formatters';
import RecordingPost from './RecordingPost';

const PostsTab = ({
  user,
  team,
  teamId,
  recordings,
  userLookup,
  teamActivities,
  onLike,
  onAffirm
}) => {
  const navigate = useNavigate();

  return (
    <>
      <main className="team-feed">
        {/* Create Post Section */}
        <div className="create-post">
          <div className="create-post__input-row">
            <div
              className="create-post__avatar"
              style={{ backgroundColor: getColorFromString(user?.display_name) }}
            >
              {(user?.profile_photo_url || user?.photo_url || user?.avatar) ? (
                <img src={user.profile_photo_url || user.photo_url || user.avatar} alt={user.display_name} />
              ) : (
                getInitials(user?.display_name)
              )}
            </div>
            <button
              className="create-post__input"
              onClick={() => navigate('/questionnaire/Q10A')}
            >
              Share your thoughts with the team...
            </button>
          </div>
          <div className="create-post__divider" />
          <div className="create-post__options">
            <button
              className="create-post__option"
              onClick={() => navigate('/record-video', { state: { teamId } })}
            >
              <VideoIcon size={20} color="#b432a3" />
              <span>Video Recording</span>
            </button>
            <button
              className="create-post__option"
              onClick={() => navigate('/questionnaire/Q10A')}
            >
              <TextIcon size={20} color="#b432a3" />
              <span>Text</span>
            </button>
            <button
              className="create-post__option"
              onClick={() => navigate('/record-audio', { state: { teamId } })}
            >
              <MicIcon size={20} color="#b432a3" />
              <span>Audio</span>
            </button>
          </div>
        </div>

        {/* Recordings Feed */}
        {recordings.length === 0 ? (
          <div className="team-feed__empty">
            <h3>No recordings yet</h3>
            <p>Be the first to share your thoughts with the team!</p>
            <Button
              variant="primary"
              onClick={() => navigate('/questionnaire/Q10A')}
            >
              Start a questionnaire
            </Button>
          </div>
        ) : (
          <div className="team-feed__posts">
            {recordings.map(recording => (
              <RecordingPost
                key={recording.id}
                recording={recording}
                currentUser={user}
                userLookup={userLookup}
                onLike={onLike}
                onAffirm={onAffirm}
              />
            ))}
          </div>
        )}
      </main>

      {/* About Sidebar */}
      <aside className="team-sidebar">
        <div className="about-card">
          <h3 className="about-card__title">About</h3>
          {team?.description && (
            <p className="about-card__description">{team.description}</p>
          )}
          <div className="about-card__items">
            <div className="about-card__item">
              <LockIcon size={18} />
              <div className="about-card__item-content">
                <span className="about-card__item-title">Private</span>
                <span className="about-card__item-desc">Only members can see who's in the group and what they post.</span>
              </div>
            </div>
            <div className="about-card__item">
              <EyeIcon size={18} />
              <div className="about-card__item-content">
                <span className="about-card__item-title">Visible</span>
                <span className="about-card__item-desc">Anyone can find this group.</span>
              </div>
            </div>
          </div>
          <button className="about-card__link">
            Learn more about this group
          </button>
        </div>

        {/* Activity Card */}
        {teamActivities.length > 0 && (
          <div className="activity-card">
            <h3 className="activity-card__title">Recent Activity</h3>
            <ul className="activity-card__list">
              {teamActivities.slice(0, 5).map((activity, idx) => (
                <li key={idx} className="activity-card__item">
                  <span className="activity-card__text">
                    {activity.type === 'question_completed' && `${activity.user_name} completed a question`}
                    {activity.type === 'chat_message' && `New message in team`}
                  </span>
                  <span className="activity-card__time">
                    {formatRelativeDate(activity.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </>
  );
};

export default PostsTab;
