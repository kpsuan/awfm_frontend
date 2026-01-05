import api from './api';

// File size limits (in bytes)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024;  // 50MB

export const recordingsService = {
  /**
   * Validate file size before upload
   */
  validateFileSize: (file, recordingType) => {
    const maxSize = recordingType === 'video' ? MAX_VIDEO_SIZE : MAX_AUDIO_SIZE;
    const maxMB = maxSize / (1024 * 1024);
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${maxMB}MB.`);
    }
    return true;
  },
  /**
   * Upload a video or audio recording to Cloudinary
   * @param {File|Blob} file - The media file to upload
   * @param {string} recordingType - 'video' or 'audio'
   * @param {string} questionId - The question UUID this recording is for
   * @param {string} teamId - Optional team UUID
   * @param {string} description - Optional description
   */
  uploadRecording: async (file, recordingType, questionId, teamId = null, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recording_type', recordingType);
    formData.append('question_id', questionId);
    if (teamId) {
      formData.append('team_id', teamId);
    }
    if (description) {
      formData.append('description', description);
    }

    // Don't set Content-Type header - let browser set it with boundary for FormData
    const response = await api.post('/v1/user/recordings/upload/', formData);
    return response;
  },

  /**
   * Create a text recording (no file upload)
   * @param {string} textContent - The text content
   * @param {string} questionId - The question UUID
   * @param {string} teamId - Optional team UUID
   * @param {string} description - Optional description
   */
  createTextRecording: async (textContent, questionId, teamId = null, description = '') => {
    const response = await api.post('/v1/user/recordings/text/', {
      text_content: textContent,
      question_id: questionId,
      team_id: teamId,
      description,
    });
    return response;
  },

  /**
   * Get all recordings (filtered by visibility)
   */
  getRecordings: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.teamId) queryParams.append('team_id', params.teamId);
    if (params.questionId) queryParams.append('question_id', params.questionId);
    if (params.userId) queryParams.append('user_id', params.userId);

    const queryString = queryParams.toString();
    const url = queryString ? `/v1/user/recordings/?${queryString}` : '/v1/user/recordings/';
    const response = await api.get(url);
    return response;
  },

  /**
   * Get a single recording by ID
   */
  getRecording: async (recordingId) => {
    const response = await api.get(`/v1/user/recordings/${recordingId}/`);
    return response;
  },

  /**
   * Get current user's recordings
   */
  getMyRecordings: async () => {
    const response = await api.get('/v1/user/recordings/my-recordings/');
    return response;
  },

  /**
   * Get recordings for a specific team
   */
  getTeamRecordings: async (teamId) => {
    const response = await api.get(`/v1/user/recordings/team/${teamId}/`);
    return response;
  },

  /**
   * Toggle like on a recording
   */
  toggleLike: async (recordingId) => {
    const response = await api.post(`/v1/user/recordings/${recordingId}/like/`);
    return response;
  },

  /**
   * Toggle affirmation on a recording
   */
  toggleAffirmation: async (recordingId) => {
    const response = await api.post(`/v1/user/recordings/${recordingId}/affirm/`);
    return response;
  },

  /**
   * Get comments for a recording
   */
  getComments: async (recordingId) => {
    const response = await api.get(`/v1/user/recordings/${recordingId}/comments/`);
    return response;
  },

  /**
   * Add a comment to a recording
   */
  addComment: async (recordingId, text) => {
    const response = await api.post(`/v1/user/recordings/${recordingId}/comments/`, {
      text,
    });
    return response;
  },

  /**
   * Delete a recording
   */
  deleteRecording: async (recordingId) => {
    const response = await api.delete(`/v1/user/recordings/${recordingId}/`);
    return response;
  },

  /**
   * Update recording visibility
   */
  updateRecording: async (recordingId, data) => {
    const response = await api.patch(`/v1/user/recordings/${recordingId}/`, data);
    return response;
  },
};
