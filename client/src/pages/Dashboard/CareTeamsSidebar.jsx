import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button/Button';

const CareTeamsSidebar = ({ teams, onAddTeam }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <h3 className="sidebar-card-title">Your Care Teams</h3>
        <Button variant="ghost" size="sm">Manage</Button>
      </div>
      {teams.length > 0 ? (
        <div className="teams-list">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-item"
              onClick={() => navigate(`/team/${team.id}`)}
            >
              <div className="team-avatars">
                {team.members.slice(0, 3).map((member, idx) => (
                  <div
                    key={member.id}
                    className="team-avatar"
                    style={{
                      backgroundColor: member.color,
                      zIndex: team.members.length - idx,
                    }}
                    title={member.name}
                  >
                    {member.initials}
                  </div>
                ))}
                {team.members.length > 3 && (
                  <div className="team-avatar team-avatar-more">
                    +{team.members.length - 3}
                  </div>
                )}
              </div>
              <div className="team-info">
                <div className="team-name-row">
                  <span className="team-level">L{team.level}</span>
                  <span className="team-name">{team.name}</span>
                </div>
                <div className="team-progress-row">
                  <div className="team-progress-bar">
                    <div
                      className="team-progress-fill"
                      style={{ width: `${(team.questionsAnswered / team.totalQuestions) * 100}%` }}
                    />
                  </div>
                  <span className="team-progress-text">{team.questionsAnswered}/{team.totalQuestions}</span>
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={onAddTeam}
            leftIcon={<Plus size={16} />}
          >
            Add Care Team
          </Button>
        </div>
      ) : (
        <div className="teams-empty">
          <p>No care teams yet</p>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={onAddTeam}
            leftIcon={<Plus size={16} />}
          >
            Create Your First Team
          </Button>
        </div>
      )}
    </div>
  );
};

export default CareTeamsSidebar;
