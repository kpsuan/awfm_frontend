import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth, useNotifications } from '../context';
import { teamsService, recordingsService } from '../services';
import { ContentHeader } from '../components/common/Navigation';
import { AddMemberModal } from '../components/common/Modal';
import {
  VideoIcon, MicIcon, TextIcon, HeartIcon, CommentIcon,
  CheckCircleIcon, SettingsIcon, UserPlusIcon, LogOutIcon,
  getRecordingTypeIcon
} from '../components/common/Icons';
import {
  getInitials, getColorFromString, formatRelativeDate, formatDuration
} from '../utils/formatters';
import './CareTeamPage.css';

// Recording Post Component
const RecordingPost = ({ recording, currentUser, onLike, onAffirm }) => {
  const [showComments, setShowComments] = useState(false);

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
            <span className="recording-post__type">{getRecordingTypeIcon(recording.recording_type)}</span>
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
