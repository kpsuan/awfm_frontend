import React from 'react';
import Button from '../../components/common/Button/Button';

const RecentSessions = ({ sessions, onQuestionClick }) => {
  if (sessions.length === 0) return null;

  return (
    <section className="dashboard-section recent-sessions">
      <div className="section-header">
        <h2 className="section-title">Recent Sessions</h2>
        <Button variant="ghost" size="sm">View History</Button>
      </div>
      <div className="recent-sessions-grid">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="session-card"
            onClick={() => onQuestionClick(session.questionId)}
          >
            <div className="session-card-image">
              <span className="session-image-label">{session.questionId}</span>
              <div className="session-layer-badge">Layer {session.layer}/3</div>
            </div>
            <div className="session-card-content">
              <h3 className="session-card-title">{session.questionTitle}</h3>
              <div className="session-card-footer">
                <span className="session-card-date">{session.date}</span>
                <Button variant="primary" size="sm">Continue</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentSessions;
