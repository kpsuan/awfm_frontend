import React, { useState, useCallback, useRef } from 'react';
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
  const [backPageIndex, setBackPageIndex] = useState(0);
  const cardRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const { id, title, description, image, whyThisMatters, researchEvidence, decisionImpact, expandedContent } = choice;

  // Build back pages array based on available content
  const backPages = [];

  // Page 1: How This Sounds (description)
  if (description) {
    backPages.push({
      id: 'description',
      label: 'How This Sounds',
      content: description
    });
  }

  // Page 2: Why This Matters
  if (whyThisMatters) {
    backPages.push({
      id: 'whyThisMatters',
      label: 'Why This Matters',
      content: whyThisMatters
    });
  }

  // Page 3: Research Evidence (Q1)
  if (researchEvidence) {
    backPages.push({
      id: 'researchEvidence',
      label: 'Research Evidence',
      content: researchEvidence
    });
  }

  // Page 4: Decision Impact (Q1)
  if (decisionImpact) {
    backPages.push({
      id: 'decisionImpact',
      label: 'Decision Impact',
      content: decisionImpact
    });
  }

  // Q2 specific pages
  if (isQ2) {
    if (choice.whatYouAreFightingFor) {
      backPages.push({
        id: 'whatYouAreFightingFor',
        label: "What You're Fighting For",
        content: choice.whatYouAreFightingFor
      });
    }
    if (choice.cooperativeLearning) {
      backPages.push({
        id: 'cooperativeLearning',
        label: 'Cooperative Learning',
        content: choice.cooperativeLearning
      });
    }
    if (choice.barriersToAccess) {
      backPages.push({
        id: 'barriersToAccess',
        label: 'Barriers to Access',
        content: choice.barriersToAccess
      });
    }
  }

  // Q3 specific pages
  if (isQ3) {
    if (choice.interdependencyAtWork) {
      backPages.push({
        id: 'interdependencyAtWork',
        label: 'Interdependency at Work',
        content: choice.interdependencyAtWork
      });
    }
    if (choice.reflectionGuidance) {
      backPages.push({
        id: 'reflectionGuidance',
        label: 'Reflection Guidance',
        content: choice.reflectionGuidance
      });
    }
    if (choice.careTeamAffirmation) {
      backPages.push({
        id: 'careTeamAffirmation',
        label: 'Care Team Affirmation',
        content: choice.careTeamAffirmation
      });
    }
  }

  // Fallback if no pages
  if (backPages.length === 0) {
    backPages.push({
      id: 'title',
      label: 'Description',
      content: title
    });
  }

  const currentPage = backPages[backPageIndex] || backPages[0];
  const hasNextPage = backPageIndex < backPages.length - 1;
  const hasPrevPage = backPageIndex > 0;

  // Scroll card into view with delay
  const scrollToCard = useCallback(() => {
    setTimeout(() => {
      cardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  }, []);

  const handleFlip = (e) => {
    e.stopPropagation();
    if (isFlipped) {
      // Flipping back to front - reset page index
      setBackPageIndex(0);
    }
    setIsFlipped(!isFlipped);
    scrollToCard();
  };

  const handleCardClick = () => {
    onSelect?.(id);
    scrollToCard();
  };


  // Back page navigation
  const goToNextPage = useCallback((e) => {
    e.stopPropagation();
    if (hasNextPage) {
      setBackPageIndex(prev => prev + 1);
    }
  }, [hasNextPage]);

  const goToPrevPage = useCallback((e) => {
    e.stopPropagation();
    if (hasPrevPage) {
      setBackPageIndex(prev => prev - 1);
    }
  }, [hasPrevPage]);

  // Touch handlers for swipe on back
  const handleBackTouchStart = useCallback((e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleBackTouchMove = useCallback((e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleBackTouchEnd = useCallback((e) => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasNextPage) {
      // Swipe left - next page
      setBackPageIndex(prev => prev + 1);
      e.stopPropagation();
    } else if (distance < -minSwipeDistance && hasPrevPage) {
      // Swipe right - prev page
      setBackPageIndex(prev => prev - 1);
      e.stopPropagation();
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [hasNextPage, hasPrevPage]);

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

  // Navigation arrow icons
  const ChevronLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  );

  const ChevronRight = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
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
    <div ref={cardRef} className={`flip-choice-card ${isSelected ? 'flip-choice-card--selected' : ''}`}>
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

        {/* Back of card - Paginated Content */}
        <div
          className="flip-choice-card__back"
          onTouchStart={handleBackTouchStart}
          onTouchMove={handleBackTouchMove}
          onTouchEnd={handleBackTouchEnd}
        >
          {/* Navigation arrows */}
          {backPages.length > 1 && (
            <>
              <button
                className={`flip-choice-card__nav-btn flip-choice-card__nav-btn--prev ${!hasPrevPage ? 'flip-choice-card__nav-btn--disabled' : ''}`}
                onClick={goToPrevPage}
                disabled={!hasPrevPage}
                aria-label="Previous page"
              >
                <ChevronLeft />
              </button>
              <button
                className={`flip-choice-card__nav-btn flip-choice-card__nav-btn--next ${!hasNextPage ? 'flip-choice-card__nav-btn--disabled' : ''}`}
                onClick={goToNextPage}
                disabled={!hasNextPage}
                aria-label="Next page"
              >
                <ChevronRight />
              </button>
            </>
          )}

          <div className="flip-choice-card__back-content">
            {/* Page label */}
            <span className="flip-choice-card__page-label">{currentPage.label}</span>
            <h3 className="flip-choice-card__back-title">{title}</h3>
            <div className="flip-choice-card__divider" />

            {/* Page content with animation */}
            <div className="flip-choice-card__page-content" key={currentPage.id}>
              <p className="flip-choice-card__description">{currentPage.content}</p>
            </div>

            {/* Page indicators */}
            {backPages.length > 1 && (
              <div className="flip-choice-card__page-indicators">
                {backPages.map((page, idx) => (
                  <button
                    key={page.id}
                    className={`flip-choice-card__page-dot ${idx === backPageIndex ? 'flip-choice-card__page-dot--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setBackPageIndex(idx);
                    }}
                    aria-label={`Go to ${page.label}`}
                  />
                ))}
              </div>
            )}

            <span className="flip-choice-card__hint flip-choice-card__hint--back">
              <FlipIcon />
              Tap card to flip back
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default FlipChoiceCard;
