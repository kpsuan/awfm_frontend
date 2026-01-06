import React from 'react';
import { VideoIcon, MicIcon } from '../../components/common/Icons';
import { formatRelativeDate } from '../../utils/formatters';

const MediaTab = ({ recordings, userLookup }) => {
  const videoRecordings = recordings.filter(r => r.recording_type === 'video');
  const audioRecordings = recordings.filter(r => r.recording_type === 'audio');

  const getUserName = (recording) => {
    return recording.user_name || userLookup?.[recording.user]?.display_name || recording.user_email || 'Unknown';
  };

  return (
    <div className="media-tab">
      <h2>Media</h2>

      {videoRecordings.length > 0 && (
        <div className="media-tab__section">
          <h3><VideoIcon size={18} /> Videos ({videoRecordings.length})</h3>
          <div className="media-tab__grid">
            {videoRecordings.map(recording => (
              <div key={recording.id} className="media-tab__item">
                <video
                  src={recording.media_url}
                  poster={recording.thumbnail_url}
                  controls
                />
                <div className="media-tab__item-info">
                  <span>{getUserName(recording)}</span>
                  <span>{formatRelativeDate(recording.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {audioRecordings.length > 0 && (
        <div className="media-tab__section">
          <h3><MicIcon size={18} /> Audio ({audioRecordings.length})</h3>
          <div className="media-tab__list">
            {audioRecordings.map(recording => (
              <div key={recording.id} className="media-tab__audio-item">
                <div className="media-tab__audio-info">
                  <MicIcon size={20} />
                  <div>
                    <span className="media-tab__audio-author">{getUserName(recording)}</span>
                    <span className="media-tab__audio-time">{formatRelativeDate(recording.created_at)}</span>
                  </div>
                </div>
                <audio src={recording.media_url} controls />
              </div>
            ))}
          </div>
        </div>
      )}

      {videoRecordings.length === 0 && audioRecordings.length === 0 && (
        <div className="media-tab__empty">
          <p>No media has been shared yet.</p>
        </div>
      )}
    </div>
  );
};

export default MediaTab;
