import api from './api';
import { mockData, useMockData, mainScreenQuestion, questionData, q1ChoicesData, q2ChoicesData, q3ChoicesData } from './mockData';
import { transformQuestionData, transformPPRPatterns } from './dataTransform';

// Helper to simulate API response structure
const mockResponse = (data) => Promise.resolve({ data });

// Cache for transformed question data (per question)
let questionDataCache = {};

// Clear the cache (useful when data is updated in Django Admin)
export const clearQuestionCache = (questionId = null) => {
  if (questionId) {
    delete questionDataCache[questionId];
  } else {
    questionDataCache = {};
  }
  console.log('Question cache cleared:', questionId || 'all');
};

// Main question service - fetches the opening screen prompt
export const mainQuestionService = {
  get: async (questionId = 'Q10A') => {
    if (useMockData) {
      return mockResponse(mainScreenQuestion);
    }
    // Fetch question data and return main screen question
    const response = await api.get(`/v1/content/questions/${questionId}/`);
    const transformed = transformQuestionData(response);
    questionDataCache[questionId] = transformed;
    return { data: transformed.mainScreenQuestion };
  }
};

// Questions/Checkpoints service - fetches checkpoint metadata (q1, q2, q3)
export const questionsService = {
  getAll: async (params = {}) => {
    if (useMockData) {
      let questions = [...mockData.questions];
      if (params.section) questions = questions.filter(q => q.section === parseInt(params.section));
      if (params.type) questions = questions.filter(q => q.type === params.type);
      return mockResponse(questions);
    }
    // Fetch from Django and transform
    const response = await api.get('/v1/content/questions/');
    return { data: response };
  },
  getById: async (id) => {
    if (useMockData) {
      const question = mockData.questions.find(q => q.id === id);
      return mockResponse(question);
    }
    const response = await api.get(`/v1/content/questions/${id}/`);
    return { data: response };
  },
  getBySection: async (sectionId) => {
    if (useMockData) {
      const questions = mockData.questions.filter(q => q.section === parseInt(sectionId));
      return mockResponse(questions);
    }
    const response = await api.get(`/v1/content/questions/`);
    return { data: response };
  },
  // Get question metadata for specific checkpoint
  getQuestionData: async (questionId, checkpointKey) => {
    if (useMockData) {
      return mockResponse(questionData[checkpointKey]);
    }
    // Use cached data or fetch
    if (!questionDataCache[questionId]) {
      const response = await api.get(`/v1/content/questions/${questionId}/`);
      questionDataCache[questionId] = transformQuestionData(response);
    }
    return { data: questionDataCache[questionId].questionData[checkpointKey] };
  }
};

// Choices service - fetches choices for each checkpoint (q1, q2, q3)
export const choicesService = {
  getByCheckpoint: async (questionId, checkpointId) => {
    if (useMockData) {
      const checkpoint = mockData.checkpoints?.find(cp => cp.id === checkpointId);
      return mockResponse(checkpoint?.choices || []);
    }
    // Use cached data or fetch
    if (!questionDataCache[questionId]) {
      const response = await api.get(`/v1/content/questions/${questionId}/`);
      questionDataCache[questionId] = transformQuestionData(response);
    }
    return { data: questionDataCache[questionId].choicesData[checkpointId] || [] };
  },
  getQ1: async (questionId = 'Q10A') => {
    if (useMockData) {
      return mockResponse(q1ChoicesData);
    }
    // Use cached data or fetch
    if (!questionDataCache[questionId]) {
      const response = await api.get(`/v1/content/questions/${questionId}/`);
      questionDataCache[questionId] = transformQuestionData(response);
    }
    return { data: questionDataCache[questionId].choicesData.q1 || [] };
  },
  getQ2: async (questionId = 'Q10A') => {
    if (useMockData) {
      return mockResponse(q2ChoicesData);
    }
    // Use cached data or fetch
    if (!questionDataCache[questionId]) {
      const response = await api.get(`/v1/content/questions/${questionId}/`);
      questionDataCache[questionId] = transformQuestionData(response);
    }
    return { data: questionDataCache[questionId].choicesData.q2 || [] };
  },
  getQ3: async (questionId = 'Q10A') => {
    if (useMockData) {
      return mockResponse(q3ChoicesData);
    }
    // Use cached data or fetch
    if (!questionDataCache[questionId]) {
      const response = await api.get(`/v1/content/questions/${questionId}/`);
      questionDataCache[questionId] = transformQuestionData(response);
    }
    return { data: questionDataCache[questionId].choicesData.q3 || [] };
  }
};

