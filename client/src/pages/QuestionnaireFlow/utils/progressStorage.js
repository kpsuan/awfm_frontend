import { STORAGE_KEY } from '../constants';

/**
 * Get storage key for a specific question
 * @param {string} questionId - Question ID
 * @returns {string} Storage key
 */
const getStorageKey = (questionId) => {
  return questionId ? `${STORAGE_KEY}_${questionId}` : STORAGE_KEY;
};

/**
 * Load saved progress from localStorage
 * @param {string} questionId - Optional question ID for per-question progress
 * @returns {Object|null} Saved progress data or null
 */
export const loadSavedProgress = (questionId) => {
  try {
    const key = getStorageKey(questionId);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    // Fallback: try legacy key without questionId
    if (questionId) {
      const legacySaved = localStorage.getItem(STORAGE_KEY);
      if (legacySaved) {
        return JSON.parse(legacySaved);
      }
    }
  } catch (e) {
    console.error('Error loading saved progress:', e);
  }
  return null;
};

/**
 * Save progress to localStorage
 * @param {Object} data - Progress data to save
 * @param {string} questionId - Optional question ID for per-question progress
 */
export const saveProgress = (data, questionId) => {
  try {
    const key = getStorageKey(questionId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

/**
 * Clear saved progress from localStorage
 * @param {string} questionId - Optional question ID for per-question progress
 */
export const clearProgress = (questionId) => {
  try {
    const key = getStorageKey(questionId);
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Error clearing progress:', e);
  }
};

/**
 * Get all saved progress for all questions
 * @returns {Object} Map of questionId -> progress data
 */
export const getAllProgress = () => {
  const allProgress = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY)) {
        const data = JSON.parse(localStorage.getItem(key));
        if (key === STORAGE_KEY) {
          // Legacy key without questionId - assign to Q10A as default
          allProgress['Q10A'] = data;
        } else {
          // Extract questionId from key (format: STORAGE_KEY_questionId)
          const questionId = key.replace(`${STORAGE_KEY}_`, '');
          allProgress[questionId] = data;
        }
      }
    }
  } catch (e) {
    console.error('Error getting all progress:', e);
  }
  return allProgress;
};
