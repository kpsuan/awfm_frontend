import { useState, useEffect } from 'react';
import './MentalHealthCheck.css';
import { PrimaryButton, SecondaryButton } from '../../common/Button';

// Reflection Moment Component - Gentle thank you with floating particles
const ReflectionMoment = () => {
  const [showElements, setShowElements] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setShowElements(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate more floating particles with varied properties
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: 6 + Math.random() * 14,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
    opacity: 0.4 + Math.random() * 0.5
  }));

  // Generate sparkles around the heart
  const sparkles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    distance: 70 + Math.random() * 30,
    size: 3 + Math.random() * 4,
    delay: Math.random() * 2
  }));

  return (
    <div className="reflection-moment">
      {/* Floating particles */}
      <div className="reflection-moment__particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="reflection-moment__particle"
            style={{
              '--size': `${p.size}px`,
              '--left': `${p.left}%`,
              '--delay': `${p.delay}s`,
              '--duration': `${p.duration}s`,
              '--opacity': p.opacity
            }}
          />
        ))}
      </div>

      {/* Soft rings - behind everything */}
      <div className="reflection-moment__rings">
        <div className="reflection-moment__ring reflection-moment__ring--1" />
        <div className="reflection-moment__ring reflection-moment__ring--2" />
        <div className="reflection-moment__ring reflection-moment__ring--3" />
        <div className="reflection-moment__ring reflection-moment__ring--4" />
      </div>

      {/* Central illustration - gentle hands holding heart */}
      <div className={`reflection-moment__illustration ${showElements ? 'reflection-moment__illustration--visible' : ''}`}>
        <div className="reflection-moment__glow" />
        <div className="reflection-moment__glow reflection-moment__glow--secondary" />

        {/* Sparkles around the heart */}
        <div className="reflection-moment__sparkles">
          {sparkles.map(s => (
            <div
              key={s.id}
              className="reflection-moment__sparkle"
              style={{
                '--angle': `${s.angle}deg`,
                '--distance': `${s.distance}px`,
                '--size': `${s.size}px`,
                '--delay': `${s.delay}s`
              }}
            />
          ))}
        </div>

        <div className="reflection-moment__icon-container">
          <svg viewBox="0 0 80 80" fill="none" className="reflection-moment__icon">
            {/* Gentle heart shape */}
            <path
              d="M40 70C40 70 10 50 10 30C10 20 18 12 28 12C34 12 38 16 40 20C42 16 46 12 52 12C62 12 70 20 70 30C70 50 40 70 40 70Z"
              fill="url(#heartGradient)"
              className="reflection-moment__heart"
            />
            {/* Gentle hands cradling */}
            <path
              d="M20 55C15 50 12 45 12 40C12 38 14 36 16 36C18 36 20 38 22 40L28 46"
              stroke="url(#handGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="reflection-moment__hand reflection-moment__hand--left"
            />
            <path
              d="M60 55C65 50 68 45 68 40C68 38 66 36 64 36C62 36 60 38 58 40L52 46"
              stroke="url(#handGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              className="reflection-moment__hand reflection-moment__hand--right"
            />
            <defs>
              <linearGradient id="heartGradient" x1="40" y1="12" x2="40" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E879F9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="handGradient" x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Thank you message */}
      <div className={`reflection-moment__message ${showElements ? 'reflection-moment__message--visible' : ''}`}>
        <p className="reflection-moment__text">Thank you for sharing</p>
        <p className="reflection-moment__subtext">Your voice matters</p>
      </div>
    </div>
  );
};

