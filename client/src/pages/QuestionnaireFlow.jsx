import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaire } from '../context';
import MainScreen from '../components/pages/MainScreen';
import QuestionIntro from '../components/pages/QuestionIntro';
import CheckpointSelection from '../components/pages/CheckpointSelection';
import ChoiceReview from '../components/pages/ChoiceReview';
import CompletionSuccess from '../components/pages/CompletionSuccess';
import MentalHealthCheck from '../components/pages/MentalHealthCheck';
import Summary from '../components/pages/Summary';
import TeamVisibilitySuccess from '../components/pages/TeamVisibilitySuccess';
import RecordVideo from '../components/pages/RecordVideo';
import RecordingComplete from '../components/pages/RecordingComplete';
import TeamRecordings from '../components/pages/TeamRecordings';
import FullSummary from '../components/pages/FullSummary';

// Flow for each question: Question -> Review -> Mental Health Check
// After all 3 questions: Summary -> Team Visibility -> Complete
const FLOW_PHASES = {
  MAIN: 'main',
  Q1_SELECTION: 'q1_selection',
  Q1_REVIEW: 'q1_review',
  Q1_MENTAL_HEALTH: 'q1_mental_health',
  Q2_SELECTION: 'q2_selection',
  Q2_REVIEW: 'q2_review',
  Q2_MENTAL_HEALTH: 'q2_mental_health',
  Q3_SELECTION: 'q3_selection',
  Q3_REVIEW: 'q3_review',
  Q3_MENTAL_HEALTH: 'q3_mental_health',
  SUMMARY: 'summary',
  TEAM_VISIBILITY: 'team_visibility',
  RECORD_VIDEO: 'record_video',
  RECORDING_COMPLETE: 'recording_complete',
  TEAM_RECORDINGS: 'team_recordings',
  MEMBER_FULL_SUMMARY: 'member_full_summary',
  COMPLETE: 'complete'
};

// localStorage key for saving progress
const STORAGE_KEY = 'awfm_questionnaire_progress';

// Helper to load saved progress from localStorage
const loadSavedProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading saved progress:', e);
  }
  return null;
};

// Helper to save progress to localStorage
const saveProgress = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

// Helper to clear saved progress
const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing progress:', e);
  }
};

