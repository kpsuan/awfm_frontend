import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './Choices.css';
import { ChoiceCard, FlipChoiceCard } from '../../common/Card';

const ChoiceCarousel = forwardRef(({
  choices = [],
  selectedChoices = [],
  onSelect,
  onIndexChange,
  expandedCardId = null,
  onExpandChange, // callback when card expand state changes
  onOpenModal, // callback to open modal with choice details (tablet+)
  layout = 'horizontal' // 'vertical' for scrolling list, 'horizontal' for carousel
  , isQ2 = false, isQ3 = false
}, ref) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardVersion, setCardVersion] = useState('v1'); // 'v1' = ChoiceCard, 'v2' = FlipChoiceCard

  const CardComponent = cardVersion === 'v1' ? ChoiceCard : FlipChoiceCard;

  // Expose scrollToIndex to parent
  useImperativeHandle(ref, () => ({
    scrollToIndex: (index) => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const cardWidth = carousel.firstChild?.offsetWidth || 0;
      const gap = 16;
      carousel.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth'
      });
      setActiveIndex(index);
      onIndexChange?.(index);
    }
  }));

  useEffect(() => {
    if (layout !== 'horizontal') return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.firstChild?.offsetWidth || 0;
      const gap = 16;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      const newIndex = Math.min(Math.max(0, index), choices.length - 1);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        onIndexChange?.(newIndex);
      }
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, [choices.length, layout, activeIndex, onIndexChange]);

  // Version toggle component
  const VersionToggle = () => (
    <div className="choice-version-toggle">
      <button
        className={`choice-version-toggle__btn ${cardVersion === 'v1' ? 'choice-version-toggle__btn--active' : ''}`}
        onClick={() => setCardVersion('v1')}
      >
        V1
      </button>
      <button
        className={`choice-version-toggle__btn ${cardVersion === 'v2' ? 'choice-version-toggle__btn--active' : ''}`}
        onClick={() => setCardVersion('v2')}
      >
        V2
      </button>
    </div>
  );

  if (layout === 'vertical') {
    return (
      <div className="choice-carousel-container">
        <VersionToggle />
        <div className="choice-list">
          {choices.map((choice) => (
            <CardComponent
              key={choice.id}
              choice={choice}
              isSelected={selectedChoices.includes(choice.id)}
              isExpanded={expandedCardId === choice.id}
              onSelect={onSelect}
              onExpand={onExpandChange}
              onOpenModal={() => onOpenModal?.(choice)}
              isQ2={isQ2}
              isQ3={isQ3}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="choice-carousel-container">
      <VersionToggle />
      <div
        ref={carouselRef}
        className="choice-list choice-list--horizontal hide-scrollbar"
      >
        {choices.map((choice) => (
          <CardComponent
            key={choice.id}
            choice={choice}
            isSelected={selectedChoices.includes(choice.id)}
            isExpanded={expandedCardId === choice.id}
            onSelect={onSelect}
            onExpand={onExpandChange}
            onOpenModal={() => onOpenModal?.(choice)}
            isQ2={isQ2}
            isQ3={isQ3}
          />
        ))}
      </div>
    </div>
  );
});

export default ChoiceCarousel;
