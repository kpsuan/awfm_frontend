import { useCallback, useEffect, useState } from 'react';
import { useResponseSync } from './useResponseSync';

/**
 * Hook for syncing choices between frontend (local IDs) and backend (UUIDs)
 * Handles the ID conversion and persistence logic
 * @param {string} questionId - The question ID
 * @param {Object} choices - Choices data object { q1, q2, q3 }
 * @param {Object} flowState - Flow state with setters and choices
 */
export const useChoicesSync = (questionId, choices, flowState) => {
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  const {
    saveResponse: saveResponseToBackend,
    loadSavedResponses,
    isAuthenticated
  } = useResponseSync(questionId);

  const {
    q1Choices, q2Choices, q3Choices,
    setQ1Choices, setQ2Choices, setQ3Choices,
    setCompletedCheckpoints,
    handleContinue
  } = flowState;

  /**
   * Convert local IDs to UUIDs for backend
   */
  const convertToUuids = useCallback((localIds, choicesData) => {
    return localIds.map(localId => {
      const choice = choicesData?.find(c => c.id === localId);
      return choice?.uuid || localId;
    }).filter(Boolean);
  }, []);

  /**
   * Convert UUIDs from backend to local IDs
   */
  const convertToLocalIds = useCallback((uuids, choicesData, layerNum) => {
    return uuids.map(uuid => {
      const choice = choicesData?.find(c => c.uuid === uuid);
      return choice?.id || `q${layerNum}_${uuid}`;
    });
  }, []);

  /**
   * Save response to backend and continue to next phase
   */
  const handleConfirmAndSave = useCallback(async (layerNumber, selectedChoices) => {
    if (isAuthenticated && selectedChoices.length > 0) {
      const choicesData = layerNumber === 1 ? choices.q1 :
                          layerNumber === 2 ? choices.q2 : choices.q3;

      const optionUuids = convertToUuids(selectedChoices, choicesData);

      try {
        await saveResponseToBackend(layerNumber, optionUuids, true);
        console.log(`Saved L${layerNumber} response to backend`);
      } catch (error) {
        console.error(`Failed to save L${layerNumber} response:`, error);
        // Continue anyway - localStorage is the fallback
      }
    }
    handleContinue();
  }, [isAuthenticated, choices, convertToUuids, saveResponseToBackend, handleContinue]);

  /**
   * Load saved responses from backend when authenticated and data is ready
   */
  useEffect(() => {
    const loadResponses = async () => {
      if (!isAuthenticated || !choices.q1 || !choices.q2 || !choices.q3) return;

      setIsLoadingResponses(true);
      try {
        const savedData = await loadSavedResponses();
        if (savedData) {
          // Only update if we have saved data and local state is empty
          if (savedData.q1Choices.length > 0 && q1Choices.length === 0) {
            const localIds = convertToLocalIds(savedData.q1Choices, choices.q1, 1);
            setQ1Choices(localIds);
          }
          if (savedData.q2Choices.length > 0 && q2Choices.length === 0) {
            const localIds = convertToLocalIds(savedData.q2Choices, choices.q2, 2);
            setQ2Choices(localIds);
          }
          if (savedData.q3Choices.length > 0 && q3Choices.length === 0) {
            const localIds = convertToLocalIds(savedData.q3Choices, choices.q3, 3);
            setQ3Choices(localIds);
          }
          // Update completed checkpoints from backend data
          if (savedData.completedCheckpoints) {
            setCompletedCheckpoints(prev => ({
              q1: savedData.completedCheckpoints.q1 || prev.q1,
              q2: savedData.completedCheckpoints.q2 || prev.q2,
              q3: savedData.completedCheckpoints.q3 || prev.q3
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load saved responses:', error);
      } finally {
        setIsLoadingResponses(false);
      }
    };

    loadResponses();
  }, [isAuthenticated, questionId, choices.q1, choices.q2, choices.q3]);

  return {
    handleConfirmAndSave,
    isLoadingResponses,
    isAuthenticated,
    convertToUuids,
    convertToLocalIds
  };
};

export default useChoicesSync;
