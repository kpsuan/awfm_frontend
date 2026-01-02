// Mock data for when backend is not available (e.g., Vercel deployment)

// Main screen question
export const mainScreenQuestion = {
  title: "How important is staying alive even if you have substantial physical limitations?",
  subtitle: "Question 10 A",
  sectionLabel: "Advance Care Planning"
};

// Question metadata for each checkpoint
export const questionData = {
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

// Checkpoint 1 choices
export const q1ChoicesData = [
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
  }
];

// Checkpoint 2 choices
export const q2ChoicesData = [
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
  }
];

// Checkpoint 3 choices
export const q3ChoicesData = [
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
  }
];

// Team members with affirmation status (for Summary page)
export const teamWithAffirmation = [
  { id: 1, name: "Dr. Sarah", avatar: "https://i.pravatar.cc/82?img=1", affirmed: true },
  { id: 2, name: "John", avatar: "https://i.pravatar.cc/82?img=2", affirmed: true },
  { id: 3, name: "Mary", avatar: "https://i.pravatar.cc/82?img=3", affirmed: false },
  { id: 4, name: "James", avatar: "https://i.pravatar.cc/82?img=4", affirmed: false },
  { id: 5, name: "Lisa", avatar: "https://i.pravatar.cc/82?img=5", affirmed: false }
];

// Legacy mock data (for context/services compatibility)
export const mockData = {
  questions: [
    {
      id: "q1",
      type: "intro",
      title: "What matters most?",
      subtitle: "Checkpoint 1",
      description: "Let's explore what aspects of care are most important to you and your loved ones.",
      section: 1
    },
    {
      id: "q2",
      type: "selection",
      title: "Choose your priority",
      subtitle: "Checkpoint 1",
      instruction: "Select the option that best represents what matters most to you.",
      section: 1,
      checkpointIds: ["cp1", "cp2", "cp3", "cp4"]
    },
    {
      id: "q3",
      type: "review",
      title: "Confirm your choice",
      subtitle: "Checkpoint 1",
      section: 1
    }
  ],
  checkpoints: [
    {
      id: "cp1",
      title: "Being comfortable",
      description: "Focus on comfort and quality of life, managing symptoms effectively.",
      category: "priority"
    },
    {
      id: "cp2",
      title: "Living longer",
      description: "Prioritize treatments that may extend life.",
      category: "priority"
    },
    {
      id: "cp3",
      title: "Being independent",
      description: "Maintain as much independence as possible.",
      category: "priority"
    },
    {
      id: "cp4",
      title: "Being with family",
      description: "Stay close to loved ones and have time for meaningful connections.",
      category: "priority"
    }
  ],
  team: [
    {
      id: "u1",
      name: "Dr. Sarah Chen",
      role: "Primary Care Physician",
      color: "#4A90D9"
    },
    {
      id: "u2",
      name: "James Wilson",
      role: "Family Member",
      color: "#7B68EE"
    },
    {
      id: "u3",
      name: "Maria Garcia",
      role: "Nurse Coordinator",
      color: "#20B2AA"
    }
  ],
  sections: [
    { id: 1, title: "What matters most" },
    { id: 2, title: "Where you feel comfortable" },
    { id: 3, title: "Who supports you" },
    { id: 4, title: "Your wishes" }
  ]
};

// Check if we should use mock data (no API URL configured)
console.log('🔍 DEBUG: REACT_APP_API_URL =', process.env.REACT_APP_API_URL);
console.log('🔍 DEBUG: useMockData will be =', !process.env.REACT_APP_API_URL);
export const useMockData = !process.env.REACT_APP_API_URL;
