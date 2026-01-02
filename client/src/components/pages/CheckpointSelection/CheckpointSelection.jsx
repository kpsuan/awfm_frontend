import React, { useState, useRef, useEffect } from 'react';
import './CheckpointSelection.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import { ChoiceCarousel } from '../../features/Choices';
import { CarouselIndicator } from '../../common/Indicator';
import image1 from '../../../styles/image1.png';

const CheckpointSelection = ({
  question,
  choices = [],
  team = [],
  progress = { current: 1, total: 3 },
  initialSelection = [],
  onSelect,
  onContinue,
  onBack,
  multiSelect = true,
  layout = 'horizontal', // 'horizontal' for carousel, 'vertical' for scroll list
  isQ2 = false,
  isQ3 = false
}) => {
  const [selectedChoices, setSelectedChoices] = useState(initialSelection);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const carouselRef = useRef(null);
  const { title, subtitle, instruction, checkpointLabel } = question || {};

  // Sync with initialSelection when it changes (e.g., when returning to edit)
  useEffect(() => {
    if (initialSelection.length > 0) {
      setSelectedChoices(initialSelection);
    }
  }, [initialSelection]);

  const handleSelect = (choiceId) => {
    // Find the index of the selected choice
    const selectedIndex = choices.findIndex(c => c.id === choiceId);
    
    if (multiSelect) {
      const newSelection = selectedChoices.includes(choiceId)
        ? selectedChoices.filter(id => id !== choiceId)
        : [...selectedChoices, choiceId];
      setSelectedChoices(newSelection);
      onSelect?.(newSelection);
      // In multi-select, expand on select, collapse if deselecting
      if (newSelection.includes(choiceId)) {
        setExpandedCardId(choiceId);
        // Scroll to the selected card
        if (selectedIndex !== -1) {
          carouselRef.current?.scrollToIndex(selectedIndex);
        }
      } else {
        setExpandedCardId(null);
      }
    } else {
      // Single select - toggle: if already selected, deselect it
      if (selectedChoices.includes(choiceId)) {
        setSelectedChoices([]);
        setExpandedCardId(null);
        onSelect?.([]);
      } else {
        setSelectedChoices([choiceId]);
        setExpandedCardId(choiceId);
        onSelect?.([choiceId]);
        // Scroll to the selected card
        if (selectedIndex !== -1) {
          carouselRef.current?.scrollToIndex(selectedIndex);
        }
      }
    }
  };

  const handleContinue = () => {
    onContinue?.(selectedChoices);
  };

  const handleChangeAnswer = () => {
    setSelectedChoices([]);
    setExpandedCardId(null);
  };

  const handleExpandChange = (choiceId, shouldExpand) => {
    // Only one card can be expanded at a time
    setExpandedCardId(shouldExpand ? choiceId : null);
    
    // Scroll to the expanded card
    if (shouldExpand) {
      const expandedIndex = choices.findIndex(c => c.id === choiceId);
      if (expandedIndex !== -1) {
        carouselRef.current?.scrollToIndex(expandedIndex);
      }
    }
  };

  const handleIndicatorClick = (index) => {
    carouselRef.current?.scrollToIndex(index);
  };

  return (
    <TwoColumnLayout>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack}>
        <div className="checkpoint-selection">
          {/* Image on left panel */}
          <div className="checkpoint-selection__image">
            <img src={image1} alt="Question illustration" />
          </div>
          
          <div className="checkpoint-selection__header">
            {checkpointLabel && <span className="checkpoint-selection__checkpoint">{checkpointLabel}</span>}
            {subtitle && <span className="checkpoint-selection__subtitle">{subtitle}</span>}
            <h1 className="checkpoint-selection__title">{title || "What concerns, issues, and challenges might you be facing?"}</h1>
            {instruction && <p className="checkpoint-selection__instruction">{instruction}</p>}
          </div>
        </div>
      </QuestionPanel>

      <ContentPanel>
        <div className="checkpoint-selection__content">
          {/* Mobile/Tablet header - shown only on smaller screens */}
          <div className="checkpoint-selection__mobile-header">
            <div className="checkpoint-selection__mobile-image">
              <img src={image1} alt="Question illustration" />
            </div>
            <div className="checkpoint-selection__mobile-info">
              {checkpointLabel && subtitle && (
                <span className="checkpoint-selection__mobile-label">
                  {checkpointLabel}: {subtitle}
                </span>
              )}
              <h2 className="checkpoint-selection__mobile-title">
                {title || "What concerns, issues, and challenges might you be facing?"}
              </h2>
              {instruction && (
                <p className="checkpoint-selection__mobile-instruction">{instruction}</p>
              )}
            </div>
          </div>

          <div className={`checkpoint-selection__choices ${layout === 'vertical' ? 'checkpoint-selection__choices--vertical' : ''}`}>
              <ChoiceCarousel
                ref={carouselRef}
                choices={choices}
                selectedChoices={selectedChoices}
                onSelect={handleSelect}
                onIndexChange={setActiveCardIndex}
                expandedCardId={expandedCardId}
                onExpandChange={handleExpandChange}
                layout={layout}
                isQ2={isQ2}
                isQ3={isQ3}
              />
          </div>
          
          {/* Carousel indicators above buttons - only for horizontal layout */}
          {layout === 'horizontal' && (
            <div className="checkpoint-selection__indicators">
              <CarouselIndicator 
                total={choices.length || 4} 
                active={activeCardIndex} 
                onClick={handleIndicatorClick}
                variant="bars"
                showCounter={false}
              />
            </div>
          )}
          
          <div className="checkpoint-selection__actions">
            <PrimaryButton onClick={handleContinue} fullWidth disabled={selectedChoices.length === 0}>
              Continue
              <span className="checkpoint-selection__arrow">→</span>
            </PrimaryButton>
            <SecondaryButton onClick={onBack} fullWidth>
              <span className="checkpoint-selection__back-arrow">←</span>
              Go Back
            </SecondaryButton>
          </div>
        </div>
      </ContentPanel>
    </TwoColumnLayout>
  );
};

export default CheckpointSelection;
