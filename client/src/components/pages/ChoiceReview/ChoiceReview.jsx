import React, { useState } from 'react';
import './ChoiceReview.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { ChoiceCard } from '../../common/Card';
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
  const { title, subtitle, instruction, checkpointLabel } = question || {};
  const [expandedCardId, setExpandedCardId] = useState(null);
  
  // Use selectedChoices array if provided, otherwise fall back to single selectedChoice
  const choices = selectedChoices.length > 0 ? selectedChoices : (selectedChoice ? [selectedChoice] : []);

  const handleExpandChange = (choiceId, shouldExpand) => {
    setExpandedCardId(shouldExpand ? choiceId : null);
  };

  return (
    <TwoColumnLayout>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack}>
        <div className="choice-review">
          {/* Image on left panel */}
          <div className="choice-review__image">
            <img src={image1} alt="Question illustration" />
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
              <img src={image1} alt="Question illustration" />
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
                  variant="review"
                  isQ2={question?.checkpointLabel === 'YOUR CHALLENGES'}
                  isQ3={question?.checkpointLabel === 'YOUR MIND-CHANGER'}
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
    </TwoColumnLayout>
  );
};

export default ChoiceReview;