// Grounding Exercise Component - 5-4-3-2-1 Senses
const GroundingExercise = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tappedItems, setTappedItems] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { count: 5, sense: 'see', icon: '👁️', prompt: 'things you can see', color: '#5C40FB' },
    { count: 4, sense: 'touch', icon: '✋', prompt: 'things you can touch', color: '#7C3AED' },
    { count: 3, sense: 'hear', icon: '👂', prompt: 'things you can hear', color: '#9333EA' },
    { count: 2, sense: 'smell', icon: '👃', prompt: 'things you can smell', color: '#C026D3' },
    { count: 1, sense: 'taste', icon: '👅', prompt: 'thing you can taste', color: '#F23B8B' }
  ];

  const currentStepData = steps[currentStep];
  const requiredTaps = currentStepData?.count || 0;

  const handleTap = () => {
    if (isComplete) return;

    const newTappedItems = [...tappedItems, tappedItems.length];
    setTappedItems(newTappedItems);

    if (newTappedItems.length >= requiredTaps) {
      // Move to next step after a brief delay
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setTappedItems([]);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      }, 400);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setTappedItems([]);
    setIsComplete(false);
  };

  // Calculate overall progress
  const totalItems = steps.reduce((sum, s) => sum + s.count, 0);
  const completedItems = steps.slice(0, currentStep).reduce((sum, s) => sum + s.count, 0) + tappedItems.length;
  const progressPercent = (completedItems / totalItems) * 100;

  return (
    <div className="grounding-exercise">
      {/* Progress bar */}
      <div className="grounding-exercise__progress">
        <div
          className="grounding-exercise__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main interaction area */}
      <div className="grounding-exercise__container">
        {isComplete ? (
          <div className="grounding-exercise__complete">
            <div className="grounding-exercise__complete-icon">✨</div>
            <p className="grounding-exercise__complete-text">You're grounded!</p>
          </div>
        ) : (
          <>
            {/* Current sense icon */}
            <div
              className="grounding-exercise__sense-icon"
              style={{ background: `linear-gradient(135deg, ${currentStepData.color} 0%, ${steps[Math.min(currentStep + 1, steps.length - 1)].color} 100%)` }}
            >
              <span>{currentStepData.icon}</span>
            </div>

            {/* Prompt */}
            <p className="grounding-exercise__prompt">
              Notice <strong>{requiredTaps - tappedItems.length}</strong> {currentStepData.prompt}
            </p>

            {/* Tap circles */}
            <div className="grounding-exercise__circles">
              {Array.from({ length: requiredTaps }).map((_, idx) => (
                <button
                  key={idx}
                  className={`grounding-exercise__circle ${tappedItems.includes(idx) ? 'grounding-exercise__circle--tapped' : ''}`}
                  onClick={handleTap}
                  disabled={tappedItems.includes(idx)}
                  style={{
                    '--delay': `${idx * 0.1}s`,
                    borderColor: tappedItems.includes(idx) ? currentStepData.color : 'rgba(92, 64, 251, 0.3)'
                  }}
                >
                  {tappedItems.includes(idx) && (
                    <svg viewBox="0 0 24 24" fill="none" className="grounding-exercise__check">
                      <path d="M5 13l4 4L19 7" stroke={currentStepData.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Step indicator */}
            <div className="grounding-exercise__steps">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`grounding-exercise__step ${idx === currentStep ? 'grounding-exercise__step--active' : ''} ${idx < currentStep ? 'grounding-exercise__step--done' : ''}`}
                >
                  {step.count}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="grounding-exercise__footer">
        {isComplete ? (
          <button className="grounding-exercise__restart" onClick={handleRestart}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Do it again
          </button>
        ) : (
          <p className="grounding-exercise__instruction">
            Tap a circle each time you notice something
          </p>
        )}
      </div>
    </div>
  );
};

// Breathing Exercise Component with improved animations
const BreathingExercise = ({ duration = 24, onComplete }) => {
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale'
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cycleTime, setCycleTime] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
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
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });

      setCycleTime(prev => {
        const newTime = (prev + 1) % CYCLE_DURATION;

        // Determine phase and phase time
        if (newTime < INHALE_DURATION) {
          setPhase('inhale');
          setPhaseTime(newTime);
        } else if (newTime < INHALE_DURATION + HOLD_DURATION) {
          setPhase('hold');
          setPhaseTime(newTime - INHALE_DURATION);
        } else {
          setPhase('exhale');
          setPhaseTime(newTime - INHALE_DURATION - HOLD_DURATION);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, onComplete]);

  const getPhaseText = () => {
    if (isComplete) return 'Well Done!';
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Breathe';
    }
  };

  const getPhaseCountdown = () => {
    switch (phase) {
      case 'inhale': return INHALE_DURATION - phaseTime;
      case 'hold': return HOLD_DURATION - phaseTime;
      case 'exhale': return EXHALE_DURATION - phaseTime;
      default: return 0;
    }
  };

  const getScale = () => {
    if (isComplete) return 1;
    switch (phase) {
      case 'inhale':
        return 1 + (phaseTime / INHALE_DURATION) * 0.2;
      case 'hold':
        return 1.2;
      case 'exhale':
        return 1.2 - (phaseTime / EXHALE_DURATION) * 0.2;
      default:
        return 1;
    }
  };

  // Calculate progress percentage for the ring
  const progressPercent = ((duration - timeLeft) / duration) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleRestart = () => {
    setTimeLeft(duration);
    setCycleTime(0);
    setPhaseTime(0);
    setPhase('inhale');
    setIsComplete(false);
  };

  return (
    <div className="breathing-exercise">
      <div className="breathing-exercise__container">
        {/* Progress ring */}
        <svg className="breathing-exercise__progress-ring" viewBox="0 0 200 200">
          <circle
            className="breathing-exercise__progress-bg"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            strokeWidth="4"
          />
          <circle
            className="breathing-exercise__progress-bar"
            cx="100"
            cy="100"
            r="90"
            fill="none"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Breathing circle */}
        <div
          className={`breathing-exercise__circle breathing-exercise__circle--${phase} ${isComplete ? 'breathing-exercise__circle--complete' : ''}`}
          style={{ transform: `scale(${getScale()})` }}
        >
          {/* Ripple effects */}
          {!isComplete && (
            <>
              <div className={`breathing-exercise__ripple breathing-exercise__ripple--${phase}`} />
              <div className={`breathing-exercise__ripple breathing-exercise__ripple--${phase} breathing-exercise__ripple--delayed`} />
            </>
          )}

          <div className="breathing-exercise__inner">
            {isComplete ? (
              <div className="breathing-exercise__complete-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <>
                <span className="breathing-exercise__phase">{getPhaseText()}</span>
                <span className="breathing-exercise__countdown">{getPhaseCountdown()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instructions and controls */}
      <div className="breathing-exercise__footer">
        {isComplete ? (
          <div className="breathing-exercise__complete-message">
            <p className="breathing-exercise__instruction">Great job! You completed the exercise.</p>
            <button className="breathing-exercise__restart" onClick={handleRestart}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Do it again
            </button>
          </div>
        ) : (
          <>
            <p className="breathing-exercise__instruction">
              Follow the circle and breathe slowly
            </p>
            <div className="breathing-exercise__timer">
              <span className="breathing-exercise__timer-label">Time remaining</span>
              <span className="breathing-exercise__timer-value">{timeLeft}s</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Encouragement messages for different variants
const encouragementMessages = {
  'doing-great': [
    "You're making great progress on something important.",
    "Taking time to plan ahead shows real care for your loved ones.",
    "Remember: there are no wrong answers here."
  ],
  'almost-there': [
    "You're doing the hard work now so others don't have to guess later.",
    "It's okay if you don't have all the answers today.",
    "Your thoughts and feelings about this matter."
  ],
  'take-break': [
    "You've completed something meaningful today.",
    "These conversations get easier with time.",
    "Come back whenever you're ready - your progress is saved."
  ]
};

const MentalHealthCheck = ({
  question,
  progress = { current: 1, total: 4 },
  onContinue,
  onBack,
  onBackHome,
  variant = 'doing-great' // 'doing-great', 'almost-there', 'take-break'
}) => {
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [encouragementMessage, setEncouragementMessage] = useState('');

  // Get content based on variant
  const getContent = () => {
    switch (variant) {
      case 'almost-there':
        return {
          heading: 'Ground Yourself',
          description: "Let's take a moment to reconnect with the present. Notice what's around you right now.",
          encouragement: encouragementMessages['almost-there'],
          exercise: 'grounding'
        };
      case 'take-break':
        return {
          heading: 'Well Done!',
          description: "You've completed all three layers. Take pride in the thoughtful work you've done today.",
          encouragement: encouragementMessages['take-break'],
          exercise: 'reflection'
        };
      case 'doing-great':
      default:
        return {
          heading: "You're Doing Great!",
          description: "Take a moment to breathe. These are big decisions, and you're handling them thoughtfully.",
          encouragement: encouragementMessages['doing-great'],
          exercise: 'breathing'
        };
    }
  };

  const content = getContent();

  // Show encouragement after a delay
  useEffect(() => {
    const messages = content.encouragement;
    setEncouragementMessage(messages[Math.floor(Math.random() * messages.length)]);

    const timer = setTimeout(() => {
      setShowEncouragement(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [content.encouragement]);

  return (
    <div className="mental-health-check">
      {/* Subtle background gradient */}
      <div className="mental-health-check__bg" />

      {/* Back button */}
      <button className="mental-health-check__back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Main content - centered */}
      <div className="mental-health-check__container">
        {/* Heading */}
        <h1 className="mental-health-check__heading">{content.heading}</h1>

        {/* Description */}
        <p className="mental-health-check__description">{content.description}</p>

        {/* Exercise - Hero element */}
        <div className="mental-health-check__exercise">
          {content.exercise === 'grounding' ? (
            <GroundingExercise />
          ) : content.exercise === 'reflection' ? (
            <ReflectionMoment />
          ) : (
            <BreathingExercise duration={24} />
          )}
        </div>

        {/* Encouragement message - fades in */}
        <div className={`mental-health-check__encouragement ${showEncouragement ? 'mental-health-check__encouragement--visible' : ''}`}>
          <span className="mental-health-check__encouragement-icon">💜</span>
          <p className="mental-health-check__encouragement-text">{encouragementMessage}</p>
        </div>

        {/* Actions */}
        <div className="mental-health-check__actions">
          <PrimaryButton onClick={onContinue} fullWidth>
            {variant === 'take-break' ? "View Summary" : "I'm Ready to Continue"}
            <span className="mental-health-check__arrow">→</span>
          </PrimaryButton>
          <SecondaryButton onClick={onBackHome} fullWidth>
            <span className="mental-health-check__back-arrow">←</span>
            {variant === 'take-break' ? "Save & Exit" : "Take a Break"}
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthCheck;
