import { useCallback } from 'react';
import { useAuth } from '../../../context';
import { responsesService, progressService } from '../../../services/questionnaire';

/**
 * Hook to sync user responses with the backend
 * Handles saving responses when checkpoints are confirmed and loading saved responses
 */
export const useResponseSync = (questionId = 'Q10A') => {
  const { user } = useAuth();

  /**
   * Save a layer response to the backend
   * @param {number} layerNumber - 1, 2, or 3
   * @param {string[]} selectedOptionIds - Array of selected option UUIDs
   * @param {boolean} markComplete - Whether to mark as completed
   */
  const saveResponse = useCallback(async (layerNumber, selectedOptionIds, markComplete = true) => {
    if (!user) {
      console.log('User not logged in, skipping backend save');
      return null;
    }

    if (!selectedOptionIds || selectedOptionIds.length === 0) {
      console.log('No options selected, skipping save');
      return null;
    }

    try {
      const response = await responsesService.save({
        question: questionId,
        layer_number_input: layerNumber,
        selected_option_ids: selectedOptionIds,
        completed_at: markComplete ? new Date().toISOString() : null
      });

      console.log(`Saved L${layerNumber} response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error saving L${layerNumber} response:`, error);
      throw error;
    }
  }, [user, questionId]);

  /**
   * Save progress state to backend
   * @param {string} currentPhase - Current flow phase
   * @param {number} currentLayer - Current layer number
   * @param {boolean} isCompleted - Whether questionnaire is complete
   */
  const saveProgress = useCallback(async (currentPhase, currentLayer, isCompleted = false) => {
    if (!user) {
      console.log('User not logged in, skipping progress save');
      return null;
    }

    try {
      const response = await progressService.save({
        question: questionId,
        current_phase: currentPhase,
        current_layer: currentLayer,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null
      });

      console.log('Saved progress:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }, [user, questionId]);

  /**
   * Load all saved responses for the current question
   * @returns {Object} - Object with q1Choices, q2Choices, q3Choices arrays
   */
  const loadSavedResponses = useCallback(async () => {
    if (!user) {
      console.log('User not logged in, no saved responses');
      return null;
    }

    try {
      const response = await responsesService.getByQuestion(questionId);
      const responses = response.data || [];

      // Map responses to choices arrays
      const savedChoices = {
        q1Choices: [],
        q2Choices: [],
        q3Choices: [],
        completedCheckpoints: {
          q1: false,
          q2: false,
          q3: false
        }
      };

      responses.forEach(resp => {
        const layerNum = resp.layer_number;
        const optionIds = resp.selected_option_ids || [];
        const isCompleted = !!resp.completed_at;

        if (layerNum === 1) {
          savedChoices.q1Choices = optionIds;
          savedChoices.completedCheckpoints.q1 = isCompleted;
        } else if (layerNum === 2) {
          savedChoices.q2Choices = optionIds;
          savedChoices.completedCheckpoints.q2 = isCompleted;
        } else if (layerNum === 3) {
          savedChoices.q3Choices = optionIds;
          savedChoices.completedCheckpoints.q3 = isCompleted;
        }
      });

      console.log('Loaded saved responses:', savedChoices);
      return savedChoices;
    } catch (error) {
      // 404 is expected if no responses yet
      if (error.response?.status === 404) {
        console.log('No saved responses found');
        return null;
      }
      console.error('Error loading saved responses:', error);
      return null;
    }
  }, [user, questionId]);

  /**
   * Load saved progress for the current question
   * @returns {Object} - Progress object or null
   */
  const loadSavedProgress = useCallback(async () => {
    if (!user) {
      return null;
    }

    try {
      const response = await progressService.getByQuestion(questionId);
      console.log('Loaded saved progress:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No saved progress found');
        return null;
      }
      console.error('Error loading progress:', error);
      return null;
    }
  }, [user, questionId]);

  return {
    saveResponse,
    saveProgress,
    loadSavedResponses,
    loadSavedProgress,
    isAuthenticated: !!user
  };
};

export default useResponseSync;
