import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useNotifications } from '../context';
import { teamsService, recordingsService } from '../services';
import { ContentHeader } from '../components/common/Navigation';
import { AddMemberModal } from '../components/common/Modal';
import './CareTeamPage.css';

// Icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const UserPlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const TextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

// Helper functions
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getColorFromString = (str) => {
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatRelativeDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Recording Post Component
const RecordingPost = ({ recording, currentUser, onLike, onAffirm }) => {
  const [showComments, setShowComments] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isOwner = recording.user?.id === currentUser?.id;
  const hasLiked = recording.user_has_liked;
  const hasAffirmed = recording.user_has_affirmed;

  const renderMedia = () => {
    if (recording.recording_type === 'text') {
      return (
        <div className="recording-post__text-content">
          {recording.text_content}
        </div>
      );
    }

    if (recording.recording_type === 'video') {
      return (
        <div className="recording-post__video-container">
          <video
            src={recording.media_url}
            poster={recording.thumbnail_url}
            className="recording-post__video"
            controls
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      );
    }

    if (recording.recording_type === 'audio') {
      return (
        <div className="recording-post__audio-container">
          <div className="recording-post__audio-visual">
            <MicIcon />
            <span>Audio Recording</span>
            {recording.duration && <span>{formatDuration(recording.duration)}</span>}
          </div>
          <audio src={recording.media_url} controls className="recording-post__audio" />
        </div>
      );
    }

    return null;
  };

  const getRecordingTypeIcon = () => {
    switch (recording.recording_type) {
      case 'video': return <VideoIcon />;
      case 'audio': return <MicIcon />;
      case 'text': return <TextIcon />;
      default: return null;
    }
  };

  return (
    <article className="recording-post">
      <div className="recording-post__header">
        <div className="recording-post__avatar" style={{ backgroundColor: getColorFromString(recording.user?.display_name) }}>
          {recording.user?.photo_url ? (
            <img src={recording.user.photo_url} alt={recording.user.display_name} />
          ) : (
            getInitials(recording.user?.display_name)
          )}
        </div>
        <div className="recording-post__meta">
          <div className="recording-post__author">
            {recording.user?.display_name}
            {recording.user?.role === 'leader' && <span className="recording-post__badge">Leader</span>}
            {recording.user?.role === 'witness' && <span className="recording-post__badge recording-post__badge--witness">Witness</span>}
          </div>
          <div className="recording-post__info">
            <span className="recording-post__type">{getRecordingTypeIcon()}</span>
            <span className="recording-post__question">Q: {recording.question?.title || recording.question_id}</span>
            <span className="recording-post__time">{formatRelativeDate(recording.created_at)}</span>
          </div>
        </div>
      </div>

      {recording.description && (
        <p className="recording-post__description">{recording.description}</p>
      )}

      <div className="recording-post__media">
        {renderMedia()}
      </div>

      <div className="recording-post__actions">
        <button
          className={`recording-post__action ${hasLiked ? 'recording-post__action--active' : ''}`}
          onClick={() => onLike(recording.id)}
        >
          <HeartIcon filled={hasLiked} />
          <span>{recording.likes_count || 0}</span>
        </button>

        <button
          className="recording-post__action"
          onClick={() => setShowComments(!showComments)}
        >
          <CommentIcon />
          <span>{recording.comments_count || 0}</span>
        </button>

        {!isOwner && (
          <button
            className={`recording-post__action recording-post__action--affirm ${hasAffirmed ? 'recording-post__action--active' : ''}`}
            onClick={() => onAffirm(recording.id)}
          >
            <CheckCircleIcon />
            <span>{hasAffirmed ? 'Affirmed' : 'Affirm'}</span>
          </button>
        )}
      </div>

      {showComments && (
        <div className="recording-post__comments">
          <p className="recording-post__comments-placeholder">Comments coming soon...</p>
        </div>
      )}
    </article>
  );
};

// Main Component
function CareTeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teamActivities } = useNotifications();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Fetch team data
  const fetchTeamData = useCallback(async () => {
    try {
      setLoading(true);
      const [teamData, recordingsData] = await Promise.all([
        teamsService.getTeam(teamId),
        recordingsService.getTeamRecordings(teamId),
      ]);

      setTeam(teamData);
      setMembers(teamData.members || []);
      setRecordings(recordingsData.data || recordingsData.results || recordingsData || []);
    } catch (err) {
      console.error('Failed to fetch team data:', err);
      setError('Failed to load team. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId, fetchTeamData]);

  const handleLike = async (recordingId) => {
    try {
      const result = await recordingsService.toggleLike(recordingId);
      setRecordings(prev =>
        prev.map(r => r.id === recordingId
          ? { ...r, user_has_liked: result.data?.liked, likes_count: result.data?.likes_count }
          : r
        )
      );
    } catch (err) {
      toast.error('Failed to like recording');
    }
  };

  const handleAffirm = async (recordingId) => {
    try {
      const result = await recordingsService.toggleAffirmation(recordingId);
      setRecordings(prev =>
        prev.map(r => r.id === recordingId
          ? { ...r, user_has_affirmed: result.data?.affirmed, affirmations_count: result.data?.affirmations_count }
          : r
        )
      );
      if (result.data?.affirmed) {
        toast.success('You affirmed this recording!');
      }
    } catch (err) {
      toast.error('Failed to affirm recording');
    }
  };

  const handleLeaveTeam = async () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await teamsService.leaveTeam(teamId);
        toast.success('You have left the team');
        navigate('/');
      } catch (err) {
        toast.error('Failed to leave team');
      }
    }
  };

  const handleInviteComplete = () => {
    setShowInviteModal(false);
    fetchTeamData();
  };

  const currentMembership = members.find(m => m.user_id === user?.id || m.user?.id === user?.id);
  const isLeader = currentMembership?.role === 'leader';

  if (loading) {
    return (
      <div className="care-team-page">
        <div className="care-team-page__loading">Loading team...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="care-team-page">
        <div className="care-team-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="care-team-page">
      <ContentHeader
        title={team?.name || 'Care Team'}
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: team?.name || 'Team' },
        ]}
      />

      <div className="care-team-page__content">
        {/* Main Feed */}
        <main className="care-team-page__feed">
          {/* Create Post CTA */}
          <div className="care-team-page__create-post">
            <button
              className="care-team-page__create-btn"
              onClick={() => navigate('/questionnaire/Q10A')}
            >
              <VideoIcon />
              <span>Share your thoughts with the team</span>
            </button>
          </div>

          {/* Recordings Feed */}
          {recordings.length === 0 ? (
            <div className="care-team-page__empty">
              <h3>No recordings yet</h3>
              <p>Be the first to share your thoughts with the team!</p>
              <button
                className="care-team-page__empty-btn"
                onClick={() => navigate('/questionnaire/Q10A')}
              >
                Start a questionnaire
              </button>
            </div>
          ) : (
            <div className="care-team-page__posts">
              {recordings.map(recording => (
                <RecordingPost
                  key={recording.id}
                  recording={recording}
                  currentUser={user}
                  onLike={handleLike}
                  onAffirm={handleAffirm}
                />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="care-team-page__sidebar">
          {/* Team Info Card */}
          <div className="care-team-page__info-card">
            <div className="care-team-page__team-header">
              {team?.avatar_url ? (
                <img src={team.avatar_url} alt={team.name} className="care-team-page__team-avatar" />
              ) : (
                <div className="care-team-page__team-avatar care-team-page__team-avatar--placeholder" style={{ backgroundColor: getColorFromString(team?.name) }}>
                  {getInitials(team?.name)}
                </div>
              )}
              <div>
                <h2 className="care-team-page__team-name">{team?.name}</h2>
                <span className="care-team-page__member-count">{members.length} members</span>
              </div>
            </div>

            {team?.description && (
              <p className="care-team-page__team-description">{team.description}</p>
            )}

            {/* Quick Actions */}
            <div className="care-team-page__quick-actions">
              <button
                className="care-team-page__quick-btn"
                onClick={() => setShowInviteModal(true)}
              >
                <UserPlusIcon />
                <span>Invite Members</span>
              </button>

              {isLeader && (
                <button
                  className="care-team-page__quick-btn"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <SettingsIcon />
                  <span>Settings</span>
                </button>
              )}

              <button
                className="care-team-page__quick-btn care-team-page__quick-btn--danger"
                onClick={handleLeaveTeam}
              >
                <LogOutIcon />
                <span>Leave Team</span>
              </button>
            </div>
          </div>

          {/* Members Card */}
          <div className="care-team-page__members-card">
            <h3 className="care-team-page__card-title">Members</h3>
            <ul className="care-team-page__members-list">
              {members.map(member => {
                const memberUser = member.user || member;
                return (
                  <li key={member.id || memberUser.id} className="care-team-page__member">
                    <div
                      className="care-team-page__member-avatar"
                      style={{ backgroundColor: getColorFromString(memberUser.display_name || memberUser.email) }}
                    >
                      {memberUser.photo_url ? (
                        <img src={memberUser.photo_url} alt={memberUser.display_name} />
                      ) : (
                        getInitials(memberUser.display_name || memberUser.email)
                      )}
                    </div>
                    <div className="care-team-page__member-info">
                      <span className="care-team-page__member-name">
                        {memberUser.display_name || memberUser.email}
                      </span>
                      <span className="care-team-page__member-role">
                        {member.role === 'leader' && 'Leader'}
                        {member.role === 'witness' && 'Witness'}
                        {member.role === 'member' && 'Member'}
                      </span>
                    </div>
                    {member.is_hcw && (
                      <span className="care-team-page__hcw-badge" title="Healthcare Worker">HCW</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Activity Card */}
          {teamActivities.length > 0 && (
            <div className="care-team-page__activity-card">
              <h3 className="care-team-page__card-title">Recent Activity</h3>
              <ul className="care-team-page__activity-list">
                {teamActivities.slice(0, 5).map((activity, idx) => (
                  <li key={idx} className="care-team-page__activity-item">
                    <span className="care-team-page__activity-text">
                      {activity.type === 'question_completed' && `${activity.user_name} completed a question`}
                      {activity.type === 'chat_message' && `New message in team`}
                    </span>
                    <span className="care-team-page__activity-time">
                      {formatRelativeDate(activity.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <AddMemberModal
          teamId={teamId}
          onClose={() => setShowInviteModal(false)}
          onComplete={handleInviteComplete}
        />
      )}
    </div>
  );
}

export default CareTeamPage;
