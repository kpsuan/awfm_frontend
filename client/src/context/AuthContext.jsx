import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { responsesService } from '../services/questionnaire';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(() => {
    // Load tokens from localStorage on init
    const savedTokens = localStorage.getItem('authTokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });

  // Save tokens to localStorage whenever they change
  useEffect(() => {
    if (tokens) {
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    } else {
      localStorage.removeItem('authTokens');
    }
  }, [tokens]);

  // Load user profile on mount if tokens exist
  useEffect(() => {
    const loadUser = async () => {
      if (tokens?.access) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          setTokens(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Sync localStorage questionnaire data to backend
  const syncLocalStorageData = async () => {
    try {
      const localData = localStorage.getItem('awfm_questionnaire_progress');
      if (localData) {
        const progressData = JSON.parse(localData);

        // Convert localStorage format to backend format
        // Note: This assumes localStorage stores responses in a specific format
        // You may need to adjust this based on your actual localStorage structure
        if (progressData.responses && Object.keys(progressData.responses).length > 0) {
          const responses = Object.entries(progressData.responses).map(([key, value]) => ({
            question: progressData.questionId || 'Q10A',
            checkpoint_number_input: parseInt(key.replace('q', '')),
            selected_option_ids: Array.isArray(value) ? value : [value],
          }));

          // Bulk save to backend
          await responsesService.bulkSave(responses);

          // Clear localStorage after successful sync
          localStorage.removeItem('awfm_questionnaire_progress');
          console.log('Successfully synced localStorage data to backend');
        }
      }
    } catch (error) {
      console.error('Failed to sync localStorage data:', error);
      // Don't fail the login/register if sync fails
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setTokens(data.tokens);
    setUser(data.user);

    // Sync any localStorage data to backend
    await syncLocalStorageData();

    return data;
  };

  const register = async (email, password, displayName, isHcw) => {
    const data = await authService.register(email, password, displayName, isHcw);
    setTokens(data.tokens);
    setUser(data.user);

    // Sync any localStorage data to backend
    await syncLocalStorageData();

    return data;
  };

  const logout = async () => {
    if (tokens?.refresh) {
      await authService.logout(tokens.refresh);
    }
    setTokens(null);
    setUser(null);
  };

  const loginWithGoogle = async (accessToken, idToken) => {
    const data = await authService.googleAuth(accessToken, idToken);
    setTokens(data.tokens);
    setUser(data.user);

    // Sync any localStorage data to backend
    await syncLocalStorageData();

    return data;
  };

  return (
    <AuthContext.Provider value={{ user, tokens, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};