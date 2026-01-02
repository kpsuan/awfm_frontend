import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/',
  headers: { 'Content-Type': 'application/json' }
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const authTokens = localStorage.getItem('authTokens');
    if (authTokens) {
      const { access } = JSON.parse(authTokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    let message = 'Something went wrong';

    if (data) {
      // Check for custom 'error' key
      if (data.error) {
        message = data.error;
      }
      // Check for DRF 'detail' key
      else if (data.detail) {
        message = data.detail;
      }
      // Check for DRF 'non_field_errors'
      else if (data.non_field_errors) {
        message = Array.isArray(data.non_field_errors)
          ? data.non_field_errors[0]
          : data.non_field_errors;
      }
      // Check for DRF field validation errors (e.g., {email: ["error"]})
      else if (typeof data === 'object') {
        const fieldErrors = Object.entries(data)
          .filter(([, value]) => Array.isArray(value) || typeof value === 'string')
          .map(([field, errors]) => {
            const errorMsg = Array.isArray(errors) ? errors[0] : errors;
            // Capitalize field name and format message
            const fieldName = field.replace(/_/g, ' ');
            const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            // If error already mentions the field, just return it
            if (errorMsg.toLowerCase().includes(field.toLowerCase())) {
              return errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1);
            }
            return `${capitalizedField}: ${errorMsg}`;
          });
        if (fieldErrors.length > 0) {
          message = fieldErrors.join('. ');
        }
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
