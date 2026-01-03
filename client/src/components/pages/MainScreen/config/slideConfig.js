/**
 * Slide configuration for MainScreen carousel
 * Generates slide data based on current state
 */

export const SLIDE_TYPES = {
  WHY_MATTERS: 0,
  HOW_IT_WORKS: 1,
  CARE_TEAM: 2
};

/**
 * Generate slides configuration based on current state
 * @param {Object} options - Configuration options
 * @param {number} options.progressPercentage - Current progress percentage
 * @param {Object} options.completedCheckpoints - Checkpoint completion status
 * @returns {Array} Array of slide configurations
 */
export const generateSlides = ({ progressPercentage, completedCheckpoints }) => [
  {
    id: SLIDE_TYPES.WHY_MATTERS,
    type: 'whyMatters',
    title: "Why this Matters:",
    content: [
      {
        text: 'Unlike prescriptive approaches, asking "What do you want your loved ones to know?" acknowledges that patients are the experts on their own lives and relationships.'
      },
      {
        text: 'This open-ended format respects individual differences in privacy preferences, cultural values, and family dynamics while still facilitating meaningful communication.'
      }
    ]
  },
  {
    id: SLIDE_TYPES.HOW_IT_WORKS,
    type: 'howItWorks',
    title: "How it Works",
    headerRight: `${progressPercentage}% PROGRESS`,
    layers: "3 Layers",
    content: [
      {
        checkpoint: "Layer 1: Your Position",
        description: "Where you stand what's your initial choice",
        completed: completedCheckpoints.q1,
        layerNumber: 1
      },
      {
        checkpoint: "Layer 2: Your Challenges",
        description: "What challenges might change your position",
        completed: completedCheckpoints.q2,
        layerNumber: 2
      },
      {
        checkpoint: "Layer 3: What Would Change Your Mind",
        description: "What would make you change your mind",
        completed: completedCheckpoints.q3,
        layerNumber: 3
      }
    ]
  },
  {
    id: SLIDE_TYPES.CARE_TEAM,
    type: 'careTeam',
    title: "Your Care Team",
    content: [
      {
        text: "Help each other make plans that prioritize dignity and wellbeing."
      }
    ]
  }
];
