import api from './api';
import { mockData, useMockData } from './mockData';

// Helper to simulate API response structure
const mockResponse = (data) => Promise.resolve({ data });

export const questionsService = {
  getAll: (params = {}) => {
    if (useMockData) {
      let questions = [...mockData.questions];
      if (params.section) questions = questions.filter(q => q.section === parseInt(params.section));
      if (params.type) questions = questions.filter(q => q.type === params.type);
      return mockResponse(questions);
    }
    return api.get('/questions', { params });
  },
  getById: (id) => {
    if (useMockData) {
      const question = mockData.questions.find(q => q.id === id);
      return mockResponse(question);
    }
    return api.get(`/questions/${id}`);
  },
  getBySection: (sectionId) => {
    if (useMockData) {
      const questions = mockData.questions.filter(q => q.section === parseInt(sectionId));
      return mockResponse(questions);
    }
    return api.get(`/questions/section/${sectionId}`);
  }
};

export const checkpointsService = {
  getAll: (params = {}) => {
    if (useMockData) {
      return mockResponse(mockData.checkpoints);
    }
    return api.get('/checkpoints', { params });
  },
  getById: (id) => {
    if (useMockData) {
      const checkpoint = mockData.checkpoints.find(cp => cp.id === id);
      return mockResponse(checkpoint);
    }
    return api.get(`/checkpoints/${id}`);
  }
};

export const responsesService = {
  getAll: (params = {}) => {
    if (useMockData) {
      return mockResponse([]);
    }
    return api.get('/responses', { params });
  },
  save: (data) => {
    if (useMockData) {
      // Just return success, data is stored in local state
      return mockResponse({ success: true, data });
    }
    return api.post('/responses', data);
  },
  getSummary: (userId) => {
    if (useMockData) {
      return mockResponse({ responses: [], summary: {} });
    }
    return api.get(`/responses/summary/${userId}`);
  }
};

export const usersService = {
  getTeam: () => {
    if (useMockData) {
      return mockResponse(mockData.team);
    }
    return api.get('/users/team');
  },
  getSections: () => {
    if (useMockData) {
      return mockResponse(mockData.sections);
    }
    return api.get('/users/sections');
  }
};
