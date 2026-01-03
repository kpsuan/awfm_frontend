import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMainQuestion, useQ1Choices, useQ2Choices, useQ3Choices, useQuestionData, usePPRPatterns } from '../../../hooks';
import { clearQuestionCache } from '../../../services';

/**
 * Consolidated hook for fetching all questionnaire data
 * Combines 8 separate data fetching hooks into one clean interface
 * @param {string} questionId - The question ID to fetch data for
 */
export const useQuestionnaireData = (questionId) => {
  const queryClient = useQueryClient();

  // Clear caches when questionId changes
  useEffect(() => {
    clearQuestionCache(questionId);
    queryClient.invalidateQueries({ queryKey: ['mainQuestion', questionId] });
    queryClient.invalidateQueries({ queryKey: ['choices', questionId] });
    queryClient.invalidateQueries({ queryKey: ['questionData', questionId] });
  }, [questionId, queryClient]);

  // Fetch all data
  const { data: mainScreenQuestion, isLoading: loadingMain, error: errorMain } = useMainQuestion(questionId);
  const { data: q1ChoicesData, isLoading: loadingQ1, error: errorQ1 } = useQ1Choices(questionId);
  const { data: q2ChoicesData, isLoading: loadingQ2, error: errorQ2 } = useQ2Choices(questionId);
  const { data: q3ChoicesData, isLoading: loadingQ3, error: errorQ3 } = useQ3Choices(questionId);
  const { data: q1QuestionData, isLoading: loadingQ1Meta } = useQuestionData(questionId, 'q1');
  const { data: q2QuestionData, isLoading: loadingQ2Meta } = useQuestionData(questionId, 'q2');
  const { data: q3QuestionData, isLoading: loadingQ3Meta } = useQuestionData(questionId, 'q3');
  const { data: pprPatterns, isLoading: loadingPPR } = usePPRPatterns(questionId);

  // Combine loading states
  const isLoading = loadingMain || loadingQ1 || loadingQ2 || loadingQ3 ||
                    loadingQ1Meta || loadingQ2Meta || loadingQ3Meta || loadingPPR;

  // Combine errors
  const error = errorMain || errorQ1 || errorQ2 || errorQ3;

  // Check if all required data is loaded
  const isReady = mainScreenQuestion && q1ChoicesData && q2ChoicesData &&
                  q3ChoicesData && q1QuestionData && q2QuestionData && q3QuestionData;

  return {
    // Main question data
    mainScreenQuestion,

    // Choices data by layer
    choices: {
      q1: q1ChoicesData,
      q2: q2ChoicesData,
      q3: q3ChoicesData
    },

    // Question metadata by layer
    questionData: {
      q1: q1QuestionData,
      q2: q2QuestionData,
      q3: q3QuestionData
    },

    // PPR patterns
    pprPatterns,

    // Loading/error states
    isLoading,
    isReady,
    error
  };
};

export default useQuestionnaireData;
