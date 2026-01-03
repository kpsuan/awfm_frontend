import React, { useRef, useCallback } from 'react';
import './Card.css';

const ChoiceCard = ({
  choice,
  isSelected = false,
  isExpanded = false, // fully controlled by parent
  onSelect,
  onExpand, // callback for expand/collapse
  onOpenModal, // callback to open modal popup
  variant = 'default', // 'default', 'review'
  isQ2 = false,
  isQ3 = false
}) => {
  const cardRef = useRef(null);
  const { id, title, subtitle, description, image, whyThisMatters, researchEvidence, decisionImpact, expandedContent } = choice;

  const isReviewMode = variant === 'review';

  // Scroll card into view with delay
  const scrollToCard = useCallback(() => {
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 150);
  }, []);

  // Card click - select and scroll (no modal)
  const handleCardClick = () => {
    if (!isReviewMode) {
      onSelect?.(id);
    }
    scrollToCard();
  };

  // Check if we're on mobile
  const isMobile = () => window.innerWidth < 768;

  // Learn More click - opens modal on tablet+, inline expand on mobile
  const handleExpandClick = (e) => {
    e.stopPropagation();
    if (onOpenModal && !isMobile()) {
      // Use modal on tablet and larger
      onOpenModal();
    } else {
      // Use inline expand on mobile or if no modal available
      onExpand?.(id, !isExpanded);
    }
  };

  // Handle checkbox click - toggle selection and scroll
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect?.(id);
    scrollToCard();
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

  // Info icon for section headers with tooltip
  const InfoIconWithTooltip = ({ tooltip }) => (
    <div className="choice-card__info-wrapper">
      <svg className="choice-card__info-icon" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="url(#infoGradient)" strokeWidth="1.5"/>
        <path d="M7 6V10" stroke="url(#infoGradient)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="7" cy="4" r="0.75" fill="url(#infoGradient)"/>
        <defs>
          <linearGradient id="infoGradient" x1="7" y1="0" x2="7" y2="14" gradientUnits="userSpaceOnUse">
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

  // Build sections array from individual props or expandedContent
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
  // Also support legacy expandedContent array
  if (expandedContent && sections.length === 0) {
    sections.push(...expandedContent);
  }

  return (
    <div
      ref={cardRef}
      className={`choice-card ${isSelected ? 'choice-card--selected' : ''} ${isExpanded ? 'choice-card--expanded' : ''} ${isReviewMode ? 'choice-card--review' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Header with checkbox and title */}
      <div className="choice-card__header" onClick={handleCardClick}>
        {!isReviewMode && (
          <div
            className="choice-card__checkbox"
            aria-hidden="true"
            onClick={handleCheckboxClick}
          >
            {isSelected && (
              <div className="choice-card__checkbox-fill">
                <CheckIcon />
              </div>
            )}
          </div>
        )}
        <div className="choice-card__title-wrapper">
          <h3 className={`choice-card__title ${isSelected || isReviewMode ? 'choice-card__title--selected' : ''}`}>
            {title}
          </h3>
        </div>
      </div>

      {/* Image - shown in both collapsed and expanded */}
      {image && (
        <div className="choice-card__image" onClick={handleCardClick}>
          <img src={image} alt={title} />
        </div>
      )}

      {/* Description text - shown in both collapsed and expanded */}
      <p className="choice-card__description" onClick={handleCardClick}>
        {description || title}
      </p>

      {/* Collapsed state - show button when not expanded, or when on desktop with modal available */}
      {(!isExpanded || (onOpenModal && !isMobile())) ? (
        <>
          {/* Learn More button - opens modal on desktop, inline expand on mobile */}
          <button
            className="choice-card__expand"
            onClick={handleExpandClick}
            aria-expanded={!onOpenModal && isExpanded}
          >
            <span>{isReviewMode ? 'View Details' : 'Learn More'}</span>
           
          </button>
        </>
      ) : (
        <>
          {/* Header divider line */}
          <div className="choice-card__header-divider" />

          {/* Expanded content sections */}
          <div className="choice-card__expanded">
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

          {/* Collapse button */}
          <button 
            className="choice-card__expand"
            onClick={handleExpandClick}
            aria-expanded={isExpanded}
          >
            <span>See Less</span>
            <ArrowIcon rotated={false} />
          </button>
        </>
      )}
    </div>
  );
};

export default ChoiceCard;
