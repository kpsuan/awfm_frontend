import React, { useRef, useEffect } from 'react';
import { Users, ChevronDown, Check } from 'lucide-react';
import './TeamSelector.css';

const TeamSelector = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  isOpen,
  onToggle,
  label = "Visible to:",
  placeholder = "Select Team",
  className = ""
}) => {
  const dropdownRef = useRef(null);
  const selectedTeam = teams.find(t => t.id === selectedTeamId) || teams[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (isOpen) onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  if (!teams || teams.length === 0) return null;

  return (
    <div className={`team-selector ${className}`} ref={dropdownRef}>
      {label && <label className="team-selector__label">{label}</label>}
      <button
        className="team-selector__btn"
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <Users size={18} />
        <span className="team-selector__name">{selectedTeam?.name || placeholder}</span>
        <ChevronDown size={16} className={`team-selector__chevron ${isOpen ? 'team-selector__chevron--open' : ''}`} />
      </button>

      {isOpen && teams.length > 1 && (
        <div className="team-selector__dropdown">
          {teams.map((team) => (
            <button
              key={team.id}
              className={`team-selector__item ${team.id === selectedTeamId ? 'team-selector__item--active' : ''}`}
              onClick={() => {
                onSelectTeam(team.id);
                onToggle();
              }}
              type="button"
            >
              {team.avatar_url ? (
                <img
                  src={team.avatar_url}
                  alt={team.name}
                  className="team-selector__avatar"
                />
              ) : (
                <div className="team-selector__avatar-placeholder">
                  <Users size={18} />
                </div>
              )}
              <span className="team-selector__item-name">{team.name}</span>
              {team.id === selectedTeamId && (
                <Check size={16} className="team-selector__check" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSelector;
