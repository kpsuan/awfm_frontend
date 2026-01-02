import api from './api';

export const authService = {
  // Register new user
  register: async (email, password, displayName, isHcw = false) => {
    const response = await api.post('/v1/auth/register/', {
      email,
      password,
      password2: password,
      display_name: displayName,
      is_hcw: isHcw
    });
    return response;
  },

  // Login
  login: async (email, password) => {
    const response = await api.post('/v1/auth/login/', {
      email,
      password
    });
    return response;
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      await api.post('/v1/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await api.post('/v1/auth/token/refresh/', {
      refresh: refreshToken
    });
    return response;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/v1/auth/profile/');
    return response;
  },

  // Verify email with 6-digit code
  verifyEmail: async (code) => {
    const response = await api.post('/v1/auth/verify-email/', { code });
    return response;
  },

  // Resend verification email
  resendVerification: async () => {
    const response = await api.post('/v1/auth/resend-verification/');
    return response;
  },

  // Request password reset (forgot password)
  forgotPassword: async (email) => {
    const response = await api.post('/v1/auth/forgot-password/', { email });
    return response;
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/v1/auth/reset-password/', {
      token,
      new_password: newPassword,
      new_password2: newPassword
    });
    return response;
  },

  // Request password change code (for logged in users)
  requestPasswordChangeCode: async () => {
    const response = await api.post('/v1/auth/request-password-change-code/');
    return response;
  },

  // Change password with verification code
  changePassword: async (verificationCode, oldPassword, newPassword) => {
    const response = await api.post('/v1/auth/change-password/', {
      verification_code: verificationCode,
      old_password: oldPassword,
      new_password: newPassword,
      new_password2: newPassword
    });
    return response;
  },

  // Delete account
  deleteAccount: async (password) => {
    const response = await api.post('/v1/auth/delete-account/', { password });
    return response;
  },

  // Google OAuth - exchange Google token for JWT
  googleAuth: async (accessToken, idToken = null) => {
    const response = await api.post('/v1/auth/google/', {
      access_token: accessToken,
      id_token: idToken
    });
    return response;
  },

  // Request account restoration code (for deleted accounts)
  requestRestoreCode: async (email) => {
    const response = await api.post('/v1/auth/request-restore/', { email });
    return response;
  },

  // Restore account with verification code
  restoreAccount: async (email, code) => {
    const response = await api.post('/v1/auth/restore-account/', {
      email,
      code
    });
    return response;
  }
};
