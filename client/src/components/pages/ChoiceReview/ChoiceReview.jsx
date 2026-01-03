import React, { useState } from 'react';
import './ChoiceReview.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { ChoiceCardModal } from '../../common/Modal';
import image1 from '../../../styles/image1.png';

// Checkmark icon component
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="url(#checkGradient)" />
    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="checkGradient" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#b432a3"/>
        <stop offset="1" stopColor="#ae59cf"/>
      </linearGradient>
    </defs>
  </svg>
);

// Expand icon component
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const ChoiceReview = ({
  question,
  selectedChoice,
  selectedChoices = [], // Support for multiple choices
  progress = { current: 3, total: 4 },
  onConfirm,
  onBack,
  onChangeAnswer
}) => {
  const { title, subtitle, instruction, checkpointLabel, image } = question || {};
  const [modalChoice, setModalChoice] = useState(null);

  // Use database image if available, otherwise fallback to static image
  const questionImage = image || image1;

  // Use selectedChoices array if provided, otherwise fall back to single selectedChoice
  const choices = selectedChoices.length > 0 ? selectedChoices : (selectedChoice ? [selectedChoice] : []);

  // Open modal with choice details
  const handleOpenModal = (choice) => {
    setModalChoice(choice);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalChoice(null);
  };

  // Determine Q2/Q3 based on checkpointLabel
  const isQ2 = checkpointLabel === 'YOUR CHALLENGES';
  const isQ3 = checkpointLabel === 'YOUR MIND-CHANGER';

  return (
    <TwoColumnLayout isContentFocused={false}>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack}>
        <div className="choice-review">
          {/* Image on left panel */}
          <div className="choice-review__image">
            <img src={questionImage} alt="Question illustration" />
          </div>

          <div className="choice-review__header">
            {checkpointLabel && <span className="choice-review__checkpoint">{checkpointLabel}</span>}
            {subtitle && <span className="choice-review__subtitle">{subtitle}</span>}
            <h1 className="choice-review__title">{title || "What concerns, issues, and challenges might you be facing?"}</h1>
            {instruction && <p className="choice-review__instruction">{instruction}</p>}
          </div>
        </div>
      </QuestionPanel>

      <ContentPanel>
        <div className="choice-review__content">
          {/* Mobile/Tablet header - shown only on smaller screens */}
          <div className="choice-review__mobile-header">
            <div className="choice-review__mobile-image">
              <img src={questionImage} alt="Question illustration" />
            </div>
            <div className="choice-review__mobile-info">
              {checkpointLabel && subtitle && (
                <span className="choice-review__mobile-label">
                  {checkpointLabel}: {subtitle}
                </span>
              )}
              <h2 className="choice-review__mobile-title">
                {title || "What concerns, issues, and challenges might you be facing?"}
              </h2>
            </div>
          </div>

          {/* Summary Header */}
          <div className="choice-review__summary-header">
            <h2 className="choice-review__page-title">Review Your Selection</h2>
            <span className="choice-review__count">
              {choices.length} {choices.length === 1 ? 'choice' : 'choices'} selected
            </span>
          </div>

          {/* Summary Panel */}
          <div className="choice-review__summary-panel">
            <div className="choice-review__summary-list">
              {choices.map((choice) => (
                <div
                  key={choice.id}
                  className="choice-review__summary-item"
                  onClick={() => handleOpenModal(choice)}
                >
                  {choice.image && (
                    <div className="choice-review__summary-image">
                      <img src={choice.image} alt={choice.title} />
                    </div>
                  )}
                  <div className="choice-review__summary-content">
                    <div className="choice-review__summary-header-row">
                      <CheckIcon />
                      <h3 className="choice-review__summary-title">{choice.title}</h3>
                    </div>
                    <p className="choice-review__summary-description">
                      {choice.description?.substring(0, 150)}
                      {choice.description?.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <button className="choice-review__summary-expand" aria-label="View details">
                    <ExpandIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Confirmation message */}
            <div className="choice-review__confirmation">
              <p>Click on any selection above to view full details, or continue to confirm your choices.</p>
            </div>
          </div>

          <div className="choice-review__actions">
            <PrimaryButton onClick={onConfirm} fullWidth disabled={choices.length === 0}>
              Confirm and Continue
              <span className="choice-review__arrow">→</span>
            </PrimaryButton>
            <SecondaryButton onClick={onChangeAnswer || onBack} fullWidth>
              <span className="choice-review__back-arrow">←</span>
              Change Answer
            </SecondaryButton>
          </div>
        </div>
      </ContentPanel>

      {/* Choice Card Modal */}
      <ChoiceCardModal
        isOpen={!!modalChoice}
        choice={modalChoice}
        isSelected={true}
        onClose={handleCloseModal}
        onSelect={handleCloseModal}
        isQ2={isQ2}
        isQ3={isQ3}
      />
    </TwoColumnLayout>
  );
};

export default ChoiceReview;
