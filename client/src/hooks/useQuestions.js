/**
 * Custom React Query hooks for fetching question data
 * Handles server state for questions, checkpoints, and choices
 */

import { useQuery } from '@tanstack/react-query';
import {
  questionsService,
  choicesService,
  mainQuestionService,
  pprService
} from '../services';

/**
 * Fetch main screen question for a specific question ID
 */
export function useMainQuestion(questionId = 'Q10A') {
  return useQuery({
    queryKey: ['mainQuestion', questionId],
    queryFn: async () => {
      const response = await mainQuestionService.get(questionId);
      return response.data;
    },
    enabled: !!questionId,
  });
}

/**
 * Fetch all questions
 */
export function useQuestions(params = {}) {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: async () => {
      const response = await questionsService.getAll(params);
      return response.data;
    },
  });
}

/**
 * Fetch specific question by ID
 */
export function useQuestion(id) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: async () => {
      const response = await questionsService.getById(id);
      return response.data;
    },
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Fetch question metadata for a checkpoint
 */
export function useQuestionData(questionId, checkpointKey) {
  return useQuery({
    queryKey: ['questionData', questionId, checkpointKey],
    queryFn: async () => {
      const response = await questionsService.getQuestionData(questionId, checkpointKey);
      return response.data;
    },
    enabled: !!questionId && !!checkpointKey,
  });
}

/**
 * Fetch choices for Checkpoint 1
 */
export function useQ1Choices(questionId = 'Q10A') {
  return useQuery({
    queryKey: ['choices', questionId, 'q1'],
    queryFn: async () => {
      const response = await choicesService.getQ1(questionId);
      return response.data;
    },
    enabled: !!questionId,
  });
}

/**
 * Fetch choices for Checkpoint 2
 */
export function useQ2Choices(questionId = 'Q10A') {
  return useQuery({
    queryKey: ['choices', questionId, 'q2'],
    queryFn: async () => {
      const response = await choicesService.getQ2(questionId);
      return response.data;
    },
    enabled: !!questionId,
  });
}

/**
 * Fetch choices for Checkpoint 3
 */
export function useQ3Choices(questionId = 'Q10A') {
  return useQuery({
    queryKey: ['choices', questionId, 'q3'],
    queryFn: async () => {
      const response = await choicesService.getQ3(questionId);
      return response.data;
    },
    enabled: !!questionId,
  });
}

/**
 * Fetch choices for any checkpoint by ID
 */
export function useChoices(checkpointId) {
  return useQuery({
    queryKey: ['choices', checkpointId],
    queryFn: async () => {
      const response = await choicesService.getByCheckpoint(checkpointId);
      return response.data;
    },
    enabled: !!checkpointId,
  });
}

/**
 * Fetch PPR patterns for a question
 */
export function usePPRPatterns(questionId) {
  return useQuery({
    queryKey: ['ppr', questionId],
    queryFn: async () => {
      const response = await pprService.getByQuestion(questionId);
      return response.data;
    },
    enabled: !!questionId,
  });
}
