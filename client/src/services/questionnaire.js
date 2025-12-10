import api from './api';
import { mockData, useMockData } from './mockData';

// Helper to simulate API response structure
const mockResponse = (data) => Promise.resolve({ data });

// Main question service - fetches the opening screen prompt
export const mainQuestionService = {
  get: () => {
    if (useMockData) {
      return mockResponse(mockData.mainQuestion || { text: 'Welcome to the questionnaire' });
    }
    return api.get('/main-question/');
  }
};

// Questions/Checkpoints service - fetches checkpoint metadata (q1, q2, q3)
export const questionsService = {
  getAll: (params = {}) => {
    if (useMockData) {
      let questions = [...mockData.questions];
      if (params.section) questions = questions.filter(q => q.section === parseInt(params.section));
      if (params.type) questions = questions.filter(q => q.type === params.type);
      return mockResponse(questions);
    }
    return api.get('/questions/', { params });
  },
  getById: (id) => {
    if (useMockData) {
      const question = mockData.questions.find(q => q.id === id);
      return mockResponse(question);
    }
    return api.get(`/questions/${id}/`);
  },
  getBySection: (sectionId) => {
    if (useMockData) {
      const questions = mockData.questions.filter(q => q.section === parseInt(sectionId));
      return mockResponse(questions);
    }
    return api.get(`/questions/section/${sectionId}/`);
  }
};

// Choices service - fetches choices for each checkpoint (q1, q2, q3)
export const choicesService = {
  getByCheckpoint: (checkpointId) => {
    if (useMockData) {
      const checkpoint = mockData.checkpoints?.find(cp => cp.id === checkpointId);
      return mockResponse(checkpoint?.choices || []);
    }
    return api.get(`/choices/${checkpointId}/`);
  },
  getQ1: () => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints?.find(cp => cp.id === 'q1')?.choices || []);
    }
    return api.get('/choices/q1/');
  },
  getQ2: () => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints?.find(cp => cp.id === 'q2')?.choices || []);
    }
    return api.get('/choices/q2/');
  },
  getQ3: () => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints?.find(cp => cp.id === 'q3')?.choices || []);
    }
    return api.get('/choices/q3/');
  }
};

// Checkpoints service - alias for questions in Django backend context
export const checkpointsService = {
  getAll: (params = {}) => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints);
    }
    return api.get('/questions/', { params });
  },
  getById: (id) => {
    if (useMockData) {
      const checkpoint = mockData.checkpoints.find(cp => cp.id === id);
      return mockResponse(checkpoint);
    }
    return api.get(`/questions/${id}/`);
  }
};

// Responses service - manages user answer submissions
export const responsesService = {
  getAll: (params = {}) => {
    if (useMockData) {
      return mockResponse([]);
    }
    return api.get('/responses/', { params });
  },
  save: (data) => {
    if (useMockData) {
      return mockResponse({ success: true, data });
    }
    return api.post('/responses/', data);
  },
  getSummary: (userId) => {
    if (useMockData) {
      return mockResponse({ responses: [], summary: {} });
    }
    // Note: This endpoint may need to be added to Django backend
    return api.get(`/responses/summary/${userId}/`);
  }
};

// Team service - fetches team member data
export const teamService = {
  getAll: () => {
    if (useMockData) {
      return mockResponse(mockData.team);
    }
    return api.get('/team/');
  }
};

// Users service - kept for backward compatibility
export const usersService = {
  getTeam: () => {
    if (useMockData) {
      return mockResponse(mockData.team);
    }
    return api.get('/team/');
  },
  getSections: () => {
    if (useMockData) {
      return mockResponse(mockData.sections);
    }
    // Note: Sections endpoint may need to be added to Django backend
    // For now, returning from questions data or mock
    return api.get('/sections/');
  }
};

// Health check service
export const healthService = {
  check: () => {
    if (useMockData) {
      return mockResponse({ status: 'ok' });
    }
    return api.get('/health/');
  }
};
