import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Mic, FileText } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import { formatRelativeDate, formatDuration } from '../../utils/formatters';

const RecordingsSidebar = ({ recordings }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <h3 className="sidebar-card-title">Your Recordings</h3>
        <Button variant="ghost" size="sm" onClick={() => navigate('/my-recordings')}>View All</Button>
      </div>
      {recordings.length > 0 ? (
        <div className="recordings-list">
          {recordings.map((recording) => (
            <div key={recording.id} className="recording-item" onClick={() => navigate('/my-recordings')}>
              <div className={`recording-thumb ${recording.recording_type === 'audio' ? 'recording-thumb--audio' : ''} ${recording.recording_type === 'text' ? 'recording-thumb--text' : ''}`}>
                {recording.recording_type === 'video' && recording.thumbnail_url ? (
                  <>
                    <img src={recording.thumbnail_url} alt="Video thumbnail" className="recording-thumb-img" />
                    <div className="recording-play recording-play--overlay">
                      <Play size={14} fill="currentColor" />
                    </div>
                  </>
                ) : recording.recording_type === 'audio' ? (
                  <Mic size={20} />
                ) : recording.recording_type === 'text' ? (
                  <FileText size={20} />
                ) : (
                  <div className="recording-play">
                    <Play size={14} fill="currentColor" />
                  </div>
                )}
                {recording.duration && (
                  <span className="recording-duration">{formatDuration(recording.duration)}</span>
                )}
              </div>
              <div className="recording-details">
                <span className="recording-title">{recording.question_title || recording.question?.title || 'Recording'}</span>
                <span className="recording-meta">{recording.question_id || recording.question?.id} · {formatRelativeDate(recording.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="recordings-empty-small">
          <p>No recordings yet</p>
        </div>
      )}
    </div>
  );
};

export default RecordingsSidebar;
