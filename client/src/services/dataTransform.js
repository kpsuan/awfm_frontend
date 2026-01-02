/**
 * Data transformation service
 * Maps Django backend structure to frontend expected structure
 */

/**
 * Component type mapping to frontend field names
 */
const COMPONENT_MAP = {
  C1: 'title',           // Option title/subtitle
  C2: 'whyThisMatters',  // CP1: Why this matters explanation
  C3: 'description',     // All CPs: Detailed description shown at selection (How This Sounds)
  C4: 'researchEvidence', // CP1: Research evidence
  C5: 'decisionImpact',  // CP1: Decision impact
  C6: 'whatYouAreFightingFor', // CP2: What you are fighting for (7 End-of-Life Priorities)
  C7: 'cooperativeLearning',   // CP2: Cooperative learning (5 Elements assessment)
  C8: 'interdependencyAtWork', // CP3: Interdependency at work (System dynamics)
  C9: 'barriersToAccess',      // CP2: Barriers to access (DEIASJB equity analysis)
  C10: 'reflectionGuidance',   // CP3: Reflection guidance (Questions for individual + team)
  C11: 'careTeamAffirmation'   // CP3: Care team affirmation (Team commitment, first-person plural)
};

/**
 * Transform Django option to frontend choice format
 * @param {Object} option - Django option object with components
 * @param {number} checkpointNumber - Checkpoint number (1, 2, or 3)
 * @returns {Object} Transformed choice object
 */
export function transformOptionToChoice(option, checkpointNumber) {
  const choice = {
    id: `q${checkpointNumber}_${option.option_number}`,
    subtitle: option.option_text,
    title: option.option_text,
    // Placeholder image - can be updated with actual images later
    image: `https://images.unsplash.com/photo-${1559757175 + option.option_number}000000?w=600&h=400&fit=crop`
  };

  // Map components to frontend fields
  option.components.forEach(component => {
    const fieldName = COMPONENT_MAP[component.component_type];
    if (fieldName) {
      choice[fieldName] = component.component_text;
    }
  });

  return choice;
}

/**
 * Transform Django checkpoint to frontend question format
 * @param {Object} checkpoint - Django checkpoint object
 * @returns {Object} Transformed question object
 */
export function transformCheckpointToQuestion(checkpoint) {
  return {
    title: checkpoint.checkpoint_question,
    subtitle: `Layer ${checkpoint.checkpoint_number}`,
    checkpointLabel: checkpoint.checkpoint_title,
    instruction: checkpoint.selection_type === 'multi'
      ? `Select up to ${checkpoint.max_selections} options that apply to your situation.`
      : 'Select the option that best represents what matters most to you.',
    selectionType: checkpoint.selection_type,
    maxSelections: checkpoint.max_selections
  };
}

/**
 * Transform Django question to frontend main screen question
 * @param {Object} question - Django question object
 * @returns {Object} Transformed main screen question
 */
export function transformMainScreenQuestion(question) {
  return {
    title: question.question_text,
    subtitle: question.id,
    sectionLabel: question.category
  };
}

/**
 * Transform Django question detail to frontend question data structure
 * @param {Object} question - Django question object with nested checkpoints
 * @returns {Object} Object containing all data needed by frontend
 */
export function transformQuestionData(question) {
  const result = {
    mainScreenQuestion: transformMainScreenQuestion(question),
    questionData: {},
    choicesData: {}
  };

  // Transform each checkpoint
  question.checkpoints.forEach(checkpoint => {
    const cpNum = checkpoint.checkpoint_number;
    const cpKey = `q${cpNum}`;

    // Add question metadata
    result.questionData[cpKey] = transformCheckpointToQuestion(checkpoint);

    // Transform options to choices
    result.choicesData[cpKey] = checkpoint.options.map(option =>
      transformOptionToChoice(option, cpNum)
    );
  });

  return result;
}

/**
 * Transform PPR patterns to frontend format
 * @param {Array} pprPatterns - Django PPR pattern array
 * @returns {Array} Transformed PPR patterns
 */
export function transformPPRPatterns(pprPatterns) {
  return pprPatterns.map(pattern => ({
    id: pattern.id,
    name: pattern.pattern_name,
    cp1Option: pattern.cp1_option,
    cp2Options: pattern.cp2_options,
    cp3Option: pattern.cp3_option,
    text: pattern.ppr_text,
    characterCount: pattern.character_count,
    coveragePercentage: pattern.coverage_percentage
  }));
}
