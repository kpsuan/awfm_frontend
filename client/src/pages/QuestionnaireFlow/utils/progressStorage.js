import { STORAGE_KEY } from '../constants';

/**
 * Load saved progress from localStorage
 * @returns {Object|null} Saved progress data or null
 */
export const loadSavedProgress = () => {
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

/**
 * Save progress to localStorage
 * @param {Object} data - Progress data to save
 */
export const saveProgress = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

/**
 * Clear saved progress from localStorage
 */
export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing progress:', e);
  }
};
