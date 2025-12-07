import React, { useState, useRef, useEffect } from 'react';
import './FullSummary.css';
import { PrimaryButton, SecondaryButton } from '../../common/Button';

// PDF Icon
const PdfIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H14C14.5304 18 15.0391 17.7893 15.4142 17.4142C15.7893 17.0391 16 16.5304 16 16V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2V6H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 13H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Arrow Up/Down Icon
const ArrowIcon = ({ direction = 'up' }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`full-summary__arrow-icon ${direction === 'down' ? 'full-summary__arrow-icon--down' : ''}`}
  >
    <path 
      d="M18 15L12 9L6 15" 
      stroke="url(#arrowGradient)" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient id="arrowGradient" x1="6" y1="12" x2="18" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B432A3"/>
        <stop offset="1" stopColor="#AE59CF"/>
      </linearGradient>
    </defs>
  </svg>
);

// Info Icon
const InfoIcon = () => (
  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6.5" cy="6" r="5.5" stroke="url(#infoGradient)" strokeWidth="1"/>
    <path d="M6.5 5.5V8.5" stroke="url(#infoGradient)" strokeWidth="1" strokeLinecap="round"/>
    <circle cx="6.5" cy="3.5" r="0.5" fill="url(#infoGradient)"/>
    <defs>
      <linearGradient id="infoGradient" x1="0" y1="6" x2="13" y2="6" gradientUnits="userSpaceOnUse">
        <stop stopColor="#B432A3"/>
        <stop offset="1" stopColor="#AE59CF"/>
      </linearGradient>
    </defs>
  </svg>
);

// Choice Card with expandable details
const ChoiceDetailCard = ({ choice, isExpanded, onToggle, isFirst, isQ2, isQ3 }) => {
  return (
    <div className={`full-summary__choice-card ${isFirst ? 'full-summary__choice-card--first' : ''}`}>
      <h4 className="full-summary__choice-title">{choice.title}</h4>
      <div className="full-summary__choice-divider" />
      {choice.image && (
        <div className="full-summary__choice-image">
          <img src={choice.image} alt={choice.title} />
        </div>
      )}
      <p className="full-summary__choice-description">{choice.description}</p>
      {isExpanded && (
        <div className="full-summary__expanded-content">
          {/* Q1 fields */}
          {choice.whyMatters && (
            <div className="full-summary__section">
              <div className="full-summary__section-header">
                <span className="full-summary__section-title">Why this Matters</span>
                <InfoIcon />
              </div>
              <p className="full-summary__section-text">{choice.whyMatters}</p>
            </div>
          )}
          <div className="full-summary__section-divider" />
          {choice.research && (
            <div className="full-summary__section">
              <div className="full-summary__section-header">
                <span className="full-summary__section-title">Research Evidence</span>
                <InfoIcon />
              </div>
              <p className="full-summary__section-text">{choice.research}</p>
            </div>
          )}
          <div className="full-summary__section-divider" />
          {choice.impact && (
            <div className="full-summary__section">
              <div className="full-summary__section-header">
                <span className="full-summary__section-title">Decision Impact</span>
                <InfoIcon />
              </div>
              <p className="full-summary__section-text">{choice.impact}</p>
            </div>
          )}
          {/* Q2 fields */}
          {isQ2 && (
            <>
              {choice.whatYouAreFightingFor && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">What You're Fighting For</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.whatYouAreFightingFor}</p>
                </div>
              )}
              {choice.cooperativeLearning && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">Cooperative Learning</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.cooperativeLearning}</p>
                </div>
              )}
              {choice.barriersToAccess && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">Barriers to Access</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.barriersToAccess}</p>
                </div>
              )}
            </>
          )}
          {/* Q3 fields */}
          {isQ3 && (
            <>
              {choice.careTeamAffirmation && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">Care Team Affirmation</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.careTeamAffirmation}</p>
                </div>
              )}
              {choice.interdependencyAtWork && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">Interdependency at Work</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.interdependencyAtWork}</p>
                </div>
              )}
              {choice.reflectionGuidance && (
                <div className="full-summary__section">
                  <div className="full-summary__section-header">
                    <span className="full-summary__section-title">Reflection Guidance</span>
                    <InfoIcon />
                  </div>
                  <p className="full-summary__section-text">{choice.reflectionGuidance}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <button className="full-summary__toggle-btn" onClick={onToggle}>
        <span className="full-summary__toggle-text">{isExpanded ? 'See Less' : 'Expand'}</span>
        <ArrowIcon direction={isExpanded ? 'up' : 'down'} />
      </button>
    </div>
  );
};

// Team Card Component
const TeamCard = ({ title, subtitle, team, showOutline = false }) => (
  <div className="full-summary__team-card">
    <h4 className="full-summary__team-title">{title}</h4>
    {subtitle && <p className="full-summary__team-subtitle">{subtitle}</p>}
    <div className="full-summary__team-avatars">
      {team.map((member, index) => (
        <img
          key={member.id}
          src={member.avatar}
          alt={member.name}
          className={`full-summary__team-avatar ${member.affirmed === false ? 'full-summary__team-avatar--gray' : ''} ${showOutline && index === 0 ? 'full-summary__team-avatar--outlined' : ''}`}
        />
      ))}
    </div>
  </div>
);

// Combined Team Card for Q3 - has both sections in one card
const CombinedTeamCard = ({ team, affirmationTeam }) => (
  <div className="full-summary__team-card full-summary__team-card--combined">
    {/* Care Team members section */}
    <h4 className="full-summary__team-title full-summary__team-title--blue">
      Care Team members who picked<br />the same choice as you
    </h4>
    <div className="full-summary__team-avatars">
      {team.map((member, index) => (
        <img
          key={member.id}
          src={member.avatar}
          alt={member.name}
          className={`full-summary__team-avatar ${index === 0 ? 'full-summary__team-avatar--outlined' : ''}`}
        />
      ))}
    </div>

    {/* Affirmation section */}
    <h4 className="full-summary__team-title full-summary__team-title--blue full-summary__team-title--affirmation">
      Who has affirmed their commitment
    </h4>
    <p className="full-summary__team-subtitle">
      Colored profiles indicate affirmation. Gray profiles indicate no affirmation yet.
    </p>
    <div className="full-summary__team-avatars">
      {affirmationTeam.map((member, index) => (
        <img
          key={member.id}
          src={member.avatar}
          alt={member.name}
          className={`full-summary__team-avatar ${member.affirmed === false ? 'full-summary__team-avatar--gray' : ''} ${member.affirmed && index === 0 ? 'full-summary__team-avatar--outlined' : ''}`}
        />
      ))}
    </div>
  </div>
);

const FullSummary = ({
  userName = "Norman",
  reflections = [],
  team = [],
  onContinue,
  onBack
}) => {
  const [expandedCards, setExpandedCards] = useState({});
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('full-summary--visible');
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll('.full-summary__animate');
    animatableElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleCard = (reflectionId, choiceId) => {
    const key = `${reflectionId}-${choiceId}`;
    setExpandedCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Export to PDF using browser print
  const handleExportPdf = async () => {
    setIsExporting(true);

    // Add print-specific class for styling
    document.body.classList.add('printing-pdf');

    // Use browser's print functionality
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-pdf');
      setIsExporting(false);
    }, 100);
  };

  // Default reflections data
  const defaultReflections = [
    {
      id: 1,
      label: "Checkpoint 1:",
      question: "How important is staying alive even if you have substantial physical limitations?",
      choices: [
        {
          id: 1,
          title: "Life extension is very important regardless of function",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
          description: "Life is sacred to me - every moment matters regardless of what I can or can't do. Keep fighting for me with every tool available.",
          whyMatters: "Shapes all treatment escalation decisions - ICU admission, ventilation, dialysis, CPR. Difficult because 82.4% physicians underestimate disability quality of life despite 54.3% self-reports of good QOL, 'futility' determinations can override explicit directives via ethics committee, and surrogates face 33-35% PTSD rates during months-long advocacy.",
          research: "Preference stability: 35-49% show inconsistent preference trajectories depending on scenario (Fried 2007). Surrogate accuracy: predict wishes correctly 68% of time (Shalowitz 2006). 70.3% lack capacity when decisions needed. Family conflict: 57% disagree about goals. Time pressure: median 72 hours for critical decisions. Interpretation burden creates 35% PTSD in decision-makers.",
          impact: "You'll receive maximum intervention including ventilators, dialysis, feeding tubes, CPR, and medications regardless of prognosis. ICU stays average 7-14 days but can extend to months. This maximizes survival time and preserves possibility of recovery or new treatments. However, you may undergo multiple invasive procedures and experience extension of dying process."
        }
      ]
    },
    {
      id: 2,
      label: "Reflection 2:",
      question: "What concerns, issues, and challenges might you be facing?",
      choices: [
        {
          id: 1,
          title: "Worried doctors might undervalue my life with disability",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
          description: "What terrifies me is providers deciding my disabled life isn't worth saving—it happens. Don't let anyone's inability to imagine my life become a death sentence. My quality of life is mine to assess, not theirs to judge. I'm living proof adaptation is real. Protect me from their biases. See me as I am, not as they fear being.",
          whatYouAreFightingFor: "Recognition that disability does not diminish the value of life. Research shows 82.4% of physicians underestimate quality of life for people with disabilities, while 54.3% of those living with serious disabilities report good quality of life.",
          cooperativeLearning: "Share your lived experience with your care team. Help them understand that adaptation is real and that quality of life assessments should come from you, not assumptions based on able-bodied perspectives.",
          barriersToAccess: "Implicit bias in medical decision-making, lack of disability competency training among healthcare providers, and systemic assumptions that equate disability with suffering or diminished worth."
        },
        {
          id: 2,
          title: "Worried doctors might undervalue my life with disability",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
          description: "What terrifies me is providers deciding my disabled life isn't worth saving—it happens. Don't let anyone's inability to imagine my life become a death sentence. My quality of life is mine to assess, not theirs to judge. I'm living proof adaptation is real. Protect me from their biases. See me as I am, not as they fear being.",
          whatYouAreFightingFor: "Recognition that disability does not diminish the value of life. Research shows 82.4% of physicians underestimate quality of life for people with disabilities, while 54.3% of those living with serious disabilities report good quality of life.",
          cooperativeLearning: "Share your lived experience with your care team. Help them understand that adaptation is real and that quality of life assessments should come from you, not assumptions based on able-bodied perspectives.",
          barriersToAccess: "Implicit bias in medical decision-making, lack of disability competency training among healthcare providers, and systemic assumptions that equate disability with suffering or diminished worth."
        }
      ]
    },
    {
      id: 3,
      label: "Reflection 3:",
      question: "What would make you change your mind?",
      choices: [
        {
          id: 1,
          title: "Worried doctors might undervalue my life with disability",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
          description: "I've spent my whole life believing wheelchair users, ventilator-dependent people, those who can't speak—that they must be miserable. But what if I'm wrong? What if my terror of disability is based on ignorance, not reality? Maybe people adapt, find joy, create meaning in ways I can't imagine from this able-bodied perspective. If 54.3% with serious disabilities report good quality of life, maybe my assumptions are the problem.",
          careTeamAffirmation: "Your care team is here to support your evolving understanding. Acknowledging uncertainty about disability is a sign of growth and openness to learning from those with lived experience.",
          interdependencyAtWork: "Connect with disability advocates and people living with conditions you fear. Their perspectives can challenge assumptions and reveal possibilities you haven't considered. Interdependency means learning from each other.",
          reflectionGuidance: "Consider: What specific disabilities frighten you most? Have you spoken with anyone living with those conditions? What would it mean to discover your fears were based on misconceptions rather than reality?"
        }
      ]
    }
  ];

  const displayReflections = reflections.length > 0 ? reflections : defaultReflections;

  // Default team members
  const defaultTeam = [
    { id: 1, name: "Dr. Sarah", avatar: "https://i.pravatar.cc/82?img=1", affirmed: true },
    { id: 2, name: "John", avatar: "https://i.pravatar.cc/82?img=2", affirmed: true },
    { id: 3, name: "Mary", avatar: "https://i.pravatar.cc/82?img=3", affirmed: true },
    { id: 4, name: "James", avatar: "https://i.pravatar.cc/82?img=4", affirmed: false },
    { id: 5, name: "Lisa", avatar: "https://i.pravatar.cc/82?img=5", affirmed: false }
  ];

  const displayTeam = team.length > 0 ? team : defaultTeam;

  return (
    <div className="full-summary" ref={contentRef}>
      {/* Header */}
      <header className="full-summary__header full-summary__animate">
        <span className="full-summary__header-label">Advance Care Planning</span>
        <h2 className="full-summary__header-title">Full Summary of {userName}'s Decisions for Q10A</h2>
        <div className="full-summary__header-divider" />
        {/* Export to PDF Button */}
        <button
          className="full-summary__export-btn"
          onClick={handleExportPdf}
          disabled={isExporting}
          aria-label="Export to PDF"
        >
          <PdfIcon />
          <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="full-summary__content">
        {displayReflections.map((reflection, reflectionIndex) => (
          <div key={reflection.id} className="full-summary__reflection full-summary__animate">
            {reflectionIndex > 0 && <div className="full-summary__reflection-divider" />}

            <div className="full-summary__reflection-header">
              <span className="full-summary__reflection-label">{reflection.label}</span>
              <h3 className="full-summary__reflection-question">{reflection.question}</h3>
              <span className="full-summary__reflection-subtitle">{userName} chose the following options:</span>
            </div>

            {/* Choices with aligned team cards */}
              <div className="full-summary__choices-container">
                {reflection.choices.map((choice, choiceIndex) => {
                  // Determine which reflection/question this is
                  const isQ2 = reflection.question && reflection.question.toLowerCase().includes('challenges');
                  const isQ3 = reflection.question && reflection.question.toLowerCase().includes('change your mind');
                  return (
                    <div key={choice.id} className="full-summary__choice-row full-summary__animate">
                      {/* Choice Card */}
                      <div className="full-summary__choice-col">
                        <ChoiceDetailCard
                          choice={choice}
                          isExpanded={expandedCards[`${reflection.id}-${choice.id}`] || false}
                          onToggle={() => toggleCard(reflection.id, choice.id)}
                          isFirst={reflectionIndex === 0 && choiceIndex === 0}
                          isQ2={isQ2}
                          isQ3={isQ3}
                        />
                      </div>
                      {/* Team Card - aligned with this choice */}
                      <div className="full-summary__team-col">
                        {/* For last reflection (Q3), show combined card with both sections */}
                        {reflectionIndex === displayReflections.length - 1 ? (
                          <CombinedTeamCard
                            team={displayTeam.filter(m => m.affirmed !== false).slice(0, 5)}
                            affirmationTeam={displayTeam}
                          />
                        ) : (
                          <TeamCard
                            title="Care Team members who picked the same choice as you"
                            team={displayTeam.filter(m => m.affirmed !== false).slice(0, 5)}
                            showOutline={true}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="full-summary__actions">
        <PrimaryButton onClick={onContinue} fullWidth>
          Continue to Team Visibility
          <span className="full-summary__btn-arrow">→</span>
        </PrimaryButton>
        <SecondaryButton onClick={onBack} fullWidth>
          <span className="full-summary__btn-back-arrow">←</span>
          Back to Summary
        </SecondaryButton>
      </div>
    </div>
  );
};

export default FullSummary;