// Checkpoints service - alias for questions in Django backend context
export const checkpointsService = {
  getAll: async (params = {}) => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints);
    }
    const response = await api.get('/checkpoints/', { params });
    return { data: response };
  },
  getById: async (id) => {
    if (useMockData) {
      const checkpoint = mockData.checkpoints.find(cp => cp.id === id);
      return mockResponse(checkpoint);
    }
    const response = await api.get(`/checkpoints/${id}/`);
    return { data: response };
  }
};

// PPR service - fetches Personal Pattern Recognition data
export const pprService = {
  getByQuestion: async (questionId) => {
    if (useMockData) {
      return mockResponse([]);
    }
    const response = await api.get(`/v1/content/questions/${questionId}/ppr-patterns/`);
    return { data: transformPPRPatterns(response) };
  }
};

// Responses service - manages user answer submissions
export const responsesService = {
  getAll: async (params = {}) => {
    if (useMockData) {
      return mockResponse([]);
    }
    const response = await api.get('/v1/user/responses/', { params });
    return { data: response };
  },
  getByQuestion: async (questionId) => {
    if (useMockData) {
      return mockResponse([]);
    }
    const response = await api.get(`/v1/user/responses/by-question/${questionId}/`);
    return { data: response };
  },
  save: async (data) => {
    if (useMockData) {
      return mockResponse({ success: true, data });
    }
    // Save single response
    const response = await api.post('/v1/user/responses/', data);
    return { data: response };
  },
  bulkSave: async (responses) => {
    if (useMockData) {
      return mockResponse({ created: responses.length, responses });
    }
    // Bulk save multiple responses (for localStorage sync)
    const response = await api.post('/v1/user/responses/bulk_save/', { responses });
    return { data: response };
  },
  getSummary: async () => {
    if (useMockData) {
      return mockResponse({ responses: [], summary: {} });
    }
    const response = await api.get('/v1/user/responses/summary/');
    return { data: response };
  }
};

// Progress service - manages user questionnaire progress
export const progressService = {
  getAll: async (params = {}) => {
    if (useMockData) {
      return mockResponse([]);
    }
    const response = await api.get('/v1/user/progress/', { params });
    return { data: response };
  },
  getByQuestion: async (questionId) => {
    if (useMockData) {
      return mockResponse(null);
    }
    const response = await api.get(`/v1/user/progress/by-question/${questionId}/`);
    return { data: response };
  },
  save: async (data) => {
    if (useMockData) {
      return mockResponse({ success: true, data });
    }
    // Save progress (creates or updates)
    const response = await api.post('/v1/user/progress/', data);
    return { data: response };
  }
};

// Team service - fetches team member data
export const teamService = {
  getAll: async () => {
    if (useMockData) {
      return mockResponse(mockData.team);
    }
    // TODO: Implement team endpoint in Django backend
    return mockResponse(mockData.team);
  }
};

// Users service - kept for backward compatibility
export const usersService = {
  getTeam: async () => {
    if (useMockData) {
      return mockResponse(mockData.team);
    }
    // TODO: Implement team endpoint in Django backend
    return mockResponse(mockData.team);
  },
  getSections: async () => {
    if (useMockData) {
      return mockResponse(mockData.sections);
    }
    // TODO: Implement sections endpoint in Django backend
    return mockResponse(mockData.sections);
  }
};

// Health check service
export const healthService = {
  check: async () => {
    if (useMockData) {
      return mockResponse({ status: 'ok' });
    }
    // Django doesn't have health endpoint by default, just check API root
    const response = await api.get('/v1/content/questions/');
    return { data: { status: 'ok' } };
  }
};
