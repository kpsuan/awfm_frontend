/**
 * Build checkpoints data for Summary component
 * @param {Object} params - Parameters
 * @param {Object} params.questionData - Question metadata for q1, q2, q3
 * @param {Array} params.q1Choices - Selected Q1 choice IDs
 * @param {Array} params.q2Choices - Selected Q2 choice IDs
 * @param {Array} params.q3Choices - Selected Q3 choice IDs
 * @param {Array} params.q1ChoicesData - Available Q1 choices
 * @param {Array} params.q2ChoicesData - Available Q2 choices
 * @param {Array} params.q3ChoicesData - Available Q3 choices
 * @returns {Array} Formatted checkpoints data
 */
export const buildCheckpointsData = ({
  questionData,
  q1Choices,
  q2Choices,
  q3Choices,
  q1ChoicesData,
  q2ChoicesData,
  q3ChoicesData
}) => {
  return [
    {
      id: 1,
      title: `Layer 1: ${questionData.q1.title}`,
      choices: q1Choices.map(id => {
        const choice = q1ChoicesData.find(c => c.id === id);
        return choice?.title || choice?.description || '';
      }).filter(Boolean)
    },
    {
      id: 2,
      title: `Layer 2: ${questionData.q2.title}`,
      choices: q2Choices.map(id => {
        const choice = q2ChoicesData.find(c => c.id === id);
        return choice?.title || choice?.description || '';
      }).filter(Boolean)
    },
    {
      id: 3,
      title: `Layer 3: ${questionData.q3.title}`,
      choices: q3Choices.map(id => {
        const choice = q3ChoicesData.find(c => c.id === id);
        return choice?.title || choice?.description || '';
      }).filter(Boolean)
    }
  ];
};

/**
 * Build reflections data for FullSummary component
 * @param {Object} params - Parameters (same as buildCheckpointsData)
 * @returns {Array} Formatted reflections data with full choice details
 */
export const buildReflectionsData = ({
  questionData,
  q1Choices,
  q2Choices,
  q3Choices,
  q1ChoicesData,
  q2ChoicesData,
  q3ChoicesData
}) => {
  return [
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
};

/**
 * Match PPR pattern based on user selections
 * @param {Object} params - Parameters
 * @param {Array} params.pprPatterns - Available PPR patterns
 * @param {Array} params.q1Choices - Selected Q1 choice IDs
 * @param {Array} params.q2Choices - Selected Q2 choice IDs
 * @param {Array} params.q3Choices - Selected Q3 choice IDs
 * @returns {Object|undefined} Matched PPR pattern or undefined
 */
export const matchPPRPattern = ({ pprPatterns, q1Choices, q2Choices, q3Choices }) => {
  if (!pprPatterns) return undefined;

  return pprPatterns.find(pattern => {
    // Extract option numbers from choice IDs (format: "q1_1" -> option 1)
    const q1OptionNum = q1Choices[0] ? parseInt(q1Choices[0].split('_')[1]) : null;
    const q2OptionNums = q2Choices.map(id => parseInt(id.split('_')[1]));
    const q3OptionNum = q3Choices[0] ? parseInt(q3Choices[0].split('_')[1]) : null;

    // Match CP1 option
    const cp1Match = pattern.cp1Option === q1OptionNum;

    // Match CP2 options (must match all selected options)
    const cp2Match = pattern.cp2Options?.length === q2OptionNums.length &&
      pattern.cp2Options.every(opt => q2OptionNums.includes(opt));

    // Match CP3 option
    const cp3Match = pattern.cp3Option === q3OptionNum;

    return cp1Match && cp2Match && cp3Match;
  });
};
