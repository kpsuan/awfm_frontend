import React, { createContext, useContext, useReducer } from 'react';

/**
 * QuestionnaireContext - UI State Management
 *
 * Handles local UI state only (navigation, selections, etc.)
 * Server state (questions, checkpoints, choices) managed by React Query
 */

const initialState = {
  // Navigation state
  currentQuestion: null,
  currentSection: 1,
  currentCheckpoint: 1,

  // User selections (local state before saving to server)
  responses: {},

  // UI state
  loading: false,
  error: null,
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_CURRENT_SECTION: 'SET_CURRENT_SECTION',
  SET_CURRENT_CHECKPOINT: 'SET_CURRENT_CHECKPOINT',
  SET_RESPONSE: 'SET_RESPONSE',
  CLEAR_RESPONSES: 'CLEAR_RESPONSES',
};

function questionnaireReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestion: action.payload };
    case ACTIONS.SET_CURRENT_SECTION:
      return { ...state, currentSection: action.payload };
    case ACTIONS.SET_CURRENT_CHECKPOINT:
      return { ...state, currentCheckpoint: action.payload };
    case ACTIONS.SET_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.questionId]: action.payload.value
        }
      };
    case ACTIONS.CLEAR_RESPONSES:
      return { ...state, responses: {} };
    default:
      return state;
  }
}

const QuestionnaireContext = createContext(null);

export function QuestionnaireProvider({ children }) {
  const [state, dispatch] = useReducer(questionnaireReducer, initialState);

  const actions = {
    // Navigation actions
    setCurrentQuestion: (question) =>
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: question }),

    setCurrentSection: (sectionId) =>
      dispatch({ type: ACTIONS.SET_CURRENT_SECTION, payload: sectionId }),

    setCurrentCheckpoint: (checkpointNum) =>
      dispatch({ type: ACTIONS.SET_CURRENT_CHECKPOINT, payload: checkpointNum }),

    // Response management
    saveResponse: (questionId, value) => {
      dispatch({ type: ACTIONS.SET_RESPONSE, payload: { questionId, value }});
      // TODO: Persist to server via mutation
      console.log('Response saved locally:', { questionId, value });
    },

    clearResponses: () =>
      dispatch({ type: ACTIONS.CLEAR_RESPONSES }),

    // Loading/error state
    setLoading: (loading) =>
      dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),

    setError: (error) =>
      dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
  };

  return (
    <QuestionnaireContext.Provider value={{ state, ...actions }}>
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}
