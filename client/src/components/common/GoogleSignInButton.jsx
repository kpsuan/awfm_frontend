import React, { useEffect, useCallback } from 'react';

/**
 * Google Sign-In Button Component
 *
 * Uses Google Identity Services (GIS) for OAuth 2.0 authentication.
 *
 * Required: Add the Google Client ID to your .env file:
 * REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
 *
 * Required: Add this script to your index.html:
 * <script src="https://accounts.google.com/gsi/client" async defer></script>
 */
const GoogleSignInButton = ({ onSuccess, onError, disabled = false, text = 'Sign in with Google' }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      // The response contains the ID token
      // For our backend, we need to exchange this for user info
      // We'll use the credential (ID token) to get an access token
      if (response.credential) {
        // Decode the JWT to get basic user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));

        // Call the success callback with the credential
        // The parent component will handle the API call
        onSuccess({
          id_token: response.credential,
          access_token: response.credential, // GIS uses credential as the token
          user: {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          }
        });
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      onError?.(error.message || 'Google Sign-In failed');
    }
  }, [onSuccess, onError]);

  useEffect(() => {
    // Initialize Google Identity Services
    if (window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        }
      );
    }
  }, [clientId, handleCredentialResponse]);

  // If no client ID, show a placeholder
  if (!clientId) {
    return (
      <button
        type="button"
        className="google-signin-button google-signin-button--disabled"
        disabled
        title="Google Sign-In not configured"
      >
        <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{text} (Not configured)</span>
      </button>
    );
  }

  return (
    <div className="google-signin-container">
      <div id="google-signin-button" className={disabled ? 'google-signin-button--disabled' : ''}></div>
    </div>
  );
};

export default GoogleSignInButton;
