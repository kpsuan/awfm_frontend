import React, { useState } from 'react';
import {
  MicIcon, HeartIcon, CommentIcon, CheckCircleIcon,
  getRecordingTypeIcon
} from '../../components/common/Icons';
import {
  getInitials, getColorFromString, formatRelativeDate, formatDuration
} from '../../utils/formatters';

const RecordingPost = ({ recording, currentUser, userLookup, onLike, onAffirm }) => {
  const [showComments, setShowComments] = useState(false);

  const recordingUserId = recording.user;
  const lookupUser = userLookup?.[recordingUserId];

  const userName = recording.user_name || lookupUser?.display_name || recording.user_email || 'Unknown';
  const userPhoto = recording.user_avatar || lookupUser?.profile_photo_url || lookupUser?.photo_url;
  const userId = recordingUserId;
  const userRole = lookupUser?.role;

  const isOwner = userId === currentUser?.id;
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
        <div className="recording-post__avatar" style={{ backgroundColor: getColorFromString(userName) }}>
          {userPhoto ? (
            <img src={userPhoto} alt={userName} />
          ) : (
            getInitials(userName)
          )}
        </div>
        <div className="recording-post__meta">
          <div className="recording-post__author">
            {userName}
            {userRole === 'leader' && <span className="recording-post__badge">Leader</span>}
            {userRole === 'witness' && <span className="recording-post__badge recording-post__badge--witness">Witness</span>}
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

export default RecordingPost;
