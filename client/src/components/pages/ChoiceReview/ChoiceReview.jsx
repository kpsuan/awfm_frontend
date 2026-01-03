import React, { useState } from 'react';
import './ChoiceReview.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { ChoiceCard } from '../../common/Card';
import { ChoiceCardModal } from '../../common/Modal';
import image1 from '../../../styles/image1.png';

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
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [modalChoice, setModalChoice] = useState(null);

  // Use database image if available, otherwise fallback to static image
  const questionImage = image || image1;

  // Use selectedChoices array if provided, otherwise fall back to single selectedChoice
  const choices = selectedChoices.length > 0 ? selectedChoices : (selectedChoice ? [selectedChoice] : []);

  // Check if we're on tablet or larger (popup only for non-mobile)
  const isTabletOrLarger = () => window.innerWidth >= 768;

  const handleExpandChange = (choiceId, shouldExpand) => {
    setExpandedCardId(shouldExpand ? choiceId : null);
  };

  // Open modal with choice details (only on tablet+)
  const handleOpenModal = (choice) => {
    if (isTabletOrLarger()) {
      setModalChoice(choice);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalChoice(null);
  };

  // Determine Q2/Q3 based on checkpointLabel
  const isQ2 = checkpointLabel === 'YOUR CHALLENGES';
  const isQ3 = checkpointLabel === 'YOUR MIND-CHANGER';

  return (
    <TwoColumnLayout>
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

          <h2 className="choice-review__page-title">Let's Review your Choices</h2>

          <div className="choice-review__cards">
              {choices.map((choice) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  isSelected={true}
                  isExpanded={expandedCardId === choice.id}
                  onExpand={handleExpandChange}
                  onOpenModal={() => handleOpenModal(choice)}
                  variant="review"
                  isQ2={isQ2}
                  isQ3={isQ3}
                />
              ))}
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

      {/* Choice Card Modal - only shown on tablet+ */}
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
