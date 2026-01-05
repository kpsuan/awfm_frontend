import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context';
import { recordingsService, teamsService } from '../services';
import { ContentHeader } from '../components/common/Navigation';
import './MyRecordingsPage.css';

// Icons
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
  </svg>
);

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

// Helper functions
const getColorFromString = (str) => {
  const colors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4', '#10b981', '#ef4444'];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDuration = (seconds) => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const getRecordingTypeIcon = (type) => {
  switch (type) {
    case 'video': return <VideoIcon />;
    case 'audio': return <MicIcon />;
    case 'text': return <TextIcon />;
    default: return null;
  }
};

// Recording Card Component (Grid View)
const RecordingCard = ({ recording, onDelete, onPlay }) => {
  const renderThumbnail = () => {
    if (recording.recording_type === 'video') {
      return (
        <div className="recording-card__thumbnail recording-card__thumbnail--video">
          {recording.thumbnail_url ? (
            <img src={recording.thumbnail_url} alt="Video thumbnail" />
          ) : (
            <div className="recording-card__thumbnail-placeholder">
              <VideoIcon />
            </div>
          )}
          <button className="recording-card__play-btn" onClick={() => onPlay(recording)}>
            <PlayIcon />
          </button>
          {recording.duration && (
            <span className="recording-card__duration">{formatDuration(recording.duration)}</span>
          )}
        </div>
      );
    }

    if (recording.recording_type === 'audio') {
      return (
        <div className="recording-card__thumbnail recording-card__thumbnail--audio">
          <MicIcon />
          {recording.duration && (
            <span className="recording-card__duration">{formatDuration(recording.duration)}</span>
          )}
        </div>
      );
    }

    return (
      <div className="recording-card__thumbnail recording-card__thumbnail--text">
        <p className="recording-card__text-preview">
          {recording.text_content?.substring(0, 100)}
          {recording.text_content?.length > 100 && '...'}
        </p>
      </div>
    );
  };

  return (
    <article className="recording-card">
      {renderThumbnail()}
      <div className="recording-card__content">
        <div className="recording-card__meta">
          <span className="recording-card__type">{getRecordingTypeIcon(recording.recording_type)}</span>
          <span className="recording-card__question">Q: {recording.question?.title || recording.question_id}</span>
        </div>
        {recording.description && (
          <p className="recording-card__description">{recording.description}</p>
        )}
        <div className="recording-card__footer">
          <span className="recording-card__date">{formatDate(recording.created_at)}</span>
          {recording.team && (
            <span className="recording-card__team">{recording.team.name}</span>
          )}
        </div>
      </div>
      <div className="recording-card__actions">
        <button
          className="recording-card__delete-btn"
          onClick={() => onDelete(recording)}
          title="Delete recording"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
};

// Recording Row Component (List View)
const RecordingRow = ({ recording, onDelete, onPlay }) => {
  return (
    <tr className="recording-row">
      <td className="recording-row__type">
        {getRecordingTypeIcon(recording.recording_type)}
      </td>
      <td className="recording-row__question">
        {recording.question?.title || recording.question_id}
      </td>
      <td className="recording-row__description">
        {recording.description || (recording.text_content?.substring(0, 50) + '...')}
      </td>
      <td className="recording-row__team">
        {recording.team?.name || '-'}
      </td>
      <td className="recording-row__duration">
        {formatDuration(recording.duration) || '-'}
      </td>
      <td className="recording-row__date">
        {formatDate(recording.created_at)}
      </td>
      <td className="recording-row__actions">
        {recording.recording_type !== 'text' && (
          <button
            className="recording-row__btn"
            onClick={() => onPlay(recording)}
            title="Play"
          >
            <PlayIcon />
          </button>
        )}
        <button
          className="recording-row__btn recording-row__btn--danger"
          onClick={() => onDelete(recording)}
          title="Delete"
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
};

// Main Component
function MyRecordingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recordings, setRecordings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal
  const [playingRecording, setPlayingRecording] = useState(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [recordingsData, teamsData] = await Promise.all([
        recordingsService.getMyRecordings(),
        teamsService.getMyTeams().catch(() => ({ data: [] })),
      ]);

      setRecordings(recordingsData.data || recordingsData.results || recordingsData || []);
      setTeams(teamsData.data || teamsData.results || teamsData || []);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
      setError('Failed to load recordings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (recording) => {
    if (!window.confirm('Are you sure you want to delete this recording? This cannot be undone.')) {
      return;
    }

    try {
      await recordingsService.deleteRecording(recording.id);
      setRecordings(prev => prev.filter(r => r.id !== recording.id));
      toast.success('Recording deleted');
    } catch (err) {
      toast.error('Failed to delete recording');
    }
  };

  const handlePlay = (recording) => {
    setPlayingRecording(recording);
  };

  // Filter and sort recordings
  const filteredRecordings = recordings
    .filter(r => filterTeam === 'all' || r.team?.id === filterTeam)
    .filter(r => filterType === 'all' || r.recording_type === filterType)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      if (sortBy === 'question') {
        return (a.question_id || '').localeCompare(b.question_id || '');
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="my-recordings-page">
        <div className="my-recordings-page__loading">Loading recordings...</div>
      </div>
    );
  }

  return (
    <div className="my-recordings-page">
      <ContentHeader
        title="My Recordings"
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'My Recordings' },
        ]}
      />

      <div className="my-recordings-page__content">
        {/* Toolbar */}
        <div className="my-recordings-page__toolbar">
          <div className="my-recordings-page__filters">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="my-recordings-page__select"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="my-recordings-page__select"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="text">Text</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="my-recordings-page__select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="question">By Question</option>
            </select>
          </div>

          <div className="my-recordings-page__view-toggle">
            <button
              className={`my-recordings-page__view-btn ${viewMode === 'grid' ? 'my-recordings-page__view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <GridIcon />
            </button>
            <button
              className={`my-recordings-page__view-btn ${viewMode === 'list' ? 'my-recordings-page__view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <ListIcon />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="my-recordings-page__stats">
          <div className="my-recordings-page__stat">
            <span className="my-recordings-page__stat-value">{recordings.length}</span>
            <span className="my-recordings-page__stat-label">Total Recordings</span>
          </div>
          <div className="my-recordings-page__stat">
            <span className="my-recordings-page__stat-value">
              {recordings.filter(r => r.recording_type === 'video').length}
            </span>
            <span className="my-recordings-page__stat-label">Videos</span>
          </div>
          <div className="my-recordings-page__stat">
            <span className="my-recordings-page__stat-value">
              {recordings.filter(r => r.recording_type === 'audio').length}
            </span>
            <span className="my-recordings-page__stat-label">Audio</span>
          </div>
          <div className="my-recordings-page__stat">
            <span className="my-recordings-page__stat-value">
              {recordings.filter(r => r.recording_type === 'text').length}
            </span>
            <span className="my-recordings-page__stat-label">Text</span>
          </div>
        </div>

        {/* Content */}
        {filteredRecordings.length === 0 ? (
          <div className="my-recordings-page__empty">
            <h3>No recordings yet</h3>
            <p>Start a questionnaire to create your first recording</p>
            <button
              className="my-recordings-page__empty-btn"
              onClick={() => navigate('/questionnaire/Q10A')}
            >
              Start Questionnaire
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="my-recordings-page__grid">
            {filteredRecordings.map(recording => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                onDelete={handleDelete}
                onPlay={handlePlay}
              />
            ))}
          </div>
        ) : (
          <div className="my-recordings-page__list">
            <table className="my-recordings-page__table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Question</th>
                  <th>Description</th>
                  <th>Team</th>
                  <th>Duration</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecordings.map(recording => (
                  <RecordingRow
                    key={recording.id}
                    recording={recording}
                    onDelete={handleDelete}
                    onPlay={handlePlay}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Play Modal */}
      {playingRecording && (
        <div className="my-recordings-page__modal" onClick={() => setPlayingRecording(null)}>
          <div className="my-recordings-page__modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="my-recordings-page__modal-close"
              onClick={() => setPlayingRecording(null)}
            >
              &times;
            </button>
            {playingRecording.recording_type === 'video' ? (
              <video
                src={playingRecording.media_url}
                controls
                autoPlay
                className="my-recordings-page__modal-video"
              />
            ) : (
              <audio
                src={playingRecording.media_url}
                controls
                autoPlay
                className="my-recordings-page__modal-audio"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRecordingsPage;
