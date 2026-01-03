import React, { useEffect } from 'react';
import './ChoiceCardModal.css';

/**
 * Modal popup for viewing choice card details
 * Makes it easier to read all the content without scrolling the card
 */
const ChoiceCardModal = ({
  isOpen,
  choice,
  isSelected,
  onClose,
  onSelect,
  isQ2 = false,
  isQ3 = false
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !choice) return null;

  const {
    id,
    title,
    description,
    image,
    whyThisMatters,
    researchEvidence,
    decisionImpact,
    whatYouAreFightingFor,
    cooperativeLearning,
    barriersToAccess,
    careTeamAffirmation,
    interdependencyAtWork,
    reflectionGuidance
  } = choice;

  // Build sections based on question type
  const sections = [];

  // Q1 sections
  if (whyThisMatters) {
    sections.push({ title: 'Why this Matters', text: whyThisMatters });
  }
  if (researchEvidence) {
    sections.push({ title: 'Research Evidence', text: researchEvidence });
  }
  if (decisionImpact) {
    sections.push({ title: 'Decision Impact', text: decisionImpact });
  }

  // Q2 sections
  if (isQ2) {
    if (whatYouAreFightingFor) {
      sections.push({ title: "What You're Fighting For", text: whatYouAreFightingFor });
    }
    if (cooperativeLearning) {
      sections.push({ title: 'Cooperative Learning', text: cooperativeLearning });
    }
    if (barriersToAccess) {
      sections.push({ title: 'Barriers to Access', text: barriersToAccess });
    }
  }

  // Q3 sections
  if (isQ3) {
    if (careTeamAffirmation) {
      sections.push({ title: 'Care Team Affirmation', text: careTeamAffirmation });
    }
    if (interdependencyAtWork) {
      sections.push({ title: 'Interdependency at Work', text: interdependencyAtWork });
    }
    if (reflectionGuidance) {
      sections.push({ title: 'Reflection Guidance', text: reflectionGuidance });
    }
  }

  const handleSelect = () => {
    onSelect?.(id);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="choice-modal-overlay" onClick={handleBackdropClick}>
      <div className="choice-modal" role="dialog" aria-modal="true">
        {/* Close button */}
        <button className="choice-modal__close" onClick={onClose} aria-label="Close">
          <span className="material-icons">close</span>
        </button>

        {/* Content */}
        <div className="choice-modal__content">
          {/* Image */}
          {image && (
            <div className="choice-modal__image">
              <img src={image} alt={title} />
            </div>
          )}

          {/* Header */}
          <div className="choice-modal__header">
            <h2 className={`choice-modal__title ${isSelected ? 'choice-modal__title--selected' : ''}`}>
              {title}
            </h2>
            {isSelected && (
              <span className="choice-modal__selected-badge">
                <span className="material-icons">check_circle</span>
                Selected
              </span>
            )}
          </div>

          {/* Description */}
          <p className="choice-modal__description">{description}</p>

          {/* Divider */}
          {sections.length > 0 && <div className="choice-modal__divider" />}

          {/* Sections */}
          <div className="choice-modal__sections">
            {sections.map((section, index) => (
              <div key={index} className="choice-modal__section">
                <h3 className="choice-modal__section-title">{section.title}</h3>
                <p className="choice-modal__section-text">{section.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with action button */}
        <div className="choice-modal__footer">
          <button
            className={`choice-modal__action ${isSelected ? 'choice-modal__action--selected' : ''}`}
            onClick={handleSelect}
          >
            {isSelected ? (
              <>
                <span className="material-icons">check</span>
                Selected
              </>
            ) : (
              <>
                <span className="material-icons">add_circle_outline</span>
                Select This Choice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoiceCardModal;
