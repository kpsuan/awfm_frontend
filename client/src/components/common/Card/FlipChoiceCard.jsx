import React, { useState } from 'react';
import './Card.css';

const FlipChoiceCard = ({
  choice,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onExpand,
  isQ2 = false,
  isQ3 = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { id, title, description, image, whyThisMatters, researchEvidence, decisionImpact, expandedContent } = choice;

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    onSelect?.(id);
  };

  const handleExpandClick = (e) => {
    e.stopPropagation();
    onExpand?.(id, !isExpanded);
  };

  // Checkmark SVG icon for selected state
  const CheckIcon = () => (
    <svg className="choice-card__checkbox-check" viewBox="0 0 10 8" fill="none">
      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Arrow SVG icon for expand/collapse
  const ArrowIcon = ({ rotated }) => (
    <svg className={`choice-card__expand-icon ${rotated ? 'choice-card__expand-icon--rotated' : ''}`} viewBox="0 0 12 8" fill="none">
      <path d="M1 7L6 2L11 7" stroke="url(#arrowGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="arrowGradient" x1="6" y1="7" x2="6" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0.25" stopColor="#b432a3"/>
          <stop offset="1" stopColor="#ae59cf"/>
        </linearGradient>
      </defs>
    </svg>
  );

  // Flip icon
  const FlipIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 1l4 4-4 4"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <path d="M7 23l-4-4 4-4"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  );

  // Info icon for section headers with tooltip
  const InfoIconWithTooltip = ({ tooltip }) => (
    <div className="choice-card__info-wrapper">
      <svg className="choice-card__info-icon" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="url(#infoGradientFlip)" strokeWidth="1.5"/>
        <path d="M7 6V10" stroke="url(#infoGradientFlip)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="4" r="0.75" fill="url(#infoGradientFlip)"/>
        <defs>
          <linearGradient id="infoGradientFlip" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
            <stop offset="0.25" stopColor="#b432a3"/>
            <stop offset="1" stopColor="#ae59cf"/>
          </linearGradient>
        </defs>
      </svg>
      {tooltip && (
        <div className="choice-card__tooltip">
          <div className="choice-card__tooltip-arrow" />
          <div className="choice-card__tooltip-content">{tooltip}</div>
        </div>
      )}
    </div>
  );

  // Build sections array
  const sections = [];
  if (whyThisMatters) {
    sections.push({
      title: 'Why this Matters',
      text: whyThisMatters,
      tooltip: 'This explains why this choice is significant for your care planning decisions.'
    });
  }
  if (researchEvidence) {
    sections.push({
      title: 'Research Evidence',
      text: researchEvidence,
      tooltip: 'This gives users more information about clinical studies and data supporting this option.'
    });
  }
  if (decisionImpact) {
    sections.push({
      title: 'Decision Impact',
      text: decisionImpact,
      tooltip: 'This describes the practical outcomes and effects of choosing this option.'
    });
  }
  if (expandedContent && sections.length === 0) {
    sections.push(...expandedContent);
  }

  return (
    <div className={`flip-choice-card ${isSelected ? 'flip-choice-card--selected' : ''}`}>
      {/* Flip Card Container */}
      <div
        className={`flip-choice-card__flipper ${isFlipped ? 'flip-choice-card__flipper--flipped' : ''}`}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleFlip(e)}
      >
        {/* Front of card - Image and Title */}
        <div className="flip-choice-card__front">
          {/* Selection checkbox */}
          <div
            className="flip-choice-card__select-area"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <div className="flip-choice-card__checkbox" aria-hidden="true">
              {isSelected && (
                <div className="flip-choice-card__checkbox-fill">
                  <CheckIcon />
                </div>
              )}
            </div>
          </div>

          {image && (
            <div className="flip-choice-card__image">
              <img src={image} alt={title} />
            </div>
          )}
          <div className="flip-choice-card__front-content">
            <h3 className={`flip-choice-card__title ${isSelected ? 'flip-choice-card__title--selected' : ''}`}>
              {title}
            </h3>
            <span className="flip-choice-card__hint">
              <FlipIcon />
              Tap to know how it sounds like
            </span>
          </div>
        </div>

        {/* Back of card - Description */}
        <div className="flip-choice-card__back">
          <div className="flip-choice-card__back-content">
            <h3 className="flip-choice-card__back-title">{title}</h3>
            <div className="flip-choice-card__divider" />
            <p className="flip-choice-card__description">{description || title}</p>
            <span className="flip-choice-card__hint flip-choice-card__hint--back">
              <FlipIcon />
              Tap to flip back
            </span>
          </div>
        </div>
      </div>

      {/* Expand/Collapse button - outside the flip area */}
      <button
        className="flip-choice-card__expand"
        onClick={handleExpandClick}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'See Less' : 'See More'}</span>
        <ArrowIcon rotated={!isExpanded} />
      </button>

      {/* Expanded content - shows image, title, description, then sections */}
      {isExpanded && (
        <div className="flip-choice-card__expanded">
          {/* Image */}
          {image && (
            <div className="flip-choice-card__expanded-image">
              <img src={image} alt={title} />
            </div>
          )}

          {/* Title */}
          <h3 className={`flip-choice-card__expanded-title ${isSelected ? 'flip-choice-card__expanded-title--selected' : ''}`}>
            {title}
          </h3>

          {/* Description */}
          <p className="flip-choice-card__expanded-description">
            {description || title}
          </p>

          {/* Divider before sections */}
          {sections.length > 0 && <div className="flip-choice-card__expanded-divider" />}

          {/* Expanded content sections */}
          {sections.map((section, index) => (
            <React.Fragment key={index}>
              <div className="choice-card__section">
                <div className="choice-card__section-header">
                  <span className="choice-card__section-title">{section.title}</span>
                  <InfoIconWithTooltip tooltip={section.tooltip} />
                </div>
                <p className="choice-card__section-text">{section.text}</p>
              </div>
              {index < sections.length - 1 && <div className="choice-card__section-divider" />}
            </React.Fragment>
          ))}

          {/* Show extra fields for q2 only */}
          {isQ2 && (
            <>
              {choice.whatYouAreFightingFor && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">What You're Fighting For</span>
                    <InfoIconWithTooltip tooltip="This describes what this choice helps you protect or achieve, and what you may sacrifice." />
                  </div>
                  <p className="choice-card__section-text">{choice.whatYouAreFightingFor}</p>
                </div>
              )}
              {choice.cooperativeLearning && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">Cooperative Learning</span>
                    <InfoIconWithTooltip tooltip="How this challenge affects teamwork, communication, and shared decision-making." />
                  </div>
                  <p className="choice-card__section-text">{choice.cooperativeLearning}</p>
                </div>
              )}
              {choice.barriersToAccess && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">Barriers to Access</span>
                    <InfoIconWithTooltip tooltip="Barriers that make this challenge harder for some people or groups." />
                  </div>
                  <p className="choice-card__section-text">{choice.barriersToAccess}</p>
                </div>
              )}
            </>
          )}

          {/* Show extra fields for q3 only */}
          {isQ3 && (
            <>
              {choice.careTeamAffirmation && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">Care Team Affirmation</span>
                    <InfoIconWithTooltip tooltip="How your care team will support and affirm this change." />
                  </div>
                  <p className="choice-card__section-text">{choice.careTeamAffirmation}</p>
                </div>
              )}
              {choice.interdependencyAtWork && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">Interdependency at Work</span>
                    <InfoIconWithTooltip tooltip="How this change involves teamwork, roles, and shared responsibilities." />
                  </div>
                  <p className="choice-card__section-text">{choice.interdependencyAtWork}</p>
                </div>
              )}
              {choice.reflectionGuidance && (
                <div className="choice-card__section">
                  <div className="choice-card__section-header">
                    <span className="choice-card__section-title">Reflection Guidance</span>
                    <InfoIconWithTooltip tooltip="Questions and prompts to help you reflect on this change." />
                  </div>
                  <p className="choice-card__section-text">{choice.reflectionGuidance}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FlipChoiceCard;