const QuestionnaireFlow = () => {
  const navigate = useNavigate();
  const { state, saveResponse } = useQuestionnaire();

  // Load saved progress on initial mount
  const savedProgress = loadSavedProgress();

  const [currentPhase, setCurrentPhase] = useState(FLOW_PHASES.MAIN);
  const [q1Choices, setQ1Choices] = useState(savedProgress?.q1Choices || []);
  const [q2Choices, setQ2Choices] = useState(savedProgress?.q2Choices || []);
  const [q3Choices, setQ3Choices] = useState(savedProgress?.q3Choices || []);
  const [selectedMemberForFullSummary, setSelectedMemberForFullSummary] = useState(null);
  const [hasVisitedSummary, setHasVisitedSummary] = useState(savedProgress?.hasVisitedSummary || false);

  // Track the highest completed checkpoint for resume functionality
  const [completedCheckpoints, setCompletedCheckpoints] = useState(savedProgress?.completedCheckpoints || {
    q1: false,
    q2: false,
    q3: false
  });

  // Save progress whenever choices or completed checkpoints change
  useEffect(() => {
    saveProgress({
      q1Choices,
      q2Choices,
      q3Choices,
      completedCheckpoints,
      hasVisitedSummary
    });
  }, [q1Choices, q2Choices, q3Choices, completedCheckpoints, hasVisitedSummary]);

  // Calculate progress percentage for the "How it Works" section
  const getProgressPercentage = () => {
    let completed = 0;
    if (completedCheckpoints.q1) completed++;
    if (completedCheckpoints.q2) completed++;
    if (completedCheckpoints.q3) completed++;
    return Math.round((completed / 3) * 100);
  };

  // Check if questionnaire is complete (all 3 checkpoints done)
  const isQuestionnaireComplete = () => {
    return completedCheckpoints.q1 && completedCheckpoints.q2 && completedCheckpoints.q3;
  };

  // Check if user has started (any progress made)
  const hasStarted = () => {
    return q1Choices.length > 0 || q2Choices.length > 0 || q3Choices.length > 0;
  };

  // Get the phase to resume from
  const getResumePhase = () => {
    if (isQuestionnaireComplete()) {
      return FLOW_PHASES.SUMMARY;
    }
    if (completedCheckpoints.q2) {
      return FLOW_PHASES.Q3_SELECTION;
    }
    if (completedCheckpoints.q1) {
      return FLOW_PHASES.Q2_SELECTION;
    }
    if (q1Choices.length > 0) {
      return FLOW_PHASES.Q1_SELECTION;
    }
    return FLOW_PHASES.Q1_SELECTION;
  };

  // Calculate progress based on current phase
  const getProgress = () => {
    const phaseOrder = Object.values(FLOW_PHASES);
    const currentIndex = phaseOrder.indexOf(currentPhase);
    // Group into 4 main sections: Q1, Q2, Q3, Final
    if (currentPhase.startsWith('q1')) return { current: 1, total: 4 };
    if (currentPhase.startsWith('q2')) return { current: 2, total: 4 };
    if (currentPhase.startsWith('q3')) return { current: 3, total: 4 };
    return { current: 4, total: 4 };
  };

  // Main screen question data
  const mainScreenQuestion = {
    title: "How important is staying alive even if you have substantial physical limitations?",
    subtitle: "Question 10 A",
    sectionLabel: "Advance Care Planning"
  };

  // Mock choices for questions with full section content
  const q1ChoicesData = [
    { 
      id: 'q1_1', 
      subtitle: 'Life extension is very important regardless of function',
      title: 'Life extension is very important regardless of function',
      image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop',
      description: 'Life is sacred to me - every moment matters regardless of what I can or can\'t do. Modern medicine works miracles I can\'t predict. Keep fighting for me with every tool available. If there\'s even the smallest chance I could recover, I want that chance. Don\'t let others decide my life isn\'t worth living. Don\'t let me go until my body can\'t continue.',
      whyThisMatters: 'Shapes all treatment escalation decisions - ICU admission, ventilation, dialysis, CPR. Difficult because 82.4% physicians underestimate disability quality of life despite 54.3% self-reports of good QOL, \'futility\' determinations can override explicit directives via ethics committee, and surrogates face 33-35% PTSD rates during months-long advocacy.',
      researchEvidence: 'Albrecht & Devlieger 1999 (153 participants): 54.3% with moderate-serious disabilities report excellent/good QOL. Iezzoni 2021 (714 physicians): 82.4% underestimate disability QOL. ICU surrogate research: 33-35% PTSD at 6 months, 82% if made end-of-life decisions. ICU stays 7-14 days average, extend to months. Only 40.7% physicians confident providing equal care.',
      decisionImpact: 'You\'ll receive maximum intervention including ventilators, dialysis, feeding tubes, CPR, and medications regardless of prognosis. ICU stays average 7-14 days but can extend to months. This maximizes survival time and preserves possibility of recovery or new treatments. However, you may undergo multiple invasive procedures and experience extension of dying process.'
    },
    { 
      id: 'q1_2', 
      title: 'Staying alive somewhat important, depends on situation',
      subtitle: 'Staying alive somewhat important, depends on situation',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
      description: 'I value being alive, but not at any cost. It depends on whether I can still connect with people I love, experience some joy, maintain dignity. If I\'m suffering without hope of improvement, or if I\'ve completely lost myself, then continuing might not make sense. Help my family understand when enough is enough based on who I am, not just whether I\'m breathing.',
      whyThisMatters: 'Matters because preferences shift based on actual vs imagined experience. Difficult because \'depends\' creates interpretive burden-70.3% lack capacity when decisions needed, forcing surrogates to guess intent. Can\'t pre-specify every scenario. 35-49% show inconsistent preference trajectories. Ambiguity leads to projection of surrogate values, decision paralysis, conflict.',
      researchEvidence: 'Preference stability: 35-49% show inconsistent preference trajectories depending on scenario (Fried 2007). Surrogate accuracy: predict wishes correctly 68% of time (Shalowitz 2006). 70.3% lack capacity when decisions needed. Family conflict: 57% disagree about goals. Time pressure: median 72 hours for critical decisions. Interpretation burden creates 35% PTSD in decision-makers.',
      decisionImpact: 'You\'ll receive selective interventions based on perceived potential for meaningful recovery. This means accepting some treatments (antibiotics, IV fluids) while declining others (CPR, long-term ventilation) depending on prognosis. Your surrogates interpret what situations warrant continuing vs stopping. Benefits include avoiding unwanted prolonged dying while preserving recovery chances.'
    },
    { 
      id: 'q1_3', 
      subtitle: 'Avoid aggressive intervention if function seriously declined',
      title: 'Avoid aggressive intervention if function seriously declined',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop',
      description: 'My biggest fear isn\'t death—it\'s existing without really living. Being kept alive when I can\'t think, feel, or recognize loved ones feels like a nightmare. If I\'ve lost capacity for meaningful experience, focus on comfort and let nature take its course. I\'d rather have shorter time being fully present than prolonged time as a shell.',
      whyThisMatters: 'Clarifies limits on medical intervention when quality of life severely compromised. Difficult because \'seriously declined\' interpreted differently by family (emotional) vs medical team (clinical), creating conflict. 82.4% physicians underestimate disability quality of life, may withdraw care prematurely. Families struggle defining decline. Cultural concepts of acceptable function vary.',
      researchEvidence: 'Quality of life highly subjective. Iezzoni 2021: 82.4% physicians underestimate disabled persons\' self-reported QOL. Disability paradox: people adapt to limitations better than predicted. Comfort care doesn\'t mean "giving up"—focuses on symptom management, meaningful time. Family members often overestimate suffering, underestimate adaptation. Cultural variation in defining "good death."',
      decisionImpact: 'You\'ll avoid interventions prolonging dying process—no CPR, ventilators, dialysis when function severely declined. Focus shifts to comfort: pain management, symptom control, presence with loved ones. Timeline: death may occur in days-weeks rather than months-years. Benefits: avoiding unwanted medical intervention, maintaining comfort and dignity. Risks: earlier death if prognosis assessment wrong.'
    },

  ];

  const q2ChoicesData = [
      {
        id: 'q2_1',
        subtitle: 'Worried doctors might undervalue my life with disability',
        title: 'Worried doctors might undervalue my life with disability',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop',
        description: "What terrifies me is providers deciding my disabled life isn't worth saving—it happens. Don't let anyone's inability to imagine my life become a death sentence. My quality of life is mine to assess, not theirs to judge. I'm living proof adaptation is real. Protect me from their biases. See me as I am, not as they fear being.",
        whatYouAreFightingFor: "SERVES: Having a say (maintaining autonomy against bias), Sense of peace (knowing directive will be honored). SACRIFICES: Trust in medical system (constant vigilance required), Family relationships (advocacy burden), Dying where you want (may need advocacy-capable facility). Protecting autonomy against systemic ableism means constant navigation of power imbalances.",
        cooperativeLearning: "Provider bias disrupts all 5 elements: Positive interdependence fractures when 82.4% underestimate disability QOL—team must maintain shared vision against medical pressure. Individual accountability: each monitors for bias, documents interactions. Face-to-face: unified presence at appointments essential. Interpersonal: managing frustration when repeatedly challenging providers.",
        barriersToAccess: "Multiply marginalized disabled people face compounded bias: Black disabled encounter both racism and ableism (82.4% physician bias × racial disparities). LGBTQ+ disabled experience discrimination from multiple angles. Low-income disabled lack resources for advocacy. Immigrant disabled face language barriers compounding communication challenges. Women dismissed as 'emotional.'"
      },
      {
        id: 'q2_2',
        subtitle: 'Uncertain what life with physical limitations is like',
        title: 'Uncertain what life with physical limitations is like',
        image: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=600&h=400&fit=crop',
        description: "Can I be honest? I have no idea what life with severe disability would actually be like—I've never experienced it. My assumptions are probably shaped by societal fear more than reality. Disabled people seem to do much better than I'd expect, but I can't quite internalize that. These advance decisions feel like shots in the dark.",
        whatYouAreFightingFor: "SERVES: Honesty about uncertainty (acknowledges knowledge limits). SACRIFICES: Confident directive (ambiguity creates surrogate burden), Having a say (others interpret vague position), Sense of peace (uncertainty remains unresolved). Uncertainty is valid but complicates advance planning. Exploration before crisis could clarify.",
        cooperativeLearning: "Uncertainty strains all 5 elements: Positive interdependence requires shared understanding of values—uncertainty prevents clarity. Individual accountability: who researches disability realities? Face-to-face: discussing fears vs facts together. Interpersonal: managing different reactions to disability information. Group processing: integrating learning into decision-making.",
        barriersToAccess: "Able-bodied imagination of disability shaped by societal segregation: Disabled people rarely in media except 'inspiration porn.' Medical model dominates (disability = tragedy). Independent Living vs Disability Justice frameworks unknown to general public. Lack exposure to adapted life. Few platforms for disabled voices. Educational materials focus on deficits, not adaptation."
      },
      {
        id: 'q2_3',
        subtitle: 'Worried about becoming a burden to loved ones',
        title: 'Worried about becoming a burden to loved ones',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
        description: "The guilt of what caring for me would do to my family weighs heavily. I see the exhaustion in caregivers' faces, the marriages that fracture, careers abandoned, futures postponed. That's my deepest fear—not physical decline, but being the reason my loved ones' lives shrink. I'd rather go sooner than watch them sacrifice everything.",
        whatYouAreFightingFor: "SERVES: Not burdening loved ones (primary motivation). SACRIFICES: Having a say (fear drives decisions), Freedom from pain (may refuse helpful interventions), Being with family (shortened time together), Sense of peace (guilt remains). But: burden fear might actually increase family suffering through premature loss. Tension between protecting them and protecting yourself.",
        cooperativeLearning: "Burden fear affects all 5 elements: Positive interdependence—belief you're burden undermines shared commitment. Individual accountability—family must convince you their love isn't obligation. Face-to-face—vulnerability required to discuss burden fears. Interpersonal—permission-giving needed. Group processing—reframing care as gift not burden. Team must address fear explicitly.",
        barriersToAccess: "Marginalized groups face disproportionate burden fear: Women socialized to self-sacrifice, fear burdening more. People of color navigate family obligation cultural norms. LGBTQ+ chosen family may lack legal standing, creating burden. Immigrants fear deportation if family needs public assistance. Low-income families lack safety nets, making care genuinely financially devastating."
      },
      {
        id: 'q2_4',
        subtitle: 'Have seen others struggle with physical limitations',
        title: 'Have seen others struggle with physical limitations',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
        description: "I watched someone I love struggle with severe limitations, and it shaped everything I believe about this. I saw the daily challenges, the frustration, the loss of independence. That witnessing drives my decisions more than any abstract thinking. This isn't theoretical for me—I've seen what it actually looks like, and it terrifies me.",
        whatYouAreFightingFor: "SERVES: Avoiding prolonged dying (witnessed suffering), Having a say (informed by observation). SACRIFICES: Openness to disability adaptation (trauma narrows options), Being with family (fear might shorten time), Sense of peace (fear-based decisions create doubt). Witnessed suffering is real but might not represent all disability experiences or your adaptation capacity.",
        cooperativeLearning: "Witnessed trauma affects all 5 elements: Positive interdependence—shared trauma may create unified fear or divided interpretations. Individual accountability—processing what you witnessed vs projecting onto your future. Face-to-face—discussing trauma triggers. Interpersonal—managing different takeaways from same experience. Group processing—distinguishing person's suffering from disability itself.",
        barriersToAccess: "Whose struggle gets witnessed and interpreted how? Middle-class families can hire help, reducing visible struggle. Working-class families bear unmitigated burden—struggle more visible. Nursing homes hide elder disabled from public view. Disabled people of color navigate both disability and racism—compounded struggle. Medical neglect creates suffering attributed to disability rather than system failure."
      },
  ];

  const q3ChoicesData = [
      {
        id: 'q3_1',
        subtitle: 'Meeting people with disabilities living meaningful lives',
        title: 'Meeting people with disabilities living meaningful lives',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        description: "I've spent my whole life believing wheelchair users, ventilator-dependent people, those who can't speak—that they must be miserable. But what if I'm wrong? What if my terror of disability is based on ignorance, not reality? Maybe people adapt, find joy, create meaning in ways I can't imagine from this able-bodied perspective. If 54.3% with serious disabilities report good quality of life, maybe my assumptions are the problem.",
        careTeamAffirmation: "We understand you need to see disability from disabled people themselves, not medical tragedy narratives. We commit to connecting you with disabled communities, facilitating conversations with people living adapted lives you imagine as unbearable. We'll help you witness thriving, not inspiration porn. We won't filter their perspectives through our ableist assumptions. We'll listen alongside you.",
        interdependencyAtWork: "Paradigm shift demands extensive unlearning: Examining internalized ableism accumulated over lifetime. Researching disability perspectives, not medical views. Finding disabled voices (hidden by society). Processing guilt about previous beliefs. Resisting medical reinforcement of bias. Challenging family assumptions. Time investment significant during crisis. Emotional labor of worldview disruption. Result: most default to familiar suffering narrative.",
        reflectionGuidance: "What specific disabilities terrify you most—physical, cognitive, sensory? Where did these fears originate—experience, media, medical messages? Have you known thriving disabled people or only suffering narratives? Can you separate disability from poverty, isolation, discrimination effects? Would meeting adapted individuals help? How does family view disability? Can you distinguish between tragedy and inconvenience?"
      },
      {
        id: 'q3_2',
        subtitle: "Having my team's support to coordinate medical advocacy",
        title: "Having my team's support to coordinate medical advocacy",
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop',
        description: "If I knew my people could work together—really together—to fight for what I want, I might choose differently. But watching one exhausted person trying to advocate alone while working full-time? That's not sustainable. I need to know they can tag-team: someone researching, someone at bedside, someone handling insurance, someone protecting the protector. Without that coordination, my wishes are just paper.",
        careTeamAffirmation: "We hear that coordination terrifies you—watching one person burn out while others drift away. We commit to structured advocacy: defined roles, shift scheduling, communication systems, conflict resolution processes. We'll maintain unity even under stress. We won't let you face 66-hour weekly burden alone or watch us fracture. We'll prove coordination isn't wishful thinking.",
        interdependencyAtWork: "Advocacy coordination demands extraordinary infrastructure: Communication systems for 24/7 updates. Documentation sharing across advocates. Shift scheduling for 66 hours coverage. Conflict resolution for 57% disagreement rate. Training for medical literacy (only 12% proficient). Emotional support for accumulating trauma. Financial resources for lost wages. Geographic proximity or travel funds. Legal backup for resistance.",
        reflectionGuidance: "Who specifically would advocate—names, not roles? Can they commit 15-20 hours weekly each? Do they have medical literacy or ability to quickly develop? Will employers allow flexibility? Can they afford lost wages? Are they emotionally stable enough for sustained crisis? Will they maintain unity despite stress? Have you discussed specific scenarios? What happens when advocacy burns them out?"
      },
      {
        id: 'q3_3',
        subtitle: 'Learning more about medical interventions and their outcomes',
        title: 'Learning more about medical interventions and their outcomes',
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
        description: "Maybe if I truly understood what 'mechanical ventilation' means—not just the tube, but the sedation, the weaning process, the 40% who never get off. Or what 'comfort care' really includes beyond stopping treatment. The doctors speak in percentages without explaining what surviving looks like. I need details: Will I be aware? Mobile? Able to communicate? For how long? The vagueness terrifies me more than interventions.",
        careTeamAffirmation: "We understand vague percentages frighten you more than harsh details. We commit to comprehensive education: not just 'CPR has 17% success' but what the 17% experience afterward. We'll explain sedation depth, weaning difficulty, communication restoration timelines. We'll provide video decision aids, specialist consultations, time for questions. No crisis-driven decisions.",
        interdependencyAtWork: "Comprehensive education demands significant resources: Time for multiple consultations (average 5.6 minutes insufficient). Access to specialists who explain specifics. Health literacy to understand complex information. Emotional stability to process difficult realities. Questions prepared in advance. Second opinions for verification. Research skills for independent investigation. Translation for non-English speakers.",
        reflectionGuidance: "What specific interventions do you need explained—CPR, ventilation, dialysis, feeding tubes? Do you want statistics or experiential descriptions? Can you tolerate learning that outcomes are often poor? Would video demonstrations help or traumatize? Should family learn together or protect some from harsh realities? How will you verify information accuracy given provider bias? Can you distinguish population statistics from individual possibility?"
      },
      {
        id: 'q3_4',
        subtitle: "Understanding disability doesn't mean low quality of life",
        title: "Understanding disability doesn't mean low quality of life",
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
        description: "What if everything I fear about disability is based on false premises? Research says people adapt remarkably, find joy, report high satisfaction despite limitations I'd assume unbearable. If I could really believe that—not just know it intellectually but feel it emotionally—my thresholds for 'unacceptable' would transform. I want that shift. I'm not there yet.",
        careTeamAffirmation: "We recognize you've been taught disability equals suffering. We commit to unlearning alongside you: exploring disability paradox research, centering disabled voices, examining our own ableist assumptions that influence our counseling. We'll stop projecting our fears onto your future. We won't assume limitation means tragedy. We'll help you see what we've been missing.",
        interdependencyAtWork: "Paradigm shift demands extensive unlearning: Examining internalized ableism accumulated over lifetime. Researching disability perspectives, not medical views. Finding disabled voices (hidden by society). Processing guilt about previous beliefs. Resisting medical reinforcement of bias. Challenging family assumptions. Time investment significant during crisis. Emotional labor of worldview disruption. Result: most default to familiar suffering narrative.",
        reflectionGuidance: "What specific disabilities terrify you most—physical, cognitive, sensory? Where did these fears originate—experience, media, medical messages? Have you known thriving disabled people or only suffering narratives? Can you separate disability from poverty, isolation, discrimination effects? Would meeting adapted individuals help? How does family view disability? Can you distinguish between tragedy and inconvenience?"
      },
  ];

  // Question data for each step
  const questionData = {
    q1: {
      title: "What concerns, issues, and challenges might you be facing?",
      subtitle: "Checkpoint 1",
      checkpointLabel: "Your Position",
      instruction: "Select the option that best represents what matters most to you."
    },
    q2: {
      title: "What challenges might change your position?",
      subtitle: "Checkpoint 2", 
      checkpointLabel: "Your Challenges",
      instruction: "Select all that apply to your situation."
    },
    q3: {
      title: "What would make you change your mind?",
      subtitle: "Checkpoint 3",
      checkpointLabel: "What Would Change Your Mind",
      instruction: "Select all circumstances that might change your decision."
    }
  };

  const handleContinue = () => {
    // Mark checkpoints as complete when transitioning past mental health check
    if (currentPhase === FLOW_PHASES.Q1_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q1: true }));
    } else if (currentPhase === FLOW_PHASES.Q2_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q2: true }));
    } else if (currentPhase === FLOW_PHASES.Q3_MENTAL_HEALTH) {
      setCompletedCheckpoints(prev => ({ ...prev, q3: true }));
    }

    const phaseTransitions = {
      [FLOW_PHASES.MAIN]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q1_SELECTION]: FLOW_PHASES.Q1_REVIEW,
      [FLOW_PHASES.Q1_REVIEW]: FLOW_PHASES.Q1_MENTAL_HEALTH,
      [FLOW_PHASES.Q1_MENTAL_HEALTH]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q2_SELECTION]: FLOW_PHASES.Q2_REVIEW,
      [FLOW_PHASES.Q2_REVIEW]: FLOW_PHASES.Q2_MENTAL_HEALTH,
      [FLOW_PHASES.Q2_MENTAL_HEALTH]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.Q3_SELECTION]: FLOW_PHASES.Q3_REVIEW,
      [FLOW_PHASES.Q3_REVIEW]: FLOW_PHASES.Q3_MENTAL_HEALTH,
      [FLOW_PHASES.Q3_MENTAL_HEALTH]: FLOW_PHASES.SUMMARY,
      [FLOW_PHASES.SUMMARY]: FLOW_PHASES.TEAM_VISIBILITY,
      [FLOW_PHASES.TEAM_VISIBILITY]: FLOW_PHASES.COMPLETE,
    };
    setCurrentPhase(phaseTransitions[currentPhase] || FLOW_PHASES.COMPLETE);
  };

  // Handle continue from main screen - either resume or start fresh
  const handleMainScreenContinue = () => {
    if (isQuestionnaireComplete()) {
      setCurrentPhase(FLOW_PHASES.SUMMARY);
    } else if (hasStarted()) {
      setCurrentPhase(getResumePhase());
    } else {
      setCurrentPhase(FLOW_PHASES.Q1_SELECTION);
    }
  };

  // Handle restart - clear all progress
  const handleRestart = () => {
    clearProgress();
    setQ1Choices([]);
    setQ2Choices([]);
    setQ3Choices([]);
    setCompletedCheckpoints({ q1: false, q2: false, q3: false });
    setCurrentPhase(FLOW_PHASES.MAIN);
  };

  const handleBack = () => {
    const phaseTransitions = {
      [FLOW_PHASES.Q1_SELECTION]: FLOW_PHASES.MAIN,
      [FLOW_PHASES.Q1_REVIEW]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q1_MENTAL_HEALTH]: FLOW_PHASES.Q1_REVIEW,
      [FLOW_PHASES.Q2_SELECTION]: FLOW_PHASES.Q1_SELECTION,
      [FLOW_PHASES.Q2_REVIEW]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q2_MENTAL_HEALTH]: FLOW_PHASES.Q2_REVIEW,
      [FLOW_PHASES.Q3_SELECTION]: FLOW_PHASES.Q2_SELECTION,
      [FLOW_PHASES.Q3_REVIEW]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.Q3_MENTAL_HEALTH]: FLOW_PHASES.Q3_REVIEW,
      [FLOW_PHASES.SUMMARY]: FLOW_PHASES.Q3_SELECTION,
      [FLOW_PHASES.TEAM_VISIBILITY]: FLOW_PHASES.SUMMARY,
    };
    if (phaseTransitions[currentPhase]) {
      setCurrentPhase(phaseTransitions[currentPhase]);
    }
  };

  const progress = getProgress();

  // Loading/Error states
  if (state.loading) return <div className="loading-container"><div className="loading-spinner" /><p>Loading...</p></div>;
  if (state.error) return <div className="error-container"><p>Error: {state.error}</p><button onClick={() => window.location.reload()}>Retry</button></div>;

  // Main Screen
  if (currentPhase === FLOW_PHASES.MAIN) {
    return (
      <MainScreen
        question={mainScreenQuestion}
        team={state.team}
        progress={progress}
        progressPercentage={getProgressPercentage()}
        hasStarted={hasStarted()}
        isComplete={isQuestionnaireComplete()}
        completedCheckpoints={completedCheckpoints}
        onContinue={handleMainScreenContinue}
        onBack={handleBack}
        onViewTeamRecordings={(memberId) => {
          // If memberId is provided, we could scroll to that member's recording
          // For now, just navigate to the team recordings page
          setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS);
        }}
      />
    );
  }

  // Q1 - Single Selection
  if (currentPhase === FLOW_PHASES.Q1_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q1}
        choices={q1ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q1Choices}
        onSelect={setQ1Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={false}
      />
    );
  }

  // Q1 Review
  if (currentPhase === FLOW_PHASES.Q1_REVIEW) {
    const selectedChoice = q1ChoicesData.find(c => q1Choices.includes(c.id));
    return (
      <ChoiceReview 
        question={questionData.q1}
        selectedChoice={selectedChoice}
        selectedChoices={q1Choices.map(id => q1ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q1 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q1_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q1}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="doing-great"
      />
    );
  }

  // Q2 - Multiple Selection
  if (currentPhase === FLOW_PHASES.Q2_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q2}
        choices={q2ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q2Choices}
        onSelect={setQ2Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={true}
        layout="vertical"
      />
    );
  }

  // Q2 Review
  if (currentPhase === FLOW_PHASES.Q2_REVIEW) {
    return (
      <ChoiceReview 
        question={questionData.q2}
        selectedChoices={q2Choices.map(id => q2ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q2 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q2_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q2}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="almost-there"
      />
    );
  }

  // Q3 - Multiple Selection
  if (currentPhase === FLOW_PHASES.Q3_SELECTION) {
    return (
      <CheckpointSelection
        question={questionData.q3}
        choices={q3ChoicesData}
        team={state.team}
        progress={progress}
        initialSelection={q3Choices}
        onSelect={setQ3Choices}
        onContinue={handleContinue}
        onBack={handleBack}
        multiSelect={true}
        layout="vertical"
      />
    );
  }

  // Q3 Review
  if (currentPhase === FLOW_PHASES.Q3_REVIEW) {
    return (
      <ChoiceReview 
        question={questionData.q3}
        selectedChoices={q3Choices.map(id => q3ChoicesData.find(c => c.id === id)).filter(Boolean)}
        progress={progress}
        onConfirm={handleContinue}
        onBack={handleBack}
        onChangeAnswer={handleBack}
      />
    );
  }

  // Q3 Mental Health Check
  if (currentPhase === FLOW_PHASES.Q3_MENTAL_HEALTH) {
    return (
      <MentalHealthCheck 
        question={questionData.q3}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        variant="take-break"
      />
    );
  }

  // Summary
  if (currentPhase === FLOW_PHASES.SUMMARY) {
    // Build checkpoints data from selections
    const checkpointsData = [
      {
        id: 1,
        title: `Checkpoint 1: ${questionData.q1.title}`,
        choices: q1Choices.map(id => {
          const choice = q1ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      },
      {
        id: 2,
        title: `Checkpoint 2: ${questionData.q2.title}`,
        choices: q2Choices.map(id => {
          const choice = q2ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      },
      {
        id: 3,
        title: `Checkpoint 3: ${questionData.q3.title}`,
        choices: q3Choices.map(id => {
          const choice = q3ChoicesData.find(c => c.id === id);
          return choice?.title || choice?.description || '';
        }).filter(Boolean)
      }
    ];

    // Build reflections data for FullSummary (with full choice details)
    const reflectionsData = [
      {
        id: 1,
        label: "Reflection 1:",
        question: questionData.q1.title,
        choices: q1Choices.map(id => {
          const choice = q1ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            whyMatters: choice.whyThisMatters,
            research: choice.researchEvidence,
            impact: choice.decisionImpact
          } : null;
        }).filter(Boolean)
      },
      {
        id: 2,
        label: "Reflection 2:",
        question: questionData.q2.title,
        choices: q2Choices.map(id => {
          const choice = q2ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            whatYouAreFightingFor: choice.whatYouAreFightingFor,
            cooperativeLearning: choice.cooperativeLearning,
            barriersToAccess: choice.barriersToAccess
          } : null;
        }).filter(Boolean)
      },
      {
        id: 3,
        label: "Reflection 3:",
        question: questionData.q3.title,
        choices: q3Choices.map(id => {
          const choice = q3ChoicesData.find(c => c.id === id);
          return choice ? {
            id: choice.id,
            title: choice.title,
            image: choice.image,
            description: choice.description,
            careTeamAffirmation: choice.careTeamAffirmation,
            interdependencyAtWork: choice.interdependencyAtWork,
            reflectionGuidance: choice.reflectionGuidance
          } : null;
        }).filter(Boolean)
      }
    ];

    // Team members with affirmation status
    const teamWithAffirmation = [
      { id: 1, name: "Dr. Sarah", avatar: "https://i.pravatar.cc/82?img=1", affirmed: true },
      { id: 2, name: "John", avatar: "https://i.pravatar.cc/82?img=2", affirmed: true },
      { id: 3, name: "Mary", avatar: "https://i.pravatar.cc/82?img=3", affirmed: false },
      { id: 4, name: "James", avatar: "https://i.pravatar.cc/82?img=4", affirmed: false },
      { id: 5, name: "Lisa", avatar: "https://i.pravatar.cc/82?img=5", affirmed: false }
    ];

    return (
      <Summary
        question={mainScreenQuestion}
        userName="Norman"
        userAvatar="https://i.pravatar.cc/82?img=8"
        checkpoints={checkpointsData}
        reflections={reflectionsData}
        team={teamWithAffirmation}
        progress={progress}
        onContinue={handleContinue}
        onBack={handleBack}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onChangeAnswer={() => setCurrentPhase(FLOW_PHASES.Q1_SELECTION)}
        onViewTeamRecordings={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        isFirstVisit={!hasVisitedSummary}
        onNavigateToTeamVisibility={() => {
          setHasVisitedSummary(true);
          setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY);
        }}
      />
    );
  }

  // Team Visibility
  if (currentPhase === FLOW_PHASES.TEAM_VISIBILITY) {
    return (
      <TeamVisibilitySuccess
        userName="Norman"
        userAvatar="https://i.pravatar.cc/280?img=12"
        onSkip={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onRecordVideo={() => setCurrentPhase(FLOW_PHASES.RECORD_VIDEO)}
        onRecordAudio={() => console.log('Record audio')}
        onEnterText={() => console.log('Enter text')}
      />
    );
  }

  // Record Video
  if (currentPhase === FLOW_PHASES.RECORD_VIDEO) {
    return (
      <RecordVideo
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_VISIBILITY)}
        onComplete={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onSwitchToText={() => console.log('Switch to text')}
        onSwitchToAudio={() => console.log('Switch to audio')}
      />
    );
  }

  // Recording Complete - shown after submitting recording
  if (currentPhase === FLOW_PHASES.RECORDING_COMPLETE) {
    return (
      <RecordingComplete
        onReady={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        onSkip={() => setCurrentPhase(FLOW_PHASES.COMPLETE)}
      />
    );
  }

  // Team Recordings - view care team's recordings
  if (currentPhase === FLOW_PHASES.TEAM_RECORDINGS) {
    return (
      <TeamRecordings
        onBack={() => setCurrentPhase(FLOW_PHASES.RECORDING_COMPLETE)}
        onBackHome={() => setCurrentPhase(FLOW_PHASES.MAIN)}
        onRecordVideo={() => setCurrentPhase(FLOW_PHASES.RECORD_VIDEO)}
        onRecordAudio={() => console.log('Record audio')}
        onEnterText={() => console.log('Enter text')}
        onSkip={() => setCurrentPhase(FLOW_PHASES.SUMMARY)}
        onViewFullReport={(member) => {
          setSelectedMemberForFullSummary(member);
          setCurrentPhase(FLOW_PHASES.MEMBER_FULL_SUMMARY);
        }}
      />
    );
  }

  // Member Full Summary - view a specific member's full summary
  if (currentPhase === FLOW_PHASES.MEMBER_FULL_SUMMARY && selectedMemberForFullSummary) {
    return (
      <FullSummary
        userName={selectedMemberForFullSummary.name}
        onBack={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
        onContinue={() => setCurrentPhase(FLOW_PHASES.TEAM_RECORDINGS)}
      />
    );
  }

  // Complete
  if (currentPhase === FLOW_PHASES.COMPLETE) {
    return <CompletionSuccess onRestart={handleRestart} />;
  }

  return <div className="loading-container"><p>Loading...</p></div>;
};

export default QuestionnaireFlow;
