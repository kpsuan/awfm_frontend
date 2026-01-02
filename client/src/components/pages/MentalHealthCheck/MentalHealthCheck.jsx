import { useState, useEffect } from 'react';
import './MentalHealthCheck.css';
import { TwoColumnLayout, QuestionPanel, ContentPanel } from '../../layout';
import { PrimaryButton, SecondaryButton } from '../../common/Button';
import image1 from '../../../styles/image1.png';
import logo from '../../../styles/logo.png';
import thanksImg from '../../../styles/thanks.png';

// Breathing Exercise Component
const BreathingExercise = ({ duration = 24 }) => {
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cycleTime, setCycleTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Each breath cycle: 4s inhale, 4s hold, 4s exhale = 12s total
  const INHALE_DURATION = 4;
  const HOLD_DURATION = 4;
  const EXHALE_DURATION = 4;
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });

      setCycleTime(prev => {
        const newTime = (prev + 1) % CYCLE_DURATION;

        // Determine phase based on cycle time
        if (newTime < INHALE_DURATION) {
          setPhase('inhale');
        } else if (newTime < INHALE_DURATION + HOLD_DURATION) {
          setPhase('hold');
        } else {
          setPhase('exhale');
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  const getPhaseText = () => {
    if (isComplete) return 'Great job!';
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Breathe';
    }
  };

  const getScale = () => {
    if (isComplete) return 1;
    switch (phase) {
      case 'inhale': return 1.15;
      case 'hold': return 1.15;
      case 'exhale': return 1;
      default: return 1;
    }
  };

  return (
    <div className="breathing-exercise">
      <div
        className={`breathing-exercise__circle breathing-exercise__circle--${phase} ${isComplete ? 'breathing-exercise__circle--complete' : ''}`}
        style={{ transform: `scale(${getScale()})` }}
      >
        <div className="breathing-exercise__inner">
          <span className="breathing-exercise__phase">{getPhaseText()}</span>
          {!isComplete && (
            <span className="breathing-exercise__timer">{timeLeft}s</span>
          )}
        </div>
      </div>
      {!isComplete && (
        <p className="breathing-exercise__instruction">
          Follow the circle and breathe slowly
        </p>
      )}
    </div>
  );
};

const MentalHealthCheck = ({ 
  question,
  progress = { current: 1, total: 4 },
  onContinue,
  onBack,
  onBackHome,
  variant = 'doing-great' // 'doing-great', 'almost-there', 'take-break'
}) => {
  const { title, subtitle, sectionLabel, checkpointLabel } = question || {
    title: "How important is staying alive even if you have substantial physical limitations?",
    subtitle: "Question 10 A",
    sectionLabel: "Advance Care Planning",
    checkpointLabel: ""
  };

  // Get content based on variant
  const getContent = () => {
    switch (variant) {
      case 'almost-there':
        return {
          sectionLabel: 'Advance Care Planning',
          reflectionLabel: 'Q10A Layer 2',
          heading: 'Almost There...',
          description: 'We know this may feel like a lot. Breathe and give yourself space to process. You can continue whenever you\'re ready.'
        };
      case 'take-break':
        return {
          sectionLabel: 'Advance Care Planning',
          reflectionLabel: 'Q10A Layer 3',
          heading: 'Take a Break',
          description: 'It\'s okay to pause. These are important decisions. Come back when you feel ready to continue.'
        };
      case 'doing-great':
      default:
        return {
          sectionLabel: 'Advance Care Planning',
          reflectionLabel: 'Q10A Layer 1',
          heading: 'You\'re Doing Great!',
          description: 'We know this may feel like a lot. Breathe and give yourself space to process. You can continue whenever you\'re ready.'
        };
    }
  };

  const content = getContent();

  return (
    <TwoColumnLayout>
      <QuestionPanel progress={progress} showBack={true} onBack={onBack} hideProgress={true}>
              <div className="main-screen__left">
                <div className="main-screen__icon">
                  <div className="main-screen__icon-outer">
                    <div className="main-screen__icon-inner">
                      <img src={logo} alt="AWFM Logo" className="main-screen__logo-img" />
                    </div>
                  </div>
                </div>
                
                <div className="main-screen__question-info">
                  <span className="main-screen__section-label">{sectionLabel || "Advance Care Planning"}</span>
                  <span className="main-screen__question-number">{subtitle || "Question 10 A"}</span>
                  <h1 className="main-screen__question-title">{title}</h1>
                </div>
              </div>
        </QuestionPanel>

      <ContentPanel>
        <div className="mental-health-check__content">
          {/* Mobile/Tablet header - shown only on smaller screens */}
          <div className="mental-health-check__mobile-header">
            <div className="mental-health-check__mobile-image">
              <img src={image1} alt="Question illustration" />
            </div>
            <div className="mental-health-check__mobile-info">
              {checkpointLabel && subtitle && (
                <span className="mental-health-check__mobile-label">
                  {checkpointLabel}: {subtitle}
                </span>
              )}
              <h2 className="mental-health-check__mobile-title">
                {title || "How important is staying alive even if you have substantial physical limitations?"}
              </h2>
            </div>
          </div>

          <div className="mental-health-check__right-content">
            {/* Section labels */}
            <div className="mental-health-check__labels">
              <span className="mental-health-check__section-label">{content.sectionLabel}</span>
              <span className="mental-health-check__reflection-label">{content.reflectionLabel}</span>
            </div>

            {/* Main heading */}
            <h2 className="mental-health-check__heading">{content.heading}</h2>

            {/* Description */}
            <p className="mental-health-check__description">{content.description}</p>

            {/* Breathing Exercise or Thank You Image */}
            <div className="mental-health-check__illustration">
              {variant === 'take-break' ? (
                <img src={thanksImg} alt="Thank you" className="mental-health-check__thanks-img" />
              ) : (
                <BreathingExercise duration={24} />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mental-health-check__actions">
            <PrimaryButton onClick={onContinue} fullWidth>
              I'm Okay
              <span className="mental-health-check__arrow">→</span>
            </PrimaryButton>
            <SecondaryButton onClick={onBackHome} fullWidth>
              <span className="mental-health-check__back-arrow">←</span>
              Go Home
            </SecondaryButton>
          </div>
        </div>
      </ContentPanel>
    </TwoColumnLayout>
  );
};

export default MentalHealthCheck;
