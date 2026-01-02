/**
 * Data transformation service
 * Maps Django backend structure to frontend expected structure
 */

/**
 * Component type mapping to frontend field names
 */
const COMPONENT_MAP = {
  C1: 'title',           // Option title/subtitle
  C2: 'whyThisMatters',  // L1: Why this matters explanation
  C3: 'description',     // All layers: Detailed description shown at selection (How This Sounds)
  C4: 'researchEvidence', // L1: Research evidence
  C5: 'decisionImpact',  // L1: Decision impact
  C6: 'whatYouAreFightingFor', // L2: What you are fighting for (7 End-of-Life Priorities)
  C7: 'cooperativeLearning',   // L2: Cooperative learning (5 Elements assessment)
  C8: 'interdependencyAtWork', // L3: Interdependency at work (System dynamics)
  C9: 'barriersToAccess',      // L2: Barriers to access (DEIASJB equity analysis)
  C10: 'reflectionGuidance',   // L3: Reflection guidance (Questions for individual + team)
  C11: 'careTeamAffirmation'   // L3: Care team affirmation (Team commitment, first-person plural)
};

/**
 * Transform Django option to frontend choice format
 * @param {Object} option - Django option object with components
 * @param {number} layerNumber - Layer number (1, 2, or 3)
 * @returns {Object} Transformed choice object
 */
export function transformOptionToChoice(option, layerNumber) {
  const choice = {
    id: `q${layerNumber}_${option.option_number}`,
    subtitle: option.option_text,
    title: option.option_text,
    // Placeholder image - can be updated with actual images later
    image: `https://images.unsplash.com/photo-${1559757175 + option.option_number}000000?w=600&h=400&fit=crop`
  };

  // Map components to frontend fields
  if (option.components) {
    option.components.forEach(component => {
      const fieldName = COMPONENT_MAP[component.component_type];
      if (fieldName) {
        choice[fieldName] = component.component_text;
      }
    });
  }

  return choice;
}

/**
 * Transform Django layer to frontend question format
 * @param {Object} layer - Django layer object
 * @returns {Object} Transformed question object
 */
export function transformLayerToQuestion(layer) {
  return {
    title: layer.layer_question,
    subtitle: `Layer ${layer.layer_number}`,
    checkpointLabel: layer.layer_title,
    instruction: layer.selection_type === 'multi'
      ? `Select up to ${layer.max_selections} options that apply to your situation.`
      : 'Select the option that best represents what matters most to you.',
    selectionType: layer.selection_type,
    maxSelections: layer.max_selections
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
 * @param {Object} question - Django question object with nested layers
 * @returns {Object} Object containing all data needed by frontend
 */
export function transformQuestionData(question) {
  const result = {
    mainScreenQuestion: transformMainScreenQuestion(question),
    questionData: {},
    choicesData: {}
  };

  // Transform each layer (backend uses 'layers' instead of 'checkpoints')
  if (question.layers && Array.isArray(question.layers)) {
    question.layers.forEach(layer => {
      const layerNum = layer.layer_number;
      const layerKey = `q${layerNum}`;

      // Add question metadata
      result.questionData[layerKey] = transformLayerToQuestion(layer);

      // Transform options to choices
      result.choicesData[layerKey] = (layer.options || []).map(option =>
        transformOptionToChoice(option, layerNum)
      );
    });
  }

  return result;
}

/**
 * Transform PPR patterns to frontend format
 * @param {Array} pprPatterns - Django PPR pattern array
 * @returns {Array} Transformed PPR patterns
 */
export function transformPPRPatterns(pprPatterns) {
  if (!Array.isArray(pprPatterns)) {
    return [];
  }
  return pprPatterns.map(pattern => ({
    id: pattern.id,
    name: pattern.pattern_name,
    // Backend now uses l1/l2/l3 naming instead of cp1/cp2/cp3
    l1Option: pattern.l1_option,
    l2Options: pattern.l2_options,
    l3Option: pattern.l3_option,
    // Keep old naming for backward compatibility
    cp1Option: pattern.l1_option,
    cp2Options: pattern.l2_options,
    cp3Option: pattern.l3_option,
    text: pattern.ppr_text,
    characterCount: pattern.character_count,
    coveragePercentage: pattern.coverage_percentage
  }));
}

// Legacy alias for backward compatibility
export const transformCheckpointToQuestion = transformLayerToQuestion;
